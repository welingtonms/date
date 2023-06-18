import { getRangeEvaluator } from './date-utils';
import isEmpty from './is-empty';
import isFunction from './is-function';

/**
 *
 * @param  { ...DateConstraintEvaluator} constraints
 * @returns {XBDateConstraints}
 */
export function createConstraints( ...constraints ) {
	return Object.freeze( {
		/**
		 * @param {XBDate} date
		 * @param {DateUnit} [precision]
		 * @returns {boolean}
		 */
		match( date, precision = 'milliseconds' ) {
			if ( isEmpty( constraints ) ) {
				return false;
			}

			const constraintMatchEvaluators = constraints.map(
				( constraint ) => {
					if ( isFunction( constraint ) ) {
						return ( date ) => constraint( date, precision );
					}

					return getRangeEvaluator( constraint, precision );
				}
			);

			return constraintMatchEvaluators.some(
				( constraintMatchEvaluator ) => constraintMatchEvaluator( date )
			);
		},
	} );
}

/**
 * @typedef {import('./types').DateConstraintEvaluator} DateConstraintEvaluator
 * @typedef {import('./types').XBDateConstraints} XBDateConstraints
 */
