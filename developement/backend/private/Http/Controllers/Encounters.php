<?php
namespace App\Http\Controllers;

use App\Database\Queries\Encounter;
use App\Database\Queries\User;
use stdClass;

class Encounters {

    private function get_today($req, $res) {
        $db_data = new Encounter();
        $query = $db_data->all();
        if ($query->ok) {
            $res->success = true;
            // Set update tag to false
            $modify_data = $query->data;
            foreach($modify_data as $key => $value) {
                $modify_data[$key]['update'] = false;
            }
            $res->data = $modify_data;
        } else {
            $res->message = $query->msg;
        }
    }

    private function get_range($req, $res) {

        $query_data = $req->params->range;

        $db_data = new Encounter();
        $query = $db_data->range($query_data);

        if(!$query->ok) {
            $res->mssage = $query->msg;
            return;
        }

        $res->data = $query->data;
        $res->success = true;

    }

    public function all($req, $res) {
        if(isset($req->params->range)) {
            $this->get_range($req, $res);
        } else {
            $this->get_today($req, $res);
        }
    }

    public function get($req, $res) {

    }

    public function post($req, $res) {

        $data = $req->post->data;

        $query_data = new stdClass();
        $query_data->patient_id = $data->patient->id;
        $query_data->type = $data->type;
        $query_data->ins = $data->insurance->ID;
        $query_data->memo = $data->memo;
        $query_data->date = date("Y-m-d H:i:s");

        $db_data = new Encounter();
        $query = $db_data->post($query_data);
        if ($query->ok) {
            $res->data = $query->insert_id;
            $res->success = true;    
        } else {
            $res->message = $query->msg;
        }
    }

    public function update($req, $res) {

        $data = $req->update[0];
        $query_data = new stdClass();
        $query_data->patient_id = $data->patient->id;
        $query_data->type = $data->type->id;
        $query_data->ins = $data->insurance->ID;
        $query_data->memo = $data->memo;
        $query_data->recID = $data->recID;
        $query_data->status = $data->status;
        $query_data->doctor = $data->doctor;
        $query_data->date = date("Y-m-d H:i:s");

        $db_data = new Encounter();
        $query = $db_data->update($query_data);
        if ($query->ok) {
            $res->success = true;    
        } else {
            $res->message = $query->msg;
        }

        if ($data->status === 3) {
            
            $query_data = new stdClass();
            $query_data->id = $data->doctor;
            $query_data->status = 2;
            $db_data = new User();
            $query = $db_data->set_status($query_data);
            if ($query->ok) {
                $res->success = true;    
            } else {
                $res->message = $query->msg;
            }
        }

    }

}