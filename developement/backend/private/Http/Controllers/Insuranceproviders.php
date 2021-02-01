<?php

namespace App\Http\Controllers;

use App\Middleware\Orcaapi;
use App\Middleware\Orcadb;

class Insuranceproviders {

    public function get($req, $res) {

        $query_data = $req->itemId;
        
        $query = new Orcadb();
        $query->insurance_providers($query_data);
        if ($query->ok) {
            $res->data = mb_convert_encoding($query->data[0]['seidoname'], "UTF-8", "EUC-JP");
            $res->success = true;
        } else {
            $res->message = $query->msg;
            return;
        }
    }

}