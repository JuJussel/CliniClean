module.exports = app => {
  const { authJwt, routeAccess } = require("../middleware");
  const persons = require("../controllers/persons.controller.js");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next()
  })

  app.get("/api/persons/search/", [authJwt.verifyToken], persons.findMany)

}