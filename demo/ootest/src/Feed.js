/**
 * Interface to verify support for getting feed and adding weight 
 */
Interface("ootest.Feed", {
	members : {
		/**
		 * Feed the object and increase its weight.
		 */
		feed : function(amount) {},
		
		/**
		 * Returns the weight of the object
		 * 
		 * @return {Integer} Weight in pounds
		 */
		getWeight : function() {}
	}
})