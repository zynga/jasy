// By http://ejohn.org/blog/fast-javascript-maxmin/
// Convert to prototype functions?

Array.max = function(arr){
	return Math.max.apply(Math, arr);
};

Array.min = function(arr){
	return Math.min.apply(Math, arr);
};

String.prototype.contains = Array.prototype.contains = function(sub) {
	return ~this.indexOf(sub);
};

String.prototype.repeat = function(nr) {
	return Array(nr).join(this);
};

Number.prototype.pad = function(nr) {
	return "0".repeat(nr) + this).slice(-nr);
};

// Via: http://es5.github.com/#x15.5.4.11
String.prototype.hyphenate = function() {
	return this.replace(/[A-Z]/g,'-$&').toLowerCase();
};

// Adds support for extra parameters for setInterval/setTimeout for browsers missing it
// Via: http://webreflection.blogspot.com/2011/05/settimeout-and-setinterval-with-extra.html
// Only missing in IE browsers
setTimeout(function(one) {
	// only if not supported ...
	if (one) {
		return;
	}

	var slice = [].slice;

	// trap original versions
	var Timeout = setTimeout;
	var Interval = setInterval;
	
	// create a delegate
	var delegate = function (callback, args) {
		args = slice.call(args, 2);
		return function() {
			callback.apply(null, args);
		};
	};
	
	// redefine original versions
	setTimeout = function (callback, delay) {
		return Timeout(delegate(callback, arguments), delay);
	};
	
	setInterval = function (callback, delay) {
		return Interval(delegate(callback, arguments), delay);
	};
}, 0, 1);
