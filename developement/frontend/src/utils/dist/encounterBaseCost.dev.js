"use strict";

var _dayjs = _interopRequireDefault(require("dayjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var calculateBaseCost = function calculateBaseCost(encounter, baseItems, clinicInfo) {
  var date = {
    time: Date.now(),
    dayString: (0, _dayjs["default"])().day(),
    dateString: (0, _dayjs["default"])().format('YYYY-MM-DD'),
    timeString: (0, _dayjs["default"])().format('HH:mm'),
    yearString: (0, _dayjs["default"])().format('YYYY'),
    monthString: (0, _dayjs["default"])().format('MM')
  };
  var openingHours = clinicInfo.openingHours[date.dayString];
  var sameDayCounter = 0;
  var patientBirthdate = encounter.patient.birthdate;
  var patientAge = (0, _dayjs["default"])(date.time).diff(patientBirthdate, 'month'); //Patient Age
};

module.exports = calculateBaseCost;