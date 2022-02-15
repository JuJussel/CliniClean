
module.exports = app => {
  const express = require('express');
  const { authJwt, routeAccess } = require("../middleware");
  const envConfig = require("../../env");

  app.use('/assets/schemas', [authJwt.verifyToken, express.static(envConfig.PROJECT_DIR + '/assets/schemas')]);

};