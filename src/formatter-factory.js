import { normalizeDate } from './date-utils';
import { InvalidFormatValueError } from './errors';
import { createFormatters } from './formatter-utils';

/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
function identity( value ) {
	return value;
}

/**
 * Break provided format into supported tokens.
 * @param {string} format
 * @returns {string[]} Returns the provided format broken into supported tokens.
 */
export function tokenizer( format ) {
	const tokens = format.split(
		/(Y-4|Y-2|M-long|M-short|M-2|M-1|D-long|D-short|D-index|D-2|D-1|h-2|h-1|m-2|m-1|s-2|s-1|ms-3|ms|tz|a-upper|a-lower)/g
	);

	return tokens.filter( Boolean );
}

// TODO: add support for timezone
/**
 * This helpers provides a convenient layer on top of `Intl.DateTimeFormat`,
 * using common tokens (based on `momentjs`) to format dates.
 *
 * ## Supported tokens (TBD)
 *
 *|                                | Token | Output                                    |
 *| :----------------------------- | :---- | :---------------------------------------- |
 *| Month                          | MM    | 01, 02, ..., 11, 12                       |
 *
 * @param {string} format - Format to be applied
 * @param {string | string[]} [locales]
 * @param {Intl.DateTimeFormatOptions['timeZone']} [timezone] - timezone
 * @returns {XBDateFormatter} - The format ready to be applied to any `XBDate`.
 */
export function createFormatter( format, locales = 'default', timezone ) {
	const tokens = tokenizer( format ); //?
	const formatters = createFormatters( locales, timezone );

	return Object.freeze( {
		format( dateArg ) {
			if ( dateArg == null ) {
				return null;
			}

			const date = normalizeDate( dateArg );
			return tokens
				.map( ( token ) => {
					if ( ! formatters[ token ] ) {
						return token;
					}

					try {
						// let value = date;

						// if ( DEFAULT_FORMATTERS[ token ] ) {
						// 	value = DEFAULT_FORMATTERS[ token ].format( value );
						// }

						// if ( ADDITIONAL_FORMATTERS[ token ] ) {
						// 	return ADDITIONAL_FORMATTERS[ token ]( value );
						// }

						return formatters[ token ]( date );
					} catch {
						throw new InvalidFormatValueError( date, token );
					}

					return null;
				} )
				.join( '' );
		},
	} );
}

/**
 * TODO: Evaluate the need to add the following pollyfills:
 * - https://formatjs.io/docs/polyfills/intl-datetimeformat/
 * - https://formatjs.io/docs/polyfills/intl-getcanonicallocales/
 * - https://formatjs.io/docs/polyfills/intl-locale/
 * - https://formatjs.io/docs/polyfills/intl-numberformat/
 * - https://formatjs.io/docs/polyfills/intl-pluralrules/
 */
// const DEFAULT_FORMATTERS = {
// 	'Y-4': new Intl.DateTimeFormat( 'default', { year: 'numeric' } ),
// 	'Y-2': new Intl.DateTimeFormat( 'default', { year: 'numeric' } ),
// 	'M-long': new Intl.DateTimeFormat( 'default', { month: 'long' } ),
// 	'M-short': new Intl.DateTimeFormat( 'default', { month: 'short' } ),
// 	'M-2': new Intl.DateTimeFormat( 'default', { month: '2-digit' } ),
// 	'M-1': new Intl.DateTimeFormat( 'default', { month: 'numeric' } ),
// 	'D-2': new Intl.DateTimeFormat( 'default', { day: '2-digit' } ),
// 	'D-1': new Intl.DateTimeFormat( 'default', { day: 'numeric' } ),
// 	'D-long': new Intl.DateTimeFormat( 'default', { weekday: 'long' } ),
// 	'D-short': new Intl.DateTimeFormat( 'default', { weekday: 'short' } ),
// 	'h-2': new Intl.DateTimeFormat( 'default', {
// 		hour: '2-digit',
// 		hour12: false,
// 	} ),
// 	'h-1': new Intl.DateTimeFormat( 'default', { hour: 'numeric' } ),
// 	'm-2': new Intl.DateTimeFormat( 'default', { minute: '2-digit' } ),
// 	'm-1': new Intl.DateTimeFormat( 'default', { minute: 'numeric' } ),
// 	's-2': new Intl.DateTimeFormat( 'default', { second: '2-digit' } ),
// 	's-1': new Intl.DateTimeFormat( 'default', { second: 'numeric' } ),
// 	'ms-3': new Intl.DateTimeFormat( 'en-US', {
// 		second: '2-digit',
// 		hour12: false,
// 	} ),
// 	tz: new Intl.DateTimeFormat( 'default', { timeZoneName: 'short' } ),
// 	'a-upper': new Intl.DateTimeFormat( 'en-US', {
// 		hour: '2-digit',
// 		hour12: true,
// 	} ),
// 	'a-lower': new Intl.DateTimeFormat( 'en-US', {
// 		hour: '2-digit',
// 		hour12: true,
// 	} ),
// };

/**
 * Apply additional formatting.
 *
 * Padding, for example, is applied in some cases due to [this](https://bugs.chromium.org/p/chromium/issues/detail?id=527926) bug.
 */
// const ADDITIONAL_FORMATTERS = {
// 	'Y-2': ( value ) => value.slice( -2 ),
// 	'D-index': ( date ) => date.getDay(),
// 	'm-2': ( value ) => padded( value, 2 ),
// 	's-2': ( value ) => padded( value, 2 ),
// 	'ms-3': ( value ) => padded( value, 3 ),
// 	'a-upper': ( value ) => value.split( /\s/ )[ 1 ].toUpperCase(),
// 	'a-lower': ( value ) => value.split( /\s/ )[ 1 ].toLowerCase(),
// };

/**
 * @typedef {import('./types').XBDateFormatter} XBDateFormatter
 */
