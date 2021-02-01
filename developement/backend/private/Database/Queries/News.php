<?php

namespace App\Database\Queries;

use App\Database\DB;

class News {

    public function all($data) {
        
    }

    public function post($data) {

        $query =
        '   INSERT INTO usr_news(
                content,
                patient_id,
                title,
                type
            ) 
            VALUES (?, ?, ?, ?)
        ';
        
        $db = new DB();
        $bind_params = [
            ['s', $data->content],
            ['i', $data->patient_id],
            ['s', $data->title],
            ['i', $data->type]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

}