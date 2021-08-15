module.exports = app => {
    const { authJwt } = require("../middleware");
    const orders = require("../controllers/orders.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });
  
    // Create new Enconter
    app.post("/api/orders", [authJwt.verifyToken], orders.create);

  };