// Coypright WebReflection - Mit Style License
if (Function.prototype.bind == null) {
  Function.prototype.bind = (function (slice) {
    function bind(context) 
    {
      var self = this; // "trapped" function reference

      // only if there is more than an argument
      // we are interested into more complex operations
      // this will speed up common bind creation
      // avoiding useless slices over arguments
      if (1 < arguments.length) 
      {
        // extra arguments to send by default
        var extraargs = slice.call(arguments, 1);
        return function ()
        {
          return self.apply(
            context,
            // thanks @kangax for this suggestion
            arguments.length ?
              // concat arguments with those received
              extraargs.concat(slice.call(arguments)) :
              // send just arguments, no concat, no slice
              extraargs
          );
        };
      }
      
      // optimized callback
      return function () {
        // speed up when function is called without arguments
        return arguments.length ? self.apply(context, arguments) : self.call(context);
      };
    }

    // the named function
    return bind;
  }(Array.prototype.slice));
}

