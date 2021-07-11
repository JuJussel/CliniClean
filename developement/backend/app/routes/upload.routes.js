module.exports = app => {
    const { authJwt } = require("../middleware");
    const uploads = require("../controllers/uploads.controller.js");

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next()
    })
    
    app.post(
      "/api/uploads",
      [authJwt.verifyToken],
      uploads.create
    )

  }