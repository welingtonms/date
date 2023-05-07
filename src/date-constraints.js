import { getRangeEvaluator } from './date-utils';
import isFunction from './is-function';

/**
 *
 * @param  { ...CalendarConstraint} constraints
 * @returns {XBDateConstraints}
 */
function XBDateConstraintFactory( ...constraints ) {
	const constraintMatchEvaluators = constraints.map( ( constraint ) => {
		if ( isFunction( constraint ) ) {
			return constraint;
		}

		return getRangeEvaluator( constraint );
	} );

	return Object.freeze( {
		/**
		 * Check if the given date matches **at least one** of the provided constraints.
		 * Returns `false` if no constraint is provided.
		 * @param {*} date
		 * @returns
		 */
		matches( date ) {
			if ( isEmpty( constraintMatchEvaluators ) ) {
				return false;
			}

			return constraintMatchEvaluators.some(
				( constraintMatchEvaluator ) => constraintMatchEvaluator( date )
			);
		},
	} );
}

export default XBDateConstraintFactory;

/**
 * @typedef {import('./types').XBDateCreateOptions} XBDateCreateOptions
 * @typedef {import('./types').DateUnit} DateUnit
 * @typedef {import('./types').InputDate} InputDate
 * @typedef {import('./types').SingleDateConstraint} SingleDateConstraint
 * @typedef {import('./types').DateRangeConstraint} DateRangeConstraint
 * @typedef {import('./types').FunctionDateConstraint} FunctionDateConstraint
 * @typedef {import('./types').DateConstraint} DateConstraint
 * @typedef {import('./types').DateOperationInput} DateOperationInput
 * @typedef {import('./types').XBDate} XBDate
 */

/**
 * @typedef {Object} XBDateConstraints
 * @property {(date: XBDate) => boolean} matches - Check if the given date matches **at least one** of the provided constraints. Returns `false` if no constraints is provided.
 */
