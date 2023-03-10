const express = require('express');
const fs = require('fs')
const config = require('./config')
const https = require('https')
const cors = require("cors");
const routes = require('./app/routes');
const app = express();
const helmet = require('helmet');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const server = https.createServer({
  key: fs.readFileSync(config.app.certPath),
  cert: fs.readFileSync(config.app.certKeyPath)
}, app);
const port = config.app.port;


require("./app/utils/logger.util");
require('./app/utils/websocket.util')(server);

app.use(express.json({ limit: config.app.uploadLimit }))
app.use(express.urlencoded({
  extended: true,
  limit: config.app.uploadLimit
}));
app.use(cookieParser());
app.use(helmet());
app.use(cors(config.cors));
app.use(morgan("short", { stream: $logger.stream }));
app.use('/', routes);

server.listen(port, function () {
  console.log(`Listening on https://localhost:${port}/`);
  $logger.info(`Listening on https://localhost:${port}/`)
})
