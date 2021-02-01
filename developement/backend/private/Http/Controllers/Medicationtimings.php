<?php

namespace App\Http\Controllers;

use App\Database\Queries\Medicationtiming;

class Medicationtimings {

    public function get($req, $res) {

        $query_data = $req->itemId;

        $db = new Medicationtiming();
        $query = $db->get($query_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        $res->data = $query->data;
        $res->success = true;
    }
}