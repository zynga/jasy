Class("ootest.Dog", {
	include : [ootest.Hair, ootest.Feets],
	implement : [ootest.Feed],
	
	construct : function(ill) {
		ootest.Hair.call(this, "black");
		ootest.Feets.call(this, ill ? 3 : 4);
		
		this.__weight = 3;
	},

	members : {
		feed : function() {
			this.__weight += 2;
		},
		
		getWeight : function() {
			return this.__weight;
		}
	}
});