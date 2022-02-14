
module.exports = (app) => {
    const { authJwt, routeAccess } = require("../middleware");
    const doctors = require("../controllers/doctors.controller.js");

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/doctors", [authJwt.verifyToken, routeAccess([2,2,2])], doctors.findAll);
};
