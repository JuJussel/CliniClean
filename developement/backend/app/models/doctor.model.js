const sql = require("./db.js");

const Doctor = function(doctor) {
    this.id = doctor.id;
    this.name = doctor.name;
};

Doctor.findAll = (result) => {
    
    sql.query(
        `   SELECT CONCAT(nameLast, nameFirst) AS name, status, id 
            FROM usr_users
            WHERE active = 1 AND userGroup = 2
        `,
        (err, res) => {

            if (err) {
                $logger.error(err)
                result(err, null);
                return;
            }
            result(null, res);
            return;
        
        }
    );
};

module.exports = Doctor;