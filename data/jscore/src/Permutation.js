Core.declare("Permutation",
{
  tests : null,
  defaults : null,
  
  CHECKSUM : (function(global)
  {
    var defaults = Permutation.defaults;
    var tests = Permutation.tests;
    if (!defaults) {
      return;
    }
    
    var key = [];
    for (var name in defaults) 
    {
      var name = names[i];
      var test = tests[name];

      var value;
      if (test) {
        value = "VALUE" in test ? test.VALUE : test.get(name);
      } else {
        value = map[name];
      }
      
      key.push(name + ":" + value);
    }
    
    return Core.crc32(key.join(";"))
  })(this)
});
