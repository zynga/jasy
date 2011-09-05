/** 
 * Image loader with support for load callback.
 */
Module("jasy.io.Image",
{
	/** {Boolean} Whether the loader supports parallel requests. Always true for images. */
	SUPPORTS_PARALLEL : true,

	/**
	 * Loads an image and fires a callback when the image was loaded
	 *
	 * @param uri {String} URI pointing to the image
	 * @param callback {Function ? null} Callback that fires when image is loaded
	 * @param context {Object ? null} Context in which the callback is being executed. Defaults to global context.
	 * @param nocache {Boolean ? false} Appends a dynamic parameter to each URL to force a fresh copy
	 */
	load : function(uri, callback, context, nocache) {
		// TODO
	}
});
