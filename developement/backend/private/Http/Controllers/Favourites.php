<?php
namespace App\Http\Controllers;

use App\Database\Queries\Preference;

class Favourites {

    public function get($req, $res) {

        $query_data = (object)[
            'user' => $req->itemId,
            'type' => '30' . $req->params
        ];
        $db = new Preference();
        $query = $db->get($query_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        $res->data = $query->data;
        foreach ($res->data as $key => $value) {
            $res->data[$key] = json_decode($value['content']);
        }
        $res->success = true;

    }

    public function post($req, $res) {

        $req_data = $req->post->data;
        $req_data->type = '30' . $req_data->type;
        $req_data->user = $_SESSION['user'];
        $req_data->content = json_encode($req_data->procedure);        

        $db = new Preference();
        $query = $db->get($req_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        $all_data = $query->data;
        $count = count($all_data);

        // Delete if duplicate exists
        foreach ($all_data as $key => $value) {
            if ($value['content'] === $req_data->content) {
                $query = $db->delete($value['id']);
                $count = $count -1;
                if (!$query->ok) {
                    $res->message = $query->msg;
                    return;
                }        
                break;
            }
        }

        // If more than 20 delete
        if ($count == 20) {
            $id = $all_data[$count - 1]['id'];
            $query_delete = $db->delete($id);
            if (!$query_delete->ok) {
                $res->message = $query_delete->msg;
                return;
            }
        }

        // Insert
        $query = $db->post($req_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }        

        $res->success = true;
    }


}