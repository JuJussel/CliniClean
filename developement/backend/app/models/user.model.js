const mongoose = require('./mongo.db')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id:  {type:Number, required: true},
    username: {type:String, required: true},
    password: {type:String, required: true},
    nameFirst: {type:String, required: true},
    nameLast: {type:String, required: true},
    active: {type: Boolean, default: true},
    userGroup: Number,
    status: {type: Number, required: true},
    isDirectory: {type: Boolean, default: false},
    hasOrca:  {type: Boolean, default: false},
    created:  {type: Date, default: Date.now},
    preferences: {type: {}, required: false}
},{ toJSON: { virtuals: true } });

UserSchema.virtual('nameFull').get(function() {
    return this.nameLast + this.nameFirst
});

module.exports = mongoose.model("pub_users", UserSchema);

// const User = function(user) {
//     this.id = user.id;
//     this.username = user.username;
// };

// User.findById = (userId, result) => {
    
//     sql.query(
//         "SELECT id, username, nameFirst, nameLast, userGroup, status FROM usr_users WHERE id = ? AND active = 1 LIMIT 1",
//         [
//             userId
//         ], (err, res) => {

//             if (err) {
//                 $logger.error(err)
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
// User.findOne = (username, result) => {
    
//     sql.query(
//         "SELECT id, username, password, nameFirst, nameLast, userGroup, status FROM usr_users WHERE username = ? AND active = 1 LIMIT 1",
//         [
//             username
//         ], (err, res) => {

//             if (err) {
//                 $logger.error(err)
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

// module.exports = User;