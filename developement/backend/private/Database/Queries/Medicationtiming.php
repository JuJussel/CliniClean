<?php

namespace App\Database\Queries;

use App\Database\DB;

class Medicationtiming {

    public function get($param) {
        $query =
        '   SELECT
                id,
                name,
                unit,
                med_appl 
            FROM sys_med_application 
            WHERE med_appl_code = ?
        ';

        $params = [
            ['i', $param]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params' => $params]);
        return $result;
    }

}