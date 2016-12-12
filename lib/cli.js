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



var term = require( 'terminal-kit' ).terminal ;
var sacredPackage = require( '../package.json' ) ;
var Sacred = require( './Sacred.js' ) ;



function cli()
{
	var file , method , property ;
	
	// Intro
	term.bold.magenta( 'Sacred Finder' ).dim( ' v%s by Cédric Ronvel\n\n' , sacredPackage.version ) ;
	
	// Manage command line arguments
	var args = require( 'minimist' )( process.argv.slice( 2 ) ) ;
	
	/*
	if ( args.h || args.help )
	{
		cli.usage( false , type ) ;
		return cli.exit( 0 ) ;
	}
	*/
	
	file = args._[ 0 ] ;
	
	switch ( args._.length )
	{
		case 2 :
			method = 'one' ;
			property = args._[ 1 ] ;
			break ;
		case 3 :
			method = args._[ 1 ] ;
			property = args._[ 2 ] ;
			break ;
		default :
			throw new Error( 'Bad number of argument' ) ;
	}
	
	var sacred = Sacred.create( args ) ;
	var report ;
	
	sacred.load( file ) ;
	
	switch ( method )
	{
		case 'one' :
			report = sacred.checkProperty( property ) ;
			break ;
		
		case 'ratio' :
			report = sacred.checkPropertyRatio( property ) ;
			break ;
	}
	
	sacred.displayReport( report ) ;
	
	term.styleReset() ;
	term( '\n' ) ;
}
	
module.exports = cli ;


