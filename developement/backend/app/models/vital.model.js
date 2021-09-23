const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const VitalSchema = new Schema({
    patientId: Number,
    date: {type: Date, default: Date.now()},
    values: {type: Array}
});

module.exports = mongoose.model("pub_patients_vitals", VitalSchema);
