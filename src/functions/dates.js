/* eslint-disable */

import {DateTime} from "luxon";

window.DateTime = DateTime;

export const FORMAT = {
  DATE: "d. LLL y",
  DATE_SQL: "yyyy-LL-dd",
  DATETIME: "d. LLL y HH:mm",
  DAY_AND_MONTH: "d. LLL",
  DATETIME_SQL: "yyyy-LL-dd HH:mm:ss",
  DATETIME_SQL_NO_SECONDS: "yyyy-LL-dd HH:mm",
  TIME: "HH:mm",
  TIME_FULL: "HH:mm:ss",
  DATETIME_FULL: "d. LLL y HH:mm:ss",
  UNIX_TIMESTAMP: "X",
  ZONE: "ZZZZZ",
  ZONE_SHORT: "ZZZZ"
};

const DEFAULT_FORMAT = FORMAT.DATETIME_FULL;

export const convertLocalDateTimeToUTC = (time, format = FORMAT.DATETIME_SQL) => {
  return DateTime.fromSQL(time, {zone: 'local'}).toUTC().toFormat(format);
}
export const convertUTCToLocalDateTime = (time, format = FORMAT.DATETIME_SQL) => {
  return DateTime.fromSQL(time, {zone: 'utc'}).toLocal().toFormat(format);
}
/**
 * Accepts UTC date/datetime in SQL format, return formatted date/time/datetime
 *
 * @param {string} utcDateTime format MUST be one of ["2001-01-01", "2001-01-01 00:00:00"]
 * @param {string} format
 * @param {boolean} convertTimeZone
 * @return {string}
 */
export const formatDateTime = (utcDateTime, format = DEFAULT_FORMAT, convertTimeZone = true) => {
  format = Object.values(FORMAT).includes(format) ? format : DEFAULT_FORMAT;

  const dateTime = convertTimeZone ? utcDateTimeInCurrentTimeZone(utcDateTime) : DateTime
    .fromSQL(utcDateTime);
  return format === FORMAT.ZONE_SHORT
    ? formatTimeZoneShortName(dateTime)
    : dateTime.toFormat(format);
};

const formatTimeZoneShortName = dateTime => {
  for (const {zone, dst, std} of zoneNames) {
    if (dateTime.zoneName === zone) {
      return dateTime.isInDST ? dst : std;
    }
  }
  return dateTime.offsetNameShort;
};

export const currentTimeZoneName = () => {
  return DateTime.now().zoneName;
};

export const formatTimeZoneAbbrFromSQLString = dateTime => formatTimeZoneShortName(utcDateTimeInCurrentTimeZone(dateTime));

export const formatDateTimeSQLStringWithTimeZoneAbbr = (dateTimeSQLString, format = DEFAULT_FORMAT) =>
  [formatDateTime(dateTimeSQLString, format),
    formatTimeZoneAbbrFromSQLString(dateTimeSQLString)].join(' ')

const zoneNames = [
  {zone: 'Europe/Zurich', dst: 'CEST', std: 'CET'},
  {zone: 'Europe/London', dst: 'BST', std: 'GMT'},
  {zone: 'America/Los_Angeles', dst: 'PDT', std: 'PST'},
  {zone: 'America/New_York', dst: 'EDT', std: 'EST'},
  {zone: 'Europe/Amsterdam', dst: 'CEST', std: 'CET'},
  {zone: 'Europe/Stockholm', dst: 'CEST', std: 'CET'},
  {zone: 'Europe/Brussels', dst: 'CEST', std: 'CET'},
  {zone: 'Europe/Berlin', dst: 'CEST', std: 'CET'},
  {zone: 'Europe/Vienna', dst: 'CEST', std: 'CET'},
  {zone: 'America/Edmonton', dst: 'MDT', std: 'MST'},
  {zone: 'Europe/Madrid', dst: 'CEST', std: 'CET'},
  {zone: 'Europe/Dublin', dst: 'IST', std: 'GMT'},
  {zone: 'Europe/Monaco', dst: 'CEST', std: 'CET'},
  {zone: 'America/Chicago', dst: 'CDT', std: 'CST'},
  {zone: 'America/Toronto', dst: 'EDT', std: 'EST'},
  {zone: 'Asia/Tokyo', dst: 'JST', std: 'JST'},
  {zone: 'America/Mexico_City', dst: 'CDT', std: 'CST'},
  {zone: 'Europe/Oslo', dst: 'CEST', std: 'CET'},
  {zone: 'Asia/Singapore', dst: 'SGT', std: 'SGT'},
  {zone: 'Europe/Budapest', dst: 'CEST', std: 'CET'},
  {zone: 'Asia/Hong_Kong', dst: 'HKT', std: 'HKT'},
  {zone: 'Europe/Warsaw', dst: 'CEST', std: 'CET'},
  {zone: 'Europe/Prague', dst: 'CEST', std: 'CET'},
  {zone: 'Europe/Kiev', dst: 'EEST', std: 'EET'},
  {zone: 'Europe/Uzhgorod', dst: 'EEST', std: 'EET'},
  {zone: 'Africa/Johannesburg', dst: 'SAST', std: 'SAST'}
];

const utcDateTimeInCurrentTimeZone = utcDateTime => {
  return utcDateTime
    ? DateTime
      .fromSQL(utcDateTime, {zone: "UTC"})
      .setZone(DateTime.now().zoneName)
    : DateTime.now();
};

export const formatNow = format => formatDateTime("", format);

/**
 * Think of it this way: IS leftDateTime AFTER rightDateTime?
 * Format of arguments MUST be one of ["2001-01-01", "2001-01-01 00:00:00"]
 *
 * @param {string} leftUtcDateTime
 * @param {string} rightUtcDateTime optional, default - now
 * @return {boolean}
 */
export const isAfter = (leftUtcDateTime, rightUtcDateTime) => {
  const toDateTimeInUtc = value => DateTime.fromSQL(value, {zone: "UTC"});
  const left = toDateTimeInUtc(leftUtcDateTime);
  const right = rightUtcDateTime
    ? toDateTimeInUtc(rightUtcDateTime)
    : DateTime.utc();

  return left > right;
};

export const isFuture = dateTime => isAfter(dateTime, "");
export const isPast = dateTime => !isAfter(dateTime, "");

/**
 * @param {number} timestamp
 * @param {string} format
 * @return {string}
 */
export const timestampToCurrentTimeZone = (timestamp, format) => {
  format = Object.values(FORMAT).includes(format) ? format : DEFAULT_FORMAT;
  return DateTime.fromSeconds(timestamp).toFormat(format);
};

/**
 * @param {string} inputDateTime
 * @param {string} zone
 * @param {string} format
 * @return {string}
 */
export const formatDateTimeWithZone = (inputDateTime, zone, format) => {
  const dateTime = DateTime.fromSQL(inputDateTime, {zone})
  return format === FORMAT.ZONE_SHORT
    ? formatTimeZoneShortName(dateTime)
    : dateTime.toFormat(format);
};

export const formatDateTimeWithDifferentZone = (inputDateTime, zone, timeZoneToDisplayIn, format) => {
  const dateTime = DateTime.fromSQL(inputDateTime, {zone}).setZone(timeZoneToDisplayIn);
  return format === FORMAT.ZONE_SHORT
    ? formatTimeZoneShortName(dateTime)
    : dateTime.toFormat(format);
};

export const formatDateTimeToUtc = (anyParsableDateTime, format = FORMAT.DATETIME_SQL) => {
  return DateTime.fromISO(anyParsableDateTime).setZone("UTC").toFormat(format);
};

export const formatSqlDateTimeToUtc = (sqlDate, format = FORMAT.DATETIME_SQL) => {
  return DateTime.fromSQL(sqlDate).setZone("UTC").toFormat(format);
};

// with no time-zone conversions
export const reformatDateTime = (dateTimeSql, format = FORMAT.DATETIME_SQL) => {
  return DateTime.fromSQL(dateTimeSql).toFormat(format);
};


export const prevQuarter = (subQuarters) => {
  const prevQuarter = DateTime.now().minus({quarters: subQuarters});

  return {
    from: prevQuarter.startOf('quarter').toFormat(FORMAT.DATE_SQL),
    to: prevQuarter.endOf('quarter').toFormat(FORMAT.DATE_SQL)
  }
}
export const prevYear = (subYears) => {
  const prevQuarter = DateTime.now().minus({years: subYears});

  return {
    from: prevQuarter.startOf('year').toFormat(FORMAT.DATE_SQL),
    to: prevQuarter.endOf('year').toFormat(FORMAT.DATE_SQL)
  }
}

export const formatPastDate = (duration, format) => {
  return DateTime.now().minus(duration).toFormat(format);
};

export const diffInMinutes = (dateTime1, dateTime2) => {
  return parseInt(DateTime.fromSQL(dateTime1).diff(DateTime.fromSQL(dateTime2), "minutes").as("minutes"));
}

export const datesSorter = (a, b) => DateTime.fromSQL(a) > DateTime.fromSQL(b);

export const sortDates = arrayOfDates => {
  return arrayOfDates.sort(datesSorter);
};

export const minutesRange = (startDateTime, endDateTime, minutes, format) => {
  const values = [];
  let current = DateTime.fromSQL(startDateTime);
  const end = DateTime.fromSQL(endDateTime);
  while (current < end) {
    values.push(current.toFormat(format));
    current = current.plus({minutes});
  }
  values.push(current.toFormat(format));
  return values;
};

export const daysRange = (startDate, endDate) => {
  const dates = [];
  let current = DateTime.fromSQL(startDate);
  const end = DateTime.fromSQL(endDate);
  while (current < end) {
    dates.push(current.toFormat(FORMAT.DATE_SQL));
    current = current.plus({days: 1});
  }
  dates.push(current.toFormat(FORMAT.DATE_SQL));
  return dates;
};
