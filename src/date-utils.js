import { MAX_SUPPORTED_DATE, MIN_SUPPORTED_DATE } from './constants';

/** @type {XBCreateDateOptions} */
export const DEFAULT_OPTIONS = {
	normalize: true,
};

/**
 *
 * @param {XBCreateDateOptions} [optionsArg] - Additional options
 */
function getOptions( optionsArg ) {
	return { ...DEFAULT_OPTIONS, ...optionsArg };
}

/**
 *
 * @param {InputDate} dateArg
 * @param {XBCreateDateOptions} optionsArg
 */
export function normalizeToUTC( dateArg, optionsArg ) {
	const options = getOptions( optionsArg );

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
}

/**
 * Constraints represent ranges of dates, inclusive in both ends.
 * Returns an array representing the initial and final timestamps (after the transformations applied by `XBDateFactory`).
 *
 * @example
 * ```js
 * // to represent a range that starts and ends in the same date
 * toRange(1643371200000) // returns [1643371200000, 1643371200000]
 * toRange([1643371200000, 1643371200000]) // returns [1643371200000, 1643371200000]
 * toRange('2022-01-28T12:00:00.000Z') // returns [1643371200000, 1643371200000]
 * toRange(['2022-01-28T12:00:00.000Z', '2022-01-28T12:00:00.000Z']) // returns [1643371200000, 1643371200000]
 *
 * // to represent a range that starts at one date and ends at another
 * toRange([1641038400000, 1643371200000]) // returns [1641038400000, 1643371200000]
 * toRange(['2022-01-01T12:00:00.000Z', '2022-01-28T12:00:00.000Z']) // returns [1641038400000, 1643371200000]
 *
 * // to represent a range that starts at one date and has no end
 * toRange([1641038400000, null]) // returns [1641038400000, `MAX_SUPPORTED_DATE`]
 * toRange(['2022-01-01T12:00:00.000Z', null]) // returns [1641038400000, `MAX_SUPPORTED_DATE`]
 *
 * // to represent a range that ends at one date and has no start
 * toRange([null, 1643371200000]) // returns [`MIN_SUPPORTED_DATE`, 1643371200000]
 * toRange([null, '2022-01-28T12:00:00.000Z']) // returns [`MIN_SUPPORTED_DATE`, 1643371200000]
 * ```
 * @param {} range
 * @param {*} optionsArg
 * @returns {[ number, number ]}
 */
export function toRange( range, optionsArg ) {
	if ( ! Array.isArray( range ) ) {
		const timestamp = normalizeToUTC( range, optionsArg ).getTime();

		return [ timestamp, timestamp ];
	}

	const rangeStart =
		range[ 0 ] != null
			? normalizeToUTC( range[ 0 ], optionsArg ).getTime()
			: MIN_SUPPORTED_DATE;
	const rangeEnd =
		range[ 1 ] != null
			? normalizeToUTC( range[ 1 ], optionsArg ).getTime()
			: MAX_SUPPORTED_DATE;

	if ( rangeStart > rangeEnd ) {
		throw new InvalidDateRangeError( [ rangeStart, rangeEnd ] );
	}

	return [ rangeStart, rangeEnd ];
}

/**
 * Wrap range into a function.
 * @param {} range - date range to be evaluated.
 * @returns {}
 */
export function getRangeEvaluator( range ) {
	// we get a normalized range so it's easier to perform the comparison.
	const [ start, end ] = toRange( range );

	/**
	 * @param {XBDate} day
	 * @returns {boolean}
	 */
	function matches( day ) {
		if ( start > end ) {
			throw new InvalidDateRangeError( [ start, end ] );
		}

		return start <= day.getTime() && day.getTime() <= end;
	}

	return matches;
}

/**
 * @typedef {import('./types').XBDateCreateOptions} XBDateCreateOptions
 * @typedef {import('./types').DateUnit} DateUnit
 * @typedef {import('./types').InputDate} InputDate
 * @typedef {import('./types').SingleDateConstraint} SingleDateConstraint
 * @typedef {import('./types').DateRangeConstraint} DateRangeConstraint
 * @typedef {import('./types').FunctionDateConstraint} FunctionDateConstraint
 * @typedef {import('./types').DateConstraint} DateConstraint
 * @typedef {import('./types').DateOperationInput} DateOperationInput
 * @typedef {import('./types').XBDate} XBDate
 */
