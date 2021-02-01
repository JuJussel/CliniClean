<?php

namespace App\Http\Controllers;

use App\Middleware\Orcaapi;
use App\Middleware\Orcadb;

class Diseases {

    public function update($req, $res) {
        
        $reqest_data = $req->update[0];
        
        $orca_data = new Orcaapi();

        $query = $orca_data->update_disease($reqest_data);
        if ($query->ok) {
            $res->success = true;
        } else {
            $res->message = $query->msg;
            return;
        }

    }

    public function all($req, $res) {

        $query_data = $req->params;

        $query = new Orcadb();
        $query->diseases($query_data);
        if ($query->ok) {

            if(count($query->data) > 0) {
                foreach ($query->data as $key => $value) {
                    $query->data[$key]['byomei'] = mb_convert_encoding($value['byomei'], "UTF-8", "EUC-JP");
                }



                $res->data = $query->data;
            } else {
                $res->data = false;
            }
            $res->success = true;
        } else {
            $res->message = $query->msg;
            return;
        }
    }

}