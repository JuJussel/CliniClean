const authJwt = require("./authJwt.middleware");
const routeAccess = require("./routeAccess.middleware");

module.exports = {
  authJwt,
  routeAccess
};