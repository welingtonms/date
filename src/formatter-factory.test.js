import { createFormatter, tokenizer } from './formatter-factory';
import { createDate } from './date-factory';

describe( 'XBDateFormatterFactory', () => {
	it( 'formats pure-token format correctly', () => {
		expect( createFormatter( '%4Y-%2M' ).format( null ) ).toBeNull();
	} );

	it( 'formats pure-token format correctly', () => {
		expect(
			createFormatter( '%2M' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '02' );

		expect(
			createFormatter( '%4Y-%sM' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022-Feb' );

		expect(
			createFormatter( '%4Y-%2M-%02D' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022-02-01' );

		expect(
			createFormatter( '%2M/%02D/%4Y' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '02/01/2022' );

		expect(
			createFormatter( '%4Y%2M%02D' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '20220201' );

		expect(
			createFormatter( '%4Y %2M %02D' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022 02 01' );

		expect(
			createFormatter( '%2Y' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '22' );

		expect(
			createFormatter( '%iD' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2' );
	} );

	it.skip( 'formats token and escaping compositions correctly', () => {
		expect(
			createFormatter( 'T' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'T' );

		expect(
			createFormatter( 'Today is %2M/%02D/%4Y' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'Today is 02/01/2022' );

		expect(
			createFormatter( '%lD, %02D de %lM, %4Y' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'Tuesday, 01 de February, 2022' );

		expect(
			createFormatter( '%sD, %2M/%02D/%4Y' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'Tue, 02/01/2022' );

		expect(
			createFormatter( '%2M/%02D/%4Y %02h:%2M:%02s' ).format(
				createDate( '2022-02-01T12:00:00.000+03:00' )
			)
		).toBe( '02/01/2022 06:00:00' );

		expect(
			createFormatter( '%2M/%02D/%4Y, %02h:%2M %uA' ).format(
				createDate( '2022-02-01T10:30:00.000+03:00' )
			)
		).toBe( '02/01/2022, 04:30 AM' );

		expect(
			createFormatter( '%2M/%02D/%4Y, %02h:%2M %lA' ).format(
				createDate( '2022-02-01T14:30:00.000+03:00' )
			)
		).toBe( '02/01/2022, 08:30 am' );

		expect(
			createFormatter( '%2M/%02D/%4Y %02h:%2M:%02s' ).format(
				createDate( '2022-02-01T11:22:33.000+03:00' )
			)
		).toBe( '02/01/2022 05:22:33' );
	} );

	describe( 'tokenizer', () => {
		it( 'gets fundamental tokens', () => {
			expect( tokenizer( '%4Y' ) ).toEqual( [ '%4Y' ] );
			expect( tokenizer( '%2Y' ) ).toEqual( [ '%2Y' ] );
			expect( tokenizer( '%lM' ) ).toEqual( [ '%lM' ] );
			expect( tokenizer( '%sM' ) ).toEqual( [ '%sM' ] );
			expect( tokenizer( '%2M' ) ).toEqual( [ '%2M' ] );
			expect( tokenizer( '%M' ) ).toEqual( [ '%M' ] );
			expect( tokenizer( '%02D' ) ).toEqual( [ '%02D' ] );
			expect( tokenizer( '%D' ) ).toEqual( [ '%D' ] );
			expect( tokenizer( '%lD' ) ).toEqual( [ '%lD' ] );
			expect( tokenizer( '%sD' ) ).toEqual( [ '%sD' ] );
			expect( tokenizer( '%iD' ) ).toEqual( [ '%iD' ] );
			expect( tokenizer( '%02h' ) ).toEqual( [ '%02h' ] );
			expect( tokenizer( '%h' ) ).toEqual( [ '%h' ] );
			expect( tokenizer( '%2M' ) ).toEqual( [ '%2M' ] );
			expect( tokenizer( '%m' ) ).toEqual( [ '%m' ] );
			expect( tokenizer( '%02s' ) ).toEqual( [ '%02s' ] );
			expect( tokenizer( '%s' ) ).toEqual( [ '%s' ] );
			expect( tokenizer( '%03ms' ) ).toEqual( [ '%03ms' ] );
			expect( tokenizer( '%uA' ) ).toEqual( [ '%uA' ] );
			expect( tokenizer( '%lA' ) ).toEqual( [ '%lA' ] );
			expect( tokenizer( 'tz' ) ).toEqual( [ 'tz' ] );
		} );

		it( 'gets fundamental tokens compositions', () => {
			expect( tokenizer( '%4Y-%2M' ) ).toEqual( [ '%4Y', '-', '%2M' ] );
			expect( tokenizer( '%4Y-%2M-%02D' ) ).toEqual( [
				'%4Y',
				'-',
				'%2M',
				'-',
				'%02D',
			] );
			expect( tokenizer( '%2M/%02D/%4Y' ) ).toEqual( [
				'%2M',
				'/',
				'%02D',
				'/',
				'%4Y',
			] );
			expect( tokenizer( '%4Y%2M%02D' ) ).toEqual( [
				'%4Y',
				'%2M',
				'%02D',
			] );
			expect( tokenizer( '%4Y %2M %02D' ) ).toEqual( [
				'%4Y',
				' ',
				'%2M',
				' ',
				'%02D',
			] );
			expect( tokenizer( '%02h:%2M:%02s' ) ).toEqual( [
				'%02h',
				':',
				'%2M',
				':',
				'%02s',
			] );
		} );

		it( 'gets fundamental tokens and escaping compositions', () => {
			expect( tokenizer( 'T' ) ).toEqual( [ 'T' ] );
			expect( tokenizer( 'Today is %2M/%02D/%4Y' ) ).toEqual( [
				'Today is ',
				'%2M',
				'/',
				'%02D',
				'/',
				'%4Y',
			] );

			expect( tokenizer( '%lD, %02D de %lM, %4Y' ) ).toEqual( [
				'%lD',
				', ',
				'%02D',
				' de ',
				'%lM',
				', ',
				'%4Y',
			] );

			expect( tokenizer( '%2M/%02D/%4Y %02h:%2M:%02s' ) ).toEqual( [
				'%2M',
				'/',
				'%02D',
				'/',
				'%4Y',
				' ',
				'%02h',
				':',
				'%2M',
				':',
				'%02s',
			] );
		} );
	} );
} );
