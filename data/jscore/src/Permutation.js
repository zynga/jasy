/**
 * This class is the client-side representation for the permutation features of 
 * Jasy and supports features like auto-selecting builds based on specific feature sets.
 */
Core.declare("Permutation",
{
  /** {Map} All supported keys in the permutations including all supported values */
  values : null,
  
  /** {Map} Maps keys with tests to the classes which implements the test */
  tests : null,
  
  /** {Number} Holds the checksum for the current permutation which is autodetected by features or by compiled-in data */
  CHECKSUM : (function(global)
  {
    var values = Permutation.values;
    if (!values) {
      return;
    }
    
    var key = [];
    var tests = Permutation.tests;
    
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
    
    console.debug("Permutation:\n" + key.join(";\n"))
    return Core.crc32(key.join(";"))
  })(this)
});
