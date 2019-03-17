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



const series = require( './series.js' ) ;



const intprop = {} ;
module.exports = intprop ;



intprop.divisors = n => {
	var i , div ,
		max = Math.sqrt( n ) ,
		list = [] ;

	for ( div = 2 ; div <= max ; div ++ ) {
		if ( n % div === 0 ) { list.push( div ) ; }
	}

	for ( i = list.length - 1 ; i >= 0 ; i -- ) {
		div = n / list[ i ] ;
		if ( div !== list[ i ] ) { list.push( div ) ; }
	}

	return list ;
} ;



intprop.series = n => {
	var serie , v ,
		list = [] ;

	for ( serie in series ) {
		for ( v of series[ serie ]() ) {
			if ( v >= n ) {
				if ( v === n ) { list.push( serie ) ; }
				break ;
			}
		}
	}

	return list ;
} ;

