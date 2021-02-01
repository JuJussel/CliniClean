<?php

namespace App\Http\Controllers;

use App\Database\Queries\Order;
use App\Database\Queries\Examination;
use App\Middleware\Websocket;

class Orders {

    private function findIndex($tag, $array) {
        foreach ($array as $key => $value) {
            if ($value['tag'] === $tag) {
                return $key;
            }
        }
    }

    public function all($req, $res) {

        $db = new Order();

        $query = $db->all();
        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $res->data = (object) [
            'open' => [],
            'order' => []
        ];

        foreach ($query->data as $procedure_key => $procedure_value) {

            $procedure_value['content_koui'] = json_decode($procedure_value['content_koui'], true);
            
            foreach($procedure_value['content_koui'] as $key => $value) {
                if ($value['type'] !== '25' && !$value['done']) {
                    $pushVal = [
                        'encounterID' => $procedure_value['id'],
                        'status' => $procedure_value['status'],
                        'patientName' => $procedure_value['name'],
                        'patientID' => $procedure_value['patientID'],
                        'type' => $value['type'],
                        'koui' => $value,
                        'locked' => $procedure_value['locked']
                    ];
                    if ($value['requiresClose']) {
                        array_push($res->data->order, $pushVal);
                    }
                    if ($procedure_value['locked'] != 1) {
                        array_push($res->data->open, $pushVal);
                    }
                }

            }
        }
        $res->success = true;

    }

    public function update($req, $res) {
        
        $koui = $req->update[0];
        $koui = (object) [
            'date' => date("Y-m-d H:i:s"),
            'koui' => $koui->koui->koui,
            'new_comment' => $koui->newComment,
            'encounter_id' => $koui->koui->encounterID,
            'patient_id' => $koui->koui->patientID,
            'user_full_name' => $koui->userFullName,
            'user' => $_SESSION['user'],
            'original_status' => $koui->koui->status
        ];

        $db = new Order();
        $query = $db->get($koui->encounter_id);

        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        $koui_json = json_decode($query->data[0]['content_koui'], true);

        $index = strval($this->findIndex($koui->koui->tag, $koui_json));

        if ($index === "0" || $index) {
                
            //Append Comment
            if ($koui->new_comment !== '') {

                $comment = $koui_json[$index]['comment']['content']
                . " "
                . $koui->user_full_name
                . ": "
                . $koui->new_comment;
                $koui_json[$index]['comment']['content'] = $comment;
                $koui_json[$index]['comment']['present'] = true;
            }

            //Shot, Prev update data
            if (in_array($koui->koui->type, ['30', '31'])) {
                $koui_json[$index]['var'] = $koui->koui->var;
            }
            //Kensa update data
            if ($koui->koui->type === "60") {
                $koui_json[$index]['var'] = $koui->koui->var;
            }

            //Mark as done
            $koui_json[$index]['done'] = true;
            $koui_json[$index]['requiresClose'] = false;

            //Evaluate new status
            switch ($koui->original_status) {
                case 5:
                    $status = 35;
                    break;
                case 6:
                    $status = 10;
                    break;
                case 36:
                    $status = 35;
                    break;
            
                default:
                    $status = $koui->original_status;
                    break;
            }

            if(in_array($status, [5, 6])) {
                foreach ($koui_json as $key => $value) {
                    if($value['requiresClose'] && !$value['done']) {
                        $status = $koui->original_status;
                    }
                }
            }

            // Save changes
            $writeBack = json_encode($koui_json, JSON_UNESCAPED_UNICODE);

            $query_data = (object) [
                'status' => $status,
                'koui' => $writeBack,
                'date' => $koui->date,
                'encounter_id' => $koui->encounter_id
            ];

            $db = new Order();
            $query = $db->update($query_data);

            if(!$query->ok) {
                $res->message = $query->msg;
                return;
            }
    
            //Insert Kensa Results
            if ($koui->koui->type === '60' && $koui->koui->done) {
                var_dump($koui);

                $exam_data = (object) [
                    'tag' => $koui->koui->tag,
                    'var' => $koui->koui->var,
                    'encounter_id' => $koui->encounter_id,
                    'patient_id' => $koui->patient_id,
                    'koui_code' => $koui->koui->kouiCode
                ];

                $db = new Examination();
                $query = $db->post($exam_data);
                if(!$query->ok) {
                    $res->message = $query->msg;
                    return;
                }   
            }

            $res->success = true;
            $client = new Websocket();
            $client->client->initialize();
            $client->client->emit('broadcast', ['action' => 'updateReception', false, false]);
            $client->client->emit('broadcast', ['action' => 'updateKoui', $koui_json, false]);
            $client->client->close();

        } else {
            $res->message = "Cannot find Order!";
        }
    }


}