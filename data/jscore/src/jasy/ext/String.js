if (typeof String.isString == "undefined") 
{
  String.isString = function (arg) {
    return typeof arg == "string" || Object.prototype.toString.call(arg) === "[object String]";
  };
}

if (typeof String.prototype.contains == "undefined") 
{
  String.prototype.contains = function(arg) {
    return !!~this.indexOf(arg);
  };
}
