module.exports = app => {
    const { authJwt, routeAccess } = require("../middleware");
    const encounter = require("../controllers/encounters.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });
  
    // Retrieve all Encounters for today
    app.get("/api/encounters/range", [authJwt.verifyToken, routeAccess([1,1,1])], encounter.findRange);

    // Retrieve one Encounter
    app.get("/api/encounters/:encounterId", [authJwt.verifyToken, routeAccess([1,1,1])], encounter.findOne);

    // Create new Enconter
    app.post("/api/encounters", [authJwt.verifyToken, routeAccess([1,0,1])], encounter.create);

    // Edit Encounter
    app.put("/api/encounters/:encounterId", [authJwt.verifyToken, routeAccess([1,0,1])], encounter.edit)

  };