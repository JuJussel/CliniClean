<?php

namespace App\Database\Queries;

use App\Database\DB;

class Set {

    public function all() {
    }

    public function get($data) {

        $query =
        '   SELECT *
            FROM usr_sets
            WHERE 
                patient IS NULL
                OR patient = ?
            ORDER BY insert_date DESC
        ';

        $bind_params = [
            ['i', $data]
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
        '   INSERT INTO usr_sets (
                parent,
                content,
        ';

        if ($data->patient) {
            $query = $query . 'patient,';
        }

        $query = $query . 
        '
                user,
                folder
            )
            VALUES (?,?,
        ';

        if ($data->patient) {
            $query = $query . '?,';
        }
        $query = $query . 
        '
         ?,?)
        ';

        if ($data->patient) {
            $bind_params = [
                ['i', $data->parent],
                ['s', $data->content],
                ['i', $data->patient],
                ['i', $data->user],
                ['i', $data->is_folder]
            ];
        } else {
            $bind_params = [
                ['i', $data->parent],
                ['s', $data->content],
                ['i', $data->user],
                ['i', $data->is_folder]
            ];
        }

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

}