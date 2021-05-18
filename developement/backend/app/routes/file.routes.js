
module.exports = app => {
  const express = require('express');
  const { authJwt } = require("../middleware");
  const envConfig = require("../../env");

  app.use('/files', [authJwt.verifyToken, express.static(envConfig.PROJECT_DIR + '/storage')]);

};