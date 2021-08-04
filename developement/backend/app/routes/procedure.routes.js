module.exports = app => {
    const { authJwt } = require("../middleware");
    const procedures = require("../controllers/procedures.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/procedures/categories", [authJwt.verifyToken], procedures.categories.findAll);
    app.get("/api/procedures/:cat/favourites", [authJwt.verifyToken], procedures.favourites.findMany);
    app.get("/api/procedures/:cat/:search", [authJwt.verifyToken], procedures.findMany);
  };