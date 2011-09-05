/**
 * Loads all kinds of text content like text, HTML and JSON.
 *
 */
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
		// TODO: Implement via XHR
	}
});
