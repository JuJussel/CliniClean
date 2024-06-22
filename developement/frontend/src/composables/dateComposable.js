import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isBetween from "dayjs/plugin/isBetween";
import ja from "dayjs/locale/ja"
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(localizedFormat);
dayjs.locale('ja')

const parseDate = function (date = null, format = "LL") {
    if (!date) return "";
    return dayjs(date).format(format);
}

export default parseDate