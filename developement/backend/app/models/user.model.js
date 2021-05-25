const sql = require("./db.js");

const User = function(user) {
    this.id = user.id;
    this.username = user.username;
};

User.findById = (userId, result) => {
    
    sql.query(
        "SELECT id, username, nameFirst, nameLast, userGroup, status FROM usr_users WHERE id = ? AND active = 1 LIMIT 1",
        [
            userId
        ], (err, res) => {

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
User.findOne = (username, result) => {
    
    sql.query(
        "SELECT id, username, password, nameFirst, nameLast, userGroup, status FROM usr_users WHERE username = ? AND active = 1 LIMIT 1",
        [
            username
        ], (err, res) => {

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