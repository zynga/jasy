/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010 Sebastian Werner
==================================================================================================
*/

(function(global)
{
  var translations = global.$$translation;
  
  
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
     * Applies the plural rule of the current locale and returns the matching 
     * translation tag. This is the new style CLDR data with tags instead of
     * abstract indexes.
     *
     * @param nr {Number} Number to test
     * @return {String} One of "ZERO", "ONE", "TWO", "FEW", "MANY" or "OTHER"
     */
    pluralTag : (function(nr)
    {
      var Plural = locale.Plural;
      var fields = ["zero", "one", "two", "few", "many"];

      var code = "";
      for (var i=0, l=fields.length; i<l; i++) 
      {
        var field = fields[i];
        var fieldConst = field.toUpperCase();
        
        if (fieldConst in Plural) {
          code += "if(" + Plural[fieldConst] + ")return '" + field + "';";
        }
      }
      
      code += "return 'other';"
      
      return new Function("n", code);
    })(),
    
    
    /**
     * Applies the plural rule of the current locale and returns the 
     * field index on the translation data. This is the data used 
     * by the classical GNU gettext tools.
     *
     * @param nr {Number} Number to test
     * @return {String} One of 0, 1, 2, 3, 4, 5 or 6
     */    
    pluralIndex : (function(nr)
    {
      var Plural = locale.Plural;
      var fields = ["zero", "one", "two", "few", "many"];

      var code = "";
      var pos = 0;
      for (var i=0, l=fields.length; i<l; i++) 
      {
        var field = fields[i];
        var fieldConst = field.toUpperCase();
        
        if (fieldConst in Plural) {
          code += "if(" + Plural[fieldConst] + ")return " + pos + ";";
          pos++;
        }
      }
      
      code += "return " + pos + ";"
      
      return new Function("n", code);
    })(),    
    
    
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
        var plural = i18n.pluralIndex(number);
        
        replacement = replacement[plural];
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