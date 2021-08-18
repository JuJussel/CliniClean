const WebSocket = require("ws");
const { authJwt } = require("../middleware");

module.exports = server => {
    
    // Authenticate
    server.on("upgrade", function upgrade(request, socket, head) {
        if (!request.headers.cookie) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }
        let token = request.headers.cookie.split("token=")[1];
        if (!authJwt.verifyTokenWs(token)) {
            console.log('NG');
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }
    });
    // Authenticate End
    
    const wss = new WebSocket.Server({ server });
    
    wss.on("connection", function connection(ws, req, client) {
        $logger.info(
            `Client Websocket connection from:${req.socket.remoteAddress}`
        );
        ws.on("message", function message(msg) {
            handleMessages(msg);
        });
    });

    const handleMessages = (message) => {};

    global.$wss = {
        broadcast: (message) => {
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        },
    };
}
