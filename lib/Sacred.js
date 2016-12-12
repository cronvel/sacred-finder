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



var kungFig = require( 'kung-fig' ) ;
var math = require( 'math-kit' ) ;
var getPrimes = require( 'get-primes' ) ;
var greatestCommonDivisor = require( 'compute-gcd' ) ;
var term = require( 'terminal-kit' ).terminal ;



function Sacred() { return Sacred.create.apply( Sacred , arguments ) ; }
module.exports = Sacred ;



Sacred.create = function create( options )
{
	options = options || {} ;
	
	var self = Object.create( Sacred.prototype , {
		n: { value: options.n || 13 , enumerable: true } ,
		delta: { value: options.delta || 0.001 , enumerable: true } ,
		data: { value: null , enumerable: true , writable: true } ,
	} ) ;
	
	self.init() ;
	
	return self ;
} ;



function isInt( n ) { return Math.trunc( n ) === n ; }



Sacred.prototype.init = function init()
{
	var i ;
	
	//this.divisors = getPrimes( this.n ) ;
	
	this.remarkableNumbers = {
		'π': Math.PI ,
		'φ': ( 1 + Math.sqrt( 5 ) ) / 2
	} ;
	
	for ( i = 0 ; i <= this.n ; i ++ ) { this.remarkableNumbers[ '' + i ] = i ; }
	
	this.buildPrimes() ;
	this.buildFibonacci() ;
	this.buildPowers() ;
	//this.buildRationalFrac() ;
	this.buildFrac() ;
} ;



Sacred.prototype.buildFibonacci = function buildFibonacci()
{
	var i , old1 = 1 , old2 = 0 , current , n ;
	
	for ( i = 0 ; i < this.n ; i ++ )
	{
		current = old1 + old2 ;
		if ( this.remarkableNumbers[ current ] === undefined ) { this.remarkableNumbers[ current + '[Fib]' ] = current ; }
		old2 = old1 ;
		old1 = current ;
	}
} ;



Sacred.prototype.buildPrimes = function buildPrimes()
{
	var i ;
	
	// getPrimes() has no options to tell him: “Get me the Nth first primes”
	var primes = getPrimes( this.n * 10 ) ;
	if ( primes.length > this.n ) { primes.length = this.n ; }
	
	for ( i = 0 ; i < primes.length ; i ++ )
	{
		if ( this.remarkableNumbers[ primes[ i ] ] === undefined ) { this.remarkableNumbers[ primes[ i ] + '[Pri]' ] = primes[ i ] ; }
	}
} ;



Sacred.prototype.buildPowers = function buildPowers()
{
	var v ;
	
	Object.keys( this.remarkableNumbers ).forEach( k => {
		if ( this.remarkableNumbers[ k ] === 0 || this.remarkableNumbers[ k ] === 1 ) { return ; }
		
		v = Math.pow( this.remarkableNumbers[ k ] , 2 ) ;
		if ( ! isInt( v ) || this.remarkableNumbers[ v ] === undefined )
		{
			this.remarkableNumbers[ k + '²' ] = v ;
		}
		
		v = Math.pow( this.remarkableNumbers[ k ] , 3 ) ;
		if ( ! isInt( v ) || this.remarkableNumbers[ v ] === undefined )
		{
			this.remarkableNumbers[ k + '³' ] = v ;
		}
		
		/*
		v = Math.pow( this.remarkableNumbers[ k ] , 4 ) ;
		if ( ! isInt( v ) || this.remarkableNumbers[ v ] === undefined )
		{
			this.remarkableNumbers[ k + '⁴' ] = v ;
		}
		//*/
		
		v = Math.sqrt( this.remarkableNumbers[ k ] ) ;
		if ( ! isInt( v ) || this.remarkableNumbers[ v ] === undefined )
		{
			this.remarkableNumbers[ '√' + k ] = v ;
		}
		
		v = Math.pow( this.remarkableNumbers[ k ] , 1/3 ) ;
		if ( ! isInt( v ) || this.remarkableNumbers[ v ] === undefined )
		{
			this.remarkableNumbers[ '∛' + k ] = v ;
		}
		
		/*
		v = Math.pow( this.remarkableNumbers[ k ] , 1/4 ) ;
		if ( ! isInt( v ) || this.remarkableNumbers[ v ] === undefined )
		{
			this.remarkableNumbers[ '∜' + k ] = v ;
		}
		//*/
	} ) ;
} ;



// Brute force rational fraction
Sacred.prototype.buildRationalFrac = function buildRationalFrac()
{
	var i , j ;
	
	for ( i = 1 ; i <= this.n ; i ++ )
	{
		for ( j = 2 ; j <= this.n ; j ++ )
		{
			if ( greatestCommonDivisor( i , j ) > 1 ) { continue ; }
			this.remarkableNumbers[ i + '/' + j ] = i / j ;
		}
	}
} ;



// Create fraction with all current values
Sacred.prototype.buildFrac = function buildFrac()
{
	var keys , v1 , v2 , gcd , name ;
	
	keys = Object.keys( this.remarkableNumbers ) ;
	
	keys.forEach( k1 => {
		keys.forEach( k2 => {
			v1 = this.remarkableNumbers[ k1 ] ;
			v2 = this.remarkableNumbers[ k2 ] ;
			
			if ( k1 === k2 || v1 === 0 || v2 === 0 || v2 === 1 )
			{
				return ;
			}
			
			if ( isInt( v1 ) && isInt( v2 ) && ( gcd = greatestCommonDivisor( v1 , v2 ) ) > 1 )
			{
				v1 = v1 / gcd ;
				v2 = v2 / gcd ;
				name = v1 + '/' + v2 ;
			}
			else
			{
				name = k1 + '/' + k2 ;
			}
			
			if ( this.remarkableNumbers[ name ] === undefined )
			{
				//console.log( "name: " , name ) ;
				this.remarkableNumbers[ name ] = v1 / v2 ;
			}
		} ) ;
	} ) ;
} ;



Sacred.prototype.checkNumber = function checkNumber( number )
{
	var k , matches = [] , delta ;
	
	number = Math.abs( number ) ;
	
	for ( k in this.remarkableNumbers )
	{
		if ( number >= this.remarkableNumbers[ k ] )
		{
			delta = ( number - this.remarkableNumbers[ k ] ) / this.remarkableNumbers[ k ] ;
		}
		else
		{
			delta = ( this.remarkableNumbers[ k ] - number ) / number ;
		}
		
		if ( delta <= this.delta )
		{
			matches.push( {
				name: k ,
				value: number ,
				remarkableValue: this.remarkableNumbers[ k ] ,
				delta: delta ,
				level: Math.floor( Math.log10( this.delta / delta ) )
			} ) ;
		}
	}
	
	matches.sort( ( a , b ) => a.delta - b.delta ) ;
	
	return matches ;
} ;



// Find all properties
Sacred.prototype.findProperties = function findProperties()
{
	var keys , properties = {} , m ;
	
	if ( Array.isArray( this.data ) )
	{
		// Produces an array like [ 1,2,3, ... ]
		keys = this.data.map( ( e , index ) => index ) ;
	}
	else
	{
		keys = Object.keys( this.data ) ;
	}
	
	keys.forEach( key => {
		Object.keys( this.data[ key ] ).forEach( p => properties[ p ] = true ) ;
	} ) ;
	
	return Object.keys( properties ) ;
} ;



// Check if a property matches something
Sacred.prototype.checkProperty = function checkProperty( properties )
{
	var keys , matches , m ;
	
	if ( ! properties ) { properties = this.findProperties() ; }
	if ( ! Array.isArray( properties ) ) { properties = [ properties ] ; }
	
	if ( Array.isArray( this.data ) )
	{
		// Produces an array like [ 1,2,3, ... ]
		keys = this.data.map( ( e , index ) => index ) ;
		matches = [] ;
	}
	else
	{
		keys = Object.keys( this.data ) ;
		matches = {} ;
	}
	
	properties.forEach( property => {
		keys.forEach( key => {
			if ( typeof this.data[ key ][ property ] !== 'number' ) { return ; }
			
			m = this.checkNumber( this.data[ key ][ property ] ) ;
			
			if ( m.length )
			{
				if ( ! matches[ property ] ) { matches[ property ] = {} ; }
				matches[ property ][ key ] = m ;
			}
		} ) ;
	} ) ;
	
	return matches ;
} ;



// Check if the ratio of two object's property matches something
Sacred.prototype.checkPropertyRatio = function checkPropertyRatio( properties )
{
	var keys , matches , m , max , i , j , k1 , k2 , matchName ;
	
	if ( ! properties ) { properties = this.findProperties() ; }
	if ( ! Array.isArray( properties ) ) { properties = [ properties ] ; }
	
	if ( Array.isArray( this.data ) )
	{
		// Produces an array like [ 1,2,3, ... ]
		keys = this.data.map( ( e , index ) => index ) ;
		matches = [] ;
	}
	else
	{
		keys = Object.keys( this.data ) ;
		matches = {} ;
	}
	
	properties.forEach( property => {
		max = keys.length ;
		
		for ( i = 0 ; i < max ; i ++ )
		{
			k1 = keys[ i ] ;
			if ( typeof this.data[ k1 ][ property ] !== 'number' ) { continue ; }
			
			for ( j = i + 1 ; j < max ; j ++ )
			{
				k2 = keys[ j ] ;
				if ( typeof this.data[ k2 ][ property ] !== 'number' ) { continue ; }
				
				// Always compare the smaller to the bigger
				if ( this.data[ k1 ][ property ] >= this.data[ k2 ][ property ] )
				{
					matchName = k2 + '/' + k1 ;
					m = this.checkNumber( this.data[ k2 ][ property ] / this.data[ k1 ][ property ] ) ;
				}
				else
				{
					matchName = k1 + '/' + k2 ;
					m = this.checkNumber( this.data[ k1 ][ property ] / this.data[ k2 ][ property ] ) ;
				}
				
				if ( m.length )
				{
					if ( ! matches[ property ] ) { matches[ property ] = {} ; }
					matches[ property ][ matchName ] = m ;
				}
			}
		}
	} ) ;
	
	return matches ;
} ;





			/* Display */



Sacred.prototype.displayReport = function displayReport( report )
{
	var property , oneReport , keys , percent , roundStep ;
	//console.log( report ) ;
	
	for ( property in report )
	{
		oneReport = report[ property ] ;
		
		term.styleReset() ;
		term.brightWhite.bold.underline( "\n\n%s:\n\n" , property ) ;
		
		if ( Array.isArray( oneReport ) )
		{
			// Produce an array like [ 1,2,3, ... ]
			keys = oneReport.map( ( e , index ) => index ) ;
		}
		else
		{
			keys = Object.keys( oneReport ) ;
		}
		
		roundStep = Math.pow( 10 , 3 + Math.round( Math.log10( 1 / this.delta ) ) ) ;
		
		keys.forEach( ( key , index ) => {	// jshint ignore:line
			
			if ( index % 2 ) { term.bgBrightBlack.eraseLineAfter() ; }
			else { term.bgBlack.eraseLineAfter() ; }
			
			term.eraseLineAfter.brightCyan.bold( key ) ;
			
			oneReport[ key ].forEach( ( cor , index2 ) => {
				if ( index2 )
				{
					if ( index % 2 ) { term.bgBrightBlack.eraseLineAfter() ; }
					else { term.bgBlack.eraseLineAfter() ; }
				}
				
				term.column( 25 ).brightYellow( cor.name ) ;
				term.column( 50 ) ;
				
				percent = 'Δ=' + ( Math.round( cor.delta * 100 * roundStep ) / roundStep ) + '%' ;
				
				if ( cor.level >= 3 )
				{
					term.bgBrightRed.bold( percent ) ;
					
					// Restore background color
					if ( index % 2 ) { term.bgBrightBlack.eraseLineAfter() ; }
					else { term.bgBlack.eraseLineAfter() ; }
				}
				else if ( cor.level >= 2 ) { term.brightRed.bold( percent ) ; }
				else if ( cor.level >= 1 ) { term.brightYellow.bold( percent ) ; }
				else { term( percent ) ; }
				
				term.column( 70 ).white( "%f -> %f" , cor.value , cor.remarkableValue ) ;
				
				term( '\n' ) ;
			} ) ;
		} ) ;
	}
} ;





			/* KFG */



function identityOperator( args ) { return args[ 0 ] ; }



var kfgOperators = {
	km: identityOperator ,
	km3: identityOperator ,
	kg: identityOperator ,
	d: identityOperator ,
} ;



Sacred.prototype.load = function load( path )
{
	var object = kungFig.load( path , { operators: kfgOperators } ) ;
	
	object = kungFig.Dynamic.getRecursiveFinalValue( object ) ;
	
	this.data = object ;
} ;



