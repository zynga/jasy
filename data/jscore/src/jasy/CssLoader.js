// Inspired by: http://www.phpied.com/when-is-a-stylesheet-really-loaded/
// Misses webkit solution
// Problem: Detecting which file was loaded!
CssLoader = (function(global, doc)
{
  var head = doc.getElementsByTagName('head')[0];

  var testEl = doc.createElement("link");
  if ("onload" in testEl)
  {
    return function(url, callback, context)
    {
      var el = doc.createElement("link");
      el.onload = function() 
      {
        el.onload = null;
        callback.call(context||global);
      }
      el.type = "stylesheet";
      el.src = url;
      
      head.appendChild(el);
    };
  }
  else
  {
    return function(url, callback, context)
    {
      var style = doc.createElement('style');
      style.textContent = '@import "' + url + '"';

      var interval = setInterval(function() 
      {
        try 
        {
          // MAGIC: only populated when file is loaded
          style.sheet.cssRules;
          callback.call(context||global);
          clearInterval(interval);
        } 
        catch(e){}
      }, 10);  

      head.appendChild(style);
    }
  }
})(this, document)
