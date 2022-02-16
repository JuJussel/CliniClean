module.exports = app => {
    const { authJwt, routeAccess } = require("../middleware");
    const procedures = require("../controllers/procedures.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/procedures/:cat/search/:search", [authJwt.verifyToken], procedures.findMany);
    app.get("/api/procedures/:code/examresults", [authJwt.verifyToken], procedures.results.findMany);
    app.post("/api/procedures/fetchAndImport", [authJwt.verifyToken, routeAccess(0,0,0)], procedures.fetchAndImport);

  };