/**
 * This is an hairy animal. Don't care a lot about humans.
 */
Class("ootest.Cat", {
	include : [ootest.Hair, ootest.Feets],
	implement : [ootest.Feed],
	
	// Constructor to initialize fields and mixins
	construct : function() {
		// Initialize mixins with parameters
		ootest.Hair.call(this, "red");
		ootest.Feets.call(this, 4, 12);
		
		// file private field		
		this.__weight = 2;
	},
	
	// Members will be attached to all instances
	members : {
		// interface implementation
		feed : function(amount) {
			this.__weight += (amount || 1) * 0.5;
		}	,

		// interface implementation
		getWeight : function() {
			return this.__weight;
		}
	}
});
