/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * @name {document.retrieveSelector}
 */

// (C) WebReflection - Mit Style License
document.retrieveSelector = (function (filter) {

	function elementsOnly(element) {
		return element.nodeType == 1;
	}

	function createSelector(element, documentElement, path, first) {
		var nodeName = element.nodeName;
		var parentNode = element.parentNode;

		switch (true) {
			case !!element.id:
				path.push("#" + element.id);
				break;

			case first:
				first = !first;
				nodeName += ":nth-child(" + (1 + filter.call(parentNode.childNodes, elementsOnly).indexOf(element)) + ")";
				
			case element != documentElement:
				createSelector(parentNode, documentElement, path);
			
			default:
				path.push(nodeName);
				break;
		}
		
		return path;
	}

	return function retrieveSelector(element) {
		var ownerDocument = element.ownerDocument;
		return ownerDocument ? createSelector(
			element.nodeType != 1 ? element.parentNode : element,
			ownerDocument.documentElement,
			[],
			true
		).join(">") : "";
	};

}([].filter));