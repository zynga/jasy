/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * @require {fix.DocumentHead}
 */
(function(global)
{
	var doc = global.document;

	// All loaded scripts
	var completed = {};
	var loading = {};

	// the following is a feature sniff for the ability to set async=false on dynamically created script elements, as proposed to the W3C
	// RE: http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
	var supportsScriptAsync = doc.createElement("script").async === true;
	var dynamicUri = "?r=" + Date.now();


	/**
	 *
	 *
	 */
	var hasLoaded = function(uris) 
	{
		for (var i=0, l=uris.length; i<l; i++) 
		{
			if (!completed[uris[i]]) {
				return false;
			}
		}
		
		return true;
	};
	

	/**
	 * Creates and appends script tag for given URI
	 *
	 * @param uri {String} URI to load
	 * @param onload {Function} Callback function to execute when script was loaded
	 * @param nocache {Boolean?false} Whether we should inject a dynamic part to the URL to omit caching
	 */
	var createScriptTag = function(uri, onload, nocache)
	{
		var elem = doc.createElement("script");
		
		// load script via 'src' attribute, set onload/onreadystatechange listeners
		elem.onload = elem.onerror = elem.onreadystatechange = function(e) {
			onload((e?e:event).type, uri, elem);
		};
		
		elem.src = nocache ? uri + dynamicUri : uri;
		
		if (supportsScriptAsync) {
			elem.async = false;
		}
		
		doc.head.insertBefore(elem, doc.head.firstChild);
	};
	
	
	/**
	 * Returns a custom onload routine for script elements. 
	 *
	 * * Supports wait list of numerous scripts which needs to be loaded
	 * * Executes the given callback method (when single script or all scripts have been loaded)
	 *
	 * @param callback {Function?} Callback function to execute
	 * @param context {Object?} Context in which the callback function should be executed
	 * @param uris {Array} List of sources which should be waited for
	 */
	var getOnLoad = function(callback, context, uris)
	{
		// Load listener local registry of uris we wait for until we execute the callback
		var waitingScripts = {};
		if (uris)
		{
			for (var i=0, l=uris.length; i<l; i++) 
			{
				var currentUri = uris[i];
				if (!completed[currentUri]) {
					waitingScripts[currentUri] = true;
				}
			}
		}
		
		return function(type, uri, elem)
		{
			var isErrornous = type == "error";
			if (!isErrornous) 
			{
				var readyState = elem.readyState;
				if (readyState && readyState !== "complete" && readyState !== "loaded") {
					return;
				}
			}
			
			// Prevent memory leaks
			elem.onload = elem.onerror = elem.onreadystatechange = null;
			
			// Clear entry from local waiting registry
			delete waitingScripts[uri];

			// Delete from shared activity registry
			delete loading[uri];
			
			// Add to shared loaded registry
			completed[uri] = true;
			
			if (callback) 
			{
				// Check whether there are more local scripts we need to wait for
				for (var uri in waitingScripts) {
					return;
				}

				callback.call(context||global);
			}
			
			if (isErrornous) {
				throw new Error("Could not load script: " + uri);
			}
		};
	};


	/** {Array} List of function, context where each entry consumes two array fields */
	var cachedCallbacks = [];

	/**
	 * Flushes the cached callbacks as soon as no more active scripts are detected.
	 * This methods is called by the different complete scenarios from the loader functions.
	 */
	var flushCallbacks = function()
	{
		// Check whether all known scripts are loaded
		for (var uri in loading) {
			return;
		}
		
		// Then execute all callbacks (copy to protect loop from follow-up changes)
		var todo = cachedCallbacks.concat();
		cachedCallbacks.length = 0;
		for (var i=0, l=todo.length; i<l; i+=2) {
			todo[i].call(todo[i+1]);
		}
	};

	
	// Firefox(prior to Firefox 4) & Opera preserve execution order with script tags automatically,
	// so just add all scripts as fast as possible. Firefox 4 has async=false to do the same.
	if (supportsScriptAsync || jasy.Env.isSet("engine", "gecko") || jasy.Env.isSet("engine", "opera"))
	{
		var load = function(uris, callback, context, nocache)
		{
			var onLoad;
			var executeDirectly = !!callback;
			
			if (callback && !context) {
				context = global;
			}

			for (var i=0, l=uris.length; i<l; i++)
			{
				var currentUri = uris[i];
				
				if (!completed[currentUri])
				{
					// When a callback needs to be moved to the queue instead of being executed directly
					if (executeDirectly)
					{
						executeDirectly = false;
						cachedCallbacks.push(callback, context);
					}

					// When script is not being loaded already, then start with it here
					// (Otherwise we just added the callback to the queue and wait for it to be executed)
					if (!loading[currentUri])
					{
						loading[currentUri] = true;

						// Prepare load listener which flushes callbacks
						if (!onLoad) {
							onLoad = getOnLoad(flushCallbacks, global, uris);
						}

						createScriptTag(currentUri, onLoad, nocache);
					}
				}
			}
			
			// If all scripts are loaded already, just execute the callback
			if (executeDirectly) {
				callback.call(context);
			}
		};
	}
	else
	{
		var load = function(uris, callback, context, nocache)
		{
			var executeDirectly = !!callback;
			var queuedUris = [];
			
			if (callback && !context) {
				context = global;
			}
			
			for (var i=0, l=uris.length; i<l; i++)
			{
				var currentUri = uris[i];
				if (!completed[currentUri])
				{
					// When a callback needs to be moved to the queue instead of being executed directly
					if (executeDirectly)
					{
						executeDirectly = false;
						cachedCallbacks.push(callback, context);
					}
					
					// When script is not being loaded already, then start with it here
					// (Otherwise we just added the callback to the queue and wait for it to be executed)
					if (!loading[currentUri])
					{
						loading[currentUri] = true;
						queuedUris.push(currentUri);
					}
				}
			}
			
			// If all scripts are loaded already, just execute the callback
			if (executeDirectly) 
			{
				callback.call(context);
			}
			else if (queuedUris.length > 0)
			{
				var executeOneByOne = function()
				{
					var currentUri = queuedUris.shift();
					if (currentUri) {
						createScriptTag(currentUri, getOnLoad(executeOneByOne), nocache);
					} else {
						flushCallbacks();
					}
				};

				// Load and execute first script, then continue with next until last one
				executeOneByOne();
			}
		};
	}
	
	/**
	 * Generic script loader for features. Could be used for loading feature/class packages after initial load.
	 *
	 * (though limited feature set and file registration not useful for data transaction)
	 */
	Module("jasy.io.Script",
	{
		/**
		 * Checks wether the given scripts are loaded. This is synchronous and might be helpful for a quick check.
		 *
		 * @param uris {String[]} URIs of script sources to check for
		 * @return {Boolean} Whether all given script are loaded or not.
		 */
		hasLoaded : hasLoaded,


		/**
		 * Loads the scripts at the given URIs.
		 *
		 * Automatically using preloading of scripts in modern browsers and falls back to sequential loading/executing on others.
		 *
		 * @param uris {String[]} URIs of script sources to load
		 * @param callback {Function} Function to execute when scripts are loaded
		 * @param context {Object} Context in which the callback should be executed
		 * @param nocache {Boolean?false} Appends a dynamic parameter to each script to force a fresh copy
		 */
		load : load
	});
})(this);

