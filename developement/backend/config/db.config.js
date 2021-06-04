const secrets = require ('./secret')

module.exports = {
  CLINICLEAN: {
    HOST: "localhost",
    USER: "ccuser",
    PASSWORD: secrets.mariaDbPass,
    DB: "cliniclean_dev",
  },
  ORCA: {
    HOST: "192.168.1.200",
    USER: "ccapi",
    PASSWORD: secrets.orcaDbPass,
    DB: "orca"
  }
};
