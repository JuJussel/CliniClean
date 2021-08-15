const pg = require("./orca.db.js");

const encounterType = {}
encounterType.findAll = (result) => {

    pg.many(
        `   SELECT kbncd AS id, kanritbl AS name 
            FROM public.tbl_syskanri
            WHERE kanricd = '1012'
            ORDER BY id
        `
    )
    .then((data) => {
        result(null, data);
        return;
    })
    .catch((err) => {
        $logger.error(err);
        result(err, null);
        return;
    })

}

module.exports = encounterType