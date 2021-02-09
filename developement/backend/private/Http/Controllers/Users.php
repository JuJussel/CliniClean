<?php
namespace App\Http\Controllers;

use App\Database\Queries\User;
use App\Middleware\Orcaapi;

class Users {

    private function passwordStrong($res, $pass) {

        $uppercase = preg_match('@[A-Z]@', $pass);
        $lowercase = preg_match('@[a-z]@', $pass);
        $number    = preg_match('@[0-9]@', $pass);
        $specialChars = preg_match('@[^\w]@', $pass);
        if(!$uppercase || !$lowercase || !$number || !$specialChars || strlen($pass) < 8) {
            $res->message = "パスワード条件満たしてません。";
            return false;
        }
        return true;

    }

    private function create_orca($res, $request_data) {

        $orca = new Orcaapi();
        $query = $orca->create_user($request_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return false;
        }
        return true;

    }

    private function edit_orca($res, $request_data) {

        $orca = new Orcaapi();
        $query = $orca->edit_user($request_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return false;
        }
        return true;

    }

    private function edit_orca_password($res, $request_data) {

        $orca = new Orcaapi();
        $query = $orca->edit_user_password($request_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return false;
        }
        return true;

    }

    private function delete_orca($res, $request_data) {

        $orca = new Orcaapi();
        $query = $orca->delete_user($request_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return false;
        }
        return true;

    }


    public function get($req, $res) {

        if (!$req->post) {
            
            $id = $_SESSION['user'];

            $db = new User();
            $query = $db->get($id);

            if(!$query->ok) {
                $res->message = $query->msg;
                return;
            }

            $res->data = $query->data[0];
            $res->success = true;

        }

        $res->success = true;

    }

    public function all($req, $res) {

        $db = new User();
        $query = $db->all();

        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        foreach ($query->data as $key => $value) {
            $query->data[$key]['has_orca'] = boolval($value['has_orca']);
            $query->data[$key]['active'] = boolval($value['active']);
        }
        $res->data = $query->data;
        $res->success = true;

    }

    public function update($req, $res) {

        $request_data = $req->update[0];
        $db = new User();
        
        if (isset($request_data->changePassword)) {

            if (!$this->passwordStrong($res,$request_data->password)) {
                return;
            }

            if ($request_data->has_orca) {
                $or = $this->edit_orca_password($res, $request_data);
                if(!$or) return;
            }
    
            $query = $db->update_password($request_data);

            if(!$query->ok) {
                $res->message = $query->msg;
                return;
            }
            $res->success = true;
            return;
    
        }

        if($request_data->has_orca !== $request_data->had_orca) {

            if ($request_data->has_orca) {

                $db = new User();
                $query = $db->auth($request_data->user_name);
        
                if(!$query->ok) {
                    $res->message = $query->msg;
                    return;
                }
        
                $query = $query->data[0];
        
                $authenticated = password_verify($request_data->password, $query['password']);
        
                if (!$authenticated) {
                    $res->message = "ユーザーパスワードが正しくありません。";
                    return;
                }
                $or = $this->create_orca($res, $request_data);
                if (!$or) return;

            } else {
                $or = $this->delete_orca($res, $request_data);
                if (!$or) return;
            }
        }

        if ($request_data->has_orca) {
            $or = $this->edit_orca($res, $request_data);
            if(!$or) return;
        }

        $query = $db->update($request_data);

        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        $res->success = true;

    }

    public function post($req, $res) {

        $request_data = $req->post->data;

        if (!$this->passwordStrong($res,$request_data->password)) {
            return;
        }

        if ($request_data->has_orca) {
            $or = $this->create_orca($res, $request_data);
            if(!$or) return;
        }

        $db = new User();
        $query = $db->create($request_data);

        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $res->success = true;

    }

    
    public function delete($req, $res) {

        $request_data = $req->post->data;

        if ($request_data->has_orca) {
            $or = $this->delete_orca($res, $request_data);
            if(!$or) return;
        }

        $db = new User();
        $query = $db->delete($request_data);

        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }


        $res->success = true;

    }

}