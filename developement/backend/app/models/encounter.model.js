const sql = require("./db.js");

const User = function(encounter) {
    this.id = encounter.id;
};

// User.findById = (userId, result) => {
    
//     sql.query(
//         "SELECT id, username, nameFirst, nameLast, userGroup, status FROM usr_users WHERE id = ? AND active = 1 LIMIT 1",
//         [
//             userId
//         ], (err, res) => {

//             if (err) {
//                 console.log(err);
//                 result(err, null);
//                 return;
//             }
        
//             if (res.length) {
//                 result(null, res[0]);
//                 return;
//             }
        
//             // not found User with the id
//             result({ kind: "not_found" }, null);
//         }
//     );
// };
User.findAll = (result) => {
    
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
            WHERE date(date) = CURDATE()
            ORDER BY time
        `, 
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

module.exports = User;