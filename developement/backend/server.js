const express = require('express');
const fs = require('fs')
const https = require('https')
const cors = require("cors");
const bodyParser = require('body-parser');
const routes = require('./app/routes');
const app = express();
const port = 3003;

const corsOptions = {
  origin: "http://localhost:8081"
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors(corsOptions));
app.use('/', routes)

https.createServer({
  key: fs.readFileSync('/etc/pki/tls/certs/key.pem'),
  cert: fs.readFileSync('/etc/pki/tls/certs/cert.pem')
}, app)
.listen(3003, function () {
  console.log(`Listening on https://localhost:${port}/`)
})