module.exports = app => {
    const { authJwt, routeAccess } = require("../middleware");
    const users = require("../controllers/users.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/api/users/:userId", [authJwt.verifyToken], users.findOne);
    app.get("/api/users/:userId/favourites", [authJwt.verifyToken], users.findFavourites);
    app.get("/api/users", [authJwt.verifyToken], users.findAll);

    app.put("/api/users/:userId/favourites", [authJwt.verifyToken], users.updateFavourites);
    app.put("/api/users/:userId", [authJwt.verifyToken, routeAccess([0,0,0])], users.updateUser);
  
  };