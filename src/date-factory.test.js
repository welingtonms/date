import moment from 'moment-timezone';

import XBDateFactory from './date-factory';
import { InvalidComparisonOperatorError } from './errors';

describe( 'XBDateFactory', () => {
	describe( 'createDate', () => {
		it( 'create date correctly', () => {
			expect( XBDateFactory.createDate( '2021-11-12T12:34:56.789Z' ).toString() ).toBe(
				new Date( '2021-11-12T12:34:56.789Z' ).toISOString()
			);

			XBDateFactory.createDate( '2021-11-12T12:34:56.789+03:00' ).toString(); //?
			expect( XBDateFactory.createDate( '2021-11-12T12:34:56.789+03:00' ).toString() ).toBe(
				new Date( '2021-11-12T12:34:56.789+03:00' ).toISOString()
			);
		} );

		it.each( [
			[ '2021-11-12', '2021-11-12T00:00:00.000Z' ],
			[ '2021-11-12T12:00:00.000Z', '2021-11-12T12:00:00.000Z' ],
			[ 1636718400000, '2021-11-12T12:00:00.000Z' ],
		] )( 'should create date-only correctly', ( input, isoDate ) => {
			const xbDate = XBDateFactory.createDate( input );

			expect( xbDate.getTime() ).toBe( new Date( isoDate ).getTime() );
			expect( xbDate.toString() ).toBe( isoDate );
		} );

		it.each( [
			[ '2021-11-12T01:00:00.000Z', '2021-11-12T01:00:00.000Z' ],
			[ '2021-11-12T23:00:00.000Z', '2021-11-12T23:00:00.000Z' ],
			[ '2021-11-01T00:00:00.000Z', '2021-11-01T00:00:00.000Z' ],
		] )( 'should create UTC date correctly', ( input, isoDate ) => {
			const xbDate = XBDateFactory.createDate( input );

			expect( xbDate.getTime() ).toBe( new Date( isoDate ).getTime() );
			expect( xbDate.toString() ).toBe( isoDate );
		} );

		it.each( [
			[ '2021-11-30T20:00:00.000-03:00', '2021-11-30T23:00:00.000Z' ],
			[ '2021-11-30T21:00:00.000-03:00', '2021-12-01T00:00:00.000Z' ],
			[ '2021-11-30T01:00:00.000+03:00', '2021-11-29T22:00:00.000Z' ],
		] )( 'should create timezone date correctly', ( input, isoDate ) => {
			const xbDate = XBDateFactory.createDate( input );

			xbDate.toString(); //?
			new Date( isoDate ).toISOString(); //?
			expect( xbDate.getTime() ).toBe( new Date( isoDate ).getTime() );
			expect( xbDate.toString() ).toBe( isoDate );
		} );

		describe( 'add', () => {
			it( 'add to year successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).add( {
					year: 1,
				} );

				expect( date.year() ).toBe( 2002 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );
			} );

			it( 'add to month successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).add( {
					month: 1,
				} );

				expect( date.year() ).toBe( 2002 );
				expect( date.month() ).toBe( 0 );
				expect( date.date() ).toBe( 25 );
			} );

			it( 'add to day successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).add( {
					day: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 26 );
			} );

			it( 'add to hour successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).add( {
					hours: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );

				// using UTC so we are not susceptible to daylight savings and local time differences
				expect( date.timezone( 'UTC' ).hours() ).toBe( 13 );
				expect( date.timezone( 'UTC' ).minutes() ).toBe( 0 );
				expect( date.timezone( 'UTC' ).seconds() ).toBe( 0 );
				expect( date.timezone( 'UTC' ).milliseconds() ).toBe( 0 );
			} );

			it( 'add to minute successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).add( {
					minutes: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );

				// using UTC so we are not susceptible to daylight savings and local time differences
				expect( date.timezone( 'UTC' ).hours() ).toBe( 12 );
				expect( date.timezone( 'UTC' ).minutes() ).toBe( 1 );
				expect( date.timezone( 'UTC' ).seconds() ).toBe( 0 );
				expect( date.timezone( 'UTC' ).milliseconds() ).toBe( 0 );
			} );

			it( 'add to second successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).add( {
					seconds: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );

				// using UTC so we are not susceptible to daylight savings and local time differences
				expect( date.timezone( 'UTC' ).hours() ).toBe( 12 );
				expect( date.timezone( 'UTC' ).minutes() ).toBe( 0 );
				expect( date.timezone( 'UTC' ).seconds() ).toBe( 1 );
				expect( date.timezone( 'UTC' ).milliseconds() ).toBe( 0 );
			} );

			it( 'add to millisecond successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).add( {
					milliseconds: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );

				// using UTC so we are not susceptible to daylight savings and local time differences
				expect( date.timezone( 'UTC' ).hours() ).toBe( 12 );
				expect( date.timezone( 'UTC' ).minutes() ).toBe( 0 );
				expect( date.timezone( 'UTC' ).seconds() ).toBe( 0 );
				expect( date.timezone( 'UTC' ).milliseconds() ).toBe( 1 );
			} );
		} );

		describe( 'subtract', () => {
			it( 'subtract to year successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).subtract( {
					year: 1,
				} );

				expect( date.year() ).toBe( 2000 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );
			} );

			it( 'subtract to month successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).subtract( {
					month: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 10 );
				expect( date.date() ).toBe( 25 );
			} );

			it( 'subtract to day successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).subtract( {
					day: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 24 );
			} );

			it( 'subtract to hour successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).subtract( {
					hours: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );

				// using UTC so we are not susceptible to daylight savings and local time differences
				expect( date.timezone( 'UTC' ).hours() ).toBe( 11 );
				expect( date.timezone( 'UTC' ).minutes() ).toBe( 0 );
				expect( date.timezone( 'UTC' ).seconds() ).toBe( 0 );
				expect( date.timezone( 'UTC' ).milliseconds() ).toBe( 0 );
			} );

			it( 'subtract to minute successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).subtract( {
					minutes: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );

				// using UTC so we are not susceptible to daylight savings and local time differences
				expect( date.timezone( 'UTC' ).hours() ).toBe( 11 );
				expect( date.timezone( 'UTC' ).minutes() ).toBe( 59 );
				expect( date.timezone( 'UTC' ).seconds() ).toBe( 0 );
				expect( date.timezone( 'UTC' ).milliseconds() ).toBe( 0 );
			} );

			it( 'subtract to second successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).subtract( {
					seconds: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );

				// using UTC so we are not susceptible to daylight savings and local time differences
				expect( date.timezone( 'UTC' ).hours() ).toBe( 11 );
				expect( date.timezone( 'UTC' ).minutes() ).toBe( 59 );
				expect( date.timezone( 'UTC' ).seconds() ).toBe( 59 );
				expect( date.timezone( 'UTC' ).milliseconds() ).toBe( 0 );
			} );

			it( 'subtract to millisecond successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).subtract( {
					milliseconds: 1,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );

				const expected = moment( '2001-12-25T12:00:00.000Z' ).subtract( 1, 'milliseconds' );

				// using UTC so we are not susceptible to daylight savings and local time differences
				expect( date.timezone( 'UTC' ).hours() ).toBe( expected.tz( 'UTC' ).hours() );
				expect( date.timezone( 'UTC' ).minutes() ).toBe( expected.tz( 'UTC' ).minutes() );
				expect( date.timezone( 'UTC' ).seconds() ).toBe( expected.tz( 'UTC' ).seconds() );
				expect( date.timezone( 'UTC' ).milliseconds() ).toBe(
					expected.tz( 'UTC' ).milliseconds()
				);
			} );
		} );

		describe( 'set', () => {
			it( 'set year successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).set( {
					year: 1999,
				} );

				expect( date.year() ).toBe( 1999 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );
			} );

			it( 'set month successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).set( {
					month: 10,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 10 );
				expect( date.date() ).toBe( 25 );
			} );

			it( 'set day successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).set( {
					day: 5,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 5 );
			} );

			it( 'set hours successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).set( {
					hours: 5,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );
				expect( date.hours() ).toBe( 5 );

				const date2 = XBDateFactory.createDate( '2001-12-25T12:00:00.000-03:00' ).set( {
					hours: 5,
				} );

				expect( date2.year() ).toBe( 2001 );
				expect( date2.month() ).toBe( 11 );
				expect( date2.date() ).toBe( 25 );
				expect( date2.hours() ).toBe( 5 );
			} );

			it( 'set minutes successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).set( {
					hours: 5,
					minutes: 5,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );
				expect( date.hours() ).toBe( 5 );
				expect( date.minutes() ).toBe( 5 );

				const date2 = XBDateFactory.createDate( '2001-12-25T12:00:00.000-03:00' ).set( {
					hours: 5,
					minutes: 5,
				} );

				expect( date2.year() ).toBe( 2001 );
				expect( date2.month() ).toBe( 11 );
				expect( date2.date() ).toBe( 25 );
				expect( date2.hours() ).toBe( 5 );
				expect( date2.minutes() ).toBe( 5 );
			} );

			it( 'set seconds successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).set( {
					hours: 5,
					minutes: 5,
					seconds: 5,
				} );

				expect( date.year() ).toBe( 2001 );
				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );
				expect( date.hours() ).toBe( 5 );
				expect( date.minutes() ).toBe( 5 );
				expect( date.seconds() ).toBe( 5 );

				const date2 = XBDateFactory.createDate( '2001-12-25T12:00:00.000-03:00' ).set( {
					hours: 5,
					minutes: 5,
					seconds: 5,
				} );

				expect( date2.year() ).toBe( 2001 );
				expect( date2.month() ).toBe( 11 );
				expect( date2.date() ).toBe( 25 );
				expect( date2.hours() ).toBe( 5 );
				expect( date2.minutes() ).toBe( 5 );
				expect( date2.seconds() ).toBe( 5 );
			} );

			it( 'set milliseconds successfully', () => {
				const date = XBDateFactory.createDate( '2001-12-25T12:00:00.000Z' ).set( {
					hours: 5,
					minutes: 5,
					seconds: 5,
					milliseconds: 5,
				} );

				const expected = moment( '2001-12-25T12:00:00.000Z' )
					.set( 'hour', 5 )
					.set( 'minute', 5 )
					.set( 'second', 5 )
					.set( 'millisecond', 5 );

				expect( date.year() ).toBe( 2001 );
				expect( date.year() ).toBe( expected.year() );

				expect( date.month() ).toBe( 11 );
				expect( date.date() ).toBe( 25 );

				expect( date.hours() ).toBe( 5 );

				expect( date.minutes() ).toBe( 5 );
				expect( date.seconds() ).toBe( 5 );
				expect( date.milliseconds() ).toBe( 5 );

				const date2 = XBDateFactory.createDate( '2001-12-25T12:00:00.000-03:00' ).set( {
					hours: 5,
					minutes: 5,
					seconds: 5,
					milliseconds: 5,
				} );

				expect( date2.year() ).toBe( 2001 );
				expect( date2.month() ).toBe( 11 );
				expect( date2.date() ).toBe( 25 );
				expect( date2.hours() ).toBe( 5 );
				expect( date2.minutes() ).toBe( 5 );
				expect( date2.seconds() ).toBe( 5 );
				expect( date2.milliseconds() ).toBe( 5 );
			} );
		} );

		describe.only( 'comparison', () => {
			// it.each( [
			// 	[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', true ],
			// 	[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', true ],
			// 	[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', false ],

			// 	[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', true ],
			// 	[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', true ],
			// 	[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', false ],

			// 	[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', true ],
			// 	[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', true ],
			// 	[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', false ],
			// ] )( 'compares for less than or equal', ( a, b, precision, expected ) => {
			// 	expect(
			// 		XBDateFactory.createDate( a ).is(
			// 			'<=',
			// 			XBDateFactory.createDate( b ),
			// 			precision
			// 		)
			// 	).toBe( expected );
			// } );

			// it.each( [
			// 	[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', true ],
			// 	[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', false ],
			// 	[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', false ],

			// 	[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', true ],
			// 	[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', false ],
			// 	[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', false ],

			// 	[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', true ],
			// 	[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', false ],
			// 	[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', false ],
			// ] )( 'compares for less than', ( a, b, precision, expected ) => {
			// 	expect(
			// 		XBDateFactory.createDate( new Date( a ) ).is( '<', XBDateFactory.createDate( b ), precision )
			// 	).toBe( expected );
			// } );

			// it.each( [
			// 	[ '2000-12-25T22:17:12.000Z', '2000-12-25T15:16:00.000Z', 'day', true ],
			// 	[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', false ],
			// 	[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', true ],
			// 	[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', false ],

			// 	[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', false ],
			// 	[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', true ],
			// 	[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', false ],

			// 	[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', false ],
			// 	[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', true ],
			// 	[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', false ],
			// ] )( 'compares for less than or equal', ( a, b, precision, expected ) => {
			// 	XBDateFactory.createDate( a ).date(); //?
			// 	XBDateFactory.createDate( b ).date(); //?
			// 	expect(
			// 		XBDateFactory.createDate( a ).is(
			// 			'=',
			// 			XBDateFactory.createDate( b ),
			// 			precision
			// 		)
			// 	).toBe( expected );
			// } );

			it.each( [
				[ '2000-12-25T22:17:12.000Z', '2000-12-25T15:16:00.000Z', 'day', true ],
				// [ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', false ],
				// [ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', true ],
				// [ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', false ],

				// [ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', false ],
				// [ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', true ],
				// [ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', false ],

				// [ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', false ],
				// [ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', true ],
				// [ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', false ],
			] )( 'compares for less than or equal', ( a, b, precision, expected ) => {
				XBDateFactory.createDate( a ).date(); //?
				XBDateFactory.createDate( b ).date(); //?
				expect(
					XBDateFactory.createDate( a ).is(
						'=',
						XBDateFactory.createDate( b ),
						precision
					)
				).toBe( expected );
			} );

			xit.each( [
				[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', false ],
				[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', false ],
				[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', true ],

				[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', false ],
				[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', false ],
				[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', true ],

				[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', false ],
				[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', false ],
				[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', true ],
			] )( 'compares for less than or equal', ( a, b, precision, expected ) => {
				expect(
					XBDateFactory( new Date( a ) ).is( '>', XBDateFactory( b ), precision )
				).toBe( expected );
			} );

			xit.each( [
				[ '2000-12-24T12:00:00', '2000-12-26T12:00:00', 'day', false ],
				[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'day', true ],
				[ '2000-12-26T12:00:00', '2000-12-24T12:00:00', 'day', true ],

				[ '2000-11-25T12:00:00', '2001-01-25T12:00:00', 'month', false ],
				[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'month', true ],
				[ '2001-01-25T12:00:00', '2000-11-25T12:00:00', 'month', true ],

				[ '1999-12-25T12:00:00', '2001-12-25T12:00:00', 'year', false ],
				[ '2000-12-25T12:00:00', '2000-12-25T12:00:00', 'year', true ],
				[ '2001-12-25T12:00:00', '1999-12-25T12:00:00', 'year', true ],
			] )( 'compares for less than or equal', ( a, b, precision, expected ) => {
				expect(
					XBDateFactory( new Date( a ) ).is( '>=', XBDateFactory( b ), precision )
				).toBe( expected );
			} );

			it.skip( 'throws an exception when an invalid operator is provided', () => {
				expect( () =>
					XBDateFactory( new Date( '2000-12-25T12:00:00' ) ).is(
						'*',
						XBDateFactory( '2000-12-25T12:00:00' )
					)
				).toThrowError( new InvalidComparisonOperatorError( '*' ) );
			} );
		} );
	} );
} );
