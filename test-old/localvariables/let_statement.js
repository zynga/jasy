function wrapper()
{
  var x = 5;
  var y = 0;

  let (x = x+10, y = 12, z=3) {
    print(x+y+z + "\n");
  }

  print((x + y) + "\n");
}
