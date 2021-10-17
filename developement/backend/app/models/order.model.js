const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;


const OrderSchema = new Schema({
    patientId: { type: Number, ref: 'pub_patients' },
    encounterId: { type: Schema.Types.ObjectId, ref: 'pub_encounters' },
    procedure: {type: {}},
    requester: { type: Number, ref: 'pub_patients' },
    date:  {type: Date, default: Date.now()},
    status: {type: Number, default: 1},
    locked: {type: String, default: null}
},{ toJSON: { virtuals: true } });

module.exports = mongoose.model("pub_orders", OrderSchema);
