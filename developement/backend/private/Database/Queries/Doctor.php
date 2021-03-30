<?php

namespace App\Database\Queries;

use App\Database\DB;

class Doctor {

    public function all() {
        $query =
            '   SELECT CONCAT(u.name_last, name_first) AS name, u.status, u.id 
                FROM usr_users u
                WHERE u.active = 1 AND u.user_group = 2
            ';
        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;
    }

}