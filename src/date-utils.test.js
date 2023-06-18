import { toRange } from './date-utils';
import { MAX_SUPPORTED_DATE, MIN_SUPPORTED_DATE } from './constants';

describe( 'date-utils', () => {
	it( 'converts single number `value` (timestamp) to array [`value`, `value`]', () => {
		expect( toRange( 567432000000 ) ).toEqual( [
			567432000000, 567432000000,
		] );
	} );

	it( 'converts single string `value` (ISO date) to array [`value`, `value`]', () => {
		expect( toRange( '1987-12-25T12:00:00.000Z' ) ).toEqual( [
			567432000000, 567432000000,
		] );
	} );

	it( 'converts single `Date` to array [`value`, `value`]', () => {
		expect( toRange( new Date( '1987-12-25T12:00:00.000Z' ) ) ).toEqual( [
			567432000000, 567432000000,
		] );
	} );

	it( 'converts a pair [`start`, null] to array [`start`, `MAX_SUPPORTED_DATE` | null]', () => {
		expect( toRange( [ 567432000000, null ] ) ).toEqual( [
			567432000000,
			null,
		] );
		expect( toRange( [ 567432000000, null ], 'comparison' ) ).toEqual( [
			567432000000,
			MAX_SUPPORTED_DATE,
		] );

		expect( toRange( [ '1987-12-25T12:00:00.000Z', null ] ) ).toEqual( [
			567432000000,
			null,
		] );
		expect(
			toRange( [ '1987-12-25T12:00:00.000Z', null ], 'comparison' )
		).toEqual( [ 567432000000, MAX_SUPPORTED_DATE ] );

		expect(
			toRange( [ new Date( '1987-12-25T12:00:00.000Z' ), null ] )
		).toEqual( [ 567432000000, null ] );
		expect(
			toRange(
				[ new Date( '1987-12-25T12:00:00.000Z' ), null ],
				'comparison'
			)
		).toEqual( [ 567432000000, MAX_SUPPORTED_DATE ] );
	} );

	it( 'converts a pair [null, `end`] to array [MIN_SUPPORTED_DATE, `end`]', () => {
		expect( toRange( [ null, 567432000000 ] ) ).toEqual( [
			null,
			567432000000,
		] );
		expect( toRange( [ null, 567432000000 ], 'comparison' ) ).toEqual( [
			MIN_SUPPORTED_DATE,
			567432000000,
		] );

		expect( toRange( [ null, '1987-12-25T12:00:00.000Z' ] ) ).toEqual( [
			null,
			567432000000,
		] );
		expect(
			toRange( [ null, '1987-12-25T12:00:00.000Z' ], 'comparison' )
		).toEqual( [ MIN_SUPPORTED_DATE, 567432000000 ] );

		expect(
			toRange( [ null, new Date( '1987-12-25T12:00:00.000Z' ) ] )
		).toEqual( [ null, 567432000000 ] );
		expect(
			toRange(
				[ null, new Date( '1987-12-25T12:00:00.000Z' ) ],
				'comparison'
			)
		).toEqual( [ MIN_SUPPORTED_DATE, 567432000000 ] );
	} );

	it( 'returns the range [`start`, `end`] itself', () => {
		expect( toRange( [ 567432000000, 1641038400000 ] ) ).toEqual( [
			567432000000, 1641038400000,
		] );

		expect(
			toRange( [
				'1987-12-25T12:00:00.000Z',
				'2022-01-01T12:00:00.000Z',
			] )
		).toEqual( [ 567432000000, 1641038400000 ] );

		expect(
			toRange( [
				new Date( '1987-12-25T12:00:00.000Z' ),
				new Date( '2022-01-01T12:00:00.000Z' ),
			] )
		).toEqual( [ 567432000000, 1641038400000 ] );
	} );

	it( 'reverses the range when range start is after range end', () => {
		expect( toRange( [ 1641038400000, 567432000000 ] ) ).toEqual( [
			567432000000, 1641038400000,
		] );

		expect(
			toRange( [
				'2022-01-01T12:00:00.000Z',
				'1987-12-25T12:00:00.000Z',
			] )
		).toEqual( [ 567432000000, 1641038400000 ] );

		expect(
			toRange( [
				new Date( '2022-01-01T12:00:00.000Z' ),
				new Date( '1987-12-25T12:00:00.000Z' ),
			] )
		).toEqual( [ 567432000000, 1641038400000 ] );
	} );
} );
