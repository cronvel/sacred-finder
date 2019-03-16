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



const term = require( 'terminal-kit' ).terminal ;
const string = require( 'string-kit' ) ;
const Sacred = require( './Sacred.js' ) ;

const sacredPackage = require( '../package.json' ) ;
const cliManager = require( 'utterminal' ).cli ;



function cli() {
	/* eslint-disable indent */
	var args = cliManager.package( sacredPackage )
		.app( 'Sacred Finder' )
		.introIfTTY
		.helpOption
		.camel
		.description( "Sacred Finder is used to search for mysterious correlations." )

		/* Bug in utterminal with option aliases outside the command
		.opt( [ 'property' , 'p' ] , null ).string
			.description( "Match only on this property" )
		.opt( [ 'multiple' , 'm' ] , 10 ).number
			.description( "Allow usage of multiple on remarkable numbers" )
		.opt( [ 'complexity' , 'c' ] , 100 ).number
			.description( "Remarkable numbers maximum allowed complexity" )
		.opt( [ 'delta' , 'd' ] , 0.01 ).number
			.description( "Maximum correlation delta rate" )
		.opt( [ 'n' ] , 13 ).number
			.description( "Maximum numbers to take from each suite of numbers" )
		*/

		.command( 'match' )
			.description( "Match single values" )
			.arg( 'config-path' ).string.required
				.typeLabel( 'path' )
				.description( "The config to load, it must be a .json or a .kfg" )
			.opt( [ 'property' , 'p' ] , null ).string
				.description( "Match only on this property" )
			.opt( [ 'multiple' , 'm' ] , 10 ).number
				.description( "Allow usage of multiple on remarkable numbers" )
			.opt( [ 'complexity' , 'c' ] , 100 ).number
				.description( "Remarkable numbers maximum allowed complexity" )
			.opt( [ 'delta' , 'd' ] , 0.01 ).number
				.description( "Maximum correlation delta rate" )
			.opt( [ 'n' ] , 13 ).number
				.description( "Maximum numbers to take from each suite of numbers" )

		.command( 'ratio' )
			.description( "Match ratio values" )
			.arg( 'config-path' ).string.required
				.typeLabel( 'path' )
				.description( "The config to load, it must be a .json or a .kfg" )
			.opt( [ 'property' , 'p' ] , null ).string
				.description( "Match only on this property" )
			.opt( [ 'multiple' , 'm' ] , 10 ).number
				.description( "Allow usage of multiple on remarkable numbers" )
			.opt( [ 'complexity' , 'c' ] , 100 ).number
				.description( "Remarkable numbers maximum allowed complexity" )
			.opt( [ 'delta' , 'd' ] , 0.01 ).number
				.description( "Maximum correlation delta rate" )
			.opt( [ 'n' ] , 13 ).number
				.description( "Maximum numbers to take from each suite of numbers" )

		.command( 'serie' )
			.description( "Display a serie" )
			.arg( 'serie' ).string.required
				.typeLabel( 'serie-name' )
				.description( "The serie name" )
			.arg( 'count' , 10 ).number
				.typeLabel( 'iteration' )
				.description( "The number of iteration" )
			.opt( [ 'rank' , 'r' ] ).flag
				.description( "Display the rank of the number" )

		.command( 'integer' )
			.description( "Display the properties of an integer" )
			.arg( 'integer' ).integer
				.typeLabel( 'integer' )
				.description( "The integer to check" )

		.details( "Any extra option will override the config.\n" )
		.run() ;
	/* eslint-enable indent */

	switch ( args.command ) {
		case 'serie' :
			serie( args ) ;
			return ;
		case 'integer' :
			integer( args ) ;
			return ;
	}

	if ( ! args.configPath ) {
		cliManager.displayHelp() ;
		return ;
	}

	// optimize
	if ( args.command === 'ratio' ) { args.ratioMode = true ; }

	var sacred = new Sacred( args ) ;

	sacred.on( 'progress' , onProgress ) ;
	sacred.on( 'progressUpdate' , onProgressUpdate ) ;

	//term( 'Initing sacred numbers...\n' ) ;
	sacred.init() ;
	term.column.eraseLineAfter( 1 , "^Y%i^ ^Cremarkable numbers\n" , sacred.remarkableNumbers.length ) ;

	var report ;

	term.column( 1 , 'Loading data...' ) ;
	sacred.load( args.configPath ) ;

	term.column( 1 , 'Searching correlations...' ) ;

	switch ( args.command ) {
		case 'match' :
			report = sacred.checkProperty( args.property ) ;
			break ;

		case 'ratio' :
			report = sacred.checkPropertyRatio( args.property ) ;
			break ;
	}

	term.bold.underline( '\n\n\nCorrelations:\n\n' ) ;
	sacred.displayReport( report ) ;

	term.styleReset() ;
	term( '\n' ) ;
}

module.exports = cli ;



var progressBar = null ;



function onProgress( title ) {
	term.column( 1 ) ;
	title = string.resize( title , 30 ) ;

	progressBar = term.progressBar( {
		syncMode: true ,
		//width: term.width ,
		width: Math.min( 120 , term.width ) ,
		title: title ,
		eta: true ,
		percent: true
	} ) ;
}



function onProgressUpdate( ... args ) {
	switch ( args.length ) {
		case 1 :
			progressBar.update( args[ 0 ] ) ;
			break ;
		case 2 :
			progressBar.update( { title: args[ 0 ] , progress: args[ 1 ] } ) ;
			break ;
	}
}



function serie( args ) {
	const series = require( './series.js' ) ;
	
	var serieName = string.toCamelCase( args.serie ) ;

	if ( ! series[ serieName ] ) {
		term.red( "Unknown serie '%s'\n" , serieName ) ;
		term( "Available series are: %s\n" , Object.keys( series ) ) ;
		process.exit( 1 ) ;
	}

	var value , count = 0 ;

	for ( value of series[ serieName ]() ) {
		if ( args.rank ) { term( "#%i " , count + 1 ) ; }
		term( "%s\n" , value ) ;
		if ( ++ count > args.count ) { break ; }
	}

	term.styleReset() ;
	term( '\n' ) ;
}



function integer( args ) {
	const intprop = require( './integerProperties.js' ) ;
	
	var divisors = intprop.divisors( args.integer ) ;
	term( "Divisors: %s\n" , divisors.length ? divisors : 'none' ) ;
	
	var series = intprop.series( args.integer ) ;
	term( "Series: %s\n" , series.length ? series : 'none' ) ;
	
	term.styleReset() ;
	term( '\n' ) ;
}

