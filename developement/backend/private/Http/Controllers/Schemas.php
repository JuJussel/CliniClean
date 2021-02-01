<?php

namespace App\Http\Controllers;

class Schemas {

    public function all($req, $res) {

        $schemas = [];

        $files = scandir($GLOBALS['asset_schema_folder']);

        foreach ($files as $key => $file) {
            if (substr($file, 5, 2) === "S_") {
                $name = explode('_', $file)[2];
                $name = explode('.', $name)[0];
                $full = $name . '.png';
                array_push($schemas, ['tump' => $file, 'name' => $name, 'img' => $full]);
            }
        }

        $res->data = $schemas;
        $res->success = true;

    }

}