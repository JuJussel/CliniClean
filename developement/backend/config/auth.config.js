const secrets = require ("./secret");

module.exports = {
  secret: secrets.jwt,
  lifetime: 3600, //JWT lifetime in seconds
};
