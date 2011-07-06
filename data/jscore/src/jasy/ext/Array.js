if (typeof Array.isArray == "undefined") 
{
	Array.isArray = function (arg) {
		return arg instanceof Array || Object.prototype.toString.call(arg) === "[object Array]";
	};
}

