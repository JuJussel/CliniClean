const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    sender: { type: Number, ref: "pub_users"},
    recepients: [{ type: Number, ref: "pub_users"}],
    content: {meta: {}, text: String},
    created: {type: Date, default: Date.now}
},{ toJSON: { virtuals: true } });

module.exports = mongoose.model("pub_notifications", NotificationSchema);
