import { createFormatters } from './formatter-utils';
import { InvalidComparisonOperatorError } from './errors';
import { toRange } from './date-utils';
import { createConstraints } from './constraints-factory';

/**
 * Ideally, follow the date/time string formats:
 * * 567432000000
 * * `YYYY-MM-DD`
 * * `YYYY-MM-DDTHH:mm:ss.sssZ`
 * * `YYYY-MM-DDTHH:mm:ss.sss+00:00`
 *
 * `dateArg` is expected to have timezone information or to be UTC.
 *
 * It uses overloaded getters and setters: Calling these methods without parameters acts as a getter,
 *  and calling them with a parameter acts as a setter.
 *
 * @param {DateInput} [dateArg] - Date
 * @param {Intl.DateTimeFormatOptions['timeZone']} [timezoneArg] - timezone
 * @return {XBDate}
 */
export function createDate( dateArg, timezoneArg ) {
	let date = dateArg != null ? new Date( dateArg ) : new Date();
	let formatters = createFormatters( 'en-US', timezoneArg );

	return Object.freeze( {
		_xb: 'xb-date',
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

			return Number( formatters[ 'Y-4' ]( date ) );
		},
		month( newMonth ) {
			// set month if newMonth is undefined, return the current month
			if ( newMonth !== undefined ) {
				date.setMonth( newMonth );
			}

			// subtract 1 to be equivalent to the date.getMonth
			return Number( formatters[ 'M-2' ]( date ) ) - 1;
		},
		date( newDate ) {
			if ( newDate !== undefined ) {
				date.setDate( newDate );
			}

			return Number( formatters[ 'D-2' ]( date ) );
		},

		weekday() {
			return Number( formatters[ 'D-index' ]( date ) );
		},
		hours( newHours ) {
			if ( newHours !== undefined ) {
				date.setHours( newHours );
			}

			return Number( formatters[ 'h-2' ]( date ) );
		},
		minutes( newMinutes ) {
			if ( newMinutes !== undefined ) {
				date.setMinutes( newMinutes );
			}

			return Number( formatters[ 'm-2' ]( date ) );
		},
		seconds( newSeconds ) {
			if ( newSeconds !== undefined ) {
				date.setSeconds( newSeconds );
			}

			return Number( formatters[ 's-2' ]( date ) );
		},
		milliseconds( newMilliseconds ) {
			if ( newMilliseconds !== undefined ) {
				date.setMilliseconds( newMilliseconds );
			}

			return Number( formatters[ 'ms-3' ]( date ) );
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
					set( {
						hours: 0,
						minutes: 0,
						seconds: 0,
						milliseconds: 0,
					} );
					break;
				case 'middle-of-day':
					set( {
						hours: 12,
						minutes: 0,
						seconds: 0,
						milliseconds: 0,
					} );
					break;
				case 'end-of-day':
					set( {
						hours: 23,
						minutes: 59,
						seconds: 59,
						milliseconds: 999,
					} );
					break;
			}

			return this;
		},
		set( overrides ) {
			if ( overrides != null ) {
				set( overrides );
			}

			return this;
		},
		is( operator, otherDate, precision = 'day' ) {
			if ( otherDate == null ) {
				return false;
			}

			const constraints = createConstraints( getReferenceRange() );

			return constraints.match( date, precision );

			function getReferenceRange() {
				switch ( operator ) {
					case '<=':
					case 'before.or.equal':
						return [ null, otherDate ];
					case '<':
					case 'before':
						const beforeOtherDate = otherDate.subtract( {
							[ precision ]: 1,
						} );

						return [ null, beforeOtherDate ];
					case '=':
					case 'equal':
						return [ otherDate, otherDate ];
					case '>':
					case 'after':
						const afterOtherDate = otherDate.add( {
							[ precision ]: 1,
						} );

						return [ afterOtherDate, null ];
					case '>=':
					case 'after.or.equal':
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
		newDate.setMilliseconds(
			newDate.getMilliseconds() + increment.milliseconds
		);

		return newDate;
	}

	/**
	 * @param {Record<DateUnit, number>} overrides
	 * @returns {void}
	 */
	function set( overrides ) {
		if ( overrides == null ) {
			return;
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
	}
}

/**
 * @param {DateRangeConstraintEvaluator} rangeArg
 * @returns {XBDateRange}
 */
export function createDateRange( rangeArg ) {
	let [ rangeStart, rangeEnd ] = toRange( rangeArg, 'strict' ).map(
		( timestamp ) => {
			return timestamp == null ? timestamp : createDate( timestamp );
		}
	);

	return Object.freeze( {
		_xb: 'xb-date-range',
		start( newRangeStart ) {
			if ( newRangeStart !== undefined ) {
				rangeStart = createDate( newRangeStart );

				adjustDateRangeOrder();
			}

			return rangeStart;
		},
		end( newRangeEnd ) {
			if ( newRangeEnd !== undefined ) {
				rangeEnd = createDate( newRangeEnd );

				adjustDateRangeOrder();
			}

			return rangeEnd;
		},
		toString() {
			return `${ rangeStart?.toString() ?? '' } - ${
				rangeEnd?.toString() ?? ''
			}`;
		},
	} );

	/**
	 * Adjust the order of the date range, swapping the dates if
	 * the start date is after the end date.
	 */
	function adjustDateRangeOrder() {
		if ( rangeStart == null || rangeEnd == null ) {
			return;
		}

		if ( rangeStart.getTime() > rangeEnd.getTime() ) {
			[ rangeStart, rangeEnd ] = [ rangeEnd, rangeStart ];
		}
	}
}

/**
 * @typedef {import('./types').DateInput} DateInput
 * @typedef {import('./types').XBDate} XBDate
 * @typedef {import('./types').XBDateRange} XBDateRange
 * @typedef {import('./types').DateRangeConstraintEvaluator} DateRangeConstraintEvaluator
 *
 */
