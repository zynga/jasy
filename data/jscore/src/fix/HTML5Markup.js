/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework 
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on Remy Sharp's HTML5 Enabling Script:
  http://remysharp.com/2009/01/07/html5-enabling-script/
==================================================================================================
*/

(function() {
	var tags = 'abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video';
	tags.replace(/\w+/g, function(tagName) {
		document.createElement(tagName); 
	});
})();
