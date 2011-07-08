Class("ootest.Cat", {
	include : [ootest.Hair, ootest.Feets],
	implement : [ootest.Feed],
		
	construct : function() {
		ootest.Hair.call(this, "red");
		ootest.Feets.call(this, 4, 12);
		
		this.__weight = 2;
	},
	
	members : {
		feed : function() {
			this.__weight += 1;
		}	,

		getWeight : function() {
			return this.__weight;
		}
	}
});