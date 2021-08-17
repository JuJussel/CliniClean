const mongoose = require('./mongo.db')
const Schema = mongoose.Schema;

const ConfigSchema = new Schema({
    _id:  {type: mongoose.ObjectId}
});

module.exports = mongoose.model("sys_config", ConfigSchema);
