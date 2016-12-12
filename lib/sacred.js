/*
	Sacred Finder
	
	Copyright (c) 2016 Cédric Ronvel
	
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


var math = require( 'math-kit' ) ;
var getPrimes = require( 'get-primes' ) ;
var greatestCommonDivisor = require( 'compute-gcd' ) ;


const MAX_INT = 20 ;
const DELTA = 0.01 ;



var divisors = getPrimes( MAX_INT ) ;



var remarkableNumbers = {
	'π': Math.PI ,
	'φ': ( 1 + Math.sqrt( 5 ) ) / 2
} ;



function buildMods()
{
	Object.keys( remarkableNumbers ).forEach( k => {
		remarkableNumbers[ k + '²' ] = Math.pow( remarkableNumbers[ k ] , 2 ) ;
		remarkableNumbers[ k + '³' ] = Math.pow( remarkableNumbers[ k ] , 3 ) ;
		remarkableNumbers[ '√' + k ] = Math.sqrt( remarkableNumbers[ k ] ) ;
		remarkableNumbers[ '∛' + k ] = Math.pow( remarkableNumbers[ k ] , 1/3 ) ;
		
		remarkableNumbers[ '1/' + k ] = 1 / remarkableNumbers[ k ] ;
		remarkableNumbers[ '1/' + k + '²' ] = 1 / Math.pow( remarkableNumbers[ k ] , 2 ) ;
		remarkableNumbers[ '1/' + k + '³' ] = 1 / Math.pow( remarkableNumbers[ k ] , 3 ) ;
		remarkableNumbers[ '1/√' + k ] = 1 / Math.sqrt( remarkableNumbers[ k ] ) ;
		remarkableNumbers[ '1/∛' + k ] = 1 / Math.pow( remarkableNumbers[ k ] , 1/3 ) ;
	} ) ;
}



function buildInt()
{
	var i ;
	for ( i = 0 ; i <= MAX_INT ; i ++ ) { remarkableNumbers[ '' + i ] = i ; }
}



// Brute force rational fraction
function buildRationalFrac()
{
	var i , j ;
	
	for ( i = 1 ; i <= MAX_INT ; i ++ )
	{
		for ( j = 2 ; j <= MAX_INT ; j ++ )
		{
			if ( greatestCommonDivisor( i , j ) > 1 ) { continue ; }
			remarkableNumbers[ i + '/' + j ] = i / j ;
		}
	}
}


buildInt() ;
buildMods() ;
buildRationalFrac() ;
console.log( remarkableNumbers ) ;




function checkNumber( num )
{
	var k , matches = [] ;
	
	for ( k in remarkableNumbers )
	{
		if ( num >= remarkableNumbers[ k ] )
		{
			if ( ( num - remarkableNumbers[ k ] ) / remarkableNumbers[ k ] <= DELTA ) { matches.push( k ) ; }
		}
		else
		{
			if ( ( remarkableNumbers[ k ] - num ) / num <= DELTA ) { matches.push( k ) ; }
		}
	}
	
	return matches ;
}

var num = 1737.4 / 6371 ;
console.log( "Matches for " + num + ":\n" + checkNumber( num ).map( e => e + ': ' + remarkableNumbers[ e ] ).join('\n') ) ;


