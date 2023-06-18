/**
 * Pad start the given value with `0` untils it reaches the provided `length`.
 * @param {number | string} value
 * @param {number} [length]
 * @returns {string}
 */
export function padded( value, length = 2 ) {
	return String( value ).padStart( length, '0' );
}
