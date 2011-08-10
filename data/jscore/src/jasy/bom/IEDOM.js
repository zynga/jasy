/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of Andrea Giammarchi
  Vice-Versa Project: http://code.google.com/p/vice-versa/
  MIT LICENSE
==================================================================================================
*/

/** 
 * Polyfill for useful DOM properties/methods implemented by IE first (and partly only).
 *
 * * sourceIndex => Integer
 * * innerText => String
 * * outerText => String
 * * insertAdjacentElement(where, elem)
 * * insertAdjacentHTML(where, html)
 * * insertAdjacentText(where, text)
 */
(function(global, document, map, indexOf) 
{
	if(typeof document.documentElement.sourceIndex == "undefined") 
	{
		proto.__defineGetter__("sourceIndex", function sourceIndex(){
			return indexOf.call(this.ownerDocument.getElementsByTagName("*"), this);
		});
	}

	var div = document.createElement("div");
	
	if(typeof div.innerText == "undefined")
	{
		proto.__defineGetter__("innerText", function() 
		{
			return map.call(this.childNodes, function(node){
				return node.nodeType === 3 ? node.nodeValue : node.innerText
			}).join("");
		});

		proto.__defineSetter__("innerText", function(value)
		{
			this.innerHTML = "";
			if(value) {
				this.appendChild(this.ownerDocument.createTextNode(value || ""));
			}
			return value;
		});
	};

	if(typeof div.outerText == "undefined")
	{
		proto.__defineGetter__("outerText", function() {
			return this.innerText;
		});

		proto.__defineSetter__("outerText", function(value) 
		{
			if(this.parentNode) {
				this.parentNode.replaceChild(this.ownerDocument.createTextNode(value), this);
			}

			return value;
		});
	};

	if (!div.insertAdjacentElement) 
	{
		proto.insertAdjacentElement = function(where, HTMLElement)
		{
			switch(where)
			{
				case "beforeBegin":
					this.parentNode.insertBefore(HTMLElement, this);
					break;
					
				case "afterBegin":
					this.insertBefore(HTMLElement, this.firstChild);
					break;
					
				case "beforeEnd":
					this.appendChild(HTMLElement);
					break;
					
				case "afterEnd":
					this.parentNode.insertBefore(HTMLElement, this.nextSibling);
					break;
			};

			return HTMLElement;
		};
	}

	if (!div.insertAdjacentHTML) 
	{
		proto.insertAdjacentHTML = function(where, innerHTML)
		{
			var fragment = this.ownerDocument.createDocumentFragment();
			div.innerHTML = innerHTML;

			while(div.firstChild) {
				fragment.appendChild(div.firstChild);
			}

			this.insertAdjacentElement(where, fragment);
		};
	}

	if (!div.insertAdjacentText) 
	{
		proto.insertAdjacentText = function(where, innerText) {
			this.insertAdjacentElement(where, this.ownerDocument.createTextNode(innerText));
		};
	}
})(this, document, HTMLElement.prototype, Array.prototype.map, Array.prototype.indexOf);

