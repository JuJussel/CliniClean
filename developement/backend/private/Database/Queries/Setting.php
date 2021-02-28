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
            OR id = ?
            LIMIT 1
        ';

        $bind_params = [
            ['s', $data],
            ['s', $data]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function update($data) {

        $query =
        '   UPDATE usr_admin_config
            SET config_value = ?
            WHERE id = ?
        ';

        $bind_params = [
            ['s', $data->value],
            ['i', $data->id]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

}