const pg = require("./orca.db.js");

const examType = {}
examType.findOne = (zip, result) => {
    pg.one(
        `   SELECT editadrs_name 
            FROM public.tbl_adrs
            WHERE post = $1
            LIMIT 1
        `,
        [zip]
    )
    .then((data) => {
        result(null, data);
        return;
    })
    .catch((err) => {
        if (err.code === 0) {
            result(null, null);
        }
        $logger.error(err);
        result(err, null);
        return;
    })

}

module.exports = examType