const pg = require("./db.orca.js");
const japUtils = require("japanese-string-utils");

const disease = {}

disease.findMany = (query, result) => {

    let code = query + '%';
    let name = '%' + query + '%';
    let nameKana = '%' + japUtils.toKatakana(query) + '%';

    // Build select
    const select = 
    `
        SELECT
            byomeicd,
            byomei
        FROM master.tbl_byomei
        WHERE byomeicd LIKE $1 OR byomei LIKE $2 OR byomeikana LIKE $3 LIMIT 100
    `;
    
    // Query
    pg.many(select, [code, name, nameKana])
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

module.exports = disease;