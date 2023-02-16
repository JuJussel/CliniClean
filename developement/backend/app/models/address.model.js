const pg = require("./db.orca.js");

const address = {}
address.findOne = (zip, result) => {
    pg.oneOrNone(
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

module.exports = address