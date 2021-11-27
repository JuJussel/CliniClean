const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const HealthCheckExam = new Schema({
    _id: Schema.Types.ObjectId,
    results: [
        { type: Schema.Types.ObjectId, ref: "sys_examination_procedures"}
    ],
});

module.exports = mongoose.model("sys_healthcheck_exams", HealthCheckExam);
