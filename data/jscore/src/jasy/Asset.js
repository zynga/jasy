/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Contains information about images (size, format, clipping, ...) and
 * other assets like CSS files, local data, ...
 */
(function(global) 
{
	// TODO: Implement using permutation injection
	// jasy.Env.getValue("assets");
	var assets = global.$$assets;
	if (!assets) {
		console.warn("Asset data is not available!");
	}
	
	var cache = {};
	var sprites = {};
	
	
	/**
	 * Get information about an asset.
	 *
	 * @param id {String} The asset to get the information for
	 * @return {Array} Registered data or <code>null</code>
	 */
	var getData = assets ? function(id) 
	{
		var file = cache[id];
		if (file != null) {
			return file;
		}

		var files = assets.files;
		var images = assets.images;

		var lastSlash = id.lastIndexOf("/");
		var dirName = id.substring(0, lastSlash);
		var fileName = id.substring(lastSlash+1);

		var file = (files[dirName] && files[dirName][fileName]) || (images[dirName] && images[dirName][fileName]) || null;
		if (jasy.Env.isSet("debug")) {
			jasy.Test.assertNotNull(file, "Invalid asset identifier: " + id);
		}

		return cache[id] = file;
	} : function(id) {
		return null;
	};
	
	
	Module("jasy.Asset",
	{
		/**
		 * Whether the registry has information about the given asset.
		 *
		 * @param id {String} The asset to get the information for
		 * @return {Boolean} <code>true</code> when the asset is known.
		 */
		has : function(id) {
			return cache[id] || getData(id) != null;
		},


		/**
		 * Returns the dimensions of the given image ID
		 */
		getImageSize : function(id) 
		{
			var data = cache[id] || getData(id);
			if (data) 
			{
				return { 
					width: data[1], 
					height: data[2] 
				};
			}
		},


		/**
		 * Returns sprite details for being used for the given image ID.
		 *
		 * Nothing is returned when the given ID is not available as part of an image sprite.
		 *
		 * @param id {String} Asset identifier
		 * @return {Map} 
		 */
		getImageSprite : function(id)
		{
			var result = sprites[id];
			if (!result) 
			{
				var data = cache[id] || getData(id);
				if (data.length > 3) 
				{
					var lastSlash = id.lastIndexOf("/");
					var dirName = id.substring(0, lastSlash);
					var spriteData = assets.sprites[dirName][data[3]];
					var needsPosX = spriteData[4] == 1;
					var needsPosY = spriteData[5] == 1;

					sprites[id] = result = {
						uri : assets.roots[spriteData[1]] + "/" + dirName + "/" + spriteData[0],
						left : needsPosX ? data[4] : 0,
						top : needsPosY ? needsPosX ? data[5] : data[4] : 0,
						width : spriteData[2],
						height : spriteData[3]
					};
				}
			}

			return result;
		},


		/**
		 * Converts the given asset ID to a full qualified URI
		 *
		 * @param id {String} Asset ID
		 * @return {String} Resulting URI
		 * @throws when the asset ID is unknown
		 */
		toUri : function(id)
		{
			if (id == null) {
				return id;
			}

			var data = cache[id] || getData(id);
			
			// Differ between images (first case) and files (second case)
			var root = assets.roots[data.join ? data[0] : data];
			
			// Replace project identifier with root
			var project = id.slice(0, id.indexOf("/"));
			var url = id.replace(project, root);
			
			return url;
		}
	});	
})(this);