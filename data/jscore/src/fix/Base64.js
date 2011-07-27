/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined 
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on base64 implementation by: 
  https://bitbucket.org/davidchambers
==================================================================================================
*/

(function (global) 
{
	// Keep native methods
	if (global.btoa) {
		return;
	}
	
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var fromCharCode = String.fromCharCode;
	var max = Math.max;

	global.btoa = function btoa(string) 
	{
		var a, b, b1, b2, b3, b4, c;
		var i = 0;
		var len = string.length;
		var result = [];

		while (i < len) 
		{
			a = string.charCodeAt(i++) || 0;
			b = string.charCodeAt(i++) || 0;
			c = string.charCodeAt(i++) || 0;

			if (max(a, b, c) > 0xFF) {
				throw new Error("Invalid character!");
			}

			b1 = (a >> 2) & 0x3F;
			b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xF);
			b3 = ((b & 0xF) << 2) | ((c >> 6) & 0x3);
			b4 = c & 0x3F;

			if (!b) {
				b3 = b4 = 64;
			} else if (!c) {
				b4 = 64;
			}
			
			result.push(characters.charAt(b1), characters.charAt(b2), characters.charAt(b3), characters.charAt(b4));
		}
		
		return result.join("");
	};

	global.atob = function atob(string) 
	{
		string = string.replace(/=+$/, "");
		
		var a, b, b1, b2, b3, b4, c;
		var i = 0;
		var len = string.length;
		var chars = [];

		if (len % 4 === 1) {
			throw new Error("Invalid character!");
		}

		while (i < len) 
		{
			b1 = characters.indexOf(string.charAt(i++));
			b2 = characters.indexOf(string.charAt(i++));
			b3 = characters.indexOf(string.charAt(i++));
			b4 = characters.indexOf(string.charAt(i++));

			a = ((b1 & 0x3F) << 2) | ((b2 >> 4) & 0x3);
			b = ((b2 & 0xF) << 4) | ((b3 >> 2) & 0xF);
			c = ((b3 & 0x3) << 6) | (b4 & 0x3F);

			chars.push(fromCharCode(a));
			b && chars.push(fromCharCode(b));
			c && chars.push(fromCharCode(c));
		}
		
		return chars.join("");
	};
}(this));
