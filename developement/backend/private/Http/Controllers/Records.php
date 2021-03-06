<?php

namespace App\Http\Controllers;

use App\Database\Queries\Record;
use App\Database\Queries\Examination;
use App\Middleware\Orcaapi;
use App\Middleware\Websocket;
use stdClass;

class Records {

    public function all($req, $res) {

        $id = $req->params;

        $db_query = new Record;

        $query = $db_query->all($id);

        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $res->data = $query->data;
        $res->success = true;

    }

    public function get($req, $res) {

        $db_query = new Record;

        $query = $db_query->get($req->itemId);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        if(!$query->data[0]['content_koui']) {
            $res->data->koui = '[]';
        } else {
            $res->data->koui = $query->data[0]['content_koui'];
        }
        $res->data->soap = $query->data[0]['content_soap'];
        $res->data->health_check = null;

        // For Healthchecks
        if ($query->data[0]['type'] === 6) {    
            if ($query->data[0]['content_koui']) {
                $koui_array = json_decode($res->data->koui, true);
                foreach ($koui_array as $value) {
                    if ($value['type'] === '90') {
                        $res->data->health_check = $value;
                    break;
                    }
                }
            }
        
        }

        $res->success = true;
    }

    public function update($req, $res) {
        //Since can only have one put, switch based on mode. Tried to unify as much as possible.

        $date = date("Y-m-d H:i:s");
        $meta = $req->update[0]->meta;
        $request_data = (object) [
            'id' => $req->itemId,
            'date' => $date,
            'soap' => $req->update[0]->soapData,
            'koui' => $req->update[0]->kouiData,
            'has_order' => isset($req->update[0]->hasOrder) ? $req->update[0]->hasOrder : NULL,
            'locked' => $req->update[0]->mode === 'save' ? 1 : 0,
            'status' => $req->update[0]->status,
            'doctor' => $meta->doctor
        ];

        // Closing
        if ($req->update[0]->mode === 'close') {

            $koui_array = json_decode($req->update[0]->kouiData);
            $orca_data = (object) [
                'koui' => [],
                'insuranceSet' => $meta->ins,
                'doctor' => sprintf('%04d', $meta->doctor),
                'date' => date("Y-m-d"),
                'jihi'  => $meta->ins === '0001' ? true : false,
                'patient_id' => $meta->patientID,
                'is_holiday' => $meta->isHoliday
            ];

            foreach ($koui_array as $value) {
                if (!$value->noCalc){
                    array_push($orca_data->koui, $value);
                }
            }
            
            $orca = new Orcaapi();
            $orca_result = $orca->register_koui($orca_data);
            
            if(!$orca_result->ok) {
                $res->message = $orca_result->msg;
                return;    
            }

            // Insert Kensa Results
            $exam_items = array_filter($koui_array, function ($item) {
                return $item->type === '60';
            });

            foreach($exam_items as $key=>$value) {

                $value->encounter_id = $request_data->id;
                $value->patient_id = $meta->patientID;

                $exam = new Examination();
                $exam_results = $exam->post($value);   
                if (!$exam_results->ok) {
                    $res->message = $exam_results->msg;
                    return;
                }
            }
        }

        //Health Checks
        if ($req->update[0]->mode === 'healthcheck') {
            
            $db = new Record();
            $query = $db->get($req->itemId);
            if (!$query->ok) {
                $res->message = $query->msg;
                return;
            }
            $db_koui = $query->data[0]['content_koui'];
            $db_koui = json_decode($db_koui, true);

            $existing = false;
            if ($db_koui) {
                foreach ($db_koui as $key => $value) {
                    if ($value['type'] === '90') {
                        $existing = true;
                        $existing_key = $key;
                    break;
                    }
                }
            }
            if ($existing) {
                $db_koui[$existing_key]['var'] = $req->update[0]->kouiData;
            } else {

                $db_koui = [[
                    'tag' => 't_' . rand(0,99999999999999999),
                    'kouiCode' => $GLOBALS['config']['orcaapi']['kenkoushindan_code'],
                    'type' => '90',
                    'name' => '健康診断',
                    'ins' => $req->update[0]->ins,
                    'gai' => false,
                    'noCalc' => false,
                    'violation' => [
                        'present' => false,
                        'issue' => [],
                        'preventSave' => false
                    ],
                    'var' => $req->update[0]->kouiData,
                    'done' => false,
                    'comment' => [
                        'present' => false,
                        'content' => ''
                    ],
                    'isExternal' => false,
                    'requiresClose' => false,
                    'expanded' => false
                ]];        
            }

            $request_data->koui = json_encode($db_koui);

        }

        $db_query = new Record;
        $query = $db_query->update($request_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        if (in_array($req->update[0]->mode, ['pause', 'close', 'healthcheck'])) {
            // send message to connected clients
            $client = new Websocket();
            $client->client->initialize();
            $client->client->emit('broadcast', ['action' => 'updateReception', false, false]);
            $client->client->close();
        }

        $res->success = true;    

    }

    public function post($req, $res) {

        $request_data = $req->post->data;
        $request_data->date = date("Y-m-d");

        if(!$request_data->orca_id) {

            $ordata = new stdClass;
            $ordata->patientID = $request_data->patientID;
            $ordata->date = $request_data->date;
            $ordata->time = date("H:i:s");
            $ordata->dep = '01';
            $ordata->doctor = sprintf('%04d', $request_data->doctor);
            $ordata->type = sprintf('%02d', $request_data->type);
            $ordata->insSet = $request_data->ins;

            $orca = new Orcaapi();
            $orca_result = $orca->reception_create($ordata);

            if(!$orca_result->ok) {
                $res->message = $orca_result->msg;
                return;    
            }
            $request_data->shinsatu_start = date("Y-m-d H:i:s");
            $request_data->orca_id = intval($orca_result->result->Acceptance_Id);
        }

        $db_query = new Record;

        $query = $db_query->post($request_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        // send message to connected clients
        $client = new Websocket();
        $client->client->initialize();
        $client->client->emit('broadcast', ['action' => 'updateReception', false, false]);
        $client->client->close();

        $res->success = true;    
    }
}
