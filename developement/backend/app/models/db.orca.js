const pgp = require('pg-promise')(/* options */)
const dbConfig = require("../../config").db;


// Create a connection to the database
const connection_orca = pgp({
  host: dbConfig.ORCA.HOST,
  user: dbConfig.ORCA.USER,
  password: dbConfig.ORCA.PASSWORD,
  database: dbConfig.ORCA.DB
});

module.exports = connection_orca;