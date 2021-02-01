<?php

namespace App\Database\Queries;

use App\Database\DB;

class Occupation {

    public function all() {
        $query =
            '   SELECT id, name
                FROM sys_occupations
            ';
        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;
    }

}