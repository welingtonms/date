import XBDateFactory, { InvalidComparisonOperatorError } from './date-factory';

describe( 'XBDateFactory', () => {
	it( 'normalizes date based on the provided options', () => {
		expect( XBDateFactory( '2021-11-12T12:34:56.789Z' ).toString() ).toBe(
			new Date( '2021-11-12T12:00:00.000Z' ).toISOString()
		);

		expect(
			XBDateFactory( '2021-11-12T12:34:56.789Z', {
				normalize: false,
			} ).toString()
		).toBe( new Date( '2021-11-12T12:34:56.789Z' ).toISOString() );
	} );

	it.each( [
		[ '2021-11-12', '2021-11-12T12:00:00.000Z' ],
		[ '2021/11/12', '2021-11-12T12:00:00.000Z' ],
		[ '2021-11-12T12:00:00.000Z', '2021-11-12T12:00:00.000Z' ],
		[ 1636718400000, '2021-11-12T12:00:00.000Z' ],
	] )( 'should create date-only correctly', ( input, isoDate ) => {
		expect( XBDateFactory( input ).getTime() ).toBe(
			new Date( isoDate ).getTime()
		);
		expect( XBDateFactory( input ).toString() ).toBe( isoDate );
	} );

	it.each( [
		[ '2021-11-12T01:00:00.000Z', '2021-11-12T12:00:00.000Z' ],
		[ '2021-11-12T23:00:00.000Z', '2021-11-12T12:00:00.000Z' ],
		[ '2021-11-01T00:00:00.000Z', '2021-11-01T12:00:00.000Z' ],
	] )( 'should create UTC date correctly', ( input, isoDate ) => {
		expect( XBDateFactory( input ).getTime() ).toBe(
			new Date( isoDate ).getTime()
		);
		expect( XBDateFactory( input ).toString() ).toBe( isoDate );
	} );

	it.each( [
		[ '2021-11-30T20:00:00.000-03:00', '2021-11-30T12:00:00.000Z' ],
		[ '2021-11-30T21:00:00.000-03:00', '2021-12-01T12:00:00.000Z' ],
		[ '2021-11-30T01:00:00.000+03:00', '2021-11-29T12:00:00.000Z' ],
	] )(
		'should convert timezone date to UTC correctly',
		( input, isoDate ) => {
			expect( XBDateFactory( input ).getTime() ).toBe(
				new Date( isoDate ).getTime()
			);
			expect( XBDateFactory( input ).toString() ).toBe( isoDate );
		}
	);

	describe( 'add', () => {
		it( 'add to year successfully', () => {
			const date = XBDateFactory( '2001-12-25T12:00:00.000Z' ).add( {
				year: 1,
			} );

			expect( date.getYear() ).toBe( 2002 );
			expect( date.getMonth() ).toBe( 11 );
			expect( date.getDate() ).toBe( 25 );
		} );

		it( 'add to month successfully', () => {
			const date = XBDateFactory( '2001-12-25T12:00:00.000Z' ).add( {
				month: 1,
			} );

			expect( date.getYear() ).toBe( 2002 );
			expect( date.getMonth() ).toBe( 0 );
			expect( date.getDate() ).toBe( 25 );
		} );

		it( 'add to day successfully', () => {
			const date = XBDateFactory( '2001-12-25T12:00:00.000Z' ).add( {
				day: 1,
			} );

			expect( date.getYear() ).toBe( 2001 );
			expect( date.getMonth() ).toBe( 11 );
			expect( date.getDate() ).toBe( 26 );
		} );
	} );

	describe( 'subtract', () => {
		it( 'subtract from year successfully', () => {
			const date = XBDateFactory( '2001-12-25T12:00:00.000Z' ).subtract( {
				year: 1,
			} );

			expect( date.getYear() ).toBe( 2000 );
			expect( date.getMonth() ).toBe( 11 );
			expect( date.getDate() ).toBe( 25 );
		} );

		it( 'subtract from month successfully', () => {
			const date = XBDateFactory( '2001-12-25T12:00:00.000Z' ).subtract( {
				month: 1,
			} );

			expect( date.getYear() ).toBe( 2001 );
			expect( date.getMonth() ).toBe( 10 );
			expect( date.getDate() ).toBe( 25 );
		} );

		it( 'subtract from day successfully', () => {
			const date = XBDateFactory( '2001-12-25T12:00:00.000Z' ).subtract( {
				day: 1,
			} );

			expect( date.getYear() ).toBe( 2001 );
			expect( date.getMonth() ).toBe( 11 );
			expect( date.getDate() ).toBe( 24 );
		} );
	} );

	describe( 'set', () => {
		it( 'set year successfully', () => {
			const date = XBDateFactory( '2001-12-25T12:00:00.000Z' ).set( {
				year: 1999,
			} );

			expect( date.getYear() ).toBe( 1999 );
			expect( date.getMonth() ).toBe( 11 );
			expect( date.getDate() ).toBe( 25 );
		} );

		it( 'set month successfully', () => {
			const date = XBDateFactory( '2001-12-25T12:00:00.000Z' ).set( {
				month: 10,
			} );

			expect( date.getYear() ).toBe( 2001 );
			expect( date.getMonth() ).toBe( 10 );
			expect( date.getDate() ).toBe( 25 );
		} );

		it( 'set day successfully', () => {
			const date = XBDateFactory( '2001-12-25T12:00:00.000Z' ).set( {
				day: 5,
			} );

			expect( date.getYear() ).toBe( 2001 );
			expect( date.getMonth() ).toBe( 11 );
			expect( date.getDate() ).toBe( 5 );
		} );
	} );

	describe( 'comparison', () => {
		it.each( [
			[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', true ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', true ],
			[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', false ],

			[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', true ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', true ],
			[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', false ],

			[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', true ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', true ],
			[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', false ],
		] )(
			'compares for less than or equal',
			( a, b, precision, expected ) => {
				expect(
					XBDateFactory( a ).is( '<=', XBDateFactory( b ), precision )
				).toBe( expected );
			}
		);

		it.each( [
			[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', true ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', false ],
			[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', false ],

			[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', true ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', false ],
			[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', false ],

			[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', true ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', false ],
			[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', false ],
		] )( 'compares for less than', ( a, b, precision, expected ) => {
			expect(
				XBDateFactory( new Date( a ) ).is(
					'<',
					XBDateFactory( b ),
					precision
				)
			).toBe( expected );
		} );

		it.each( [
			[
				'2000-12-25T22:17:12.000Z',
				'2000-12-25T15:16:00.000Z',
				'day',
				true,
			],
			[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', false ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', true ],
			[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', false ],

			[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', false ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', true ],
			[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', false ],

			[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', false ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', true ],
			[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', false ],
		] )(
			'compares for less than or equal',
			( a, b, precision, expected ) => {
				expect(
					XBDateFactory( new Date( a ) ).is(
						'=',
						XBDateFactory( b ),
						precision
					)
				).toBe( expected );
			}
		);

		it.each( [
			[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', false ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', false ],
			[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', true ],

			[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', false ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', false ],
			[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', true ],

			[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', false ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', false ],
			[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', true ],
		] )(
			'compares for less than or equal',
			( a, b, precision, expected ) => {
				expect(
					XBDateFactory( new Date( a ) ).is(
						'>',
						XBDateFactory( b ),
						precision
					)
				).toBe( expected );
			}
		);

		it.each( [
			[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', false ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', true ],
			[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', true ],

			[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', false ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', true ],
			[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', true ],

			[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', false ],
			[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', true ],
			[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', true ],
		] )(
			'compares for less than or equal',
			( a, b, precision, expected ) => {
				expect(
					XBDateFactory( new Date( a ) ).is(
						'>=',
						XBDateFactory( b ),
						precision
					)
				).toBe( expected );
			}
		);

		it( 'throws an exception when an invalid operator is provided', () => {
			expect( () =>
				XBDateFactory( new Date( '2000-12-25T12:00:00' ) ).is(
					'*',
					XBDateFactory( '2000-12-25T12:00:00' )
				)
			).toThrowError( new InvalidComparisonOperatorError( '*' ) );
		} );
	} );
} );
