<?php

namespace App\Database\Queries;

use App\Database\DB;

class Encounter {

    public function all() {
        $query =
        '   SELECT 
                r.id, r.patient_id AS patientID,
                r.type,
                r.ins,r.memo,
                r.status,
                r.doctor,
                r.locked,
                r.shinsatu_start,
                r.orca_id,
                time(date) AS time,
                time(last_change) AS lastChange,
                p.name
            FROM usr_encounters  r
            INNER JOIN usr_patients p ON r.patient_id = p.id
            WHERE date(date) = CURDATE()
            ORDER BY time
        ';
        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;
    }

    public function get($data) {

        $db = new DB();

        $query =
        '   SELECT *
            FROM usr_encounters
            WHERE id = ?
            LIMIT 1
        ';

        $bind_params = [
            ['i', $db->sanitize_xss($data)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

        
    }

    public function post($data) {
        
        
        $query =
        '   INSERT INTO usr_encounters (
                patient_id,
                type,
                ins,
                memo,
                last_change
            )
            VALUES (?,?,?,?,?)
        ';

        $db = new DB();
        $bind_params = [
            ['i', $db->sanitize_xss($data->patient_id)],
            ['i', $db->sanitize_xss($data->type)],
            ['s', $db->sanitize_xss($data->ins)],
            ['s', $db->sanitize_xss($data->memo)],
            ['s', $db->sanitize_xss($data->date)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function update($data) {

        $db = new DB();
        
        $query =
        '   UPDATE usr_encounters
            SET
                status = ?,
                memo = ?,
                ins = ?,
                doctor = ?,
                last_change = ?
            WHERE id = ?
        ';

        $bind_params = [
            ['i', $db->sanitize_xss($data->status)],
            ['s', $db->sanitize_xss($data->memo)],
            ['s', $db->sanitize_xss($data->ins)],
            ['i', $db->sanitize_xss($data->doctor)],
            ['s', $db->sanitize_xss($data->date)],
            ['i', $db->sanitize_xss($data->recID)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

}