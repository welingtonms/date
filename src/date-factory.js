import { getConstraintEvaluator } from './date-constraints';
import isEmpty from './is-empty';

/** @type {XBDateFactoryOptions} */
export const DEFAULT_OPTIONS = {
	normalize: true,
};

/**
 * Ideally, follow the date/time string formats:
 * * `YYYY-MM-DD`
 * * `YYYY-MM-DDTHH:mm:ss.sssZ`
 * * `YYYY-MM-DDTHH:mm:ss.sss+00:00`
 *
 * `dateArg` is expected to have timezone information or to be UTC.
 *
 * By default, we normalize the input date to 12:00:00 (UTC); this simplifies comparison of dates; be mindful
 * of this when using this helper for time relate logic.
 * You can disable this behavior by passing `options.normalize: false`.
 *
 * @param {InputDate} [dateArg] - Date
 * @return {XBDate}
 */
function XBDateFactory( dateArg, optionsArg = DEFAULT_OPTIONS ) {
	const options = { ...DEFAULT_OPTIONS, ...optionsArg };

	const utcDate = ( function normalizeToUTC() {
		let date = new Date();

		if ( dateArg != null ) {
			date = new Date( dateArg );
		}

		// create a date with local timezone based on the UTC input date
		const utcDate = new Date(
			Date.UTC(
				date.getUTCFullYear(),
				date.getUTCMonth(),
				date.getUTCDate(),
				options.normalize ? 12 : date.getUTCHours(),
				options.normalize ? 0 : date.getUTCMinutes(),
				options.normalize ? 0 : date.getUTCSeconds(),
				options.normalize ? 0 : date.getUTCMilliseconds()
			)
		);

		return utcDate;
	} )();

	return {
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
			const result = Object.keys( summands || [] ).reduce(
				( newDate, key ) => {
					return add( newDate, key, summands[ key ] );
				},
				utcDate
			);

			return result;
		},
		subtract( subtrahends ) {
			const result = Object.keys( subtrahends || [] ).reduce(
				( newDate, key ) => {
					return add( newDate, key, -1 * subtrahends[ key ] );
				},
				utcDate
			);

			return result;
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
		matches( ...constraints ) {
			if ( isEmpty( constraints ) ) {
				return false;
			}

			const constraintEvaluators = constraints.map(
				getConstraintEvaluator
			);
			const date = XBDateFactory( utcDate );

			return constraintEvaluators.some( ( evaluator ) => {
				return evaluator( date );
			} );
		},
		is( operator, otherDate, precision = 'day' ) {
			if ( otherDate == null ) {
				return false;
			}

			const referenceRange = ( function getReferenceRange() {
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
			} )();

			return this.matches( referenceRange );
		},
		toString() {
			return utcDate.toISOString();
		},
	};
}

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

	return XBDateFactory( newDate );
}

export class InvalidComparisonOperatorError extends Error {
	/**
	 * @constructor
	 * @param {string} operator
	 */
	constructor( operator ) {
		super(
			`Invalid comparison operator: ${ operator }; only >=, >, =, < , and <= are accepted.`
		);
	}
}

export default XBDateFactory;

/**
 * @typedef {import('./types').XBDateFactoryOptions} XBDateFactoryOptions
 * @typedef {import('./types').DateUnit} DateUnit
 * @typedef {import('./types').InputDate} InputDate
 * @typedef {import('./types').SingleDateConstraint} SingleDateConstraint
 * @typedef {import('./types').DateRangeConstraint} DateRangeConstraint
 * @typedef {import('./types').FunctionDateConstraint} FunctionDateConstraint
 * @typedef {import('./types').DateConstraint} DateConstraint
 * @typedef {import('./types').DateOperationInput} DateOperationInput
 * @typedef {import('./types').XBDate} XBDate
 */
