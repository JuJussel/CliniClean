<?php

namespace App\Database\Queries;

use App\Database\DB;

class Usergroup {

    public function all() {

        $query =
        '   SELECT *
            FROM sys_groups
        ';

        $db = new DB();
        $result = $db->query(['query'=>$query]);
        return $result;

    }

}