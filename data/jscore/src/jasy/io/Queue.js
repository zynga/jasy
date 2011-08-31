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
	


	
	
	Module("jasy.io.Queue",
	{
		load : function(uris, callback, context, nocache, type) 
		{
			var onLoad;
			var executeDirectly = !!callback;
			var autoType = !type;
			var queuedUris = [];

			var onLoad = function(uri) {

				delete loading[uri];
				completed[uri] = true;

				for (var queued in loading) {
					return;
				}

				callback.call(context);
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

						if (loader.SUPPORTS_PARALLEL) {
							loader.load(currentUri, onLoad, null, nocache);
						} else {
							queuedUris.push(currentUri);
						}
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
						loader.load(currentUri, onLoad, null, nocache);
					} else {
						flushCallbacks();
					}
				};

				// Load and execute first script, then continue with next until last one
				executeOneByOne();
			}
		}
	});
})();



