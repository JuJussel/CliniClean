<?php
namespace App\Http\Controllers;

use App\Database\Queries\Set;

class Setfolders {



    public function post($req, $res) {

        $req_data = $req->post->data;
        $req_data->user = $_SESSION['user'];
        $req_data->is_folder = 1;
        $req_data->content = '{"name":"' . $req_data->text . '"}';



        $db = new Set();
        $query = $db->post($req_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $res->success = true;
    }


}