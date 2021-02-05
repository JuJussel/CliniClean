<?php

namespace App\Database\Queries;

use App\Database\DB;

class User {

    public function all() {
        $query =
        '   SELECT
                u.id,
                u.user_name,
                u.name_first,
                u.name_last,
                r.label as role,
                u.active,
                u.is_directory,
                u.has_orca
            FROM usr_users u
            INNER JOIN sys_roles r ON r.id = u.role
        ';

        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;
    }

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
                AND active = 1
            LIMIT 1
        ';

        $bind_params = [
            ['s', $params]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }


}