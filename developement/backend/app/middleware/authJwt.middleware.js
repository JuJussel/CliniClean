const jwt = require("jsonwebtoken");
const config = require("../../config").auth;

verifyToken = (req, res, next) => {

    let token = req.cookies.token
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id;
      next();
    });
  };
verifyTokenWs = (token) => {
  let ok = false;
  jwt.verify(token, config.secret, (err) => {
    if (!err) {
      ok = true;
    }
  });
  return ok;
}

  const authJwt = {
      verifyToken: verifyToken,
      verifyTokenWs: verifyTokenWs
  };
  module.exports = authJwt;