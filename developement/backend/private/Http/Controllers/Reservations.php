<?php
namespace App\Http\Controllers;

use App\Database\Queries\Reservation;
use stdClass;

class Reservations {

    public function post($req, $res) {

        $data = $req->post->data;

        $query_data = new stdClass();
        
        $query_data->patient_id = $data->patient->id;
        $query_data->type = $data->type->id;
        $query_data->memo = $data->memo;
        $query_data->date = $data->date;
        $query_data->time = $data->time;
        $query_data->status = 1;

        $db_data = new Reservation();
        $query = $db_data->post($query_data);
        if ($query->ok) {
            $res->success = true;    
        } else {
            $res->message = $query->msg;
        }

    }

}