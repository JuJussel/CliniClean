<?php

namespace App\Database\Queries;

use App\Database\DB;

class Patientnote {

    public function get($data) {

        $db = new DB();
        $query =
        '   SELECT
                note,
                insert_date,
                id
            FROM usr_patient_notes
            WHERE patient_id = ?
                AND valid = "1"
            ORDER BY insert_date DESC
        ';

        $bind_params = [
            ['i', $db->sanitize_xss($data)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function update($data) {

        $db = new DB();
        $query =
        '   UPDATE usr_patient_notes
            SET
                valid = "0",
                update_date = ?,
                updated_by = ?
            WHERE id = ?
        ';

        $bind_params = [
            ['s', $data->date],
            ['s', $data->user],
            ['s', $db->sanitize_xss($data->noteID)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function post ($data) {

        $db = new DB();
        $query =
        '   INSERT INTO 
                usr_patient_notes(
                    note,
                    insert_user,
                    insert_date,
                    patient_id,
                    encounter_id,
                    parent_id
                )
            VALUES (?,?,?,?,?,?)
        ';

        $bind_params = [
            ['s', $db->sanitize_xss($data->note)],
            ['i', $data->user],
            ['s', $data->insert_date],
            ['i', $db->sanitize_xss($data->patient_id)],
            ['i', $db->sanitize_xss($data->encounter_id)],
            ['i', $db->sanitize_xss($data->noteID)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;


    }

}