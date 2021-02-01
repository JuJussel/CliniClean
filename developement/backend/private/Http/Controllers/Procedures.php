<?php
namespace App\Http\Controllers;

use App\Middleware\Orcadb;

class Procedures {

    public function all($req, $res) {

        $req_data = $req->params;

        $query = new Orcadb();
        $query->procedures($req_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        foreach ($query->data as $key => $value) {
            $query->data[$key]['name'] = mb_convert_encoding($value['name'], "UTF-8", "EUC-JP");
            $query->data[$key]['cost'] = explode('.', $value['cost'])[0];
            $query->data[$key]['taniname'] = mb_convert_encoding($value['taniname'], "UTF-8", "EUC-JP");
        }
        
        $res->data = $query->data;
        $res->success = true;
    }

    public function get($req, $res) {

    }

}