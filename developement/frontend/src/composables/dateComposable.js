import dayjs from "dayjs";
import ja from "dayjs/locale/ja"
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat);
dayjs.locale('ja')

const parseDate = function (date = null, format = "LL") {
    if (!date) return "";
    return dayjs(date).format(format);
}

export default parseDate