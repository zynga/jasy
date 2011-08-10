/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

Module("jasy.Adler32",
{
	/**
	 * Compute Adler-32, the 32-bit checksum of an ASCII string.
	 *
	 * @param str {String} ASCII string
	 * @return {Integer} Checksum
	 */	 
	compute : function(data)
	{
		var MOD_ADLER = 65521;
		var a=1, b=0;

		// Process each byte of the data in order
		for (var index=0, len=data.length; index<len; ++index)
		{
			a = (a + data.charCodeAt(index)) % MOD_ADLER;
			b = (b + a) % MOD_ADLER;
		}

		return (b << 16) | a;
	}
})