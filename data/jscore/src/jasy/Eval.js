/**
 * Contains a method for executing aribritary script content in global context
 */
Core.declare("jasy.Eval",
{
  /**
   * Executes the given code in global context
   *
   * Via:
   * http://perfectionkills.com/global-eval-what-are-the-options/#feature_testing_based_approach
   *
   * @param expression {String} Code to execute
   * @return {var} Return value of executed code
   */  
  global : (function() 
  {
    var isIndirectEvalGlobal = (function() 
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
    })();

    if (isIndirectEvalGlobal) 
    {
      // if indirect eval executes code globally, use it
      return function(expression) {
        return global.eval(expression);
      };
    }
    else if (global.execScript != null) 
    {
      // if `window.execScript exists`, use it
      return function(expression) {
        return global.execScript(expression);
      };
    }

    // otherwise, globalEval is `undefined` since nothing is returned
  })();
})