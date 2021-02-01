<?php

namespace App\Database\Queries;

use App\Database\DB;

class Patient {

    public function all($data) {
        if(gettype($data) === 'object') {
            $data = '%';
        } else {
            $data = '%' . $data . '%';            
        }

        $db = new DB();

        $query = 
            '   SELECT id, name, birthdate
                FROM usr_patients
                WHERE name LIKE ? OR id LIKE ?
            ';
        $bind_params = [
            ['s', $db->sanitize_xss($data)],
            ['s', $db->sanitize_xss($data)]
        ];
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

    public function get($data) {
        // Dummy
        $db = new DB();

        $query = 
            '   SELECT id, name, birthdate
                FROM usr_patients
                WHERE  id = ?
            ';
        $bind_params = [
            ['i', $db->sanitize_xss($data)]
        ];
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function update($data){
        $db = new DB();

        $query = 
            '   UPDATE usr_patients
                SET
                    name = ?,
                    birthdate = ?
                WHERE id = ?
            ';

        $bind_params = [
            ['s', $db->sanitize_xss($data->name)],
            ['s', $db->sanitize_xss($data->birthDate)],
            ['i', $db->sanitize_xss($data->db_id)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;

    }

    public function post($data) {
        $db = new DB();

        $query = 
            '   INSERT INTO usr_patients(
                    id,
                    name,
                    birthdate
                )
                VALUES (?,?,?)  
            ';

        $bind_params = [
            ['i', $db->sanitize_xss($data->id)],
            ['s', $db->sanitize_xss($data->name)],
            ['s', $db->sanitize_xss($data->birthDate)]
        ];

        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }
}
