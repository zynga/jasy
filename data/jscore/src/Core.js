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
  
  
  
  // ==================================================================
  //   ALIASES
  // ==================================================================
  
  var toString = Object.prototype.toString;
  var doc = global.document;
  var head = doc.head || doc.getElementsByTagName("head")[0];
  
  
  
  
  // ==================================================================
  //   CONSTANTS
  // ==================================================================
  
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
    
    if (global.opera && toString.call(opera) == "[object Opera]") {
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
  
  
  
  
  // ==================================================================
  //   METHODS
  // ==================================================================
  
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
  
  
  // All loaded scripts
  var loadedScripts = {};
  var activeScripts = {};
  


  var areScriptsLoaded = function(uris) 
  {
    for (var i=0, l=uris.length; i<l; i++) 
    {
      if (!loadedScripts[uris[i]]) {
        return false;
      }
    }
    
    return true;
  };
  

  var loadScripts = (function()
  {
    // the following is a feature sniff for the ability to set async=false on dynamically created script elements, as proposed to the W3C
    // RE: http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    var supportsScriptAsync = doc.createElement("script").async === true;
    
    var preloadMimeType = "script/cache";


    /**
     * Creates and appends script tag for given URI
     *
     * @param uri {String} URI to load
     * @param onload {Function} Callback function to execute when script was loaded
     * @param type {String?null} Script type to request
     * @param charset {String?null} Specify the charset of the script
     */
    var createScriptTag = function(uri, onload, type, charset)
    {
      var elem = doc.createElement("script");
      
      if (type) {
        elem.type = type;
      }
      
      if (charset) {
        elem.charset = charset;
      }

      // load script via 'src' attribute, set onload/onreadystatechange listeners
      elem.onload = elem.onerror = elem.onreadystatechange = function(e) {
        onload(e.type, uri, elem);
      };
      
      elem.src = uri;
      
      if (supportsScriptAsync) {
        elem.async = false;
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
      // Load listener local registry of uris we wait for until we execute the callback
      var waitingScripts = {};
      if (uris)
      {
        for (var i=0, l=uris.length; i<l; i++) 
        {
          var currentUri = uris[i];
          if (!loadedScripts[currentUri]) {
            waitingScripts[currentUri] = true;
          }
        }
      }
      
      return function(type, uri, elem)
      {
        var isErrornous = type == "error";
        if (isErrornous) 
        {
          console.error("Could not load script: " + uri);
        }
        else
        {
          var readyState = elem.readyState;
          if (readyState && readyState !== "complete" && readyState !== "loaded") {
            return;
          }
        }
        
        // Prevent memory leaks
        elem.onload = elem.onerror = elem.onreadystatechange = null;
        
        // Clear entry from local waiting registry
        delete waitingScripts[uri];
        
        // Register as being loaded (keep at false during pre-caching)
        if (elem.type != preloadMimeType) 
        {
          // Delete from shared activity registry
          delete activeScripts[uri];
          
          // Add to shared loaded registry
          loadedScripts[uri] = true;
        }
        
        if (callback) 
        {
          // Check whether there are more local scripts we need to wait for
          for (var uri in waitingScripts) {
            return;
          }

          callback.call(context||global);
        }
      };
    };


    /** {Array} List of function, context where each entry consumes two array fields */
    var cachedCallbacks = [];

    /**
     * Flushes the cached callbacks as soon as no more active scripts are detected.
     * This methods is called by the different complete scenarios from the loader functions.
     */
    var flushCallbacks = function()
    {
      // Check whether all known scripts are loaded
      for (var uri in activeScripts) {
        return;
      }
      
      // Then execute all callbacks (copy to protect loop from follow-up changes)
      var todo = cachedCallbacks.concat();
      cachedCallbacks.length = 0;
      for (var i=0, l=todo.length; i<l; i+=2) {
        todo[i].call(todo[i+1]);
      }
    };

    
    // Firefox(prior to Firefox 4) & Opera preserve execution order with script tags automatically,
    // so just add all scripts as fast as possible. Firefox 4 has async=false to do the same.
    if (supportsScriptAsync || ENGINE == "gecko" || ENGINE == "opera")
    {
      var loader = function(uris, callback, context, preload)
      {
        var onLoad;
        var executeDirectly = !!callback;
        
        if (callback && !context) {
          context = global;
        }

        for (var i=0, l=uris.length; i<l; i++)
        {
          var currentUri = uris[i];
          
          if (!loadedScripts[currentUri])
          {
            // When a callback needs to be moved to the queue instead of being executed directly
            if (executeDirectly)
            {
              executeDirectly = false;
              cachedCallbacks.push(callback, context);
            }

            // When script is not being loaded already, then start with it here
            // (Otherwise we just added the callback to the queue and wait for it to be executed)
            if (!activeScripts[currentUri])
            {
              activeScripts[currentUri] = true;

              // Prepare load listener which flushes callbacks
              if (!onLoad) {
                onLoad = getOnLoad(flushCallbacks, global, uris);
              }

              createScriptTag(currentUri, onLoad);
            }
          }
        }
        
        // If all scripts are loaded already, just execute the callback
        if (executeDirectly) {
          callback.call(context);
        }
      };
    }
    else
    {
      var loader = function(uris, callback, context, preload)
      {
        var executeDirectly = !!callback;
        var queuedUris = [];
        
        if (callback && !context) {
          context = global;
        }
        
        for (var i=0, l=uris.length; i<l; i++)
        {
          var currentUri = uris[i];
          if (!loadedScripts[currentUri])
          {
            // When a callback needs to be moved to the queue instead of being executed directly
            if (executeDirectly)
            {
              executeDirectly = false;
              cachedCallbacks.push(callback, context);
            }
            
            // When script is not being loaded already, then start with it here
            // (Otherwise we just added the callback to the queue and wait for it to be executed)
            if (!activeScripts[currentUri])
            {
              activeScripts[currentUri] = true;
              queuedUris.push(currentUri);
            }
          }
        }
        
        // If all scripts are loaded already, just execute the callback
        if (executeDirectly) 
        {
          callback.call(context);
        }
        else if (queuedUris.length > 0)
        {
          var executeOneByOne = function()
          {
            var currentUri = queuedUris.shift();
            if (currentUri) 
            {
              createScriptTag(currentUri, getOnLoad(executeOneByOne));
            }
            else
            {
              flushCallbacks();
            }
          };

          if (preload)
          {
            // 1. Load all via script/cache first
            // 2. Wait for all being loaded
            // 3. Insert first script and wait for load (from cache) then continue with next one
            var onPreload = getOnLoad(executeOneByOne, global, queuedUris);
            for (var i=0, l=queuedUris.length; i<l; i++) {
              createScriptTag(queuedUris[i], onPreload, preloadMimeType);
            }
          }
          else
          {
            // Load and execute first script, then continue with next until last one
            executeOneByOne();
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
     * Checks wether the given scripts are loaded
     *
     * @param uris {String[]} URIs of script sources to load
     * @return {Boolean} Whether all given script are loaded or not.
     */
    areScriptsLoaded : areScriptsLoaded,


    /**
     * Loads the scripts at the given URIs.
     *
     * Automatically using preloading of scripts in modern browsers and falls back to sequential loading/executing on others.
     * For better performance one can enable preloading on legacy browsers as well, but this requires correctly configured servers
     * to not download identical files two times.
     *
     * @param uris {String[]} URIs of script sources to load
     * @param callback {Function} Function to execute when scripts are loaded
     * @param context {Object} Context in which the callback should be executed
     * @param preload {Boolean?false} Activates preloading on legacy browsers. As files are
     *    requested two times it's important that the server send correct modification headers.
     *    Therefore this works safely on CDNs etc. but might be problematic on local servers.
     */
    loadScripts : loadScripts
  });
})(this);
