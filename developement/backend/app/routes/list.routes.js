module.exports = app => {
    const { authJwt } = require("../middleware");
    const lists = require("../controllers/lists.controller")

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/lists/encounterTypes",[authJwt.verifyToken], lists.encounterTypes.findAll);
    app.get("/api/lists/insuranceProviders/:number",[authJwt.verifyToken], lists.insuranceProviders.findOne);
    app.get("/api/lists/addresses/:zip",[authJwt.verifyToken], lists.addresses.findOne);
    app.get("/api/lists/schemas",[authJwt.verifyToken], lists.schemas.findAll);
    app.get("/api/lists/diseases/:query",[authJwt.verifyToken], lists.diseases.findMany);
    app.get("/api/lists/static",[authJwt.verifyToken], lists.static.findAll);
    app.get("/api/lists/healthCheckExams",[authJwt.verifyToken], lists.healthCheckExams.findAll);


  };