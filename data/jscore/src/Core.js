/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010 Sebastian Werner
==================================================================================================
*/

(function(global)
{
  // Block duplicate initialization
  if (global.Core) {
    return;
  }
  
  
  // ==================================================================
  //   METHODS :: DECLARE
  // ==================================================================
  
  var declare = function(namespace, object)
  {
    var splits = namespace.split(".");
    var current = global;
    var length = splits.length-1;
    var i = 0;
    var test;

    // Fast-check for existing segments
    while(test=current[splits[i]]) {
      current = test;
      i++;
    }

    // Create missing segments
    while(i<length) {
      current = current[splits[i++]] = {};
    }

    // Store Object
    return current[splits[i]] = object;
  };
  
  
  var getByName = function(name)
  {
    var splitted = name.split(".");
    var current = global;
    
    for (var i=0, l=splitted.length; i<l; i++) 
    {
      current = current[splitted[i]];
      if (!current) {
        throw new Error("Unknown name: " + name);
      }
    }
    
    return current;
  };
  
  
  
  // ==================================================================
  //   METHODS :: GLOBAL EVAL
  // ==================================================================
  
  var globalEval = (function() 
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
  


  // ========================================================================================
  // Finally create namespace
  // ========================================================================================

  declare("Core",
  {
    /**
     * Declares the given namespace and stores the given object onto it.
     *
     * @param namespace {String} Namespace/Package e.g. foo.bar.baz
     * @param object {Object} Any object
     */
    declare : declare,

    getByName : getByName,


    /**
     * Executes the given code in global context
     *
     * Via:
     * http://perfectionkills.com/global-eval-what-are-the-options/#feature_testing_based_approach
     *
     * @param expression {String} Code to execute
     * @return {var} Return value of executed code
     */
    globalEval : globalEval
  });
})(this);
