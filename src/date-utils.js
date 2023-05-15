// import { getFormattedOffset } from './timezone-utils';
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
 */
export function toUTC( dateArg ) {
	const date = dateArg != null ? new Date( dateArg ) : new Date();

	// create a date with local timezone based on the UTC input date
	const utcDate = new Date(
		Date.UTC(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds(),
			date.getUTCMilliseconds()
		)
	);

	return utcDate;
}

/**
 *
 * @param {InputDate} dateArg
 */
export function normalizeToUTC( dateArg ) {
	dateArg//?
	const date = dateArg != null ? new Date( dateArg ) : new Date();

	return toUTC( date );
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
		const timestamp = range.getTime();

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

/**
 *
 * @param {string} dateArg
 * @param {string} timezoneArg
 */
// export function getISODate( dateArg, timezoneArg ) {
// 	if ( ! dateArg || typeof dateArg !== 'string' ) {
// 		return null;
// 	}

// 	//YYYY-MM-DDTHH:mm:ss.sss+00:00
// 	const year = dateArg.slice( 0, 4 );
// 	const month = dateArg.slice( 5, 7 );
// 	const day = dateArg.slice( 8, 10 );
// 	const hours = dateArg.slice( 11, 13 ) || '12';
// 	const minutes = dateArg.slice( 14, 16 ) || '00';
// 	const seconds = dateArg.slice( 17, 19 ) || '00';
// 	const milliseconds = dateArg.slice( 20, 23 ) || '000';
// 	const timezone = dateArg.slice( 23 ) || 'Z'; //?

// 	getFormattedOffset(timezone)//?

// 	return '';
// }

// JSON.stringify( f( '1995-12-17T03:24:00', 'America/Sao_Paulo' ) ); //?
// 1995-12-17T03:24:00.000-03:00
