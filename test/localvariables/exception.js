function wrapper(param1)
{
  var b = "hello";
  
  try{
    access.an.object[param1];
    
  } 
  catch(except)
  {
    alert(except + param1)
  }
}