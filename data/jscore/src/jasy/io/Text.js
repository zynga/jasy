/**
 * Loads all kinds of text content like text, HTML and JSON.
 *
 */
(function(global) 
{
	var empty = new Function;
	
	// Detect native xhr object
	var xhr = global.XMLHttpRequest;
	
	// Status codes which mean successful
	var goodCodes = 
	{
		0 : 1,
		204 : 1,
		
		// IE sometimes returns 1223 when it should be 204
		1223 : 1 
	};
	
	// Dynamic URI can be shared because we do not support reloading files
	var dynamicExtension = "?r=" + Date.now();
	
	Module("jasy.io.Text", 
	{
		/** {Boolean} Whether the loader supports parallel requests */
		SUPPORTS_PARALLEL : true,


		/**
		 * Loads text content from the given URI.
		 *
		 * Automatically using preloading of scripts in modern browsers and falls back to sequential loading/executing on others.
		 *
		 * @param uri {String} URI of script sources to load
		 * @param callback {Function ? null} Function to execute when script is loaded
		 * @param context {Object ? null} Context in which the callback should be executed
		 * @param nocache {Boolean ? false} Appends a dynamic parameter to each script to force a fresh copy
		 */
		load : function(uri, callback, context, nocache) 
		{
			if (!context) {
				context = global;
			}
			
			var request = xhr ? new xhr : new window.ActiveXObject("Microsoft.XMLHTTP");
			request.open("GET", uri + (nocache ? dynamicExtension : ""), true);
			request.onreadystatechange = function(e) 
			{
				if (request.readyState == 4) 
				{
					request.onreadystatechange = empty;
					
					// Finally call the user defined callback (succeed with data)
					callback.call(context, uri, !!goodCodes[request.stateCode], { 
						data : request.responseText || ""
					});
				}
			};
			
			// Fixes for IE memory leaks
			if (jasy.Env.isSet("engine", "trident")) 
			{
				var onUnload = function() 
				{
					window.detachEvent("onunload", onUnload);
					request.onreadystatechange = null;
					
					// Internet Explorer will keep connections alive if we don't abort on unload
					request.abort();
					
					// Finally call the user defined callback (failed)
					callback.call(context, uri, false);
				};
				
				window.attachEvent("onunload", onUnload);
			}
			
			// Send request
			request.send();
		}
	});
})(this);
