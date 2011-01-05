Core.declare("detect.Engine", 
{
  VALUE : (function() 
  {
    var engine;
    var docStyle = doc.documentElement.style;

    if (global.opera && Object.prototype.toString.call(opera) == "[object Opera]") {
      engine = "presto";
    } else if ("MozAppearance" in docStyle) {
      engine = "gecko";
    } else if ("WebkitAppearance" in docStyle) {
      engine = "webkit";
    } else if (typeof navigator.cpuClass === "string") {
      engine = "trident";
    }

    return engine;
  })()
});
