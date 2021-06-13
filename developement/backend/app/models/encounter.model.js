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
    department: {type: Number, default: 1},
    contentSoap: String,
    contentProcedures: String,
    examinationStart: Date,
    examinationEnd: Date,
    editHistory: [String],
    lastChange: {type: Date, default: Date.now}
},{ toJSON: { virtuals: true } });

module.exports = mongoose.model("pub_encounters", EncounterSchema);
// const sql = require("./db.js");

// const Encounter = {}

// Encounter.findRange = (range, result) => {

//     const start = range.start
//     const end = range.end
//     sql.query(
//         `   SELECT 
//                 r.id, r.patient_id AS patientID,
//                 r.type,
//                 r.ins,r.memo,
//                 r.status,
//                 r.doctor,
//                 r.locked,
//                 r.shinsatu_start,
//                 r.shinsatu_end,
//                 r.date,
//                 r.orca_id,
//                 time(date) AS time,
//                 time(last_change) AS lastChange,
//                 p.name
//             FROM usr_encounters  r
//             INNER JOIN usr_patients p ON r.patient_id = p.id
//             WHERE date(date) BETWEEN ? AND ?
//             ORDER BY time
//         `, 
//         [start, end],
//         (err, res) => {

//             if (err) {
//                 $logger.error(err);
//                 result(err, null);
//                 return;
//             }

//             result(null, res);
//             return;
//         }
//     );
// };

// Encounter.create = (data, result) => {
//     sql.query(
//         `   INSERT INTO usr_encounters (
//                 patient_id,
//                 type,
//                 date,
//                 ins,
//                 memo,
//                 status
//             )
//             VALUES (?,?,?,?,?,?)
//         `, 
//         [data.id, data.type, data.date, data.ins, data.memo, data.status],
//         (err, res) => {

//             if (err) {
//                 $logger.error(err)
//                 result(err, null);
//                 return;
//             }

//             result(null, {id: res.insertId});
//             return;
//         }
//     );
// }

// module.exports = Encounter;