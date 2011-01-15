Core.declare("jasy.detect.Locale", 
{
  VALUE : (function()
  {
    var nav = navigator;
    var input = (nav.userLanguage || nav.language).toLowerCase();
    var split = input.indexOf("-");
    
    return split > 0 ? input.substring(0, split) : input;
  })()  
});
