Core.declare("Permutation",
{
  values : null,
  tests : null,
  
  CHECKSUM : (function(global)
  {
    var values = Permutation.values;
    if (!values) {
      return;
    }
    
    var key = [];
    var tests = Permutation.tests;
    var value;
    
    for (var name in values) 
    {
      var test = tests[name];

      if (test) 
      {
        alert(name)
        value = "VALUE" in test ? test.VALUE : test.get(name);
        
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
    
    return Core.crc32(key.join(";"))
  })(this)
});
