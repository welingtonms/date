import { padded } from './utils';

const ADDITIONAL_FORMATTERS = {
	'Y-2': ( value ) => value.slice( -2 ),
	'D-index': ( date ) => date.getDay(),
	'm-2': ( value ) => padded( value, 2 ),
	's-2': ( value ) => padded( value, 2 ),
	'ms-3': ( value ) => padded( value, 3 ),
	'a-upper': ( value ) => value.split( /\s/ )[ 1 ].toUpperCase(),
	'a-lower': ( value ) => value.split( /\s/ )[ 1 ].toLowerCase(),
};

export function createFormatters( localesArg = 'default', timezoneArg ) {
	const timezome = timezoneArg != null ? { timeZone: timezoneArg } : {};

	const DEFAULT_FORMATTERS = {
		'Y-4': new Intl.DateTimeFormat( localesArg, {
			year: 'numeric',
			...timezome,
		} ),
		'Y-2': new Intl.DateTimeFormat( localesArg, {
			year: 'numeric',
			...timezome,
		} ),
		'M-long': new Intl.DateTimeFormat( localesArg, {
			month: 'long',
			...timezome,
		} ),
		'M-short': new Intl.DateTimeFormat( localesArg, {
			month: 'short',
			...timezome,
		} ),
		'M-2': new Intl.DateTimeFormat( localesArg, {
			month: '2-digit',
			...timezome,
		} ),
		M: new Intl.DateTimeFormat( localesArg, {
			month: 'numeric',
			...timezome,
		} ),
		'D-long': new Intl.DateTimeFormat( localesArg, {
			weekday: 'long',
			...timezome,
		} ),
		'D-short': new Intl.DateTimeFormat( localesArg, {
			weekday: 'short',
			...timezome,
		} ),
		'D-2': new Intl.DateTimeFormat( localesArg, {
			day: '2-digit',
			...timezome,
		} ),
		'D-1': new Intl.DateTimeFormat( localesArg, {
			day: 'numeric',
			...timezome,
		} ),
		'h-2': new Intl.DateTimeFormat( localesArg, {
			hour: '2-digit',
			hour12: false,
			...timezome,
		} ),
		'h-1': new Intl.DateTimeFormat( localesArg, {
			hour: 'numeric',
			...timezome,
		} ),
		'm-2': new Intl.DateTimeFormat( localesArg, {
			minute: '2-digit',
			...timezome,
		} ),
		'm-1': new Intl.DateTimeFormat( localesArg, {
			minute: 'numeric',
			...timezome,
		} ),
		's-2': new Intl.DateTimeFormat( localesArg, {
			second: '2-digit',
			...timezome,
		} ),
		's-1': new Intl.DateTimeFormat( localesArg, {
			second: 'numeric',
			...timezome,
		} ),
		'ms-3': new Intl.DateTimeFormat( localesArg, {
			fractionalSecondDigits: 3,
			hour12: false,
			...timezome,
		} ),
		'ms-1': new Intl.DateTimeFormat( localesArg, {
			fractionalSecondDigits: 3,
			hour12: false,
			...timezome,
		} ),
		tz: new Intl.DateTimeFormat( localesArg, {
			timeZoneName: 'short',
			...timezome,
		} ),
		'a-upper': new Intl.DateTimeFormat( localesArg, {
			hour: '2-digit',
			hour12: true,
		} ),
		'a-lower': new Intl.DateTimeFormat( localesArg, {
			hour: '2-digit',
			hour12: true,
		} ),
	};

	return {
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'Y-4'( date ) {
			return DEFAULT_FORMATTERS[ 'Y-4' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'Y-2'( date ) {
			return ADDITIONAL_FORMATTERS[ 'Y-2' ](
				DEFAULT_FORMATTERS[ 'Y-2' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'M-long'( date ) {
			return DEFAULT_FORMATTERS[ 'M-long' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'M-short'( date ) {
			return DEFAULT_FORMATTERS[ 'M-short' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'M-2'( date ) {
			return DEFAULT_FORMATTERS[ 'M-2' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		M( date ) {
			return DEFAULT_FORMATTERS[ 'M' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'D-long'( date ) {
			return DEFAULT_FORMATTERS[ 'D-long' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'D-short'( date ) {
			return DEFAULT_FORMATTERS[ 'D-short' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'D-index'( date ) {
			const map = {
				Sunday: 0,
				Monday: 1,
				Tuesday: 2,
				Wednesday: 3,
				Thursday: 4,
				Friday: 5,
				Saturday: 6,
			};

			/**
			 * we use this mapping approach because Intl.DateTimeFormat has a limited return
			 * for weekdays:
			 * * "long" (e.g., Thursday)
			 * * "short" (e.g., Thu)
			 * * "narrow" (e.g., T)
			 * Thus, there's no way to get number equivalent to a weekday.
			 */
			return map[ DEFAULT_FORMATTERS[ 'D-long' ].format( date ) ];
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'D-2'( date ) {
			return DEFAULT_FORMATTERS[ 'D-2' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'D-1'( date ) {
			return DEFAULT_FORMATTERS[ 'D-1' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'h-2'( date ) {
			return DEFAULT_FORMATTERS[ 'h-2' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'h-1'( date ) {
			return DEFAULT_FORMATTERS[ 'h-1' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'm-2'( date ) {
			return ADDITIONAL_FORMATTERS[ 'm-2' ](
				DEFAULT_FORMATTERS[ 'm-2' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'm-1'( date ) {
			return DEFAULT_FORMATTERS[ 'm-1' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		's-2'( date ) {
			return ADDITIONAL_FORMATTERS[ 's-2' ](
				DEFAULT_FORMATTERS[ 's-2' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		's-1'( date ) {
			return DEFAULT_FORMATTERS[ 's-1' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'ms-3'( date ) {
			return ADDITIONAL_FORMATTERS[ 'ms-3' ](
				DEFAULT_FORMATTERS[ 'ms-3' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'ms-2'( date ) {
			return ADDITIONAL_FORMATTERS[ 'ms-2' ](
				DEFAULT_FORMATTERS[ 'ms-2' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		tz( date ) {
			return DEFAULT_FORMATTERS[ tz ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'a-upper'( date ) {
			return ADDITIONAL_FORMATTERS[ 'a-upper' ](
				DEFAULT_FORMATTERS[ 'a-upper' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'a-lower'( date ) {
			return ADDITIONAL_FORMATTERS[ 'a-lower' ](
				DEFAULT_FORMATTERS[ 'a-lower' ].format( date )
			);
		},
	};
}
