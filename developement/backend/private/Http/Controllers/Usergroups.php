<?php
namespace App\Http\Controllers;

use App\Database\Queries\Usergroup;

class Usergroups {

    public function all($req, $res) {

        $db_data = new Usergroup();

        $query = $db_data->all();
        if (!$query->ok) {
            $res->message = $query->msg;
        } else {
            $res->data = $query->data;
            $res->success = true;
        }

    }

}