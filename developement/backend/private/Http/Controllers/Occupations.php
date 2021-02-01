<?php
namespace App\Http\Controllers;

use App\Database\Queries\Occupation;

class Occupations {

    public function all($req, $res) {

        $db_data = new Occupation();
        $query = $db_data->all();
        if ($query->ok) {
            $res->success = true;    
            $res->data = $query->data;
        } else {
            $res->message = $query->msg;
        }

    }

}