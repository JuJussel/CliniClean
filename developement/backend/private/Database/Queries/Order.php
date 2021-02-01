<?php

namespace App\Database\Queries;

use App\Database\DB;

class Order {

    public function all() {

        $query =
        '   SELECT
                r.id, 
                r.patient_id AS patientID,
                r.type,
                r.ins,
                r.memo,
                r.status,
                r.doctor,
                r.locked,
                r.content_koui,
                time(date) AS time,
                p.name
            FROM usr_encounters r
            INNER JOIN usr_patients p ON r.patient_id = p.id
            WHERE 
                not r.content_koui IS null
                AND json_contains(r.content_koui, JSON_OBJECT("done", false))
            ORDER BY time
        ';

        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;
    }

    public function get($data) {

        $query = 
        '   SELECT content_koui
            FROM usr_encounters
            WHERE id = ?
            LIMIT 1
        ';

        $bind_params = [
            ['i', $data]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function update($data) {

        $query = 
        '   UPDATE usr_encounters
            SET 
                content_koui = ?, 
                status = ?, 
                last_change = ?
            WHERE id = ?
        ';

        $bind_params = [
            ['s', $data->koui],
            ['i', $data->status],
            ['s', $data->date],
            ['i', $data->encounter_id]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

}