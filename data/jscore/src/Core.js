/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010 Sebastian Werner
==================================================================================================
*/

(function(global)
{
  // Block duplicate initialization
  if (global.Core) {
    return;
  }
  
  
  var declare = function(namespace, object)
  {
    var splits = namespace.split(".");
    var current = global;
    var length = splits.length-1;
    var i = 0;
    var test;

    // Fast-check for existing segments
    while(test=current[splits[i]]) {
      current = test;
      i++;
    }

    // Create missing segments
    while(i<length) {
      current = current[splits[i++]] = {};
    }

    // Store Object
    return current[splits[i]] = object;
  };
  
  
  var globalEval = (function() 
  {
    var isIndirectEvalGlobal = (function() 
    {
      eval("var Object=1");

      try 
      {
        // Does `Object` resolve to a local variable, or to a global, built-in `Object`, 
        // reference to which we passed as a first argument?
        return global.eval('Object') === global.Object;
      }
      catch(err) 
      {
        // if indirect eval errors out (as allowed per ES3), then just bail out with `false`

        // wpbasti: not needed as it is just check for being falsy and so "undefined" is OK
        // return false;
      }
    })();

    if (isIndirectEvalGlobal) 
    {
      // if indirect eval executes code globally, use it
      return function(expression) {
        return global.eval(expression);
      };
    }
    else if (global.execScript != null) 
    {
      // if `window.execScript exists`, use it
      return function(expression) {
        return global.execScript(expression);
      };
    }

    // otherwise, globalEval is `undefined` since nothing is returned
  })();
  
  
  // ALIASES

  var toString = Object.prototype.toString;
  var doc = global.document;
  var head = doc.head || doc.getElementsByTagName("head")[0];


  
  
  // CONSTANTS
  
  var LANGUAGE = (function()
  {
    var nav = navigator;
    var input = (nav.userLanguage || nav.language).toLowerCase();
    var split = input.indexOf("-");

    return split > 0 ? input.substring(0, split) : input;
  })();
  
  
  var ENGINE = (function() 
  {
    var engine;
    var docStyle = doc.documentElement.style;
    
    if (window.opera && toString.call(opera) == "[object Opera]") {
      engine = "presto";
    } else if ("MozAppearance" in docStyle) {
      engine = "gecko";
    } else if ("WebkitAppearance" in docStyle) {
      engine = "webkit";
    } else if (typeof navigator.cpuClass === "string") {
      engine = "trident";
    }
    
    return engine;
  })();
  
  

  
  
  var load = (function()
  {
    // the following is a feature sniff for the ability to set async=false on dynamically created script elements, as proposed to the W3C
    // RE: http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    var supportsScriptAsync = doc.createElement("script").async === true;
    
    // FF(prior to FF4) & Opera preserve execution order with script tags automatically,
    // so just add all scripts as fast as possible. FF4 has async=false to do the same
    var easy = ENGINE == "gecko" || ENGINE == "opera" || supportsScriptAsync;
    
    var emptyFunction = function(){};
    
    var loaded = {};
    

    var createScriptTag = function(uri, type, charset, text, onload)
    {
      var elem = doc.createElement("script");
      
      if (type) {
        elem.type = type;
      }
      
      if (charset) {
        elem.charset = charset;
      }

      // load script via 'src' attribute, set onload/onreadystatechange listeners
      if (onload) 
      {
        elem.onload = elem.onreadystatechange = function() {
          onload(uri, elem);
        };
      }
      
      if (uri) {
        elem.src = uri;
      }
      
      if (supportsScriptAsync) {
        elem.async = false;
      }
      
      if (text) {
        elem.text = text;
      }
      
      head.insertBefore(elem, head.firstChild);
    };
    

    /**
     * Returns a custom onload routine for script elements. 
     *
     * * Supports wait list of numerous scripts which needs to be loaded
     * * Executes the given callback method (when single script or all scripts have been loaded)
     *
     * @param callback {Function?} Callback function to execute
     * @param context {Object?} Context in which the callback function should be executed
     * @param uris {Array} List of sources which should be waited for
     */
    var getOnLoad = function(callback, context, uris)
    {
      var waiting = {};
      if (uris)
      {
        for (var i=0, l=uris.length; i<l; i++) 
        {
          var currentUri = uris[i];
          if (!(currentUri in loaded)) {
            waiting[currentUri] = true;
          }
        }
      }
      
      return function(uri, elem)
      {
        if (elem.readyState && elem.readyState !== "complete" && elem.readyState !== "loaded") {
          return;
        }
        
        // Clear entry from waiting list
        delete waiting[uri];
        
        // Register as being loaded (keep at false during pre-caching)
        if (elem.type != "script/cache") {
          loaded[uri] = true;
        }
        
        // Prevent memory leaks
        elem.onload = elem.onreadystatechange = null;
        
        if (callback) 
        {
          // Check whether there are more scripts we need to wait for
          for (var uri in waiting) {
            return;
          }

          callback.call(context||global);
        }
      };      
    }
    
    
    
    if (easy)
    {
      var loader = function(uris, callback, context)
      {
        var onLoad = getOnLoad(callback, context, uris);

        for (var i=0, l=uris.length; i<l; i++)
        {
          var currentUri = uris[i];

          if (!(currentUri in loaded)) 
          {
            loaded[currentUri] = false;
            createScriptTag(currentUri, null, null, null, onLoad);
          }
        }
      };
    }
    else
    {
      var loader = function(uris, callback, context)
      {
        var executeAll = function()
        {
          var currentUri = uris.shift();
          if (!currentUri) 
          {
            if (callback) {
              callback.call(context||global);
            }
            return;
          }
          
          createScriptTag(currentUri, null, null, null, getOnLoad(executeAll));
        };
        
        var onPreload = getOnLoad(executeAll, null, uris);

        for (var i=0, l=uris.length; i<l; i++)
        {
          var currentUri = uris[i];

          if (!(currentUri in loaded)) 
          {
            loaded[currentUri] = false;
            createScriptTag(currentUri, "script/cache", null, null, onPreload);
          }
        }
      };
    }


    
    return loader;
  })();
  
  

  
  


  // ========================================================================================
  // Finally create namespace
  // ========================================================================================

  declare("Core",
  {
    /** {String} Detected language of the browser */
    LANGUAGE : LANGUAGE,
    
    /** {String} Client engine. One of <code>presto</code> (Opera), <code>gecko</code> (Firefox), <code>trident</code> (IE) or <code>webkit</code> (Safari). */
    ENGINE : ENGINE,
    
    
    /**
     * Declares the given namespace and stores the given object onto it.
     *
     * @param namespace {String} Namespace/Package e.g. foo.bar.baz
     * @param object {Object} Any object
     */
    declare : declare,


    /**
     * Executes the given code in global context
     *
     * Via:
     * http://perfectionkills.com/global-eval-what-are-the-options/#feature_testing_based_approach
     *
     * @param expression {String} Code to execute
     * @return {var} Return value of executed code
     */
    globalEval : globalEval,


    /**
     * Loads the scripts at the given URIs.
     *
     * @param uris {String[]} URIs of script sources to load
     * @param callback {Function} Function to execute when scripts are loaded
     * @param context {Object} Context in which the callback should be executed
     */
    load : load
  });
})(this);
