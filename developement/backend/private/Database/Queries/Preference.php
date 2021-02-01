<?php

namespace App\Database\Queries;

use App\Database\DB;

class Preference {

    public function all() {
    }

    public function get($data) {

        $query =
        '   SELECT *
            FROM usr_user_preferences
            WHERE user_id = ?
                AND type = ?
            ORDER BY changed DESC
        ';

        $bind_params = [
            ['i', $data->user],
            ['i', $data->type]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function delete($id) {

        $query =
        '   DELETE FROM usr_user_preferences
            WHERE id = ?
        ';

        $bind_params = [
            ['i', $id],
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function post($data) {

        $query =
        '   INSERT INTO usr_user_preferences (
                user_id,
                type,
                content
            )
            VALUES (?,?,?)
        ';

        $bind_params = [
            ['i', $data->user],
            ['s', $data->type],
            ['s', $data->content]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

}