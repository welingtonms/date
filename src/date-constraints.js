import { MAX_SUPPORTED_DATE, MIN_SUPPORTED_DATE } from './constants';
import isFunction from './is-function';
import XBDateFactory from './date-factory';

/**
 * Constraints represent ranges of dates, inclusive in both ends.
 * Returns an array representing the initial and final timestamps (after the transformations applied by `XBDateFactory`).
 *
 * @example
 * ```js
 * // to represent a range that starts and ends in the same date
 * toConstraintRange(1643371200000) // returns [1643371200000, 1643371200000]
 * toConstraintRange([1643371200000, 1643371200000]) // returns [1643371200000, 1643371200000]
 * toConstraintRange('2022-01-28T12:00:00.000Z') // returns [1643371200000, 1643371200000]
 * toConstraintRange(['2022-01-28T12:00:00.000Z', '2022-01-28T12:00:00.000Z']) // returns [1643371200000, 1643371200000]
 *
 * // to represent a range that starts at one date and ends at another
 * toConstraintRange([1641038400000, 1643371200000]) // returns [1641038400000, 1643371200000]
 * toConstraintRange(['2022-01-01T12:00:00.000Z', '2022-01-28T12:00:00.000Z']) // returns [1641038400000, 1643371200000]
 *
 * // to represent a range that starts at one date and has no end
 * toConstraintRange([1641038400000, null]) // returns [1641038400000, `MAX_SUPPORTED_DATE`]
 * toConstraintRange(['2022-01-01T12:00:00.000Z', null]) // returns [1641038400000, `MAX_SUPPORTED_DATE`]
 *
 * // to represent a range that ends at one date and has no start
 * toConstraintRange([null, 1643371200000]) // returns [`MIN_SUPPORTED_DATE`, 1643371200000]
 * toConstraintRange([null, '2022-01-28T12:00:00.000Z']) // returns [`MIN_SUPPORTED_DATE`, 1643371200000]
 * ```
 * @param {SingleDateConstraint | DateRangeConstraint} range
 * @returns {[ number, number ]}
 */
export function toConstraintRange( range ) {
	if ( ! Array.isArray( range ) ) {
		const timestamp = XBDateFactory( range ).getTime();

		return [ timestamp, timestamp ];
	}

	const rangeStart =
		range[ 0 ] != null
			? XBDateFactory( range[ 0 ] ).getTime()
			: MIN_SUPPORTED_DATE;
	const rangeEnd =
		range[ 1 ] != null
			? XBDateFactory( range[ 1 ] ).getTime()
			: MAX_SUPPORTED_DATE;

	if ( rangeStart > rangeEnd ) {
		throw new InvalidDateConstraintError( [ rangeStart, rangeEnd ] );
	}

	return [ rangeStart, rangeEnd ];
}

/**
 * Wrap range constraint into a function and return a function constraint untouched.
 * @param {DateConstraint} constraint - date constraint to be evaluated.
 * @returns {FunctionDateConstraint}
 */
export function getConstraintEvaluator( constraint ) {
	if ( isFunction( constraint ) ) {
		return constraint;
	}

	// we get a normalized range so it's easier to perform the comparison.
	const [ start, end ] = toConstraintRange( constraint );

	/**
	 * @param {XBDate} day
	 * @returns {boolean}
	 */
	function matches( day ) {
		if ( start > end ) {
			throw new InvalidDateConstraintError( [ start, end ] );
		}

		return start <= day.getTime() && day.getTime() <= end;
	}

	return matches;
}

export class InvalidDateConstraintError extends Error {
	/**
	 * @constructor
	 * @param {[ number, number ]} range
	 */
	constructor( range ) {
		const [ start, end ] = range;
		super( `Invalid constraint: [${ start }, ${ end }]` );
	}
}

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
