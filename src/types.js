/**
 * @typedef {Object} XBDateFactoryOptions
 * @property {boolean} [normalize] - Should set time to 12:00:00.
 */

/**
 * @typedef {'year' | 'month' | 'day'} DateUnit
 * @typedef {string | number | Date} InputDate
 * @typedef {InputDate} SingleDateConstraint
 * @typedef {[InputDate, InputDate] | [null, InputDate] | [InputDate, null]} DateRangeConstraint
 * @typedef {(day: XBDate) => boolean} FunctionDateConstraint
 * @typedef {SingleDateConstraint | DateRangeConstraint | FunctionDateConstraint} DateConstraint
 * @typedef {Record<DateUnit, number>} DateOperationInput
 */

/**
 * @typedef {Object} XBDate
 * @property {() => Date} get - Get `Date` object representing this date.
 * @property {() => number} getYear - Get the year using Universal Coordinated Time (UTC).
 * @property {() => number} getMonth - Get the month using Universal Coordinated Time (UTC).
 * @property {() => number} getDate - Get the day-of-the-month, using Universal Coordinated Time (UTC).
 * @property {() => number} getTime - Get the time value in milliseconds. Be aware that it might be normalized to 12:00:00 (UTC), if you did not call the helper with `options.normalize: false`.
 * @property {() => number} getWeekday - Get the day of the week.
 * @property {() => number} getHours - Get the hours value. Be aware that it might be normalized to 12:00:00 (UTC), if you did not call the helper with `options.normalize: false`.
 * @property {() => number} getMinutes - Get the minutes value. Be aware that it might be normalized to 12:00:00 (UTC), if you did not call the helper with `options.normalize: false`.
 * @property {() => number} getSeconds - Get the seconds value. Be aware that it might be normalized to 12:00:00 (UTC), if you did not call the helper with `options.normalize: false`.
 * @property {(...constraints: CalendarConstraint[]) => boolean} matches - Check if the current date matches **at least one** of the provided constraints. Returns `false` if no constraints is provided.
 * @property {(values: DateOperationInput) => XBDate} set - Set the given `value` to the `key` property of this instance. This function mutates the internal date instance.
 * @property {(summands: DateOperationInput) => XBDate} add - Return a copy of this instance, adding the given `value` to the `key` property.
 * @property {(subtrahends: DateOperationInput) => XBDate} subtract - Return a copy of this instance, subtracting the given `value` to the `key` property.
 * @property {(operator: '>=' | '>' | '=' | '<' | '<=', other: XBDate, precision?: DateUnit) => boolean} is - Compare this date with the given `other`.
 * @property {() => string} toString - Return this date as a string value in ISO format.
 */

export default function noop() {}
