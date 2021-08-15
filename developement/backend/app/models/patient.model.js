const mongoose = require('./mongo.db')
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    _id: Number,
    name: {type:String, required: true},
    birthdate: {type: Date, required: true},
    visible: {type: Boolean, default: true},
    active: {type: Boolean, default: true},
    doctor: Number,
    files: {type: Array}
},{ toJSON: { virtuals: true } });

module.exports = mongoose.model("pub_patients", PatientSchema);
