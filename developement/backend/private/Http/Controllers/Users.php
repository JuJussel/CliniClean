<?php
namespace App\Http\Controllers;

use App\Database\Queries\User;

class Users {

    public function get($req, $res) {

        if (!$req->post) {
            
            $id = $_SESSION['user'];

            $db = new User();
            $query = $db->get($id);

            if(!$query->ok) {
                $res->message = $query->msg;
                return;
            }

            $res->data = $query->data[0];
            $res->success = true;

        }

        $res->success = true;

    }

    public function all($req, $res) {

        $db = new User();
        $query = $db->all();

        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        foreach ($query->data as $key => $value) {
            $query->data[$key]['has_orca'] = boolval($value['has_orca']);
            $query->data[$key]['active'] = boolval($value['active']);
        }
        $res->data = $query->data;
        $res->success = true;


    }


}