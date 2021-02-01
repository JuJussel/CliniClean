<?php

namespace App\Database\Queries;

use App\Database\DB;

class Vital {

    public function all() {

    }
    
    public function get($data) {

        $query =
        '   SELECT
                v.id,
                v.vital_id,
                v.value,
                v.date,
                c.name
            FROM usr_patient_vitals v
            INNER JOIN sys_vital_categories c 
                ON v.vital_id = c.id
            WHERE patient_id = ?
            ORDER BY v.date 
                DESC
        ';

        $bind_params = [
            ['i', $data]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function post($data) {

        $query =
        '   INSERT INTO usr_patient_vitals (
                patient_id,
                vital_id,
                value
            )
            VALUES (?,
        ';
        if (!$data['id']) {
            $query = $query . '(SELECT id FROM sys_vital_categories WHERE code = ?),?)';
            $data['id'] = $data['vital_code'];
        } else {
            $query = $query . '?,?)';
        }


        $bind_params = [
            ['i', $data['patient_id']],
            ['s', $data['id']],
            ['s', $data['value']]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

}