/**
 * Adds feets to any object 
 */
Class("ootest.Feets", {
	construct : function(feets, speed) {
		this.__feets = feets;
		this.__speed = speed || 10;
		this.__position = 0;
	},
	
	members : {
		getFeets : function() {
			return this.__feets;
		},
		
		run : function() {
			this.__position += this.__speed;
		},
		
		getPosition : function() {
			return this.__position;
		}
	}
});
