import { normalizeDate } from './date-utils';
import { InvalidFormatValueError } from './errors';
import { createFormatters } from './formatter-utils';

/**
 * Break provided format into supported tokens.
 * @param {string} format
 * @returns {string[]} Returns the provided format broken into supported tokens.
 */
export function tokenizer( format ) {
	const tokens = format.split(
		/(%4Y|%2Y|%lM|%sM|%2M|%M|%lD|%sD|%iD|%02D|%D|%02h|%h|%2M|%m|%02s|%s|%03ms|%ms|tz|%uA|%lA)/g
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
						return formatters[ token ]( date );
					} catch {
						throw new InvalidFormatValueError( date, token );
					}
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
/**
 * @typedef {import('./types').XBDateFormatter} XBDateFormatter
 */
