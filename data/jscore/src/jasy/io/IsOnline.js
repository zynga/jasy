/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by: http://remysharp.com/2011/04/19/broken-offline-support/
==================================================================================================
*/

// 

function isOnline() {

	// IE vs. standard XHR creation

	var x = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" ),

			s;

	x.open(

		// requesting the headers is faster, and just enough

		"HEAD",

		// append a random string to the current hostname,

		// to make sure we're not hitting the cache

		"//" + window.location.hostname + "/?rand=" + Math.random(),

		// make a synchronous request

		false

	);

	try {

		x.send();

		s = x.status;

		// Make sure the server is reachable

		return ( s >= 200 && s < 300 || s === 304 );

	// catch network & other problems

	} catch (e) {

		return false;

	}

}