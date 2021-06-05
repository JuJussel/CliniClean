const secrets = require ('./secret')

module.exports = {
  CLINICLEAN: {
    HOST: "localhost",
    USER: "ccuser",
    PASSWORD: secrets.mariaDbPass,
    DB: "cliniclean_dev",
  },
  CLINICLEANMONGO: {
    URL: 'dev01.2zd7t.mongodb.net',
    USER: 'ccapi',
    PASSWORD: secrets.mongoDbPass,
    DB: 'clinicleandev01'
  },
  ORCA: {
    HOST: "192.168.1.200",
    USER: "ccapi",
    PASSWORD: secrets.orcaDbPass,
    DB: "orca"
  }
};
