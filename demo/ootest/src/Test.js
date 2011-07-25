var dog = new ootest.Dog;
var cat = new ootest.Cat;

for(var i=0; i<12; i++) {
	Math.random() < 0.5 ? dog.run() : cat.run();
}

if (dog.getPosition() > cat.getPosition()) {
	console.debug("Dog wins");
} else {
	console.debug("Cat wins");
}

Interface.assert(dog, ootest.Feed);
Interface.assert(cat, ootest.Feed);
