module.exports = app => {
    const { authJwt } = require("../middleware");
    const users = require("../controllers/users.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });
    app.get(
      "/api/users/:userId",
      [authJwt.verifyToken],
      users.findOne
    );
  
  };