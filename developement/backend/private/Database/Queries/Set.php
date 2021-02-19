<?php

namespace App\Database\Queries;

use App\Database\DB;

class Set {

    public function all() {

        $query =
        '   SELECT s.*, p.name
            FROM usr_sets s
            LEFT JOIN usr_patients p ON p.id = s.patient
            ORDER BY insert_date DESC
        ';

        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;

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
        '   DELETE FROM usr_sets
            WHERE id = ?
        ';

        $bind_params = [
            ['i', $id],
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function update($data) {

        $query =
        '   UPDATE usr_sets
            SET content = ?
            WHERE id = ?
        ';

        $bind_params = [
            ['s', $data->data->content],
            ['i', $data->data->id]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function post($data) {

        // This needs to be fixed, just too ugly..
        //  Cannot insert NULL values due to foeign key

        if ($data->parent !== 'noParent' && $data->patient) {
            $query = 
            '   INSERT INTO usr_sets (
                    parent,
                    content,
                    patient,
                    user,
                    folder
                )
                VALUES (?,?,?,?,?)
            ';
            $bind_params = [
                ['i', $data->parent],
                ['s', $data->content],
                ['i', $data->patient],
                ['i', $data->user],
                ['i', $data->is_folder]
            ];
        } else if ($data->parent !== 'noParent') {
            $query = 
            '   INSERT INTO usr_sets (
                    parent,
                    content,
                    user,
                    folder
                )
                VALUES (?,?,?,?)
            ';
            $bind_params = [
                ['i', $data->parent],
                ['s', $data->content],
                ['i', $data->user],
                ['i', $data->is_folder]
            ];

        } else if ($data->patient) {
            $query = 
            '   INSERT INTO usr_sets (
                    content,
                    patient,
                    user,
                    folder
                )
                VALUES (?,?,?,?)
            ';
            $bind_params = [
                ['s', $data->content],
                ['i', $data->patient],
                ['i', $data->user],
                ['i', $data->is_folder]
            ];

        } else {
            $query = 
            '   INSERT INTO usr_sets (
                    content,
                    user,
                    folder
                )
                VALUES (?,?,?)
            ';
            $bind_params = [
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