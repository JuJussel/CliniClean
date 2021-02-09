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
                r.id as "group",
                r.label as "group_label",
                u.active,
                u.is_directory,
                u.has_orca
            FROM usr_users u
            INNER JOIN sys_groups r ON r.id = u.user_group
            ORDER BY id
        ';

        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;
    }

    public function get($params) {
        $query =
        '   SELECT
                u.id,
                u.user_name,
                u.name_first,
                u.name_last,
                u.user_group
            FROM usr_users u
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

    public function update($params) {
        $query =
        '   UPDATE usr_users u
            SET
                u.user_name = ?,
                u.name_first = ?,
                u.name_last = ?,
                u.active = ?,
                u.user_group = ?,
                u.has_orca = ?
            WHERE id = ?
        ';

        $bind_params = [
            ['s', $params->user_name],
            ['s', $params->name_first],
            ['s', $params->name_last],
            ['i', (int)$params->active],
            ['i', $params->group],
            ['i', (int)$params->has_orca],
            ['i', $params->id]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function update_password($params) {
        $query =
        '   UPDATE usr_users u
            SET
                u.password = ?
            WHERE id = ?
        ';

        $bind_params = [
            ['s', password_hash($params->password, PASSWORD_DEFAULT)],
            ['i', $params->id]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function create($params) {
        $query =
        '   INSERT INTO usr_users
            (
                user_name,
                name_first,
                name_last,
                active,
                user_group,
                has_orca,
                password
            )
            VALUES (?,?,?,?,?,?,?)
        ';

        $bind_params = [
            ['s', $params->user_name],
            ['s', $params->name_first],
            ['s', $params->name_last],
            ['i', (int)$params->active],
            ['i', $params->group],
            ['i', (int)$params->has_orca],
            ['s', password_hash($params->password, PASSWORD_DEFAULT)]
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