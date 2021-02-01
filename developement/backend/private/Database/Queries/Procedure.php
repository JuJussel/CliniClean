<?php

namespace App\Database\Queries;

use App\Database\DB;

class Procedure {
    
    public function get($data) {

        $db = new DB();
        $query =
        '   SELECT content_koui,
                id,
                date,
                shinsatu_start,
                type
            FROM usr_encounters
            WHERE patient_id = ?
            ORDER BY date DESC
        ';

        $bind_params = [
            ['i', $db->sanitize_xss($data)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

}