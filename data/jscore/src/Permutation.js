/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * This class is the client-side representation for the permutation features of 
 * Jasy and supports features like auto-selecting builds based on specific feature sets.
 */
(function(global, undef)
{
	// The build system is replacing this call via the loader permutation
	var fields = Permutation.getValue("fields");
	
	if (fields) 
	{
		// Stores all selected fields in a simple map
		var selected = {};
		
		var checksum = (function()
		{
			// Process entries
			var key = [];
			for (var i=0, l=fields.length; i<l; i++) 
			{
				// possible variants
				// 1: name, 1, test, [val1, val2]
				// 2: name, 2, value
				// 3: name, 3, test, default (not permutated)
				
				var entry = fields[i];
				var name = entry[0];
				var type = entry[1]
				if (type == 1 || type == 3)
				{
					var test = entry[2];
					var value = "VALUE" in test ? test.VALUE : test.get(name);
					var third = entry[3];
					
					// Fallback to first value if test results in unsupported value
					if (type == 1 && third.indexOf(value) == -1) {
						value = third[0];
					} 
					
					// Fill in missing value with default
					else if (type == 3 && value == null) {
						value = third;
					}
				}
				else
				{
					// In cases with no test, we don't have an array of fields but just a value
					value = entry[2];
				}

				selected[name] = value;
				
				if (type != 3) {
					key.push(name + ":" + value);
				}
			}
			
			if (selected.debug) {
				console.info("Permutation: " + key.join(", "));
			}

			var adler32 = (function(data)
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
			})(key.join(";"));

			var prefix = adler32 < 0 ? "a" : "b";
			var checksum = prefix + (adler32 < 0 ? -adler32 : adler32).toString(16);

			return checksum;
		})();

		var checksumPostfix = "-" + checksum;

		var patchFilename = function(fileName) 
		{
			var pos = fileName.lastIndexOf(".");
			if (pos == -1) {
				return fileName + checksumPostfix;
			} else {
				return fileName.substring(0, pos) + checksumPostfix + "." + fileName.substring(pos+1);
			}
		};
	} 
	else
	{
		// Enable debug by default
		var selected = {
			debug : true
		};
		
		// No checksum available
		var checksum = null;
		
		// Disable support for checksum based loading
		var patchFilename = function() {
			throw new Error("Not supported!");
		}
	}
	
	
	Module("Permutation",
	{
		/** {Map} Currently selected fields from Permutation data */
		SELECTED : selected,

		/** {Number} Holds the checksum for the current permutation which is auto detected by features or by compiled-in data */
		CHECKSUM : checksum,
		
		
		/**
		 * Whether the given field was set to the given value. Boolean 
		 * fields could also be checked without a given value as the value
		 * defaults to <code>true</code>.
		 *
		 * @param name {String} Name of the field to query
		 * @param value {var?true} Value to compare to (defaults to true)
		 * @return {Boolean} Whether the field is set to the given value
		 */
		isSet : function(name, value) 
		{
			// Fallback to value of true
			if (value === undef) {
				value = true;
			}
			
			// Explicit use of normal equal here to not differ between numbers and strings etc.
			return selected[name] == value;
		},
		
		
		/**
		 * Returns the value of the given field
		 *
		 * @param name {String} Name of the field to query
		 * @return {var} The value of the given field
		 */		
		getValue : function(name) {
			return selected[name];
		},
		

		/**
		 * Loads the given script URLs and does automatic expansion to include the computed checksum.
		 *
		 * @param uris {String[]} URIs of script sources to load
		 * @param callback {Function} Function to execute when scripts are loaded
		 * @param context {Object} Context in which the callback should be executed
		 * @param preload {Boolean?false} Activates preloading on legacy browsers. As files are
		 *   requested two times it's important that the server send correct modification headers.
		 *   Therefore this works safely on CDNs etc. but might be problematic on local servers.
		 */
		loadScripts : function(uris, callback, context, preload) 
		{
			// Mapping URLs to patched version. Could not use ES5 Array.map here yet.
			var patched = [];
			for (var i=0, l=uris.length; i<l; i++) {
				patched[i] = patchFilename(uris[i]);
			}
			
			/**
			 * @break {jasy.io.Script}
			 */
			jasy.io.Script.load(patched, callback, context, preload);
		}
	});
})(this);

