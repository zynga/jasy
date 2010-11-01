clientSpecific = qx.core.Variant.select("qx.client", {
  "gecko" : function() { gecko(); },
  "mshtml" : function() { mshtml(); },
  "default" : function() { other(); }
});