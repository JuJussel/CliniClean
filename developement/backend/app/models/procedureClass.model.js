const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const procedureClassShema = new Schema({
    _id:  String,
    name: String
});

module.exports = mongoose.model("sys_procedure_classes", procedureClassShema);
