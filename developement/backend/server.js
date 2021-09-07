const express = require('express');
const fs = require('fs')
const https = require('https')
const cors = require("cors");
const routes = require('./app/routes');
const app = express();
const helmet = require('helmet');
const corsOptions = require('./config').cors
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const server = https.createServer({
  key: fs.readFileSync('/etc/pki/tls/certs/key.pem'),
  cert: fs.readFileSync('/etc/pki/tls/certs/cert.pem')
}, app);
const port = 3003;

require("./app/utils/logger.util");
require('./app/utils/websocket.util')(server);

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("short", { stream: $logger.stream }));
app.use('/', routes);

server.listen(port, function () {
  console.log(`Listening on https://localhost:${port}/`);
  $logger.info(`Listening on https://localhost:${port}/`)
})
