/* 
==================================================================================================
	Jasy - JavaScript Tooling Refined
	Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/** 
 * Cross-browser-compatible setZeroTimeout
 *
 * I took the original setZeroTimeout and made it cross-browser-compatible, using setTimeout(fn, 0) as a fallback in case postMessage is not supported.
 * Mathias Bynens <http://mathiasbynens.be/>
 * See <http://mathiasbynens.be/notes/settimeout-onload>
 *
 * Copyright statement below:
 *
 * See <http://dbaron.org/log/20100309-faster-timeouts>
 * By L. David Baron <dbaron@dbaron.org>, 2010-03-07, 2010-03-09
 * Released under the following license:
 *
 * Copyright (c) 2010, The Mozilla Foundation
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * - Redistributions of source code must retain the above copyright
 * - notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright
 * - notice, this list of conditions and the following disclaimer in
 * - the documentation and/or other materials provided with the
 * - distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/**
 * Like setTimeout, but only takes a function argument. There's
 * no time argument (always zero) and no arguments (you have to
 * use a closure).
 *
 * @param fn {Function} Function to execute with zero timeout
 */
this.setZeroTimeout = (function(global) 
{
	if (global.postMessage && global.addEventListener) 
	{
		var timeouts = [];
		var messageName = "zero-timeout";
		
		global.addEventListener("message", function(event) 
		{
			if (event.source == global && event.data == messageName) 
			{
				event.stopPropagation();
				if (timeouts.length) {
					timeouts.shift()();
				}
			}
		}, true);
		
		return function(fn) 
		{
			timeouts.push(fn);
			postMessage(messageName, "*");
		};
	}
	else
	{
		return function(fn) {
			setTimeout(fn, 0);
		};
	}
}(this));
