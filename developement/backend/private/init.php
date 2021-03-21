<?php

/**
 * The entry point for all requests
 * This is the place to define headers, session_start, ob_start, ini_set, etc.
 */

//header('Content-Type: application/json');

require_once __DIR__ . '/Config/globals.php';
$config = parse_ini_file(__DIR__ .'/Config/config.ini', true, INI_SCANNER_TYPED);
$available_routes = parse_ini_file(__DIR__ .'/Config/routes.ini', true, INI_SCANNER_TYPED);
// var_dump($GLOBALS['config']);
// // var_dump($config);
// return;


spl_autoload_register(function($class) {
    require_once __DIR__ . str_replace('\\', '/', substr($class, 3)) . '.php';
});

new App\App\App();

exit;
