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

export class InvalidDateRangeError extends Error {
	/**
	 * @constructor
	 * @param {[ number, number ]} range
	 */
	constructor( range ) {
		const [ start, end ] = range;
		super( `Invalid range: [${ start }, ${ end }]` );
	}
}

export class InvalidFormatValueError extends Error {
	/**
	 * @constructor
	 * @param {unknown} value
	 * @param {string} token
	 */
	constructor( value, token ) {
		super( `Invalid value ${ value } provided to format token ${ token }` );
	}
}
