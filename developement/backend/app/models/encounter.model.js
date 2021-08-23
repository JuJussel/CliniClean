const mongoose = require('./mongo.db')
const Schema = mongoose.Schema;

// TOTO need to create sub document for koui
// https://stackoverflow.com/questions/39596625/nested-objects-in-mongoose-schemas

const EncounterSchema = new Schema({
    patient: { type: Number, ref: "pub_patients", required: true},
    type: {type:Number, required: true},
    ins: String,
    note: String,
    date: {type: Date, default: Date.now()},
    status: {type:Number, required: true, default: 2},
    endDate: Date,
    locked: Boolean,
    doctor: Number,
    orcaId: Number,
    karte: {type: {}},
    department: {type: String, default: '01'},
    contentSoap: String,
    contentProcedures: String,
    examinationStart: Date,
    examinationEnd: Date,
    editHistory: [String],
    lastChange: {type: Date, default: Date.now},
    order: {type: mongoose.ObjectId}
},{ toJSON: { virtuals: true } });

module.exports = mongoose.model("pub_encounters", EncounterSchema);
