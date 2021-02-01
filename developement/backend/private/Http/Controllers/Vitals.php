<?php

namespace App\Http\Controllers;

use App\Database\Queries\Vital;

class Vitals {

    public function post($req, $res) {
        
        $reqest_data = $req->post->data;

        $db = new Vital();
        foreach($reqest_data->items as $key => $value) {

            $query_value = [
                'patient_id' => $reqest_data->patient_id,
                'id' => $value->id,
                'value' => $value->value
            ];

            $db_query = $db->post($query_value);

            if (!$db_query->ok) {
                $res->message = $query->msg;
                return;
            }
        }

        $res->success = true;

    }

}