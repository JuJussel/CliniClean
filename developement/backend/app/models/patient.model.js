const mongoose = require('./mongo.db')
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    _id: Number,
    name: {type:String, required: true},
    birthdate: {type: Date, required: true},
    visible: {type: Boolean, default: true},
    active: {type: Boolean, default: true},
    doctor: Number
});

// PatientSchema.virtual('id')

module.exports = mongoose.model("Patient", PatientSchema);

// Patient.findMany  = () => {
//     const test = mongo.collection('users').find()
//     console.log(test);
// }


// module.exports = Patient

// const sql = require("./db.js");

// const User = function(user) {
//     this.id = user.id;
//     this.username = user.username;
// };

// User.findMany = (search, result) => {
    
//     sql.query(
//         `   
//             SELECT id, name, birthdate
//             FROM usr_patients
//             WHERE name LIKE ? OR id LIKE ?
//         `,
//         [
//             search.name ? search.name + '%' : null,
//             search.id ? search.id + '%' : null
//         ], (err, res) => {

//             if (err) {
//                 $logger.error(err)
//                 result(err, null);
//                 return;
//             }
        
//             if (res.length) {
//                 result(null, res);
//                 return;
//             }
        
//             // not found User with the id
//             result(null, []);
//         }
//     );
// };

// module.exports = User;