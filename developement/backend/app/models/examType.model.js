const pg = require("./dbOrca.js");

const examType = {

}
examType.findAll = (result) => {

    pg.many(
        `   SELECT kbncd AS id, kanritbl AS name 
            FROM public.tbl_syskanri
            WHERE kanricd = '1012'
            ORDER BY id
        `
    )
    .then((data) => {
        data.forEach((element, index) => {
            data[index].name = element.name.split(' ')[0]
        })
        result(null, data);
        return;
    })
    .catch((err) => {
        console.log(err);
        result(err, null);
        return;
    })

}

module.exports = examType