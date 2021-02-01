<?php

namespace App\Database\Queries;

use App\Database\DB;

class User {

    public function get($params) {
        $query =
        '   SELECT
                id,
                user_name,
                name_first,
                name_last,
                role
            FROM usr_users
            WHERE id = ?
            LIMIT 1
        ';

        $bind_params = [
            ['i', $params]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function auth($params) {
        $query =
        '   SELECT
                id,
                user_name,
                password
            FROM usr_users
            WHERE user_name = ?
            LIMIT 1
        ';

        $bind_params = [
            ['i', $params]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }


}