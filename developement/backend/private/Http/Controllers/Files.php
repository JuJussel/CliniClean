<?php

namespace App\Http\Controllers;
use App\Database\Queries\File;
use stdClass;

class Files {

    public function get($req, $res) {

        $file = $req->params->file;
        $type = $req->params->type;

        $file = $GLOBALS['file_upload_location'] . $file . '.' . $type;

        if ($type === 'png') {
            $img = imagecreatefrompng($file);
            imagealphablending( $img, false ); //To preserve alpha - otherwise will end up with black background
            imagesavealpha( $img, true ); //To preserve alpha - otherwise will end up with black background
            header('Content-type: image/png');
            imagepng($img);
        } else if ($type === 'jpeg' || $type === 'jpg') {
            header('Content-type: image/jpeg');
            imagejpeg(imagecreatefromjpeg($file));
        } else if ($type === 'pdf') {
            header('Content-type: application/pdf');
            readfile($file);
        }
        exit;
    }

    public function post($req, $res) {

        if(!isset($_FILES['files'])) {
            $req->msg = 'No files attached';
            return;
        }

        $resultURL = "";
        $errors = [];
        $path = $GLOBALS['file_upload_location'];
        $extensions = $GLOBALS['allowed_ext'];
        $file_upload_file_list = [];
        $files_data = $req->post->data;
        $patient_id = $files_data->fileMeta->info;
        $type = $files_data->fileMeta->type;
        $all_files = count($_FILES['files']['tmp_name']);
        $res->data=[];

        for ($i = 0; $i < $all_files; $i++) {

            $file_name = round(microtime(true)).mt_rand() . random_int(1000,9999);
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file_type = $_FILES['files']['type'][$i];
            $file_size = $_FILES['files']['size'][$i];
            $ext_tmp = explode('.', $_FILES['files']['name'][$i]);
            $file_ext = strtolower(end($ext_tmp));
            $meta = $files_data->fileMeta->fileInfo[$i];

            if ($meta === "soapSchema") {
              $file_ext = "png";
            } else if ($meta === "xraySchema") {
              $file_ext = "png";
              $file_name = $files_data->fileMeta->schemaID;
            }
        
            $file = $path . $file_name . '.' . $file_ext;
        
            if (!in_array($file_ext, $extensions)) {
              $errors[] = 'この拡張子をアップロードできません: ' . $file_name . ' ' . $file_type;
            }
        
            if ($file_size > $GLOBALS['max_file_size']) {
                $errors[] = 'ファイルサイズが大きすぎます: ' . $file_name . ' ' . $file_type;
            }

            if (empty($errors)) {

                move_uploaded_file($file_tmp, $file);

                $query_data = new stdClass();
                $query_data->patient_id = $patient_id;
                $query_data->file_name = $file_name;
                $query_data->meta = $meta;
                $query_data->type = $type;
                $query_data->file_ext = $file_ext;
         
                $db_data = new File();
                $query = $db_data->post($query_data);
                if (!$query->ok) {
                    $res->message = $query->msg;
                    return;
                } 

                array_push($res->data, $file_name . '.' . $file_ext);
            }
        }
        $res->success = true;
    }
}