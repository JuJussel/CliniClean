<?php

namespace App\Http\Controllers;

use App\Database\Queries\Examinationresult;

class Examinationresults {

    public function get($req, $res) {

        $query_data = $req->itemId;

        $db = new Examinationresult();
        $query = $db->get($query_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        foreach($query->data as $key => $value) {
            $query->data[$key]['value'] = '';
        }
        $res->data = $query->data;
        $res->success = true;
    }
}