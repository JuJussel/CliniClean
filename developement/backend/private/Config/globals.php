<?php

// Do not change values inside here.
// Use config.ini to adjust settings

$GLOBALS['controllers'] = __DIR__ . '/../Http/Controllers';

// Connectivity
$GLOBALS['host'] = gethostname();
$GLOBALS['host_ip'] = gethostbyname($GLOBALS['host']);
$GLOBALS['websocket_host'] = 'https://' . $GLOBALS['host_ip'];
$GLOBALS['websocket_port'] = '1337';

// Database Connections
$GLOBALS['db'] = [
    'cliniclean' => [
        'dbhost' => 'localhost',
        'dbuser' => 'ccuser',
        'dbpass' => 'Passw0rd',
        'dbname' => 'cliniclean'
    ],
    'clinicalc' => [
        'dbhost' => 'localhost',
        'dbuser' => 'ccuser',
        'dbpass' => 'Passw0rd',
        'dbname' => 'clinicalc'
    ],
    'orca' => [
        'dbhost' => '192.168.1.200',
        'dbuser' => 'ccapi',
        'dbpass' => 'DE73khYe2'
    ]
];

// Orca API
$GLOBALS['orcaapi'] = [
    'url' => 'http://192.168.1.200:8000',
    'user' => 'ormaster',
    'pass' => 'Passw0rd'
];

//Orca Custom Koui Codes
$GLOBALS['orca_cust_kc'] = [
    'kenkoushindan' => '095110001'
];

// Session and Security
$GLOBALS['session'] = [
    'lifetime' => 1200 //Session lifetime in seconds
];

// Storage
$GLOBALS['base_path'] = dirname($_SERVER["DOCUMENT_ROOT"]);
$GLOBALS['file_upload_location'] = $GLOBALS['base_path'] . "/private/Storage/";
$GLOBALS['asset_schema_folder'] = $GLOBALS['base_path'] . "/public/assets/schemas/";
$GLOBALS['allowed_ext'] = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx'
];
$GLOBALS['max_file_size'] = 20971520; //Max upload filesize in bytes. Deafult: 20MB

// Link to Accounting Software
$GLOBALS['accounting'] = [
    //Set to true if CliniCalc is used
    'useCliniCalc' => false,
    //Full URL of CliniCAlc API 
    'cliniCalcAPI' => "https://192.168.1.89/clinicalc/API",
    // Set to true to emit an event to websocket server in case of accounting action
    'websocetEmit' => false
];
