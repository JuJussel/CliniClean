const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const StaticListSchema = new Schema({
    _id: { type: mongoose.ObjectId }
});

module.exports = mongoose.model("sys_static_lists", StaticListSchema);
