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
    // Create a new Encounter
    // app.post("api/encounters", user.create);
  
    // Retrieve all Encounters
    // app.get("/api/encounters",[authJwt.verifyToken], encounter.findAll);
  
    // Retrieve all Encounters for today
    app.get("/api/encounters/range", [authJwt.verifyToken], encounter.findRange);

    // Retrieve a single Customer with encounterId
    // app.get("/api/encounters/:encounterId", [authJwt.verifyToken], encounter.findOne);
  
    // // Update a Customer with encounterId
    // app.put("/encounters/:encounterId", encounter.update);
  
    // // Delete a Customer with encounterId
    // app.delete("/encounters/:encounterId", encounter.delete);
  };