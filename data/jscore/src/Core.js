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
  //   METHODS :: DECLARE
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
  
  
  var getByName = function(name)
  {
    var splitted = name.split(".");
    var current = global;
    
    for (var i=0, l=splitted.length; i<l; i++) 
    {
      current = current[splitted[i]];
      if (!current) {
        throw new Error("Unknown name: " + name);
      }
    }
    
    return current;
  };
  
  
  
  // ==================================================================
  //   METHODS :: GLOBAL EVAL
  // ==================================================================
  
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
  

  // ==================================================================
  //   METHODS :: CRC32
  // ==================================================================
  
  // Inspired by: http://www.webtoolkit.info/javascript-crc32.html
  // - Removed unicode support
  // - Improved performance with numeric array lookup instead of substrings
  var crc32 = (function()
  {
    var table = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
    
    return function(str)
    {
      var crc = -1;
      for(var i=0, l=str.length; i<l; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
      }
      
      return crc ^ (-1);
    };
  })();
  
  
  
  
  // ==================================================================
  //   METHODS :: LOAD SCRIPTS
  // ==================================================================
  
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
    
    PERMUTATION : PERMUTATION,
    
    
    getByName : getByName,
    
    
    
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
     * Compute CRC-32, the 32-bit checksum of an ASCII string.
     * 
     * Unicode is not supported by this implementation!
     *
     * @param str {String} ASCII string
     * @return {Integer} Checksum
     */
    crc32 : crc32,


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
