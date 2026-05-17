// import pg from "./db.orca.js";
// import japUtils from "japanese-string-utils";
import { defineMongooseModel } from '#nuxt/mongoose'
import ProcedureClass from './procedureClass.model.js'

const Procedure = defineMongooseModel({
    name: 'Procedure',
    schema: {
        _id: String,
        srycd: String,
        cdkbn_kbn: String,
        cdkbn_kbnnum: String,
        cdkbn_kbnnum_eda: String,
        procedureClass: {
            type: String,
            ref: ProcedureClass,
            default: function () {
                return this.cdkbn_kbn + this.cdkbn_kbnnum.padStart(3, '0') + this.cdkbn_kbnnum_eda.padStart(2, '0')
            }
        }
    },
    options: {
        collection: 'sys_procedures',
        toJSON: { virtuals: true },
        strict: false
    }
})

// procedure.findAll = (result) => {

//     const select =
//         "SELECT *, srycd AS _id FROM public.tbl_tensu WHERE yukoedymd = '99999999' AND NOT srysyukbn = ''";

//     // Query
//     pg.many(select)
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

export default Procedure