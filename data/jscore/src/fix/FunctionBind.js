/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of Andrea Giammarchi
  Vice-Versa Project: http://code.google.com/p/vice-versa/
  http://webreflection.blogspot.com/2010/02/functionprototypebind.html
  MIT LICENSE
==================================================================================================
*/

(function(proto, slice)
{
	if (!proto.bind)
	{
		/**
		 * Binds the given function to the specific context.
		 *
		 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
		 *
		 * @param context {Object} Object to bind function to.
		 * @param varargs {var} Static arguments
		 * @return {Function} Returns a new function which is bound to the given object.
		 */
		proto.bind = function(context) 
		{
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			if (typeof this !== "function") {
				throw new TypeError();
			}
			
			// "trapped" function reference
			var self = this;

			// only if there is more than an argument
			// we are interested into more complex operations
			// this will speed up common bind creation
			// avoiding useless slices over arguments
			if (1 < arguments.length) 
			{
				// extra arguments to send by default
				var args = arguments;
				var extraargs = slice.call(args, 1);
				return function()
				{
					return self.apply(
						context,
						// thanks @kangax for this suggestion
						args.length ?
							// concat arguments with those received
							extraargs.concat(slice.call(args)) :
							// send just arguments, no concat, no slice
							extraargs
					);
				};
			}
			else
			{
				// optimized callback
				return function() 
				{
					// speed up when function is called without arguments
					return arguments.length ? self.apply(context, arguments) : self.call(context);
				};
			}
		};
	}	
})(Function.prototype, Array.prototype.slice);
