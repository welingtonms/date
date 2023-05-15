import XBDateConstraintFactory from './date-constraints';
import { getRangeEvaluator, toUTC, toRange } from './date-utils';
import { InvalidComparisonOperatorError } from './errors';
import { padded } from './utils';
import { getFormattedOffset } from './timezone-utils';

function getTimezone( date ) {
	const offsetInMinutes = date.getTimezoneOffset();
	const offsetHours = Math.abs( Math.floor( offsetInMinutes / 60 ) );
	const offsetMinutes = Math.abs( offsetInMinutes % 60 );
	const offsetSign = offsetInMinutes > 0 ? '-' : '+';
	const timezone = offsetSign + padded( offsetHours ) + ':' + padded( offsetMinutes );
	return timezone;
}

/**
 *
 * @param {string} dateArg
 */
function tokenize( dateArg ) {
	let [ year, month, day, hours, minutes, seconds, milliseconds, timezone ] = [
		'',
		'',
		'',
		'',
		'00',
		'00',
		'000',
		'Z',
	];

	if ( typeof dateArg === 'string' ) {
		year = dateArg?.slice( 0, 4 ); //?
		month = dateArg?.slice( 5, 7 ); //?
		day = dateArg?.slice( 8, 10 ); //?
		hours = dateArg?.slice( 11, 13 ) ?? '00'; //?
		minutes = dateArg?.slice( 14, 16 ) ?? '00'; //?
		seconds = dateArg?.slice( 17, 19 ) ?? '00'; //?
		milliseconds = dateArg?.slice( 20, 23 ) ?? '000'; //?
		timezone = dateArg?.slice( 23 ) ?? 'Z'; //?
	}

	return { year, month, day, hours, minutes, seconds, milliseconds, timezone };
}

/**
 * Ideally, follow the date/time string formats:
 * * `YYYY-MM-DD`
 * * `YYYY-MM-DDTHH:mm:ss.sssZ`
 * * `YYYY-MM-DDTHH:mm:ss.sss+00:00`
 *
 * `dateArg` is expected to have timezone information or to be UTC.
 *
 * It uses overloaded getters and setters: Calling these methods without parameters acts as a getter,
 *  and calling them with a parameter acts as a setter.
 *
 * @param {InputDate} [dateArg] - Date
 * @param {Intl.DateTimeFormatOptions['timeZone']} [timezoneArg] - timezone
 * @return {XBDate}
 */
function createDate( dateArg, timezoneArg ) {
	let date = dateArg != null ? new Date( dateArg ) : new Date();
	let formatters = createFormaters( timezoneArg );

	return Object.freeze( {
		get() {
			// should I run any conversion here based on the provided timezone?
			return date;
		},
		getTime() {
			return date.getTime();
		},
		year( newYear ) {
			if ( newYear !== undefined ) {
				date.setFullYear( newYear );
			}

			return Number( formatters.year.format( date ) );
		},
		month(newMonth) {
			// set month if newMonth is undefined, return the current month
			if ( newMonth!== undefined ) {
                date.setMonth( newMonth );
            }

			// subtract 1 to be equivalent to the date.getMonth
            return Number( formatters.month.format( date ) ) - 1;;
		},
		date(newDate) {
			if ( newDate!== undefined ) {
                date.setDate( newDate );
            }

            return Number( formatters.day.format( date ) );
		},

		weekday() {
			return Number( formatters.weekday.format( date ) );
		},
		hours(newHours) {
			if ( newHours!== undefined ) {
                date.setHours( newHours );
            }

            return Number( formatters.hour.format( date ) );
		},
		minutes(newMinutes) {
			if ( newMinutes!== undefined ) {
                date.setMinutes( newMinutes );
            }

            return Number( formatters.minute.format( date ) );
		},
		seconds(newSeconds) {
			if ( newSeconds!== undefined ) {
                date.setSeconds( newSeconds );
            }

            return Number( formatters.second.format( date ) );
		},
		milliseconds(newMilliseconds) {
			if ( newMilliseconds!== undefined ) {
                date.setMilliseconds( newMilliseconds );
            }

            return Number( formatters.millisecond.format( date ) );
		},
		timezone( timezoneArg ) {
			return createDate( date, timezoneArg );
		},
		add( summands ) {
			const result = Object.entries( summands || [] ).reduce(
				( newDate, [ key, summand ] ) => {
					return add( newDate, key, summand );
				},
				date
			);

			return createDate( result );
		},
		subtract( subtrahends ) {
			const result = Object.entries( subtrahends || [] ).reduce(
				( newDate, [ key, subtrahend ] ) => {
					return add( newDate, key, -1 * subtrahend );
				},
				date
			);

			return createDate( result );
		},
		reset( period ) {
			switch ( period ) {
				case 'start-of-day':
					newValue.hours = 0;
					newValue.minutes = 0;
					newValue.seconds = 0;
					newValue.milliseconds = 0;
					break;
				case 'middle-of-day':
					newValue.hours = 12;
					newValue.minutes = 0;
					newValue.seconds = 0;
					newValue.milliseconds = 0;
					break;
				case 'end-of-day':
					newValue.hours = 23;
					newValue.minutes = 59;
					newValue.seconds = 59;
					newValue.milliseconds = 999;
					break;
			}
		},
		set( overrides ) {
			if ( overrides == null ) {
				return this;
			}

			if ( overrides.year != null ) {
				date.setFullYear( overrides.year );
			}

			if ( overrides.month != null ) {
				date.setMonth( overrides.month );
			}

			if ( overrides.day != null ) {
				date.setDate( overrides.day );
			}

			if ( overrides.hours != null ) {
				date.setHours( overrides.hours );
			}

			if ( overrides.minutes != null ) {
				date.setMinutes( overrides.minutes );
			}

			if ( overrides.seconds != null ) {
				date.setSeconds( overrides.seconds );
			}

			if ( overrides.milliseconds != null ) {
				date.setMilliseconds( overrides.milliseconds );
			}

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
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
			[ unit ]: value,
		};

		const newDate = new Date( date );

		newDate.setFullYear( newDate.getFullYear() + increment.year );
		newDate.setMonth( newDate.getMonth() + increment.month );
		newDate.setDate( newDate.getDate() + increment.day );
		newDate.setHours( newDate.getHours() + increment.hours );
		newDate.setMinutes( newDate.getMinutes() + increment.minutes );
		newDate.setSeconds( newDate.getSeconds() + increment.seconds );
		newDate.setMilliseconds( newDate.getMilliseconds() + increment.milliseconds );

		return newDate;
	}

	function matches( ...constraintsArgs ) {
		const constraints = XBDateConstraintFactory( ...constraintsArgs );

		return constraints.matches( date );
	}

	function createFormaters( timezoneArg ) {
		const timezome = timezoneArg != null ? { timeZone: timezoneArg } : {};

		const yearFormatter = new Intl.DateTimeFormat( 'en', {
			year: 'numeric',
			...timezome,
		} );

		const monthFormatter = new Intl.DateTimeFormat( 'en', {
			month: '2-digit',
			...timezome,
		} );

		const dayFormatter = new Intl.DateTimeFormat( 'en', {
			day: '2-digit',
			...timezome,
		} );

		const hourFormatter = new Intl.DateTimeFormat( 'en', {
			hour: '2-digit',
			hour12: false,
			...timezome,
		} );

		const minuteFormatter = new Intl.DateTimeFormat( 'en', {
			minute: '2-digit',
			...timezome,
		} );
		const secondFormatter = new Intl.DateTimeFormat( 'en', {
			second: '2-digit',
			...timezome,
		} );
		const millisecondFormatter = new Intl.DateTimeFormat( 'en', {
			fractionalSecondDigits: '3',
			...timezome,
		} );

		const weekdayFormatter = new Intl.DateTimeFormat( 'en', {
			weekday: 'long',
			...timezome,
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
