<?php

namespace App\Database\Queries;

use App\Database\DB;

class Permission {

    public function get($params) {
        $query =
            '   SELECT
                    p.name AS view,
                    rel.value AS acl
                FROM
                    sys_grp_to_perm rel
                INNER JOIN
                    sys_permissions p ON rel.perm = p.id
                WHERE 
                    rel.group = ?
            ';

        $bind_params = [
            ['i', $params]
        ];

        $db = new DB();
        $result = $db->query(['query'=>$query, 'bind_params'=>$bind_params]);
        return $result;
    }

}