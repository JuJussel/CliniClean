<?php

namespace App\Middleware;

use App\Middleware\Websocket\Client;
use App\Middleware\Websocket\Engine\SocketIO\Version1X;


class Websocket{

    public function __construct() {

        $host = $GLOBALS['websocket_host'];
        $port = $GLOBALS['websocket_port'];
        $ws_host = $host . ':' . $port;

        $this->client = new Client(new Version1X($ws_host, [
            'context' => [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ],
        ]));

    }
}
