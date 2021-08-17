const WebSocket = require("ws");
const { authJwt } = require("../middleware");

module.exports = server => {
    const wss = new WebSocket.Server({ server });
    
    wss.on("connection", function connection(ws, req) {
        $logger.info(`Client Websocket connection from:${req.socket.remoteAddress}`);
        ws.on("message", function message(msg) {
            handleMessages(msg);
        });
    });

    server.on("upgrade", function upgrade(request, socket, head) {
        console.log(authJwt.verifyToken);
    });

    const handleMessages = message => {
    }

    global.$wss ={
        broadcast: message => {
            wss.clients.forEach(function each(client) {

                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        }
    }

}
