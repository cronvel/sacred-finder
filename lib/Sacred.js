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



var Ngev = require( 'nextgen-events' ) ;
var kungFig = require( 'kung-fig' ) ;
var math = require( 'math-kit' ) ;
var getPrimes = require( 'get-primes' ) ;
var greatestCommonDivisor = require( 'compute-gcd' ) ;
var term = require( 'terminal-kit' ).terminal ;



function Sacred() { return Sacred.create.apply( Sacred , arguments ) ; }
Sacred.prototype = Object.create( Ngev.prototype ) ;
Sacred.prototype.constructor = Sacred ;
module.exports = Sacred ;



Sacred.create = function create( options )
{
	options = options || {} ;
	
	var self = Object.create( Sacred.prototype , {
		complexity: { value: options.complexity || 100 , enumerable: true } ,
		delta: { value: options.delta || 0.01 , enumerable: true } ,
		data: { value: null , enumerable: true , writable: true } ,
		remarkableNumbers: { value: {} , enumerable: true , writable: true } ,
	} ) ;
	
	Object.defineProperties( self , {
		n: { value: Math.min( options.n || 13 , self.complexity ) , enumerable: true } ,
	} ) ;
	
	return self ;
} ;



function isInt( n ) { return Math.trunc( n ) === n ; }



Sacred.prototype.init = function init()
{
	var i , v ;
	
	//this.divisors = getPrimes( this.n ) ;
	
	this.remarkableNumbers[ math.eround( Math.PI ) ] = {
		name: 'π' ,
		value: Math.PI ,
		canOveride: false ,
		complexity: 2
	} ;
	
	v = ( 1 + Math.sqrt( 5 ) ) / 2 ;
	this.remarkableNumbers[ math.eround( v ) ] = {
		name: 'φ' ,
		value: v ,
		canOveride: false ,
		complexity: 2
	} ;
	
	for ( i = 0 ; i <= this.n ; i ++ )
	{
		this.remarkableNumbers[ i ] = {
			name: i ,
			value: i ,
			canOveride: false ,
			complexity: i
		} ;
	}
	
	this.buildPrimes() ;
	this.buildFibonacci() ;
	this.buildPowers() ;
	//this.buildRationalFrac() ;
	console.log( "Mul..." , Object.keys( this.remarkableNumbers ).length ) ;
	this.buildMul() ;
	console.log( "Sum..." , Object.keys( this.remarkableNumbers ).length ) ;
	this.buildSum() ;
	console.log( "Sum2..." , Object.keys( this.remarkableNumbers ).length ) ;
	this.buildSum() ;
	console.log( "Frac..." , Object.keys( this.remarkableNumbers ).length ) ;
	this.buildFrac() ;
	console.log( "Total numbers:" , Object.keys( this.remarkableNumbers ).length ) ;
} ;



Sacred.prototype.buildPrimes = function buildPrimes()
{
	var i , v , complexity ;
	
	// getPrimes() has no options to tell him: “Get me the Nth first primes”
	var primes = getPrimes( this.n * 10 ) ;
	if ( primes.length > this.n ) { primes.length = this.n ; }
	
	for ( i = 0 ; i < primes.length ; i ++ )
	{
		v = primes[ i ] ;
		complexity = i + 2 ;
		
		if ( this.remarkableNumbers[ v ] === undefined )
		{
			this.remarkableNumbers[ v ] = {
				name: v + '[Pri]' ,
				value: v ,
				canOveride: false ,
				complexity: complexity
			} ;
		}
		else if ( this.remarkableNumbers[ v ].complexity > complexity )
		{
			this.remarkableNumbers[ v ].complexity = complexity ;
		}
	}
} ;



Sacred.prototype.buildFibonacci = function buildFibonacci()
{
	var i , old1 = 1 , old2 = 0 , current , n , complexity ;
	
	for ( i = 0 ; i < this.n ; i ++ )
	{
		current = old1 + old2 ;
		complexity = ( i + 1 ) * 2 ;
		
		if ( this.remarkableNumbers[ current ] === undefined )
		{
			this.remarkableNumbers[ current ] = {
				name: current + '[Fib]' ,
				value: current ,
				canOveride: false ,
				complexity: complexity
			} ;
		}
		else if ( this.remarkableNumbers[ current ].complexity > complexity )
		{
			this.remarkableNumbers[ current ].complexity = complexity ;
		}
		
		old2 = old1 ;
		old1 = current ;
	}
} ;



Sacred.prototype.buildPowers = function buildPowers()
{
	var v , k , rn , complexity ;
	
	Object.keys( this.remarkableNumbers ).forEach( key => {
		rn = this.remarkableNumbers[ key ] ;
		
		if ( rn.value === 0 || rn.value === 1 ) { return ; }
		
		complexity = ( rn.complexity + 2 ) * 2 ;
		if ( complexity <= this.complexity )
		{
			v = Math.pow( rn.value , 2 ) ;
			
			if ( this.remarkableNumbers[ k ] === undefined )
			{
				this.remarkableNumbers[ k ] = {
					name: rn.name + '²' ,
					value: v ,
					canOveride: false ,
					complexity: complexity
				} ;
			}
			else if ( this.remarkableNumbers[ k ].complexity > complexity )
			{
				this.remarkableNumbers[ k ].complexity = complexity ;
			}
		}
		
		complexity = ( rn.complexity + 3 ) * 3 ;
		if ( complexity <= this.complexity )
		{
			v = Math.pow( rn.value , 3 ) ;
			k = math.eround( v ) ;
			
			if ( this.remarkableNumbers[ k ] === undefined )
			{
				this.remarkableNumbers[ k ] = {
					name: rn.name + '³' ,
					value: v ,
					canOveride: false ,
					complexity: complexity
				} ;
			}
			else if ( this.remarkableNumbers[ k ].complexity > complexity )
			{
				this.remarkableNumbers[ k ].complexity = complexity ;
			}
		}
		
		/*
		complexity = ( rn.complexity + 4 ) * 4 ;
		if ( complexity <= this.complexity )
		{
			v = Math.pow( rn.value , 4 ) ;
			k = math.eround( v ) ;
			
			if ( this.remarkableNumbers[ k ] === undefined )
			{
				this.remarkableNumbers[ k ] = {
					name: rn.name + '⁴' ,
					value: v ,
					canOveride: false ,
					complexity: complexity
				} ;
			}
			else if ( this.remarkableNumbers[ k ].complexity > complexity )
			{
				this.remarkableNumbers[ k ].complexity = complexity ;
			}
		}
		//*/
		
		complexity = ( rn.complexity + 2 ) * 2 ;
		if ( complexity <= this.complexity )
		{
			v = Math.sqrt( rn.value ) ;
			k = math.eround( v ) ;
			
			if ( this.remarkableNumbers[ k ] === undefined )
			{
				this.remarkableNumbers[ k ] = {
					name: '√' + rn.name ,
					value: v ,
					canOveride: false ,
					complexity: complexity
				} ;
			}
			else if ( this.remarkableNumbers[ k ].complexity > complexity )
			{
				this.remarkableNumbers[ k ].complexity = complexity ;
			}
		}
		
		complexity = ( rn.complexity + 3 ) * 3 ;
		if ( complexity <= this.complexity )
		{
			v = Math.pow( rn.value , 1/3 ) ;
			k = math.eround( v ) ;
			
			if ( this.remarkableNumbers[ k ] === undefined )
			{
				this.remarkableNumbers[ k ] = {
					name: '∛' + rn.name ,
					value: v ,
					canOveride: false ,
					complexity: complexity
				} ;
			}
			else if ( this.remarkableNumbers[ k ].complexity > complexity )
			{
				this.remarkableNumbers[ k ].complexity = complexity ;
			}
		}
		
		/*
		complexity = ( rn.complexity + 4 ) * 4 ;
		if ( complexity <= this.complexity )
		{
			v = Math.pow( rn.value , 1/4 ) ;
			k = math.eround( v ) ;
			
			if ( this.remarkableNumbers[ k ] === undefined )
			{
				this.remarkableNumbers[ k ] = {
					name: '∜' + rn.name ,
					value: v ,
					canOveride: false ,
					complexity: complexity
			}
			else if ( this.remarkableNumbers[ k ].complexity > complexity )
			{
				this.remarkableNumbers[ k ].complexity = complexity ;
			}
		}
		//*/
	} ) ;
} ;



// Create sum with all current values
Sacred.prototype.buildMul = function buildMul()
{
	return this.buildComposed( {
		title: "Mul" ,
		complexityMul: 2 ,
		complexityAdd: 1 ,
		notEq: true ,
		notZero: true ,
		notOne: true ,
		joint: '×' ,
		compute: ( a , b ) => a * b
	} ) ;
} ;



// Create sum with all current values
Sacred.prototype.buildSum = function buildSum()
{
	return this.buildComposed( {
		title: "Sum" ,
		complexityMul: 2 ,
		complexityAdd: 1 ,
		notEq: true ,
		notZero: true ,
		joint: '+' ,
		compute: ( a , b ) => a + b
	} ) ;
} ;



// Create fraction with all current values
Sacred.prototype.buildFrac = function buildFrac()
{
	return this.buildComposed( {
		title: "Frac" ,
		complexityMul: 2 ,
		complexityAdd: 1 ,
		notEq: true ,
		notZero: true ,
		rightIsNotOne: true ,
		joint: '/' ,
		compute: ( a , b ) => a / b
	} ) ;
} ;



// Create fraction with all current values
Sacred.prototype.buildComposed = function buildComposed( params )
{
	var keys , v1 , v2 , gcd , name , k , v , complexity , total , count = 0 ;
	
	keys = Object.keys( this.remarkableNumbers ) ;
	
	//total = keys.length * keys.length ;
	//console.log( "Total: " , total ) ;
	
	// Pre-filtering out some keys
	keys = keys.filter( k1 => this.remarkableNumbers[ k1 ].complexity * params.complexityMul + params.complexityAdd <= this.complexity ) ;
	
	total = keys.length * keys.length ;
	//console.log( "Total: " , total ) ;
	
	//this.emit( 'progress' ) ;
	
	keys.forEach( k1 => {
		
		//console.log( "Done: " + math.round( 100 * count / total , 0.1 ) + '% of ' + total ) ;
		//this.emit( 'progressUpdate' , count / total ) ;
		
		keys.forEach( k2 => {
			
			count ++ ;
			
			v1 = this.remarkableNumbers[ k1 ].value ;
			v2 = this.remarkableNumbers[ k2 ].value ;
			
			complexity =
				params.complexityAdd +
				( params.complexityMul * ( this.remarkableNumbers[ k1 ].complexity + this.remarkableNumbers[ k2 ].complexity ) ) ;
			
			if (
				( complexity > this.complexity ) ||
				( params.notEq && v1 === v2 ) ||
				( params.notZero && ( v1 === 0 || v2 === 0 ) ) ||
				( params.notOne && ( v1 === 1 || v2 === 1 ) ) ||
				( params.rightIsNotOne && v2 === 1 )
			)
			{
				return ;
			}
			
			name = this.remarkableNumbers[ k1 ].name + params.joint + this.remarkableNumbers[ k2 ].name ;
			
			v = params.compute( v1 , v2 ) ;
			k = math.eround( v ) ;
			
			if (
				this.remarkableNumbers[ k ] === undefined ||
				( this.remarkableNumbers[ k ].canOveride && this.remarkableNumbers[ k ].complexity > complexity )
			)
			{
				//console.log( "name: " , name ) ;
				//this.remarkableNumbers[ name ] = v1 / v2 ;
				this.remarkableNumbers[ k ] = {
					name: name ,
					value: v ,
					canOveride: true ,
					complexity: complexity
				} ;
			}
			else if ( this.remarkableNumbers[ k ].complexity > complexity )
			{
				this.remarkableNumbers[ k ].complexity = complexity ;
			}
		} ) ;
	} ) ;
} ;



Sacred.prototype.checkNumber = function checkNumber( number )
{
	var k , matches = [] , delta , relevance , complexityFactor ;
	
	number = Math.abs( number ) ;
	
	for ( k in this.remarkableNumbers )
	{
		if ( number >= this.remarkableNumbers[ k ].value )
		{
			delta = ( number - this.remarkableNumbers[ k ].value ) / this.remarkableNumbers[ k ].value ;
		}
		else
		{
			delta = ( this.remarkableNumbers[ k ].value - number ) / number ;
		}
		
		if ( delta > this.delta ) { continue ; }
		
		//complexityFactor = 1 + 4 * Math.pow( ( this.remarkableNumbers[ k ].complexity - 1 ) / 10 , 2 ) ;
		complexityFactor = Math.max( 1 , Math.pow( 2.5 , ( this.remarkableNumbers[ k ].complexity - 10 ) / 10 ) ) ;
		relevance = Math.log2( this.delta / ( delta * complexityFactor ) ) ;
		
		if ( relevance < 0 ) { continue ; }
		
		matches.push( {
			name: this.remarkableNumbers[ k ].name ,
			value: number ,
			remarkableValue: this.remarkableNumbers[ k ].value ,
			remarkableComplexity: this.remarkableNumbers[ k ].complexity ,
			delta: delta ,
			relevance: relevance ,
			complexityFactor: complexityFactor
		} ) ;
	}
	
	matches.sort( ( a , b ) => b.relevance - a.relevance ) ;
	
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
		
		console.log( "Computing property: " + property + "..." ) ;
		
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
	var property , oneReport , keys , relevance , percent , roundStep ;
	//console.log( report ) ;
	
	roundStep = Math.pow( 10 , - 3 - Math.round( Math.log10( 1 / this.delta ) ) ) ;
	//console.log( ">>>:" , roundStep ) ;
	
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
				
				term.column( 45 ) ;
				relevance = 'R=' + math.round( cor.relevance , 0.01 ) ;
				percent = 'Δ=' + math.round( cor.delta * 100 , roundStep ) + '%' ;
				
				if ( cor.relevance >= 3 )
				{
					term.bgBrightRed.bold( relevance ).column( 55 ).bgBrightRed.bold( percent ) ;
					
					// Restore background color
					if ( index % 2 ) { term.bgBrightBlack.eraseLineAfter() ; }
					else { term.bgBlack.eraseLineAfter() ; }
				}
				else if ( cor.relevance >= 2 ) { term.brightRed.bold( relevance ).column( 55 ).brightRed.bold( percent )  ; }
				else if ( cor.relevance >= 1 ) { term.brightYellow.bold( relevance ).column( 55 ).brightYellow.bold( percent )  ; }
				else { term( relevance ).column( 55 )( percent )  ; }
				
				term.column( 70 , 'C=%f' , math.round( cor.remarkableComplexity , 0.1 ) ) ;
				term.column( 80 , 'Cf=%f' , math.round( cor.complexityFactor , 0.1 ) ) ;
				
				term.column( 90 ).white( "%f -> %f" , math.eround( cor.value ) , math.eround( cor.remarkableValue ) ) ;
				//term.column( 80 ).white( "c: %f   cf: %f" , cor.remarkableComplexity , math.eround( cor.complexityFactor ) ) ;
				//term.column( 80 ).white( "c: %f   cf: %f" , cor.remarkableComplexity , cor.complexityFactor ) ;
				
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



