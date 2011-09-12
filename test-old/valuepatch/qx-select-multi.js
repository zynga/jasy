clientSpecific = qx.core.Variant.select("qx.client", {
  "gecko|webkit" : function() { geckoOrWebkit(); },
  "default" : function() { other(); }
});