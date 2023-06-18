import { MAX_SUPPORTED_DATE, MIN_SUPPORTED_DATE } from './constants';
import { InvalidDateRangeError } from './errors';

/**
 * Calculates the precise number of years, months, days, hours, minutes, seconds, and milliseconds
 * since the epoch (January 1, 1970, UTC) for the given timestamp.
 *
 * @param {number} timestamp - The timestamp value representing a date and time.
 * @returns {Record<DateUnit, number>} An object containing the precise differences in years, months, days, hours,
 *                   minutes, seconds, and milliseconds since the epoch.
 *                   Example: { years: 51, months: 4, days: 21, hours: 9, minutes: 39, seconds: 17, milliseconds: 123 }
 */
export function getTimestampComponents( timestamp ) {
	const date = new Date( timestamp );
	const epoch = new Date( 0 ); // January 1, 1970, UTC

	const year = date.getUTCFullYear() - epoch.getUTCFullYear();
	const month = date.getUTCMonth() - epoch.getUTCMonth();
	const day = date.getUTCDate() - epoch.getUTCDate();
	const hours = date.getUTCHours() - epoch.getUTCHours();
	const minutes = date.getUTCMinutes() - epoch.getUTCMinutes();
	const seconds = date.getUTCSeconds() - epoch.getUTCSeconds();
	const milliseconds = date.getUTCMilliseconds() - epoch.getUTCMilliseconds();

	return { year, month, day, hours, minutes, seconds, milliseconds };
}

/**
 * Approximate the timestamp of the given `date` to the provided `precision`.
 * @param {XBDate} date
 * @param {DateUnit} precision
 * @returns {number}
 */
export function getTimestampByPrecision( date, precision = 'milliseconds' ) {
	const MILLISECONDS_PER = {
		year: 3155695200000, // Approximation ignoring leap years
		month: 2592000000, // Approximation assuming 30-day months
		day: 86400000,
		hours: 3600000,
		minutes: 60000,
		seconds: 1000,
		milliseconds: 1,
	};

	const timestampComponents = getTimestampComponents( date );

	let timestampByPrecision = 0;

	// assuming entries will be in insertion order: years, months, days, hours, minutes, seconds, and milliseconds
	const entries = Array.from( Object.entries( timestampComponents ) );
	let done = false;
	for ( let i = 0; i < entries.length && ! done; i++ ) {
		const [ period, value ] = entries[ i ];
		timestampByPrecision += value * MILLISECONDS_PER[ period ];

		if ( period === precision ) {
			done = true;
		}
	}

	return timestampByPrecision;
}

/**
 * Constraints represent ranges of dates, inclusive in both ends.
 * Returns an array representing the initial and final timestamps (after the transformations applied by `XBDateFactory`).
 *
 * Modes:
 * * `strict`: will keep the `null` value for the start/end range
 * * `comparison`: will replace the `null` value for the start range with the `MIN_SUPPORTED_DATE`,
 *                and the `null` value for the end range with the `MAX_SUPPORTED_DATE.
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
 * @param {DateRangeConstraintEvaluator | DateInput | XBDate | null} rangeArg
 * @param {'strict' | 'comparison'} mode
 * @returns {[ number | null, number | null]}
 */
export function toRange( rangeArg, mode ) {
	let [ rangeStart, rangeEnd ] = (
		Array.isArray( rangeArg ) ? rangeArg : [ rangeArg, rangeArg ]
	 )
		.map( normalizeDate )
		.sort( ( a, b ) => {
			return (
				( a?.getTime() ?? MAX_SUPPORTED_DATE ) -
				( b?.getTime() ?? MIN_SUPPORTED_DATE )
			);
		} );

	return [
		rangeStart?.getTime() ??
			( mode == 'comparison' ? MIN_SUPPORTED_DATE : null ),
		rangeEnd?.getTime() ??
			( mode == 'comparison' ? MAX_SUPPORTED_DATE : null ),
	];
}

/**
 * Convert the given value into a date.
 * @param {DateInput | XBDate | null} [date]
 * @returns {Date | null}
 */
export function normalizeDate( date ) {
	if ( date == null ) {
		return null;
	}

	if ( typeof date === 'number' || typeof date === 'string' ) {
		return new Date( date );
	}

	if ( typeof date === 'object' && date._xb == 'xb-date' ) {
		return date.get();
	}

	// at this point, we assume it's already a date (date instanceof Date).
	return date;
}

/**
 * Wrap range into a function.
 * @param {DateRangeConstraintEvaluator | DateInput | XBDate | null} rangeArg
 * @param {DateUnit} [precision]
 * @returns {(day: XBDate) => boolean}
 */
export function getRangeEvaluator( rangeArg, precision = 'milliseconds' ) {
	// we get a normalized range so it's easier to perform the comparison.
	const [ rangeStart, rangeEng ] = toRange( rangeArg, 'comparison' );

	/**
	 * @param {XBDate} day
	 * @returns {boolean}
	 */
	function matches( day ) {
		if ( rangeStart > rangeEng ) {
			throw new InvalidDateRangeError( [
				rangeStart.toString(),
				rangeEng.toString(),
			] );
		}

		const timestampStart = getTimestampByPrecision( rangeStart, precision );
		const timestampEnd = getTimestampByPrecision( rangeEng, precision );
		const timestamp = getTimestampByPrecision( day, precision );

		return timestampStart <= timestamp && timestamp <= timestampEnd;
	}

	return matches;
}

/**
 * @typedef {import('./types').DateRangeConstraintEvaluator} DateRangeConstraintEvaluator
 * @typedef {import('./types').DateUnit} DateUnit
 * @typedef {import('./types').DateInput} DateInput
 * @typedef {import('./types').XBDate} XBDate
 */
