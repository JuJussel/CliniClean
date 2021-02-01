var https = require('https'),
    fs = require('fs'),
    server = https.createServer(
    {
      key: fs.readFileSync('/etc/pki/tls/certs/key.pem'),
      cert: fs.readFileSync('/etc/pki/tls/certs/cert.pem')
    }),
    io = require('socket.io')(server),
    logger = require('winston'),
    port = 1337;


// Logger config
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true, timestamp: true });
logger.info('SocketIO > listening on port ' + port);

io.on('connection', function (socket){
    logger.info('SocketIO > Connected socket ' + socket.id);
    socket.on('broadcast', function (message) {
        logger.info('ElephantIO broadcast > ' + JSON.stringify(message));

        // send to all connected clients
        io.sockets.emit("broadcast", message);
    });
    socket.on('message', function (message) {
        logger.info('ElephantIO broadcast > ' + JSON.stringify(message));

        // send to all connected clients
        io.sockets.emit("broadcast", message);
    });

    socket.on('disconnect', function () {
        logger.info('SocketIO > Disconnected socket ' + socket.id);
    });
});

server.listen(port);


