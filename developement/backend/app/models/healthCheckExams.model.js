const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const HealthCheckExam = new Schema({
    _id: Schema.Types.ObjectId,
    procedure: { type: String, ref: "sys_procedures"},
    results: [
        { type: String, ref: "sys_procedure_examinations"}
    ],
});

module.exports = mongoose.model("sys_healthcheck_exams", HealthCheckExam);
