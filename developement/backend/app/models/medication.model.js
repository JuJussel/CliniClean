const pg = require("./db.orca.js");
const japUtils = require("japanese-string-utils");

const med = {}

med.findMany = (cat, search, result) => {

    let searchCode = search;
    let searchName = search + '%';
    let searchNameKana = japUtils.toKatakana(search) + '%';

    // Build where clauses
    let where =  `
        (ykzkbn = '1' OR ykzkbn = '6')
        AND (name LIKE $1 OR kananame LIKE $2 or srycd IN ($3))
        AND yukoedymd = '99999999'
    `;

    if( cat == 30) {
        cat = '%';
        where = `
            ykzkbn = '4'
            AND (name LIKE $1 OR kananame LIKE $2 OR srycd IN ($3))
            AND yukoedymd = '99999999'
        `;
    }

    // Build select
    const select = 
    `
        SELECT
            srycd,
            name,
            taniname,
            yakkakjncd,
            ten AS cost
        FROM public.tbl_tensu
        WHERE ` + where + ` LIMIT 200
    `;
    
    // Query
    pg.many(select, [searchName, searchNameKana, searchCode])
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


module.exports = med;