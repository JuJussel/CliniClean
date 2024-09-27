const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    _id: Number,
    name: { type: String, required: true },
    birthdate: { type: Date, required: true },
    visible: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
    doctor: Number,
    files: { type: Array },
    vitals: { type: Array },
    craeted: { type: String, default: new Date() }
}, {
    toJSON: { virtuals: true },
    strict: false
});

module.exports = mongoose.model("pub_patients", PatientSchema);
