const { authJwt } = require("../middleware");

module.exports = function(app) {
    const auth = require("../controllers/auth.controller");

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/login", auth.login);
    app.delete("/api/auth/logout", auth.logout);
    app.get("/api/auth/check",[authJwt.verifyToken], auth.check);

};