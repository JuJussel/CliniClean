const mongoose = require("mongoose");
const dbConfig = require("../../config/db.config");
const user = dbConfig.CLINICLEANMONGO.USER;
const pass = dbConfig.CLINICLEANMONGO.PASSWORD;
const url = dbConfig.CLINICLEANMONGO.URL;
const database = dbConfig.CLINICLEANMONGO.DB;
const dbPath = `mongodb+srv://${user}:${pass}@${url}/${database}`;
const dbOptions = {
    useNewUrlParser: true,
	useUnifiedTopology: true,
    useFindAndModify: false
}

mongoose.connect(
    dbPath,
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    (err, client) => {
        if (err) {
            $logger.error(err)
        }
        $logger.info('Connected to MongoDB!')
    }
);

module.exports = mongoose