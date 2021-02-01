<?php

namespace App\Http\Controllers;

use App\Middleware\Orcaapi;
use App\Middleware\Orcadb;

class Insurances {

    public function get($req, $res) {

        $query_data = [
            'kigou' => $req->params->kigou,
            'bangou' => $req->params->bangou,
            'hokensha' => $req->params->hokenshaNumber
        ];
        
        $query = new Orcadb();
        $query->insurances($query_data);
        if ($query->ok) {
            $res->data = $query->data;
            $res->success = true;
        } else {
            $res->message = $query->msg;
            return;
        }
    }

}