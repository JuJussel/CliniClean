const mongoose = require('./db.mongo')
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
