module.exports = app => {
    const { authJwt } = require("../middleware");
    const medication = require("../controllers/medications.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/medications/:cat/:search", [authJwt.verifyToken], medication.findMany);
  };