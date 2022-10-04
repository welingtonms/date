import tokenizer from './format-tokenizer';

describe( 'tokenizer', () => {
	it( 'gets fundamental tokens', () => {
		expect( tokenizer( 'MM' ) ).toEqual( [ 'MM' ] );
		expect( tokenizer( 'MMM' ) ).toEqual( [ 'MMM' ] );
		expect( tokenizer( 'MMMM' ) ).toEqual( [ 'MMMM' ] );

		expect( tokenizer( 'DD' ) ).toEqual( [ 'DD' ] );

		expect( tokenizer( 'ddd' ) ).toEqual( [ 'ddd' ] );
		expect( tokenizer( 'dddd' ) ).toEqual( [ 'dddd' ] );

		expect( tokenizer( 'YYYY' ) ).toEqual( [ 'YYYY' ] );

		expect( tokenizer( 'HH' ) ).toEqual( [ 'HH' ] );

		expect( tokenizer( 'mm' ) ).toEqual( [ 'mm' ] );

		expect( tokenizer( 'ss' ) ).toEqual( [ 'ss' ] );
	} );

	it( 'gets fundamental tokens compositions', () => {
		expect( tokenizer( 'YYYY-MM' ) ).toEqual( [ 'YYYY', '-', 'MM' ] );
		expect( tokenizer( 'YYYY-MM-DD' ) ).toEqual( [
			'YYYY',
			'-',
			'MM',
			'-',
			'DD',
		] );
		expect( tokenizer( 'MM/DD/YYYY' ) ).toEqual( [
			'MM',
			'/',
			'DD',
			'/',
			'YYYY',
		] );
		expect( tokenizer( 'YYYYMMDD' ) ).toEqual( [ 'YYYY', 'MM', 'DD' ] );
		expect( tokenizer( 'YYYY MM DD' ) ).toEqual( [
			'YYYY',
			' ',
			'MM',
			' ',
			'DD',
		] );
		expect( tokenizer( 'HH:mm:ss' ) ).toEqual( [
			'HH',
			':',
			'mm',
			':',
			'ss',
		] );
	} );

	it( 'gets fundamental tokens and escaping compositions', () => {
		expect( tokenizer( '[T]' ) ).toEqual( [ 'T' ] );
		expect( tokenizer( '[Today is] MM/DD/YYYY' ) ).toEqual( [
			'Today is ',
			'MM',
			'/',
			'DD',
			'/',
			'YYYY',
		] );

		expect( tokenizer( 'dddd, DD [de] MMMM, YYYY' ) ).toEqual( [
			'dddd',
			', ',
			'DD',
			' de ',
			'MMMM',
			', ',
			'YYYY',
		] );

		expect( tokenizer( 'MM/DD/YYYY HH:mm:ss' ) ).toEqual( [
			'MM',
			'/',
			'DD',
			'/',
			'YYYY',
			' ',
			'HH',
			':',
			'mm',
			':',
			'ss',
		] );
	} );
} );
