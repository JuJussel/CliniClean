const sql = require("./db.js");

const Encounter = {}

Encounter.findRange = (range, result) => {

    const start = range.start
    const end = range.end

    sql.query(
        `   SELECT 
                r.id, r.patient_id AS patientID,
                r.type,
                r.ins,r.memo,
                r.status,
                r.doctor,
                r.locked,
                r.shinsatu_start,
                r.orca_id,
                time(date) AS time,
                time(last_change) AS lastChange,
                p.name
            FROM usr_encounters  r
            INNER JOIN usr_patients p ON r.patient_id = p.id
            WHERE date(date) BETWEEN ? AND ?
            ORDER BY time
        `, 
        [start, end],
        (err, res) => {

            if (err) {
                console.log(err);
                result(err, null);
                return;
            }

            result(null, res);
            return;
        }
    );
};

module.exports = Encounter;