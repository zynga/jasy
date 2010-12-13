/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010 Sebastian Werner
==================================================================================================
*/

(function(global)
{
  var all = global.$$locales;
  var NULL = null;

  var lookup = function(msg, fallback)
  {
    var replacement = all[id];
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
    /**
     * Translates the given message and replaces placeholders in the result string.
     *
     * @param msg {String} Message to translate (used as a fallback when no translation is available)
     * @param varargs {...} Placeholder values
     * @return {String} Translated string
     */
    tr : function(msg, varargs)
    {
      var replacement = lookup(msg, msg);
      return varargs == NULL ? replacement : patch(replacement, arguments, 1);
    },
    

    /**
     * Translates the given message (with a hint for the translator) and 
     * replaces placeholders in the result string.
     *
     * @param hint {String} Lookup name in translation table (including a hint for the translator)
     * @param msg {String} Fallback message if no translation is available
     * @param varargs {...} Placeholder values
     * @return {String} Translated string
     */
    trc : function(hint, msg, varargs)
    {
      var replacement = lookup(hint, msg)
      return varargs == NULL ? replacement : patch(replacement, arguments, 2);
    },
    

    /**
     * Translates the given message and replaces placeholders in the result string.
     *
     * @param msgSingular {String} Fallback message for singular case
     * @param msgPlural {String} Fallback message for plural case
     * @param number {Integer} Number of items (chooses between singular and plural wording)
     * @param varargs {...} Placeholder values
     * @return {String} Translated string
     */
    trn : function(msgSingular, msgPlural, number, varargs)
    {
      var msg = number == 1 ? msgSingular : msgPlural;
      var replacement = lookup(msg);
      return varargs == NULL ? replacement : patch(replacement, arguments, 3);
    }
  }
})(this);