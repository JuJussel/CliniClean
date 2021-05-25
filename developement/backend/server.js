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
const winston = require("./app/utils/logger.util");

const port = 3003;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())
app.use(helmet())
app.use(cors(corsOptions))
app.use('/', routes)

app.use(morgan("combined", { stream: winston.stream }))

https.createServer({
  key: fs.readFileSync('/etc/pki/tls/certs/key.pem'),
  cert: fs.readFileSync('/etc/pki/tls/certs/cert.pem')
}, app)
.listen(port, function () {
  console.log(`Listening on https://localhost:${port}/`)
})