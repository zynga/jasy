/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010 Sebastian Werner
==================================================================================================
*/

function declare(namespace, object)
{
  var splits = namespace.split(".");
  var current = this;
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
}
