
const path = require('path');
const fs = require('fs');
const envConfig = require("../../env");
const schemaPath = path.join(envConfig.PROJECT_DIR, 'assets', 'schemas');

exports.findAll = (req,res) => {

  fs.readdir(schemaPath, function (err, schemas) {

    if (err) {
      res.status(500).send({
        message: err
      });
    } 

    schemas = schemas.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

    res.send(schemas);
  });
}