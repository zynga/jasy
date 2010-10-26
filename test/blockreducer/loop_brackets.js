while(true)
{
  retVal = !!callback(elems[i],i);
  
  if (inv!==retVal) {
    ret.push(elems[i])
  }
}
