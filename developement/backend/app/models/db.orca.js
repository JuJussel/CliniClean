const pgp = require('pg-promise')(/* options */)
const dbConfig = require("../../config").db;


// Create a connection to the database
const connection_orca = pgp({
  host: dbConfig.orca.host,
  user: dbConfig.orca.user,
  password: dbConfig.orca.password,
  database: dbConfig.orca.db
});

module.exports = connection_orca;