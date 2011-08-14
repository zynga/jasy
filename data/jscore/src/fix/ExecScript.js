/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Via: http://perfectionkills.com/global-eval-what-are-the-options/
==================================================================================================
*/

/**
 * Contains a method for executing aribritary script content in global context.
 * See also: http://msdn.microsoft.com/en-us/library/ms536420(v=vs.85).aspx
 */
(function(global) 
{
	// if indirect eval executes code globally, use it
	if ((function() 
	{
		eval("var Object=1");

		try 
		{
			// Does `Object` resolve to a local variable, or to a global, built-in `Object`, 
			// reference to which we passed as a first argument?
			return global.eval('Object') === global.Object;
		}
		catch(err) 
		{
			// if indirect eval errors out (as allowed per ES3), then just bail out with `false`

			// wpbasti: not needed as it is just check for being falsy and so "undefined" is OK
			// return false;
		}
	})())
	{
		global.execScript = function(expression) 
		{
			global.eval(expression);
			
			// Always returns null according to msdn docs
			return null;
		};
	};

	// otherwise, execScript is `undefined` since nothing is returned
})(this);