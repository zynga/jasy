/**
 * This is an hairy animal which is a good friend for a lot of humans.
 */
Class("ootest.Dog", {
	include : [ootest.Hair, ootest.Feets],
	implement : [ootest.Feed],

	// Constructor to initialize fields and mixins
	construct : function(ill) {
		// Initialize mixins with parameters
		ootest.Hair.call(this, "black");
		ootest.Feets.call(this, ill ? 3 : 4);
		
		// file private field
		this.__weight = 3;
	},

	// Members will be attached to all instances
	members : {
		// interface implementation
		feed : function(amount) {
			this.__weight += (amount || 1) * 0.7;
		},
		
		// interface implementation
		getWeight : function() {
			return this.__weight;
		}
	}
});
