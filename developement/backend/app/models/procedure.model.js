const pg = require("./orca.db.js");

const procedure = {}
// examType.findAll = (result) => {

//     pg.many(
//         `   SELECT kbncd AS id, kanritbl AS name 
//             FROM public.tbl_syskanri
//             WHERE kanricd = '1012'
//             ORDER BY id
//         `
//     )
//     .then((data) => {
//         result(null, data);
//         return;
//     })
//     .catch((err) => {
//         $logger.error(err);
//         result(err, null);
//         return;
//     })

// }
procedure.findMany = (cat, search, result) => {

    let searchCode = search;
    let searchName = search + '%';

    //Build where clauses
    let where = `
        srykbn IN ($1) 
        AND (name LIKE $2 OR srycd IN ($3))
        AND yukoedymd = '99999999'
    `;

    if(cat == 25) {
        where = `
            srykbn = $1
            AND (ykzkbn = '1' OR ykzkbn = '6')
            AND (name LIKE $2 or srycd IN ($3))
            AND yukoedymd = '99999999'
        `;
    }

    if( cat == 30) {
        where = `
            srykbn = $1
            AND ykzkbn = '4'
            AND (name LIKE $2 OR srycd IN ($3))
            AND yukoedymd = '99999999'
        `;
    }

    const select = 
    `
        SELECT
            srycd,
            name,
            taniname,
            ten AS cost
        FROM public.tbl_tensu
        WHERE ` + where + ` LIMIT 200
    `;
    
    pg.many(select, [cat, searchName, searchCode])
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


module.exports = procedure