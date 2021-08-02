const pg = require("./orca.db.js");
const japUtils = require("japanese-string-utils");

const procedure = {}

procedure.findMany = (cat, search, result) => {

    let searchCode = search;
    let searchName = search + '%';
    let searchNameKana = japUtils.toFullwidth(search) + '%';

    //Build where clauses
    let where = `
        srykbn IN ($1) 
        AND (name LIKE $2 OR kananame LIKE $3 OR srycd IN ($4))
        AND yukoedymd = '99999999'
    `;

    if(cat == 25) {
        where = `
            srykbn = $1
            AND (ykzkbn = '1' OR ykzkbn = '6')
            AND (name LIKE $2 OR kananame LIKE $3 or srycd IN ($4))
            AND yukoedymd = '99999999'
        `;
    }

    if( cat == 30) {
        where = `
            srykbn = $1
            AND ykzkbn = '4'
            AND (name LIKE $2 OR kananame LIKE $3 OR srycd IN ($4))
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
    
    pg.many(select, [cat, searchName, seachNameKana, searchCode])
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