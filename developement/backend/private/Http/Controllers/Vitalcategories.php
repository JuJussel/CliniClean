<?php
namespace App\Http\Controllers;

use App\Database\Queries\Vitalcategory;

class Vitalcategories {

    public function all($req, $res) {

        $db_data = new Vitalcategory();
        $query = $db_data->all();

        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        foreach($query->data as $key => $value) {
            $query->data[$key]['unit'] = explode("<br/>", $value['code'])[1];
            $query->data[$key]['name'] = explode("<br/>", $value['code'])[0];
            $query->data[$key]['value'] = "";
        }

        $res->success = true;    
        $res->data = $query->data;

    }

}