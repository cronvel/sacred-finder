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



const math = require( 'math-kit' ) ;

const series = {} ;
module.exports = series ;



const SQRT_5 = Math.sqrt( 5 ) ;
const PHI = ( 1 + SQRT_5 ) / 2 ;
const PHI_PRIME = ( 1 - SQRT_5 ) / 2 ;



// 1 is deduped, so the serie start 1 2 3 5 8 instead of 1 1 2 3 5
series.fibonacci = function *() {
	var newN = 1 , lastN = 0 , lastLastN = 0 ;

	for ( ;; ) {
		lastLastN = lastN ;
		lastN = newN ;
		newN = lastN + lastLastN ;
		yield newN ;
	}
} ;

series.fibonacci.nth = n => math.eround(  ( Math.pow( PHI , n + 1 ) - Math.pow( PHI_PRIME , n + 1 ) ) / SQRT_5  ) ;



series.primordial = function *() {
	var i , found ,
		n = 1 ,
		list = [] ;

	yield n ;
	
	for ( ;; ) {
		n ++ ;
		found = false ;
		
		for ( i = 0 ; i < list.length ; i ++ ) {
			if ( n % list[ i ] === 0 ) {
				found = true ;
				break ;
			}
		}
		
		if ( ! found ) {
			list.push( n ) ;
			yield n ;
		}
	}
} ;



// 2D numbers



series.triangulaire = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ++ ;
		yield n ;
	}
} ;

series.triangulaire.nth = n => n * ( n + 1 ) / 2 ;



series.triangulaireCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 3 ;
		yield n ;
	}
} ;

series.triangulaireCentre.nth = n => 1 + 3 * n * ( n - 1 ) / 2 ;



series.carre = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 2 ;
		yield n ;
	}
} ;

series.carre.nth = n => n * n ;



series.carreCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 4 ;
		yield n ;
	}
} ;

series.carreCentre.nth = n => 1 + 4 * n * ( n - 1 ) / 2 ;



series.pentagonal = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 3 ;
		yield n ;
	}
} ;

series.pentagonal.nth = n => n * ( 3 * n - 1 ) / 2 ;



series.pentagonalCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 5 ;
		yield n ;
	}
} ;

series.pentagonalCentre.nth = n => 1 + 5 * n * ( n - 1 ) / 2 ;



series.hexagonal = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 4 ;
		yield n ;
	}
} ;

series.hexagonal.nth = n => n * ( 2 * n - 1 ) ;



series.hexagonalCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 6 ;
		yield n ;
	}
} ;

series.hexagonalCentre.nth = n => 1 + 6 * n * ( n - 1 ) / 2 ;



series.heptagonal = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 5 ;
		yield n ;
	}
} ;

series.heptagonal.nth = n => n * ( 5 * n - 3 ) / 2 ;



series.heptagonalCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 7 ;
		yield n ;
	}
} ;

series.heptagonalCentre.nth = n => 1 + 7 * n * ( n - 1 ) / 2 ;



series.octogonal = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 6 ;
		yield n ;
	}
} ;

series.octogonal.nth = n => n * ( 3 * n - 2 ) ;



series.octogonalCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 8 ;
		yield n ;
	}
} ;

series.octogonalCentre.nth = n => 1 + 8 * n * ( n - 1 ) / 2 ;



series.enneagonal = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 7 ;
		yield n ;
	}
} ;

series.enneagonal.nth = n => ( 7 * n * n - 5 * n ) / 2 ;



series.enneagonalCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 9 ;
		yield n ;
	}
} ;

series.enneagonalCentre.nth = n => 1 + 9 * n * ( n - 1 ) / 2 ;



series.decagonal = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 8 ;
		yield n ;
	}
} ;

series.decagonal.nth = n => 4 * n * n - 3 * n ;



series.decagonalCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 10 ;
		yield n ;
	}
} ;

series.decagonalCentre.nth = n => 1 + 10 * n * ( n - 1 ) / 2 ;



series.dodecagonal = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 10 ;
		yield n ;
	}
} ;

series.dodecagonal.nth = n => 5 * n * n - 4 * n ;



series.dodecagonalCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 12 ;
		yield n ;
	}
} ;

series.dodecagonalCentre.nth = n => 1 + 12 * n * ( n - 1 ) / 2 ;



// 2D star numbers



series.etoile = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 12 ;
		yield n ;
	}
} ;

series.etoile.nth = n => 1 + 6 * n * ( n - 1 ) ;



// 3D numbers



series.tetrahedrique = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.tetrahedrique.nth( n ++ ) ;
	}
} ;

series.tetrahedrique.nth = n => n * ( n + 1 ) * ( n + 2 ) / 6 ;



series.tetrahedriqueCentre = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.tetrahedriqueCentre.nth( n ++ ) ;
	}
} ;

series.tetrahedriqueCentre.nth = n => { n -- ; return ( 2 * n + 1 ) * ( n * n + n + 3 ) / 3 ; } ;



series.cubique = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.cubique.nth( n ++ ) ;
	}
} ;

series.cubique.nth = n => n * n * n ;



series.cubiqueCentre = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.cubiqueCentre.nth( n ++ ) ;
	}
} ;

series.cubiqueCentre.nth = n => { n -- ; return n * n * n + ( n + 1 ) * ( n + 1 ) * ( n + 1 ) ; } ;


series.octahedrique = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.octahedrique.nth( n ++ ) ;
	}
} ;

series.octahedrique.nth = n => n * ( 2 * n * n  + 1 ) / 3 ;



series.octahedriqueCentre = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.octahedriqueCentre.nth( n ++ ) ;
	}
} ;

series.octahedriqueCentre.nth = n => { n -- ; return ( 2 * n + 1 ) * ( 2 * n * n + 2 * n + 3 ) / 3 ; } ;



series.dodecahedrique = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.dodecahedrique.nth( n ++ ) ;
	}
} ;

series.dodecahedrique.nth = n => n * ( 3 * n - 1 ) * ( 3 * n - 2 ) / 2 ;



series.dodecahedriqueCentre = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.dodecahedriqueCentre.nth( n ++ ) ;
	}
} ;

series.dodecahedriqueCentre.nth = n => { n -- ; return ( 2 * n + 1 ) * ( 5 * n * n + 5 * n + 1 ) ; } ;



series.icosahedrique = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.icosahedrique.nth( n ++ ) ;
	}
} ;

series.icosahedrique.nth = n => n * ( 5 * n * n - 5 * n + 2 ) / 2 ;



series.icosahedriqueCentre = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.icosahedriqueCentre.nth( n ++ ) ;
	}
} ;

series.icosahedriqueCentre.nth = n => { n -- ; return ( 2 * n + 1 ) * ( 5 * n * n + 5 * n + 3 ) / 3 ; } ;



series.pyramidal = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.pyramidal.nth( n ++ ) ;
	}
} ;

series.pyramidal.nth = n => n * ( n + 1 ) * ( 2 * n + 1 ) / 6 ;



series.hexapyramidal = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield series.hexapyramidal.nth( n ++ ) ;
	}
} ;

series.hexapyramidal.nth = n => n * ( n + 1 ) * ( 4 * n - 1 ) / 6 ;



