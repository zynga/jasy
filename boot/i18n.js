/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010 Sebastian Werner
==================================================================================================
*/

(function()
{
  var global = this;
  var defaultLocale = jasy.LOCALE;
  var all = global.$$locales;
  var NULL = null;

  var lookup = function(msg, fallback)
  {
    if (!locale) {
      locale = defaultLocale;
    } else if (jasy.DEBUG && !all[locale]) {
      throw new Error("Invalid locale: " + locale);
    }
    
    var replacement = all[locale][id];
    return replacement == NULL ? fallback : replacement;
  };
  
  var patch = function(msg, data, start)
  {
    // %1 = first, %2 = second, ...
    start = start == NULL ? -1 : start - 1;
    return msg.replace(/%([0-9])/g, function(match, pos) {
      return data[start+parseInt(pos)];
    });
  };
  
  // Export object
  global.i18n = 
  {
    tr : function(msg, varargs)
    {
      var replacement = lookup(msg, msg);
      return varargs == NULL ? replacement : patch(replacement, arguments, 1);
    },
    
    trc : function(hint, msg, varargs)
    {
      var replacement = lookup(hint, msg)
      return varargs == NULL ? replacement : patch(replacement, arguments, 2);
    },
    
    trn : function(msgSingular, msgPlural, number, varargs)
    {
      var msg = number == 1 ? msgSingular : msgPlural;
      var replacement = lookup(msg);
      return varargs == NULL ? replacement : patch(replacement, arguments, 3);
    }
  }
})();