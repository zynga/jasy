/**
 * Loads all kinds of text content like text, HTML and JSON.
 *
 */
(function(global) 
{
	var empty = new Function;
	
	// Detect native support
	var XHR = global.XMLHttpRequest;
	
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
		 * @param timeout {Number ? 10000} Waits 10 seconds by default (started at readyState == 1)
		 */
		load : function(uri, callback, context, nocache, timeout) 
		{
			if (!context) {
				context = global;
			}
			
			var timeoutHandle = null;
			var request = XHR ? new XHR : new ActiveXObject("Microsoft.XMLHTTP");
			
			// Open request, we always use async GET here
			request.open("GET", uri + (nocache ? dynamicExtension : ""), true);
			
			// Attach event listener
			request.onreadystatechange = function(e) 
			{
				// Headers received... data following, now configuring the timeout
				// As we don't send any data it's okay to start the timeout at this state.
				if (request.readyState == 2 && timeout !== 0 && !timeoutHandle)
				{
					timeoutHandle = window.setTimeout(function() {
						request.onreadystatechange = empty;
						request.abort();
						callback.call(context, uri, true);
					}, timeout || 10000);
				}
				
				if (request.readyState == 4) 
				{
					request.onreadystatechange = empty;
					
					// Finally call the user defined callback (succeed with data)
					var status = request.status;
					callback.call(context, uri, status >= 200 && status < 300 || status == 304 || status == 1223, { 
						data : request.responseText || ""
					});
				}
			};
			
			// Fixes for IE memory leaks
			if (jasy.Env.isSet("engine", "trident") && global.attachEvent) 
			{
				var onUnload = function() 
				{
					global.detachEvent("onunload", onUnload);
					request.onreadystatechange = empty;
					
					// Internet Explorer will keep connections alive if we don't abort on unload
					request.abort();
					
					// Finally call the user defined callback (failed)
					callback.call(context, uri, true);
				};
				
				global.attachEvent("onunload", onUnload);
			}
			
			// Send request
			request.send();
		}
	});
})(this);
