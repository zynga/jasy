(function() {
	
	var loading = {};
	var completed = {};
	
	var typeLoader = 
	{
		js : jasy.io.Script,
		css : jasy.io.StyleSheet,
		png : jasy.io.Image,
		gif : jasy.io.Image,
		jpg : jasy.io.Image,
		jpeg : jasy.io.Image
	};
	
	var extractExtension = function(filename) {
		var dot = filename.lastIndexOf(".");
		return dot > 0 ? filename.slice(dot+1) : null;
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

	
	
	Module("jasy.io.Queue",
	{
		hasLoaded : function(uris) 
		{
			for (var i=0, l=uris.length; i<l; i++) 
			{
				if (!completed[uris[i]]) {
					return false;
				}
			}

			return true;
		},
		
		
		load : function(uris, callback, context, nocache, type) 
		{
			var executeDirectly = !!callback;
			var autoType = !type;
			
			// List of sequential items sorted by type
			var sequential = {};
			
			var onLoad = function(uri) 
			{
				delete loading[uri];
				completed[uri] = true;

				for (var queued in loading) {
					return;
				}

				flushCallbacks();
			};

			var executeOneByOne = function(type)
			{
				var current = sequential[type].shift();
				if (current) 
				{
					current.loader.load(current.uri, function(uri) 
					{
						onLoad(uri);
						executeOneByOne(type);
					}, 
					null, nocache);
				} 
				else
				{
					flushCallbacks();
				}
			};
			
			for (var i=0, l=uris.length; i<l; i++)
			{
				var currentUri = uris[i];
				
				if (!completed[currentUri])
				{
					if (autoType) {
						type = extractExtension(currentUri);
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
				// Load and execute first script, then continue with next until last one
				for (var type in sequential) {
					executeOneByOne(type);
				}
			}
		}
	});
})();



