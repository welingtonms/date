import tokenizer from './format-tokenizer';
import { padded } from './utils';

function identity( value ) {
	return value;
}

// TODO: add support for timezone
/**
 * This helpers provides a convenient layer on top of `Intl.DateTimeFormat`,
 * using common tokens (based on `momentjs`) to format dates.
 *
 * ## Supported tokens
 *
 *|                                | Token | Output                                    |
 *| :----------------------------- | :---- | :---------------------------------------- |
 *| Month                          | MM    | 01, 02, ..., 11, 12                       |
 *|                                | MMM   | Jan, Feb, ..., Nov, Dec                   |
 *|                                | MMMM  | January, February, ..., November,December |
 *| Day of Month                   | DD    | 01, 02, ..., 30, 31                       |
 *| Day of week                    | ddd   | Sun, Mon, ... Fri, Sat                    |
 *|                                | dddd  | Sunday, Monday, ..., Friday, Saturday     |
 *| Year                           | YYYY  | 1970, 1971, ..., 2029, 2030               |
 *| Hour                           | HH    | 00, 01, ..., 22, 23                       |
 *|                                | hh    | 00, 01, ..., 11, 12                       |
 *| Minute                         | mm    | 01, 02, ..., 11, 12                       |
 *| Seconds                        | ss    | 01, 02, ..., 58, 59                       |
 *| Post or ante meridiem          | a     | am, pm                                    |
 *|                                | A     | AM, PM                                    |
 *| Scaped sequence                | []    |                                           |
 *
 * @param {string} format - Format to be applied
 * @returns {XBDateFormatter} - The format ready to be applied to any `XBDate`.
 */
function XBDateFormatterFactory( format ) {
	const tokens = tokenizer( format );

	/**
	 * @type {XBDateFormatter}
	 */
	const formatter = {
		format( date ) {
			return tokens
				.map( ( token ) => {
					if ( token in DEFAULT_FORMATTERS ) {
						const value = DEFAULT_FORMATTERS[ token ].format(
							date.get()
						);

						return ( ADDITIONAL_FORMATTERS[ token ] || identity )(
							value
						);
					}

					return token;
				} )
				.join( '' );
		},
	};

	return formatter;
}

/**
 * TODO: Evaluate the need to add the following pollyfills:
 * - https://formatjs.io/docs/polyfills/intl-datetimeformat/
 * - https://formatjs.io/docs/polyfills/intl-getcanonicallocales/
 * - https://formatjs.io/docs/polyfills/intl-locale/
 * - https://formatjs.io/docs/polyfills/intl-numberformat/
 * - https://formatjs.io/docs/polyfills/intl-pluralrules/
 * @type {Record<string, Intl.DateTimeFormat>}
 */
const DEFAULT_FORMATTERS = {
	MM: new Intl.DateTimeFormat( 'en-US', {
		month: '2-digit',
	} ),
	MMM: new Intl.DateTimeFormat( 'en-US', {
		month: 'short',
	} ),
	MMMM: new Intl.DateTimeFormat( 'en-US', {
		month: 'long',
	} ),
	DD: new Intl.DateTimeFormat( 'en-US', {
		day: '2-digit',
	} ),
	ddd: new Intl.DateTimeFormat( 'en-US', {
		weekday: 'short',
	} ),
	dddd: new Intl.DateTimeFormat( 'en-US', {
		weekday: 'long',
	} ),
	YYYY: new Intl.DateTimeFormat( 'en-US', {
		year: 'numeric',
	} ),
	HH: new Intl.DateTimeFormat( 'en-US', {
		hour: '2-digit',
		hour12: false,
	} ),
	hh: new Intl.DateTimeFormat( 'en-US', {
		hour: '2-digit',
		hour12: true,
	} ),
	mm: new Intl.DateTimeFormat( 'en-US', {
		minute: '2-digit',
		hour12: false,
	} ),
	ss: new Intl.DateTimeFormat( 'en-US', {
		second: '2-digit',
		hour12: false,
	} ),
	a: new Intl.DateTimeFormat( 'en-US', {
		hour: '2-digit',
		hour12: true,
	} ),
	A: new Intl.DateTimeFormat( 'en-US', {
		hour: '2-digit',
		hour12: true,
	} ),
};

/**
 * Apply additional formatting.
 *
 * Padding, for example, is applied in some cases due to [this](https://bugs.chromium.org/p/chromium/issues/detail?id=527926) bug.
 * @type {Record<string, (value: string) => string}
 */
const ADDITIONAL_FORMATTERS = {
	hh: ( value ) => ( value ? padded( value.split( ' ' )[ 0 ], 2 ) : value ),
	HH: ( value ) => ( value ? padded( value, 2 ) : value ),
	mm: ( value ) => ( value ? padded( value, 2 ) : value ),
	ss: ( value ) => ( value ? padded( value, 2 ) : value ),
	a: ( value ) =>
		value ? ( value.split( ' ' )[ 1 ] || '' ).toLowerCase() : value,
	A: ( value ) =>
		value ? ( value.split( ' ' )[ 1 ] || '' ).toUpperCase() : value,
};

export default XBDateFormatterFactory;

/**
 * @typedef {import('./types').XBDateFormatter} XBDateFormatter
 */
