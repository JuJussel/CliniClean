<?php
namespace App\Http\Controllers;

use App\Middleware\Orcadb;
use stdClass;

class Zips {

    public function all($req, $res) {
    }

    public function get($req, $res) {

        $query_data = $req->itemId;

        // Catch empty requests
        if(gettype($query_data) !== 'integer') {
            $res->success = true;
            $res->data = '';
            return;
        }

        $query = new Orcadb();
        $query->zips($query_data);

        if ($query->ok) {
            $res->success = true;
            if(count($query->data) > 0) {
                foreach($query->data as $key => $value) {
                    $query->data[$key] = mb_convert_encoding($value['editadrs_name'], "UTF-8", "EUC-JP");
                }
                $res->data = $query->data[0];
            } else {
                $res->data = '';
            }
        } else {
            $res->message = $query->msg;
        }
    }


}