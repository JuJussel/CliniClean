<?php

namespace App\Database\Queries;

use App\Database\DB;

class Setting {

    public function all() {
    }

    public function get($data) {

        $query =
        '   SELECT config_value
            FROM usr_admin_config
            WHERE config_name = ?
        ';

        $bind_params = [
            ['s', $data]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

}