import dayjs from "dayjs";
import lang from "../lang/jp";
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

export default (date = null, format = "YYYY-MM-DD") => {
    if (!date) return "";
    return dayjs(date, format).format(
        'YYYY' + lang.dateLocals.yearSeparator +
        'MM' + lang.dateLocals.monthSeparator +
        'DD' + lang.dateLocals.daySeparator
    )
}