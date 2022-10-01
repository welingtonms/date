/**
 * Check if `value` is a function.
 * @param {unknown} value
 * @returns {boolean} Returns `true` if `value` is a function, `false` otherwise.
 */
export default function isFunction( value ) {
	const type = typeof value;

	return value != null && type == 'function';
}
