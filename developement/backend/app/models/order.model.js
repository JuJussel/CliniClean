const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const date = new Date;
console.log(date);

const OrderSchema = new Schema({
    patient: { type: Number, ref: 'pub_patients' },
    encounterId: { type: Schema.Types.ObjectId, ref: 'pub_encounters' },
    procedure: { type: {} },
    requester: { type: String, ref: 'pub_users' },
    date: { type: Date, default: date },
    status: { type: Number, default: 1 },
    locked: { type: String, default: null }
}, { toJSON: { virtuals: true } });

module.exports = mongoose.model("pub_orders", OrderSchema);
