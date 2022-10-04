import XBDateFormatterFactory from './date-formatter';
import XBDateFactory from './date-factory';

describe( 'XBDateFormatterFactory', () => {
	it( 'formats pure-token format correctly', () => {
		expect(
			XBDateFormatterFactory( 'YYYY-MM' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022-02' );

		expect(
			XBDateFormatterFactory( 'YYYY-MMM' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022-Feb' );

		expect(
			XBDateFormatterFactory( 'YYYY-MM-DD' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022-02-01' );

		expect(
			XBDateFormatterFactory( 'MM/DD/YYYY' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '02/01/2022' );

		expect(
			XBDateFormatterFactory( 'YYYYMMDD' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '20220201' );

		expect(
			XBDateFormatterFactory( 'YYYY MM DD' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022 02 01' );
	} );

	it( 'formats token and escaping compositions correctly', () => {
		expect(
			XBDateFormatterFactory( '[T]' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'T' );

		expect(
			XBDateFormatterFactory( '[Today is] MM/DD/YYYY' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'Today is 02/01/2022' );

		expect(
			XBDateFormatterFactory( 'dddd, DD [de] MMMM, YYYY' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'Tuesday, 01 de February, 2022' );

		expect(
			XBDateFormatterFactory( 'ddd, MM/DD/YYYY' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'Tue, 02/01/2022' );

		expect(
			XBDateFormatterFactory( 'MM/DD/YYYY HH:mm:ss' ).format(
				XBDateFactory( '2022-02-01T12:00:00.000+03:00' )
			)
		).toBe( '02/01/2022 09:00:00' );

		expect(
			XBDateFormatterFactory( 'MM/DD/YYYY, hh:mm A' ).format(
				XBDateFactory( '2022-02-01T10:30:00.000+03:00', {
					normalize: false,
				} )
			)
		).toBe( '02/01/2022, 04:30 AM' );

		expect(
			XBDateFormatterFactory( 'MM/DD/YYYY, hh:mm a' ).format(
				XBDateFactory( '2022-02-01T14:30:00.000+03:00', {
					normalize: false,
				} )
			)
		).toBe( '02/01/2022, 08:30 am' );

		expect(
			XBDateFormatterFactory( 'MM/DD/YYYY HH:mm:ss' ).format(
				XBDateFactory( '2022-02-01T11:22:33.000+03:00', {
					normalize: false,
				} )
			)
		).toBe( '02/01/2022 05:22:33' );
	} );
} );
