/**
 * Check if `value` is 'empty'.
 * This is a very limited version of Lodash's `isEmpty` function.
 * @param {unknown} value
 * @returns {boolean} Returns `true` if `value` is a function, `false` otherwise.
 */
export default function isEmpty( value ) {
	const type = typeof value;

	if ( value == null ) {
		return true;
	}

	if ( type === 'string' || Array.isArray( value ) ) {
		return value.length === 0;
	}

	return false;
}
