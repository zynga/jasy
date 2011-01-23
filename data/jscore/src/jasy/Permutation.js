/**
 * This class is the client-side representation for the permutation features of 
 * Jasy and supports features like auto-selecting builds based on specific feature sets.
 */
(function()
{
  // Small hack to correctly bootstrap the next line
  jasy.Permutation = {getValue:function(){}};
  
  // The build system is replacing this call via the loader permutation
  var values = jasy.Permutation.getValue("jasy.values");
  
  delete jasy.Permutation;
  
  // Stores all selected values in a simple map
  var selected = {};
  
  var checksum = values ? (function()
  {
    // Process entries
    var key = [];
    for (var i=0, l=values.length; i<l; i++) 
    {
      var entry = values[i];
      var name = entry[0];
      var allowed = entry[1];

      var test = entry[2];
      if (test)
      {
        var value = "VALUE" in test ? test.VALUE : test.get(name);
        
        // Fallback to first value if test results in unsupported value
        if (allowed.indexOf(value) == -1) {
          value = allowed[0];
        }
      }
      else
      {
        // In cases with no test, we don't have an array of values but just a value
        value = allowed;
      }

      selected[name] = value;
      key.push(name + ":" + value);
    }
    
    var adler32 = jasy.Adler32.compute(key.join(";"));
    var prefix = adler32 < 0 ? "a" : "b";
    var checksum = prefix + (adler32 < 0 ? -adler32 : adler32).toString(16);
    
    return checksum;
  })() : "";
  
  Core.declare("jasy.Permutation",
  {
    /** {Map} Currently selected values from Permutation data */
    selected : selected,

    /** {Number} Holds the checksum for the current permutation which is auto detected by features or by compiled-in data */
    CHECKSUM : checksum,
    
    isEnabled : function(name) {
      return selected[name] == true;
    },
    
    isSet : function(name, value) {
      return selected[name] == value;
    },
    
    getValue : function(name) {
      return selected[name];
    },

    loadScripts : function(uris)
    {
      var patched = [];
      for (var i=0, l=uris.length; i<l; i++) {
        patched[i] = this.patchFilename(uris[i]);
      }

      return jasy.Loader.loadScripts(patched);
    },

    patchFilename : function(fileName) 
    {
      var pos = fileName.lastIndexOf(".");
      var checksum = "-" + this.CHECKSUM;

      if (pos == -1)
      {
        return fileName + checksum;
      }
      else
      {
        var fileExt = fileName.substring(pos+1);
        return fileName.substring(0, pos) + checksum + "." + fileExt;
      }
    }
  });
})();

