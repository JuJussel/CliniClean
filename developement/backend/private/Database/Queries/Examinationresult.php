<?php

namespace App\Database\Queries;

use App\Database\DB;

class Examinationresult {

    public function get($param) {
        $query =
        '   SELECT
                kensa_code,
                result_code,
                name,
                unit
            FROM sys_kensa
            WHERE koui_code = ?
            GROUP BY result_code
        ';

        $params = [
            ['i', $param]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params' => $params]);
        return $result;
    }

}