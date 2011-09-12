function bind(func, self, varargs)
{
  return this.create(func,
  {
    self  : self,
    args  : null
  });
};
