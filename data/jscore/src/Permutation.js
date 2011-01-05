Core.declare("Permutation",
{
  CHECKSUM : (function()
  {
    var map = {};
    var names = [];
    var permutations = global.$$permutations;
    
    for (var name in permutations)
    {
      names.push(name);
      var entry = permutations[name];
      
      if (entry[1]) 
      {
        var cls = getByName(entry[1]);
        var value = cls.get ? cls.get(name) : cls.VALUE;
        
        if (entry[0].indexOf(value) == -1) {
          throw new Error("Invalid value from test for " + name + ": " + value);
        }
      }
      else
      {
        // Auto-select first entry (default)
        var value = entry[0][0];
      }
      
      map[name] = value;
    }
    
    names.sort();
    
    var key = [];
    for (var i=0, l=names.length; i<l; i++) 
    {
      var name = names[i];
      key.push(name + ":" + map[name]);
    }
    
    return crc32(key.join(";"))
  })()
});
