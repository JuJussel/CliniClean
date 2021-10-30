const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    sender: { type: Number, ref: "pub_users"},
    recepients: [{ 
        user: {type: Number, ref: "pub_users"},
        read: {type: Boolean, default: false}
    }],
    content: {meta: {}, text: String},
    created: {type: Date, default: Date.now}
},{ toJSON: { virtuals: true } });

module.exports = mongoose.model("pub_notifications", NotificationSchema);
