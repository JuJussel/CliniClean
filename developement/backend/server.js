const express = require('express');
const fs = require('fs')
const https = require('https')
const cors = require("cors");
const bodyParser = require('body-parser');
const routes = require('./app/routes');
const app = express();
const helmet = require('helmet');
const corsOptions = require('./config/cors.config')
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./app/utils/logger.util");
global.$logger = logger;

const port = 3003;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())
app.use(helmet())
app.use(cors(corsOptions))
app.use(morgan("short", { stream: logger.stream }))
app.use('/', routes)


https.createServer({
  key: fs.readFileSync('/etc/pki/tls/certs/key.pem'),
  cert: fs.readFileSync('/etc/pki/tls/certs/cert.pem')
}, app)
.listen(port, function () {
  logger.info(`Listening on https://localhost:${port}/`)
})