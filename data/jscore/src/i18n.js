/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010 Sebastian Werner
==================================================================================================
*/

(function(global)
{
  var translations = global.$$translation;
  var Plural = locale.Plural;
  
  var patch = function(msg, data, start)
  {
    // %1 = first, %2 = second, ...
    start = start == null ? -1 : start - 1;
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
      var replacement = translations[msg] || msg;
      return arguments.length <= 1 ? replacement : patch(replacement, arguments, 1);
    },
    

    /**
     * Translates the given message (with a hint for the translator) and 
     * replaces placeholders in the result string.
     *
     * @param hint {String} Hint for the translator of the message
     * @param msg {String} Message to translate (used as a fallback when no translation is available)
     * @param varargs {...} Placeholder values
     * @return {String} Translated string
     */
    trc : function(hint, msg, varargs)
    {
      var replacement = translations[msg] || msg;
      return arguments.length <= 2 ? replacement : patch(replacement, arguments, 2);
    },
    

    /**
     * Translates the given message and replaces placeholders in the result string.
     *
     * @param msgSingular {String} Fallback message for singular case
     * @param msgPlural {String} Fallback message for plural case
     * @param number {Integer} Number of items (chooses between the exact translation which is being used)
     * @param varargs {...} Placeholder values
     * @return {String} Translated string
     */
    trn : function(msgSingular, msgPlural, number, varargs)
    {
      var replacement = translations[msgSingular];
      if (typeof replacement == "object")
      {
        var pos = number == 1 ? 0 : 1; // Make multi plural ready!
        
        // Try to find text at desired language specific plural position, but
        // fallback to first, singular case if it was not found.
        replacement = replacement[pos] || replacement[0];
      }
      else
      {
        // Fallback to programmatically defined messages
        replacement = number == 1 ? msgSingular : msgPlural;
      }

      return arguments.length <= 3 ? replacement : patch(replacement, arguments, 3);
    }
  }
})(this);