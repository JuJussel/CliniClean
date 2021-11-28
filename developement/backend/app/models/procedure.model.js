const pg = require("./db.orca.js");
// const japUtils = require("japanese-string-utils");
const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

const procedure = {}

// procedure.findMany = (cat, search, result) => {

//     let searchCode = search;
//     let searchName = '%' + search + '%';
//     let searchNameKana = japUtils.toKatakana(search) + '%';

//     // Build where clauses
//     let where = `
//         srykbn IN ($1) 
//         AND (name LIKE $2 OR kananame LIKE $3 OR formalname LIKE $2 OR formalname LIKE $3 OR srycd IN ($4))
//         AND yukoedymd = '99999999'
//     `;

//     if(cat == 25) {
//         cat = '%';
//         where = `
//             srykbn LIKE $1
//             AND (ykzkbn = '1' OR ykzkbn = '6')
//             AND (name LIKE $2 OR kananame LIKE $3 or srycd IN ($4))
//             AND yukoedymd = '99999999'
//         `;
//     }

//     if( cat == 30) {
//         cat = '%';
//         where = `
//             srykbn LIKE $1
//             AND ykzkbn = '4'
//             AND (name LIKE $2 OR kananame LIKE $3 OR srycd IN ($4))
//             AND yukoedymd = '99999999'
//         `;
//     }

//     // Build select
//     const select = 
//     `
//         SELECT
//             srycd,
//             name,
//             formalname,
//             taniname,
//             ten AS cost,
//             CONCAT (cdkbn_kbn, LPAD(cdkbn_kbnnum::text, 3, '0'), LPAD(cdkbn_kouban::text, 2, '0')) AS procedureClass
//         FROM public.tbl_tensu
//         WHERE ` + where + ` LIMIT 200
//     `;
    
//     // Query
//     pg.many(select, [cat, searchName, searchNameKana, searchCode])
//         .then((data) => {
//             result(null, data);
//             return;    
//         })
//         .catch((err) => {
//             if (err.code === 0) {
//                 result(null, []);
//                 return;
//             }
//             $logger.error(err);
//             result(err, null);
//             return;
//         })
// }

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
        default: function() {
            return this.cdkbn_kbn + this.cdkbn_kbnnum.padStart(3,'0') + this.cdkbn_kbnnum_eda.padStart(2,'0')
        }
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    strict: false
});

procedureMongo.virtual('procedureClassName',{
    ref: 'sys_procedure_classes',
    localField: 'procedureClass',
    foreignField: '_id',
    justOne: true
});

procedure.mongo = mongoose.model("sys_procedures", procedureMongo);

module.exports = procedure