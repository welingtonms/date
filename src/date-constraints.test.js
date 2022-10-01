import XBDateFactory from './date-factory';
import {
	toConstraintRange,
	InvalidDateConstraintError,
} from './date-constraints';
import { MAX_SUPPORTED_DATE, MIN_SUPPORTED_DATE } from './constants';

describe( 'Date constraints', () => {
	it( 'converts single number `value` (timestamp) to array [`value`, `value`]', () => {
		expect( toConstraintRange( 567432000000 ) ).toEqual( [
			567432000000, 567432000000,
		] );
	} );

	it( 'converts single string `value` (ISO date) to array [`value`, `value`]', () => {
		expect( toConstraintRange( '1987-12-25T12:00:00.000Z' ) ).toEqual( [
			567432000000, 567432000000,
		] );
	} );

	it( 'converts single `Date` to array [`value`, `value`]', () => {
		expect(
			toConstraintRange( new Date( '1987-12-25T12:00:00.000Z' ) )
		).toEqual( [ 567432000000, 567432000000 ] );
	} );

	it( 'converts a pair [`start`, null] to array [`start`, `MAX_SUPPORTED_DATE`]', () => {
		expect( toConstraintRange( [ 567432000000, null ] ) ).toEqual( [
			567432000000,
			MAX_SUPPORTED_DATE,
		] );

		expect(
			toConstraintRange( [ '1987-12-25T12:00:00.000Z', null ] )
		).toEqual( [ 567432000000, MAX_SUPPORTED_DATE ] );

		expect(
			toConstraintRange( [
				new Date( '1987-12-25T12:00:00.000Z' ),
				null,
			] )
		).toEqual( [ 567432000000, MAX_SUPPORTED_DATE ] );
	} );

	it( 'converts a pair [null, `end`] to array [MIN_SUPPORTED_DATE, `end`]', () => {
		expect( toConstraintRange( [ null, 567432000000 ] ) ).toEqual( [
			MIN_SUPPORTED_DATE,
			567432000000,
		] );

		expect(
			toConstraintRange( [ null, '1987-12-25T12:00:00.000Z' ] )
		).toEqual( [ MIN_SUPPORTED_DATE, 567432000000 ] );

		expect(
			toConstraintRange( [
				null,
				new Date( '1987-12-25T12:00:00.000Z' ),
			] )
		).toEqual( [ MIN_SUPPORTED_DATE, 567432000000 ] );
	} );

	it( 'returns the range [`start`, `end`] itself', () => {
		expect( toConstraintRange( [ 567432000000, 1641038400000 ] ) ).toEqual(
			[ 567432000000, 1641038400000 ]
		);

		expect(
			toConstraintRange( [
				'1987-12-25T12:00:00.000Z',
				'2022-01-01T12:00:00.000Z',
			] )
		).toEqual( [ 567432000000, 1641038400000 ] );

		expect(
			toConstraintRange( [
				new Date( '1987-12-25T12:00:00.000Z' ),
				new Date( '2022-01-01T12:00:00.000Z' ),
			] )
		).toEqual( [ 567432000000, 1641038400000 ] );
	} );

	it( 'throws an exception when range start is after range end', () => {
		expect( () =>
			toConstraintRange( [ 1641038400000, 567432000000 ] )
		).toThrowError(
			new InvalidDateConstraintError( [ 1641038400000, 567432000000 ] )
		);

		expect( () =>
			toConstraintRange( [
				'2022-01-01T12:00:00.000Z',
				'1987-12-25T12:00:00.000Z',
			] )
		).toThrowError(
			new InvalidDateConstraintError( [ 1641038400000, 567432000000 ] )
		);
	} );

	describe( 'Constraint matching', () => {
		const date1 = new Date( '1987-12-25T12:00:00.000Z' );
		const date2 = new Date( '1988-12-25T12:00:00.000Z' );
		const date3 = new Date( '1989-12-25T12:00:00.000Z' );

		it( 'returns false for when no constraints is provided', () => {
			expect( XBDateFactory( date1 ).matches() ).toBe( false );
		} );

		it( 'checks for date equals to', () => {
			expect( XBDateFactory( date1 ).matches( date1.getTime() ) ).toBe(
				true
			);

			expect(
				XBDateFactory( date1.toISOString() ).matches( date1.getTime() )
			).toBe( true );

			expect(
				XBDateFactory( date1.getTime() ).matches( date1.getTime() )
			).toBe( true );

			expect(
				XBDateFactory( date1.getTime() ).matches( function isFriday(
					date
				) {
					return date.getWeekday() == 5;
				} )
			).toBe( true );

			expect( XBDateFactory( date1 ).matches( date2.getTime() ) ).toBe(
				false
			);

			expect( XBDateFactory( date1 ).matches( date3.getTime() ) ).toBe(
				false
			);

			expect(
				XBDateFactory( date1 ).matches( function isWeekend( date ) {
					return [ 0, 6 ].includes( date.getWeekday() );
				} )
			).toBe( false );

			expect( XBDateFactory( date2 ).matches( date2.getTime() ) ).toBe(
				true
			);

			expect(
				XBDateFactory( date2.toISOString() ).matches( date2.getTime() )
			).toBe( true );

			expect(
				XBDateFactory( date2.getTime() ).matches( date2.getTime() )
			).toBe( true );

			expect( XBDateFactory( date2 ).matches( date1.getTime() ) ).toBe(
				false
			);

			expect( XBDateFactory( date2 ).matches( date3.getTime() ) ).toBe(
				false
			);

			expect( XBDateFactory( date3 ).matches( date3.getTime() ) ).toBe(
				true
			);

			expect(
				XBDateFactory( date3.toISOString() ).matches( date3.getTime() )
			).toBe( true );

			expect(
				XBDateFactory( date3.getTime() ).matches( date3.getTime() )
			).toBe( true );

			expect( XBDateFactory( date3 ).matches( date1.getTime() ) ).toBe(
				false
			);

			expect( XBDateFactory( date3 ).matches( date2.getTime() ) ).toBe(
				false
			);
		} );

		it( 'throws an exception when an invalid interval constraint is provided', () => {
			expect( () =>
				XBDateFactory( date1 ).matches( [ date2, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date2.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				XBDateFactory( date1 ).matches( [ date3, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				XBDateFactory( date1 ).matches( [ date3, date2 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date2.getTime(),
				] )
			);
			expect( () =>
				XBDateFactory( date2 ).matches( [ date2, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date2.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				XBDateFactory( date2 ).matches( [ date3, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				XBDateFactory( date2 ).matches( [ date3, date2 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date2.getTime(),
				] )
			);
			expect( () =>
				XBDateFactory( date3 ).matches( [ date2, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date2.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				XBDateFactory( date3 ).matches( [ date3, date1 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date1.getTime(),
				] )
			);
			expect( () =>
				XBDateFactory( date3 ).matches( [ date3, date2 ] )
			).toThrowError(
				new InvalidDateConstraintError( [
					date3.getTime(),
					date2.getTime(),
				] )
			);
		} );

		it( 'checks for date within a single [start, end] interval constraint', () => {
			expect( XBDateFactory( date1 ).matches( [ date1, date1 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date1 ).matches( [ date1, date2 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date1 ).matches( [ date1, date3 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date1 ).matches( [ date2, date2 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date1 ).matches( [ date2, date3 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date1 ).matches( [ date3, date3 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date2 ).matches( [ date1, date1 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date2 ).matches( [ date1, date2 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date2 ).matches( [ date1, date3 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date2 ).matches( [ date2, date2 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date2 ).matches( [ date2, date3 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date2 ).matches( [ date3, date3 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date3 ).matches( [ date1, date1 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date3 ).matches( [ date1, date2 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date3 ).matches( [ date1, date3 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date3 ).matches( [ date2, date2 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date3 ).matches( [ date2, date3 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date3 ).matches( [ date3, date3 ] ) ).toBe(
				true
			);
		} );

		it( 'checks for date within a single [start, ∞] interval constraint', () => {
			expect( XBDateFactory( date1 ).matches( [ date1, null ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date1 ).matches( [ date2, null ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date1 ).matches( [ date3, null ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date2 ).matches( [ date1, null ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date2 ).matches( [ date2, null ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date2 ).matches( [ date3, null ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date3 ).matches( [ date1, null ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date3 ).matches( [ date2, null ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date3 ).matches( [ date3, null ] ) ).toBe(
				true
			);
		} );

		it( 'checks for date within a single [∞, end] interval constraint', () => {
			expect( XBDateFactory( date1 ).matches( [ null, date1 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date1 ).matches( [ null, date2 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date1 ).matches( [ null, date3 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date2 ).matches( [ null, date1 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date2 ).matches( [ null, date2 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date2 ).matches( [ null, date3 ] ) ).toBe(
				true
			);
			expect( XBDateFactory( date3 ).matches( [ null, date1 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date3 ).matches( [ null, date2 ] ) ).toBe(
				false
			);
			expect( XBDateFactory( date3 ).matches( [ null, date3 ] ) ).toBe(
				true
			);
		} );

		it( 'checks for date within multiple interval constraints', () => {
			expect(
				XBDateFactory( date1 ).matches(
					[ date1, date2 ],
					[ date2, date3 ]
				)
			).toBe( true );
			expect(
				XBDateFactory( date1 ).matches(
					[ date1, date3 ],
					[ date2, date3 ]
				)
			).toBe( true );
			expect(
				XBDateFactory( date1 ).matches(
					[ date2, date2 ],
					[ date2, date3 ]
				)
			).toBe( false );
		} );
	} );
} );
