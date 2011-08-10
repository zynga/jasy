/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

// Fix for missing document.head
if (!document.head) {
	document.head = document.getElementsByTagName('head')[0];
}
