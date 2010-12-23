/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v1.0.4 (c) Kyle Simpson
    + Refactoring for Jasy (c) Sebastian Werner
    MIT License
*/

(function(global)
{
  // Ah-ha hush that fuss, feature inference is used to detect specific browsers
  // because the techniques used in LABjs have no known feature detection. If
  // you know of a feature test please contact me ASAP. Feature inference is used
  // instead of user agent sniffing because the UA string can be easily
  // spoofed and is not adequate for such a mission critical part of the code.
  var isOpera = global.opera && Object.prototype.toString.call(global.opera) == "[object Opera]";
  var isGecko = ("MozAppearance" in document.documentElement.style);
  
  // the following is a feature sniff for the ability to set async=false on dynamically created script elements, as proposed to the W3C
  // RE: http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
  var supportsScriptAsync = (document.createElement("script").async === true);

  // For memory leak protection
  var emptyFunction = new Function;

  // 
  var append_to = {};
  var all_scripts = {};
  


  var global_defs = 
  {
    // browsers like IE/Safari/Chrome can use the "cache" trick to preload
    cache : !(isGecko||isOpera),

    // FF(prior to FF4) & Opera preserve execution order with script tags automatically,
    // so just add all scripts as fast as possible. FF4 has async=false to do the same
    order : isGecko || isOpera || supportsScriptAsync,
                          
    // use XHR trick to preload local scripts
    xhr : true, 
    
    // allow duplicate scripts? defaults to true now 'cause is slightly more performant that way (less checks)
    dupe : true, 
    
    // base path to prepend to all non-absolute-path scripts
    base : "", 
    
    // which DOM object ("head" or "body") to append scripts to
    which : "head",
    
    // force preserve execution order of all loaded scripts (regardless of preloading)
    preserve : false,
    
    // use various tricks for "preloading" scripts
    preload : true
  };
    
  append_to["head"] = document.head || document.getElementsByTagName("head");
  append_to["body"] = document.getElementsByTagName("body");
  
  function isFunc(func) { 
    return Object.prototype.toString.call(func) === "[object Function]"; 
  }
  
  // these ROOTs do not support file:/// usage, only http:// type usage
  var PAGEROOT = /^[^?#]*\//.exec(location.href)[0]; 
  
  // optional third / in the protocol portion of this regex so that LABjs doesn't blow up when used in file:/// usage
  var DOCROOT = /^\w+\:\/\/\/?[^\/]+/.exec(PAGEROOT)[0];  
  
  function canonicalScriptURI(src,base_path) 
  {
    var regex = /^\w+\:\/\//, ret; 
    if (typeof src != "string") src = "";
    if (typeof base_path != "string") base_path = "";
    ret = (regex.test(src) ? "" : base_path) + src;
    return ((regex.test(ret) ? "" : (ret.charAt(0) === "/" ? DOCROOT : PAGEROOT)) + ret);
  }
  
  function sameDomain(src) { 
    return (canonicalScriptURI(src).indexOf(DOCROOT) === 0); 
  }
  

  var docScripts = document.getElementsByTagName("script");

  function scriptTagExists(uri) 
  { 
    // checks if a script uri has ever been loaded into this page's DOM
    var script, idx=-1;
    while (script = docScripts[++idx]) {
      if (typeof script.src == "string" && uri === canonicalScriptURI(script.src) && script.type !== "script/cache") return true;
    }
    return false;
  }
  
  function engine(queueExec,opts) 
  {
    queueExec = !(!queueExec);
    if (opts == null) {
      opts = global_defs;
    }
    
    var ready = false;
    var _use_preload = queueExec && opts["preload"];
    var _use_cache_preload = _use_preload && opts.cache;
    var _use_script_order = _use_preload && opts.order;
    var _use_xhr_preload = _use_preload && opts.xhr;
    var _which = opts.which;
    var _base_path = opts.base;
    var waitFunc = emptyFunction;
    var scripts_loading = false;
    var first_pass = true;
    var scripts = {};
    var exec = [];
    var end_of_chain_check_interval = null;
    
    _use_preload = _use_cache_preload || _use_xhr_preload || _use_script_order; // if all flags are turned off, preload is moot so disable it
    
    function isScriptLoaded(elem, scriptentry) 
    {
      if ((elem.readyState && elem.readyState!=="complete" && elem.readyState!=="loaded") || scriptentry["done"]) { return false; }
      elem["onload"] = elem["onreadystatechange"] = null; // prevent memory leak
      return true;
    }
    
    function handleScriptLoad(elem, scriptentry, skipReadyCheck) 
    {
      skipReadyCheck = !(!skipReadyCheck); // used to override ready check when script text was injected from XHR preload
      if (!skipReadyCheck && !(isScriptLoaded(elem,scriptentry))) return;
      scriptentry["done"] = true;

      for (var key in scripts) {
        if (scripts["hasOwnProperty"](key) && !(scripts[key]["done"])) return;
      }
      ready = true;
      waitFunc();
    }
    
    function loadTriggerExecute(scriptentry) 
    {
      if (Object.prototype.toString.call(scriptentry.loadtrigger) === "[object Function]")
      {
        scriptentry["loadtrigger"]();
        scriptentry["loadtrigger"] = null; // prevent memory leak
      }
    }
    
    function handleScriptPreload(elem, scriptentry) 
    {
      if (!isScriptLoaded(elem,scriptentry)) return;
      scriptentry["preloaddone"] = true;
      setTimeout(function(){
        append_to[scriptentry["which"]].removeChild(elem); // remove preload script node
        loadTriggerExecute(scriptentry);
      },0);
    }
    
    function handleXHRPreload(xhr, scriptentry) 
    {
      if (xhr.readyState === 4) {
        xhr["onreadystatechange"] = emptyFunction; // fix a memory leak in IE
        scriptentry["preloaddone"] = true;
        setTimeout(function(){ loadTriggerExecute(scriptentry); },0);
      }
    }
    
    function createScriptTag(scriptentry, src, type, charset, onload, scriptText) 
    {
      var _script_which = scriptentry["which"];

      // this setTimeout waiting "hack" prevents a nasty race condition browser hang (IE) when the document.write("<script defer=true>") type dom-ready hack is present in the page
      setTimeout(function() 
      { 
        if ("item" in append_to[_script_which]) { // check if ref is still a live node list
          if (!append_to[_script_which][0]) { // append_to node not yet ready
            setTimeout(arguments.callee,25); // try again in a little bit -- note, will recall the anonymous function in the outer setTimeout, not the parent createScriptTag()
            return;
          }
          append_to[_script_which] = append_to[_script_which][0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
        }
        var scriptElem = document.createElement("script");
        if (typeof type == "string") scriptElem.type = type;
        if (typeof charset == "string") scriptElem.charset = charset;

        // load script via 'src' attribute, set onload/onreadystatechange listeners
        if (Object.prototype.toString.call(onload) === "[object Function]")
        {
          scriptElem["onload"] = scriptElem["onreadystatechange"] = function(){
            onload(scriptElem,scriptentry);
          };
          
          scriptElem.src = src;
          
          if (supportsScriptAsync) {
            scriptElem.async = false;
          }
        }
        
        // only for appending to <head>, fix a bug in IE6 if <base> tag is present -- otherwise, insertBefore(...,null) acts just like appendChild()
        append_to[_script_which].insertBefore(scriptElem,(_script_which==="head"?append_to[_script_which].firstChild:null));
        
        // script text already avaiable from XHR preload, so just inject it
        if (typeof scriptText == "string") 
        { 
          scriptElem.text = scriptText;
          
          // manually call 'load' callback function, skipReadyCheck=true
          handleScriptLoad(scriptElem,scriptentry,true); 
        }
      },0);
    }
    
    function loadScriptElem(scriptentry, src, type, charset) {
      all_scripts[scriptentry["srcuri"]] = true;
      createScriptTag(scriptentry,src,type,charset,handleScriptLoad);
    }
    
    function loadScriptCache(scriptentry, src, type, charset) 
    {
      var args = arguments;
      if (first_pass && scriptentry["preloaddone"] == null) { // need to preload into cache
        scriptentry["preloaddone"] = false;
        createScriptTag(scriptentry,src,"script/cache",charset,handleScriptPreload); // fake mimetype causes a fetch into cache, but no execution
      }
      else if (!first_pass && scriptentry["preloaddone"] != null && !scriptentry["preloaddone"]) { // preload still in progress, make sure trigger is set for execution later
        scriptentry["loadtrigger"] = function(){loadScriptCache.apply(null,args);};
      }
      else if (!first_pass) { // preload done, so reload (from cache, hopefully!) as regular script element
        loadScriptElem.apply(null,args);
      }
    }
    
    function loadScriptXHR(scriptentry, src, type, charset) 
    {
      var args = arguments, xhr;
      if (first_pass && scriptentry["preloaddone"] == null) { // need to preload
        scriptentry["preloaddone"] = false;
        xhr = scriptentry.xhr = (ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new global.XMLHttpRequest());
        xhr["onreadystatechange"] = function(){handleXHRPreload(xhr,scriptentry);};
        xhr.open("GET",src);
        xhr.send("");
      }
      else if (!first_pass && scriptentry["preloaddone"] != null && !scriptentry["preloaddone"]) {  // preload XHR still in progress, make sure trigger is set for execution later
        scriptentry["loadtrigger"] = function(){loadScriptXHR.apply(null,args);};
      }
      else if (!first_pass) { // preload done, so "execute" script via injection
        all_scripts[scriptentry["srcuri"]] = true;
        createScriptTag(scriptentry,src,type,charset,null,scriptentry.xhr.responseText);
        scriptentry.xhr = null;
      }
    }
    
    function loadScript(o) 
    {
      if (o.allowDup == null) o.allowDup = opts.dupe;
      var src = o.src, type = o.type, charset = o.charset, allowDup = o.allowDup, 
        src_uri = canonicalScriptURI(src,_base_path), scriptentry, same_domain = sameDomain(src_uri);
      if (typeof charset != "string") charset = null;
      allowDup = !(!allowDup);
      if (!allowDup && 
        (
          (all_scripts[src_uri] != null) || (first_pass && scripts[src_uri]) || scriptTagExists(src_uri)
        )
      ) {
        if (scripts[src_uri] != null && scripts[src_uri]["preloaddone"] && !scripts[src_uri]["done"] && same_domain) {
          // this script was preloaded via XHR, but is a duplicate, and dupes are not allowed
          handleScriptLoad(null,scripts[src_uri],true); // mark the entry as done and check if chain group is done
        }
        return;
      }
      if (scripts[src_uri] == null) scripts[src_uri] = {};
      scriptentry = scripts[src_uri];
      if (scriptentry["which"] == null) scriptentry["which"] = _which;
      scriptentry["done"] = false;
      scriptentry["srcuri"] = src_uri;
      scripts_loading = true;
      
      if (!_use_script_order && _use_xhr_preload && same_domain) loadScriptXHR(scriptentry,src_uri,type,charset);
      else if (!_use_script_order && _use_cache_preload) loadScriptCache(scriptentry,src_uri,type,charset);
      else loadScriptElem(scriptentry,src_uri,type,charset);
    }
    
    function onlyQueue(execBody) {
      exec.push(execBody);
    }
    
    // helper for publicAPI functions below
    function queueAndExecute(execBody) 
    { 
      if (queueExec && !_use_script_order) onlyQueue(execBody);
      if (!queueExec || _use_preload) execBody(); // if engine is either not queueing, or is queuing in preload mode, go ahead and execute
    }
    
    function serializeArgs(args) 
    {
      var sargs = [], idx;
      for (idx=-1; ++idx<args.length;) {
        if (Object.prototype.toString.call(args[idx]) === "[object Array]") sargs = sargs.concat(serializeArgs(args[idx]));
        else sargs[sargs.length] = args[idx];
      }
      return sargs;
    }
        
    var publicAPI = 
    {
      script : function() 
      {
        clearTimeout(end_of_chain_check_interval);
        var args = serializeArgs(arguments), use_engine = publicAPI, idx;

        queueAndExecute(function(){
          for (idx=-1; ++idx<args.length;) {
            loadScript((typeof args[idx] == "string") ? {src:args[idx]} : args[idx]);
          }
        });
          
        // hack to "detect" the end of the chain if a wait() is not the last call
        end_of_chain_check_interval = setTimeout(function()
        {
          first_pass = false;
        }, 5); 
        return use_engine;
      },
      
      wait : function(func) 
      {
        clearTimeout(end_of_chain_check_interval);
        first_pass = false;
        
        if (Object.prototype.toString.call(func) !== "[object Function]") {
          func = emptyFunction;
        }

        // On this current chain's waitFunc function, tack on call to trigger the queue for the *next* engine 
        // in the chain, which will be executed when the current chain finishes loading
        var e = engine(true,opts),  // 'true' tells the engine to be in queueing mode
          triggerNextChain = e.trigger, // store ref to e's trigger function for use by 'wfunc'
          wfunc = function(){ try { func(); } catch(err) {} triggerNextChain(); };
        delete e.trigger; // remove the 'trigger' property from e's public API, since only used internally
        var fn = function(){
          if (scripts_loading && !ready) waitFunc = wfunc;
          else wfunc();
        };

        if (queueExec && !scripts_loading) onlyQueue(fn);
        else queueAndExecute(fn);
        return e;
      }
    };
    
    if (queueExec) 
    {
      // if queueing, return a function that the previous chain's waitFunc function can use to trigger this 
      // engine's queue. NOTE: this trigger function is captured and removed from the public chain API before return
      publicAPI.trigger = function() {
        var fn, idx=-1;
        while (fn = exec[++idx]) fn();
        exec = []; 
      };
    }
    
    return publicAPI;
  }

  global.LAB = {
    script:function(){ // will load one or more scripts
      return engine().script.apply(null,arguments);
    },
    wait:function(){ // will ensure that the chain's previous scripts are executed before execution of scripts in subsequent chain links
      return engine().wait.apply(null,arguments);
    }
  };
  
  /* The following "hack" was suggested by Andrea Giammarchi and adapted from: http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
     NOTE: this hack only operates in FF and then only in versions where document.readyState is not present (FF < 3.6?).
     
     The hack essentially "patches" the **page** that LABjs is loaded onto so that it has a proper conforming document.readyState, so that if a script which does 
     proper and safe dom-ready detection is loaded onto a page, after dom-ready has passed, it will still be able to detect this state, by inspecting the now hacked 
     document.readyState property. The loaded script in question can then immediately trigger any queued code executions that were waiting for the DOM to be ready. 
     For instance, jQuery 1.4+ has been patched to take advantage of document.readyState, which is enabled by this hack. But 1.3.2 and before are **not** safe or 
     fixed by this hack, and should therefore **not** be lazy-loaded by script loader tools such as LABjs.
  */ 
  if (document.readyState == null && document.addEventListener)
  {
    document.readyState = "loading";
    
    var handler = function()
    {
      document.removeEventListener("DOMContentLoaded", handler, false);
      document.readyState = "complete";
    };
    
    document.addEventListener("DOMContentLoaded", handler, false);
  }
})(window);