module.exports = app => {
    const { authJwt } = require("../middleware");
    const notifications = require("../controllers/notifications.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });
  
    app.get(
      "/api/notifications",
      [authJwt.verifyToken],
      notifications.find
    );
    app.put(
      "/api/notifications/:id",
      [authJwt.verifyToken],
      notifications.update
    );  

  };