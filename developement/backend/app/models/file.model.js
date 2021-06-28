const mongoose = require('./mongo.db')
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    _id: {type: mongoose.ObjectId},
    name: {type:String, required: true},
    size: Number,
    type: {type:String, required: true},
    meta: {}
},{ toJSON: { virtuals: true } });

module.exports = mongoose.model("pub_files", FileSchema);
