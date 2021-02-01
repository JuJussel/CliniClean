<?php
namespace App\Http\Controllers;

use App\Database\Queries\User;

class Sessions {

    public function get($req, $res) {

        $timeout = $GLOBALS['session']['lifetime'];
        $current = time();
        $lastAct = $_SESSION['last_activity_time'];
        $rem = $timeout - ($current - $lastAct);
      
        $res->data = floor($rem / 60);
        $res->success = true;

    }

    public function post($req, $res) {

        $req_data = [       
            'user' => strip_tags(trim($req->post->data->user)),
            'upass' => strip_tags(trim($req->post->data->pass)),
            'is_mobile' => $req->post->data->mobile
        ];

        $db = new User();
        $query = $db->auth($req_data['user']);

        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $query = $query->data[0];

        $authenticated = password_verify($req_data['upass'], $query['password']);

        if ($authenticated) {
            session_regenerate_id();
            $res->data->ok = true;
            $_SESSION['user'] = $query['id'];
            $_SESSION['loggedin_time'] = time();
            $_SESSION['IP'] = $_SERVER['REMOTE_ADDR'];
            $_SESSION['last_activity_time'] = time();
            if ($req_data['is_mobile']) {
                $req->data->location = '/mobile/home';
            } else {
                $res->data->location = '/home';
            }
        } else {
            session_destroy();
            $res->data->ok = false;
        }

        $res->success = true;

    }

    public function update($req, $res) {

        $_SESSION['last_activity_time'] = time();
        $res->success = true;

    }

    public function destroy($req, $res) {

        if (isset($_POST['session_id']) && trim($_POST['session_id']) != "") {
            session_id(trim($_POST['session_id']));
        }

        $params = session_get_cookie_params();
        setcookie(session_name(), '', 0, $params['path'], $params['domain'], $params['secure'], isset($params['httponly']));
        setcookie (session_name(), "", time() - 3600);
        session_destroy();
        session_write_close();

        $res->data = '/';
        $res->success = true;

    }


}