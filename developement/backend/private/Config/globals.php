<?php

// Do not change values inside here
// Use config.ini to adjust settings
// Change at your own risk!

$GLOBALS['controllers'] = __DIR__ . '/../Http/Controllers';

// Connectivity
$GLOBALS['host'] = gethostname();
$GLOBALS['host_ip'] = gethostbyname($GLOBALS['host']);
$GLOBALS['websocket_host'] = 'https://' . $GLOBALS['host_ip'];
$GLOBALS['websocket_port'] = '1337';

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