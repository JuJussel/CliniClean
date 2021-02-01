<?php

namespace App\Database\Queries;

use App\Database\DB;

class Record {
    

    public function all($data) {
        
        $query =
        '   SELECT 
                id, 
                date,
                shinsatu_start,
                type
            FROM usr_encounters
            WHERE patient_id = ?
            ORDER BY date DESC
        ';

        $db = new DB();
        $bind_params = [
            ['i', $db->sanitize_xss($data)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function get($data) {

        $query =
        '   SELECT 
                content_soap,
                content_koui,
                type
            FROM usr_encounters
            WHERE id = ?
            LIMIT 1
        ';

        $db = new DB();
        $bind_params = [
            ['i', $db->sanitize_xss($data)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function update($data) { 

        $query =
        '   UPDATE usr_encounters
            SET
                content_soap = ?,
                content_koui = ?,
                status = ?,
                locked = ?,
                last_change = ?,
                shinsatu_end = ?
            WHERE id = ?
        ';

        $db = new DB();
        $bind_params = [
            ['s', $data->soap],
            ['s', $data->koui],
            ['i', $db->sanitize_xss($data->status)],
            ['i', $data->locked],
            ['s', $data->date],
            ['s', isset($data->shinsatu_end) ? $data->shinsatu_end : $data->date],
            ['i', $db->sanitize_xss($data->id)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function post($data) {
        
        $query =
        '   UPDATE usr_encounters
            SET 
                locked = 1,
                orca_id = ?,
                shinsatu_start = ?
            WHERE id = ?
        ';

        $db = new DB();
        $bind_params = [
            ['i', $db->sanitize_xss($data->orca_id)],
            ['s', $db->sanitize_xss($data->shinsatu_start)],
            ['i', $db->sanitize_xss($data->id)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }
}