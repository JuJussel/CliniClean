module.exports = app => {
    const { authJwt } = require("../middleware");
    const encounterTypes = require("../controllers/encounterTypes.controller.js");
    const occupations = require("../controllers/occupations.controller.js");
    const insuranceProviders = require("../controllers/insuranceProviders.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/lists/encounterTypes",[authJwt.verifyToken], encounterTypes.findAll);
    app.get("/api/lists/occupations",[authJwt.verifyToken], occupations.findAll);
    app.get("/api/lists/insuranceProviders/:number",[authJwt.verifyToken], insuranceProviders.findOne);

  };