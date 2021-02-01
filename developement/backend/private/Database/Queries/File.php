<?php

namespace App\Database\Queries;

use App\Database\DB;

class File {

    public function all($data) {

        $db = new DB();

        $query = 
            '   SELECT 
                    f.file,
                    f.name,
                    f.insert_date,
                    f.type,
                    f.ext,
                    t.name AS typeName
                FROM usr_files f
                INNER JOIN sys_file_types t ON t.id = f.type
                WHERE f.pat_id = ?
                ORDER BY f.insert_date DESC
            ';
        $bind_params = [
            ['i', $data]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function post($data){

        $db = new DB();

        $query =
            '   INSERT INTO usr_files(
                    pat_id,
                    file,
                    name,
                    type,
                    ext
                )
                VALUES(?,?,?,?,?)
            ';

        $bind_params = [
            ['i', $db->sanitize_xss($data->patient_id)],
            ['s', $db->sanitize_xss($data->file_name)],
            ['s', $db->sanitize_xss($data->meta)],
            ['i', $db->sanitize_xss($data->type)],
            ['s', $db->sanitize_xss($data->file_ext)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }
}
