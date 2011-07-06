/**
 * Emulate setImmediate/clearImmediate using timeouts.
 * 
 * See also: http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
 *
 * @name {setImmediate}
 */
(function(global) {
	if (!global.setImmediate) {
		global.setImmediate = function(handler) {
			return setTimeout(handler, 0);
		};

		global.clearImmediate = function(handler) {
			return clearTimeout(handler);
		};
	}	
})(this);
