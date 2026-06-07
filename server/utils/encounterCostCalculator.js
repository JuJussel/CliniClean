import { isJapaneseHoliday } from "./holiday.js";

// Standard medical billing codes for Shoshin and Saishin additions
export const SHIN_ADD_ITEMS = [
  // Shoshin additions (Index 0)
  {
    n: { n: '111000770', s: '111012170' }, // Late night
    k: { n: '111000670', s: '111012070' }, // Holiday
    g: { n: '111000570', s: '111011970' }, // Outside hours
    ml: { n: '111012470', s: '111012470' }, // Early morning / late evening
    z: { s: '111000370' } // Infant addition
  },
  // Saishin additions (Index 1)
  {
    n: { n: '112001310', s: '112014970' }, // Late night
    k: { n: '112001210', s: '112014870' }, // Holiday
    g: { n: '112001110', s: '112014770' }, // Outside hours
    ml: { n: '112015570', s: '112015570' }, // Early morning / late evening
    z: { s: '112000970' } // Infant addition (Corrected from 112007410)
  }
];

/**
 * Extract time and date components in Asia/Tokyo timezone
 * @param {Date} date 
 * @returns {Object} JST date components
 */
export function getJstDateTimeComponents(date) {
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false
  });
  
  const parts = formatter.formatToParts(date);
  const components = {};
  for (const part of parts) {
    components[part.type] = part.value;
  }
  
  // weekday mapping from ja-JP short name to lowercase English abbreviation
  const weekdayMap = {
    '日': 'sun',
    '月': 'mon',
    '火': 'tue',
    '水': 'wed',
    '木': 'thu',
    '金': 'fri',
    '土': 'sat'
  };
  
  const day = weekdayMap[components.weekday] || 'sun';
  const timeStr = `${components.hour}:${components.minute}`;
  const dateStr = `${components.year}-${components.month}-${components.day}`;
  
  return {
    year: parseInt(components.year, 10),
    month: parseInt(components.month, 10),
    day, // e.g. 'mon'
    dateStr, // YYYY-MM-DD
    timeStr, // HH:MM
    hour: parseInt(components.hour, 10),
    minute: parseInt(components.minute, 10)
  };
}

/**
 * Calculates patient's age in full years relative to reference date.
 * 
 * @param {Date|string} birthDate 
 * @param {Date} referenceDate 
 * @returns {number} Age in years
 */
export function calculateAge(birthDate, referenceDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const ref = new Date(referenceDate);
  
  // Compare in JST to ensure accuracy
  const birthComp = getJstDateTimeComponents(birth);
  const refComp = getJstDateTimeComponents(ref);
  
  let age = refComp.year - birthComp.year;
  if (refComp.month < birthComp.month || (refComp.month === birthComp.month && refComp.hour < birthComp.hour)) { // wait, month or day check
    // wait, we compare month and day, not hour! Let's get date numbers:
    // Let's compare month and day directly:
  }
  
  // Let's do exact month and day check:
  const refMonth = refComp.month;
  const refDay = parseInt(refComp.dateStr.split('-')[2], 10);
  const birthMonth = birthComp.month;
  const birthDay = parseInt(birthComp.dateStr.split('-')[2], 10);
  
  if (refMonth < birthMonth || (refMonth === birthMonth && refDay < birthDay)) {
    age--;
  }
  return age;
}

/**
 * Calculate base encounter costs and return billing codes.
 * 
 * @param {Object} params
 * @param {Date} params.encounterDate - The Date of the encounter
 * @param {string} params.birthDate - The patient's birthDate
 * @param {Array} params.openingHours - The openingHours array from settings
 * @param {boolean} params.hasActiveDiseases - Whether the patient has any active diseases in ORCA
 * @returns {Object} Calculation result with billing codes
 */
export function calculateEncounterCost({
  encounterDate,
  birthDate,
  openingHours,
  hasActiveDiseases
}) {
  const dateObj = new Date(encounterDate);
  const jst = getJstDateTimeComponents(dateObj);
  const isHoliday = isJapaneseHoliday(jst.dateStr);
  const age = calculateAge(birthDate, dateObj);

  // Determine Shoshin (初診) vs Saishin (再診)
  // If the patient has any active diseases, it's Saishin (120), otherwise Shoshin (110)
  let typeTag = 0; // 0: Shoshin, 1: Saishin
  let kouiBase = "111000110"; // Base Shoshin code
  let type = "110";

  if (hasActiveDiseases) {
    typeTag = 1;
    kouiBase = "112007410"; // Base Saishin code
    type = "120";
  }

  const response = {
    ok: false,
    type,
    koui: [{ code: kouiBase, times: 1 }]
  };

  // Extract opening hours for today
  // JST weekday: 0 is Sunday, 1 is Monday ... 6 is Saturday
  // Let's map JST weekday short name to Sunday=0 ... Saturday=6
  const weekdayIndexes = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6
  };
  const weekdayIdx = weekdayIndexes[jst.day];
  const openingHoursToday = (openingHours && openingHours[weekdayIdx]) || [];

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const minutes = jst.hour * 60 + jst.minute;
  
  // Clinic shifts
  const start1 = parseTimeToMinutes(openingHoursToday[0]);
  const end1 = parseTimeToMinutes(openingHoursToday[1]);
  const start2 = parseTimeToMinutes(openingHoursToday[2]);
  const end2 = parseTimeToMinutes(openingHoursToday[3]);

  // Addition check logic
  let addItem = 'none';

  // 1. Check if Late Night (深夜加算): 22:00 - 06:00
  const min2200 = 22 * 60; // 1320
  const min0600 = 6 * 60;  // 360
  
  if (minutes >= min2200 || minutes <= min0600) {
    addItem = 'n';
  }
  // 2. Check if Holiday (休日加算): Sunday or national holiday
  else if (jst.day === 'sun' || isHoliday) {
    addItem = 'k';
  }
  // 3. Check if Outside opening hours (時間外加算)
  // Outside standard shifts (Shift 1, and optional Shift 2)
  else {
    const inShift1 = start1 !== null && end1 !== null && minutes >= start1 && minutes <= end1;
    const inShift2 = start2 !== null && end2 !== null && minutes >= start2 && minutes <= end2;
    const isOutsideHours = !inShift1 && !inShift2;

    if (isOutsideHours) {
      addItem = 'g';
    }
    // 4. Check if Early morning / Late evening (夜間・早朝等加算)
    // Saturdays: 06:00-08:00 or 12:00-22:00
    // Weekdays: 06:00-08:00 or 18:00-22:00
    else {
      const min0800 = 8 * 60;
      const min1200 = 12 * 60;
      const min1800 = 18 * 60;
      
      let isEarlyLate = false;
      if (jst.day === 'sat') {
        isEarlyLate = (minutes >= min0600 && minutes <= min0800) || (minutes >= min1200 && minutes <= min2200);
      } else {
        isEarlyLate = (minutes >= min0600 && minutes <= min0800) || (minutes >= min1800 && minutes <= min2200);
      }

      if (isEarlyLate) {
        addItem = 'ml';
      }
    }
  }

  // Determine age category: 's' for under 6 (Shoni), 'n' for normal (over 6)
  const ageType = age < 6 ? 's' : 'n';

  // 5. Infant addition (乳幼児加算 - if no out-of-hours applies, and age < 6)
  // (Updated: corrected from age < 5 in original PHP to age < 6 to match 6歳未満 rule)
  if (addItem === 'none' && age < 6) {
    addItem = 'z';
  }

  // Add the computed addition code if applicable
  if (addItem !== 'none') {
    const additionGroup = SHIN_ADD_ITEMS[typeTag][addItem];
    if (additionGroup) {
      const code = additionGroup[ageType];
      if (code) {
        response.koui.push({ code, times: 1 });
      }
    }
  }

  response.ok = true;
  return response;
}
