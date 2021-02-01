<?php
namespace App\Http\Controllers;

Use App\Database\Queries\Patientnote;

class Patientnotes {

    public function update($req, $res) {
    
        $query_data = $req->update[0];
        $query_data->noteID = $req->itemId;
        $query_data->date = date("Y-m-d H:i:s");
        $query_data->user = $_SESSION['user'];

        $db = new Patientnote();
        $query = $db->update($query_data);
        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $query = $db->post($query_data);
        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $res->success = true;
    }

    public function post($req, $res) {

        $query_data = $req->post->data;
        $query_data->user = $_SESSION['user'];
        $query_data->noteID = null;
        $query_data->insert_date = date("Y-m-d H:i:s");

        $db = new Patientnote();
        $query = $db->post($query_data);
        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $res->success = true;
    }

}