(function() 
{
	/** {Map} Keys are all URIs which are currently loading */
	var loading = {};

	/** {Map} Keys are all URIs which are completely loaded */
	var completed = {};
	
	/** {Map} Maps extensions to loader classes */
	var typeLoader = 
	{
		js : jasy.io.Script,
		css : jasy.io.StyleSheet,
		jsonp : jasy.io.Jsonp,
		png : jasy.io.Image,
		jpeg : jasy.io.Image,
		jpg : jasy.io.Image,
		gif : jasy.io.Image
	};


	/**
	 * Returns the extension of the given filename
	 *
	 * @param filename {String} Name of file or full URI
	 * @return {String} Extension part or <code>null</code> if no extension was found
	 */
	var extractExtension = function(filename) 
	{
		// Filter out query string and find last dot to split extension
		var result = filename.match(/\.([^\.\?]+)(?:\?|$)/);
		
		// Extension found
		if (result != null) {
			return result[1];
		}
		
		// Support for callback params in URI (JSON-P)
		if (filename.indexOf("callback=") != -1) {
			return "jsonp";
		}
		
		return null;
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


	/**
	 * Registers the given URI as being loaded. 
	 * 
	 * @param uri {String} URI to mark as being loaded
	 * @param errornous {Boolean?false} Whether request was not successful
	 * @param data {Map} Additional data to exchange
	 */
	var onLoad = function(uri, errornous, data) 
	{
		if (jasy.Env.isSet("debug")) {
			jasy.Test.assertString(uri, "Invalid URI from loader backend!");
		}
		
		delete loading[uri];
		completed[uri] = true;

		for (var queued in loading) {
			return;
		}

		flushCallbacks();
	};
	
	
	/**
	 * Generic URLs loader queue with support for different type "backend" modules.
	 *
	 * Uses parallel loading where available and load all other resources
	 * sequentially. Sequential loading is done by type so that multiple
	 * different types are loaded in parallel.
	 *
	 * Loader module need to implement the following interface:
	 *
	 * * method load(uri, callback, context, nocache) which calls the callback with the URI
	 * * constant `SUPPORTS_PARALLEL` with a boolean value whether the loader supports parallel loading
	 */
	Module("jasy.io.Queue",
	{
		/**
		 * Whether the given URI or URIs are loaded through the queue
		 *
		 * @param uris {String|Array} One or multiple URIs to verify
		 * @return {Boolean} Whether all given URIs have been loaded
		 */
		isLoaded : function(uris) 
		{
			if (typeof uris == "string") {
				return !!completed[uris];
			}
			
			if (jasy.Env.isSet("debug")) {
				jasy.Test.assertArray(uris, "Invalid list of URIs!");
			}

			for (var i=0, l=uris.length; i<l; i++) 
			{
				if (!completed[uris[i]]) {
					return false;
				}
			}

			return true;
		},
		
		
		/**
		 * Loads the given URIs and optionally executes the given callback after all are completed
		 *
		 * @param uris {Array} List of URLs to load
		 * @param callback {Function ? null} Callback method to execute
		 * @param context {Object ? null} Context in which the callback function should be executed
		 * @param nocache {Boolean ? false} Whether a cache prevention logic should be applied (to force a fresh copy)
		 * @param type {String ? auto} Whether the automatic type detection should be disabled and the given type should be used.
		 */
		load : function(uris, callback, context, nocache, type) 
		{
			if (jasy.Env.isSet("debug")) 
			{
				jasy.Test.assertArray(uris);

				if (callback != null) {
					jasy.Test.assertFunction(callback, "Invalid callback method!");
				}
				
				if (context != null) {
					jasy.Test.assertObject(context, "Invalid callback context!");
				}
				
				if (nocache != null) {
					jasy.Test.assertBoolean(nocache);
				}

				if (type != null) {
					jasy.Test.assertString(type);
				}
			}
			
			var executeDirectly = !!callback;
			var autoType = !type;
			
			// List of sequential items sorted by type
			var sequential = {};
			
			// Process all URIs
			for (var i=0, l=uris.length; i<l; i++)
			{
				var currentUri = uris[i];
				
				if (!completed[currentUri])
				{
					if (autoType) {
						type = extractExtension(currentUri);
						
						if (jasy.Env.isSet("debug") && (!type || !typeLoader[type])) {
							throw new Error("Could not figure out loader to use for URI: " + currentUri);
						}
					}
					
					var loader = typeLoader[type];

					// Only queue callback once
					if (executeDirectly)
					{
						// As we are waiting for things to load, we can't execute the callback directly anymore
						executeDirectly = false;
						
						// Directly push to global callback list
						cachedCallbacks.push(callback, context);
					}

					// When script is not being loaded already, then start with it here
					// (Otherwise we just added the callback to the queue and wait for it to be executed)
					if (!loading[currentUri])
					{
						// Register globally as loading
						loading[currentUri] = true;
						
						// Differenciate between loader capabilities
						if (loader.SUPPORTS_PARALLEL) 
						{
							loader.load(currentUri, onLoad, null, nocache);
						}
						else
						{
							// Sort in the URI into a type specific queue
							if (sequential[type]) {
								sequential[type].push(currentUri);
							} else {
								sequential[type] = [currentUri];
							}
						}
					}
				}
			}

			// If all scripts are loaded already, just execute the callback
			if (executeDirectly) 
			{
				// Nothing to load, execute callback directly
				callback.call(context);
			} 
			else
			{
				/**
				 * Loads the next URI for the given type
				 *
				 * @param type {String} Which queue to use
				 */
				var loadNext = function(type)
				{
					var uri = sequential[type].shift();
					if (uri) 
					{
						typeLoader[type].load(uri, function(uri) 
						{
							onLoad(uri);
							loadNext(type);
						}, 
						null, nocache);
					} 
					else
					{
						flushCallbacks();
					}
				};
				
				// Load and execute first item in each queue
				for (var type in sequential) {
					loadNext(type);
				}
			}
			
			// Return internal loading list for debug proposes only.
			// Be super careful with the object
			if (jasy.Env.isSet("debug")) {
				return loading;
			}
		}
	});
})();

