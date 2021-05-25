const mysql = require("mysql");
const dbConfig = require("../../config/db.config");

// Create a connection to the database
const connection_cliniclean = mysql.createConnection({
  host: dbConfig.CLINICLEAN.HOST,
  user: dbConfig.CLINICLEAN.USER,
  password: dbConfig.CLINICLEAN.PASSWORD,
  database: dbConfig.CLINICLEAN.DB
});

// open the MySQL connection
connection_cliniclean.connect(error => {
  if (error) {
    $logger.error(error)
  }
    
  $logger.info("Successfully connected to the database.");
});

module.exports = connection_cliniclean;