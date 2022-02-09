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
      "/api/settings/public",
      [authJwt.verifyToken],
      Settings.findPublic
    );

    app.get(
      "/api/settings/frontend",
      Settings.findFrontEnd
    );

  
  };