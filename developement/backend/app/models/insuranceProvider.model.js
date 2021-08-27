const pg = require("./db.orca.js");

const examType = {}
examType.findOne = (number, result) => {
    pg.one(
        `   SELECT seidoname
            FROM public.tbl_hknnum
            WHERE hbtnum = $1
            LIMIT 1
        `,
        [number]
    )
    .then((data) => {
        result(null, data);
        return;
    })
    .catch((err) => {
        if (err.code === 0) {
            result(null, null);
            return;
        }
        $logger.error(err);
        result(err, null);
        return;
    })

}

module.exports = examType