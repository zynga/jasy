(function() 
{
  var FormItem = jasy.bom.FormItem;
  
  Core.declare("jasy.bom.Form",
  {
    serialize: function(form) {
      return filter(form.elements, FormItem.isSuccessful).map(FormItem.serialize).join("&");
    }
  });
})

