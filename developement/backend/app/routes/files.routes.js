
module.exports = (app) => {
    const { authJwt, routeAccess } = require("../middleware");
    const files = require("../controllers/files.controller.js");

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/files", [authJwt.verifyToken, routeAccess([1, 1, 1])], files.findMany);
};
