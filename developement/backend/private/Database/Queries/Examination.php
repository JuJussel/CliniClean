<?php

namespace App\Database\Queries;

use App\Database\DB;

class Examination {

    public function all($data) {
        
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
                r.date,
                time(date) AS time
            FROM usr_encounters r
            WHERE 
                not r.content_koui IS null
                AND json_contains(r.content_koui, JSON_OBJECT("done", false))
                AND r.patient_id
        ';

        if ($data !== '%') {
            $query = $query . ' = ?';
        } else {
            $query = $query . ' LIKE ?';
        }

        $query = $query . ' ORDER BY r.date DESC';

        $db = new DB();

        $bind_params = [
            ['s', $data]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function post($data) {

        $query =
        '   INSERT INTO usr_kensa_results(
                koui_tag,
                results,
                encounter_id,
                patient_id,
                koui_code
            )
            VALUES (?,?,?,?,?)
        ';

        $resultString = json_encode($data->var->results, JSON_UNESCAPED_UNICODE);
        
        $db = new DB();
        $bind_params = [
            ['s', $db->sanitize_xss($data->tag)],
            ['s', $resultString],
            ['i', $db->sanitize_xss($data->encounter_id)],
            ['i', $db->sanitize_xss($data->patient_id)],
            ['i', $db->sanitize_xss($data->kouiCode)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

}