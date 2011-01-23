/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010 Sebastian Werner
==================================================================================================
*/

(function(global)
{
  var cache = {};
  
  // Define Core initially in a primitive way to have same signature like
  // all following modules/classes.
  var Core = 
  {
    declare : function(namespace, object)
    {
      var splits = namespace.split(".");
      var current = global;
      var length = splits.length-1;
      var i = 0;
      var test;
  
      // Fast-check for existing segments
      while(test=current[splits[i]]) 
      {
        current = test;
        i++;
      }
  
      // Create missing segments
      while(i<length) {
        current = current[splits[i++]] = {};
      }
  
      // Store Object
      return cache[namespace] = current[splits[i]] = object;
    }
  };
  
  // Finally declare the real class
  Core.declare("Core",
  {
    /**
     * Declares the given namespace and stores the given object onto it.
     *
     * @param namespace {String} Namespace/Package e.g. foo.bar.baz
     * @param object {Object} Any object
     */
    declare : Core.declare,


    /**
     * Resolves a given namespace into the already existing object/class.
     *
     * @param namespace {String} Name to resolve
     */
    resolve : function(namespace)
    {
      var current = cache[namespace];
      if (!current)
      {
        current = global;
        if (namespace)
        {
          var splitted = namespace.split(".");
          for (var i=0, l=splitted.length; i<l; i++) 
          {
            current = current[splitted[i]];
            if (!current) 
            {
              current = null;
              break;
            }
          }
        }
      }
    
      return current;
    }
  });
})(this);
