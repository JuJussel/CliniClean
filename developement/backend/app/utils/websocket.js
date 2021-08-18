const WebSocket = require("ws");

const wssConst = new WebSocket.Server({ server });

wssConst.on("connection", function connection(ws, req) {
    logger.info(`Client Websocket connection from:${req.socket.remoteAddress}`);
    ws.on("message", function message(msg) {});
});

module.exports = wssConst;
