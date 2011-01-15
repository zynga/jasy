(function()
{
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
    var engine = detect.ENGINE.VALUE;
    if (supportsScriptAsync || engine == "gecko" || engine == "opera")
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
  
  Core.declare("Loader",
  {
    /**
     * Checks wether the given scripts are loaded
     *
     * @param uris {String[]} URIs of script sources to check for
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
});

