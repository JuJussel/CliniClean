module.exports = app => {
    const { authJwt } = require("../middleware");
    const configs = require("../controllers/configs.controller")

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/configs",[authJwt.verifyToken], configs.findAll);

  };