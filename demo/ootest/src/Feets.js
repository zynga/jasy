Class("Feets", {
	construct : function(feets) {
		this.__feets = feets;
	},
	
	members : {
		getFeets : function() {
			return this.__feets;
		}
	}
});
