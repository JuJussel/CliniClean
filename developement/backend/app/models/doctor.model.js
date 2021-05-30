const sql = require("./db.js");

const Doctor = function(user) {
    this.id = doctor.id;
    this.name = doctor.name;
};

Doctor.findAll = (result) => {
    
    sql.query(
        `   SELECT CONCAT(name_last, name_first) AS name, status, id 
            FROM usr_users
            WHERE visible = 1 AND role = 1
        `,
        (err, res) => {

            if (err) {
                $logger.error(err)
                result(err, null);
                return;
            }
        
            if (res.length) {
                result(null, res[0]);
                return;
            }
        
            // not found User with the id
            result({ kind: "not_found" }, null);
        }
    );
};

module.exports = User;