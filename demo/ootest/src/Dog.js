Class("ootest.Dog", {
	include : [ootest.Hair, ootest.Feets],
	
	construct : function() {
		ootest.Hair.call(this, "black");
		ootest.Feets.call(this, 4);
		
	}
});