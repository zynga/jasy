// ES5 15.5.4.20
if (!String.prototype.trim) 
{
	// http://blog.stevenlevithan.com/archives/faster-trim-javascript
	var trimBeginRegexp = /^\s\s*/;
	var trimEndRegexp = /\s\s*$/;
	
	String.prototype.trim = function trim() {
		return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
	};
}
