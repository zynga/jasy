/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

Object.addPrototypeMethods("Function", 
{
	/**
	 * Debounces the given method.
	 *
	 * Debouncing ensures that exactly one signal is sent for an event that may be happening 
	 * several times — or even several hundreds of times over an extended period. As long as 
	 * the events are occurring fast enough to happen at least once in every detection 
	 * period, the signal will not be sent!
	 *
	 * Via: http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	 *
	 * @param threshold {Integer} Number of milliseconds of distance required before reacting/resetting.
	 * @param execAsap {Boolean?false} Whether the execution should happen at begin.
	 * @return {Function} Debounced method
	 */
	debounce : function(threshold, execAsap) 
	{
		var func = this;
		var timeout;
 
		return function debounced() 
		{
			var obj = this, args = arguments;
			function delayed() 
			{
				if (!execAsap) {
					func.apply(obj, args);
				}
			
				timeout = null; 
			};
 
			if (timeout){
				clearTimeout(timeout); 
			} else if (execAsap) {
				func.apply(obj, args);
			}
 
			timeout = setTimeout(delayed, threshold || 100); 
		};
	}
});

