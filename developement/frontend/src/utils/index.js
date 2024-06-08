import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import "dayjs/locale/ja";
dayjs.extend(customParseFormat)
dayjs.locale("ja");

const parseDate = function (date = null, format = "YYYY-MM-DD") {
    if (!date) return "";
    const conv = dayjs(date).format(
        'YYYY' + lang.dateLocals.yearSeparator +
        'MM' + lang.dateLocals.monthSeparator +
        'DD' + lang.dateLocals.daySeparator
    )
    return conv
}

const copy = function (data) {
    return JSON.parse(JSON.stringify(data))
}

export {
    parseDate,
    copy
}