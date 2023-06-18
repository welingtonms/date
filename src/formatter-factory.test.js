import { createFormatter, tokenizer } from './formatter-factory';
import { createDate } from './date-factory';

describe( 'XBDateFormatterFactory', () => {
	it( 'formats pure-token format correctly', () => {
		expect( createFormatter( 'Y-4-M-2' ).format( null ) ).toBeNull();
	} );

	it( 'formats pure-token format correctly', () => {
		expect(
			createFormatter( 'Y-4-M-2' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022-02' );

		expect(
			createFormatter( 'Y-4-M-short' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022-Feb' );

		expect(
			createFormatter( 'Y-4-M-2-D-2' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022-02-01' );

		expect(
			createFormatter( 'M-2/D-2/Y-4' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '02/01/2022' );

		expect(
			createFormatter( 'Y-4M-2D-2' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '20220201' );

		expect(
			createFormatter( 'Y-4 M-2 D-2' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2022 02 01' );

		expect(
			createFormatter( 'Y-2' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '22' );

		expect(
			createFormatter( 'D-index' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( '2' );
	} );

	it( 'formats token and escaping compositions correctly', () => {
		expect(
			createFormatter( 'T' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'T' );

		expect(
			createFormatter( 'Today is M-2/D-2/Y-4' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'Today is 02/01/2022' );

		expect(
			createFormatter( 'D-long, D-2 de M-long, Y-4' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'Tuesday, 01 de February, 2022' );

		expect(
			createFormatter( 'D-short, M-2/D-2/Y-4' ).format(
				createDate( '2022-02-01T12:00:00.000Z' )
			)
		).toBe( 'Tue, 02/01/2022' );

		expect(
			createFormatter( 'M-2/D-2/Y-4 h-2:m-2:s-2' ).format(
				createDate( '2022-02-01T12:00:00.000+03:00' )
			)
		).toBe( '02/01/2022 06:00:00' );

		expect(
			createFormatter( 'M-2/D-2/Y-4, h-2:m-2 a-upper' ).format(
				createDate( '2022-02-01T10:30:00.000+03:00' )
			)
		).toBe( '02/01/2022, 04:30 AM' );

		expect(
			createFormatter( 'M-2/D-2/Y-4, h-2:m-2 a-lower' ).format(
				createDate( '2022-02-01T14:30:00.000+03:00' )
			)
		).toBe( '02/01/2022, 08:30 am' );

		expect(
			createFormatter( 'M-2/D-2/Y-4 h-2:m-2:s-2' ).format(
				createDate( '2022-02-01T11:22:33.000+03:00' )
			)
		).toBe( '02/01/2022 05:22:33' );
	} );

	describe( 'tokenizer', () => {
		it( 'gets fundamental tokens', () => {
			expect( tokenizer( 'Y-4' ) ).toEqual( [ 'Y-4' ] );
			expect( tokenizer( 'Y-2' ) ).toEqual( [ 'Y-2' ] );
			expect( tokenizer( 'M-long' ) ).toEqual( [ 'M-long' ] );
			expect( tokenizer( 'M-short' ) ).toEqual( [ 'M-short' ] );
			expect( tokenizer( 'M-2' ) ).toEqual( [ 'M-2' ] );
			expect( tokenizer( 'M-1' ) ).toEqual( [ 'M-1' ] );
			expect( tokenizer( 'D-2' ) ).toEqual( [ 'D-2' ] );
			expect( tokenizer( 'D-1' ) ).toEqual( [ 'D-1' ] );
			expect( tokenizer( 'D-long' ) ).toEqual( [ 'D-long' ] );
			expect( tokenizer( 'D-short' ) ).toEqual( [ 'D-short' ] );
			expect( tokenizer( 'D-index' ) ).toEqual( [ 'D-index' ] );
			expect( tokenizer( 'h-2' ) ).toEqual( [ 'h-2' ] );
			expect( tokenizer( 'h-1' ) ).toEqual( [ 'h-1' ] );
			expect( tokenizer( 'm-2' ) ).toEqual( [ 'm-2' ] );
			expect( tokenizer( 'm-1' ) ).toEqual( [ 'm-1' ] );
			expect( tokenizer( 's-2' ) ).toEqual( [ 's-2' ] );
			expect( tokenizer( 's-1' ) ).toEqual( [ 's-1' ] );
			expect( tokenizer( 'ms-3' ) ).toEqual( [ 'ms-3' ] );
			expect( tokenizer( 'a-upper' ) ).toEqual( [ 'a-upper' ] );
			expect( tokenizer( 'a-lower' ) ).toEqual( [ 'a-lower' ] );
			expect( tokenizer( 'tz' ) ).toEqual( [ 'tz' ] );
		} );

		it( 'gets fundamental tokens compositions', () => {
			expect( tokenizer( 'Y-4-M-2' ) ).toEqual( [ 'Y-4', '-', 'M-2' ] );
			expect( tokenizer( 'Y-4-M-2-D-2' ) ).toEqual( [
				'Y-4',
				'-',
				'M-2',
				'-',
				'D-2',
			] );
			expect( tokenizer( 'M-2/D-2/Y-4' ) ).toEqual( [
				'M-2',
				'/',
				'D-2',
				'/',
				'Y-4',
			] );
			expect( tokenizer( 'Y-4M-2D-2' ) ).toEqual( [
				'Y-4',
				'M-2',
				'D-2',
			] );
			expect( tokenizer( 'Y-4 M-2 D-2' ) ).toEqual( [
				'Y-4',
				' ',
				'M-2',
				' ',
				'D-2',
			] );
			expect( tokenizer( 'h-2:m-2:s-2' ) ).toEqual( [
				'h-2',
				':',
				'm-2',
				':',
				's-2',
			] );
		} );

		it( 'gets fundamental tokens and escaping compositions', () => {
			expect( tokenizer( 'T' ) ).toEqual( [ 'T' ] );
			expect( tokenizer( 'Today is M-2/D-2/Y-4' ) ).toEqual( [
				'Today is ',
				'M-2',
				'/',
				'D-2',
				'/',
				'Y-4',
			] );

			expect( tokenizer( 'D-long, D-2 de M-long, Y-4' ) ).toEqual( [
				'D-long',
				', ',
				'D-2',
				' de ',
				'M-long',
				', ',
				'Y-4',
			] );

			expect( tokenizer( 'M-2/D-2/Y-4 h-2:m-2:s-2' ) ).toEqual( [
				'M-2',
				'/',
				'D-2',
				'/',
				'Y-4',
				' ',
				'h-2',
				':',
				'm-2',
				':',
				's-2',
			] );
		} );
	} );
} );
