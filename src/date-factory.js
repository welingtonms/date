import XBDateConstraintFactory from './date-constraints';
import { getRangeEvaluator, normalizeToUTC, toRange } from './date-utils';
import { InvalidComparisonOperatorError } from './errors';

/**
 * Add the given `value` to the provided `key` of the provided `date`.
 * @param {Date} date - Date where the operation should be performed.
 * @param {DateUnit} unit - period
 * @param {number} value - value to be added
 * @returns {XBDate} new date after the operation.
 */
export function add( date, unit, value ) {
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
 * @param {XBCreateDateOptions} [optionsArg] - Additional options
 * @return {XBDate}
 */
function createDate( dateArg, optionsArg ) {
	const utcDate = normalizeToUTC( dateArg, optionsArg );

	return Object.freeze( {
		get() {
			return utcDate;
		},
		getYear() {
			return utcDate.getUTCFullYear();
		},
		getMonth() {
			return utcDate.getUTCMonth();
		},
		getDate() {
			return utcDate.getUTCDate();
		},
		getTime() {
			return utcDate.getTime();
		},
		getWeekday() {
			return utcDate.getUTCDay();
		},
		getHours() {
			return utcDate.getUTCHours();
		},
		getMinutes() {
			return utcDate.getUTCMinutes();
		},
		getSeconds() {
			return utcDate.getUTCSeconds();
		},
		add( summands ) {
			const result = Object.entries( summands || [] ).reduce(
				( newDate, [ key, summand ] ) => {
					return add( newDate, key, summand );
				},
				utcDate
			);

			return XBDateFactory( result );
		},
		subtract( subtrahends ) {
			const result = Object.entries( subtrahends || [] ).reduce(
				( newDate, [ key, subtrahend ] ) => {
					return add( newDate, key, -1 * subtrahend );
				},
				utcDate
			);

			return XBDateFactory( result );
		},
		set( values ) {
			const newValue = {
				year: utcDate.getUTCFullYear(),
				month: utcDate.getUTCMonth(),
				day: utcDate.getUTCDate(),
				...( values || {} ),
			};

			utcDate.setUTCFullYear( newValue.year );
			utcDate.setUTCMonth( newValue.month );
			utcDate.setUTCDate( newValue.day );

			return this;
		},
		matches( ...constraintsArgs ) {
			const constraints = XBDateConstraintFactory( ...constraintsArgs );
			const date = XBDateFactory( utcDate );

			return constraints.matches( date );
		},
		is( operator, otherDate, precision = 'day' ) {
			if ( otherDate == null ) {
				return false;
			}

			return this.matches( getReferenceRange() );

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
			return utcDate.toISOString();
		},
	} );
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
