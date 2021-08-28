const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
    _id:  {type: mongoose.ObjectId}
});

module.exports = mongoose.model("pub_setting", SettingSchema);
