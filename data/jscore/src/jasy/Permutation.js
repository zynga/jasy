/**
 * This class is the client-side representation for the permutation features of 
 * Jasy and supports features like auto-selecting builds based on specific feature sets.
 */
(function()
{
  var checksum = (function()
  {
    var values = jasy.Permutation.values;
    if (!values) {
      return "";
    }
    
    var key = [];
    var tests = jasy.Permutation.tests;
    
    for (var name in values) 
    {
      if (name in tests) 
      {
        var test = tests[name];
        var value = "VALUE" in test ? test.VALUE : test.get(name);
        
        // Fallback to first value if test results in unsupported value
        if (values[name].indexOf(value) == -1) {
          value = values[name][0];
        }
      }
      else
      {
        value = values[name][0];
      }

      key.push(name + ":" + value);
    }
    
    var adler32 = jasy.Adler32.compute(key.join(";"));
    var prefix = adler32 < 0 ? "a" : "b";

    return prefix + (adler32 < 0 ? -adler32 : adler32).toString(16);
  })();
  
  Core.declare("jasy.Permutation",
  {
    /** {Map} All supported keys in the permutations including all supported values */
    values : null,

    /** {Map} Maps keys with tests to the classes which implements the test */
    tests : null,

    /** {Number} Holds the checksum for the current permutation which is autodetected by features or by compiled-in data */
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

