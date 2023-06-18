import * as XBDateFactory from './date-factory';
import { createConstraints } from './constraints-factory';

describe( 'Date constraints', () => {
	describe( 'Constraint matching', () => {
		const date1 = new Date( '1987-12-25T12:00:00.000Z' );
		const date2 = new Date( '1988-12-25T12:00:00.000Z' );
		const date3 = new Date( '1989-12-25T12:00:00.000Z' );

		it( 'returns false for when no constraints is provided', () => {
			const constraints = createConstraints();
			expect( constraints.match( date1 ) ).toBe( false );
		} );

		it( 'checks for date equals to', () => {
			expect( createConstraints( date1 ).match( date1 ) ).toBe( true );

			expect(
				createConstraints( date1.toISOString() ).match(
					date1.getTime()
				)
			).toBe( true );

			expect(
				createConstraints( date1.getTime() ).match( date1.getTime() )
			).toBe( true );

			expect(
				createConstraints( function isFriday( date ) {
					return XBDateFactory.createDate( date ).weekday() == 5;
				} ).match( date1.getTime() )
			).toBe( true );

			expect( createConstraints( date2.getTime() ).match( date1 ) ).toBe(
				false
			);

			expect( createConstraints( date3.getTime() ).match( date1 ) ).toBe(
				false
			);

			expect(
				createConstraints( function isWeekend( date ) {
					return [ 0, 6 ].includes(
						XBDateFactory.createDate( date ).weekday()
					);
				} ).match( date1 )
			).toBe( false );

			expect( createConstraints( date2.getTime() ).match( date2 ) ).toBe(
				true
			);

			expect(
				createConstraints( date2.getTime() ).match(
					date2.toISOString()
				)
			).toBe( true );

			expect(
				createConstraints( date2.getTime() ).match( date2.getTime() )
			).toBe( true );

			expect( createConstraints( date1.getTime() ).match( date2 ) ).toBe(
				false
			);

			expect( createConstraints( date3.getTime() ).match( date2 ) ).toBe(
				false
			);

			expect( createConstraints( date3.getTime() ).match( date3 ) ).toBe(
				true
			);

			expect(
				createConstraints( date3.getTime() ).match(
					date3.toISOString()
				)
			).toBe( true );

			expect(
				createConstraints( date3.getTime() ).match( date3.getTime() )
			).toBe( true );

			expect( createConstraints( date1.getTime() ).match( date3 ) ).toBe(
				false
			);

			expect( createConstraints( date2.getTime() ).match( date3 ) ).toBe(
				false
			);
		} );

		it.skip( 'throws an exception when an invalid interval constraint is provided', () => {
			expect( () =>
				createConstraints( date1 ).match( [ date2, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date2.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				createConstraints( date1 ).match( [ date3, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				createConstraints( date1 ).match( [ date3, date2 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date2.getTime(),
				] )
			);
			expect( () =>
				createConstraints( date2 ).match( [ date2, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date2.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				createConstraints( date2 ).match( [ date3, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				createConstraints( date2 ).match( [ date3, date2 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date2.getTime(),
				] )
			);
			expect( () =>
				createConstraints( date3 ).match( [ date2, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date2.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				createConstraints( date3 ).match( [ date3, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				createConstraints( date3 ).match( [ date3, date2 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date2.getTime(),
				] )
			);
		} );

		it( 'checks for date within a single [start, end] interval constraint', () => {
			expect( createConstraints( [ date1, date1 ] ).match( date1 ) ).toBe(
				true
			);
			expect( createConstraints( [ date1, date2 ] ).match( date1 ) ).toBe(
				true
			);
			expect( createConstraints( [ date1, date3 ] ).match( date1 ) ).toBe(
				true
			);
			expect( createConstraints( [ date2, date2 ] ).match( date1 ) ).toBe(
				false
			);
			expect( createConstraints( [ date2, date3 ] ).match( date1 ) ).toBe(
				false
			);
			expect( createConstraints( [ date3, date3 ] ).match( date1 ) ).toBe(
				false
			);
			expect( createConstraints( [ date1, date1 ] ).match( date2 ) ).toBe(
				false
			);
			expect( createConstraints( [ date1, date2 ] ).match( date2 ) ).toBe(
				true
			);
			expect( createConstraints( [ date1, date3 ] ).match( date2 ) ).toBe(
				true
			);
			expect( createConstraints( [ date2, date2 ] ).match( date2 ) ).toBe(
				true
			);
			expect( createConstraints( [ date2, date3 ] ).match( date2 ) ).toBe(
				true
			);
			expect( createConstraints( [ date3, date3 ] ).match( date2 ) ).toBe(
				false
			);
			expect( createConstraints( [ date1, date1 ] ).match( date3 ) ).toBe(
				false
			);
			expect( createConstraints( [ date1, date2 ] ).match( date3 ) ).toBe(
				false
			);
			expect( createConstraints( [ date1, date3 ] ).match( date3 ) ).toBe(
				true
			);
			expect( createConstraints( [ date2, date2 ] ).match( date3 ) ).toBe(
				false
			);
			expect( createConstraints( [ date2, date3 ] ).match( date3 ) ).toBe(
				true
			);
			expect( createConstraints( [ date3, date3 ] ).match( date3 ) ).toBe(
				true
			);
		} );

		it( 'checks for date within a single [start, ∞] interval constraint', () => {
			expect( createConstraints( [ date1, null ] ).match( date1 ) ).toBe(
				true
			);
			expect( createConstraints( [ date2, null ] ).match( date1 ) ).toBe(
				false
			);
			expect( createConstraints( [ date3, null ] ).match( date1 ) ).toBe(
				false
			);
			expect( createConstraints( [ date1, null ] ).match( date2 ) ).toBe(
				true
			);
			expect( createConstraints( [ date2, null ] ).match( date2 ) ).toBe(
				true
			);
			expect( createConstraints( [ date3, null ] ).match( date2 ) ).toBe(
				false
			);
			expect( createConstraints( [ date1, null ] ).match( date3 ) ).toBe(
				true
			);
			expect( createConstraints( [ date2, null ] ).match( date3 ) ).toBe(
				true
			);
			expect( createConstraints( [ date3, null ] ).match( date3 ) ).toBe(
				true
			);
		} );

		it( 'checks for date within a single [∞, end] interval constraint', () => {
			expect( createConstraints( [ null, date1 ] ).match( date1 ) ).toBe(
				true
			);
			expect( createConstraints( [ null, date2 ] ).match( date1 ) ).toBe(
				true
			);
			expect( createConstraints( [ null, date3 ] ).match( date1 ) ).toBe(
				true
			);
			expect( createConstraints( [ null, date1 ] ).match( date2 ) ).toBe(
				false
			);
			expect( createConstraints( [ null, date2 ] ).match( date2 ) ).toBe(
				true
			);
			expect( createConstraints( [ null, date3 ] ).match( date2 ) ).toBe(
				true
			);
			expect( createConstraints( [ null, date1 ] ).match( date3 ) ).toBe(
				false
			);
			expect( createConstraints( [ null, date2 ] ).match( date3 ) ).toBe(
				false
			);
			expect( createConstraints( [ null, date3 ] ).match( date3 ) ).toBe(
				true
			);
		} );

		it( 'checks for date within multiple interval constraints', () => {
			expect(
				createConstraints( [ date1, date2 ], [ date2, date3 ] ).match(
					date1
				)
			).toBe( true );
			expect(
				createConstraints( [ date1, date3 ], [ date2, date3 ] ).match(
					date1
				)
			).toBe( true );
			expect(
				createConstraints( [ date2, date2 ], [ date2, date3 ] ).match(
					date1
				)
			).toBe( false );
		} );
	} );
} );
