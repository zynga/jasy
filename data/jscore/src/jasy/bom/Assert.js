/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

jasy.Test.add(function(value) { 
	return value && value.nodeType != undef; 
}, "isNode", "Not a node!");

jasy.Test.add(function(value) { 
	return value && value.nodeType == 1; 
}, "isElement", "Not an element!");

jasy.Test.add(function(value) { 
	return value && value.nodeType == 3; 
}, "isTextNode", "Not a text node!");

jasy.Test.add(function(value) { 
	return value && value.nodeType == 9; 
}, "isDocument", "Not a document!");
