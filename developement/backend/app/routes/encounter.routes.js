module.exports = app => {
    const { authJwt } = require("../middleware");
    const encounter = require("../controllers/encounters.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });
  
    // Retrieve all Encounters for today
    app.get("/api/encounters/range", [authJwt.verifyToken], encounter.findRange);

    // Create new Enconter
    app.post("/api/encounters", [authJwt.verifyToken], encounter.create);

    // Edit Encounter
    app.put("/api/encounters/:encounterId", [authJwt.verifyToken], encounter.edit)

  };