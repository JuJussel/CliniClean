module.exports = app => {
    const { authJwt } = require("../middleware");
    const Settings = require("../controllers/settings.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });
  
    app.get(
      "/api/clinicinfo",
      [authJwt.verifyToken],
      Settings.findClinicInfoPublic
    );
  
  };