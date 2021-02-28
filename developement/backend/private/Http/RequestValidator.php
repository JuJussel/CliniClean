<?php
namespace App\Http;

use stdClass;

/**
 * Bring your own validations
 *
 * Call validations in App/App.php
 */
class RequestValidator {


  /**
   * @return success boolean
   * @return message string
   */
  public function auth($req) {

    $auth = new stdClass();
    $IP = $_SERVER['REMOTE_ADDR'];

    ini_set('session.cookie_httponly', 1);

    ini_set('session.use_only_cookies', 1);

    ini_set('session.cookie_secure', 1);

    session_start();

    if (isset($_SESSION['user']) && $IP === $_SESSION['IP']) {

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
        $auth->message = 'Session Invalid';
      }


    }

    return $auth;
  }

}
