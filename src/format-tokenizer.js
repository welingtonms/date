/**
 * Break provided format into supported tokens.
 * @param {string} format
 * @returns {string[]} Returns the provided format broken into supported tokens.
 */
function tokenizer( format ) {
	/**
	 * Return if the given `char` is either a supported `'token'` or
	 * any other `'token'`.
	 * @param {string} [char]
	 * @returns {string}
	 */
	function getType( char ) {
		if (
			char != undefined &&
			[ 'M', 'd', 'D', 'Y', 'H', 'h', 'm', 's', 'A', 'a' ].includes(
				char
			)
		) {
			return 'token';
		}

		return 'string';
	}

	/**
	 * @type {string[]}
	 */
	const tokens = [];

	let i = 0;
	let prev;
	let isEscaping = false;

	while ( i < format.length ) {
		const at = Math.max( 0, tokens.length - 1 );

		const char = format.charAt( i );
		i++;

		if ( [ '[', ']' ].includes( char ) ) {
			isEscaping = char === '[';
		} else if ( isEscaping ) {
			tokens[ at ] = `${ tokens[ at ] || '' }${ char }`;
		} else if (
			prev !== char &&
			[ getType( prev ), getType( char ) ].includes( 'token' )
		) {
			// we just need to start a new piece of string if we found a possible valid token
			tokens.push( char );
		} else {
			tokens[ at ] = `${ tokens[ at ] || '' }${ char }`;
		}

		prev = char;
	}

	return tokens;
}

export default tokenizer;
