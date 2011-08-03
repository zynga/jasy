/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Contains information about images (size, format, clipping, ...) and
 * other resources like CSS files, local data, ...
 */
Module("jasy.io.Asset",
{
	__cache : {},
	__sprites : {},
	
	
	/**
	 * Get information about an resource.
	 *
	 * @param id {String} The resource to get the information for
	 * @return {Array} Registered data or <code>null</code>
	 */
	getData : function(id) 
	{
		var cache = this.__cache;
		var file = cache[id];
		if (file != null) {
			return file;
		}
		
		var files = $$assets.files;
		var images = $$assets.images;
		
		var lastSlash = id.lastIndexOf("/");
		var dirName = id.substring(0, lastSlash);
		var fileName = id.substring(lastSlash+1);
		
		var file = (files[dirName] && files[dirName][fileName]) || (images[dirName] && images[dirName][fileName]) || null;
		if (file) {
			return cache[id] = file;
		}
	},
	
	
	/**
	 * Whether the registry has information about the given resource.
	 *
	 * @param id {String} The resource to get the information for
	 * @return {Boolean} <code>true</code> when the resource is known.
	 */
	has : function(id) {
		return this.__cache[id] || this.getData(id) != null;
	},


	/**
	 * Returns the width of the given resource ID,
	 * when it is not a known image <code>0</code> is
	 * returned.
	 *
	 * @param id {String} Resource identifier
	 * @return {Integer} The image width, maybe <code>null</code> when the width is unknown
	 */
	getImageWidth : function(id)
	{
		var data = this.getData(id);
		return data && data[1];
	},


	/**
	 * Returns the height of the given resource ID,
	 * when it is not a known image <code>0</code> is
	 * returned.
	 *
	 * @param id {String} Resource identifier
	 * @return {Integer} The image height, maybe <code>null</code> when the height is unknown
	 */
	getImageHeight : function(id)
	{
		var data = this.getData(id);
		return data && data[2];
	},
	
	
	/**
	 * Returns the dimensions of the given image ID
	 */
	getImageSize : function(id) 
	{
		var data = this.getData(id);
		if (data) {
			return { width: data[1], height: data[2] };
		}
	},
	
	
	/**
	 * Returns sprite details for being used for the given image ID.
	 *
	 * Nothing is returned when the given ID is not available as part of an image sprite.
	 *
	 * @param id {String} Resource identifier
	 * @return {Map} 
	 */
	getImageSprite : function(id)
	{
		var sprites = this.__sprites;
		var result = sprites[id];
		if (!result) 
		{
			var data = this.getData(id);
			if (data.length > 3) 
			{
				var lastSlash = id.lastIndexOf("/");
				var dirName = id.substring(0, lastSlash);
				var spriteData = $$assets.sprites[dirName][data[3]];
				var needsPosX = spriteData[4] == 1;
				var needsPosY = spriteData[5] == 1;

				sprites[id] = result = {
					uri : $$assets.roots[spriteData[1]] + "/" + dirName + "/" + spriteData[0],
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
	 * Converts the given resource ID to a full qualified URI
	 *
	 * @param id {String} Resource ID
	 * @return {String} Resulting URI
	 */
	toUri : function(id)
	{
		if (id == null) {
			return id;
		}

		var data = this.getData(id);
		if (data == null) {
			return id;
		}

		var root = $$assets.roots[data.join ? data[0] : data];
		var url = root + "/" + id;

		return url;
	}
});
