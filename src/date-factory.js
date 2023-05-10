import XBDateConstraintFactory from './date-constraints';
import { getRangeEvaluator, toUTC, toRange } from './date-utils';
import { InvalidComparisonOperatorError } from './errors';
import { padded } from './utils';
import { getFormattedOffset } from './timezone-utils';

/**
 * Ideally, follow the date/time string formats:
 * * `YYYY-MM-DD`
 * * `YYYY-MM-DDTHH:mm:ss.sssZ`
 * * `YYYY-MM-DDTHH:mm:ss.sss+00:00`
 *
 * `dateArg` is expected to have timezone information or to be UTC.
 *
 * By default, we normalize the input date to 12:00:00 (UTC); this simplifies comparison of dates; be mindful
 * of this when using this helper for time-related logic.
 * You can disable this behavior by passing `options.normalize: false`.
 *
 * @param {InputDate} [dateArg] - Date
 * @param {Intl.DateTimeFormatOptions['timeZone']} [timezoneArg] - timezone
 * @return {XBDate}
 */
function createDate( dateArg, timezoneArg ) {
	const date = dateArg != null ? new Date( dateArg ) : new Date();
	let timezone = timezoneArg ?? null;
	let formatters = timezoneArg ? createFormaters( timezoneArg ) : null;

	return Object.freeze( {
		get() {
			// should I run any conversion here based on the provided timezone?
			return date;
		},
		timezone( timezoneArg ) {
			return createDate( date, timezoneArg );
		},
		getYear() {
			if ( timezone != null ) {
				return Number( formatters.year.format( date ) );
			}

			return date.getFullYear();
		},
		getMonth() {
			if ( timezone != null ) {
				// subtract 1 to be equivalent to the date.getMonth
				return Number( formatters.month.format( date ) ) - 1;
			}

			return date.getMonth();
		},
		getDate() {
			if ( timezone != null ) {
				return Number( formatters.day.format( date ) );
			}

			return date.getDate();
		},
		getTime() {
			return date.getTime();
		},
		getWeekday() {
			if ( timezone != null ) {
				return Number( formatters.weekday.format( date ) );
			}

			return date.getDay();
		},
		getHours() {
			if ( timezone != null ) {
				return Number( formatters.hour.format( date ) );
			}

			return date.getHours();
		},
		getMinutes() {
			if ( timezone != null ) {
				return Number( formatters.minute.format( date ) );
			}

			return date.getMinutes();
		},
		getSeconds() {
			if ( timezone != null ) {
				return Number( formatters.second.format( date ) );
			}

			return date.getSeconds();
		},
		getMilliseconds() {
			if ( timezone != null ) {
				return Number( formatters.millisecond.format( date ) );
			}

			return date.getMilliseconds();
		},
		add( summands ) {
			const result = Object.entries( summands || [] ).reduce(
				( newDate, [ key, summand ] ) => {
					return add( newDate, key, summand );
				},
				utcDate
			);

			return createDate( result );
		},
		subtract( subtrahends ) {
			const result = Object.entries( subtrahends || [] ).reduce(
				( newDate, [ key, subtrahend ] ) => {
					return add( newDate, key, -1 * subtrahend );
				},
				utcDate
			);

			return createDate( result );
		},
		set( overridesOrPeriod ) {
			let newValue = {
				year: date.getFullYear(),
				month: date.getMonth(),
				day: date.getDate(),
				hour: date.getHours(),
				minute: date.getMinutes(),
				second: date.getSeconds(),
				millisecond: date.getMilliseconds(),
			};

			if ( typeof overridesOrPeriod === 'string' ) {
				switch ( overridesOrPeriod ) {
					case 'start-of-day':
						newValue = {
							...newValue,
							...{
								hour: 0,
								minute: 0,
								second: 0,
								millisecond: 0,
							},
						};
						break;
					case 'middle-of-day':
						newValue = {
							...newValue,
							...{
								hour: 12,
								minute: 0,
								second: 0,
								millisecond: 0,
							},
						};
						break;
					case 'end-of-day':
						newValue = {
							...newValue,
							...{
								hour: 23,
								minute: 59,
								second: 59,
								millisecond: 999,
							},
						};
						break;
				}
			} else {
				newValue = { ...newValue, ...overridesOrPeriod };
			}

			date.setFullYear( newValue.year );
			date.setMonth( newValue.month );
			date.setDate( newValue.day );
			date.setHours( newValue.hour );
			date.setMinutes( newValue.minute );
			date.setSeconds( newValue.second );
			date.setMilliseconds( newValue.millisecond );

			return this;
		},
		matches,
		is( operator, otherDate, precision = 'day' ) {
			if ( otherDate == null ) {
				return false;
			}

			return matches( getReferenceRange() );

			function getReferenceRange() {
				switch ( operator ) {
					case '<=':
						return [ null, otherDate ];
					case '<':
						const beforeOtherDate = otherDate.subtract( {
							[ precision ]: 1,
						} );

						return [ null, beforeOtherDate ];
					case '=':
						return otherDate;
					case '>':
						const afterOtherDate = otherDate.add( {
							[ precision ]: 1,
						} );

						return [ afterOtherDate, null ];
					case '>=':
						return [ otherDate, null ];
					default:
						throw new InvalidComparisonOperatorError( operator );
				}
			}
		},
		toString() {
			return date.toISOString();
		},
	} );

	/**
	 * Add the given `value` to the provided `key` of the provided `date`.
	 * @param {Date} date - Date where the operation should be performed.
	 * @param {DateUnit} unit - period
	 * @param {number} value - value to be added
	 * @returns {XBDate} new date after the operation.
	 */
	function add( date, unit, value ) {
		const increment = {
			year: 0,
			month: 0,
			day: 0,
			[ unit ]: value,
		};

		const newDate = new Date(
			date.getUTCFullYear() + increment.year,
			date.getUTCMonth() + increment.month,
			date.getUTCDate() + increment.day,
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds(),
			date.getUTCMilliseconds()
		);

		return newDate;
	}

	function matches( ...constraintsArgs ) {
		const constraints = XBDateConstraintFactory( ...constraintsArgs );

		return constraints.matches( date );
	}

	function createFormaters( timezone ) {
		const yearFormatter = new Intl.DateTimeFormat( 'en', {
			year: 'numeric',
			timeZone: timezone,
		} );

		const monthFormatter = new Intl.DateTimeFormat( 'en', {
			month: '2-digit',
			timeZone: timezone,
		} );

		const dayFormatter = new Intl.DateTimeFormat( 'en', {
			day: '2-digit',
			timeZone: timezone,
		} );

		const hourFormatter = new Intl.DateTimeFormat( 'en', {
			hour: '2-digit',
			hour12: false,
			timeZone: timezone,
		} );

		const minuteFormatter = new Intl.DateTimeFormat( 'en', {
			minute: '2-digit',
			timeZone: timezone,
		} );
		const secondFormatter = new Intl.DateTimeFormat( 'en', {
			second: '2-digit',
			timeZone: timezone,
		} );
		const millisecondFormatter = new Intl.DateTimeFormat( 'en', {
			fractionalSecondDigits: '3',
			timeZone: timezone,
		} );

		const weekdayFormatter = new Intl.DateTimeFormat( 'en', {
			weekday: 'long',
			timeZone: timezone,
		} );

		return {
			year: yearFormatter,
			month: monthFormatter,
			day: dayFormatter,
			hour: hourFormatter,
			minute: minuteFormatter,
			second: secondFormatter,
			millisecond: millisecondFormatter,
			weekday( date ) {
				const map = {
					Sunday: 0,
					Monday: 1,
					Tuesday: 2,
					Wednesday: 3,
					Thursday: 4,
					Friday: 5,
					Saturday: 6,
				};

				return map[ weekdayFormatter.format( date ) ];
			},
		};
	}
}

/**
 *
 * @param {{startDate?: InputDate; endDate?: InputDate}} rangeArg
 * @param {*} optionsArg
 */
function createDateRange( rangeArg, optionsArg ) {
	const range = toRange( rangeArg, optionsArg );

	return Object.freeze( {
		matches: getRangeEvaluator( range ),
	} );
}

const XBDateFactory = Object.freeze( { createDate, createDateRange } );

export default XBDateFactory;

/**
 * @typedef {import('./types').XBCreateDateOptions} XBCreateDateOptions
 * @typedef {import('./types').DateUnit} DateUnit
 * @typedef {import('./types').InputDate} InputDate
 * @typedef {import('./types').SingleDateConstraint} SingleDateConstraint
 * @typedef {import('./types').DateRangeConstraint} DateRangeConstraint
 * @typedef {import('./types').FunctionDateConstraint} FunctionDateConstraint
 * @typedef {import('./types').DateConstraint} DateConstraint
 * @typedef {import('./types').DateOperationInput} DateOperationInput
 * @typedef {import('./types').XBDate} XBDate
 */
