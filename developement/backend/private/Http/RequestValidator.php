<?php
namespace App\Http;

use stdClass;

/**
 * Bring your own validations
 *
 * Call validations in App/App.php
 */
class RequestValidator
{

    /**
     * @return success boolean
     * @return message string
     */

    private function authentication_check($req)
    {

        if (!isset($_COOKIE['PHPSESSID'])) {
            return false;
        }

        // Start Session
        session_start();

        // Check if session is set
        if (!isset($_SESSION['user'])) {
            return false;
        }

        // Check if session is still active
        $time = time();

        if (($time - $_SESSION['last_activity_time']) > $GLOBALS['config']['session']['lifetime']) {
            return false;
        }

        if ($req->route[0] !== 'Sessions') {
            $_SESSION['last_activity_time'] = $time;
        }

        return true;

    }

    private function network_check()
    {

        $IP = $_SERVER['REMOTE_ADDR'];

        if ($IP === $_SESSION['IP']) {
            return true;
        }
        return false;

    }

    private function authorization_check($route, $method)
    {

        // Admin group has all permissions
        if ($_SESSION['group'] === 2) {
            return true;
        }

        $route_permission = $GLOBALS['available_routes'][$route];

        $user_permissions = $_SESSION['permissions'];

        $permission = 0;
        if (isset($route_permission['all'])) {
            $permission = $route_permission['all'];
        }

        $method_permission = $GLOBALS['available_routes']['access_level'][$method];

        foreach ($route_permission as $key => $value) {

            if ($key !== 'all') {
                if (isset($user_permissions[$key])) {
                    if ($user_permissions[$key] > $value) {
                        $permission = $value;
                    } else {
                        $permission = $user_permissions[$key];
                    }
                }
            }

        }

        if ($method_permission > $permission) {
            return false;
        }

        return true;

    }

    private function reject()
    {

        $ret = new stdClass();
        $ret->success = false;
        $ret->message = 'Access Denied';
        return $ret;

    }

    private function accept()
    {

        $ret = new stdClass();
        $ret->success = true;
        return $ret;

    }

    public function auth($req)
    {

        $route = $req->route[0];

        if ($route === 'Sessions' && isset($req->post)) {

            return $this->accept();

        }

        if (!$this->authentication_check($req)) {
            return $this->reject();
        }

        if (!$this->network_check()) {
            return $this->reject();
        }

        if (!$this->authorization_check($req->route[0], $req->method)) {
            return $this->reject();
        }

        return $this->accept();

    }

}
