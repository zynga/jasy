Class("Cat", {
	include : [Hair, Feets],
	
	construct : function() {
		Hair.call(this, "red");
		Feets.call(this, 4);
		
	}
});