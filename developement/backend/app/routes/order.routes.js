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
  
    app.get('/api/orders', [authJwt.verifyToken], orders.findAll)
    app.post("/api/orders", [authJwt.verifyToken], orders.create);
    app.delete("/api/orders/:orderId", [authJwt.verifyToken], orders.delete);

  };