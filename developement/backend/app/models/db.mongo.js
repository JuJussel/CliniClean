const mongoose = require("mongoose");
const dbConfig = require("../../config").db;
const user = dbConfig.cliniCleanMongo.user;
const pass = dbConfig.cliniCleanMongo.password;
const url = dbConfig.cliniCleanMongo.url;
const database = dbConfig.cliniCleanMongo.db;
const dbPath = `mongodb+srv://${user}:${pass}@${url}/${database}`;
const dbOptions = {};

mongoose.connect(
    dbPath,
    dbOptions, 
    (err, client) => {
        if (err) {
            console.log(err);
            $logger.error(err)
        }
        $logger.info('Connected to MongoDB!')
    }
);

module.exports = mongoose