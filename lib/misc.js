/*
	Sacred Finder

	Copyright (c) 2016 - 2019 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



const string = require( 'string-kit' ) ;



const misc = {} ;
module.exports = misc ;



misc.numberToBase = ( number , base ) => {
	var i , char , digit ,
		strOut = '' ,
		strIn = ( + number ).toString( base ) ;

	for ( i = 0 ; i < strIn.length ; i ++ ) {
		if ( i && base > 10 ) { strOut += '-' ; }
		char = strIn.charCodeAt( i ) ;

		if ( char >= 0x61 && char <= 0x7a ) {
			// a-z
			digit = 10 + char - 0x61 ;
		}
		else if ( char >= 0x41 && char <= 0x5a ) {
			// A-Z
			digit = 10 + char - 0x41 ;
		}
		else if ( char >= 0x30 && char <= 0x39 ) {
			// 0-9
			digit = char - 0x30 ;
		}

		strOut += digit ;
	}

	return strOut ;
} ;



misc.reduceNumber = ( number , base = 10 ) => {
	var i , sum = 0 , char , digit ,
		strIn = ( + number ).toString( base ) ;

	for ( i = 0 ; i < strIn.length ; i ++ ) {
		char = strIn.charCodeAt( i ) ;

		if ( char >= 0x61 && char <= 0x7a ) {
			// a-z
			digit = 10 + char - 0x61 ;
		}
		else if ( char >= 0x41 && char <= 0x5a ) {
			// A-Z
			digit = 10 + char - 0x41 ;
		}
		else if ( char >= 0x30 && char <= 0x39 ) {
			// 0-9
			digit = char - 0x30 ;
		}

		sum += digit ;
	}

	return sum ;
} ;



misc.gematriaStringValue = ( str , multiply = 1 ) => {
	var i , sum = 0 , char , substr ;

	// Remove diacritics, convert to a-z A-Z letters
	str = string.latinize( str ) ;

	for ( i = 0 ; i < str.length ; i ++ ) {
		char = str.charCodeAt( i ) ;

		if ( char >= 0x61 && char <= 0x7a ) {
			// a-z
			sum += char - 0x60 ;
		}
		else if ( char >= 0x41 && char <= 0x5a ) {
			// A-Z
			sum += char - 0x40 ;
		}
		else if ( char >= 0x30 && char <= 0x39 ) {
			// 0-9
			substr = str.slice( i ).match( /^[0-9]+/ )[ 0 ] ;
			sum += parseInt( substr , 10 ) ;
			i += substr.length - 1 ;
		}
	}

	return sum * multiply ;
} ;



misc.gematria = ( str , base = 10 , multiply = 1 ) => {
	var oldValue ,
		value = misc.gematriaStringValue( str , multiply ) ,
		output = [ value ] ;

	for ( ;; ) {
		oldValue = value ;
		value = misc.reduceNumber( value , base ) ;

		if ( value === oldValue ) { break ; }

		output.push( value ) ;
	}

	return output ;
} ;

