module.exports = app => {
    const { authJwt } = require("../middleware");
    const encounterTypes = require("../controllers/encounterTypes.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/lists/encounterTypes",[authJwt.verifyToken], encounterTypes.findAll);
  
  };