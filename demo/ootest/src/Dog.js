Class("Dog", {
	include : [Hair, Feets],
	
	construct : function() {
		Hair.call(this, "black");
		Feets.call(this, 4);
		
	}
});