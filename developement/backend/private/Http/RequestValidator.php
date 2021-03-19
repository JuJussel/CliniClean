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

    private function authorization_check($net)
    {

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

        if ($req->route[0] === 'Sessions' && isset($req->post)) {

            return $this->accept();

        }

        if (!$this->authentication_check($req)) {
            return $this->reject();
        }

        if (!$this->network_check()) {
            return $this->reject();
        }

        return $this->accept();

    }

    public function auth1($req)
    {

        $auth = new stdClass();
        $IP = $_SERVER['REMOTE_ADDR'];

        // Set Cookie params
        ini_set('session.cookie_httponly', 1);
        ini_set('session.use_only_cookies', 1);
        ini_set('session.cookie_secure', 1);

        // Start Session
        session_start();

        if ($this->authentication_check() && $this->network_check($IP)) {

            $time = time();

            if (($time - $_SESSION['last_activity_time']) > $GLOBALS['config']['session']['lifetime']) {
                $auth->success = false;
                $auth->message = 'Session Invalid';
            }

            if ($req->route[0] !== 'Sessions') {
                $_SESSION['last_activity_time'] = $time;
            }

            $auth->success = true;

        } else {

            if ($req->route[0] === 'Sessions') {
                $auth->success = true;
            } else {
                $auth->success = false;
                $auth->message = 'Access Denied';
            }

        }

        return $auth;

    }

}
