<?php
namespace App\Http\Controllers;

use App\Middleware\Orcadb;

class Shinsatutypes {

    public function all($req, $res) {

        $query = new Orcadb;
        $query->shinsatutypes();
        if ($query->ok) {
            foreach($query->data as $key => $value) {
                $temp = $value['name'];
                $temp = mb_convert_encoding($temp, "UTF-8", "EUC-JP");
                $temp = explode(' ', $temp)[0];
                $query->data[$key]['name'] = $temp;
            }
            $res->success = true;    
            $res->data = $query->data;
        } else {
            $res->message = $query->msg;
        }

    }

}