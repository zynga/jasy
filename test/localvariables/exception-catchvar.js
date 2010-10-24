function wrapper()
{
  var x = 1, y = x+2;
  try
  {
    something();
  }
  catch(ex)
  {
    var inCatch = 3;
    alert(ex);
    
 
  }

}
