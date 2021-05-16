const sql = require("./db.js");

const User = function(user) {
    this.id = user.id;
    this.username = user.username;
};

User.findById = (userId, result) => {
    
    sql.query(
        "SELECT id, user_name, name_first, name_last, user_group, status FROM usr_users WHERE id = ? AND active = 1 LIMIT 1",
        [
            userId
        ], (err, res) => {

            if (err) {
                console.log(err);
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
        "SELECT id, user_name, password, name_first, name_last, user_group, status FROM usr_users WHERE user_name = ? AND active = 1 LIMIT 1",
        [
            username
        ], (err, res) => {

            if (err) {
                console.log(err);
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