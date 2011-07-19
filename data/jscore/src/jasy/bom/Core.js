Assert.add(function(value) { 
	return value && value.nodeType != undef; 
}, "isNode", "Not a node!");

Assert.add(function(value) { 
	return value && value.nodeType == 1; 
}, "isElement", "Not an element!");

Assert.add(function(value) { 
	return value && value.nodeType == 3; 
}, "isTextNode", "Not a text node!");

Assert.add(function(value) { 
	return value && value.nodeType == 9; 
}, "isDocument", "Not a document!");

