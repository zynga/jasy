/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010 Sebastian Werner
==================================================================================================
*/

(function(global)
{
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

    getByName : getByName
  });
})(this);
