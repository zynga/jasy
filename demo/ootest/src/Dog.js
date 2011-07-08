Class("ootest.Dog", {
	include : [ootest.Hair, ootest.Feets],
	
	construct : function(ill) {
		ootest.Hair.call(this, "black");
		ootest.Feets.call(this, ill ? 3 : 4);
		
	}
});