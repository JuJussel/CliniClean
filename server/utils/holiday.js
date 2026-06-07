/**
 * Generates all Japanese national holidays for a given year,
 * including Happy Mondays, mathematical equinoxes, substitute holidays (振替休日),
 * and sandwiched national holidays (国民の休日).
 * 
 * @param {number} year 
 * @returns {Object} Map of "YYYY-MM-DD" -> Holiday Name
 */
export function getNationalHolidays(year) {
  const holidays = {};

  const addHoliday = (month, day, name) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    holidays[dateStr] = name;
  };

  // 1. Fixed date holidays
  addHoliday(1, 1, "元日");
  addHoliday(2, 11, "建国記念の日");
  
  if (year >= 2020) {
    addHoliday(2, 23, "天皇誕生日");
  }
  
  addHoliday(4, 29, "昭和の日");
  addHoliday(5, 3, "憲法記念日");
  addHoliday(5, 4, "みどりの日");
  addHoliday(5, 5, "こどもの日");
  
  if (year >= 2016) {
    addHoliday(8, 11, "山の日");
  }

  addHoliday(3, getVernalEquinox(year), "春分の日");
  addHoliday(9, getAutumnalEquinox(year), "秋分の日");
  addHoliday(11, 3, "文化の日");
  addHoliday(11, 23, "勤労感謝の日");

  // 2. Happy Monday holidays
  // 成人の日: 2nd Monday of Jan
  addHoliday(1, getNthMonday(year, 1, 2), "成人の日");
  // 海の日: 3rd Monday of Jul
  addHoliday(7, getNthMonday(year, 7, 3), "海の日");
  // 敬老の日: 3rd Monday of Sep
  addHoliday(9, getNthMonday(year, 9, 3), "敬老の日");
  // スポーツの日: 2nd Monday of Oct
  addHoliday(10, getNthMonday(year, 10, 2), "スポーツの日");

  // 3. Substitute holidays (振替休日)
  // If a holiday is on Sunday, the next day that is not a holiday is a holiday.
  const baseHolidays = Object.keys(holidays).sort();
  for (const dateStr of baseHolidays) {
    // Parse using components to avoid timezone shift on new Date(dateStr)
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getDay() === 0) { // Sunday
      let subDate = new Date(date);
      while (true) {
        subDate.setDate(subDate.getDate() + 1);
        const subDateStr = formatDate(subDate);
        if (!holidays[subDateStr]) {
          holidays[subDateStr] = "振替休日";
          break;
        }
      }
    }
  }

  // 4. Sandwiched holidays (国民の休日)
  // If a weekday is sandwiched between two holidays (diff of 2 days), the middle day becomes a holiday.
  const activeHolidays = Object.keys(holidays).sort();
  for (let i = 0; i < activeHolidays.length - 1; i++) {
    const [y1, m1, d1] = activeHolidays[i].split('-').map(Number);
    const [y2, m2, d2] = activeHolidays[i + 1].split('-').map(Number);
    const date1 = new Date(y1, m1 - 1, d1);
    const date2 = new Date(y2, m2 - 1, d2);
    
    const diffTime = date2.getTime() - date1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 2) {
      const midDate = new Date(date1);
      midDate.setDate(midDate.getDate() + 1);
      if (midDate.getDay() !== 0) { // Not Sunday
        const midDateStr = formatDate(midDate);
        if (!holidays[midDateStr]) {
          holidays[midDateStr] = "国民の休日";
        }
      }
    }
  }

  return holidays;
}

/**
 * Helper to calculate the day of month for getNthMonday
 */
function getNthMonday(year, month, n) {
  const date = new Date(year, month - 1, 1);
  const dayOfWeek = date.getDay(); // 0: Sun, 1: Mon, ...
  const daysToFirstMonday = (1 - dayOfWeek + 7) % 7;
  const firstMondayDate = 1 + daysToFirstMonday;
  return firstMondayDate + (n - 1) * 7;
}

/**
 * Vernal Equinox mathematical estimation (2000 - 2099)
 */
function getVernalEquinox(year) {
  return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

/**
 * Autumnal Equinox mathematical estimation (2000 - 2099)
 */
function getAutumnalEquinox(year) {
  return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

/**
 * Formats a Date object as YYYY-MM-DD
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Checks if a date string ("YYYY-MM-DD") is a holiday
 * @param {string} dateStr 
 * @returns {boolean}
 */
export function isJapaneseHoliday(dateStr) {
  const [y] = dateStr.split('-').map(Number);
  const holidays = getNationalHolidays(y);
  return !!holidays[dateStr];
}
