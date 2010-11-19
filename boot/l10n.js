(function()
{
  var global = this;
  var defaultLocale = jasy.DEFAULT_LOCALE;
  var all = global.$$locales;
  
  global.l10n = 
  {
    /**
     * Returns the localized replacement string for a given CLDR
     * based localization ID. These IDs looks like "number-format-long",
     * or "date-format-short".
     *
     * @param id {String} Identifier
     * @param locale {String?null} Optional locale. Without it uses the global default.
     * @return {String} Returns the replacement string e.g. "M/d/yy"
     */
    get : function(id, locale)
    {
      if (!locale) {
        locale = defaultLocale;
      } else if (jasy.DEBUG && !all[locale]) {
        throw new Error("Invalid locale: " + locale);
      }
      
      var replacement = all[locale][id];
      if (jasy.DEBUG && replacement == null) {
        throw new Error("Invalid localization ID: " + id);
      }
      
      return replacement;
    }
  }
})();