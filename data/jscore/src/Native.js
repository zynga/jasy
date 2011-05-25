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
}

String.prototype.repeat = function(nr) {
	return Array(nr).join(this);
}

Number.prototype.pad = function(nr) {
	return "0".repeat(nr) + this).slice(-nr);
}

