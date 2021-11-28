const pg = require("./db.orca.js");
// const japUtils = require("japanese-string-utils");
const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;
require('./procedureClass.model');
const procedure = {}

procedure.findAll = (result) => {

    const select = 
    "SELECT * FROM public.tbl_tensu WHERE yukoedymd = '99999999' AND NOT srysyukbn = ''";
    
    // Query
    pg.many(select)
        .then((data) => {
            result(null, data);
            return;    
        })
        .catch((err) => {
            if (err.code === 0) {
                result(null, []);
                return;
            }
            $logger.error(err);
            result(err, null);
            return;
        })
}

// Mongo Part
const procedureMongo = new Schema({
    cdkbn_kbn: String,
    cdkbn_kbnnum: String,
    cdkbn_kbnnum_eda: String,
    procedureClass: {
        type: String,
        ref: "sys_procedure_classes",
        default: function() {
            return this.cdkbn_kbn + this.cdkbn_kbnnum.padStart(3,'0') + this.cdkbn_kbnnum_eda.padStart(2,'0')
        }
    }
},{
    toJSON: {virtuals: true},
    strict: false
});

procedure.mongo = mongoose.model("sys_procedures", procedureMongo);

module.exports = procedure