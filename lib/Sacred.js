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



function Sacred() { return Sacred.create.apply( Sacred , arguments ) ; }
module.exports = Sacred ;



Sacred.create = function create( options )
{
	options = options || {} ;
	
	var self = Object.create( Sacred.prototype , {
		maxInt: { value: options.maxInt || 20 , enumerable: true } ,
		delta: { value: options.delta || 0.01 , enumerable: true } ,
	} ) ;
	
	self.init() ;
	
	return self ;
} ;



Sacred.prototype.init = function init()
{
	var i ;
	
	//this.divisors = getPrimes( this.maxInt ) ;
	
	this.remarkableNumbers = {
		'π': Math.PI ,
		'φ': ( 1 + Math.sqrt( 5 ) ) / 2
	} ;
	
	for ( i = 0 ; i <= this.maxInt ; i ++ ) { this.remarkableNumbers[ '' + i ] = i ; }
	
	this.buildMods() ;
	this.buildRationalFrac() ;
} ;



Sacred.prototype.buildMods = function buildMods()
{
	Object.keys( this.remarkableNumbers ).forEach( k => {
		this.remarkableNumbers[ k + '²' ] = Math.pow( this.remarkableNumbers[ k ] , 2 ) ;
		this.remarkableNumbers[ k + '³' ] = Math.pow( this.remarkableNumbers[ k ] , 3 ) ;
		this.remarkableNumbers[ '√' + k ] = Math.sqrt( this.remarkableNumbers[ k ] ) ;
		this.remarkableNumbers[ '∛' + k ] = Math.pow( this.remarkableNumbers[ k ] , 1/3 ) ;
		
		this.remarkableNumbers[ '1/' + k ] = 1 / this.remarkableNumbers[ k ] ;
		this.remarkableNumbers[ '1/' + k + '²' ] = 1 / Math.pow( this.remarkableNumbers[ k ] , 2 ) ;
		this.remarkableNumbers[ '1/' + k + '³' ] = 1 / Math.pow( this.remarkableNumbers[ k ] , 3 ) ;
		this.remarkableNumbers[ '1/√' + k ] = 1 / Math.sqrt( this.remarkableNumbers[ k ] ) ;
		this.remarkableNumbers[ '1/∛' + k ] = 1 / Math.pow( this.remarkableNumbers[ k ] , 1/3 ) ;
	} ) ;
} ;



// Brute force rational fraction
Sacred.prototype.buildRationalFrac = function buildRationalFrac()
{
	var i , j ;
	
	for ( i = 1 ; i <= this.maxInt ; i ++ )
	{
		for ( j = 2 ; j <= this.maxInt ; j ++ )
		{
			if ( greatestCommonDivisor( i , j ) > 1 ) { continue ; }
			this.remarkableNumbers[ i + '/' + j ] = i / j ;
		}
	}
} ;



Sacred.prototype.checkNumber = function checkNumber( number )
{
	var k , matches = [] , delta ;
	
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
				value: this.remarkableNumbers[ k ] ,
				delta: delta ,
				level: Math.floor( Math.log10( this.delta / delta ) )
			} ) ;
		}
	}
	
	matches.sort( ( a , b ) => a.delta - b.delta ) ;
	
	return matches ;
} ;



Sacred.prototype.checkObject = function checkObject( obj , property )
{
	var keys = Object.keys( obj ) ;
	
	
} ;



Sacred.prototype.load = function load( path )
{
	var object = kungFig.load( path , {
		operators: {
			km: op.identity ,
			km3: op.identity ,
			kg: op.identity ,
			d: op.identity ,
		}
	} ) ;
	
	return object ;
} ;

var op = {} ;
op.identity = function( args ) { return args[ 0 ] ; }
