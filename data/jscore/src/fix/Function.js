/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

if (!Function.prototype.bind) 
{
	/**
	 * Binds the given function to the specific context.
	 *
	 * Coypright WebReflection - Mit Style License
	 *
	 * @param context {Object} Object to bind function to.
	 * @return {Function} Returns a new function which is bound to the given object.
	 */
	Function.prototype.bind = function bind(context) 
	{
		var self = this; // "trapped" function reference

		// only if there is more than an argument
		// we are interested into more complex operations
		// this will speed up common bind creation
		// avoiding useless slices over arguments
		if (1 < arguments.length) 
		{
			// extra arguments to send by default
			var extraargs = Array.prototype.slice.call(arguments, 1);
			return function()
			{
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
		return function() 
		{
			// speed up when function is called without arguments
			return arguments.length ? self.apply(context, arguments) : self.call(context);
		};
	};
}
