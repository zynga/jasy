Class("ootest.Cat", {
	include : [ootest.Hair, ootest.Feets],
	
	construct : function() {
		ootest.Hair.call(this, "red");
		ootest.Feets.call(this, 4, 12);
		
	}
});