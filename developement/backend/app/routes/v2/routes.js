module.exports = app => {
    const { authJwt, routeAccess } = require("../../middleware");
    const orders = require("../../controllers/orders.controller.js");

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/api/v2/data', [authJwt.verifyToken, routeAccess([0, 1, 1])], orders.findAll)

};