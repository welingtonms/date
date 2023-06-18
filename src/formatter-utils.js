import { padded } from './utils';

const ADDITIONAL_FORMATTERS = {
	'%2Y': ( value ) => value.slice( -2 ),
	'%iD': ( date ) => date.getDay(),
	'%02m': ( value ) => padded( value, 2 ),
	'%02s': ( value ) => padded( value, 2 ),
	'%03ms': ( value ) => padded( value, 3 ),
	'%uA': ( value ) => value.split( /\s/ )[ 1 ].toUpperCase(),
	'%lA': ( value ) => value.split( /\s/ )[ 1 ].toLowerCase(),
};

export function createFormatters( localesArg = 'default', timezoneArg ) {
	const timezome = timezoneArg != null ? { timeZone: timezoneArg } : {};

	//%[flags][width][.precision][length]specifier
	const DEFAULT_FORMATTERS = {
		'%4Y': new Intl.DateTimeFormat( localesArg, {
			year: 'numeric',
			...timezome,
		} ),
		'%2Y': new Intl.DateTimeFormat( localesArg, {
			year: 'numeric',
			...timezome,
		} ),
		'%lM': new Intl.DateTimeFormat( localesArg, {
			month: 'long',
			...timezome,
		} ),
		'%sM': new Intl.DateTimeFormat( localesArg, {
			month: 'short',
			...timezome,
		} ),
		'%2M': new Intl.DateTimeFormat( localesArg, {
			month: '2-digit',
			...timezome,
		} ),
		'%M': new Intl.DateTimeFormat( localesArg, {
			month: 'numeric',
			...timezome,
		} ),
		'%lD': new Intl.DateTimeFormat( localesArg, {
			weekday: 'long',
			...timezome,
		} ),
		'%sD': new Intl.DateTimeFormat( localesArg, {
			weekday: 'short',
			...timezome,
		} ),
		'%02D': new Intl.DateTimeFormat( localesArg, {
			day: '2-digit',
			...timezome,
		} ),
		'%D': new Intl.DateTimeFormat( localesArg, {
			day: 'numeric',
			...timezome,
		} ),
		'%02h': new Intl.DateTimeFormat( localesArg, {
			hour: '2-digit',
			hour12: false,
			...timezome,
		} ),
		'%h': new Intl.DateTimeFormat( localesArg, {
			hour: 'numeric',
			...timezome,
		} ),
		'%02m': new Intl.DateTimeFormat( localesArg, {
			minute: '2-digit',
			...timezome,
		} ),
		'%m': new Intl.DateTimeFormat( localesArg, {
			minute: 'numeric',
			...timezome,
		} ),
		'%02s': new Intl.DateTimeFormat( localesArg, {
			second: '2-digit',
			...timezome,
		} ),
		'%s': new Intl.DateTimeFormat( localesArg, {
			second: 'numeric',
			...timezome,
		} ),
		'%03ms': new Intl.DateTimeFormat( localesArg, {
			fractionalSecondDigits: 3,
			hour12: false,
			...timezome,
		} ),
		'%ms': new Intl.DateTimeFormat( localesArg, {
			fractionalSecondDigits: 3,
			hour12: false,
			...timezome,
		} ),
		tz: new Intl.DateTimeFormat( localesArg, {
			timeZoneName: 'short',
			...timezome,
		} ),
		'%uA': new Intl.DateTimeFormat( localesArg, {
			hour: '2-digit',
			hour12: true,
		} ),
		'%lA': new Intl.DateTimeFormat( localesArg, {
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
		'%4Y'( date ) {
			return DEFAULT_FORMATTERS[ '%4Y' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%2Y'( date ) {
			return ADDITIONAL_FORMATTERS[ '%2Y' ](
				DEFAULT_FORMATTERS[ '%2Y' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%lM'( date ) {
			return DEFAULT_FORMATTERS[ '%lM' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%sM'( date ) {
			return DEFAULT_FORMATTERS[ '%sM' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%2M'( date ) {
			return DEFAULT_FORMATTERS[ '%2M' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%M'( date ) {
			return DEFAULT_FORMATTERS[ 'M' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%lD'( date ) {
			return DEFAULT_FORMATTERS[ '%lD' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%sD'( date ) {
			return DEFAULT_FORMATTERS[ '%sD' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%iD'( date ) {
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
			return map[ DEFAULT_FORMATTERS[ '%lD' ].format( date ) ];
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%02D'( date ) {
			return DEFAULT_FORMATTERS[ '%02D' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%D'( date ) {
			return DEFAULT_FORMATTERS[ '%D' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%02h'( date ) {
			return DEFAULT_FORMATTERS[ '%02h' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%h'( date ) {
			return DEFAULT_FORMATTERS[ '%h' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%02m'( date ) {
			return ADDITIONAL_FORMATTERS[ '%02m' ](
				DEFAULT_FORMATTERS[ '%02m' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%m'( date ) {
			return DEFAULT_FORMATTERS[ '%m' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%02s'( date ) {
			return ADDITIONAL_FORMATTERS[ '%02s' ](
				DEFAULT_FORMATTERS[ '%02s' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%s'( date ) {
			return DEFAULT_FORMATTERS[ '%s' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%03ms'( date ) {
			return ADDITIONAL_FORMATTERS[ '%03ms' ](
				DEFAULT_FORMATTERS[ '%03ms' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%tz'( date ) {
			return DEFAULT_FORMATTERS[ '%tz' ].format( date );
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%uA'( date ) {
			return ADDITIONAL_FORMATTERS[ '%uA' ](
				DEFAULT_FORMATTERS[ '%uA' ].format( date )
			);
		},
		/**
		 *
		 * @param {Date} date
		 * @returns
		 */
		'%lA'( date ) {
			return ADDITIONAL_FORMATTERS[ '%lA' ](
				DEFAULT_FORMATTERS[ '%lA' ].format( date )
			);
		},
	};
}
