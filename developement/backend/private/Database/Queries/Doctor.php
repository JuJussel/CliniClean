<?php

namespace App\Database\Queries;

use App\Database\DB;

class Doctor {

    public function all() {
        $query =
            '   SELECT CONCAT(name_last, name_first) AS name, status, id 
                FROM usr_users
                WHERE visible = 1 AND role = 1
            ';
        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;
    }

}