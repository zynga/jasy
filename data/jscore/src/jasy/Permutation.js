/**
 * This class is the client-side representation for the permutation features of 
 * Jasy and supports features like auto-selecting builds based on specific feature sets.
 */
(function()
{
  // This is quite magic and only works because of the build system
  // replacing these constants via the loader permutation
  var values = jasy.values;
  var selected = {};
  
  var checksum = values ? (function()
  {
    var key = [];
    for (var name in values) 
    {
      var entry = values[name];
      var test = entry.test;
      var allowed = entry.values;
      
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
        value = allowed[0];
      }

      selected[name] = value;
      key.push(name + ":" + value);
    }
    
    key = key.join(";");
    console.debug("Permutation Key: " + key);
    
    var adler32 = jasy.Adler32.compute(key);
    var prefix = adler32 < 0 ? "a" : "b";
    var checksum = prefix + (adler32 < 0 ? -adler32 : adler32).toString(16);
    
    console.debug("Permutation Checksum: " + checksum)
    return checksum;
  })() : "";
  
  Core.declare("jasy.Permutation",
  {
    /** {Map} Currently selected values from Permutation data */
    selected : selected,

    /** {Number} Holds the checksum for the current permutation which is auto detected by features or by compiled-in data */
    CHECKSUM : checksum,

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

