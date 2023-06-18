/**
 * @typedef {string | number | Date} DateInput
 * @typedef {Intl.DateTimeFormatOptions['timeZone']} Timezone
 * @typedef {'year' | 'month' | 'day' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'} DateUnit
 * @typedef {Record<DateUnit, number>} DateOperationInput
 */

/**
 * @typedef {Object} XBDate
 * @property {() => Date} get - Get `Date` object representing this date.
 * @property {() => number} getTime - Get the stored time value in milliseconds since midnight, January 1, 1970 UTC.
 * @property {(newYear?: number) => number} year - Set the year, if `newYear` is provided. Return the year according to the provided timezone (if any).
 * @property {(newMonth?: number) => number} month - Set the month, if `newMonth` is provided. Return the month according to the provided timezone (if any).
 * @property {(newDate?: number) => number} date - Set the day of month, if `newDate` is provided. Return the day of month according to the provided timezone (if any).
 * @property {() => number} weekday - Get the day of the week.
 * @property {(newHours?: number) => number} hours - Set the hours, if `newHours` is provided. Return the hours according to the provided timezone (if any).
 * @property {(newMinutes?: number) => number} minutes - Set the minutes, if `newMinutes` is provided. Return the minutes according to the provided timezone (if any).{() => number} getMinutes - Get the minutes value. Be aware that it might be normalized to 12:00:00 (UTC), if you did not call the helper with `options.normalize: false`.
 * @property {(newSeconds?: number) => number} seconds - Set the seconds, if `newSeconds` is provided. Return the seconds according to the provided timezone (if any).
 * @property {(newMilliseconds?: number) => number} millisecondss - Set the milliseconds, if `newMilliseconds` is provided. Return the milliseconds according to the provided timezone (if any).
 * @property {(timezoneArg?: Timezone) => XBDate} timezone - Return a new `XBDate` with the provided timezone.
 * @property {(summands: DateOperationInput) => XBDate} add - Return a copy of this instance, adding the given `value` to the `key` property.
 * @property {(subtrahends: DateOperationInput) => XBDate} subtract - Return a copy of this instance, subtracting the given `value` to the `key` property.
 * @property {(period: 'start-of-day' | 'middle-of-day' | 'end-of-day') => XBDate} reset - Reset inner date to the start of the day, middle of the day or end of the day according to the given `period`.
 * @property {(values: DateOperationInput) => XBDate} set - Set the given `value` to the `key` property of this instance. This function mutates the internal date instance.
 * @property {(operator: 'before.or.equal' | 'before' | 'equal' | 'after' | 'after.or.equal', other: XBDate, precision?: DateUnit) => boolean} is - Compare this date with the given `other`.
 * @property {() => string} toString - Return this date as a string value in ISO format.
 */

/**
 * @typedef {Object} XBDateRange
 * @property {(newRangeStart?: number) => number} start - Set the date range start, if `newRangeStart` is provided, swapping start and end in case `start` comes after `end`. Return the date range start.
 * @property {(newRangeEnd?: number) => number} end - Set the date range end, if `newRangeEnd` is provided, swapping end and start in case `end` comes before `start`. Return the date range end
 * @property {() => string} toString - Return this date range as a string value in `<date start in ISO format> - <date end in ISO format> ` format.
 */

/**
 * @typedef {Object} XBDateConstraints
 * @property {(date: XBDate) => boolean} match - Check if the given date matches **at least one** of the provided constraints. Returns `false` if no constraints is provided.
 */

/**
 * @typedef {(day: XBDate) => boolean} FunctionConstraintEvaluator
 * @typedef {DateInput | XBDate} SingleDateConstraintEvaluator
 * @typedef {[DateInput | XBDate | null | undefined, DateInput | XBDate | null | undefined]} DateRangeConstraintEvaluator
 * @typedef {FunctionConstraintEvaluator | SingleDateConstraintEvaluator | DateRangeConstraintEvaluator} DateConstraintEvaluator
 */

// ----

/**
 * @typedef {'year' | 'month' | 'day' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'} DateUnit
 * @typedef {Record<DateUnit, number>} DateOperationInput
 * @typedef {string | number | Date} DateInput
 */

/**
 * @typedef {Object} XBDateFormatter
 * @property {(date: XBDate) => string} format - Format the given XBDate
 */

export default function noop() {}
