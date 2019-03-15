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



exports.fibonacci = function *() {
	var newN = 1 , lastN = 0 , lastLastN = 0 ;

	for ( ;; ) {
		lastLastN = lastN ;
		lastN = newN ;
		newN = lastN + lastLastN ;
		yield newN ;
	}
} ;



exports.triangulaire = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ++ ;
		yield n ;
	}
} ;



exports.carre = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 2 ;
		yield n ;
	}
} ;



exports.pentagonal = function *() {
	var n = 0 , v = 1 ;

	for ( ;; ) {
		n += v ;
		v += 3 ;
		yield n ;
	}
} ;



exports.tetrahedrique = function *() {
	var n = 0 , v = exports.triangulaire() ;

	for ( ;; ) {
		n += v.next().value ;
		yield n ;
	}
} ;



exports.hexagonalCentre = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 6 ;
		yield n ;
	}
} ;



exports.cubique = function *() {
	var n = 1 ;

	for ( ;; ) {
		yield n * n * n ;
		n ++ ;
	}
} ;



exports.etoile = function *() {
	var n = 1 , v = 0 ;

	for ( ;; ) {
		n += v ;
		v += 12 ;
		yield n ;
	}
} ;

