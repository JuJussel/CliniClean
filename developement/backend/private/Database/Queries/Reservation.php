<?php

namespace App\Database\Queries;

use App\Database\DB;

class Reservation {

    public function post($data) {

        $db = new DB();
        
        $query =
        '   INSERT INTO usr_encounters (
                    patient_id,
                    type,
                    memo,
                    status,
                    date
                )
                VALUES (?,?,?,?,?)
        ';
        $bind_params = [
            ['i', $db->sanitize_xss($data->patient_id)],
            ['i', $db->sanitize_xss($data->type)],
            ['s', $db->sanitize_xss($data->memo)],
            ['i', $db->sanitize_xss($data->status)],
            ['s', $db->sanitize_xss($data->date) . ' ' . $db->sanitize_xss($data->time)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function update($data) {

        $db = new DB();
        
        $query =
        '   UPDATE usr_encounters
            SET
                patient_id = ?,
                type = ?,
                memo = ?,
                status = ?,
                date = ?
            WHERE
                id = ?
        ';
        $bind_params = [
            ['i', $db->sanitize_xss($data->patient_id)],
            ['i', $db->sanitize_xss($data->type)],
            ['s', $db->sanitize_xss($data->memo)],
            ['i', $db->sanitize_xss($data->status)],
            ['s', $db->sanitize_xss($data->date) . ' ' . $db->sanitize_xss($data->time)],
            ['i', $db->sanitize_xss($data->id)],
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

}