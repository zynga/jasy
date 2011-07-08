/**
 * Adds hair to any object
 */
Class("ootest.Hair", {
	construct : function(color) {
		this.__color = color;
	},
	
	members : {
		getHairColor : function() {
			return this.__color;
		}
	}
});
