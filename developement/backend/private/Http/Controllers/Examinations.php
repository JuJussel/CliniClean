<?php

namespace App\Http\Controllers;

use App\Database\Queries\Examination;
use App\Database\Queries\Encounter;
use App\Database\Queries\Record;
use App\Database\Queries\News;
use App\Middleware\Websocket;

class Examinations {

    public function all($req, $res) {

        if(gettype($req->params) !== 'integer') {
            $req->params = '%';
        }

        $db_query = new Examination();
        $query = $db_query->all($req->params);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $res->data = [];

        foreach ($query->data as $key => $value) {
            $value['content_koui'] = json_decode($value['content_koui'], true);
            foreach ($value['content_koui'] as $kensa_key => $kensa_value) {
                if (
                    ($kensa_value['type'] === '60' && !$kensa_value['done'])
                    ||
                    $kensa_value['type'] === '90' && !$kensa_value['done']) {

                    $kensa_value['tag'] = (string)$kensa_value['tag'];
                    $pushVal = [
                        'encounterID' => $value['id'],
                        'patientID' => $req->params,
                        'status' => $value['status'],
                        'type' => $kensa_value['type'],
                        'koui' => $kensa_value,
                        'date' => $value['date']
                    ];
                    array_push($res->data, $pushVal);    
                }
            }
        }

        $res->success = true;
    }

    public function update($req, $res) {

        $request_data = $req->update[0];
        $request_data->exams = [];
        $news = [];

        foreach ($request_data->existing->kouis as $key => $value) {
            $e = [
                'code' => $value->koui->kouiCode,
                'name' => $value->koui->name,
                'results' => $value->koui->var->results ,
                'tag' => $value->koui->tag,
                'new' => false
            ];
            array_push($request_data->exams, $e);
        }
        foreach ($request_data->new as $key => $value) {
            $e = [
                'code' => $value->koui->kouiCode,
                'name' => $value->koui->name,
                'results' => $value->koui->var->results,
                'tag' => null,
                'new' => true
            ];
            array_push($request_data->exams, $e);
        }
        $request_data =  [
            'encounter_id' => $req->itemId,
            'patient_id' => $request_data->existing->kouis[0]->patientID,
            'request_id' => $request_data->existing->requestNumber,
            'date' => $request_data->existing->date,
            'exams' => $request_data->exams
        ];

        // Request data cleaned up

        $db = new Encounter();
        $encounter = $db->get($request_data['encounter_id']);
        if (!$encounter->ok) {
            $res->message = $encounter->msg;
            return;
        }

        $procedures = json_decode($encounter->data[0]['content_koui'], true);
        
        foreach ($request_data['exams'] as $key => $value) {
            if (!$value['new']) {
                $precedure_key = array_search($value['tag'], array_column($procedures, 'tag'));
                $procedures[$precedure_key]['var']['results'] = $value['results'];
                $procedures[$precedure_key]['done'] = true;
            }
        }

        $procedures = json_encode($procedures, JSON_UNESCAPED_UNICODE);
        $encounter->data[0]['content_koui'] = $procedures;  

        $query_data = (object) [
            'soap' => $encounter->data[0]['content_soap'],
            'koui' => $encounter->data[0]['content_koui'],
            'status' => $encounter->data[0]['status'],
            'locked' => $encounter->data[0]['locked'],
            'date' => date("Y-m-d H:i:s"),
            'id' => $encounter->data[0]['id'],
            'shinsatu_end' => $encounter->data[0]['shinsatu_end']
        ];

        $db = new Record();
        $record = $db->update($query_data);

        if (!$record->ok) {
            $res->message = $record->msg;
            return;
        }

        // Insert Kensa Results
        foreach ($request_data['exams'] as $key => $value) {
            $query_data = (object) [
                'tag' => $value['tag'],
                'encounter_id' => $request_data['encounter_id'],
                'patient_id' => $request_data['patient_id'],
                'kouiCode' => $value['code'],
                'var' => (object) [
                    'results' => $value['results']
                ]
            ];

            $db = new Examination();
            $query = $db->post($query_data);
            
            if (!$query->ok) {
                $res->message = $query->msg;
                return;
            }

            $new = (object) [
                'title' => '新しい検査結果',
                'patient_id' => $request_data['patient_id'],
                'content' => $query->insert_id,
                'type' => 1
            ];
            array_push($news, $new);
        }

        //Add News
        $db = new News();
        foreach($news as $key => $value) {

            $query = $db->post($value);
            if (!$query->ok) {
                $res->message = $query->msg;
                return;
            }

        }

        // Send message to connected clients
        $client = new Websocket();
        $client->client->initialize();
        $client->client->emit('broadcast', ['action' => 'kensaUpdate', false, false]);
        $client->client->close();

        $res->success = true;

    }
}