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
