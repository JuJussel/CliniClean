import dayjs from 'dayjs';
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(isBetween);
dayjs.extend(weekday);
dayjs.extend(customParseFormat);

export default async (encounter, baseItems, clinicInfo) => {

    const date = {
        time: Date.now(),
        day: dayjs().day(),
        dateString: dayjs().format('YYYY-MM-DD'),
        timeString: dayjs().format('HH:mm'),
        yearString: dayjs().format('YYYY'),
        monthString: dayjs().format('MM'),
    }
    const patientBirthdate = encounter.patient.birthdate;
    const patientAge = dayjs(date.time).diff(patientBirthdate, 'month');
    const lateNight = {
        start: dayjs().hour("22").minute("00"),
        end: dayjs().hour("06").minute("00").add(1, "day")
    };
    const holidaysList = await (
        await fetch("https://holidays-jp.github.io/api/v1/date.json")
        ).json();
        
    var openingHours = clinicInfo.openingHours[date.day];
    openingHours = [
        openingHours[0] ? dayjs(openingHours[0], 'HH:mm') : null,
        openingHours[1] ? dayjs(openingHours[1], 'HH:mm') : null,
        openingHours[2] ? dayjs(openingHours[2], 'HH:mm') : null,
        openingHours[3] ? dayjs(openingHours[3], 'HH:mm') : null
    ];

    // var sameDayCounter = 0;
    var addItem = null;
    var baseVisitProcedure = {
        tag: 0,
        code: "111000110",
        type: '110'
    };
    var ageType = 'n';

    // Check if repeated visit



    // Check if late night
    if (dayjs().isBetween(lateNight.start, lateNight.end)) {
        addItem = 'n';
    }

    // Check if holiday
    else if(date.day === 0 || holidaysList[date.dateString]) {
        addItem = 'k'
    }

    // Check if outside of hours
    else if (openingHours[0] && openingHours[1]) {
        if (!dayjs().isBetween(openingHours[0], openingHours[1])) {
            addItem = "g";
        }
        if (openingHours[2] && openingHours[3]) {
            if (!dayjs().isBetween(openingHours[2], openingHours[3])) {
                addItem = "g";
            }
        }
    }

    // Check if early or late hours
    else if (date.day === 7) {
        if (
            dayjs().isBetween( dayjs("06:00", "HH:mm"), dayjs("08:00", "HH:mm")) 
            ||
            dayjs().isBetween(dayjs("12:00", "HH:mm"), dayjs("22:00", "HH:mm"))
        ) {
            addItem = 'ml';
        }
    } else if (
        dayjs().isBetween( dayjs("06:00", "HH:mm"), dayjs("08:00", "HH:mm")) 
        ||
        dayjs().isBetween(dayjs("18:00", "HH:mm"), dayjs("22:00", "HH:mm"))
    ) {
        addItem = 'ml';
    }

    // Check if under 6 years
    if (patientAge < 6) ageType = 's';

    if (!addItem || patientAge < 5) addItem = 'z';

    // Select additional item
    let returnItems = [baseVisitProcedure];
    if (addItem) {
        let itemToAdd = baseItems[baseVisitProcedure.tag][addItem][ageType];
        returnItems.push(itemToAdd);
    }

    console.log(returnItems);
    return returnItems;

}

