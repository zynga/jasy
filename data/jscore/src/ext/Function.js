/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

if (!Function.isFunction) {
	(function(toString){
		/**
		 * Whether the given value is a function.
		 *
		 * @signature function(value)
		 * @param value {var} Value to test
		 * @return {Boolean} Whether the given value is a function
		 */
		Function.isFunction = function(value) {
			return value != null && toString.call(value) == "[object Function]";
		}
	})(Object.prototype.toString);
}



if (!Function.prototype.bind) {
	
	/**
	 * Binds the given function to the specific context.
	 *
	 * Coypright WebReflection - Mit Style License
	 *
	 * @param context {Object} Object to bind function to.
	 * @return {Function} Returns a new function which is bound to the given object.
	 */
	Function.prototype.bind = function bind(context) {
		var self = this; // "trapped" function reference

		// only if there is more than an argument
		// we are interested into more complex operations
		// this will speed up common bind creation
		// avoiding useless slices over arguments
		if (1 < arguments.length) {
			// extra arguments to send by default
			var extraargs = Array.prototype.slice.call(arguments, 1);
			return function () {
				return self.apply(
					context,
					// thanks @kangax for this suggestion
					arguments.length ?
						// concat arguments with those received
						extraargs.concat(Array.prototype.slice.call(arguments)) :
						// send just arguments, no concat, no slice
						extraargs
				);
			};
		}
		
		// optimized callback
		return function () {
			// speed up when function is called without arguments
			return arguments.length ? self.apply(context, arguments) : self.call(context);
		};
	};
}

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
Function.prototype.debounce = function(threshold, execAsap) {
	var func = this;
	var timeout;
 
	return function debounced() {
		var obj = this, args = arguments;
		function delayed() {
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
};

