/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of Andrea Giammarchi
  (C) WebReflection Essential - Mit Style
==================================================================================================
*/

(function(global) {
	
	var id = 0;
	var prefix = "__JSONP__";
	var document = global.document;
	var documentHead = document.head;

	/**
	 * @require {fix.DocumentHead}
	 */
	Module("jasy.io.Jsonp", 
	{
		/**
		 *
		 */
		load : function load(uri, callback) 
		{
			function JSONPResponse()
			{
				try { 
					delete global[src] 
				} catch(e) {
					global[src] = null;
				}

				documentHead.removeChild(script);
				callback.apply(this, arguments);
			}

			var src = prefix + id++;
			var script = document.createElement("script");

			global[src] = JSONPResponse;

			documentHead.insertBefore(script, documentHead.lastChild);
			script.src = uri + "=" + src;
		}
	});
})(this);
