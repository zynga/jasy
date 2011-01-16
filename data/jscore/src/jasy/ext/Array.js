if (typeof Array.isArray === "undefined") 
{
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}

