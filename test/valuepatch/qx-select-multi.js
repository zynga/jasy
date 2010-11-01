clientSpecific = qx.core.Variant.select("qx.client", {
  "gecko|mshtml" : function() { geckoOrMshtml(); },
  "default" : function() { other(); }
});