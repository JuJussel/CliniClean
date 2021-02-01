<?php

namespace App\Database\Queries;

use App\Database\DB;

class Vitalcategory {

    public function all() {

        $query =
        '   SELECT * 
            FROM sys_vital_categories
            WHERE id > 900
        ';

        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;

    }
}