module.exports = app => {
    const { authJwt, routeAccess } = require("../middleware");
    const orders = require("../controllers/orders.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });
  
    app.get('/api/orders', [authJwt.verifyToken, routeAccess(0,1,1)], orders.findAll)
    app.post("/api/orders", [authJwt.verifyToken, routeAccess(0,1,1)], orders.create);
    app.put("/api/orders/:orderId", [authJwt.verifyToken, routeAccess(0,1,1)], orders.update);
    app.delete("/api/orders/:orderId", [authJwt.verifyToken, routeAccess(0,0,1)], orders.delete);

  };