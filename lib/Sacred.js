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
//var greatestCommonDivisor = require( 'compute-gcd' ) ;
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
		ratioMode: { value: !! options.ratioMode , enumerable: true } ,
		data: { value: null , enumerable: true , writable: true } ,
		remarkableNumbers: { value: {} , enumerable: true , writable: true } ,
	} ) ;
	
	Object.defineProperties( self , {
		n: { value: Math.min( options.n || 13 , self.complexity ) , enumerable: true } ,
	} ) ;
	
	return self ;
} ;



//function isInt( n ) { return Math.trunc( n ) === n ; }



Sacred.prototype.init = function init()
{
	var i , v ;
	
	// Pi: 3.141592...
	this.remarkableNumbers[ math.eround( Math.PI ) ] = {
		name: 'π' ,
		value: Math.PI ,
		canOveride: false ,
		complexity: 3
	} ;
	
	// The golden ratio: 1.618033...
	v = ( 1 + Math.sqrt( 5 ) ) / 2 ;
	this.remarkableNumbers[ math.eround( v ) ] = {
		name: 'φ' ,
		value: v ,
		canOveride: false ,
		complexity: 3
	} ;
	
	// Euler's constant: 2.718281...
	this.remarkableNumbers[ math.eround( Math.E ) ] = {
		name: 'ℇ' ,
		value: Math.E ,
		canOveride: false ,
		complexity: 7
	} ;
	
	// The silver ratio: 2.414213...
	v = 1 + Math.sqrt( 2 ) ;
	this.remarkableNumbers[ math.eround( v ) ] = {
		name: 'δs' ,
		value: v ,
		canOveride: false ,
		complexity: 7
	} ;
	
	// The plastic number, unique real solution of x³=x+1: 1.324717...
	v = Math.pow( ( 9 + Math.sqrt( 69 ) ) / 18 , 1/3 )  +  Math.pow( ( 9 - Math.sqrt( 69 ) ) / 18 , 1/3 )  ;
	this.remarkableNumbers[ math.eround( v ) ] = {
		name: 'ρ' ,
		value: v ,
		canOveride: false ,
		complexity: 11
	} ;
	
	// Another silver number candidate, unique real solution of x³=x²+x+1: 1.839286...
	// Can be used to construct “silver bricks”
	v = ( Math.pow( 19 + 3 * Math.sqrt( 33 ) , 1/3 )  +  Math.pow( 19 - 3 * Math.sqrt( 33 ) , 1/3 )  +  1  ) / 3 ;
	this.remarkableNumbers[ math.eround( v ) ] = {
		name: 'γ' ,
		value: v ,
		canOveride: false ,
		complexity: 11
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
	this.buildMul() ;
	this.buildSum() ;
	this.buildSum() ;
	this.buildFrac() ;
	
	this.finalBuild() ;
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
	var i , old1 = 1 , old2 = 0 , current , complexity ;
	
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
		
		complexity = 2 + Math.pow( rn.complexity , 1.5 ) ;
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
		
		complexity = 3 + Math.pow( rn.complexity , 2 ) ;
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
		
		complexity = 4 + Math.pow( rn.complexity , 2.5 ) ;
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
		
		complexity = 2 + Math.pow( rn.complexity , 1.5 ) ;
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
		
		complexity = 3 + Math.pow( rn.complexity , 2 ) ;
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
		
		complexity = 4 + Math.pow( rn.complexity , 2.5 ) ;
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
				} ;
			}
			else if ( this.remarkableNumbers[ k ].complexity > complexity )
			{
				this.remarkableNumbers[ k ].complexity = complexity ;
			}
		}
	} ) ;
} ;



// Create sum with all current values
Sacred.prototype.buildMul = function buildMul()
{
	return this.buildComposed( {
		title: "Mul" ,
		complexityFn: ( a , b ) => 1 + ( a * b ) ,
		notEq: true ,
		notZero: true ,
		notOne: true ,
		commutative: true ,
		joint: '×' ,
		valueFn: ( a , b ) => a * b
	} ) ;
} ;



// Create sum with all current values
Sacred.prototype.buildSum = function buildSum()
{
	return this.buildComposed( {
		title: "Sum" ,
		complexityFn: ( a , b ) => 1 + ( a + b ) * 2 ,
		notEq: true ,
		notZero: true ,
		commutative: true ,
		joint: '+' ,
		valueFn: ( a , b ) => a + b
	} ) ;
} ;



// Create fraction with all current values
Sacred.prototype.buildFrac = function buildFrac()
{
	return this.buildComposed( {
		title: "Frac" ,
		complexityFn: ( a , b ) => 1 + ( a + b ) * 2 ,
		notEq: true ,
		notZero: true ,
		rightIsNotOne: true ,
		rightIsGreater: this.ratioMode ,
		commutative: false ,
		joint: '/' ,
		valueFn: ( a , b ) => a / b
	} ) ;
} ;



// Create fraction with all current values
Sacred.prototype.buildComposed = function buildComposed( params )
{
	var keys , length , i , j ,
		rn1 , rn2 , v1 , v2 ,
		name , k , v , complexity ,
		total , count = 0 , milestoneEvery = 50000 , nextMilestone = 0 ;
	
	keys = Object.keys( this.remarkableNumbers ) ;
	
	//total = keys.length * keys.length ;
	//console.log( "Total: " , total ) ;
	
	// Pre-filtering out some keys
	keys = keys.filter( k1 => params.complexityFn( this.remarkableNumbers[ k1 ].complexity , 1 ) <= this.complexity ) ;
	length = keys.length ;
	
	total = length * length ;
	if ( params.commutative ) { total = total / 2 ; }
	this.emit( 'progress' , 'Init numbers: ' + params.title + ' (' + total + ')' ) ;
	
	for ( i = 0 ; i < length ; i ++ )
	{
		
		//console.log( "Done: " + math.round( 100 * count / total , 0.1 ) + '% of ' + total ) ;
		if ( count >= nextMilestone )
		{
			this.emit( 'progressUpdate' , count / total ) ;
			nextMilestone = count + milestoneEvery ;
		}
		
		rn1 = this.remarkableNumbers[ keys[ i ] ] ;
		v1 = rn1.value ;
		
		for ( j = params.commutative ? i : 0 ; j < length ; j ++ )
		{
			count ++ ;
			
			rn2 = this.remarkableNumbers[ keys[ j ] ] ;
			v2 = rn2.value ;
			
			complexity = params.complexityFn( rn1.complexity , rn2.complexity ) ;
			
			if (
				( complexity > this.complexity ) ||
				( params.notEq && v1 === v2 ) ||
				( params.notZero && ( v1 === 0 || v2 === 0 ) ) ||
				( params.notOne && ( v1 === 1 || v2 === 1 ) ) ||
				( params.rightIsNotOne && v2 === 1 ) ||
				( params.rightIsGreater && v1 >= v2 )
			)
			{
				continue ;
			}
			
			name = rn1.name + params.joint + rn2.name ;
			
			v = params.valueFn( v1 , v2 ) ;
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
		}
	}
	
	this.emit( 'progressUpdate' , 1 ) ;
} ;



Sacred.prototype.finalBuild = function finalBuild()
{
	var k , obj ;
	
	// Array are faster to iterate, but object are better to find out if something is already stored.
	// Now that numbers are built, we can turn the object into an array.
	
	obj = this.remarkableNumbers ;
	this.remarkableNumbers = [] ;
	
	this.emit( 'progress' , 'Init numbers: ' ) ;
	this.emit( 'progressUpdate' , 'Init numbers: build array' , 0 ) ;
	
	for ( k in obj )
	{
		if (
			( this.ratioMode && obj[ k ].value > 1 )
		)
		{
			continue ;
		}
		
		//obj[ k ].complexityFactor = 1 + 4 * Math.pow( ( obj[ k ].complexity - 1 ) / 10 , 2 ) ;
		obj[ k ].complexityFactor = Math.max( 1 , Math.pow( 2.5 , ( obj[ k ].complexity - 10 ) / 10 ) ) ;
		this.remarkableNumbers.push( obj[ k ] ) ;
	}
	
	this.emit( 'progressUpdate' , 'Init numbers: sort (' + this.remarkableNumbers.length + ')' , 0.6 ) ;
	
	this.remarkableNumbers.sort( ( a , b ) => a.value - b.value ) ;
	
	this.emit( 'progressUpdate' , 1 ) ;
} ;



Sacred.prototype.checkNumber = function checkNumber( number )
{
	var i , iMax , rn , matches = [] , delta , relevance ;
	
	number = Math.abs( number ) ;
	
	for ( i = 0 , iMax = this.remarkableNumbers.length ; i < iMax ; i ++ )
	{
		rn = this.remarkableNumbers[ i ] ;
		
		if ( number >= rn.value )
		{
			delta = ( number - rn.value ) / rn.value ;
		}
		else
		{
			delta = ( rn.value - number ) / number ;
		}
		
		if ( delta > this.delta ) { continue ; }
		
		relevance = Math.log2( this.delta / ( delta * rn.complexityFactor ) ) ;
		
		if ( relevance < 0 ) { continue ; }
		
		matches.push( {
			name: rn.name ,
			value: number ,
			remarkableValue: rn.value ,
			remarkableComplexity: rn.complexity ,
			delta: delta ,
			relevance: relevance ,
			complexityFactor: rn.complexityFactor
		} ) ;
	}
	
	matches.sort( ( a , b ) => b.relevance - a.relevance ) ;
	
	return matches ;
} ;



// Find all properties
Sacred.prototype.findProperties = function findProperties()
{
	var keys , properties = {} ;
	
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
	var keys , matches , m , objectCount ,
		i , key ,
		total , count = 0 , milestoneEvery = 4 , nextMilestone = 0 ;
	
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
	
	objectCount = keys.length ;
	total = properties.length * objectCount ;
	
	this.emit( 'progress' , 'Compute (' + total + ')' ) ;
	
	properties.forEach( property => {
		
		this.emit( 'progressUpdate' , 'Compute ' + property + ' (' + total + ')' , count / total ) ;
		
		for ( i = 0 ; i < objectCount ; i ++ )
		{
			key = keys[ i ] ;
			
			if ( count >= nextMilestone )
			{
				this.emit( 'progressUpdate' , count / total ) ;
				nextMilestone = count + milestoneEvery ;
			}
			
			count ++ ;
			
			if ( typeof this.data[ key ][ property ] !== 'number' ) { continue ; }
			
			m = this.checkNumber( this.data[ key ][ property ] ) ;
			
			if ( m.length )
			{
				if ( ! matches[ property ] ) { matches[ property ] = {} ; }
				matches[ property ][ key ] = m ;
			}
		}
	} ) ;
	
	return matches ;
} ;



// Check if the ratio of two object's property matches something
Sacred.prototype.checkPropertyRatio = function checkPropertyRatio( properties )
{
	var keys , matches , m , objectCount ,
		i , j , k1 , k2 , matchName ,
		total , count = 0 , milestoneEvery = 10 , nextMilestone = 0 ;
	
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
	
	objectCount = keys.length ;
	total = properties.length * objectCount * ( objectCount - 1 ) / 2 ;
	
	this.emit( 'progress' , 'Compute (' + total + ')' ) ;
	
	properties.forEach( property => {
		
		//console.log( "Computing property: " + property + "..." ) ;
		this.emit( 'progressUpdate' , 'Compute ' + property + ' (' + total + ')' , count / total ) ;
		
		for ( i = 0 ; i < objectCount ; i ++ )
		{
			k1 = keys[ i ] ;
			
			if ( typeof this.data[ k1 ][ property ] !== 'number' )
			{
				count += objectCount - i - 1 ;
				continue ;
			}
			
			for ( j = i + 1 ; j < objectCount ; j ++ )
			{
				if ( count >= nextMilestone )
				{
					this.emit( 'progressUpdate' , count / total ) ;
					nextMilestone = count + milestoneEvery ;
				}
				
				count ++ ;
				
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
	
	this.emit( 'progressUpdate' , 1 ) ;
	
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



