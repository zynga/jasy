(function() {
	
	var space = " ";
	
	var hasClass = function(elem, className) {
	  return elem.className && (elem.className == className || (space + elem.className + space).indexOf(space + className + space) !== -1);
	};
	


	Module("jasy.bom.ClassName",
	{
		add : function(elem, className) 
		{
			if (!hasClass(elem, className)) {
				elem.className += space + className;
			}
		},
		
		remove : function(elem, className) {
			(space + elem.className + space).replace(className, "")
		},
	
		has : hasClass
	});
	
})();
