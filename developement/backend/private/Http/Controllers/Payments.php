<?php
namespace App\Http\Controllers;

use App\Database\Queries\Payment;
use App\Database\Queries\Encounter;
use App\Middleware\Orcaapi;

class Payments {

    public function post($req, $res) {

        $request_data = $req->post->data;

        $query_data = $request_data->encounter;
        $query_data->status = 0;
        $query_data->recID = $query_data->id;
        $query_data->date = date("Y-m-d H:i:s");

        $db = new Encounter();
        $query = $db->update($query_data);

        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        if (!$GLOBALS['accounting']['useCliniCalc']) {
            $res->success = true;
            return;
        }

        $res->message = 'Link to accounting software not finished. Status has been updated.';

    }

    public function get($req, $res) {

        $query_data = $req->itemId;

        $orca = new Orcaapi();
        $query = $orca->get_procedure_status($query_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        if ($query === 'K1') {
            $res->data->done = false;
            return;
        }

        $query = $orca->get_patient_income_info($query_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        if (!count($query->result) || count($query->result->Income_Information_child) < 1) {
            $res->data->done = false;
            return;
        }

        $res->data->items = [];
        $date = date('Y-m-d');

        foreach ($query->result->Income_Information_child as $value) {
            if ((string) $value->IssuedDate === $date) {
                array_push($res->data->items, $value);
            }
        }

        $res->data->done = true;
        $res->success = true;    
    }


}