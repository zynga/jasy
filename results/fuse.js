/* FuseJS JavaScript framework, version Alpha
 * (c) 2008-2010 John-David Dalton
 *
 * Prototype JavaScript framework, version 1.6.0.2
 * (c) 2005-2010 Sam Stephenson
 *
 * FuseJS and Prototype are distributed under an MIT-style license.
 * For details, see the FuseJS website: <http://www.fusejs.com/license.txt>
 * or the Prototype website: <http://www.prototypejs.org>
 *
 * Built: Tue. Oct 26 2010 17:05:17 CEST
 * ----------------------------------------------------------------------------*/

(function(window) {

  // private vars
  var CHECKED_INPUT_TYPES, CONTROL_PLUGINS, DATA_ID_PROP, EVENT_TYPE_ALIAS,
   INPUT_BUTTONS, PARENT_NODE, PARENT_WINDOW, Node, NodeList, Element,
   HTMLDocument, HTMLElement, HTMLButtonElement, HTMLFormElement,
   HTMLInputElement, HTMLOptionElement, HTMLSelectElement, HTMLTextAreaElement,
   Window, destroyElement, domData, eachKey, emptyElement, envAddTest, envTest,
   extendByTag, fromElement, getDocument, getFragmentFromHTML, getFuseId,
   getNodeName, getScriptText, getWindow, getOrCreateTagClass, hasKey, isArray,
   isElement, isHash, isNumber, isPrimitive, isRegExp, isString, returnOffset,
   runScriptText, setScriptText, undef,

  DOCUMENT_FRAGMENT_NODE = 11,

  DOCUMENT_NODE = 9,

  ELEMENT_NODE = 1,

  TEXT_NODE = 3,

  ARRAY_CLASS    = '[object Array]',

  BOOLEAN_CLASS  = '[object Boolean]',

  DATE_CLASS     = '[object Date]',

  FUNCTION_CLASS = '[object Function]',

  NUMBER_CLASS   = '[object Number]',

  OBJECT_CLASS   = '[object Object]',

  REGEXP_CLASS   = '[object RegExp]',

  STRING_CLASS   = '[object String]',

  CLASS = '[[Class]]',

  PROTO = '__proto__',

  IDENTITY = function IDENTITY(x) { return x; },

  NOOP = function NOOP() { },

  NON_HOST_TYPES = { 'boolean': 1, 'number': 1, 'string': 1, 'undefined': 1 },

  ORIGIN = '__origin__',

  slice = [].slice,

  setTimeout = window.setTimeout,

  uid = 'uid' + String(+new Date).slice(0, 12),

  userAgent = window.navigator && navigator.userAgent || '',

  addNodeListMethod = NOOP,

  capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  cloneMethod = (function() {
    function cloneMethod(method, origin) {
      var result, source = String(method);
      if (!cloneMethod.reName) {
        // init props on method to avoid problems when cloning itself
        cloneMethod.reName = /^[\s\(]*function([^(]*)\(/;
        cloneMethod.varOrigin = String(function() { return ORIGIN })
          .match(/return\s+([^}\s]*)/)[1];
      }
      result = Function(
        'var ' + cloneMethod.varOrigin + '="' +
        ORIGIN + '";' + source + '; return ' +
        source.match(cloneMethod.reName)[1])();

      origin && method[ORIGIN] && (result[ORIGIN] = origin);
      return result;
    }

    try {
      if (String(cloneMethod(cloneMethod)(cloneMethod)).indexOf('cloneMethod') < 0) {
        throw 1;
      }
      return cloneMethod;
    }
    catch (e) {
      return function(method, origin) {
        return function() {
          var result, backup = method[ORIGIN];
          backup && (method[ORIGIN] = origin);
          result = method.apply(this, arguments);
          backup && (method[ORIGIN] = backup);
          return result;
        };
      }
    }
  })(),

  concatList = function(list, otherList) {
    var pad = list.length, length = otherList.length;
    while (length--) list[pad + length] = otherList[length];
    return list;
  },

  createGetter = function(name, value) {
    return Function('v', 'function ' + name + '(){return v;} return ' + name)(value);
  },

  debug = (function() {
    var match, script, doc = window.document, i = -1,
     reSrcDebug = /(?:^|&)(debug)(?:=(.*?))?(?:&|$)/,
     reFilename = /(^|\/)fuse\b.*?\.js\?/,
     scripts = doc && doc.getElementsByTagName('script') || [],
     query = window.location && location.search;

    if (!(match = query.match(/(?:\?|&)(fusejs_debug)(?:=(.*?))?(?:&|$)/))) {
      while (script = scripts[++i]) {
        if (reFilename.test(script.src) &&
            (match = (script.src.split('?')[1] || '').match(reSrcDebug))) {
          break;
        }
      }
    }
    return !!match && (match[2] == null ? true : isNaN(+match[2]) ? match[2] : +match[2]);
  })(),

  escapeRegExpChars = (function() {
    var reSpecialChars = /([.*+?^=!:${}()|[\]\/\\])/g;
    return function(string) {
      return String(string).replace(reSpecialChars, '\\$1');
    };
  })(),

  isFunction = function isFunction(value) {
    return toString.call(value) == FUNCTION_CLASS;
  },

  // Host objects can return type values that are different from their actual
  // data type. The objects we are concerned with usually return non-primitive
  // types of object, function, or unknown.
  isHostType = function isHostType(object, property) {
    var type = typeof object[property];
    return type == 'object' ? !!object[property] : !NON_HOST_TYPES[type];
  },

  prependList = function(list, value, result) {
    (result || (result = []))[0] = value;
    var length = list.length;
    while (length--) result[1 + length] = list[length];
    return result;
  },

  // ES5 9.4 ToInteger implementation
  toInteger = function(object) {
    // avoid issues with numbers larger than
    // Math.pow(2, 31) against bitwise operators
    var number = +object;
    return number === 0 || !isFinite(number)
      ? number || 0
      : Math.abs(number) < 2147483648 ? number | 0 : number - (number % 1);
  },

  // used to access an object's internal [[Class]] property
  // redefined later if there is no issues grabbing sandboxed natives [[Class]]
  toString = {
    'call': (function() {
      var __toString = {}.toString;
      return function(object) {
        return object != null && object[CLASS] || __toString.call(object);
      };
    })()
  };

  window.fuse = (function() {
    function fuse() { };
    return fuse;
  })();

  /*--------------------------------------------------------------------------*/

  (function() {
    var addNS = function addNS(path) {
      var Klass, key, i = -1,
       object = this,
       keys   = path.split('.'),
       length = keys.length;

      while (key = keys[++i]) {
        if (!object[key]) {
          Klass = fuse.Class(object.constructor.superclass || object, { 'constructor': key });
          object = object[key] = new Klass;
          object.plugin = Klass.plugin;
        } else {
          object = object[key];
        }
      }
      return object;
    },

    getNS = function getNS(path) {
      var key, i = -1, keys = path.split('.'), object = this;
      while (key = keys[++i])
        if (!(object = object[key])) return false;
      return object;
    },

    updateGenerics = function updateGenerics(path, deep) {
      var paths, object, i = -1;
      if (isString(paths)) paths = [paths];
      if (!isArray(paths)) deep  = path;
      if (!paths) paths = ['Array', 'Date', 'Number', 'Object', 'RegExp', 'String', 'dom.Event', 'dom.Node'];

      while (path = paths[++i]) {
        object = isString(path) ? fuse.getNS(path) : path;
        if (object) {
          if (isFunction(object.updateGenerics)) object.updateGenerics();
          deep && updateSubClassGenerics(object);
        }
      }
    },

    updateSubClassGenerics = function(object) {
      var subclass, subclasses = object.subclasses || [], i = -1;
      while (subclass = subclasses[++i]) {
        if (isFunction(subclass.updateGenerics)) subclass.updateGenerics();
        updateSubClassGenerics(subclass);
      }
    };

    fuse.getNS =
    fuse.prototype.getNS = getNS;

    fuse.addNS =
    fuse.prototype.addNS = addNS;

    // deleted later
    fuse.uid = uid;

    fuse.debug = debug;
    fuse.version = 'Alpha';
    fuse.updateGenerics = updateGenerics;
  })();

  /*--------------------------- ENVIRONMENT OBJECT ---------------------------*/

  fuse.env = {
    'agent': {
      'Gecko':        userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') < 0,
      'Opera':        /Opera/.test(toString.call(window.opera)),
      'MobileSafari': userAgent.search(/AppleWebKit.*Mobile/) > -1,
      'WebKit':       userAgent.indexOf('AppleWebKit/') > -1
    }
  };

  fuse.env.agent.IE = !fuse.env.agent.Opera &&
    userAgent.indexOf('MSIE') > -1 && isHostType(window, 'attachEvent');
  /*--------------------------- FEATURE/BUG TESTER ---------------------------*/

  (function(env) {
    var cache = { },

    addTest = function addTest(name, value) {
      if (typeof name == 'object') {
        for (var i in name) cache[i] = name[i];
      } else cache[name] = value;
    },

    removeTest = function removeTest(name) {
      name = name.valueOf();
      if (typeof name == 'string') delete cache[name];
      else { for (var i in name) delete cache[i]; }
    },

    test = function test(name) {
      var i = 0;
      while (name = arguments[i++]) {
        if (typeof cache[name] == 'function') {
          cache[name] = cache[name]();
        }
        if (cache[name] != true) {
          return false;
        }
      }
      return true;
    };

    envAddTest =
    env.addTest = addTest;

    envTest =
    env.test = test;

    env.removeTest = removeTest;
  })(fuse.env);

  /*-------------------------- LANG FEATURES / BUGS --------------------------*/

  envAddTest({
    'ACTIVE_X_OBJECT': function() {
      // true for IE
      return isHostType(window, 'ActiveXObject');
    },

    'JSON': function() {
      // true for IE8 and newer browsers
      return typeof window.JSON == 'object' &&
        typeof JSON.parse == 'function' &&
        typeof JSON.stringify == 'function' &&
        typeof JSON.stringify(NOOP) == 'undefined' &&
        JSON.stringify(0) === '0' && !!JSON.parse('{ "x": true }').x;
    },

    'OBJECT__PROTO__': function() {
      // true for Gecko and Webkit
      var result, arr = [], obj = { }, backup = arr[PROTO];
      if (arr[PROTO] == Array.prototype  &&
          obj[PROTO] == Object.prototype) {
        // test if it's writable and restorable
        arr[PROTO] = obj;
        result = typeof arr.push == 'undefined';
        arr[PROTO] = backup;
        return result && typeof arr.push == 'function';
      }
    },

    'STRING_REPLACE_COERCE_FUNCTION_TO_STRING': function() {
      // true for Safari 2
      var func = function() { return ''; };
      return 'x'.replace(/x/, func) == String(func);
    },

    'STRING_SPLIT_BUGGY_WITH_REGEXP': function() {
      // true for IE
      return 'x'.split(/x/).length != 2 || 'oxo'.split(/x(y)?/).length != 3;
    }
  });
  /*----------------------------- LANG: FUSEBOX ------------------------------*/

  fuse.Fusebox = (function() {

    var CLEANED_ACTIVEX, IS_MAP_CORRUPT, MODE,

    cache = [ ],

    counter = 1,

    doc = window.document,

    ACTIVEX_MODE = 1,

    PROTO_MODE   = 2,

    IFRAME_MODE  = 3,

    HAS_ACTIVEX = (function() {
      try {
        // ensure ActiveX is enabled
        return envTest('ACTIVE_X_OBJECT') && !!new ActiveXObject('htmlfile');
      } catch (e) {
        return false;
      }
    })(),

    HAS_IFRAME = doc && isHostType(doc, 'createElement') &&
      isHostType(window, 'frames') && 'src' in doc.createElement('iframe'),

    HAS_PROTO = envTest('OBJECT__PROTO__'),

    Fusebox = function Fusebox(instance) {
      instance = createFusebox(instance);
      return postProcess(instance);
    },

    Klass = function() { },

    postProcess = IDENTITY,

    postProcessIframe = function(instance) {
      postProcess =
      postProcessIframe = function(instance) {
        var iframe = cache[cache.length - 1];
        iframe.parentNode.removeChild(iframe);
        return instance;
      };

      postProcessIframe(instance);

      return (function() {
        var errored, toString = instance.Object().toString;

        // Safari does not support sandboxed natives from iframes :(
        if (instance.Array().constructor == Array) {
          errored = true;
          destroyIframe(cache.pop());

          if (HAS_ACTIVEX) {
            setMode(ACTIVEX_MODE);
          } else if (HAS_PROTO) {
            setMode(PROTO_MODE);
          }
        }
        // Opera 9.5 - 10a throws a security error when calling Array#map or
        // String#lastIndexOf on sandboxed natives created on the file:// protocol.
        //
        // Opera 9.5 - 9.64 will error by simply calling the methods.
        // Opera 10 will error when first accessing the contentDocument of
        // another iframe and then accessing the methods.
        else if (toString.call(instance.Array().map) == FUNCTION_CLASS) {
          // create and remove second iframe
          postProcessIframe(createSandbox());

          // test to see if Array#map is corrupted
          try {
            instance.Array().map(NOOP);
          } catch (e) {
            IS_MAP_CORRUPT = errored = true;
            destroyIframe(cache.pop());
          }
          destroyIframe(cache.pop());
        }
        return errored ? Fusebox(instance) : instance;
      })();
    },

    destroyIframe = function(iframe) {
      setTimeout(function() { destroyElement(iframe) }, 10);
    },

    getMode = function() {
      return MODE;
    },

    setMode = function(mode) {
      MODE = +mode;
      postProcess = MODE == IFRAME_MODE ? postProcessIframe : IDENTITY;
    },

    createSandbox = function() {
      var iframe, key, name, parentNode, result, xdoc;

      switch (MODE) {
        case PROTO_MODE: return window;

        case ACTIVEX_MODE:
          // IE requires the iframe/htmlfile remain in the cache or
          // it will become corrupted
          xdoc = new ActiveXObject('htmlfile');
          xdoc.write('<script><\/script>');
          xdoc.close();
          cache.push(xdoc);

          // prevents a memory leak in IE
          // IE doesn't support bfcache so we don't have to worry about breaking it.
          if (!CLEANED_ACTIVEX) {
            CLEANED_ACTIVEX = true;
            if (isHostType(window, 'attachEvent')) {
              attachEvent('onunload', function() { cache.length = 0 });
            }
          }
          return xdoc.parentWindow;

        case IFRAME_MODE:
          key = '/* fuse_iframe_cache_fix */';
          name = uid + counter++;
          parentNode = doc.body || doc.documentElement;

          try {
            // set name attribute for IE6/7
            iframe = doc.createElement('<iframe name="' + name + '">');
          } catch(e) {
            (iframe = doc.createElement('iframe')).name = name;
          }

          try {
            // Detect caching bug in Firefox 3.5+
            // A side effect is that Firefox will use the __proto__ technique
            // when served from the file:// protocol as well
            if ('MozOpacity' in doc.documentElement.style &&
                isHostType(window, 'sessionStorage') &&
                !sessionStorage[key]) {
              sessionStorage[key] = 1;
              throw new Error;
            }

            // IE / Opera 9.25 throw security errors when trying to write to an iframe
            // after the document.domain is set. Also Opera < 9 doesn't support
            // inserting an iframe into the document.documentElement.
            iframe.style.display = 'none';
            parentNode.insertBefore(iframe, parentNode.firstChild);

            result = window.frames[name];
            xdoc = result.document;
            xdoc.write(
              // Firefox 3.5+ glitches when an iframe is inserted and removed,
              // from a page containing other iframes, before dom load.
              // When the page loads one of the other iframes on the page will have
              // its content swapped with our iframe. Though the content is swapped,
              // the iframe will persist its `src` property so we check if our
              // iframe has a src property and load it if found.
              '<script>var c=function(s){' +
              '(s=frameElement.src)&&location.replace(s);' +
              'if(parent.document.readyState!="complete"){setTimeout(c,10)}};' +
              'c()<\/script>');

            xdoc.close();
            cache.push(iframe);
            return result;
          }
          catch (e) {
            if (HAS_ACTIVEX) {
              setMode(ACTIVEX_MODE);
              return createSandbox();
            }
            if (HAS_PROTO) {
              setMode(PROTO_MODE);
              return createSandbox();
            }
            throw new Error('fuse.Fusebox() failed to create a sandbox by iframe.');
          }
      }
      throw new Error('fuse.Fusebox() failed to create a sandbox.');
    },

    createFusebox = function(instance) {
      // Most methods try to follow ES5 spec but may differ from
      // the documented method.length value.
      var Array, Boolean, Date, Function, Number, Object, RegExp, String, reStrict,
       sandbox              = createSandbox(),
       glFunction           = window.Function,
       isProtoMode          = MODE == PROTO_MODE,
       isArrayChainable     = sandbox.Array().constructor !== window.Array,
       isRegExpChainable    = sandbox.RegExp('').constructor !== window.RegExp,
       arrPlugin            = isProtoMode && new sandbox.Array    || sandbox.Array.prototype,
       boolPlugin           = isProtoMode && new sandbox.Boolean  || sandbox.Boolean.prototype,
       datePlugin           = isProtoMode && new sandbox.Date     || sandbox.Date.prototype,
       funcPlugin           = isProtoMode && new sandbox.Function || sandbox.Function.prototype,
       numPlugin            = isProtoMode && new sandbox.Number   || sandbox.Number.prototype,
       objPlugin            = isProtoMode && new sandbox.Object   || sandbox.Object.prototype,
       regPlugin            = isProtoMode && new sandbox.RegExp   || sandbox.RegExp.prototype,
       strPlugin            = isProtoMode && new sandbox.String   || sandbox.String.prototype,
       __Array              = sandbox.Array,
       __Boolean            = sandbox.Boolean,
       __Date               = sandbox.Date,
       __Function           = sandbox.Function,
       __Number             = sandbox.Number,
       __Object             = sandbox.Object,
       __RegExp             = sandbox.RegExp,
       __String             = sandbox.String,
       __concat             = arrPlugin.concat,
       __join               = arrPlugin.join,
       __push               = arrPlugin.push,
       __reverse            = arrPlugin.reverse,
       __slice              = arrPlugin.slice,
       __splice             = arrPlugin.splice,
       __some               = arrPlugin.some,
       __sort               = arrPlugin.sort,
       __unshift            = arrPlugin.unshift,
       __getDate            = datePlugin.getDate,
       __getDay             = datePlugin.getDay,
       __getFullYear        = datePlugin.getFullYear,
       __getHours           = datePlugin.getHours,
       __getMilliseconds    = datePlugin.getMilliseconds,
       __getMinutes         = datePlugin.getMinutes,
       __getMonth           = datePlugin.getMonth,
       __getSeconds         = datePlugin.getSeconds,
       __getTime            = datePlugin.getTime,
       __getTimezoneOffset  = datePlugin.getTimezoneOffset,
       __getUTCDate         = datePlugin.getUTCDate,
       __getUTCDay          = datePlugin.getUTCDay,
       __getUTCFullYear     = datePlugin.getUTCFullYear,
       __getUTCHours        = datePlugin.getUTCHours,
       __getUTCMilliseconds = datePlugin.getUTCMilliseconds,
       __getUTCMinutes      = datePlugin.getUTCMinutes,
       __getUTCMonth        = datePlugin.getUTCMonth,
       __getUTCSeconds      = datePlugin.getUTCSeconds,
       __getYear            = datePlugin.getYear,
       __toISOString        = datePlugin.toISOString,
       __toJSON             = datePlugin.toJSON,
       __toExponential      = numPlugin.toExponential,
       __toFixed            = numPlugin.toFixed,
       __toPrecision        = numPlugin.toPrecision,
       __exec               = regPlugin.exec,
       __charAt             = strPlugin.charAt,
       __charCodeAt         = strPlugin.charCodeAt,
       __strConcat          = strPlugin.concat,
       __strIndexOf         = strPlugin.indexOf,
       __localeCompare      = strPlugin.localeCompare,
       __match              = strPlugin.match,
       __replace            = strPlugin.replace,
       __search             = strPlugin.search,
       __strSlice           = strPlugin.slice,
       __substr             = strPlugin.substr,
       __substring          = strPlugin.substring,
       __toLowerCase        = strPlugin.toLowerCase,
       __toLocaleLowerCase  = strPlugin.toLocaleLowerCase,
       __toLocaleUpperCase  = strPlugin.toLocaleUpperCase,
       __toUpperCase        = strPlugin.toUpperCase,
       __split              = window.String().split,
       __strLastIndexOf     = window.String().lastIndexOf,
       __every              = arrPlugin.every,
       __filter             = arrPlugin.filter,
       __indexOf            = arrPlugin.indexOf,
       __lastIndexOf        = arrPlugin.lastIndexOf,
       __map                = IS_MAP_CORRUPT ? window.Array().map : arrPlugin.map,
       __trim               = strPlugin.trim,
       __trimLeft           = strPlugin.trimLeft,
       __trimRight          = strPlugin.trimRight;

      instance || (instance = new Klass);

      function from(value) {
        var classOf = toString.call(value);
        switch (classOf) {
          case ARRAY_CLASS:
            if (value.constructor != instance.Array) {
              return instance.Array.fromArray(value);
            }
            break;

          case BOOLEAN_CLASS:
            if (value.constructor != instance.Boolean) {
              return instance.Boolean(value == true);
            }
            break;

          case REGEXP_CLASS:
            if (value.constructor != instance.RegExp) {
              return instance.RegExp(value.source,
                (value.global     ? 'g' : '') +
                (value.ignoreCase ? 'i' : '') +
                (value.multiline  ? 'm' : ''));
            }
            break;

          case DATE_CLASS   :
          case NUMBER_CLASS :
          case STRING_CLASS :
            classOf = classOf.slice(8,-1);
            if (value.constructor != instance[classOf]) {
              return new instance[classOf](value);
            }
        }
        return value;
      }

      /*------------------------ CREATE CONSTRUCTORS -------------------------*/

      if (isProtoMode) {
        Array = function Array(length) {
          var result = [], argLen = arguments.length;
          if (argLen) {
            if (argLen == 1 && typeof length == 'number') {
              result.length = length;
            } else {
              result.push.apply(result, arguments);
            }
          }
          result[PROTO] = arrPlugin;
          return result;
        };

        Boolean = function Boolean(value) {
          var result = new __Boolean(value);
          result[PROTO] = boolPlugin;
          return result;
        };

        Date = function Date(year, month, date, hours, minutes, seconds, ms) {
          var result;
          if (this.constructor == Date) {
            result = arguments.length == 1
              ? new __Date(year)
              : new __Date(year, month, date || 1, hours || 0, minutes || 0, seconds || 0, ms || 0);
            result[PROTO] = datePlugin;
          } else {
            result = instance.String(new __Date);
          }
          return result;
        };

        Function = function Function(argN, body) {
          var result = arguments.length < 3
            ? __Function(argN, body)
            : __Function.apply(__Function, arguments);
          result[PROTO] = funcPlugin;
          return result;
        };

        Number = function Number(value) {
          var result = new __Number(value);
          result[PROTO] = numPlugin;
          return result;
        };

        Object = function Object(value) {
          if (value != null) {
            return from(value);
          }
          var result = new __Object;
          result[PROTO] = objPlugin;
          return result;
        };

        RegExp = function RegExp(pattern, flags) {
          var result = new __RegExp(pattern, flags);
          result[PROTO] = regPlugin;
          return result;
        };

        String = function String(value) {
          var result = new __String(arguments.length ? value : '');
          result[PROTO] = strPlugin;
          return result;
        };
      }
      else {
        Array = function Array(length) {
          var argLen = arguments.length;
          if (argLen) {
            return argLen == 1 && typeof length == 'number'
              ? new __Array(length)
              : Array.fromArray(arguments);
          }
          return new __Array;
        };

        Boolean = function Boolean(value) {
          return new __Boolean(value);
        };

        Date = function Date(year, month, date, hours, minutes, seconds, ms) {
          if (this.constructor == Date) {
           return arguments.length == 1
             ? new __Date(year)
             : new __Date(year, month, date || 1, hours || 0, minutes || 0, seconds || 0, ms || 0);
          }
          return instance.String(new __Date);
        };

        Function = function Function(argN, body) {
          var fn, result, args = __slice.call(arguments, 0),
           toString = function toString() { return originalBody; },
           originalBody = body = args.pop();

          // ensure we aren't in strict mode and map arguments.callee to the wrapper
          if (body && !reStrict.test(body)) {
            body = 'arguments.callee = arguments.callee.' + uid + '; ' + body;
          }

          // create function using window.Function constructor
          fn = new glFunction(args.join(','), body);

          // ensure `thisArg` isn't set to the sandboxed global
          result = fn[uid] = new __Function('window, fn',
            'var sb=this;' +
            'return function(){' +
            'return fn.apply(this==sb?window:this,arguments)' +
            '}')(window, fn);

          // make toString() return the unmodified function body
          result.toString = toString;

          return result;
        };

        Number = function Number(value) {
          return new __Number(value);
        };

        Object = function Object(value) {
          return value != null ? from(value) : new __Object;
        };

        RegExp = function RegExp(pattern, flags) {
          return new __RegExp(pattern, flags);
        };

        String = function String(value) {
          return new __String(arguments.length ? value : '');
        };

        if (isArrayChainable) {
          Array  = __Array;
        }
        if (isRegExpChainable) {
          RegExp = __RegExp;
        }
      }


      /*---------------------------- ADD STATICS -----------------------------*/

      Function.FALSE    = function FALSE() { return false };

      Function.TRUE     = function TRUE() { return true };

      Function.IDENTITY = IDENTITY;

      Function.NOOP     = NOOP;

      Number.MAX_VALUE  = 1.7976931348623157e+308;

      Number.MIN_VALUE  = 5e-324;

      Number.NaN        = NaN;

      Number.NEGATIVE_INFINITY = -Infinity;

      Number.POSITIVE_INFINITY = Infinity;

      RegExp.SPECIAL_CHARS = {
        's': {
          // whitespace
          '\x09': '\\x09', '\x0B': '\\x0B', '\x0C': '\\x0C', '\x20': '\\x20', '\xA0': '\\xA0',

          // line terminators
          '\x0A': '\\x0A', '\x0D': '\\x0D', '\u2028': '\\u2028', '\u2029': '\\u2029',

          // unicode category "Zs" space separators
          '\u1680': '\\u1680', '\u180e': '\\u180e', '\u2000': '\\u2000',
          '\u2001': '\\u2001', '\u2002': '\\u2002', '\u2003': '\\u2003',
          '\u2004': '\\u2004', '\u2005': '\\u2005', '\u2006': '\\u2006',
          '\u2007': '\\u2007', '\u2008': '\\u2008', '\u2009': '\\u2009',
          '\u200a': '\\u200a', '\u202f': '\\u202f', '\u205f': '\\u205f',
          '\u3000': '\\u3000'
        }
      };

      Array.fromArray = function fromArray(array) {
        var result = new __Array;
        result.push.apply(result, array);
        return result;
      };

      Date.now = function now() {
        return instance.Number(__Date.now());
      };

      // ES5 15.9.4.2
      Date.parse = function parse(dateString) {
        return instance.Number(__Date.parse(dateString));
      };

      // ES5 15.9.4.3
      Date.UTC = function UTC(year, month, date, hours, minutes, seconds, ms) {
        return instance.Number(__Date.UTC(year, month, date || 1, hours || 0, minutes || 0, seconds || 0, ms || 0));
      };

      // ES5 15.5.3.2
      String.fromCharCode = function fromCharCode(charCode) {
        return String(arguments.length > 1
          ? __String.fromCharCode.apply(__String, arguments)
          : __String.fromCharCode(charCode));
      };

      // ES5 15.4.3.2
      if (!isFunction(Array.isArray = __Array.isArray)) {
        Array.isArray = function isArray(value) {
          return toString.call(value) == ARRAY_CLASS;
        };
      }

      // ES5 15.9.4.4
      if (!isFunction(__Date.now)) {
        Date.now = function now() {
          return instance.Number(+new __Date());
        };
      }

      if (isProtoMode) {
        Array.fromArray = function fromArray(array) {
          var result = __slice.call(array, 0);
          result[PROTO] = arrPlugin;
          return result;
        };
      } else if (isArrayChainable) {
        Array.fromArray = function fromArray(array) {
          return __slice.call(array, 0);
        };
      }

      // versions of WebKit and IE have non-spec-conforming /\s/
      // so we standardize it (see: ES5 15.10.2.12)
      // http://www.unicode.org/Public/UNIDATA/PropList.txt
      RegExp = (function(RE) {
        var character,
         RegExp = RE,
         reCharClass = /\\s/g,
         newCharClass = [],
         charMap = RE.SPECIAL_CHARS.s;

        // catch whitespace chars that are missed by erroneous \s
        for (character in charMap) {
          if (character.replace(/\s/, '').length)
            newCharClass.push(charMap[character]);
        }

        if (newCharClass.length) {
          newCharClass.push('\\s');
          newCharClass = '(?:' + newCharClass.join('|') + ')';

          // redefine RegExp to auto-fix \s issues
          RegExp = function RegExp(pattern, flags) {
            return new RE((toString.call(pattern) == REGEXP_CLASS ?
              pattern.source : window.String(pattern))
                .replace(reCharClass, newCharClass), flags);
          };

          // map properties of old RegExp to the redefined one
          RegExp.SPECIAL_CHARS = RE.SPECIAL_CHARS;
        }

        return RegExp;
      })(RegExp);

      // find the strict mode directive which may be preceded by comments or whitespace
      reStrict = RegExp('^(?:/\\*+[\\w|\\W]*?\\*/|//.*?[\\n\\r\\u2028\\u2029]|\\s)*(["\'])use strict\\1');

      /*-------------------------- ADD CHAINABILITY --------------------------*/

      if (isFunction(arrPlugin.filter)) {
        if (!isArrayChainable) {
          arrPlugin.filter = function filter(callback, thisArg) {
            var result = __filter.call(this, callback, thisArg);
            return result.length ? Array.fromArray(result) : Array();
          };
        }
        arrPlugin.filter.raw = __filter;
      }

      if (isFunction(arrPlugin.indexOf)) {
        (arrPlugin.indexOf = function indexOf(item, fromIndex) {
          return instance.Number(__indexOf.call(this, item,
            fromIndex == null ? 0 : fromIndex));
        }).raw = __indexOf;
      }

      if (isFunction(arrPlugin.lastIndexOf)) {
        (arrPlugin.lastIndexOf = function lastIndexOf(item, fromIndex) {
          return instance.Number(__lastIndexOf.call(this, item,
            fromIndex == null ? this.length : fromIndex));
        }).raw = __lastIndexOf;
      }

      if (isFunction(arrPlugin.map)) {
        if (IS_MAP_CORRUPT || !isArrayChainable) {
          arrPlugin.map = function map(callback, thisArg) {
            var result = __map.call(this, callback, thisArg);
            return result.length ? Array.fromArray(result) : Array();
          };
        }
        arrPlugin.map.raw = __map;
      }

      if (isFunction(datePlugin.toISOString)) {
        (datePlugin.toISOString = function toISOString() {
          return instance.String(__toISOString.call(this));
        }).raw = __toISOString;
      }

      if (isFunction(datePlugin.toJSON)) {
        (datePlugin.toJSON = function toJSON() {
          return instance.String(__toJSON.call(new window.Date(this)));
        }).raw = __toJSON;
      }

      if (isFunction(strPlugin.trim)) {
        (strPlugin.trim = function trim() {
          return String(__trim.call(this));
        }).raw = __trim;
      }
      if (isFunction(strPlugin.trimLeft)) {
        (strPlugin.trimLeft = function trimLeft() {
          return String(__trimLeft.call(this));
        }).raw = __trimLeft;
      }

      if (isFunction(strPlugin.trimRight)) {
        (strPlugin.trimRight = function trimRight() {
          return String(__trimRight.call(this));
        }).raw = __trimRight;
      }

      if (!isArrayChainable) {
        arrPlugin.concat = function concat() {
          return Array.fromArray(arguments.length
            ? __concat.apply(this, arguments)
            : __concat.call(this));
        };

        arrPlugin.reverse = function reverse() {
          return this.length > 0
            ? Array.fromArray(__reverse.call(this))
            : Array();
        };

        arrPlugin.slice = function slice(start, end) {
          var result = __slice.call(this, start, end == null ? this.length : end);
          return result.length
            ? Array.fromArray(result)
            : Array();
        };

        arrPlugin.splice = function splice(start, deleteCount) {
          var result = __splice.apply(this, arguments);
          return result.length
            ? Array.fromArray(result)
            : Array();
        };
      }

      (arrPlugin.join = function join(separator) {
        return String(__join.call(this, separator));
      }).raw = __join;

      (arrPlugin.push = function push(item) {
        return instance.Number(arguments.length > 1
          ? __push.apply(this, arguments)
          : __push.call(this, item));
      }).raw = __push;

      (arrPlugin.unshift = function unshift(item) {
        return instance.Number(arguments.length > 1
          ? __unshift.apply(this, arguments)
          : __unshift.call(this, item));
      }).raw = __unshift;

      (datePlugin.getDate = function getDate() {
        return instance.Number(__getDate.call(this));
      }).raw = __getDate;

      (datePlugin.getDay = function getDay() {
        return instance.Number(__getDay.call(this));
      }).raw = __getDay;

      (datePlugin.getFullYear = function getFullYear() {
        return instance.Number(__getFullYear.call(this));
      }).raw = __getFullYear;

      (datePlugin.getHours = function getHours() {
        return instance.Number(__getHours.call(this));
      }).raw = __getHours;

      (datePlugin.getMilliseconds = function getMilliseconds() {
        return instance.Number(__getMilliseconds.call(this));
      }).raw = __getMilliseconds;

      (datePlugin.getMinutes = function getMinutes() {
        return instance.Number(__getMinutes.call(this));
      }).raw = __getMinutes;

      (datePlugin.getMonth = function getMonth () {
        return instance.Number(__getMonth.call(this));
      }).raw = __getMonth;

      (datePlugin.getSeconds = function getSeconds() {
        return instance.Number(__getSeconds.call(this));
      }).raw = __getSeconds;

      (datePlugin.getTime = function getTime() {
        return instance.Number(__getTime.call(this));
      }).raw = __getTime;

      (datePlugin.getTimezoneOffset = function getTimezoneOffset() {
        return instance.Number(__getTimezoneOffset.call(this));
      }).raw = __getTimezoneOffset;

      (datePlugin.getUTCDate = function getUTCDate() {
        return instance.Number(__getUTCDate.call(this));
      }).raw = __getUTCDate;

      (datePlugin.getUTCDay = function getUTCDay() {
        return instance.Number(__getUTCDay.call(this));
      }).raw = __getUTCDay;

      (datePlugin.getUTCFullYear = function getUTCFullYear() {
        return instance.Number(__getUTCFullYear.call(this));
      }).raw = __getUTCFullYear;

      (datePlugin.getUTCHours = function getUTCHours() {
        return instance.Number(__getUTCHours.call(this));
      }).raw = __getUTCHours;

      (datePlugin.getUTCMilliseconds = function getUTCMilliseconds() {
        return instance.Number(__getUTCMilliseconds.call(this));
      }).raw = __getUTCMilliseconds;

      (datePlugin.getUTCMinutes = function getUTCMinutes() {
        return instance.Number(__getUTCMinutes.call(this));
      }).raw = __getUTCMinutes;

      (datePlugin.getUTCMonth = function getUTCMonth() {
        return instance.Number(__getUTCMonth.call(this));
      }).raw = __getUTCMonth;

      (datePlugin.getUTCSeconds = function getUTCSeconds() {
        return instance.Number(__getUTCSeconds.call(this));
      }).raw = __getUTCSeconds;

      (datePlugin.getYear = function getYear() {
        return instance.Number(__getYear.call(this));
      }).raw = __getYear;

      (numPlugin.toExponential = function toExponential(fractionDigits) {
        return instance.String(__toExponential.call(this, fractionDigits));
      }).raw = __toExponential;

      (numPlugin.toFixed = function toFixed(fractionDigits) {
        return instance.String(__toFixed.call(this, fractionDigits));
      }).raw = __toFixed;

      (numPlugin.toPrecision = function toPrecision(precision) {
        return instance.String(__toPrecision.call(this, precision));
      }).raw = __toPrecision;

      (regPlugin.exec = function exec(string) {
        var output = __exec.call(this, string);
        if (output) {
          var item, i = -1, length = output.length, result = instance.Array();
          while (++i < length) {
            result[i] = (item = output[i]) == null ? item : instance.String(item);
          }
          result.index = output.index;
          result.input = output.input;
        }
        return output && result;
      }).raw = __exec;

      (strPlugin.charAt = function charAt(pos) {
        return String(__charAt.call(this, pos));
      }).raw = __charAt;

      (strPlugin.charCodeAt = function charCodeAt(pos) {
        return instance.Number(__charCodeAt.call(this, pos));
      }).raw = __charCodeAt;

      (strPlugin.concat = function concat(item) {
        return String(arguments.length > 1
          ? __strConcat.apply(this, arguments)
          : __strConcat.call(this, item));
      }).raw = __strConcat;

      (strPlugin.indexOf = function indexOf(item, fromIndex) {
        return instance.Number(__strIndexOf.call(this, item,
          fromIndex == null ? 0 : fromIndex));
      }).raw = __strIndexOf;

      (strPlugin.lastIndexOf = function lastIndexOf(item, fromIndex) {
        return instance.Number(__strLastIndexOf.call(this, item,
          fromIndex == null ? this.length : fromIndex));
      }).raw = __strLastIndexOf;

      (strPlugin.localeCompare = function localeCompare(that) {
        return instance.Number(__localeCompare.call(this, that));
      }).raw = __localeCompare;

      (strPlugin.match = function match(pattern) {
        var output = __match.call(this, pattern);
        if (output) {
          var item, i = -1, length = output.length, result = instance.Array();
          while (++i < length) {
            result[i] = (item = output[i]) == null ? item : instance.String(item);
          }
        }
        return output && result;
      }).raw = __match;

      (strPlugin.replace = function replace(pattern, replacement) {
        return String(__replace.call(this, pattern, replacement));
      }).raw = __replace;

      (strPlugin.search = function search(pattern) {
        return instance.Number(__search.call(this, pattern));
      }).raw = __search;

      (strPlugin.slice = function slice(start, end) {
        return String(__strSlice.call(this, start,
          end == null ? this.length : end));
      }).raw = __strSlice;

      (strPlugin.split = function split(separator, limit) {
        var item, i = -1, output = __split.call(this, separator, limit),
         length = output.length, result = instance.Array();
        while (++i < length) {
          result[i] = (item = output[i]) == null ? item : String(item);
        }
        return result;
      }).raw = __split;

      (strPlugin.substr = function substr(start, length) {
        return String(__substr.call(start, length == null ? this.length : length));
      }).raw = __substr;

      (strPlugin.substring = function substring(start, end) {
        return String(__substring.call(this, start,
          end == null ? this.length : end));
      }).raw = __substring;

      (strPlugin.toLowerCase = function toLowerCase() {
        return String(__toLowerCase.call(this));
      }).raw = __toLowerCase;

      (strPlugin.toLocaleLowerCase = function toLocaleLowerCase() {
        return String(__toLocaleLowerCase.call(this));
      }).raw = __toLocaleLowerCase;

      (strPlugin.toLocaleUpperCase = function toLocaleUpperCase() {
        return String(__toLocaleUpperCase.call(this));
      }).raw = __toLocaleUpperCase;

      (strPlugin.toUpperCase = function toUpperCase() {
        return String(__toUpperCase.call(this));
      }).raw = __toUpperCase;

      // define as own methods of arrPlugin
      arrPlugin.shift = arrPlugin.shift;
      arrPlugin.sort  = arrPlugin.sort;

      (arrPlugin.concat = arrPlugin.concat).raw = __concat;
      (arrPlugin.reverse = arrPlugin.reverse).raw = __reverse;
      (arrPlugin.slice = arrPlugin.slice).raw = __slice;
      (arrPlugin.splice.raw = arrPlugin.splice).raw = __splice;

      /*------------------------- MODIFY PROTOTYPES --------------------------*/

      // add [[Class]] property to eaches prototype as a fallback in case
      // toString.call(value) doesn't work on sandboxed natives
      arrPlugin[CLASS]  = ARRAY_CLASS;
      boolPlugin[CLASS] = BOOLEAN_CLASS;
      datePlugin[CLASS] = DATE_CLASS;
      funcPlugin[CLASS] = FUNCTION_CLASS;
      numPlugin[CLASS]  = NUMBER_CLASS;
      regPlugin[CLASS]  = REGEXP_CLASS;
      strPlugin[CLASS]  = STRING_CLASS;

      // point constructor properties to the native wrappers,
      // assign native wrappers to instance object, and add raw properties
      (instance.Object = Object).raw = __Object;
      Object.prototype = Object.plugin = objPlugin;

      (instance.Array =
      (Array.prototype = Array.plugin = arrPlugin).constructor = Array)
      .raw = __Array;

      (instance.Boolean =
      (Boolean.prototype = Boolean.plugin = boolPlugin).constructor = Boolean)
      .raw = __Boolean;

      (instance.Date =
      (Date.prototype = Date.plugin = datePlugin).constructor = Date)
      .raw = __Date;

      (instance.Function =
      (Function.prototype = Function.plugin = funcPlugin).constructor = Function)
      .raw = __Function;

      (instance.Number =
      (Number.prototype = Number.plugin = numPlugin).constructor = Number)
      .raw = __Number;

      (instance.RegExp =
      (RegExp.prototype = RegExp.plugin = regPlugin).constructor = RegExp)
      .raw = __RegExp;

      (instance.String =
      (String.prototype = String.plugin = strPlugin).constructor = String)
      .raw = __String;

      /*------------------------------ CLEANUP -------------------------------*/

      // prevent JScript bug with named function expressions
      var charAt = null, charCodeAt = null, concat = null, every = null, exec = null,
       filter = null, getDate = null, getDay = null, getFullYear = null,
       getHours = null, getMilliseconds = null, getMinutes = null, getMonth = null,
       getSeconds = null, getTime = null, getTimezoneOffset = null, getUTCDate = null,
       getUTCDay = null, getUTCFullYear = null, getUTCHours = null,
       getUTCMilliseconds = null, getUTCMinutes = null, getUTCMonth = null,
       getUTCSeconds = null, getYear = null, join = null, indexOf = null,
       lastIndexOf = null, localeCompare = null, match = null, map = null, push = null,
       replace = null, reverse = null, search = null, slice = null, some = null,
       sort = null, split = null, splice = null, substr = null, substring = null,
       toExponential = null, toFixed = null, toISOString = null, toJSON = null,
       toLowerCase = null, toLocaleLowerCase = null, toLocaleUpperCase = null,
       toPrecision = null, toUpperCase = null, trim = null, trimLeft = null,
       trimRight = null, unshift = null;

      return instance;
    };


    /*------------------------------------------------------------------------*/

    // The htmlfile ActiveX object is supported by IE4+ and avoids https mixed
    // content warnings in IE6. It is also used as a workaround for access denied errors
    // thrown when using iframes to create sandboxes after the document.domain is
    // set (Opera 9.25 is out of luck here).
    if (HAS_ACTIVEX && !isHostType(window, 'XMLHttpRequest') &&
          window.location && location.protocol == 'https:') {
      setMode(ACTIVEX_MODE);
    }
    // Iframes are the fastest and prefered technique
    else if (HAS_IFRAME) {
      setMode(IFRAME_MODE);
    }
    // A fallback for non browser environments and should be supported by
    // JavaScript engines such as Carakan, JaegerMonkey, JavaScriptCore, KJS,
    // Nitro, Rhino, SpiderMonkey, SquirrelFish (Extreme), Tamarin, TraceMonkey,
    // and V8.
    else if (HAS_PROTO) {
      setMode(PROTO_MODE);
    }

    // map Fusebox.prototype to Klass so Fusebox can be called without the `new` expression
    Klass.prototype = Fusebox.prototype;

    // expose
    Fusebox.getMode = getMode;
    Fusebox.setMode = setMode;


    /*------------------------- FUSE CUSTOMIZATIONS --------------------------*/

    // assign Fusebox natives to Fuse object
    (function() {
      var backup, key, i = -1,

      SKIPPED_KEYS = { 'callSuper': 1, 'constructor': 1 },

      createGeneric = function(proto, methodName) {
        return Function('o,s',
          'function ' + methodName + '(thisArg){' +
          'var a=arguments,m=o.' + methodName +
          ';return a.length' +
          '?m.apply(thisArg,s.call(a,1))' +
          ':m.call(thisArg)' +
          '}return ' + methodName)(proto, slice);
      },

      updateGenerics = function updateGenerics(deep) {
        var Klass = this;
        if (deep) {
          fuse.updateGenerics(Klass, deep);
        } else {
          fuse.Object.each(Klass.prototype, function(value, key, proto) {
            if (!SKIPPED_KEYS[key] && isFunction(proto[key]) && hasKey(proto, key))
              Klass[key] = createGeneric(proto, key);
          });
        }
      };

      Fusebox(fuse);

      // break fuse.Object.prototype's relationship to other fuse natives
      // for consistency across sandbox variations.
      if (MODE != PROTO_MODE) {
        backup = {
          'Array':    fuse.Array,
          'Boolean':  fuse.Boolean,
          'Date':     fuse.Date,
          'Function': fuse.Function,
          'Number':   fuse.Number,
          'RegExp':   fuse.RegExp,
          'String':   fuse.String
        };

        Fusebox(fuse);

        fuse.Array    = backup.Array;
        fuse.Boolean  = backup.Boolean;
        fuse.Date     = backup.Date;
        fuse.Function = backup.Function;
        fuse.Number   = backup.Number;
        fuse.RegExp   = backup.RegExp;
        fuse.String   = backup.String;
      }
      // redifine `toString` if there are no issues
      if (fuse.Object().toString.call([]) == ARRAY_CLASS) {
        toString = { }.toString;
      }

      // assign sandboxed natives to Fuse and add `updateGeneric` methods
      while (key = arguments[++i]) {
        fuse[key].updateGenerics = updateGenerics;
      }
    })('Array', 'Boolean', 'Date', 'Function', 'Number', 'Object', 'RegExp', 'String');

    return Fusebox;
  })();

  /*------------------------------ LANG: OBJECT ------------------------------*/

  eachKey =
  fuse.Object.each = (function() {
    var each;

    function bind(fn, thisArg) {
      return function(value, key, object) {
        return fn.call(thisArg, value, key, object);
      };
    }

    // use switch statement to avoid creating a temp variable
    switch (function() {
      var key, count = 0, klass = function() { this.toString = 1; };
      klass.prototype.toString = 1;
      for (key in new klass) { count++; }
      return count;
    }()) {

      case 0: // IE
        var shadowed = [
          'constructor', 'hasOwnProperty',
          'isPrototypeOf', 'propertyIsEnumerable',
          'toLocaleString', 'toString', 'valueOf'
        ];

        each = function each(object, callback, thisArg) {
          if (object) {
            var key, i = -1;
            thisArg && (callback = bind(callback, thisArg));
            for (key in object) {
              if (callback(object[key], key, object) === false) {
                return object;
              }
            }
            while(key = shadowed[++i]) {
              if (hasKey(object, key) &&
                  callback(object[key], key, object) === false) {
                break;
              }
            }
          }
          return object;
        };

        break;

      case 2:
        // Tobie Langel: Safari 2 broken for-in loop
        // http://tobielangel.com/2007/1/29/for-in-loop-broken-in-safari/
        each = function each(object, callback, thisArg) {
          var key, keys = { }, skipProto = isFunction(object);
          if (object)  {
            thisArg && (callback = bind(callback, thisArg));
            for (key in object) {
              if (!(skipProto && key == 'prototype') &&
                  !hasKey(keys, key) && (keys[key] = 1) &&
                  callback(object[key], key, object) === false) {
                break;
              }
            }
          }
          return object;
        };

        break;

      default: // Others
        each = function each(object, callback, thisArg) {
          var key, skipProto = isFunction(object);
          if (object) {
            thisArg && (callback = bind(callback, thisArg));
            for (key in object) {
              if (!(skipProto && key == 'prototype') &&
                  callback(object[key], key, object) === false) {
                break;
              }
            }
          }
          return object;
        };
    }

    return each;
  })();

  /*--------------------------------------------------------------------------*/

  // Use fuse.Object.hasKey() on object Objects only as it may error on DOM Classes
  // https://bugzilla.mozilla.org/show_bug.cgi?id=375344
  hasKey =
  fuse.Object.hasKey = (function() {
    var objectProto = Object.prototype,
     hasOwnProperty = objectProto.hasOwnProperty;

    if (!isFunction(hasOwnProperty)) {
      if (envTest('OBJECT__PROTO__')) {
        // Safari 2
        hasKey = function hasKey(object, property) {
          if (object == null) throw new TypeError;
          // convert primatives to objects so IN operator will work
          object = Object(object);

          var result, proto = object[PROTO];
          object[PROTO] = null;
          result = property in object;
          object[PROTO] = proto;
          return result;
        };
      } else {
        // Other
        hasKey = function hasKey(object, property) {
          if (object == null) throw new TypeError;
          object = Object(object);
          var constructor = object.constructor;
          return property in object &&
            (constructor && constructor.prototype
              ? object[property] !== constructor.prototype[property]
              : object[property] !== objectProto[property]);
        };
      }
    }
    else {
      hasKey = function hasKey(object, property) {
        // ES5 15.2.4.5
        if (object == null) throw new TypeError;
        return hasOwnProperty.call(object, property);
      };
    }

    // Garrett Smith found an Opera bug that occurs with the window object and not the global
    if (window.window == window && !hasKey(window.window, 'Object')) {
      var __hasKey = hasKey;
      hasKey = function hasKey(object, property) {
        if (object == null) throw new TypeError;
        if(object == window) {
          return property in object &&
            object[property] !== objectProto[property];
        }
        return __hasKey(object, property);
      };
    }

    return hasKey;
  })();

  /*--------------------------------------------------------------------------*/

  fuse.Object.isFunction = isFunction;

  fuse.Object.isHostType = isHostType;

  isArray =
  fuse.Object.isArray = fuse.Array.isArray;

  isElement =
  fuse.Object.isElement = function isElement(value) {
    return !!value && value.nodeType == ELEMENT_NODE;
  };

  isHash =
  fuse.Object.isHash = function isHash(value) {
    var Hash = fuse.Hash;
    return !!value && value.constructor == Hash && value != Hash.prototype;
  };

  isNumber =
  fuse.Object.isNumber = function isNumber(value) {
    return toString.call(value) == NUMBER_CLASS && isFinite(value);
  };

  // ES5 4.3.2
  isPrimitive =
  fuse.Object.isPrimitive = function isPrimitive(value) {
    var type = typeof value;
    return value == null || type == 'boolean' || type == 'number' || type == 'string';
  };

  isRegExp =
  fuse.Object.isRegExp = function isRegExp(value) {
    return toString.call(value) == REGEXP_CLASS;
  };

  isString =
  fuse.Object.isString = function isString(value) {
    return toString.call(value) == STRING_CLASS;
  };

  /*--------------------------------------------------------------------------*/

  (function(Obj) {

    Obj.clone = function clone(object, deep) {
      if (object) {
        if (isFunction(object.clone)) {
          return object.clone(deep);
        }
        if (typeof object == 'object') {
          var length, result, constructor = object.constructor, i = -1;
          switch (toString.call(object)) {
            case ARRAY_CLASS  :
              if (deep) {
                result = constructor();
                length = object.length;
                while (++i < length) result[i] = Obj.clone(object[i], deep);
              } else {
                result = object.slice(0);
              }
              return result;

            case REGEXP_CLASS :
              return constructor(object.source,
                (object.global     ? 'g' : '') +
                (object.ignoreCase ? 'i' : '') +
                (object.multiline  ? 'm' : ''));

            case NUMBER_CLASS  :
            case STRING_CLASS  : return new constructor(object);
            case BOOLEAN_CLASS : return new constructor(object == true);
            case DATE_CLASS    : return new constructor(+object);
          }

          result = Obj();
          if (deep) {
            eachKey(object, function(value, key) {
             result[key] = Obj.clone(value, deep);
            });
          } else {
            Obj.extend(result, object);
          }
          return result;
        }
      }
      return Obj();
    };

    Obj.extend = function extend(destination, source) {
      eachKey(source, function(value, key) { destination[key] = value; });
      return destination;
    };

    // ES5 15.2.4.2
    // The erratum states Object#toString should return
    // [object Null] and [object Undefined] for null and undefined values.
    // However, Null and Undefined are *not* [[Class]] property values.
    Obj.getClassOf = function getClassOf(object) {
      if (object == null) throw new TypeError;
      return fuse.String(toString.call(object).slice(8, -1));
    };

    Obj.isEmpty = function isEmpty(object) {
      var result = true;
      if (object) {
        eachKey(object, function(value, key) {
          if (hasKey(object, key)) return (result = false);
        });
      }
      return result;
    };

    // https://developer.mozilla.org/En/Same_origin_policy_for_JavaScript
    // http://www.iana.org/assignments/port-numbers
    Obj.isSameOrigin = (function() {
      var loc      = window.location,
       protocol    = loc.protocol,
       port        = loc.port,
       reUrlParts  = /([^:]+:)\/\/(?:[^:]+(?:\:[^@]+)?@)?([^\/:$]+)(?:\:(\d+))?/,
       defaultPort = protocol == 'ftp:' ? 21 : protocol == 'https:' ? 443 : 80,

      isSameOrigin = function isSameOrigin(url) {
        var domainIndex, urlDomain,
         result    = true,
         docDomain = fuse._doc.domain,
         parts     = String(url).match(reUrlParts) || [];

        if (parts[0]) {
          urlDomain = parts[2];
          domainIndex = urlDomain.indexOf(docDomain);
          result = parts[1] == protocol &&
            (!domainIndex || urlDomain.charAt(domainIndex -1) == '.') &&
              (parts[3] || defaultPort) == (port || defaultPort);
        }
        return result;
      };

      return isSameOrigin;
    })();

    // ES5 15.2.3.14
    if (!isFunction(Obj.keys)) {
      Obj.keys = function keys(object) {
        if (isPrimitive(object)) throw new TypeError;

        var result = fuse.Array(), i = -1;
        eachKey(object, function(value, key) {
          if (hasKey(object, key)) result[++i] = key;
        });
        return result;
      };
    }

    Obj.values = function values(object) {
      if (isPrimitive(object)) throw new TypeError;

      var result = fuse.Array(), i = -1;
      eachKey(object, function(value, key) {
        if (hasKey(object, key)) result[++i] = value;
      });
      return result;
    };

    Obj.toHTML = function toHTML(object) {
      return object && typeof object.toHTML == 'function'
        ? fuse.String(object.toHTML())
        : fuse.String(object == null ? '' : object);
    };

    // prevent JScript bug with named function expressions
    var clone =   null,
     each =       null,
     extend =     null,
     getClassOf = null,
     isEmpty =    null,
     keys =       null,
     values =     null,
     toHTML =     null;
  })(fuse.Object);
  /*------------------------------ LANG: CLASS -------------------------------*/
  /* Based on work by Alex Arnell, John Resig, T.J. Crowder & Prototype core  */
  /* http://blog.niftysnippets.org/2009/09/simple-efficient-supercalls-in.html*/

  fuse.Class = (function() {
    var Subclass = function() { },

    clone = fuse.Object.clone,

    createNamedClass = function(name, LINKED_KEYS) {
      return Function('clone,LK',
        'function ' + name + '(){' +
        'var k,m,c=this;' +
        'if(m=c.initialize){' +
        'for(k in LK){c[k]=clone(c[k])}' +
        'return m.apply(c,arguments);' +
        '}} return ' + name)(clone, LINKED_KEYS);
    },

    Class = function Class(Superclass, plugins, mixins, statics) {
      var Klass, arg, mixins, plugin, i = 0,
       LINKED_KEYS     = { },
       args            = slice.call(arguments, 0),
       defaults        = Class.defaults,
       first           = args[0],
       isAutoUnlinking = true;

      // resolve superclass
      if (isString(first)) {
        Superclass = createNamedClass(args.shift());
      } else if (typeof first == 'function' && first.subclasses) {
        Superclass = args.shift();
      } else {
        Superclass = null;
      }

      plugins = args[0];
      mixins  = args[1];

      // auto execute plugins if they are closures and convert to array if not already
      if (typeof plugins == 'function') plugins = plugins();
      if (!isArray(plugins)) plugins = [plugins];

      // search properties for a custom `constructor` method
      while ((plugin = plugins[i++])) {
        if (hasKey(plugin, 'constructor')) {
          // power usage
          if (typeof plugin.constructor == 'function') {
            Klass = plugin.constructor;
            isAutoUnlinking = false;
          }
          // normal usage
          else if (isString(plugin.constructor)) {
            Klass = createNamedClass(plugin.constructor, LINKED_KEYS);
          }
          delete plugin.constructor;
        }
      }

      Klass = Klass || createNamedClass('UnnamedClass', LINKED_KEYS);

      if (Superclass) {
        // note: Safari 2, inheritance won't work with Klass.prototype = new Function;
        Subclass.prototype = Superclass.prototype;
        Klass.prototype = new Subclass;
        Superclass.subclasses.push(Klass);
      }

      Klass.superclass = Superclass;
      Klass.subclasses = fuse.Array();
      plugin = Klass.plugin = Klass.prototype;

      // add statics/mixins/plugins to the Klass
      Class.defaults.statics
        .addStatics.call(Klass, defaults.statics, args[2])
        .addPlugins(plugins)
        .addMixins(defaults.mixins, mixins);

      // flag keys of object/array references to be
      // automatically unlinked in the constructor
      if (isAutoUnlinking) {
        eachKey(Klass.plugin, function(value, key, object) {
          if (hasKey(object, key) && value && typeof value == 'object') {
            LINKED_KEYS[key] = 1;
          }
        });
      }

      plugin.constructor = Klass;
      return Klass;
    };

    return Class;
  })();

  fuse.Class.defaults = { };

  fuse.Class.mixins   = { };

  fuse.Class.statics  = { };

  /*--------------------------------------------------------------------------*/

  fuse.Class.defaults.mixins = (function() {
    var callSuper = function callSuper(method) {
      var $super, args, callee = method.callee;
      if (callee) {
        args = method;
        method = callee;
      } else {
        args = slice.call(arguments, 1);
      }

      $super = method.$super || method.superclass;
      return args.length
        ? $super.apply(this, args)
        : $super.call(this);
    };

    return { 'callSuper': callSuper };
  })();

  /*--------------------------------------------------------------------------*/

  fuse.Class.defaults.statics = (function() {
    var addMixins = function addMixins() {
      var arg, j, jmax,
       args = arguments, i = -1, imax = args.length,
       Klass = this, prototype = Klass.prototype;

      while (++i < imax) {
        arg = args[i];
        // auto execute arg if it's a closures
        if (typeof arg == 'function') arg = arg();
        // force to array, if not one, to support passing arrays
        if (!isArray(arg)) arg = [arg];

        j = -1; jmax = arg.length;
        while (++j < jmax) {
          eachKey(arg[j], function(value, key, object) {
            if (hasKey(object, key)) {
              if (isFunction(value)) {
                // flag as mixin if not used as a $super
                if (!value.$super) {
                  value._isMixin = true;
                }
              } else if (value && typeof value == 'object') {
                value = fuse.Object.clone(value);
              }
              prototype[key] = value;
            }
          });
        }
      }
      return Klass;
    },

    addPlugins = function addPlugins() {
      var arg, j, jmax, k, plugins, otherMethod,
       args = arguments, i = -1, imax = args.length,
       Klass      = this,
       prototype  = Klass.prototype,
       superProto = Klass.superclass && Klass.superclass.prototype,
       subclasses = Klass.subclasses,
       subLength  = subclasses.length;

      while (++i < imax) {
        arg = args[i];
        if (typeof arg == 'function') arg = arg();
        if (!isArray(arg)) arg = [arg];

        j = -1; jmax = arg.length;
        while (++j < jmax) {
          eachKey(arg[j], function(value, key, object) {
            if (hasKey(object, key)) {
              var protoMethod = prototype[key],
               superMethod = superProto && superProto[key];

              // avoid typeof == `function` because Safari 3.1+ mistakes
              // regexp instances as typeof `function`
              if (isFunction(value)) {
                // flag as $super if not used as a mixin
                if (isFunction(superMethod) && !superMethod._isMixin) {
                  value.$super = superMethod;
                }
                if (isFunction(protoMethod)) {
                  k = subLength;
                  while (k--) {
                    otherMethod = subclasses[k].prototype[key];
                    if (otherMethod && otherMethod.$super)
                      otherMethod.$super = value;
                  }
                }
              } else if (value && typeof value == 'object') {
                value = fuse.Object.clone(value);
              }
              prototype[key] = value;
            }
          });
        }
      }
      return Klass;
    },

    addStatics = function addStatics() {
      var arg, j, jmax, args = arguments,
       i = -1, imax = args.length, Klass = this;

      while (++i < imax) {
        arg = args[i];
        if (typeof arg == 'function') arg = arg();
        if (!isArray(arg)) arg = [arg];

        j = -1; jmax = arg.length;
        while (++j < jmax) {
          eachKey(arg[j], function(value, key, object) {
            if (hasKey(object, key)) Klass[key] = value;
          });
        }
      }
      return Klass;
    },

    extend = function extend(plugins, mixins, statics) {
      var Klass = this;
      plugins && Klass.addPlugins(plugins);
      mixins  && Klass.addMixins(mixins);
      statics && Klass.addStatics(statics);
      return Klass;
    };

    return {
      'addMixins':  addMixins,
      'addPlugins': addPlugins,
      'addStatics': addStatics,
      'extend':     extend
    };
  })();

  /*--------------------------------------------------------------------------*/

  // replace placeholder objects with inheritable namespaces
  window.fuse = fuse.Class({ 'constructor': fuse });

  (function(__env) {
    delete fuse.env;
    var env        = fuse.addNS('env');
    env.addTest    = __env.addTest;
    env.removeTest = __env.removeTest;
    env.test       = __env.test;

    env.addNS('agent');
    fuse.Object.extend(env.agent, __env.agent);
  })(fuse.env);
  /*------------------------------ LANG: EVENT -------------------------------*/

  fuse.Class.mixins.event = (function() {

    var huid = fuse.uid + '_eventHandler',

    arrIndexOf = (function(fn) {
      return fn && fn.raw || function(value) {
        var length = this.length;
        while (length--) {
          if (this[length] === value) return length;
        }
        return -1;
      };
    })(fuse.Array.plugin.indexOf),

    fire = function fire(type) {
      var handler, args, i = -1, debug = fuse.debug, klass = this,
       events = klass._events || (klass._events = { }), handlers = events[type];

      if (handlers) {
        handlers = slice.call(handlers, 0);
        args = arguments.length > 1 ? slice.call(arguments, 1) : [];
        while (handler = handlers[++i]) {
          if (debug) {
            // script injection allows handlers to fail without halting the while loop
            fuse[huid] = function() { handler.apply(klass, args) };
            runScriptText('fuse.' + huid + '()');
            delete fuse[huid];
          }
          else if (args) {
            handler.apply(this, args);
          } else {
            handler.call(this);
          }
        }
      }
      return this;
    },

    observe = function observe(type, handler) {
      var events = this._events || (this._events = { }),
       ec = events[type] || (events[type] = []);
      ec.push(handler);
      return this;
    },

    stopObserving = function stopObserving(type, handler) {
      var ec, foundAt, length,
       events = this._events || (this._events = { });

      if (!events) return this;
      type = isString(type) ? type && String(type) : null;

      // if the event type is omitted we stop
      // observing all handlers on the element
      if (!type) {
        eachKey(events, function(handlers, type) {
          stopObserving.call(element, type);
        });
        return this;
      }
      if (handlers = events[type]) {
        // if the handler is omitted we stop
        // observing all handlers of that type
        if (handler == null) {
          length = handlers.length;
          while (length--) stopObserving.call(this, type, length);
          return this;
        }
      } else {
        // bail when no event data
        return this;
      }

      foundAt = isNumber(handler) ? handler : arrIndexOf.call(handlers, handler);
      if (foundAt < 0) return this;

      // remove handler
      handlers.splice(foundAt, 1);

      // if no more handlers remove the event type data
      if (!handlers.length) {
        delete events[type];
      }
      return this;
    };

    return {
      'fire':          fire,
      'observe':       observe,
      'stopObserving': stopObserving
    };
  })();

  /*----------------------------- LANG: FUNCTIONS ----------------------------*/

  (function(Func) {

    // ES5 15.3.4.5
    Func.bind = function bind(fn, thisArg) {
      // allows lazy loading the target method
      var f, context, curried, name, reset;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }
      // follow spec and throw if fn is not callable
      if (typeof (f || context[name]) != 'function') {
        throw new TypeError;
      }
      // bind with curry
      if (arguments.length > 2) {
        curried = slice.call(arguments, 2);
        reset = curried.length;

        return function() {
          curried.length = reset; // reset arg length
          return (f || context[name]).apply(thisArg, arguments.length
            ? concatList(curried, arguments)
            : curried);
        };
      }
      // simple bind
      return function() {
        var fn = f || context[name];
        return arguments.length
          ? fn.apply(thisArg, arguments)
          : fn.call(thisArg);
      };
    };

    Func.bindAsEventListener = function bindAsEventListener(fn, thisArg) {
      // allows lazy loading the target method
      var f, context, curried, name;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }
      // bind with curry
      if (arguments.length > 2) {
        curried = slice.call(arguments, 2);
        return function(event) {
          return (f || context[name]).apply(thisArg,
            prependList(curried, event || getWindow(this).event));
        };
      }
      // simple bind
      return function(event) {
        return (f || context[name]).call(thisArg, event || getWindow(this).event);
      };
    };

    Func.curry = function curry(fn) {
      // allows lazy loading the target method
      var f, context, curried, name, reset;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }

      if (arguments.length > 1) {
        curried = slice.call(arguments, 1);
        reset   = curried.length;

        return function() {
          curried.length = reset; // reset arg length
          var fn = f || context[name];
          return fn.apply(this, arguments.length
            ? concatList(curried, arguments)
            : curried);
        };
      }

      return f || context[name];
    };

    Func.delay = function delay(fn, timeout) {
      // allows lazy loading the target method
      var f, context, name, args = slice.call(arguments, 2);
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }

      return setTimeout(function() {
        var fn = f || context[name];
        return fn.apply(fn, args);
      }, timeout * 1000);
    };

    Func.defer = function defer(fn) {
      return Func.delay.apply(window,
        concatList([fn, 0.01], slice.call(arguments, 1)));
    };

    Func.methodize = function methodize(fn) {
      // allows lazy loading the target method
      var f, context, name;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1]; fn = context[name];
      } else {
        f = fn;
      }

      return fn._methodized || (fn._methodized = function() {
        var fn = f || context[name];
        return arguments.length
          ? fn.apply(window, prependList(arguments, this))
          : fn.call(window, this);
      });
    };

    Func.wrap = function wrap(fn, wrapper) {
      // allows lazy loading the target method
      var f, context, name;
      if (isArray(fn)) {
        name = fn[0]; context = fn[1];
      } else {
        f = fn;
      }

      return function() {
        var fn = f || context[name];
        return arguments.length
          ? wrapper.apply(this, prependList(arguments, Func.bind(fn, this)))
          : wrapper.call(this, Func.bind(fn, this));
      };
    };

    /*------------------------------------------------------------------------*/

    var plugin = Func.plugin;

    // native support
    if (isFunction(plugin.bind)) {
      var __bind = Func.bind;
      Func.bind = function bind(fn, thisArg) {
        // bind with curry
        var isLazy = isArray(fn);
        if (arguments.length > 2) {
          return isLazy
            ? __bind.apply(null, args)
            : plugin.bind.apply(fn, slice.call(args, 1));
        }
        // simple bind
        return isLazy
          ? __bind(fn, thisArg)
          : plugin.bind.call(fn, thisArg);
      };
    } else {
      plugin.bind = function bind(thisArg) {
        return arguments.length > 1
          ? Func.bind.apply(Func, prependList(arguments, this))
          : Func.bind(this, thisArg);
      };
    }

    plugin.bindAsEventListener = function bindAdEventListener(thisArg) {
      return arguments.length > 1
        ? Func.bindAdEventListener.apply(Func, prependList(arguments, this))
        : Func.bindAdEventListener(this, thisArg);
    };

    plugin.curry = function curry() {
      return arguments.length
        ? Func.curry.apply(Func, prependList(arguments, this))
        : this;
    };

    plugin.delay = function delay(timeout) {
      return arguments.length > 1
        ? Func.delay.apply(Func, prependList(arguments, this))
        : Func.delay(this, timeout);
    };

    plugin.defer = function defer() {
      return arguments.length
        ? Func.defer.apply(Func, prependList(arguments, this))
        : Func.defer(this);
    };

    plugin.methodize = function methodize() {
      return Func.methodize(this);
    };

    plugin.wrap = function wrap(wrapper) {
      return Func.wrap(this, wrapper);
    };

    // prevent JScript bug with named function expressions
    var bind =             null,
     bindAsEventListener = null,
     curry =               null,
     delay =               null,
     defer =               null,
     methodize =           null,
     wrap =                null;
  })(fuse.Function);
  /*---------------------------- LANG: ENUMERABLE ----------------------------*/

  fuse.Class.mixins.enumerable = { };

  (function(mixin) {
    var $break = function $break() { };

    mixin.contains = function contains(value) {
      var result = 0;
      this.each(function(item) {
        // basic strict match
        if (item === value && result++) return false;
        // match String and Number object instances
        try {
          if (item.valueOf() === value.valueOf() && result++) return false;
        } catch (e) { }
      });

      return !!result;
    };

    mixin.each = function each(callback, thisArg) {
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      try {
        this._each(function(value, index, iterable) {
          if (callback.call(thisArg, value, index, iterable) === false)
            throw $break;
        });
      } catch (e) {
        if (e != $break) throw e;
      }
      return this;
    };

    mixin.eachSlice = function eachSlice(size, callback, thisArg) {
      var index = -size, slices = fuse.Array(), list = this.toArray();
      if (size < 1) return list;
      while ((index += size) < list.length) {
        slices[slices.length] = list.slice(index, index + size);
      }
      return callback
        ? slices.map(callback, thisArg)
        : slices;
    };

    mixin.every = function every(callback, thisArg) {
      var result = true;
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      this.each(function(value, index, iterable) {
        if (!callback.call(thisArg, value, index, iterable)) {
          return (result = false);
        }
      });
      return result;
    };

    mixin.filter = function filter(callback, thisArg) {
      var result = fuse.Array();
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      this._each(function(value, index, iterable) {
        if (callback.call(thisArg, value, index, iterable))
          result.push(value);
      });
      return result;
    };

    mixin.first = function first(callback, thisArg) {
      if (callback == null) {
        var result;
        this.each(function(value) { result = value; return false; });
        return result;
      }
      return this.toArray().first(callback, thisArg);
    };

    mixin.inGroupsOf = function inGroupsOf(size, filler) {
      filler = typeof filler == 'undefined' ? null : filler;
      return this.eachSlice(size, function(slice) {
        while (slice.length < size) slice.push(filler);
        return slice;
      });
    };

    mixin.inject = function inject(accumulator, callback, thisArg) {
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      this._each(function(value, index, iterable) {
        accumulator = callback.call(thisArg, accumulator, value, index, iterable);
      });
      return accumulator;
    };

    mixin.invoke = function invoke(method) {
      var args = slice.call(arguments, 1), funcProto = Function.prototype;
      return this.map(function(value) {
        return funcProto.apply.call(value[method], value, args);
      });
    };

    mixin.last = function last(callback, thisArg) {
      return this.toArray().last(callback, thisArg);
    };

    mixin.map = function map(callback, thisArg) {
      var result = fuse.Array();
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      if (thisArg) {
        this._each(function(value, index, iterable) {
          result.push(callback.call(thisArg, value, index, iterable));
        });
      } else {
        this._each(function(value, index, iterable) {
          result.push(callback(value, index, iterable));
        });
      }
      return result;
    };

    mixin.max = function max(callback, thisArg) {
      callback || (callback = IDENTITY);
      var comparable, max, result;
      this._each(function(value, index, iterable) {
        comparable = callback.call(thisArg, value, index, iterable);
        if (max == null || comparable > max) {
          max = comparable; result = value;
        }
      });
      return result;
    };

    mixin.min = function min(callback, thisArg) {
      callback || (callback = IDENTITY);
      var comparable, min, result;
      this._each(function(value, index, iterable) {
        comparable = callback.call(thisArg, value, index, iterable);
        if (min == null || comparable < min) {
          min = comparable; result = value;
        }
      });
      return result;
    };

    mixin.partition = function partition(callback, thisArg) {
      callback || (callback = IDENTITY);
      var trues = fuse.Array(), falses = fuse.Array();
      this._each(function(value, index, iterable) {
        (callback.call(thisArg, value, index, iterable) ?
          trues : falses).push(value);
      });
      return fuse.Array(trues, falses);
    };

    mixin.pluck = function pluck(property) {
      return this.map(function(value) {
        return value[property];
      });
    };

    mixin.size = function size() {
      return fuse.Number(this.toArray().length);
    };

    mixin.some = function some(callback, thisArg) {
      var result = false;
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      this.each(function(value, index, iterable) {
        if (callback.call(thisArg, value, index, iterable)) {
          return !(result = true);
        }
      });
      return result;
    };

    mixin.sortBy = function sortBy(callback, thisArg) {
      return this.map(function(value, index, iterable) {
        return {
          'value': value,
          'criteria': callback.call(thisArg, value, index, iterable)
        };
      }).sort(function(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
      }).pluck('value');
    };

    mixin.toArray = function toArray() {
      var result = fuse.Array();
      this._each(function(value, index) { result[index] = value; });
      return result;
    };

    mixin.zip = function zip() {
      var j, length, lists, plucked, callback = IDENTITY,
       args = slice.call(arguments, 0);

      // if last argument is a function it is the callback
      if (typeof args[args.length-1] == 'function') {
        callback = args.pop();
      }

      lists = prependList(args, this.toArray());
      length = lists.length;

      return this.map(function(value, index, iterable) {
        j = -1; plucked = fuse.Array();
        while (++j < length) {
          if (j in lists) plucked[j] = lists[j][index];
        }
        return callback(plucked, index, iterable);
      });
    };

    // prevent JScript bug with named function expressions
    var contains = null,
     each =        null,
     eachSlice =   null,
     every =       null,
     filter =      null,
     first =       null,
     inject =      null,
     inGroupsOf =  null,
     invoke =      null,
     last =        null,
     map =         null,
     max =         null,
     min =         null,
     partition =   null,
     pluck =       null,
     size =        null,
     some =        null,
     sortBy =      null,
     toArray =     null,
     zip =         null;
  })(fuse.Class.mixins.enumerable);
  /*------------------------------ LANG: ARRAY -------------------------------*/

  (function(plugin) {

    var from =
    fuse.Array.from = function from(iterable) {
      var length, object, result, Array = from[ORIGIN].Array;
      if (!arguments.length) {
        return Array();
      }
      // Safari 2.x will crash when accessing a non-existent property of a
      // node list, not in the document, that contains a text node unless we
      // use the `in` operator
      object = Object(iterable);
      if ('toArray' in object) {
        return object.toArray();
      }
      if ('item' in object) {
        return Array.fromNodeList(iterable);
      }
      if (isString(object)) {
        object = object.split('');
      }
      if ('length' in object) {
        length = object.length >>> 0;
        result = Array(length);
        while (length--) {
          if (length in object) result[length] = object[length];
        }
        return result;
      }
      return Array.fromArray([iterable]);
    },

    fromNodeList =
    fuse.Array.fromNodeList = function fromNodeList(nodeList) {
      var i = -1, result = fromNodeList[ORIGIN].Array();
      while (result[++i] = nodeList[i]) { }
      return result.length-- && result;
    };

    /*------------------------------------------------------------------------*/

    plugin.clear = function clear() {
      var object = Object(this), length = object.length >>> 0;
      if (!isArray(object)) {
        while (length--) {
          if (length in object) delete object[length];
        }
      }
      object.length = 0;
      return object;
    };

    var clone =
    plugin.clone = function clone(deep) {
      var length, result, i = -1, object = Object(this),
       Array = clone[ORIGIN].Array;
      if (deep) {
        result = Array();
        length = object.length >>> 0;
        while (++i < length) result[i] = fuse.Object.clone(object[i], deep);
      }
      else if (isArray(object)) {
        result = object.constructor != Array
          ? Array.fromArray(object)
          : object.slice(0);
      } else {
        result = Array.from(object);
      }
      return result;
    };

    var compact =
    plugin.compact = function compact(falsy) {
      var i = -1, j = i, object = Object(this), length = object.length >>> 0,
       result = compact[ORIGIN].Array();

      if (falsy) {
        while (++i < length) {
          if (object[i] && object[i] != '') result[++j] = object[i];
        }
      } else {
        while (++i < length) {
          if (object[i] != null) result[++j] = object[i];
        }
      }
      return result;
    };

    var flatten =
    plugin.flatten = function flatten() {
      var item, i = -1, j = i, object = Object(this),
       length = object.length >>> 0,
       result = flatten[ORIGIN].Array();

      while (++i < length) {
        if (isArray(item = object[i])) {
          j = concatList(result, flatten.call(item)).length - 1;
        } else {
          result[++j] = item;
        }
      }
      return result;
    };

    var insert =
    plugin.insert = function insert(index, value) {
      var plugin = insert[ORIGIN].Array.prototype,
       slice = plugin.slice, splice = plugin.splice,
       object = Object(this), length = object.length >>> 0;

      if (length < index) object.length = index;
      if (index < 0) index = length;
      if (arguments.length > 2) {
        splice.apply(object, concatList([index, 0], slice.call(arguments, 1)));
      } else {
        splice.call(object, index, 0, value);
      }
      return object;
    };

    var unique =
    plugin.unique = function unique() {
      var item, i = -1, j = i, object = Object(this),
       length = object.length >>> 0,
       result = unique[ORIGIN].Array();

      while (++i < length) {
        if (i in object && !result.contains(item = object[i]))
          result[++j] = item;
      }
      return result;
    };

    var without =
    plugin.without = function without() {
      var args, i = -1, j = i, object = Object(this),
       length = object.length >>> 0, result = without[ORIGIN].Array(),
       indexOf = result.indexOf, slice = result.slice;

      if (length) {
        args = slice.call(arguments, 0);
        while (++i < length) {
          if (i in object && indexOf.call(args, object[i]) == -1)
            result[++j] = object[i];
        }
      }
      return result;
    };

    /* Create optimized Enumerable equivalents */

    var contains =
    plugin.contains = (function() {
      var contains = function contains(value) {
        var item, object = Object(this), length = object.length >>> 0;
        while (length--) {
          if (length in object) {
            // basic strict match
            if ((item = object[length]) === value) return true;
            // match String and Number object instances
            try { if (item.valueOf() === value.valueOf()) return true; } catch (e) { }
          }
        }
        return false;
      };

      if (isFunction(plugin.indexOf)) {
        var __contains = contains;
        contains = function contains(value) {
          // attempt a fast strict search first
          var object = Object(this);
          return contains[ORIGIN].Array.prototype.indexOf.call(object, value) > -1 ?
            true : __contains.call(object, value);
        };
      }
      return contains;
    })();

    plugin.each = function each(callback, thisArg) {
      var i = -1, object = Object(this), length = object.length >>> 0;
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (++i < length) {
        if (i in object && callback.call(thisArg, object[i], i, object) === false) {
          break;
        }
      }
      return this;
    };

    var first =
    plugin.first = function first(callback, thisArg) {
      var count, i = -1, Array = first[ORIGIN].Array,
       object = Object(this), length = object.length >>> 0;
      if (callback == null) {
        while (++i < length) {
          if (i in object) return object[i];
        }
      }
      else if (typeof callback == 'function') {
        while (++i < length) {
          if (callback.call(thisArg, object[i], i))
            return object[i];
        }
      }
      else {
        count = +callback; // fast coerce to number
        if (isNaN(count)) return Array();
        count = count < 1 ? 1 : count > length ? length : count;
        return Array.prototype.slice.call(object, 0, count);
      }
    };

    var inject =
    plugin.inject = (function() {
      var inject = function inject(accumulator, callback, thisArg) {
        var i = -1, object = Object(this), length = object.length >>> 0;
        if (typeof callback != 'function') {
          throw new TypeError;
        }
        while (++i < length) {
          if (i in object)
            accumulator = callback.call(thisArg, accumulator, object[i], i, object);
        }
        return accumulator;
      };

      // use Array#reduce if available
      if (isFunction(plugin.reduce)) {
        var __inject = inject;
        inject = function inject(accumulator, callback, thisArg) {
          return thisArg
            ? __inject.call(this, accumulator, callback, thisArg)
            : inject[ORIGIN].Array.prototype.reduce.call(this, callback, accumulator);
        };
      }
      return inject;
    })();

    var intersect =
    plugin.intersect = function intersect(array) {
      var item, i = -1, j = i, Array = intersect[ORIGIN].Array,
       contains = Array.prototype.contains, object = Object(this),
       length = object.length >>> 0, result = Array();

      while (++i < length) {
        if (i in object &&
            contains.call(array, item = object[i]) &&
            !result.contains(item)) {
          result[++j] = item;
        }
      }
      return result;
    };

    var invoke =
    plugin.invoke = function invoke(method) {
      var args, result = invoke[ORIGIN].Array(),
       apply = invoke.apply, call = invoke.call, slice = result.slice,
       object = Object(this), length = object.length >>> 0;

      if (arguments.length < 2) {
        while (length--) {
          if (length in object)
            result[length] = call.call(object[length][method], object[length]);
        }
      } else {
        args = slice.call(arguments, 1);
        while (length--) {
          if (length in object)
            result[length] = apply.call(object[length][method], object[length], args);
        }
      }
      return result;
    };

    var last =
    plugin.last = function last(callback, thisArg) {
      var result, count, Array = last[ORIGIN].Array,
       object = Object(this), length = object.length >>> 0;

      if (callback == null) {
        return object[length && length - 1];
      }
      if (typeof callback == 'function') {
        while (length--) {
          if (callback.call(thisArg, object[length], length, object))
            return object[length];
        }
      } else {
        count = +callback;
        result = Array();
        if (isNaN(count)) return result;

        count = count < 1 ? 1 : count > length ? length : count;
        return result.slice.call(object, length - count);
      }
    };

    plugin.max = function max(callback, thisArg) {
      var result;
      if (!callback && (callback = IDENTITY) && isArray(this)) {
        // John Resig's fast Array max|min:
        // http://ejohn.org/blog/fast-javascript-maxmin
        result = Math.max.apply(Math, this);
        if (!isNaN(result)) return result;
        result = undef;
      }

      var comparable, max, value, i = -1,
       object = Object(this), length = object.length >>> 0;

      while (++i < length) {
        if (i in object) {
          comparable = callback.call(thisArg, value = object[i], i, object);
          if (max == null || comparable > max) {
            max = comparable; result = value;
          }
        }
      }
      return result;
    };

    plugin.min = function min(callback, thisArg) {
      var result;
      if (!callback && (callback = IDENTITY) && isArray(this)) {
        result = Math.min.apply(Math, this);
        if (!isNaN(result)) return result;
        result = undef;
      }

      var comparable, min, value, i = -1,
       object = Object(this), length = object.length >>> 0;

      while (++i < length) {
        if (i in object) {
          comparable = callback.call(thisArg, value = object[i], i, object);
          if (min == null || comparable < min) {
            min = comparable; result = value;
          }
        }
      }
      return result;
    };

    var partition =
    plugin.partition = function partition(callback, thisArg) {
      var item, i = -1, j = i, k = i,  Array = partition[ORIGIN].Array,
       object = Object(this), length = object.length >>> 0,
       trues = Array(), falses = Array();

      callback || (callback = fuse.Function.IDENTITY);
      while (++i < length) {
        if (i in object) {
          if (callback.call(thisArg, item = object[i], i, object)) {
            trues[++j] = item;
          } else {
            falses[++k] = item;
          }
        }
      }
      return Array(trues, falses);
    };

    var pluck =
    plugin.pluck = function pluck(property) {
      var i = -1, result = pluck[ORIGIN].Array(),
       object = Object(this), length = object.length >>> 0;

      while (++i < length) {
        if (i in object) result[i] = object[i][property];
      }
      return result;
    };

    var size =
    plugin.size = function size() {
      return size[ORIGIN].Number(Object(this).length >>> 0);
    };

    var sortBy =
    plugin.sortBy = function sortBy(callback, thisArg) {
      var value, i = -1,  array = [], object = Object(this),
       length = object.length >>> 0,
       result = sortBy[ORIGIN].Array();

      callback || (callback = fuse.Function.IDENTITY);
      while (length--) {
        value = object[length];
        array[length] = { 'value': value, 'criteria': callback.call(thisArg, value, length, object) };
      }

      array = array.sort(function(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
      });

      length = array.length;
      while (++i < length) {
        if (i in array) result[i] = array[i].value;
      }
      return result;
    };

    plugin.toArray = function toArray() {
      return slice.call(this, 0);
    };

    var zip =
    plugin.zip = function zip() {
      var lists, plucked, j, k, i = -1,
       result   = zip[ORIGIN].Array(),
       args     = result.slice.call(arguments, 0),
       callback = fuse.Function.IDENTITY,
       object   = Object(this),
       length   = object.length >>> 0;

      // if last argument is a function it is the callback
      if (typeof args[args.length - 1] == 'function') {
        callback = args.pop();
      }

      lists = prependList(args, object);
      k = lists.length;

      while (++i < length) {
        j = -1; plucked = fuse.Array();
        while (++j < k) {
          if (j in lists) plucked[j] = lists[j][i];
        }
        result[i] = callback(plucked, i, object);
      }
      return result;
    };

    /*------------------------------------------------------------------------*/

    /* Use native browser JS 1.6 implementations if available */

    // ES5 15.4.4.16
    if (!isFunction(plugin.every)) {
      plugin.every = function every(callback, thisArg) {
        var i = -1, object = Object(this), length = object.length >>> 0;
        if (typeof callback != 'function') {
          throw new TypeError;
        }
        while (++i < length) {
          if (i in object && !callback.call(thisArg, object[i], i, object))
            return false;
        }
        return true;
      };

      plugin.every.raw = plugin.every;
    }

    // ES5 15.4.4.20
    if (!isFunction(plugin.filter)) {
      var filter =
      plugin.filter = function filter(callback, thisArg) {
        var i = -1, j = i, object = Object(this), length = object.length >>> 0,
         result = filter[ORIGIN].Array();

        if (typeof callback != 'function') {
          throw new TypeError;
        }
        while (++i < length) {
          if (i in object && callback.call(thisArg, object[i], i, object))
            result[++j] = object[i];
        }
        return result;
      };

      filter[ORIGIN] = fuse;
      filter.raw = plugin.filter;
    }

    // ES5 15.4.4.18
    if (!isFunction(plugin.forEach)) {
      plugin.forEach = function forEach(callback, thisArg) {
        var i = -1, object = Object(this), length = object.length >>> 0;
        while (++i < length) {
          i in object && callback.call(thisArg, object[i], i, object);
        }
      };

      plugin.forEach.raw = plugin.forEach;
    }

    // ES5 15.4.4.14
    if (!isFunction(plugin.indexOf)) {
      var indexOf =
      plugin.indexOf = function indexOf(item, fromIndex) {
        var Number = indexOf[ORIGIN].Number,
         object = Object(this), length = object.length >>> 0;

        fromIndex = toInteger(fromIndex);
        if (fromIndex < 0) fromIndex = length + fromIndex;
        fromIndex--;

        // ES5 draft oversight, should use [[HasProperty]] instead of [[Get]]
        while (++fromIndex < length) {
          if (fromIndex in object && object[fromIndex] === item)
            return Number(fromIndex);
        }
        return Number(-1);
      };

      indexOf[ORIGIN] = fuse;
      indexOf.raw = plugin.indexOf;
    }

    // ES5 15.4.4.15
    if (!isFunction(plugin.lastIndexOf)) {
      var lastIndexOf =
      plugin.lastIndexOf = function lastIndexOf(item, fromIndex) {
        var object = Object(this), length = object.length >>> 0;
        fromIndex = fromIndex == null ? length : toInteger(fromIndex);

        if (!length) return fuse.Number(-1);
        if (fromIndex > length) fromIndex = length - 1;
        if (fromIndex < 0) fromIndex = length + fromIndex;

        // ES5 draft oversight, should use [[HasProperty]] instead of [[Get]]
        fromIndex++;
        while (--fromIndex > -1) {
          if (fromIndex in object && object[fromIndex] === item) break;
        }
        return lastIndexOf[ORIGIN].Number(fromIndex);
      };

      lastIndexOf[ORIGIN] = fuse;
      lastIndexOf.raw = plugin.lastIndexOf;
    }

    // ES5 15.4.4.19
    if (!isFunction(plugin.map)) {
      var map =
      plugin.map = function map(callback, thisArg) {
        var i = -1, object = Object(this), length = object.length >>> 0,
         result = map[ORIGIN].Array();

        if (typeof callback != 'function') {
          throw new TypeError;
        }
        while (++i < length) {
          if (i in object) result[i] = callback.call(thisArg, object[i], i, object);
        }
        return result;
      };

      map[ORIGIN] = fuse;
      map.raw = plugin.map;
    }

    // ES5 15.4.4.17
    if (!isFunction(plugin.some)) {
      plugin.some = function some(callback, thisArg) {
        var i = -1, object = Object(this), length = object.length >>> 0;
        if (typeof callback != 'function') {
          throw new TypeError;
        }
        while (++i < length) {
          if (i in object && callback.call(thisArg, object[i], i, object))
            return true;
        }
        return false;
      };

      plugin.some.raw = plugin.some;
    }

    // assign any missing Enumerable methods
    if (fuse.Class.mixins.enumerable) {
      plugin._each = function _each(callback) {
        this.forEach(callback);
        return this;
      };

      eachKey(fuse.Class.mixins.enumerable, function(value, key, object) {
        if (hasKey(object, key) && !isFunction(plugin[key])) {
          plugin[key] = value;
        }
      });
    }

    clone[ORIGIN] =
    compact[ORIGIN] =
    contains[ORIGIN] =
    first[ORIGIN] =
    flatten[ORIGIN] =
    from[ORIGIN] =
    fromNodeList[ORIGIN] =
    inject[ORIGIN] =
    insert[ORIGIN] =
    intersect[ORIGIN] =
    invoke[ORIGIN] =
    last[ORIGIN] =
    partition[ORIGIN] =
    pluck[ORIGIN] =
    size[ORIGIN] =
    sortBy[ORIGIN] =
    unique[ORIGIN] =
    without[ORIGIN] =
    zip[ORIGIN] = fuse;

    // prevent JScript bug with named function expressions
    var _each = null,
     clear =    null,
     each =     null,
     every =    null,
     forEach =  null,
     max =      null,
     min =      null,
     some =     null,
     toArray =  null;
  })(fuse.Array.plugin);
  /*------------------------------ LANG: NUMBER ------------------------------*/

  (function(plugin) {
    var pad    = '000000',
     __toFixed = 0..toFixed,
     __abs     = Math.abs,
     __ceil    = Math.ceil,
     __floor   = Math.floor,
     __round   = Math.round;

    plugin.abs = function abs() {
      return fuse.Number(__abs(this));
    };

    plugin.ceil = function ceil() {
      return fuse.Number(__ceil(this));
    };

    plugin.clone = function clone() {
      return fuse.Number(this);
    };

    plugin.floor = function floor() {
      return fuse.Number(__floor(this));
    };

    plugin.round = function round(fractionDigits) {
      return fuse.Number(fractionDigits
        ? parseFloat(__toFixed.call(this, fractionDigits))
        : __round(this));
    };

    plugin.times = function times(callback, thisArg) {
      var i = -1, length = toInteger(this);
      if (arguments.length == 1) {
        while (++i < length) callback(i, i);
      } else {
        while (++i < length) callback.call(thisArg, i, i);
      }
      return this;
    };

    plugin.toColorPart = function toColorPart() {
      return plugin.toPaddedString.call(this, 2, 16);
    };

    plugin.toPaddedString = function toPaddedString(length, radix) {
      var string = toInteger(this).toString(radix || 10);
      if (length <= string.length) return fuse.String(string);
      if (length > pad.length) pad = Array(length + 1).join('0');
      return fuse.String((pad + string).slice(-length));
    };

    // prevent JScript bug with named function expressions
    var abs =         null,
     ceil =           null,
     clone =          null,
     floor =          null,
     round =          null,
     times =          null,
     toColorPart =    null,
     toPaddedString = null;
  })(fuse.Number.plugin);
  /*------------------------------ LANG: REGEXP ------------------------------*/

  (function(plugin) {
    fuse.RegExp.escape = function escape(string) {
      return fuse.String(escapeRegExpChars(string));
    };

    plugin.clone = function clone(options) {
      options = fuse.Object.extend({
        'global':     this.global,
        'ignoreCase': this.ignoreCase,
        'multiline':  this.multiline
      }, options);

      return fuse.RegExp(this.source,
        (options.global     ? 'g' : '') +
        (options.ignoreCase ? 'i' : '') +
        (options.multiline  ? 'm' : ''));
    };

    // prevent JScript bug with named function expressions
    var clone = null, escape = null;
  })(fuse.RegExp.plugin);
  /*------------------------------ LANG: STRING ------------------------------*/

  (function(plugin) {
    var reCapped    = /([A-Z]+)([A-Z][a-z])/g,
     reCamelCases   = /([a-z\d])([A-Z])/g,
     reDoubleColons = /::/g,
     reHyphens      = /-/g,
     reHyphenated   = /-+(.)?/g,
     reUnderscores  = /_/g,
     reTrimLeft     = /^\s\s*/,
     reTrimRight    = /\s\s*$/,

    rawReplace = plugin.replace.raw,

    repeater = function(string, count) {
      // Based on work by Yaffle and Dr. J.R.Stockton.
      // Uses the `Exponentiation by squaring` algorithm.
      // http://www.merlyn.demon.co.uk/js-misc0.htm#MLS
      if (count < 1) return '';
      if (count % 2) return repeater(string, count - 1) + string;
      var half = repeater(string, count / 2);
      return half + half;
    },

    strReplace = function(pattern, replacement) {
      return (strReplace = envTest('STRING_REPLACE_COERCE_FUNCTION_TO_STRING') ?
        plugin.replace : rawReplace).call(this, pattern, replacement);
    },

    toUpperCase = function(match, character) {
      return character ? character.toUpperCase() : '';
    };

    /*------------------------------------------------------------------------*/

    plugin.capitalize = function capitalize() {
      var string = String(this);
      return fuse.String(string.charAt(0).toUpperCase() +
        string.slice(1).toLowerCase());
    };

    plugin.clone = function clone() {
      return fuse.String(this);
    };

    plugin.contains = function contains(pattern) {
      return String(this).indexOf(pattern) > -1;
    };

    plugin.isBlank = function isBlank() {
      return String(this) == false;
    };

    plugin.isEmpty = function isEmpty() {
      return !String(this).length;
    };

    plugin.endsWith = function endsWith(pattern) {
      // when searching for a pattern at the end of a long string
      // indexOf(pattern, fromIndex) is faster than lastIndexOf(pattern)
      var string = String(this), d = string.length - pattern.length;
      return d >= 0 && string.indexOf(pattern, d) == d;
    };

    plugin.hyphenate = function hyphenate() {
      return fuse.String(rawReplace.call(this, reUnderscores, '-'));
    };

    plugin.repeat = function repeat(count) {
      return fuse.String(repeater(String(this), toInteger(count)));
    };

    plugin.startsWith = function startsWith(pattern) {
      // when searching for a pattern at the start of a long string
      // lastIndexOf(pattern, fromIndex) is faster than indexOf(pattern)
      return !String(this).lastIndexOf(pattern, 0);
    };

    plugin.toArray = function toArray() {
      return fuse.String(this).split('');
    };

    plugin.toCamelCase = function camelCase() {
      return fuse.String(strReplace.call(this, reHyphenated, toUpperCase));
    };

    plugin.truncate = function truncate(length, truncation) {
      var endIndex, string = String(this);
      length = +length;

      if (isNaN(length)) {
        length = 30;
      }
      if (length < string.length) {
        truncation = truncation == null ? '...' : String(truncation);
        endIndex = length - truncation.length;
        string = endIndex > 0 ? string.slice(0, endIndex) + truncation : truncation;
      }
      return fuse.String(string);
    };

    plugin.underscore = function underscore() {
      return fuse.String(rawReplace
        .call(this, reDoubleColons, '/')
        .replace(reCapped,     '$1_$2')
        .replace(reCamelCases, '$1_$2')
        .replace(reHyphens,    '_').toLowerCase());
    };

    // ES5 15.5.4.20
    if (!isFunction(plugin.trim)) {
      plugin.trim = function trim() {
        return rawReplace.call(this, reTrimLeft, '').replace(reTrimRight, '');
      };

      plugin.trim.raw = plugin.trim;
    }
    // non-standard
    if (!isFunction(plugin.trimLeft)) {
      plugin.trimLeft = function trimLeft() {
        return rawReplace.call(this, reTrimLeft, '');
      };

      plugin.trimLeft.raw = plugin.trimLeft;
    }
    // non-standard
    if (!isFunction(plugin.trimRight)) {
      plugin.trimRight = function trimRight() {
        return rawReplace.call(this, reTrimRight, '');
      };

      plugin.trimRight.raw = plugin.trimRight;
    }

    // prevent JScript bug with named function expressions
    var capitalize = null,
      clone =        null,
      contains =     null,
      endsWith =     null,
      hyphenate =    null,
      isBlank =      null,
      isEmpty =      null,
      repeat =       null,
      startsWith =   null,
      toArray =      null,
      toCamelCase =  null,
      trim =         null,
      trimLeft =     null,
      trimRight =    null,
      truncate =     null,
      underscore =   null;
  })(fuse.String.plugin);

  /*------------------------------- LANG: HASH -------------------------------*/

  fuse.Hash = (function() {

    var Klass = function() { },

    Hash = function Hash(object) {
      return setWithObject((new Klass).clear(), object);
    },

    merge = function merge(object) {
      return setWithObject(this.clone(), object);
    },

    set = function set(key, value) {
      return isString(key)
        ? setValue(this, key, value)
        : setWithObject(this, key);
    },

    unset = function unset(key) {
      var data = this._data, i = -1,
       keys = isArray(key) ? key : arguments;

      while (key = keys[++i])  {
        if ((uid + key) in data)
          unsetByIndex(this, indexOfKey(this, key));
      }
      return this;
    },

    indexOfKey = function(hash, key) {
      key = String(key);
      var i = -1, keys = hash._keys, length = keys.length;
      while (++i < length) {
        if (keys[i] == key) return i;
      }
    },

    setValue = function(hash, key, value) {
      if (!key.length) return hash;
      var data = hash._data, uidKey = uid + key, keys = hash._keys;

      // avoid a method call to Hash#hasKey
      if (uidKey in data) {
        unsetByIndex(hash, indexOfKey(hash, key));
      }

      keys.push(key = fuse.String(key));

      hash._pairs.push(fuse.Array(key, value));
      hash._values.push(value);

      hash._data[uidKey] =
      hash._object[key] = value;
      return hash;
    },

    setWithObject = function(hash, object) {
      if (isHash(object)) {
        var pair, i = -1, pairs = object._pairs;
        while (pair = pairs[++i]) setValue(hash, pair[0], pair[1]);
      }
      else {
        eachKey(object, function(value, key) {
          if (hasKey(object, key)) setValue(hash, key, value);
        });
      }
      return hash;
    },

    unsetByIndex = function(hash, index) {
      var keys = hash._keys;
      delete hash._data[uid + keys[index]];
      delete hash._object[keys[index]];

      keys.splice(index, 1);
      hash._pairs.splice(index, 1);
      hash._values.splice(index, 1);
    };

    fuse.Class({ 'constructor': Hash, 'merge': merge, 'set': set, 'unset': unset });
    Klass.prototype = Hash.plugin;
    return Hash;
  })();

  fuse.Hash.from = fuse.Hash;

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    function _returnPair(pair) {
      var key, value;
      pair = fuse.Array(key = pair[0], value = pair[1]);
      pair.key = key;
      pair.value = value;
      return pair;
    }

    plugin.first = function first(callback, thisArg) {
      var pair, i = -1, pairs = this._pairs;
      if (callback == null) {
        if (pairs.length) return _returnPair(pairs[0]);
      }
      else if (typeof callback == 'function') {
        while (pair = pairs[++i]) {
          if (callback.call(thisArg, pair[1], pair[0], this))
            return _returnPair(pair);
        }
      }
      else {
        var count = +callback, result = fuse.Array();
        if (isNaN(count)) return result;
        count = count < 1 ? 1 : count;
        while (++i < count && (pair = pairs[i])) result[i] = _returnPair(pair);
        return result;
      }
    };

    plugin.last = function last(callback, thisArg) {
      var pair, i = -1, pairs = this._pairs, length = pairs.length;
      if (callback == null) {
        if (length) return _returnPair(this._pairs.last());
      }
      else if (typeof callback == 'function') {
        while (length--) {
          pair = pairs[length];
          if (callback.call(thisArg, pair[1], pair[2], this))
            return _returnPair(pair);
        }
      }
      else {
        var count = +callback, result = fuse.Array();
        if (isNaN(count)) return result;
        count = count < 1 ? 1 : count > length ? length : count;
        var  pad = length - count;
        while (++i < count)
          result[i] = _returnPair(pairs[pad + i]);
        return result;
      }
    };

    // prevent JScript bug with named function expressions
    var _each = null, first = null, last = null;
  })(fuse.Hash.plugin);

  /*--------------------------------------------------------------------------*/

  (function(plugin, $H) {

    plugin.clear = function clear() {
      this._data   = { };
      this._object = { };
      this._keys   = fuse.Array();
      this._pairs  = fuse.Array();
      this._values = fuse.Array();
      return this;
    };

    plugin.clone = function clone(deep) {
      var result, pair, pairs, i = -1;
      if (deep) {
        result = $H();
        pairs  = this._pairs;
        while (pair = pairs[++i]) {
          result.set(pair[0], fuse.Object.clone(pair[1], deep));
        }
      } else {
        result = $H(this);
      }
      return result;
    };

    plugin.contains = function contains(value) {
      var item, pair, i = -1, pairs = this._pairs;
      while (pair = pairs[++i]) {
        // basic strict match
        if ((item = pair[1]) === value) return true;
        // match String and Number object instances
        try { if (item.valueOf() === value.valueOf()) return true; } catch (e) { }
      }
      return false;
    };

    plugin.filter = function filter(callback, thisArg) {
      var key, pair, value, i = -1, pairs = this._pairs, result = $H();
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      while (pair = pairs[++i]) {
        if (callback.call(thisArg, value = pair[1], key = pair[0], this))
          result.set(key, value);
      }
      return result;
    };

    plugin.get = function get(key) {
      return this._data[uid + key];
    };

    plugin.hasKey = (function() {
      function hasKey(key) { return (uid + key) in this._data; }
      return hasKey;
    })();

    plugin.keyOf = function keyOf(value) {
      var pair, i = -1, pairs = this._pairs;
      while (pair = pairs[++i]) {
        if (value === pair[1])
          return pair[0];
      }
      return fuse.Number(-1);
    };

    plugin.keys = function keys() {
      return fuse.Array.fromArray(this._keys);
    };

    plugin.map = function map(callback, thisArg) {
      var key, pair, i = -1, pairs = this._pairs, result = $H();
      if (typeof callback != 'function') {
        throw new TypeError;
      }
      if (thisArg) {
        while (pair = pairs[++i])
          result.set(key = pair[0], callback.call(thisArg, pair[1], key, this));
      } else {
        while (pair = pairs[++i])
          result.set(key = pair[0], callback(pair[1], key, this));
      }
      return result;
    };

    plugin.partition = function partition(callback, thisArg) {
      callback || (callback = IDENTITY);
      var key, value, pair, i = -1, pairs = this._pairs,
       trues = $H(), falses = $H();

      while (pair = pairs[++i]) {
        (callback.call(thisArg, value = pair[1], key = pair[0], this) ?
          trues : falses).set(key, value);
      }
      return fuse.Array(trues, falses);
    };

    plugin.size = function size() {
      return fuse.Number(this._keys.length);
    };

    plugin.toArray = function toArray() {
      return fuse.Array.fromArray(this._pairs);
    };

    plugin.toObject = function toObject() {
      var pair, i = -1, pairs = this._pairs, result = fuse.Object();
      while (pair = pairs[++i]) result[pair[0]] = pair[1];
      return result;
    };

    plugin.values = function values() {
      return fuse.Array.fromArray(this._values);
    };

    plugin.zip = function zip() {
      var j, key, length, pair, pairs, values, i = -1,
       args     = slice.call(arguments, 0),
       callback = IDENTITY,
       hashes   = [this],
       pairs    = this._pairs,
       result   = $H();

      // if last argument is a function it is the callback
      if (typeof args[args.length - 1] == 'function') {
        callback = args.pop();
      }

      length = args.length;
      while (length--) {
        hashes[length + 1] = $H(args[length]);
      }

      length = hashes.length;
      while (pair = pairs[++i]) {
        j = -1; values = fuse.Array(); key = pair[0];
        while (++j < length) values[j] = hashes[j]._data[uid + key];
        result.set(key, callback(values, key, this));
      }
      return result;
    };

    // prevent JScript bug with named function expressions
    var clear =  null,
     clone =     null,
     contains =  null,
     filter =    null,
     get =       null,
     keys =      null,
     keyOf =     null,
     map =       null,
     partition = null,
     size =      null,
     toArray =   null,
     toObject =  null,
     values =    null,
     zip =       null;
  })(fuse.Hash.plugin, fuse.Hash);
  /*------------------------------- LANG: RANGE ------------------------------*/

  fuse.Range = (function() {
    var Klass = function() { },

    Range = function Range(start, end, exclusive) {
      var instance = __instance || new Klass;
      __instance = null;

      instance.start     = fuse.Object(start);
      instance.end       = fuse.Object(end);
      instance.exclusive = exclusive;
      return instance;
    },

    __instance,
    __apply = Range.apply,
    __call = Range.call;

    Range.call = function(thisArg) {
      __instance = thisArg;
      return __call.apply(this, arguments);
    };

    Range.apply = function(thisArg, argArray) {
      __instance = thisArg;
      return __apply.call(this, thisArg, argArray);
    };

    fuse.Class({ 'constructor': Range });
    Klass.prototype = Range.plugin;
    return Range;
  })();

  /*--------------------------------------------------------------------------*/

  (function(plugin) {
    var __max, __min,

    buildCache = function(thisArg, callback) {
      var c = thisArg._cache = fuse.Array(), i = 0,
       value = c.start = thisArg.start = fuse.Object(thisArg.start);

      c.end = thisArg.end = fuse.Object(thisArg.end);
      c.exclusive = thisArg.exclusive;

      if (callback) {
        while (isInRange(thisArg, value)) {
          c.push(value);
          callback(value, i++, thisArg);
          value = value.succ();
        }
      } else {
        while (isInRange(thisArg, value)) {
          c.push(value) && (value = value.succ());
        }
      }
    },

    isExpired = function(thisArg) {
      var c = thisArg._cache, result = false;
      if (!c || thisArg.start != c.start || thisArg.end != c.end) {
        result = true;
      }
      else if (thisArg.exclusive != c.exclusive) {
        c.exclusive = thisArg.exclusive;
        if (c.exclusive) {
          c.pop();
        } else {
          // add incremented last value to the range
          c.push(c[c.length - 1].succ());
        }
      }
      return result;
    },

    isInRange = function(thisArg, value) {
      if (value < thisArg.start) {
        return false;
      }
      if (thisArg.exclusive) {
        return value < thisArg.end;
      }
      return value <= thisArg.end;
    };

    plugin._each = function _each(callback) {
      if (isExpired(this)) {
        buildCache(this, callback);
      } else {
        var c = this._cache, i = 0, length = c.length;
        while (i < length) callback(c[i], i++ , this);
      }
    };

    plugin.clone = function clone() {
      return fuse.Range(this.start, this.end, this.exclusive);
    };

    plugin.max = function max(callback, thisArg) {
      var result;
      if (!callback) {
        if (isExpired(this)) buildCache(this, callback);
        result = this._cache[this._cache.length - 1];
      } else {
        result = __max.call(this, callback, thisArg);
      }
      return result;
    };

    plugin.min = function min(callback, thisArg) {
      return !callback
        ? this.start
        : __min.call(this, callback, thisArg);
    };

    plugin.size = function size() {
      var c = this._cache;
      if (isExpired(this)) {
        if (isNumber(this.start) && isNumber(this.end)) {
          return fuse.Number(this.end - this.start + (this.exclusive ? 0 : 1));
        }
        buildCache(this);
      }
      return fuse.Number(this._cache.length);
    };

    plugin.toArray = function toArray() {
      isExpired(this) && buildCache(this);
      return fuse.Array.fromArray(this._cache);
    };

    // assign any missing Enumerable methods
    (function(mixin) {
      if (mixin) {
        __max = mixin.max;
        __min = mixin.min;
        eachKey(mixin, function(value, key, object) {
          if (hasKey(object, key) && !isFunction(plugin[key])) {
            plugin[key] = value;
          }
        });
      }
    })(fuse.Class.mixins.enumerable);

    // prevent JScript bug with named function expressions
    var _each = null, clone = null, max = null, min = null, size = null, toArray = null;
  })(fuse.Range.plugin);

  /*--------------------------------------------------------------------------*/

  (function() {
    fuse.Number.plugin.succ = function succ() {
      return fuse.Number(toInteger(this) + 1);
    };

    fuse.String.plugin.succ = function succ() {
      var index = this.length - 1;
      return fuse.String(this.slice(0, index) +
        String.fromCharCode(this.charCodeAt(index) + 1));
    };

    // prevent JScript bug with named function expressions
    var succ = null;
  })();
  /*----------------------------- LANG: TEMPLATE -----------------------------*/

  fuse.Template = (function() {
    var Klass = function() { },

    Template = function Template(template, pattern) {
      pattern || (pattern = Template.defaults.pattern);
      if (!isRegExp(pattern)) {
        pattern = fuse.RegExp(escapeRegExpChars(pattern));
      }
      if (!pattern.global) {
        pattern = fuse.RegExp.clone(pattern, { 'global': true });
      }
      if (pattern.constructor != fuse.RegExp) {
        pattern = fuse.Object(pattern);
      }

      var instance = __instance || new Klass;
      __instance = null;

      instance.pattern = pattern;
      instance.template = fuse.String(template);
      instance.preparse();
      return instance;
    },

    __instance,
    __apply = Template.apply,
    __call = Template.call;

    Template.apply = function(thisArg, argArray) {
      __instance = thisArg;
      return __apply.call(this, thisArg, argArray);
    };

    Template.call = function(thisArg) {
      __instance = thisArg;
      return __call.apply(this, arguments);
    };

    fuse.Class({ 'constructor': Template });
    Klass.prototype = Template.plugin;
    return Template;
  })();

  fuse.Template.defaults = {
    'pattern': /(\\)?(#\{([^}]*)\})/g
  };

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    var strPlugin = fuse.String.plugin,

    reBackslashs = /\\/g,

    reBrackets = /\[((?:(?!\])[^\\]|\\.)*)\]/g,

    reDots = /\./g,

    reSplitByDot = /\b(?!\\)\./g,

    escapeDots = function(match, path) {
      return '.' + path.replace(reDots, '\\.');
    },

    strReplace = function(pattern, replacement) {
      return (strReplace = envTest('STRING_REPLACE_COERCE_FUNCTION_TO_STRING') ?
        strPlugin.replace : strPlugin.replace.raw).call(this, pattern, replacement);
    },

    strSplit = function(separator) {
      return (strSplit = envTest('STRING_SPLIT_BUGGY_WITH_REGEXP') ?
        strPlugin.split : strPlugin.split.raw).call(this, separator);
    };


    plugin.clone = function clone() {
      return fuse.Template(this.template, this.pattern);
    };

    plugin.preparse = function preparse() {
      var backslash, chain, escaped, prop, temp, token, tokens, j, i = 1,
       template = String(this.template),
       parts    = strSplit.call(template, this.pattern),
       length   = parts.length;

      escaped = this._escaped = { };
      tokens  = this._tokens  = { };
      this._lastTemplate = this.template;

      for ( ; i < length; i += 4) {
        backslash = parts[i];
        token     = parts[i + 1];
        chain     = parts[i + 2];

        // process non escaped tokens
        if (backslash != '\\') {
          // avoid parsing duplicates
          if (tokens[token]) continue;

          j = -1; temp = strSplit.call(chain, reSplitByDot); chain = [];
          while (prop = temp[++j]) {
            // convert bracket notation to dot notation then split and add
            if (prop.indexOf('[') > -1) {
              prop = strReplace.call(prop, reBrackets, escapeDots);
              if (prop.charAt(0) == '.') prop = prop.slice(1);
              chain.push.apply(chain, strSplit.call(prop, reSplitByDot));
            }
            // simply add
            else {
              chain.push(prop);
            }
          }
          // unescape property names
          j = -1;
          while (prop = chain[++j]) {
            chain[j] = prop.replace(reBackslashs, '');
          }

          // cache tokens
          tokens[token] = {
            'chain': chain,
            'reToken': new RegExp(escapeRegExpChars(token), 'g')
          };
        }
        else {
          // mark to unescape
          escaped[token] = escapeRegExpChars(backslash + token);
        }
      }

      for (token in escaped) {
        // unescape tokens that are not being replaced
        if (!tokens[token]) {
          template = template.replace(new RegExp(escaped[token], 'g'), token);
          delete escaped[token];
        }
        // changed escaped tokens slightly so they aren't
        // replaced like thier none-escaped duplicates
        else {
          temp = Math.floor(token.length / 2);
          temp = token.slice(0, temp) + uid + token.slice(temp);
          template = template.replace(new RegExp(escaped[token], 'g'), temp);
          escaped[token] = new RegExp(escapeRegExpChars(temp), 'g');
        }
      }

      // cache modified template
      this._template = template;
      return this;
    };

    plugin.parse = function parse(object) {
      // check if cache has expired
      if (this.template != this._lastTemplate) {
        this.preparse();
      }

      var i, o, c, chain, found, lastIndex, length, prop, token,
       escaped = this._escaped,
       tokens  = this._tokens,
       result  = String(this._template);

      if (object) {
        if (isHash(object)) {
          object = object._object;
        } else if (typeof object.toTemplateReplacements == 'function') {
          object = object.toTemplateReplacements();
        } else if (typeof object.toObject == 'function') {
          object = object.toObject();
        }
      }

      object || (object = { });
      for (token in tokens) {
        i = -1; found = false; c = tokens[token]; o = object;
        chain = c.chain;
        length = chain.length;
        lastIndex = length - 1;

        while (++i < length) {
          if (!hasKey(o, prop = chain[i])) break;
          o = o[prop];
          found = i == lastIndex;
        }
        // replace token with property value if found and != null
        result = result.replace(c.reToken, found && o != null ? o : '');
      }

      // unescape remianing tokens
      for (token in escaped) {
        result = result.replace(escaped[token], token);
      }

      return fuse.String(result);
    };

    // prevent JScript bug with named function expressions
    var clone = null, preparse = null, parse = null;
  })(fuse.Template.plugin);

  /*--------------------------------------------------------------------------*/

  (function(plugin) {
    var strReplace = function(pattern, replacement) {
      return (strReplace = plugin.replace).call(this, pattern, replacement);
    },

    prepareReplacement = function(replacement) {
      if (typeof replacement == 'function') {
        return function() { return replacement(slice.call(arguments, 0, -2)); };
      }
      var template = fuse.Template(replacement);
      return function() { return template.parse(slice.call(arguments, 0, -2)); };
    };

    plugin.gsub = function gsub(pattern, replacement) {
      if (!isRegExp(pattern)) {
        pattern = fuse.RegExp(escapeRegExpChars(pattern), 'g');
      }
      if (!pattern.global) {
        pattern = fuse.RegExp.clone(pattern, { 'global': true });
      }
      return strReplace.call(this, pattern, prepareReplacement(replacement));
    };

    plugin.interpolate = function interpolate(object, pattern) {
      return fuse.Template(this, pattern).parse(object);
    };

    plugin.scan = function scan(pattern, callback) {
      var result = fuse.String(this);
      result.gsub(pattern, callback);
      return result;
    };

    plugin.sub = function sub(pattern, replacement, count) {
      if (count == null || count == 1) {
        if (!isRegExp(pattern)) {
          pattern = fuse.RegExp(escapeRegExpChars(pattern));
        }
        if (pattern.global) {
          pattern = fuse.RegExp.clone(pattern, { 'global': false });
        }
        return strReplace.call(this, pattern, prepareReplacement(replacement));
      }

      if (typeof replacement != 'function') {
        var template = fuse.Template(replacement);
        replacement = function(match) { return template.parse(match); };
      }

      return fuse.String(this).gsub(pattern, function(match) {
        if (--count < 0) return match[0];
        return replacement(match);
      });
    };

    // prevent JScript bug with named function expressions
    var gsub = null, interpolate = null, scan = null, sub = null;
  })(fuse.String.plugin);
  /*------------------------ LANG: TIMER -----------------------*/

  fuse.Timer = (function() {
    var Obj = fuse.Object,

    Klass = function() { },

    Timer = function Timer(callback, interval, options) {
      var instance = __instance || new Klass;
      __instance = null;

      instance.callback  = callback;
      instance.interval  = interval;
      instance.executing = false;

      instance.onTimerEvent = function() { onTimerEvent.call(instance); };
      instance.options = Obj.extend(Obj.clone(Timer.defaults), options);
      return instance;
    },

    onTimerEvent = function() {
      if (!this.executing) {
        this.executing = true;

        // IE6 bug with try/finally, the finally does not get executed if the
        // exception is uncaught. So instead we set the flags and start the
        // timer before throwing the error.
        try {
          this.execute();
          this.executing = false;
          if (this._timerId !== null) this.start();
        }
        catch (e) {
          this.executing = false;
          if (this._timerId !== null) this.start();
          throw e;
        }
      }
    },

    __instance,
    __apply = Timer.apply,
    __call  = Timer.call;

    Timer.call = function(thisArg) {
      __instance = thisArg;
      return __call.apply(this, arguments);
    };

    Timer.apply = function(thisArg, argArray) {
      __instance = thisArg;
      return __apply.call(this, thisArg, argArray);
    };

    fuse.Class({ 'constructor': Timer });
    Klass.prototype = Timer.plugin;
    return Timer;
  })();

  (function(plugin) {
    plugin.execute = function execute() {
      this.callback(this);
    };

    plugin.start = function start() {
      this._timerId = setTimeout(this.onTimerEvent,
        this.interval * this.options.multiplier);
      return this;
    };

    plugin.stop = function stop() {
      var id = this._timerId;
      if (id === null) return;
      window.clearTimeout(id);
      this._timerId = null;
      return this;
    };

    // prevent JScript bug with named function expressions
    var execute = null, start = null, stop = null;
  })(fuse.Timer.plugin);

  fuse.Timer.defaults = {
    'multiplier': 1
  };

  /*----------------------------- DOM: FEATURES ------------------------------*/

  envAddTest({
    'ELEMENT_ADD_EVENT_LISTENER': function() {
      // true for all but IE
      return isHostType(fuse._doc, 'addEventListener');
    },

    'ELEMENT_ATTACH_EVENT': function() {
      // true for IE
      return isHostType(fuse._doc, 'attachEvent') &&
        !envTest('ELEMENT_ADD_EVENT_LISTENER');
    },

    'ELEMENT_BOUNDING_CLIENT_RECT': function() {
      // true for IE, Firefox 3
      return isHostType(fuse._docEl, 'getBoundingClientRect');
    },

    'ELEMENT_COMPARE_DOCUMENT_POSITION': function() {
      // true for Firefox and Opera 9.5+
      return isHostType(fuse._docEl, 'compareDocumentPosition');
    },

    'ELEMENT_COMPUTED_STYLE': function() {
      // true for all but IE
      return isHostType(fuse._doc, 'defaultView') &&
        isHostType(fuse._doc.defaultView, 'getComputedStyle');
    },

    'ELEMENT_CURRENT_STYLE': function() {
      // true for IE
      return isHostType(fuse._docEl, 'currentStyle') &&
        !envTest('ELEMENT_COMPUTED_STYLE');
    },

    'ELEMENT_CONTAINS': function() {
      // true for all but Safari 2
      if(isHostType(fuse._docEl, 'contains')) {
        var result, div = fuse._div;
        div.appendChild(div.cloneNode(false));
        div.appendChild(div.cloneNode(true));

        // ensure element.contains() returns the correct results;
        result = !div.firstChild.contains(div.childNodes[1].firstChild);
        emptyElement(div);
        return result;
      }
    },

    // features
    'ELEMENT_DO_SCROLL': function() {
      // true for IE
      return isHostType(fuse._docEl, 'doScroll');
    },

    'ELEMENT_GET_ATTRIBUTE_IFLAG': function() {
      // true for IE
      var div = fuse._div, result = false;
      try {
        div.setAttribute('align', 'center'); div.setAttribute('aLiGn', 'left');
        result = (div.getAttribute('aLiGn') == 'center' &&
          div.getAttribute('aLiGn', 1) == 'left');
        div.removeAttribute('align'); div.removeAttribute('aLiGn');
      } catch(e) { }
      return result;
    },

    'ELEMENT_HAS_ATTRIBUTE': function() {
      // true for all but IE
      var result, option = fuse._doc.createElement('option');
      if (isHostType(option, 'hasAttribute')) {
        option.setAttribute('selected', 'selected');
        result = !!option.hasAttribute('selected');
      }
      return result;
    },

    'ELEMENT_INNER_HTML': function() {
      var div = fuse._div;
      try { div.innerHTML = '<p><\/p>' } catch(e) { }
      return !!div.firstChild;
    },

    'ELEMENT_INNER_TEXT': function() {
      // true for IE
      return !envTest('ELEMENT_TEXT_CONTENT') &&
        typeof fuse._div.innerText == 'string';
    },

    'ELEMENT_MS_CSS_FILTERS': function() {
      // true for IE
      var docEl = fuse._docEl, elemStyle = docEl.style;
      return isHostType(docEl, 'filters') &&
        typeof elemStyle.filter == 'string' &&
        typeof elemStyle.opacity != 'string';
    },

    'ELEMENT_REMOVE_NODE': function() {
      // true for IE and Opera
      return isHostType(fuse._docEl, 'removeNode');
    },

    'ELEMENT_SOURCE_INDEX': function() {
      // true for IE and Opera
      return isHostType(fuse._doc, 'all') &&
        typeof fuse._docEl.sourceIndex == 'number'
    },

    'ELEMENT_TEXT_CONTENT': function() {
      // true for all but IE and Safari 2
      return typeof fuse._div.textContent == 'string';
    },

    'ELEMENT_UNIQUE_NUMBER': function() {
      // IE's uniqueNumber property starts at 1 when the browser session begins.
      // To avoid a conflict with the document's data id of 1 we check
      // uniqueNumber on a dummy element first.
      return typeof fuse._div.uniqueNumber == 'number' &&
        typeof fuse._docEl.uniqueNumber == 'number' &&
        fuse._div.uniqueNumber != fuse._docEl.uniqueNumber;
    }
  });

  /*-------------------------------- DOM BUGS --------------------------------*/

  envAddTest({
    'ATTRIBUTE_NODES_SHARED_ON_CLONED_ELEMENTS': function() {
      // true for some IE6
      var clone, div = fuse._div, node = fuse._doc.createAttribute('id');
      node.value = 'x';
      div.setAttributeNode(node);
      clone = div.cloneNode(false);
      div.setAttribute('id', 'y');
      return !!((node = clone.getAttributeNode('id')) && node.value == 'y');
    },

    'BODY_ACTING_AS_ROOT': function() {
      // true for IE Quirks, Opera 9.25
      var body = fuse._body, div = fuse._div, docEl = fuse._docEl;
      if (docEl.clientWidth === 0) return true;

      var ds = div.style, bs = body.style, des = docEl.style,
       bsBackup = bs.cssText, desBackup = des.cssText;

      bs.margin  = des.margin = '0';
      bs.height  = des.height = 'auto';
      ds.cssText = 'display:block;height:8500px;';

      body.insertBefore(div, body.firstChild);
      var result = docEl.clientHeight >= 8500;

      // check scroll coords
      var scrollTop = docEl.scrollTop;
      envAddTest('BODY_SCROLL_COORDS_ON_DOCUMENT_ELEMENT',
        ++docEl.scrollTop && docEl.scrollTop == scrollTop + 1);
      docEl.scrollTop = scrollTop;

      // cleanup
      body.removeChild(div);
      bs.cssText  = bsBackup;
      des.cssText = desBackup;
      ds.cssText  = '';

      return result;
    },

    'BODY_OFFSETS_INHERIT_ITS_MARGINS': function() {
      // true for Safari
      var body = fuse._body, bs = body.style, backup = bs.cssText;
      bs.cssText += ';position:absolute;top:0;margin:1px 0 0 0;';
      var result = body.offsetTop == 1;
      bs.cssText = backup;
      return result;
    },

    'BUTTON_VALUE_CHANGES_AFFECT_INNER_CONTENT': function() {
      // true for IE6/7
      var node, doc = fuse._doc, button = doc.createElement('button');
      button.appendChild(doc.createTextNode('y'));
      button.setAttribute('value', 'x');
      return ((node = button.getAttributeNode('value')) && node.value) != 'x';
    },

    'ELEMENT_COMPUTED_STYLE_DEFAULTS_TO_ZERO': function() {
      if (envTest('ELEMENT_COMPUTED_STYLE')) {
        // true for Opera
        var result, des = fuse._docEl.style, backup = des.cssText;
        des.position = 'static';
        des.top = des.left = '';

        var style = fuse._doc.defaultView.getComputedStyle(fuse._docEl, null);
        result = (style && style.top == '0px' && style.left == '0px');
        des.cssText = backup;
        return result;
      }
    },

    'ELEMENT_COMPUTED_STYLE_DIMENSIONS_EQUAL_BORDER_BOX': function() {
      if (envTest('ELEMENT_COMPUTED_STYLE')) {
        // true for Opera 9.2x
        var docEl = fuse._docEl, des = docEl.style, backup = des.paddingBottom;
        des.paddingBottom = '1px';
        var style = fuse._doc.defaultView.getComputedStyle(docEl, null),
         result = style && (parseInt(style.height) || 0) ==  docEl.offsetHeight;
        des.paddingBottom = backup;
        return result;
      }
    },

    'ELEMENT_COMPUTED_STYLE_HEIGHT_IS_ZERO_WHEN_HIDDEN': function() {
      if (envTest('ELEMENT_COMPUTED_STYLE')) {
        // true for Opera
        var des = fuse._docEl.style, backup = des.display;
        des.display = 'none';

        // In Safari 2 getComputedStyle() will return null for elements with style display:none
        var style = fuse._doc.defaultView.getComputedStyle(fuse._docEl, null),
         result = style && style.height == '0px';

        des.display = backup;
        return result;
      }
    },

    'ELEMENT_COORD_OFFSETS_DONT_INHERIT_ANCESTOR_BORDER_WIDTH': function() {
      // true for all but IE8
      var result, value, body = fuse._body, div = fuse._div,
       bs = fuse._body.style, backup = bs.cssText;

      body.appendChild(div);
      value = div.offsetLeft;
      bs.cssText += ';border: 1px solid transparent;';

      result = value == div.offsetLeft;
      bs.cssText = backup;
      body.removeChild(div);
      return result;
    },

    'ELEMENT_TABLE_INNER_HTML_INSERTS_TBODY': function() {
      // true for IE and Firefox 3
      var result, div = fuse._div;
      if (envTest('ELEMENT_INNER_HTML')) {
        div.innerHTML = '<table><tr><td><\/td><\/tr><\/table>';
        result = getNodeName(div.firstChild.firstChild) == 'TBODY';
        div.innerHTML = '';
      }
      return result;
    },

    'INPUT_VALUE_PROPERTY_SETS_ATTRIBUTE': function() {
      // true for IE
      var input = fuse._doc.createElement('input');
      input.setAttribute('value', 'x');
      input.value = 'y';
      return input.cloneNode(false).getAttribute('value') == 'y';
    },

    'NAME_ATTRIBUTE_IS_READONLY': function() {
      // true for IE6/7
      var result, div = fuse._div,
       node = div.appendChild(fuse._doc.createElement('input'));

      node.name = 'x';
      result = !div.getElementsByTagName('*')['x'];
      emptyElement(div);
      return result;
    },

    'TABLE_ELEMENTS_RETAIN_OFFSET_DIMENSIONS_WHEN_HIDDEN': function() {
      // true for IE7 and lower
      var result, doc = fuse._doc, body = fuse._body,
       table = doc.createElement('table'),
       tbody = table.appendChild(doc.createElement('tbody')),
       tr    = tbody.appendChild(doc.createElement('tr')),
       tr    = tr.appendChild(doc.createElement('td'));

      tbody.style.display = 'none';
      tr.style.width = '1px';
      body.appendChild(table);

      result = !!table.firstChild.offsetWidth;
      destroyElement(table, body);
      return result;
    }
  });

  envAddTest((function() {
    function createInnerHTMLTest(source, innerHTML, targetNode) {
      return function() {
        var element, div = fuse._div, result = true;
        if (envTest('ELEMENT_INNER_HTML')) {
          div.innerHTML = source;
          element = div.firstChild;
          if (targetNode) element = element.getElementsByTagName(targetNode)[0];
          try {
            element.innerHTML = innerHTML;
            result = element.innerHTML.toLowerCase() != innerHTML;
          } catch(e) { }
          div.innerHTML = '';
        }
        return result;
      };
    }

    return {
      'ELEMENT_COLGROUP_INNER_HTML_BUGGY': createInnerHTMLTest(
        '<table><colgroup><\/colgroup><tbody><\/tbody><\/table>',
        '<col><col>', 'colgroup'
      ),

      'ELEMENT_OPTGROUP_INNER_HTML_BUGGY': createInnerHTMLTest(
        '<select><optgroup><\/optgroup><\/select>',
        '<option>x<\/option>', 'optgroup'
      ),

      'ELEMENT_SELECT_INNER_HTML_BUGGY': createInnerHTMLTest(
        '<select><option><\/option><\/select>', '<option>x<\/option>'
      ),

      'ELEMENT_INNER_HTML_IGNORES_SCRIPTS': createInnerHTMLTest(
        '<div><\/div>', '<script><\/script>'
      ),

      'ELEMENT_TABLE_INNER_HTML_BUGGY': createInnerHTMLTest(
        // left out tbody to test if it's auto inserted
        '<table><tr><td><\/td><\/tr><\/table>', '<tr><td><p>x<\/p><\/td><\/tr>'
      )
    };
  })());

  envAddTest((function() {
    function createScriptTest(testType) {
      return function() {
        var evalFailed, hasText, reEvaled, htmlEvaled,
         div     = fuse._div,
         doc     = fuse._doc,
         head    = fuse._headEl,
         code    = 'fuse.' + uid +'=1',
         script  = doc.createElement('script'),
         useText = typeof script.text === 'string';

        try { script.appendChild(doc.createTextNode(code)) } catch (e) { }
        useText && (script.text = code + '+1');

        head.insertBefore(script, head.firstChild);
        hasText = fuse[uid] == 2;
        evalFailed = !fuse[uid];

        code += '+2';
        if (script.firstChild) {
          script.firstChild.data = code;
        } else if (useText) {
          script.text = code;
        }

        reEvaled = fuse[uid] == 3;
        destroyElement(script);

        if (envTest('ELEMENT_INNER_HTML')) {
          div.innerHTML = 'x<script>' + code + '+1<\/script>';
          div.appendChild(head.insertBefore(div.lastChild, head.firstChild));
          div.innerHTML = '';
        }
        htmlEvaled = fuse[uid] == 4;
        delete fuse[uid];

        envAddTest({
          'ELEMENT_SCRIPT_HAS_TEXT_PROPERTY': hasText,

          'ELEMENT_SCRIPT_FAILS_TO_EVAL_TEXT': evalFailed,

          'ELEMENT_SCRIPT_REEVALS_TEXT': reEvaled,

          'ELEMENT_EVALS_SCRIPT_FROM_INNER_HTML': htmlEvaled
        });

        return ({ '1': hasText, '2': evalFailed, '3': reEvaled, '4': htmlEvaled })[testType];
      };
    }

    return {
      'ELEMENT_SCRIPT_HAS_TEXT_PROPERTY': createScriptTest('1'),

      'ELEMENT_SCRIPT_FAILS_TO_EVAL_TEXT': createScriptTest('2'),

      'ELEMENT_SCRIPT_REEVALS_TEXT': createScriptTest('3'),

      'ELEMENT_EVALS_SCRIPT_FROM_INNER_HTML': createScriptTest('4')
    };
  })());
  /*---------------------------------- DOM -----------------------------------*/

  NodeList = fuse.Array;

  domData =
  fuse.addNS('dom.data');

  fuse._doc    = window.document;
  fuse._div    = fuse._doc.createElement('DiV');
  fuse._docEl  = fuse._doc.documentElement;
  fuse._headEl = fuse._doc.getElementsByTagName('head')[0] || fuse._docEl;
  fuse._info   = { };

  domData[0] = { };
  domData[1] = { 'nodes': { } };

  fuse._info.docEl =
  fuse._info.root  =
    { 'nodeName': 'HTML', 'property': 'documentElement' };

  fuse._info.body =
  fuse._info.scrollEl =
    { 'nodeName': 'BODY', 'property': 'body' };

  /*--------------------------------------------------------------------------*/

  CHECKED_INPUT_TYPES = { 'checkbox': 1, 'radio': 1 };

  EVENT_TYPE_ALIAS = { 'blur': 'delegate:blur', 'focus': 'delegate:focus' },

  INPUT_BUTTONS = { 'button': 1, 'image': 1, 'reset':  1, 'submit': 1 };

  DATA_ID_PROP =
    envTest('ELEMENT_UNIQUE_NUMBER') ? 'uniqueNumber' : '_fuseId';

  PARENT_NODE =
    isHostType(fuse._docEl, 'parentElement') ? 'parentElement' : 'parentNode';

  // Safari 2.0.x returns `Abstract View` instead of `window`
  PARENT_WINDOW =
    isHostType(fuse._doc, 'defaultView') && fuse._doc.defaultView === window ? 'defaultView' :
    isHostType(fuse._doc, 'parentWindow') ? 'parentWindow' : null;

  destroyElement = function(element, parentNode) {
    parentNode || (parentNode = element[PARENT_NODE]);
    parentNode && parentNode.removeChild(element);
  };

  emptyElement = function(element) {
    var child;
    while (child = element.lastChild) {
      destroyElement(child, element);
    }
  };

  getDocument = function getDocument(element) {
    return element.ownerDocument || element.document ||
      (element.nodeType == DOCUMENT_NODE ? element : fuse._doc);
  };

  getNodeName = fuse._doc.createElement('nav').nodeName == 'NAV'
    ? function(element) { return element.nodeName; }
    : function(element) { return element.nodeName.toUpperCase(); };

  getScriptText = function(element) {
    element.childNodes.length > 1 && element.normalize();
    return (element.firstChild || { }).data || '';
  };

  getWindow = function getWindow(element) {
    // based on work by Diego Perini
    var frame, i = -1, doc = getDocument(element), frames = window.frames;
    if (fuse._doc != doc) {
      while (frame = frames[++i]) {
        if (frame.document == doc)
          return frame;
      }
    }
    return window;
  };

  returnOffset = function(left, top) {
    var result  = fuse.Array(fuse.Number(left || 0), fuse.Number(top || 0));
    result.left = result[0];
    result.top  = result[1];
    return result;
  };

  runScriptText = (function() {
    var counter = 0;

    return function(text, context) {
      var head, result, script, suid = uid + '_script' + counter++;
      if (text && text != '') {
        fuse[suid] = { 'text': String(text) };
        text = 'fuse.' + suid + '.returned=eval(';

        context || (context = fuse._doc);
        head || (head = fuse._headEl);
        if (fuse._doc != context) {
          context = getDocument(context.raw || context);
          head = context ==context.getElementsByTagName('head')[0] || context.documentElement;
          text = 'parent.' + text + 'parent.';
        }

        text += 'fuse.' + suid + '.text);';

        // keep consistent behavior of `arguments`
        // uses an unresolvable reference so it can be deleted without
        // errors in JScript
        text = 'if("arguments" in this){' + text +
               '}else{arguments=void 0;'  + text +
               'delete arguments}';

        script = context.createElement('script');
        setScriptText(script, text);
        head.insertBefore(script, head.firstChild);
        head.removeChild(script);

        result = fuse[suid].returned;
        delete fuse[suid];
      }
      return result;
    };
  })();

  setScriptText = function(element, text) {
    (element.firstChild || element.appendChild(element.ownerDocument.createTextNode('')))
      .data = text == null ? '' : text;
  };

  if (PARENT_WINDOW) {
    getWindow = function getWindow(element) {
      return getDocument(element)[PARENT_WINDOW];
    };
  }

  if (envTest('ELEMENT_INNER_HTML')) {
    emptyElement = function(element) {
      element.innerHTML = '';
    };

    destroyElement = (function() {
      var trash = document.createElement('div');
      return function(element) {
        trash.appendChild(element);
        trash.innerHTML = '';
      };
    })();
  }

  if (envTest('ELEMENT_SCRIPT_HAS_TEXT_PROPERTY')) {
    getScriptText = function(element) {
      return element.text;
    };

    setScriptText = function(element, text) {
      element.text = text || '';
    };
  }

  fuse.dom.getDocument   = getDocument;
  fuse.dom.getWindow     = getWindow;
  fuse.dom.getScriptText = getScriptText;
  fuse.dom.setScriptText = setScriptText;
  fuse.dom.runScriptText = runScriptText;
  /*------------------------------- DOM: NODE --------------------------------*/

  Node =
  fuse.dom.Node = (function() {

    var Decorator = function() { },

    Node = function Node(node, isCached) {
      // quick return if falsy or decorated
      var data, decorated;
      if (!node || node.raw) {
        return node;
      }
      if (node.nodeType != TEXT_NODE) {
        // return cached if available
        if (isCached == null || isCached) {
          data = domData[Node.getFuseId(node)];
          if (data.decorator) {
            return data.decorator;
          }
        }
        // pass to element decorator
        switch (node.nodeType) {
          case ELEMENT_NODE:  return fromElement(node, isCached);
          case DOCUMENT_NODE: return HTMLDocument(node, isCached);
        }
      }

      decorated = new Decorator;
      decorated.raw = node;
      decorated.nodeName = node.nodeName;

      // text node decorators are not cached
      return data ? (data.decorator = decorated) : decorated;
    },

    getFuseId = function getFuseId(skipDataInit) {
      return Node.getFuseId(this, skipDataInit);
    };

    fuse.Class({ 'constructor': Node, 'getFuseId': getFuseId });
    Decorator.prototype = Node.plugin;
    return Node;
  })();

  /*--------------------------------------------------------------------------*/

  Node.addStatics(function() {

    var SKIPPED_KEYS = { 'constructor': 1, 'callSuper': 1, 'getFuseId': 1 },

    fuseId = 2,

    createGeneric = function(proto, methodName) {
      return Function('o,s',
        'function ' + methodName + '(node){' +
        'var a=arguments,n=fuse(node),m=o.' + methodName +
        ';return a.length' +
        '?m.apply(n,s.call(a,1))' +
        ':m.call(n)' +
        '}return ' + methodName)(proto, slice);
    },

    updateGenerics = function updateGenerics(deep) {
      var Klass = this;
      if (deep) {
        fuse.updateGenerics(Klass, deep);
      } else {
        fuse.Object.each(Klass.prototype, function(value, key, proto) {
          if (!SKIPPED_KEYS[key] && hasKey(proto, key) && isFunction(proto[key]))
            Klass[key] = createGeneric(proto, key);
        });
      }
    },

    getFuseId = function getFuseId(node, skipDataInit) {
      node = node.raw || node;
      var win, id = node[DATA_ID_PROP];

      // quick return for nodes with ids
      // IE can avoid adding an expando on each node and use the `uniqueNumber` property instead.
      if (!id) {
        // In IE window == document is true but not document == window.
        // Use loose comparison because different `window` references for
        // the same window may not strict equal each other.
        win = getWindow(node);
        if (node == win) {
          id = node == window ? '0' : getFuseId(node.frameElement) + '-0';
        }
        else if (node.nodeType == DOCUMENT_NODE) {
          // quick return for common case OR
          // calculate id for foreign document objects
          id = node == fuse._doc ? '1' : getFuseId(win.frameElement) + '-1';
          skipDataInit || (skipDataInit = domData[id]);
          if (!skipDataInit) {
            skipDataInit =
            domData[id] = { 'nodes': { } };
          }
        }
        else {
          id = node._fuseId = fuseId++;
        }
      }
      skipDataInit || (skipDataInit = domData[id]);
      if (!skipDataInit) {
        domData[id] = { };
      }
      return id;
    };

    return {
      'DOCUMENT_FRAGMENT_NODE':      DOCUMENT_FRAGMENT_NODE,
      'DOCUMENT_NODE':               DOCUMENT_NODE,
      'ELEMENT_NODE':                ELEMENT_NODE,
      'TEXT_NODE':                   TEXT_NODE,
      'ATTRIBUTE_NODE':              2,
      'CDATA_SECTION_NODE':          4,
      'ENTITY_REFERENCE_NODE':       5,
      'ENTITY_NODE':                 6,
      'PROCESSING_INSTRUCTION_NODE': 7,
      'COMMENT_NODE':                8,
      'DOCUMENT_TYPE_NODE':          10,
      'NOTATION_NODE':               12,
      'getFuseId':      getFuseId,
      'updateGenerics': updateGenerics
    };
  });

  // define private var shared by primary closure
  getFuseId = Node.getFuseId;

  Node.updateGenerics();
  /*----------------------------- DOM: DOCUMENT ------------------------------*/

  HTMLDocument =
  fuse.dom.HTMLDocument = (function() {

    var Decorator = function() { },

    HTMLDocument = function HTMLDocument(node, isCached) {
      // quick return if empty, decorated, or not a document node
      var data, decorated, pluginViewport, viewport;
      if (!node || node.raw || node.nodeType != DOCUMENT_NODE) {
        return node;
      }
      if (isCached == null || isCached) {
        // return cached if available
        data = domData[Node.getFuseId(node)];
        if (data.decorator) {
          return data.decorator;
        }
        decorated =
        data.decorator = new Decorator;
      }
      else {
        decorated = new Decorator;
      }

      pluginViewport = HTMLDocument.plugin.viewport;
      viewport = decorated.viewport = { };

      viewport.ownerDocument =
      decorated.raw = node;
      decorated.nodeName = node.nodeName;
      decorated.nodeType = DOCUMENT_NODE;

      eachKey(pluginViewport, function(value, key, object) {
        if (hasKey(object, key)) viewport[key] = value;
      });

      return decorated;
    };

    fuse.Class(Node, { 'constructor': HTMLDocument });
    Decorator.prototype = HTMLDocument.plugin;
    HTMLDocument.updateGenerics = Node.updateGenerics;
    return HTMLDocument;
  })();

  (function(plugin) {
    var viewport =
    plugin.viewport = { },

    define = function() {
      var doc = getDocument(this),

      win = getWindow(doc),

      scrollEl = doc[fuse._info.scrollEl.property],

      // Safari < 3 -> doc
      // Opera  < 9.5, Quirks mode -> body
      // Others -> docEl
      dimensionNode = 'clientWidth' in doc ? doc : doc[fuse._info.root.property],

      getHeight = function getHeight() {
        return fuse.Number(dimensionNode.clientHeight);
      },

      getWidth = function getWidth() {
        return fuse.Number(dimensionNode.clientWidth);
      },

      getScrollOffsets = function getScrollOffsets() {
        return returnOffset(win.pageXOffset, win.pageYOffset);
      };

      if (typeof window.pageXOffset != 'number') {
        getScrollOffsets = function getScrollOffsets() {
          return returnOffset(scrollEl.scrollLeft, scrollEl.scrollTop);
        };
      }

      // lazy define methods
      this.getHeight        = getHeight;
      this.getWidth         = getWidth;
      this.getScrollOffsets = getScrollOffsets;

      return this[arguments[0]]();
    };

    plugin.getFuseId = Node.plugin.getFuseId;

    viewport.getDimensions = function getDimensions() {
      return { 'width': this.getWidth(), 'height': this.getHeight() };
    };

    viewport.getHeight = function getHeight() {
      return define.call(this, 'getHeight');
    };

    viewport.getWidth = function getWidth() {
      return define.call(this, 'getWidth');
    };

    viewport.getScrollOffsets = function getScrollOffsets() {
      return define.call(this, 'getScrollOffsets');
    };

    // prevent JScript bug with named function expressions
    var getDimensions = null, getHeight = null, getWidth = null, getScrollOffsets = null;
  })(HTMLDocument.plugin);
  /*------------------------------ DOM: WINDOW -------------------------------*/

  Window =
  fuse.dom.Window = (function() {
    var isWindow = function(object) {
      return toString.call(object).indexOf('Window') > -1;
    },

    Decorator = function() { },

    Window = function Window(object, isCached) {
      // quick return if empty, decorated, or not a window object
      var data, decorated;
      if (!object || object.raw || !isWindow(object)) {
        return object;
      }
      if (isCached == null || isCached) {
        // return cached if available
        data = domData[Node.getFuseId(object)];
        if (data.decorator) {
          return data.decorator;
        }
        decorated =
        data.decorator = new Decorator;
      }
      else {
        decorated = new Decorator;
      }
      decorated.raw = object;
      return decorated;
    };

    // weak fallback
    if (!isWindow(window)) {
      isWindow = function(object) {
        return typeof object.window != 'undefined' && object.window == object;
      };
    }

    fuse.Class({ 'constructor': Window });
    Decorator.prototype = Window.plugin;
    Window.updateGenerics = Node.updateGenerics;
    return Window;
  })();

  Window.plugin.getFuseId = Node.plugin.getFuseId;

  /*-------------------------- HTML ELEMENT: CREATE --------------------------*/

  (function() {

    var ELEMENT_INNER_HTML_IGNORES_SCRIPTS =
      envTest('ELEMENT_INNER_HTML_IGNORES_SCRIPTS'),

    ELEMENT_TABLE_INNER_HTML_INSERTS_TBODY =
      envTest('ELEMENT_TABLE_INNER_HTML_INSERTS_TBODY'),

    CONTEXT_TYPES = (function() {
      var T = { };
      T[ELEMENT_NODE] =
      T[DOCUMENT_NODE] = 1;
      return T;
    })(),

    FROM_STRING_PARENT_WRAPPERS = (function() {
      var T = {
        'COLGROUP': ['<table><colgroup>',      '<\/colgroup><tbody><\/tbody><\/table>', 2],
        'FIELDSET': ['<form><fieldset>',       '<\/fieldset><\/form>',                  2],
        'LEGEND':   ['<form>',                 '<\/form>',                              1],
        'MAP':      ['<map>',                  '<\/map>',                               1],
        'SELECT':   ['<form><select>',         '<\/select><\/form>',                    2],
        'TABLE':    ['<table>',                '<\/table>',                             1],
        'TBODY':    ['<table><tbody>',         '<\/tbody><\/table>',                    2],
        'TR':       ['<table><tbody><tr>',     '<\/tr><\/tbody><\/table>',              3],
        'TD':       ['<table><tbody><tr><td>', '<\/td><\/tr><\/tbody><\/table>',        4]
      };

      // TODO: Opera fails to render optgroups when set with innerHTML
      T.TH = T.TD;
      T.OPTGROUP = T.SELECT;
      T.TFOOT = T.THEAD = T.TBODY;
      return T;
    })(),

    FROM_STRING_CHILDREN_PARENTS = (function() {
      var T = {
        'AREA':     'MAP',
        'COL':      'COLGROUP',
        'FIELDSET': 'FORM',
        'LEGEND':   'FIELDSET',
        'OPTION':   'SELECT',
        'TD':       'TR',
        'TR':       'TBODY',
        'TBODY':    'TABLE'
      };

      T.TH = T.TD;
      T.OPTGROUP = T.OPTION;
      T.TFOOT = T.THEAD = T.TBODY;
      T.CAPTION = T.COLGROUP = T.TBODY;
      return T;
    })(),

    doc              = window.fuse._doc,
    reSimpleTag      = /^<([A-Za-z0-9]+)\/?>$/,
    reTagStart       = /^\s*</,
    reTBody          = /<tbody /i,
    reExtractTagName = /^<([^> ]+)/,
    reStartsWithTR   = /^<tr/i,

    HTMLElement = function HTMLElement(tagName, context) {
      var attrs, element, options, result;
      if (!tagName || tagName.raw) {
        return tagName;
      }
      if (tagName.nodeType) {
        result = fromElement(tagName, context);
      } else {
        result = (tagName.charAt(0) == '<' ? fromHTML : fromTagName)(tagName, context);
      }
      options = !CONTEXT_TYPES[context && context.nodeType] && context;
      return (attrs = options && options.attrs)
        ? Element.plugin.setAttribute.call(result, attrs)
        : result;
    };

    function Decorator(element) {
      this.raw = element;
      this.style = element.style;
      this.nodeType = ELEMENT_NODE;
      this.childNodes = element.childNodes;
      this.tagName = this.nodeName = element.nodeName;
      this.initialize && this.initialize();
    }

    function Element(tagName, context) {
      // pass to HTMLElement until we have a non-html element solution
      return HTMLElement(tagName, context);
    }

    function extendByTag(tagName, plugins, mixins, statics) {
      var i = -1;
      if (isArray(tagName)) {
        while (tagName[++i]) {
          extendByTag(tagName[i], plugins, mixins, statics);
        }
      } else {
        getOrCreateTagClass(tagName).extend(plugins, mixins, statics);
      }
    }

    function from(element, context) {
      return window.fuse(element, context);
    }

    function fromElement(element, options) {
      var data, isCached, isDecorated, raw, result = element;
      if (options && !CONTEXT_TYPES[options.nodeType]) {
        isCached = options.cache;
        isDecorated = options.decorate;
      }
      isDecorated = isDecorated == null || isDecorated;
      if (raw = element.raw) {
        result = isDecorated ? element : raw;
      }
      else if (isDecorated) {
        Decorator.prototype = getOrCreateTagClass(element.tagName).plugin;
        if (isCached == null || isCached) {
          data = domData[getFuseId(element)];
          result = data.decorator || (data.decorator = new Decorator(element));
        } else {
          result = new Decorator(element);
        }
      }
      return result;
    }

    function fromHTML(html, context) {
      // support `<div>` format
      var element, fragment, isCached, isDecorated, length, match, result;
      if (match = html.match(reSimpleTag)) {
        return fromTagName(match[1], context);
      }
      if (context && !CONTEXT_TYPES[context.nodeType]) {
        isCached    = context.cache;
        isDecorated = context.decorate;
        context     = context.context;
      }

      isCached    = isCached == null || isCached;
      isDecorated = isDecorated == null || isDecorated;
      fragment    = getFragmentFromHTML(html, context);

      // multiple elements return a NodeList
      if (fragment.nodeType == DOCUMENT_FRAGMENT_NODE) {
        result = NodeList();
        length = fragment.childNodes.length;
        if (isDecorated) {
          while (length--) {
            element = fragment.removeChild(fragment.lastChild);
            Decorator.prototype = getOrCreateTagClass(element.nodeName).plugin;
            if (isCached) {
              result[length] = domData[getFuseId(element)].decorator = new Decorator(element);
            } else {
              result[length] = new Decorator(element);
            }
          }
        } else {
          while (length--) {
            result[length] = fragment.removeChild(fragment.lastChild);
          }
        }
      }
      // single element return decorated element
      else {
        result = fragment.parentNode.removeChild(fragment);
        if (isDecorated) {
          element = result;
          Decorator.prototype = getOrCreateTagClass(element.nodeName).plugin;
          result = new Decorator(element);

          if (isCached) {
            domData[getFuseId(element)].decorator = result;
          }
        }
      }
      return result;
    }

    function fromId(id, context) {
      var element, isCached, isDecorated;
      if (context && !CONTEXT_TYPES[context.nodeType]) {
        isCached    = context.cache;
        isDecorated = context.decorate;
        context     = context.context;
      }
      element = (context || doc).getElementById(id || uid);
      return isDecorated == null || isDecorated
        ? element && fromElement(element, isCached)
        : element;
    }

    function fromTagName(tagName, context) {
      // support simple tagNames
      var attrs, element, isCached, isDecorated, nodes, result;
      if (context && !CONTEXT_TYPES[context.nodeType]) {
        isCached    = context.cache;
        isDecorated = context.decorate;
        context     = context.context;
      }

      // for a tidy cache stick to all upper or all lower case tagNames
      context || (context = doc);

      nodes = context === doc ? domData['1'].nodes :
        domData[getFuseId(getDocument(context))].nodes;

      result = (nodes[tagName] ||
        (nodes[tagName] = context.createElement(tagName))).cloneNode(false);

      if (isDecorated == null || isDecorated) {
        element = result;
        Decorator.prototype = getOrCreateTagClass(tagName).plugin;
        result = new Decorator(element);
        if (isCached == null || isCached) {
          domData[getFuseId(element)].decorator = result;
        }
      }
      return result;
    }

    function getFragmentFromHTML(html, context) {
      context || (context = doc);
      var match, node, nodeName, tbody, times, wrapping,
       ownerDoc = context.ownerDocument || context,
       data = domData[ownerDoc == doc ? '1': getFuseId(ownerDoc)],
       cache = data.fragments || (data.fragments = {
         'node': ownerDoc.createElement('div'),
         'fragment': ownerDoc.createDocumentFragment()
       });

      if (html == '') {
        return cache.fragment;
      }
      if (context.nodeType == DOCUMENT_NODE && (match = html.match(reExtractTagName))) {
        nodeName = FROM_STRING_CHILDREN_PARENTS[match[1].toUpperCase()];
      }
      if (!nodeName) {
        nodeName = getNodeName(context);
      }
      // skip auto-inserted tbody
      if (nodeName == 'TABLE' && ELEMENT_TABLE_INNER_HTML_INSERTS_TBODY &&
          reStartsWithTR.test(html)) {
        nodeName = 'TBODY';
      }

      node = cache.node;
      wrapping = FROM_STRING_PARENT_WRAPPERS[nodeName];

      // Fix IE rendering issue with innerHTML and script
      // and link elements by prefixing the html with text
      if (!wrapping && ELEMENT_INNER_HTML_IGNORES_SCRIPTS && reTagStart.test(html)) {
        node.innerHTML = 'x' + html;
        node.removeChild(node.firstChild);
      }
      else if (wrapping) {
        times = wrapping[2];
        node.innerHTML= wrapping[0] + html + wrapping[1];
        while (times--) node = node.firstChild;
      }
      else {
        node.innerHTML = html;
      }

      // exit early for single elements
      if (node.childNodes.length == 1) {
        return node.firstChild;
      }
      // remove auto-inserted tbody
      if (nodeName == 'TABLE' && ELEMENT_TABLE_INNER_HTML_INSERTS_TBODY &&
          !reTBody.test(html) && (tbody = node.getElementsByTagName('tbody')[0])) {
        tbody.parentNode.removeChild(tbody);
      }
      return getFragmentFromChildNodes(node, cache);
    }

    function getFragmentFromChildNodes(parentNode, cache) {
      var fragment = cache.fragment,
       nodes = parentNode.childNodes, length = nodes.length;
      while (length--) {
        fragment.insertBefore(nodes[length], fragment.firstChild);
      }
      return fragment;
    }

    function fuse(object, context) {
      var isCached, isDecorated;
      if (isString(object)) {
        return object.charAt(0) == '<'
          ? HTMLElement(object, context)
          : fromId(object, context);
      }
      if (context && !CONTEXT_TYPES[context.nodeType]) {
        isCached    = context.cache;
        isDecorated = context.decorate;
      }
      return isDecorated == null || isDecorated
        ? Node(Window(object, isCached), isCached)
        : object;
    }

    // IE7 and below need to use the sTag of createElement to set the `name` attribute
    // http://msdn.microsoft.com/en-us/library/ms536389.aspx
    //
    // IE fails to set the BUTTON element's `type` attribute without using the sTag
    // http://dev.rubyonrails.org/ticket/10548
    if (envTest('NAME_ATTRIBUTE_IS_READONLY')) {
      var __HTMLElement = HTMLElement;
      HTMLElement = function HTMLElement(tagName, context) {
        var attrs, match, name, type;
        if (isString(tagName) && context &&
            !CONTEXT_TYPES[context.nodeType] && (attrs = context.attrs) &&
            ('name' in attrs || 'type' in attrs) &&
            (tagName.charAt(0) != '<' || (match = tagName.match(reSimpleTag)))) {

          name = attrs.name;
          type = attrs.type;
          tagName = match && match[1] || tagName;

          tagName = '<' + tagName +
            (name == null ? '' : ' name="' + name + '"') +
            (type == null ? '' : ' type="' + type + '"') + '>';

          delete attrs.name; delete attrs.type;
          return plugin.setAttribute.call(fromHTML(tagName, context), attrs);
        }
        return __HTMLElement(tagName, context);
      };
    }

    if (envTest('ELEMENT_REMOVE_NODE')) {
      getFragmentFromChildNodes = function(parentNode, cache) {
        var fragment = cache.fragment;
        fragment.appendChild(parentNode).removeNode();
        return fragment;
      };
    }

    // copy old fuse properties to new window.fuse
    eachKey(window.fuse, function(value, key) {
      if (hasKey(window.fuse, key)) fuse[key] = value;
    });

    // add class sugar
    fuse.Class({ 'constructor': fuse });
    fuse.Class(Node, { 'constructor': Element });
    fuse.Class(Element, { 'constructor': HTMLElement });

    // expose
    Element.extendByTag =
    HTMLElement.extendByTag = extendByTag;

    Element.from =
    HTMLElement.from = from;

    Element.fromElement =
    HTMLElement.fromElement = fromElement;

    Element.fromId =
    HTMLElement.fromId = fromId;

    Element.fromTagName =
    HTMLElement.fromTagName = fromTagName;

    Element.fromHTML =
    HTMLElement.fromHTML = fromHTML;

    Element.updateGenerics =
    HTMLElement.updateGenerics = Node.updateGenerics;

    window.fuse = fuse;
    fuse.dom.Element = Element;
    fuse.dom.HTMLElement = HTMLElement;
    fuse.dom.getFragmentFromHTML = getFragmentFromHTML;
  })();

  /*--------------------------------------------------------------------------*/

  // define private vars shared by primary closure

  Element = fuse.dom.Element;

  HTMLElement = fuse.dom.HTMLElement;

  extendByTag = Element.extendByTag;

  fromElement = Element.fromElement;

  getFragmentFromHTML = fuse.dom.getFragmentFromHTML;

  getOrCreateTagClass = (function() {

    var TAG_NAME_CLASSES = (function() {
      var i, T = { }, temp = {
        'A':        'Anchor',
        'CAPTION':  'TableCaption',
        'COL':      'TableCol',
        'DEL':      'Mod',
        'DIR':      'Directory',
        'DL':       'DList',
        'H1':       'Heading',
        'IFRAME':   'IFrame',
        'IMG':      'Image',
        'INS':      'Mod',
        'FIELDSET': 'FieldSet',
        'FRAMESET': 'FrameSet',
        'OL':       'OList',
        'OPTGROUP': 'OptGroup',
        'P':        'Paragraph',
        'Q':        'Quote',
        'TBODY':    'TableSection',
        'TD':       'TableCell',
        'TEXTAREA': 'TextArea',
        'TR':       'TableRow',
        'UL':       'UList'
      };

      temp.TH = temp.TD;
      temp.COLGROUP = temp.COL;
      temp.TFOOT = temp.THEAD =  temp.TBODY;
      temp.H2 = temp.H3 = temp.H4 = temp.H5 = temp.H6 = temp.H1;

      for (i in temp) {
       T[i] = T[i.toLowerCase()] = 'HTML' + temp[i] + 'Element';
      }
      return T;
    })(),

    reTagName = /^[A-Z0-9]+$/;

    return function(tagName) {
      var upperCased, TagClass,
       tagClassName = TAG_NAME_CLASSES[tagName];

      if (!tagClassName) {
        if (tagClassName = TAG_NAME_CLASSES[upperCased = tagName.toUpperCase()]) {
          TAG_NAME_CLASSES[tagName] = tagClassName;
        } else {
          tagClassName =
          TAG_NAME_CLASSES[tagName] =
          TAG_NAME_CLASSES[upperCased] = 'HTML' +
            (reTagName.test(upperCased)
              ? capitalize(tagName.toLowerCase())
              : 'Unknown') + 'Element';
        }
      }
      if (!(TagClass = fuse.dom[tagClassName])) {
        TagClass =
        fuse.dom[tagClassName] = fuse.Class(HTMLElement, {
          'constructor': Function('fn',
            'function ' + tagClassName + '(element,options){' +
            'return element&&(element.raw?element:fn(element,options))' +
            '}return ' + tagClassName)(fromElement)
        });

        TagClass.addMixins = Node.addMixins;
        TagClass.addPlugins = Node.addPlugins;
        TagClass.updateGenerics = Node.updateGenerics;
      }
      return TagClass;
    };
  })();

  extendByTag('button');
  extendByTag('form');
  extendByTag('input');
  extendByTag('option');
  extendByTag('select');
  extendByTag('textarea');

  HTMLFormElement = fuse.dom.HTMLFormElement;

  CONTROL_PLUGINS = {
    'BUTTON':   (HTMLButtonElement   = fuse.dom.HTMLButtonElement).plugin,
    'INPUT':    (HTMLInputElement    = fuse.dom.HTMLInputElement).plugin,
    'OPTION':   (HTMLOptionElement   = fuse.dom.HTMLOptionElement).plugin,
    'SELECT':   (HTMLSelectElement   = fuse.dom.HTMLSelectElement).plugin,
    'TEXTAREA': (HTMLTextAreaElement = fuse.dom.HTMLTextAreaElement).plugin
  };
  /*------------------------------ HTML ELEMENT ------------------------------*/

  // add/pave statics
  (function() {

    var isMixin = false,

    addToNodeList = function() {
      var arg, j, jmax,
       args = arguments, i = -1, imax = args.length,
       Klass = this, prototype = Klass.prototype;

      while (++i < imax) {
        arg = args[i];
        if (typeof arg == 'function') arg = arg();
        if (!isArray(arg)) arg = [arg];

        j = -1; jmax = arg.length;
        while (++j < jmax) {
          eachKey(arg[j], function(method, key) {
            if (!isMixin || isMixin && !method.$super) {
              addNodeListMethod(method, key, prototype);
            }
          });
        }
      }
      return Klass;
    },

    addMixins = function addMixins() {
      fuse.Class.defaults.statics.addMixins.apply(this, arguments);
      isMixin = true;
      addToNodeList.apply(this, arguments);
      isMixin = false;
      return this;
    },

    addPlugins = function addPlugins() {
      fuse.Class.defaults.statics.addPlugins.apply(this, arguments);
      return addToNodeList.apply(this, arguments);
    };

    Element.addMixins =
    HTMLElement.addMixins = addMixins;

    Element.addPlugins =
    HTMLElement.addPlugins = addPlugins;
  })();

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    var counter = 0;

    plugin.identify = function identify() {
      // use getAttribute to avoid issues with form elements and
      // child controls with ids/names of "id"
      var ownerDoc, element = this.raw || this,
       id = plugin.getAttribute.call(this, 'id');
      if (id != '') return id;

      ownerDoc = element.ownerDocument;
      while (ownerDoc.getElementById(id = 'anonymous_element_' + counter++)) { }

      plugin.setAttribute.call(this, 'id', id);
      return fuse.String(id);
    };

    plugin.isEmpty = function isEmpty() {
      var element = this.raw || this, node = element.firstChild;
      while (node) {
        if (node.nodeType != TEXT_NODE || node.data != false) {
          return false;
        }
        node = node.nextSibling;
      }
      return true;
    };

    plugin.isDetached = function isDetached() {
      var element = this.raw || this;
      return !(element[PARENT_NODE] &&
        plugin.contains.call(element.ownerDocument, element));
    };

    if (envTest('ELEMENT_INNER_HTML')) {
      plugin.isEmpty = function isEmpty() {
        return (this.raw || this).innerHTML == false;
      };
    }

    if (envTest('ELEMENT_SOURCE_INDEX')) {
      plugin.isDetached = function isDetached() {
        var element = this.raw || this;
        return element.ownerDocument.all[element.sourceIndex] != element;
      };
    }
    else if (envTest('ELEMENT_COMPARE_DOCUMENT_POSITION')) {
      plugin.isDetached = function isDetached() {
        /* DOCUMENT_POSITION_DISCONNECTED = 0x01 */
        var element = this.raw || this;
        return (element.ownerDocument.compareDocumentPosition(element) & 1) == 1;
      };
    }

    // prevent JScript bug with named function expressions
    var identify = null, isDetached = null, isEmpty = null;
  })(Element.plugin);
  /*----------------------- HTML ELEMENT: MODIFICATION -----------------------*/

  (function(plugin) {

    var scripts,

    DO_NOT_DECORATE = { 'decorate': false },

    PARENT_NODE_AS_CONTEXT = { 'appendSibling': 1, 'prependSibling': 1 },

    PROPS_TO_COPY = { 'OPTION': 'selected', 'TEXTAREA': 'value' },

    DEFAULTS_TO_COPY = { 'selected': 'defaultSelected', 'value': 'defaultValue' },

    INSERTABLE_NODE_TYPES = { '1': 1, '3': 1, '8': 1, '10': 1, '11': 1 },

    ELEMENT_EVALS_SCRIPT_FROM_INNER_HTML =
      envTest('ELEMENT_EVALS_SCRIPT_FROM_INNER_HTML'),

    ELEMENT_SCRIPT_FAILS_TO_EVAL_TEXT =
      envTest('ELEMENT_SCRIPT_FAILS_TO_EVAL_TEXT'),

    ELEMENT_SCRIPT_REEVALS_TEXT =
      envTest('ELEMENT_SCRIPT_REEVALS_TEXT'),

    ELEMENT_INNER_HTML_BUGGY = (function() {
      var T = !envTest('ELEMENT_INNER_HTML'), o = { };
      if (!T) {
        if (envTest('ELEMENT_COLGROUP_INNER_HTML_BUGGY')) {
          (T = T || o).COLGROUP = 1;
        }
        if (envTest('ELEMENT_OPTGROUP_INNER_HTML_BUGGY')) {
          (T = T || o).OPTGROUP = 1;
        }
        if (envTest('ELEMENT_SELECT_INNER_HTML_BUGGY')) {
          (T = T || o).SELECT = 1;
        }
        if (envTest('ELEMENT_TABLE_INNER_HTML_BUGGY')) {
          (T = T || o).TABLE = T.TBODY = T.TR = T.TD = T.TFOOT = T.TH = T.THEAD = 1;
        }
      }
      return T;
    })(),

    htmlPlugin = HTMLElement.plugin,

    cloneNode = function(source) {
      return source.cloneNode(false);
    },

    cloner = function(source, deep, isData, isEvents, excludes, context) {
      var addDispatcher, child, childQueue, children, data, i, id, j,
       newQueue, parentNode, parentQueue, srcData, srcEvents, k = 0,
       result = cloneNode(source, excludes, null, context);

      if (excludes) {
        i = excludes.length;
        while (i--) {
          plugin.removeAttribute.call(result, excludes[i]);
        }
      }
      if (isData || isEvents) {
        srcData = domData[getFuseId(source, true)];
        srcEvents = srcData && srcData.events;

        if (srcData && isData) {
          id || (id = getFuseId(result));
          data = domData[id];

          delete srcData.events;
          fuse.Object.extend(data, srcData);
          srcEvents && (srcData.events = srcEvents);
        }
        if (srcEvents && isEvents) {
          id   || (id = getFuseId(result));
          data || (data = domData[id]);
          addDispatcher = fuse.dom.Event._addDispatcher;

          // copy delegation watcher
          if (srcData._isWatchingDelegation) {
            fuse.dom.Event._addWatcher(result, data);
          }
          // copy events
          for (i in srcEvents) {
            addDispatcher(result, i, null, id);
            data.events[i].handlers = srcEvents[i].handlers.slice(0);
          }
        }
      }

      // http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4
      if (deep) {
        parentNode  = result;
        childQueue  = source.childNodes;
        parentQueue = [parentNode, childQueue.length - 1];

        while (childQueue.length) {
          // drill down through the queued descendant children
          i = -1; newQueue = [];
          while (child = childQueue[++i]) {
            j = -1;
            children = child.childNodes;
            length   = children.length;
            child    = child.nodeType == ELEMENT_NODE
              ? cloner(child, false, isData, isEvents, excludes, context)
              : child.cloneNode(false);

            // jump to the next queued parent if starting a new child queue
            // or passed the child count of the current parent
            if ((i == 0 || i > parentQueue[k + 1]) && parentQueue[k + 2]) {
              parentNode = parentQueue[k += 2];
            }
            // if the child has children add it along with the last
            // childQueue index of its children to the parents queue
            if (length) {
              parentQueue.push(child, newQueue.length + length - 1);
            }
            // queue children of descendants
            while (++j < length) {
              newQueue.push(children[j]);
            }
            parentNode.appendChild(child);
          }
          childQueue = newQueue;
        }
      }
      return result;
    },

    getScripts = function(element) {
      var child, i, pad, nodes, result = [];
      if (getNodeName(element) == 'SCRIPT') {
        result[0] = element;
      }
      else {
        child = element.firstChild;
        while (child) {
          if (getNodeName(child) == 'SCRIPT') {
            result.push(child);
          }
          else if (typeof child.getElementsByTagName != 'undefined') {
            // concatList implementation for nodeLists
            i = 0; pad = result.length; nodes = child.getElementsByTagName('script');
            while (result[pad + i] = nodes[i++]) { }
            result.length--;
          }
          child = child.nextSibling;
        }
      }
      return result;
    },

    purgeDescendants = function(element) {
      var data, id, i = -1,
       elements = element.getElementsByTagName('*');

      while (element = elements[++i]) {
        if (element.nodeType == ELEMENT_NODE) {
          id = getFuseId(element, true);
          if (data = domData[id]) {
            data.events && htmlPlugin.stopObserving.call(element);
            delete domData[id];
          }
        }
      }
    },

    runScripts = function(element) {
      var context, isAttached, script, i = -1;
      if (scripts) {
        isAttached = !plugin.isDetached.call(element);
        while (script = scripts[++i]) {
          if (!plugin.hasAttribute.call(script, 'src') &&
              (!script.type || script.type.toLowerCase() == 'text/javascript')) {
            isAttached && fuse.run(getScriptText(script), context || (context = getDocument(element)));
          }
        }
      }
    },

    toNode = function(content, context) {
      var result, skipScripts;
      scripts = null;

      if (content || content == '0') {
        if (content.nodeName) {
          result = content && content.raw || content || { };
          // fix evaling inserted script elements in Safari <= 2.0.2 and Firefox 2.0.0.2
          skipScripts = !ELEMENT_SCRIPT_FAILS_TO_EVAL_TEXT;
        }
        else {
          result = getFragmentFromHTML(content, context);
          // skip evaling scripts created from a string in Firefox 3.x
          skipScripts = ELEMENT_EVALS_SCRIPT_FROM_INNER_HTML;
        }
        if (INSERTABLE_NODE_TYPES[result.nodeType]) {
          !skipScripts && (scripts = getScripts(result));
          return result;
        }
      }
    },

    updateElement = function(element, content) {
      var child;
      purgeDescendants(element);
      while (child = element.lastChild) {
        destroyElement(child, element);
      }
      if (content = toNode(content, element)) {
        element.appendChild(content);
        runScripts(element);
      }
    };

    /*------------------------------------------------------------------------*/

    plugin.cleanWhitespace = function cleanWhitespace() {
      // removes whitespace-only text node children
      var nextNode, element = this.raw || this, node = element.firstChild;
      while (node) {
        nextNode = node.nextSibling;
        if (node.nodeType == TEXT_NODE && node.data == false) {
          element.removeChild(node);
        }
        node = nextNode;
      }
      return this;
    };

    plugin.clone = function clone(deep) {
      var context, data, events, excludes, element = this.raw || this;
      if (deep && typeof deep == 'object') {
        context = deep.context;
        data = deep.data;
        events = deep.events;
        excludes = deep.excludes;
        deep = deep.data;
        if (excludes && !isArray(excludes)) {
          excludes = [excludes];
        }
      }
      return fromElement(cloner(element, deep, data, events, excludes, context || getDocument(element)));
    };

    plugin.destroy = function() {
      var element = this.raw || this;
      destroyElement(plugin.purge.call(element), element[PARENT_NODE]);
      this.raw && (this.raw = null);
      return null;
    };

    plugin.prependChildTo = function prependChildTo(content) {
      content && plugin.prependChild.call(content.raw || fuse(content, DO_NOT_DECORATE), this);
      return this;
    };

    plugin.appendChildTo = function appendChildTo(content) {
      content && plugin.appendChild.call(content.raw || fuse(content, DO_NOT_DECORATE), this);
      return this;
    };

    plugin.prependSiblingTo = function prependSiblingTo(content) {
      content && plugin.prependSibling.call(content.raw || fuse(content, DO_NOT_DECORATE), this);
      return this;
    };

    plugin.appendSiblingTo = function appendSiblingTo(content) {
      content && plugin.appendSibling.call(content.raw || fuse(content, DO_NOT_DECORATE), this);
      return this;
    };

    plugin.prependSibling = function prependSibling(content) {
      var element = this.raw || this, parentNode = element[PARENT_NODE];
      if (parentNode && (content = toNode(content, parentNode))) {
        parentNode.insertBefore(content, element);
        runScripts(element);
      }
      return this;
    };

    plugin.appendSibling = function appendSibling(content) {
      var element = this.raw || this, parentNode = element[PARENT_NODE];
      if (parentNode && (content = toNode(content, parentNode))) {
        parentNode.insertBefore(content, element.nextSibling);
        runScripts(element);
      }
      return this;
    };

    plugin.prependChild = function prependChild(content) {
      var element = this.raw || this;
      if (content = toNode(content, element)) {
        element.insertBefore(content, element.firstChild);
        runScripts(element);
      }
      return this;
    };

    plugin.appendChild = function appendChild(content) {
      var element = this.raw || this;
      if (content = toNode(content, element)) {
        element.appendChild(content);
        runScripts(element);
      }
      return this;
    };

    plugin.purge = function purge() {
      var element = this.raw || this,
       id = getFuseId(element, true),
       data = domData[id];

      if (data) {
        data.events && htmlPlugin.stopObserving.call(element);
        delete domData[id];
      }
      purgeDescendants(element);
      return this;
    };

    plugin.remove = function remove() {
      var element = this.raw || this, parentNode = element[PARENT_NODE];
      parentNode && parentNode.removeChild(element);
      return this;
    };

    plugin.replace = function replace(content) {
      var element = this.raw || this, parentNode = element[PARENT_NODE];
      if (parentNode) {
        if (content = toNode(content, parentNode)) {
          parentNode.replaceChild(content, element);
          runScripts(parentNode);
        } else {
          plugin.remove.call(element);
        }
      }
      return this;
    };

    plugin.update = function update(content) {
      var element = this.raw || this;
      content || content == '0' || (content = '');

      if (getNodeName(element) == 'SCRIPT') {
        setScriptText(element, content.nodeType == TEXT_NODE ?
          (content.raw || content).data : content);
        if (!ELEMENT_SCRIPT_REEVALS_TEXT) {
          scripts = [element];
          runScripts(element);
        }
      }
      else {
        purgeDescendants(element);
        if (INSERTABLE_NODE_TYPES[content.nodeType]) {
          element.innerHTML = '';
          element.appendChild(content.raw || content);
        } else {
          element.innerHTML = content;
        }
        scripts = getScripts(element);
        runScripts(element);
      }
      return this;
    };

    plugin.wrap = function wrap(wrapper, attributes) {
      var rawWrapper, element = this.raw || this,
       parentNode = element[PARENT_NODE],
       options = { 'attrs': attributes, 'context': element }

      if (isString(wrapper)) {
        wrapper = Element(wrapper, options);
      }
      if (isElement(wrapper)) {
        wrapper = plugin.setAttribute.call(wrapper, attributes);
      }
      else {
        options.attrs = wrapper;
        wrapper = HTMLElement('div', options);
      }
      rawWrapper = wrapper.raw || wrapper;
      if (parentNode) {
        parentNode.replaceChild(rawWrapper, element);
      }
      rawWrapper.appendChild(element);
      return wrapper;
    };

    /*------------------------------------------------------------------------*/

    // Fix browsers with buggy innerHTML implementations
    if (ELEMENT_INNER_HTML_BUGGY === true) {
      plugin.update = function update(content) {
        updateElement(this.raw || this, content);
        return this;
      };
    }
    else if (ELEMENT_INNER_HTML_BUGGY) {
      var __update = plugin.update;
      plugin.update = function update(content) {
        var element = this.raw || this;
        if (ELEMENT_INNER_HTML_BUGGY[getNodeName(element)]) {
          updateElement(element, content);
        } else {
          __update.call(this, content);
        }
        return this;
      };
    }

    // Fix cloning elements in IE 6/7
    if (envTest('NAME_ATTRIBUTE_IS_READONLY') ||
        envTest('ATTRIBUTE_NODES_SHARED_ON_CLONED_ELEMENTS')) {

      cloneNode = function(source, excludes, nodeName, context) {
        var attr, node, attributes = { }, setName = 1, setType = 1;
        nodeName || (nodeName = getNodeName(source));

        if (excludes) {
          excludes = ' ' + excludes.join(' ') + ' ';
          setName = excludes.indexOf(' name ') == -1;
          setType = excludes.indexOf(' type ') == -1;
        }
        if (typeof source.submit == 'undefined') {
          if (setName) attributes.name = source.name;
          if (setType) attributes.type = source.type;
        } else {
          if (setName) attributes.name = plugin.getAttribute.call(source, 'name');
          if (setType) attributes.type = plugin.getAttribute.call(source, 'type');
        }

        element = Element(nodeName,
          { 'attrs': attributes, 'context': context, 'decorate': false });

        // avoid mergeAttributes because it is buggy :/
        attributes = source.attributes || { };
        for (attr in attributes) {
          if (plugin.hasAttribute.call(source, attr)) {
            node = source.getAttributeNode(attr);
            attr = context.createAttribute(attr);
            element.setAttributeNode(attr);
            attr.value = node.value;
          }
        }
        return element;
      };
    }

    // Fix form element attributes in IE
    if (envTest('INPUT_VALUE_PROPERTY_SETS_ATTRIBUTE')) {
      var __cloneNode = cloneNode;
      cloneNode = function(source, excludes, nodeName, context) {
        nodeName || (nodeName = getNodeName(source));
        var defaultProp, element = __cloneNode(source, excludes, nodeName, context);

        // copy troublesome attributes/properties
        excludes = excludes && ' ' + excludes.join(' ') + ' ' || '';
        if (nodeName == 'INPUT') {
          if (excludes.indexOf(' value ') == -1) {
            element.defaultValue = source.defaultValue;
            element.value = source.value;
          }
          if (CHECKED_INPUT_TYPES[element.type] &&
              excludes.indexOf(' checked ') == -1) {
            element.defaultChecked = source.defaultChecked;
            element.checked = source.checked;
          }
        }
        else if (prop = PROPS_TO_COPY[nodeName] &&
            excludes.indexOf(' ' + prop + ' ') == -1) {
          defaultProp = DEFAULTS_TO_COPY[prop];
          element[defaultProp]  = source[defaultProp];
          element[prop] = source[prop];
        }
        return element;
      };
    }

    // prevent JScript bug with named function expressions
    var appendChild =   null,
     appendChildTo =    null,
     appendSibling =    null,
     appendSiblingTo =  null,
     cleanWhitespace =  null,
     clone =            null,
     destroy =          null,
     prependChild =     null,
     prependChildTo =   null,
     prependSibling =   null,
     prependSiblingTo = null,
     purge =            null,
     remove =           null,
     replace =          null,
     wrap =             null;
  })(Element.plugin);
  /*------------------------ HTML ELEMENT: ATTRIBUTE -------------------------*/

  (function(plugin) {

    var ATTR_DEFAULT_VALUE_PROP =
      { 'selected': 'defaultSelected', 'value': 'defaultValue' },

    ATTR_NAME = domData['1'].attributes =
      { 'contentNames': { }, 'read': { }, 'write': { }, 'names': { } },

    TAG_WITH_DEFAULT_VALUE_PROP =
      { 'OPTION': 'selected', 'TEXTAREA': 'value' },

    // http://www.w3.org/TR/html4/index/attributes.html
    TAG_PROP_DEFAULT_VALUE = (function() {
      var T = {
        'A':      { 'shape': 'rect', 'tabindex': '0' },
        'BR':     { 'clear': 'none' },
        'BUTTON': { 'tabindex': '0', 'type': 'submit' },
        'COL':    { 'span': 1 },
        'LI':     { 'value': 1 },
        'TD':     { 'colspan': 1, 'rowspan': 1 },
        'FORM':   { 'enctype': 'application/x-www-form-urlencoded', 'method': 'get' },
        'FRAME':  { 'frameborder': 1 },
        'INPUT':  { 'type': 'text', 'tabindex': '0' },
        'OBJECT': { 'tabindex': '0' },
        'OL':     { 'start': '0' },
        'PARAM':  { 'valuetype': 'data' },
        'PRE':    { 'width': '0' },
        'SELECT': { 'size': '0', 'tabindex': '0' }
      };

      T.AREA = T.A;
      T.COLGROUP = T.COL;
      T.TH = T.TD;
      T.IFRAME = T.FRAME;
      T.TEXTAREA = T.OBJECT;
      return T;
    })();

    plugin.hasAttribute = function hasAttribute(name) {
      return (this.raw || this).hasAttribute(name);
    };

    plugin.getAttribute = function getAttribute(name) {
      var result, defaults, element = this.raw || this,
       contentName = ATTR_NAME.contentNames[name] || name;

      name = ATTR_NAME.names[name] || name;
      if (ATTR_NAME.read[name]) {
        result = ATTR_NAME.read[name](element, contentName);
      }
      else if (!((result = element.getAttributeNode(name)) &&
          result.specified && (result = result.value)) &&
          (defaults = TAG_PROP_DEFAULT_VALUE[getNodeName(element)])) {
        result = defaults[name];
      }
      return fuse.String(result || '');
    };

    plugin.removeAttribute = function removeAttribute(name) {
      (this.raw || this).removeAttribute(ATTR_NAME.contentNames[name] || name);
      return this;
    };

    plugin.setAttribute = function setAttribute(name, value) {
      var contentName, isRemoved, node,
       element = this.raw || this, attributes = { };

      if (isHash(name)) {
        attributes = name._object;
      } else if (!isString(name)) {
        attributes = name;
      } else {
        attributes[name] = (typeof value == 'undefined') ? true : value;
      }

      for (name in attributes) {
        value = attributes[name];
        contentName = ATTR_NAME.contentNames[name] || name;
        name = ATTR_NAME.names[name] || name;
        isRemoved = value === false || value == null;

        if (ATTR_NAME.write[name]) {
          if (ATTR_NAME.write[name](element, value, isRemoved) === false) {
            element.removeAttribute(contentName);
          }
        }
        else if (isRemoved) {
          element.removeAttribute(contentName);
        }
        else {
          element.setAttribute(contentName,
            value === true ? name : String(value));
        }
      }
      return this;
    };

    // For IE
    if (!envTest('ELEMENT_HAS_ATTRIBUTE')) {
      plugin.hasAttribute = function hasAttribute(name) {
        var defaultProp, node = this.raw || this,
         nodeName = getNodeName(node);

        if (nodeName == 'INPUT') {
          if (name == 'value') {
            defaultProp = 'defaultValue';
          } else if (name == 'checked' && CHECKED_INPUT_TYPES[node.type]) {
            defaultProp = 'defaultChecked';
          }
        } else if (TAG_WITH_DEFAULT_VALUE_PROP[nodeName] == name) {
          defaultProp =  ATTR_DEFAULT_VALUE_PROP[name];
        }

        if (defaultProp) {
          return !!node[defaultProp];
        }
        // IE6/7 fails to detect value attributes as well as colspan and rowspan
        // attributes with a value of 1
        node = node.getAttributeNode(ATTR_NAME.names[name] || name);
        return !!node && node.specified;
      };
    }

    // prevent JScript bug with named function expressions
    var getAttribute = null,
     hasAttribute =    null,
     setAttribute =    null,
     removeAttribute = null;
  })(Element.plugin);

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    var T = domData['1'].attributes,

    getAttribute = function(element, contentName) {
      return element.getAttribute(contentName);
    },

    getDefault = function(capitalName) {
      var defaultName = 'default' + capitalName, lower = capitalName.toLowerCase();
      return function(element) {
        return element[defaultName] && lower;
      };
    },

    getEvent = function(element, name) {
      var node = element.getAttributeNode(name);
      return node && node.specified && node.value;
    },

    getExact = function(element, contentName) {
      // `iFlags` as 2 returns the value exactly as it was set in script or in the source document
      // http://web.archive.org/web/20080508155143/http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
      return element.getAttribute(contentName, 2);
    },

    getFlag = function(contentName) {
      var lower = contentName.toLowerCase();
      return function(element) {
        return plugin.hasAttribute.call(element, contentName) && lower;
      };
    },

    getStyle = function(element) {
      return element.style.cssText.toLowerCase();
    },

    getValue = function(element) {
      return element.defaultValue;
    },

    setDefault = function(capitalName) {
      var defaultName = 'default' + capitalName, lower = capitalName.toLowerCase();
      return function(element, value) {
        // contentName is used for setAttribute in IE6/7 but
        // in this case the relevant names aren't camel-cased to begin with
        element[defaultName] = !!value;
        value && element.setAttribute(lower, lower);
      };
    },

    setFlag = function(contentName) {
      var lower = contentName.toLowerCase();
      return function(element, value, remove) {
        if (remove) return false;
        element.setAttribute(contentName, lower);
      };
    },

    setNode = function(name) {
      return function(element, value, remove) {
        if (remove) return false;
        var attr = element.getAttributeNode(name);
        if (!attr) {
          attr = element.ownerDocument.createAttribute(name);
          element.setAttributeNode(attr);
        }
        attr.value = String(value);
      };
    },

    setStyle = function(element, value) {
      element.style.cssText = String(value || '');
    },

    setValue = function(element, value, remove) {
      element.defaultValue = remove ? null : value;
    },

    splitEach = function(string, callback) {
      var array = string.split(' '), i = -1;
      while (array[++i]) callback(array[i]);
    };

    // mandate type getter
    T.read.type = getAttribute;

    // mandate getter/setter for checked and selected attributes
    // http://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-37770574
    T.read.checked   = getDefault('Checked');
    T.write.checked  = setDefault('Checked');
    T.read.selected  = getDefault('Selected');
    T.write.selected = setDefault('Selected');

    // mandate flag attributes set and return their name
    splitEach('disabled isMap multiple noHref noResize noShade ' +
      'noWrap readOnly',
      function(contentName) {
        var lower = contentName.toLowerCase();
        T.read[lower]  = getFlag(contentName);
        T.write[lower] = setFlag(contentName);
    });

    // mandate event attribute getter
    splitEach('blur change click contextmenu dblclick error focus load keydown ' +
      'keypress keyup mousedown mousemove mouseout mouseover mouseup ' +
      'readystatechange reset submit select unload',
      function(name) {
        T.read['on' + name] = getEvent;
    });

    // mandate getAttribute/setAttribute for value
    // http://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26091157
    extendByTag(['input', 'textarea'], function() {
      var __getAttribute = plugin.getAttribute,
       __setAttribute = plugin.setAttribute,

      getAttribute = function getAttribute(name) {
        return name == 'value'
          ? getValue(this.raw || this)
          : __getAttribute.call(this, name);
      },

      setAttribute = function setAttribute(name, value) {
        name == 'value'
          ? setValue(this.raw || this, value)
          : __setAttribute.call(this, name, value);
        return this;
      };

      return { 'getAttribute': getAttribute, 'setAttribute': setAttribute };
    });

    // capability checks
    (function() {
      var checkbox, input, node, value,
       doc   = fuse._doc,
       form  = doc.createElement('form'),
       label = doc.createElement('label');

      label.htmlFor = label.className = 'x';
      label.setAttribute('style', 'display:block');
      form.setAttribute('enctype', 'multipart/form-data');

      // translate content name `htmlFor`
      if (label.getAttribute('htmlFor') == 'x') {
        T.contentNames['for'] = 'htmlFor';
      } else {
        T.contentNames.htmlFor = 'for';
      }

      // translate content name `className`
      if (label.getAttribute('className') == 'x') {
        T.contentNames['class'] = 'className';
      } else {
        T.contentNames.className = 'class';
      }

      // set `encType`
      if ((node = form.getAttributeNode('enctype')) &&
          node.value != 'multipart/form-data') {
        T.write.enctype = setNode('encType');
      }

      // getter/setter for `style` attribute
      value = (node = label.getAttributeNode('style')) && node.value;
      if (typeof value != 'string' || value.lastIndexOf('display:block', 0)) {
        T.read.style  = getStyle;
        T.write.style = setStyle;
      }

      // Get URI attributes, excluding the `action` attribute because
      // Opera 9.25 automatically translates the URI from relative to absolute
      // and IE will have the reverse effect.
      // TODO: Check others attributes like background, BaseHref, cite, codeBase,
      // data, dynsrc, lowsrc, pluginspage, profile, and useMap.
      if (envTest('ELEMENT_GET_ATTRIBUTE_IFLAG')) {
        splitEach('href longdesc src', function(name) { T.read[name] = getExact; });
      }
    })();

    // setter for button element value
    if (envTest('BUTTON_VALUE_CHANGES_AFFECT_INNER_CONTENT')) {
      extendByTag('button', function() {
        var __setAttribute = plugin.setAttribute,
         setValue = setNode('value'),

        setAttribute = function setAttribute(name, value) {
          name == 'value'
            ? setValue(this.raw || this, value)
            : __setAttribute.call(this, name, value);
          return this;
        };

        return { 'setAttribute': setAttribute };
      });
    }

    // add camel-cased contentName translations for IE6/7
    if (T.contentNames['class'] || T.contentNames['for']) {
      splitEach('bgColor codeBase codeType cellPadding cellSpacing colSpan ' +
        'rowSpan vAlign vLink aLink dateTime accessKey tabIndex encType ' +
        'maxLength readOnly longDesc frameBorder isMap useMap noHref noResize ' +
        'noShade noWrap marginWidth marginHeight',
        function(contentName) {
          var lower = contentName.toLowerCase();
          T.contentNames[lower] = contentName;
          T.names[contentName]  = lower;
      });
    }
  })(Element.plugin);
  /*-------------------------- HTML ELEMENT: STYLE ---------------------------*/

  (function(plugin) {

    var CHECK_DIMENSION_IS_NULL =
      envTest('ELEMENT_COMPUTED_STYLE_HEIGHT_IS_ZERO_WHEN_HIDDEN'),

    CHECK_POSITION_IS_NULL =
      envTest('ELEMENT_COMPUTED_STYLE_DEFAULTS_TO_ZERO'),

    FLOAT_TRANSLATIONS = typeof fuse._docEl.style.styleFloat != 'undefined'
      ? { 'float': 'styleFloat', 'cssFloat': 'styleFloat' }
      : { 'float': 'cssFloat' },

    NON_PX_NAMES = { 'fontWeight': 1, 'opacity': 1, 'zIndex': 1, 'zoom': 1 },

    POSITION_NAMES = { 'bottom': 1, 'left': 1, 'right': 1, 'top': 1 },

    DIMENSION_NAMES = { 'height': 1, 'width': 1 },

    RELATIVE_CSS_UNITS = { 'em': 1, 'ex': 1 },

    reOpacity   = /opacity:\s*(\d?\.?\d*)/,

    reOverflow  = /overflow:\s*([^;]+)/,

    reNonPxUnit = /^-?\d+(\.\d+)?(?!px)[%a-z]+$/i,

    reUnit      = /\D+$/,

    camelize = (function() {
      var cache = { },
      reHyphenated = /-([a-z])/gi,
      toUpperCase = function(match, letter) { return letter.toUpperCase(); },
      replace = envTest('STRING_REPLACE_COERCE_FUNCTION_TO_STRING') ?
        fuse.String.plugin.replace : ''.replace;

      return function(string) {
        return cache[string] ||
          (cache[string] = replace.call(string, reHyphenated, toUpperCase));
      };
    })(),

    getComputedStyle = function(element, name) {
      name = FLOAT_TRANSLATIONS[name] || name;
      var css = element.ownerDocument.defaultView.getComputedStyle(element, null);
      return getValue(element, name, css && css[name]);
    },

    getValue = function(element, name, value) {
      name = FLOAT_TRANSLATIONS[name] || name;
      value || (value = element.style[name]);
      if (name == 'opacity') {
        return value == '1' ? '1.0' : parseFloat(value) || '0';
      }
      return value == 'auto' || value === '' ? null : value;
    },

    isNull = function(element, name) {
      var result = false;
      if (CHECK_POSITION_IS_NULL && POSITION_NAMES[name]) {
        result = getComputedStyle(element, 'position') == 'static';
      }
      else if (CHECK_DIMENSION_IS_NULL && DIMENSION_NAMES[name]) {
        result = getComputedStyle(element, 'display') == 'none';
      }
      return result;
    };

    plugin.setStyle = function setStyle(styles) {
      var hasOpacity, key, value, opacity, elemStyle = this.style;

      if (isString(styles)) {
        if (styles.indexOf('opacity:') > -1) {
          plugin.setOpacity.call(this, styles.match(reOpacity)[1]);
          styles = styles.replace(reOpacity, '');
        }
        // IE and Konqueror bug-out when setting overflow via cssText
        if (styles.indexOf('overflow:') > -1) {
          elemStyle.overflow = styles.match(reOverflow)[1];
          styles = styles.replace(reOverflow, '');
        }
        elemStyle.cssText += ';' + styles;
        return this;
      }

      if (isHash(styles)) {
        styles = styles._object;
      }

      if (hasOpacity = 'opacity' in styles) {
        opacity = styles.opacity;
        plugin.setOpacity.call(this, opacity);
        delete styles.opacity;
      }

      for (key in styles) {
        value = String(styles[key] || ''); key = camelize(key);
        elemStyle[FLOAT_TRANSLATIONS[key] || key] = value;
      }

      if (hasOpacity) {
        styles.opacity = opacity;
      }
      return this;
    };


    // fallback for browsers without computedStyle or currentStyle
    if (!envTest('ELEMENT_COMPUTED_STYLE') && !envTest('ELEMENT_CURRENT_STYLE')) {
      plugin.getStyle = function getStyle(name) {
        var result = getValue(this, camelize(name));
        return result === null ? result : fuse.String(result);
      };
    }
    // Opera 9.2x
    else if (envTest('ELEMENT_COMPUTED_STYLE_DIMENSIONS_EQUAL_BORDER_BOX')) {
      plugin.getStyle = function getStyle(name) {
        name = camelize(name);
        var dim, element = this.raw || this, result = null;

        if (!isNull(element, name)) {
          if (DIMENSION_NAMES[name]) {
            dim = name == 'width' ? 'Width' : 'Height';
            result = getComputedStyle(element, name);
            if ((parseFloat(result) || 0) === element['offset' + dim]) {
              result = plugin['get' + dim].call(this, 'content') + 'px';
            }
          } else {
            result = getComputedStyle(element, name);
          }
        }
        return result === null ? result : fuse.String(result);
      };
    }
    // Firefox, Safari, Opera 9.5+
    else if (envTest('ELEMENT_COMPUTED_STYLE')) {
      plugin.getStyle = function getStyle(name) {
        name = camelize(name);
        var element = this.raw || this, result = null;

        if (!isNull(element, name)) {
          result = getComputedStyle(element, name);
        }
        return result === null ? result : fuse.String(result);
      };
    }
    // IE
    else {
      // We need to insert into element a span with the M character in it.
      // The element.offsetHeight will give us the font size in px units.
      // Inspired by Google Doctype:
      // http://code.google.com/p/doctype/source/browse/trunk/goog/style/style.js#1146
      var span = fuse._doc.createElement('span');
      span.style.cssText = 'position:absolute;visibility:hidden;height:1em;lineHeight:0;padding:0;margin:0;border:0;';
      span.appendChild(fuse._doc.createTextNode('M'));

      plugin.getStyle = function getStyle(name) {
        var currStyle, element, elemStyle, runtimeStyle, runtimePos,
         stylePos, pos, size, unit, result;

        // handle opacity
        if (name == 'opacity') {
          result = String(plugin.getOpacity.call(this));
          return fuse.String(result.indexOf('.') < 0
            ? result + '.0'
            : result);
        }

        element = this.raw || this;
        name = camelize(name);

        // get cascaded style
        name      = FLOAT_TRANSLATIONS[name] || name;
        elemStyle = element.style;
        currStyle = element.currentStyle || elemStyle;
        result    = currStyle[name];

        // handle auto values
        if (result == 'auto') {
          if (DIMENSION_NAMES[name] && currStyle.display != 'none') {
            result = plugin['get' +
              (name == 'width' ? 'Width' : 'Height')].call(this, 'content') + 'px';
          } else {
            return null;
          }
        }
        // If the unit is something other than a pixel (em, pt, %),
        // set it on something we can grab a pixel value from.
        // Inspired by Dean Edwards' comment
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
        else if (!NON_PX_NAMES[name] && reNonPxUnit.test(result)) {
          if (name == 'fontSize') {
            unit = result.match(reUnit)[0];
            if (unit == '%') {
              size = element.appendChild(span).offsetHeight;
              element.removeChild(span);
              return fuse.String(Math.round(size) + 'px');
            }
            else if (RELATIVE_CSS_UNITS[unit]) {
              elemStyle = (element = element.parentNode).style;
            }
          }

          runtimeStyle = element.runtimeStyle;

          // backup values
          pos = name == 'height' ? 'top' : 'left';
          stylePos = elemStyle[pos];
          runtimePos = runtimeStyle[pos];

          // set runtimeStyle so no visible shift is seen
          runtimeStyle[pos] = stylePos;
          elemStyle[pos] = result;

          // pixelLeft/pixelTop are not affected by runtimeStyle
          result = elemStyle['pixel' + (pos == 'top' ? 'Top' : 'Left')] + 'px';

          // revert changes
          elemStyle[pos] = stylePos;
          runtimeStyle[pos] = runtimePos;
        }
        return fuse.String(result);
      };
    }

    // prevent JScript bug with named function expressions
    var getStyle = null, setStyle = null;
  })(HTMLElement.plugin);

  /*--------------------------------------------------------------------------*/

  // Note: For performance we normalize all spaces to \x20.
  // http://www.w3.org/TR/html5/infrastructure.html#space-character
  (function(plugin) {

    var split      = fuse.String.plugin.split,
     reEdgeSpaces  = /[\t\n\r\f]/g,
     reExtraSpaces = /\x20{2,}/g;

    plugin.addClassName = function addClassName(className) {
      if (!plugin.hasClassName.call(this, className)) {
        var element = this.raw || this;
        element.className += (element.className ? ' ' : '') + className;
      }
      return this;
    };

    plugin.getClassNames = function getClassNames() {
      var element = this.raw || this, cn = element.className;
      return cn.length
        ? split.call(cn.replace(reEdgeSpaces, ' ').replace(reExtraSpaces, ' '), ' ')
        : fuse.Array();
    };

    plugin.hasClassName = function hasClassName(className) {
      var element = this.raw || this, cn = element.className;
      return !!cn.length &&
        (cn == className ||
        (' ' + cn.replace(reEdgeSpaces, ' ') + ' ')
        .indexOf(' ' + className + ' ') > -1);
    };

    plugin.removeClassName = function removeClassName(className) {
      var classNames, length, element = this.raw || this,
       cn = element.className, i = -1, j = i, result = [];

      if (cn.length) {
        classNames = cn.replace(reEdgeSpaces, ' ').split(' ');
        length = classNames.length;

        while (++i < length) {
          cn = classNames[i];
          if (cn != className) result[++j] = cn;
        }
        element.className = result.join(' ');
      }
      return this;
    };

    plugin.toggleClassName = function toggleClassName(className) {
      return plugin[plugin.hasClassName.call(this, className) ?
        'removeClassName' : 'addClassName'].call(this, className);
    };

    // prevent JScript bug with named function expressions
    var addClassName = null,
     getClassNames =   null,
     hasClassName =    null,
     removeClassName = null,
     toggleClassName = null;
  })(HTMLElement.plugin);

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    var TABLE_ELEMENTS = { 'THEAD': 1, 'TBODY': 1, 'TR': 1 },

    OPACITY_PROP = (function(s) {
      return 'opacity'  in s ? 'opacity'       :
        'MozOpacity'    in s ? 'MozOpacity'    :
        'WebkitOpacity' in s ? 'WebKitOpacity' :
        'KhtmlOpacity'  in s ? 'KhtmlOpacity'  : false;
    })(fuse._div.style),

    getComputedStyle = function(element, name) {
      var style = element.currentStyle;
      return style && style[name];
    };

    if (envTest('ELEMENT_COMPUTED_STYLE')) {
      getComputedStyle = function(element, name) {
        var style = element.ownerDocument.defaultView.getComputedStyle(element, null);
        return style && style[name];
      };
    }

    plugin.getDimensions = function getDimensions(options) {
      return {
        'width':  plugin.getWidth.call(this, options),
        'height': plugin.getHeight.call(this, options)
      };
    };

    plugin.hide = function hide() {
      var element = this.raw || this,
       elemStyle = element.style,
       data = domData[getFuseId(element)],
       display = elemStyle.display,
       value = 'none';

      if (display && display != 'none') {
        data.madeHidden = display;
      }
      else if (data.hiddenByCss) {
        value = '';
      }
      delete data.hiddenByCss;
      elemStyle.display = value;
      return this;
    };

    plugin.show = function show() {
      var element = this.raw || this,
       elemStyle = element.style,
       data = domData[getFuseId(element)],
       display = elemStyle.display;

      if (display == 'none') {
        elemStyle.display = data.madeHidden || '';
      }
      else if (getComputedStyle(element, 'display') == 'none') {
        data.hiddenByCss = 1;
        elemStyle.display = 'block';
      }
      delete data.madeHidden;
      return this;
    };

    plugin.toggle = function toggle() {
      return plugin[plugin.isVisible.call(this) ? 'hide' : 'show'].call(this);
    };

    plugin.getOpacity = (function() {
      var getOpacity = function getOpacity() {
        return fuse.Number(parseFloat(this.style[OPACITY_PROP]));
      };

      if (envTest('ELEMENT_MS_CSS_FILTERS')) {
        var reFilterOpacity = /alpha\(opacity=(.*)\)/;
        getOpacity = function getOpacity() {
          var element = this.raw || this,
           result = (element.currentStyle || element.style).filter.match(reFilterOpacity);
          return fuse.Number(result && result[1] ? parseFloat(result[1]) / 100 : 1.0);
        };
      }
      else if (!OPACITY_PROP) {
        getOpacity = function getOpacity() {
          return fuse.Number(1);
        };
      }
      else if (envTest('ELEMENT_COMPUTED_STYLE')) {
        getOpacity = function getOpacity() {
          var element = this.raw || this,
           style = element.ownerDocument.defaultView.getComputedStyle(element, null);
          return fuse.Number(parseFloat(element.style[OPACITY_PROP] || style && style[OPACITY_PROP] || 1.0));
        };
      }

      return getOpacity;
    })();

    plugin.setOpacity = (function() {
      var nearOne = 0.99999,
       nearZero   = 0.00001,
       reAlpha    = /alpha\([^)]*\)/i;

      var setOpacity = function setOpacity(value) {
        if (value > nearOne) {
          value = 1;
        } if (value < nearZero && !isString(value)) {
          value = 0;
        }
        this.style[OPACITY_PROP] = value;
        return this;
      };

      if (envTest('ELEMENT_MS_CSS_FILTERS')) {
        setOpacity = function setOpacity(value) {
          // strip alpha from filter style
          var element = this.raw || this,
           elemStyle  = element.style,
           currStyle  = element.currentStyle || elemStyle,
           filter     = currStyle.filter.replace(reAlpha, ''),
           zoom       = currStyle.zoom;

          if (value > nearOne || value == '' && isString(value)) {
            value = 1;
          } if (value < nearZero) {
            value = 0;
          }

          if (value === 1) {
            if (filter) {
              elemStyle.filter = filter;
            } else {
              elemStyle.removeAttribute('filter');
            }
          } else {
            // force layout for filters to work
            if (!(currStyle && currStyle.hasLayout || zoom && zoom != 'normal')) {
              elemStyle.zoom = 1;
            }
            elemStyle.filter = filter + 'alpha(opacity=' + (value * 100) + ')';
          }
          return this;
        };
      }
      else if (!OPACITY_PROP) {
        setOpacity = function setOpacity(value) { /* do nothing */ };
      }

      return setOpacity;
    })();

    plugin.isVisible = function isVisible() {
      if (!fuse._body) return false;

      var isVisible = function isVisible() {
        // handles IE and the fallback solution
        var element = this.raw || this, currStyle = element.currentStyle;
        return currStyle !== null && (currStyle || element.style).display != 'none' &&
          !!(element.offsetHeight || element.offsetWidth);
      };

      if (envTest('ELEMENT_COMPUTED_STYLE')) {
        isVisible = function isVisible() {
          var element = this.raw || this,
           compStyle = element.ownerDocument.defaultView.getComputedStyle(element, null);
          return !!(compStyle && (element.offsetHeight || element.offsetWidth));
        };
      }
      if (envTest('TABLE_ELEMENTS_RETAIN_OFFSET_DIMENSIONS_WHEN_HIDDEN')) {
        var __isVisible = isVisible;
        isVisible = function isVisible() {
          if (__isVisible.call(this)) {
            var element = this.raw || this, nodeName = getNodeName(element);
            if (TABLE_ELEMENTS[nodeName] && (element = element.parentNode)) {
              return isVisible.call(element);
            }
            return true;
          }
          return false;
        };
      }

      // redefine and execute
      plugin.isVisible = isVisible;
      return isVisible.call(this);
    };

    // prevent JScript bug with named function expressions
    var getDimensions = null,
     hide =             null,
     isVisible =        null,
     show =             null,
     toggle =           null;
  })(HTMLElement.plugin);

  /*--------------------------------------------------------------------------*/

  // define HTMLElement#getWidth and HTMLElement#getHeight
  (function(plugin) {

    var PRESETS = {
      'box':     { 'border':  1, 'margin':  1, 'padding': 1 },
      'visual':  { 'border':  1, 'padding': 1 },
      'client':  { 'padding': 1 },
      'content': {  }
    },

    HEIGHT_WIDTH_STYLE_SUMS = {
      'Height': {
        'border':  ['borderTopWidth', 'borderBottomWidth'],
        'margin':  ['marginTop',      'marginBottom'],
        'padding': ['paddingTop',     'paddingBottom']
      },
      'Width': {
        'border':  ['borderLeftWidth', 'borderRightWidth'],
        'margin':  ['marginLeft',      'marginRight'],
        'padding': ['paddingLeft',     'paddingRight']
      }
    },

    i = -1;

    while (++i < 2) (function() {
      var dim = i ? 'Width' : 'Height',

      property = 'offset' + dim,

      STYLE_SUMS = HEIGHT_WIDTH_STYLE_SUMS[dim],

      getSum = function(decorator, name) {
        var styles = STYLE_SUMS[name];
        return (parseFloat(plugin.getStyle.call(decorator, styles[0])) || 0) +
          (parseFloat(plugin.getStyle.call(decorator, styles[1])) || 0);
      },

      getDimension = function getDimension(options) {
        var backup, elemStyle, isGettingSum, result;

        // default to `visual` preset
        if (!options) {
          options = PRESETS.visual;
        }
        else if (options && isString(options)) {
          if (STYLE_SUMS[options]) {
            isGettingSum = true;
          } else {
            options = PRESETS[options];
          }
        }

        // the offsetHeight/offsetWidth properties return 0 on elements
        // with display:none, so show the element temporarily
        if (!plugin.isVisible.call(this)) {
          elemStyle = this.style;
          backup = elemStyle.cssText;
          elemStyle.cssText += ';display:block;visibility:hidden;';

          // exit early when returning style sums
          if (isGettingSum) {
            result = getSum(this, options);
            elemStyle.cssText = backup;
            return fuse.Number(result);
          }
          result = (this.raw || this)[property];
          elemStyle.cssText = backup;
        }
        else if (isGettingSum) {
          return fuse.Number(getSum(this, options));
        }
        else {
          result = (this.raw || this)[property];
        }

        // add margins because they're excluded from the offset values
        if (options.margin) {
          result += getSum(this, 'margin');
        }
        // subtract border and padding because they're included in the offset values
        if (!options.border) {
          result -= getSum(this, 'border');
        }
        if (!options.padding) {
          result -= getSum(this, 'padding');
        }
        return fuse.Number(result);
      };

      plugin['get' + dim] = getDimension;
    })();

    // cleanup
    i = undef;
  })(HTMLElement.plugin);
  /*------------------------- HTML ELEMENT: POSITION -------------------------*/

  (function(plugin) {

    var OFFSET_PARENT_EXIT_BEFORE_NODES = { 'BODY': 1, 'HTML': 1 },

    OFFSET_PARENT_EXIT_ON_NODES = { 'TABLE': 1, 'TD': 1, 'TH': 1 },

    BODY_OFFSETS_INHERIT_ITS_MARGINS = null,

    ELEMENT_COORD_OFFSETS_DONT_INHERIT_ANCESTOR_BORDER_WIDTH = null,

    getDimensions = plugin.getDimensions,

    getFuseId     = Node.getFuseId,

    getHeight     = plugin.getHeight,

    getWidth      = plugin.getWidth,

    getStyle      = plugin.getStyle,

    isDetached    = plugin.isDetached,

    isVisible     = plugin.isVisible,

    ensureLayout  = function(decorator) {
      var element = (decorator.raw || decorator),
       currStyle  = element.currentStyle,
       elemStyle  = element.style,
       zoom       = elemStyle.zoom;

      if (decorator.getStyle('position') == 'static' &&
          !(zoom && zoom != 'normal' || currStyle && currStyle.hasLayout)) {
        elemStyle.zoom = 1;
      }
      return element;
    };


    plugin.makeAbsolute = function makeAbsolute() {
      if (getStyle.call(this, 'position') != 'absolute') {
        var after,
         element   = this.raw || this,
         elemStyle = element.style,
         before    = getDimensions.call(this),
         width     = getWidth.call(this,  'content'),
         height    = getHeight.call(this, 'content'),
         offsets   = plugin.getPositionedOffset.call(this),
         backup    = domData[getFuseId(element)].madeAbsolute = {
           'position':   elemStyle.position,
           'left':       elemStyle.left,
           'top':        elemStyle.top,
           'height':     elemStyle.height,
           'width':      elemStyle.width,
           'marginLeft': elemStyle.marginLeft,
           'marginTop':  elemStyle.marginTop
         };

        elemStyle.position  = 'absolute';
        elemStyle.marginTop = elemStyle.marginLeft = '0';
        elemStyle.top       = offsets.top   + 'px';
        elemStyle.left      = offsets.left  + 'px';
        elemStyle.width     = width         + 'px';
        elemStyle.height    = height        + 'px';

        after = getDimensions.call(this);
        elemStyle.width  = Math.max(0, width  + (before.width  - after.width))  + 'px';
        elemStyle.height = Math.max(0, height + (before.height - after.height)) + 'px';
      }
      return this;
    },

    plugin.undoAbsolute = function undoAbsolute() {
      if (getStyle.call(this, 'position') == 'absolute') {
        var element = this.raw || this,
         data = domData[getFuseId(element)],
         backup = data.madeAbsolute,
         elemStyle = element.style;

        if (!backup) {
          throw new Error('HTMLElement#makeAbsolute must be called first.');
        }
        elemStyle.position   = backup.position;
        elemStyle.left       = backup.left;
        elemStyle.top        = backup.top;
        elemStyle.height     = backup.width;
        elemStyle.width      = backup.height;
        elemStyle.marginLeft = backup.marginLeft;
        elemStyle.marginTop  = backup.marginTop;

        delete data.madeAbsolute;
      }
      return this;
    };

    plugin.makeClipping = function makeClipping() {
      if (getStyle.call(this, 'overflow') != 'hidden') {
        var element = this.raw || this;
        domData[getFuseId(element)].madeClipped = getStyle.call(this, 'overflow') || 'auto';
        element.style.overflow = 'hidden';
      }
      return this;
    };

    plugin.undoClipping = function undoClipping() {
      if (getStyle.call(this, 'overflow') == 'hidden') {
        var element = this.raw || this,
         data = domData[getFuseId(element)],
         overflow = data.madeClipped;

        if (!overflow) {
          throw new Error('HTMLElement#makeClipping must be called first.');
        }
        element.style.overflow = overflow == 'auto' ? '' : overflow;
        delete data.madeClipped;
      }
      return this;
    };

    plugin.makePositioned = function makePositioned() {
      var element = this.raw || this,
       elemStyle = element.style,
       pos = getStyle.call(this, 'position');

      if (!pos || pos == 'static') {
        domData[getFuseId(element)].madePositioned = {
          'position': elemStyle.position,
          'left':     elemStyle.left,
          'top':      elemStyle.top
        };

        // Opera returns the offset relative to the positioning context, when an
        // element is position relative but top and left have not been defined
        elemStyle.top = elemStyle.left = '0';
        elemStyle.position = 'relative';
      }
      return this;
    };

    plugin.undoPositioned = function undoPositioned() {
      if (getStyle.call(this, 'position') == 'relative') {
        var element = this.raw || this,
         data = domData[getFuseId(element)],
         backup = data.madePositioned,
         elemStyle = element.style;

        if (!backup) {
          throw new Error('HTMLElement#makePositioned must be called first.');
        }
        elemStyle.position = backup.position;
        elemStyle.top      = backup.top;
        elemStyle.left     = backup.left;

        delete data.madePositioned;
      }
      return this;
    };

    plugin.clonePosition = function clonePosition(source, options) {
      source  = fuse(source);
      options = fuse.Object.extend({
        'offsetLeft': 0,
        'offsetTop':  0,
        'setLeft':    1,
        'setTop':     1,
        'setWidth':   1,
        'setHeight':  1
      }, options);

      var coord, borderHeight, borderWidth, paddingHeight, paddingWidth,
       elemDisplay, elemOffset, elemPos, elemVis, srcBackup,
       appendCSS           = ';display:block;visibility:hidden;',
       getCumulativeOffset = plugin.getCumulativeOffset,
       elemStyle           = this.style,
       srcStyle            = source.style,
       elemIsHidden        = !isVisible.call(this),
       srcIsHidden         = !isVisible.call(source),
       srcElement          = source.raw || source;

      // attempt to unhide elements to get their styles
      if (srcIsHidden) {
        srcBackup = srcStyle.cssText;
        srcStyle.cssText += appendCSS;
      }

      if (elemIsHidden) {
        // backup individual style properties because we are changing several
        // others and don't want to pave them when the backup is restored
        elemDisplay = elemStyle.display;
        elemVis = elemStyle.visibility;
        elemStyle.cssText += appendCSS;
      }

      // Get element size without border or padding then add
      // the difference between the source and element padding/border
      // to the height and width in an attempt to keep the same dimensions.
      if (options.setHeight) {
        paddingHeight = getHeight.call(source, 'padding');
        borderHeight  = getHeight.call(source, 'border');
        elemStyle.height = Math.max(0,
          (srcElement.offsetHeight - paddingHeight - borderHeight) + // content height
          (paddingHeight - getHeight.call(this, 'padding')) +        // padding diff
          (borderHeight  - getHeight.call(this, 'border'))) + 'px';  // border diff
      }

      if (options.setWidth) {
        paddingWidth = getWidth.call(source, 'padding');
        borderWidth  = getWidth.call(source, 'border');
        elemStyle.width = Math.max(0,
          (srcElement.offsetWidth - paddingWidth - borderWidth)  + // content width
          (paddingWidth - getWidth.call(this, 'padding')) +        // padding diff
          (borderWidth  - getWidth.call(this, 'border'))) + 'px';  // border diff
      }

      if (options.setLeft || options.setTop) {

        elemPos = getStyle.call(this, 'position');

        // clear element coords before getting
        // the getCumulativeOffset because Opera
        // will fumble the calculations if
        // you try to subtract the coords after
        if (options.setLeft) {
          elemStyle.left = elemStyle.marginLeft = '0';
        }
        if (options.setTop){
          elemStyle.top  = elemStyle.marginTop  = '0';
        }

        // if an absolute element is a descendant of the source then
        // calculate its offset to the source and inverse it
        if (elemPos == 'absolute' && plugin.contains.call(source, this)) {
          coord = getCumulativeOffset.call(this, source);
          coord.left *= -1;
          coord.top  *= -1;
        }
        else {
          coord = getCumulativeOffset.call(source);
          if (elemPos == 'relative') {
            // subtract the relative element's offset from the source's offsets
            elemOffset  = getCumulativeOffset.call(this);
            coord.left -= elemOffset.left;
            coord.top  -= elemOffset.top;
          }
        }

        // set position
        if (options.setLeft) {
          elemStyle.left = (coord.left + options.offsetLeft) + 'px';
        }
        if (options.setTop) {
          elemStyle.top  = (coord.top  + options.offsetTop)  + 'px';
        }

        // restore styles
        if (elemIsHidden) {
          elemStyle.display = elemDisplay;
          elemStyle.visibility = elemVis;
        }
        if (srcIsHidden) {
          srcStyle.cssText = srcBackup;
        }
      }

      return this;
    };

    // Follows spec http://www.w3.org/TR/cssom-view/#offset-attributes
    plugin.getOffsetParent = function getOffsetParent() {
      var element = this.raw || this,
       original   = element,
       nodeName   = getNodeName(element);

      if (nodeName == 'AREA') {
        return fromElement(element.parentNode);
      }

      // IE throws an error if the element is not in the document.
      // Many browsers report offsetParent as null if the element's
      // style is display:none.
      if (isDetached.call(this) || element.nodeType == DOCUMENT_NODE ||
          OFFSET_PARENT_EXIT_BEFORE_NODES[nodeName] ||
          !element.offsetParent && getStyle.call(this, 'display') != 'none') {
        return null;
      }

      while (element = element.parentNode) {
        nodeName = getNodeName(element);
        if (OFFSET_PARENT_EXIT_BEFORE_NODES[nodeName]) break;
        if (OFFSET_PARENT_EXIT_ON_NODES[nodeName] ||
            getStyle.call(element, 'position') != 'static') {
          return fromElement(element);
        }
      }
      return fromElement(getDocument(original).body);
    };

    // TODO: overhaul with a thorough solution for finding the correct
    // offsetLeft and offsetTop values
    plugin.getCumulativeOffset = (function() {

      function getCumulativeOffset(ancestor) {
        ancestor = fuse(ancestor);
        var backup, elemStyle, result;
        if (!isElement(ancestor)) ancestor = null;

        ensureLayout(this);

        // offsetLeft/offsetTop properties return 0 on elements
        // with display:none, so show the element temporarily
        if (!plugin.isVisible.call(this)) {
          elemStyle  = this.style;
          backup     = this.cssText;
          elemStyle.cssText += ';display:block;visibility:hidden;';
          result     = getOffset(this, ancestor);
          elemStyle.cssText  = backup;
        }
        else {
          result = getOffset(this, ancestor);
        }

        return result;
      }

      var getOffset = function(element, ancestor) {
        var offsetParent, position, raw, valueT = 0, valueL = 0;
        if (BODY_OFFSETS_INHERIT_ITS_MARGINS === null) {
          BODY_OFFSETS_INHERIT_ITS_MARGINS = envTest('BODY_OFFSETS_INHERIT_ITS_MARGINS');
        }
        if (ELEMENT_COORD_OFFSETS_DONT_INHERIT_ANCESTOR_BORDER_WIDTH === null) {
          ELEMENT_COORD_OFFSETS_DONT_INHERIT_ANCESTOR_BORDER_WIDTH =
            envTest('ELEMENT_COORD_OFFSETS_DONT_INHERIT_ANCESTOR_BORDER_WIDTH');
        }

        do {
          raw = element.raw || element;
          valueT += raw.offsetTop  || 0;
          valueL += raw.offsetLeft || 0;

          offsetParent = plugin.getOffsetParent.call(element);
          position     = getStyle.call(element, 'position');

          if (offsetParent && ELEMENT_COORD_OFFSETS_DONT_INHERIT_ANCESTOR_BORDER_WIDTH) {
            valueT += parseFloat(getStyle.call(offsetParent, 'borderTopWidth'))  || 0;
            valueL += parseFloat(getStyle.call(offsetParent, 'borderLeftWidth')) || 0;
          }
          if (position == 'fixed' || offsetParent && (offsetParent == ancestor ||
             (BODY_OFFSETS_INHERIT_ITS_MARGINS && position == 'absolute' &&
              getNodeName(offsetParent) == 'BODY'))) {
            break;
          }
        } while (element = offsetParent);

        return returnOffset(valueL, valueT);
      };

      if (envTest('ELEMENT_BOUNDING_CLIENT_RECT')) {
        getOffset = (function(__getOffset) {
          return function(element, ancestor) {
            var doc, info, rect, raw, root, scrollEl, valueT, valueL;

            if (ancestor)
              return __getOffset(element, ancestor);

            if (!isDetached.call(element)) {
              raw      = element.raw || element;
              doc      = getDocument(raw);
              info     = fuse._info;
              rect     = raw.getBoundingClientRect();
              root     = doc[info.root.property];
              scrollEl = doc[info.scrollEl.property];

              valueT = Math.round(rect.top)  -
                (root.clientTop  || 0) + (scrollEl.scrollTop  || 0);
              valueL = Math.round(rect.left) -
                (root.clientLeft || 0) + (scrollEl.scrollLeft || 0);
            }
            return returnOffset(valueL, valueT);
          };
        })(getOffset);
      }

      return getCumulativeOffset;
    })();

    plugin.getCumulativeScrollOffset = function getCumulativeScrollOffset(onlyAncestors) {
      var nodeName,
       element  = this.raw || this,
       original = element,
       info     = fuse._info,
       doc      = getDocument(element),
       scrollEl = doc[info.scrollEl.property],
       skipEl   = doc[info[info.scrollEl.nodeName == 'HTML' ? 'body' : 'docEl'].property],
       valueT   = 0,
       valueL   = 0;

       do {
        if (element != skipEl) {
          valueT += element.scrollTop  || 0;
          valueL += element.scrollLeft || 0;

          if (element == scrollEl || getStyle.call(element, 'position') == 'fixed') {
            break;
          }
        }
        element = element.parentNode;
      } while (element && element.nodeType == ELEMENT_NODE);

      if (onlyAncestors || ((nodeName = getNodeName(original)) &&
          nodeName == 'TEXTAREA' || nodeName == 'INPUT')) {
        valueT -= original.scrollTop  || 0;
        valueL -= original.scrollLeft || 0;
      }

      return returnOffset(valueL, valueT);
    };

    plugin.getPositionedOffset = function getPositionedOffset() {
      var element = ensureLayout(this),
       valueT = 0, valueL = 0;

      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = fromElement(element).getOffsetParent();
      } while (element && getNodeName(element.raw) != 'BODY' &&
          element.getStyle('position') == 'static');

      return returnOffset(valueL, valueT);
    },

    plugin.getViewportOffset = (function() {
      var getViewportOffset = function getViewportOffset() {
        var offset = plugin.getCumulativeOffset.call(this),
         scrollOffset = plugin.getCumulativeScrollOffset.call(this, /*onlyAncestors*/ true),
         valueT = offset.top,
         valueL = offset.left;

        // subtract the the scrollOffset totals from the element offset totals.
        valueT -= scrollOffset.top;
        valueL -= scrollOffset.left;
        return returnOffset(valueL, valueT);
      };

      if (envTest('ELEMENT_BOUNDING_CLIENT_RECT')) {
        getViewportOffset = function getViewportOffset() {
          var valueT = 0, valueL = 0;

          if (!isDetached.call(this)) {
            // IE window's upper-left is at 2,2 (pixels) with respect
            // to the true client when not in quirks mode.
            var element = this.raw || this,
             doc  = getDocument(element),
             rect = element.getBoundingClientRect(),
             root = doc[fuse._info.root.property];

            valueT = Math.round(rect.top)  - (root.clientTop  || 0);
            valueL = Math.round(rect.left) - (root.clientLeft || 0);
          }
          return returnOffset(valueL, valueT);
        };
      }

      return getViewportOffset;
    })();

    plugin.scrollTo = function scrollTo() {
      var pos = plugin.getCumulativeOffset.call(this);
      window.scrollTo(pos[0], pos[1]);
      return this;
    };

    // prevent JScript bug with named function expressions
    var makeAbsolute =           null,
     clonePosition =             null,
     getCumulativeScrollOffset = null,
     getOffsetParent =           null,
     getPositionedOffset =       null,
     makeClipping =              null,
     makePositioned =            null,
     scrollTo =                  null,
     undoAbsolute =              null,
     undoClipping =              null,
     undoPositioned =            null;
  })(HTMLElement.plugin);
  /*------------------------ HTML ELEMENT: TRAVERSAL -------------------------*/

  (function(plugin) {
    // support W3C ElementTraversal interface
    var FIRST_NODE = 'firstChild',

    LAST_NODE      = 'lastChild',

    NEXT_NODE      = 'nextSibling',

    PREV_NODE      = 'previousSibling',

    NEXT_ELEMENT   = 'nextElementSibling',

    PREV_ELEMENT   = 'previousElementSibling',

    getSome = function(element, property, count, selectors, thisArg) {
      var isSingle, match, result = null, i = 0;
      if (!element) return result;

      if (toString.call(count) != NUMBER_CLASS) {
        selectors = count;
        count = null;
      }
      if (!(isSingle = count == null)) {
        if (count < 1) count = 1;
        result = NodeList();
      }

      // handle when a callback and optional thisArg is passed
      // callback = selectors;
      if (typeof selectors == 'function') {
        // handle returning first match
        if (isSingle) {
          do {
            if (element.nodeType == ELEMENT_NODE && selectors.call(thisArg, element))
              return fromElement(element);
          } while (element = element[property]);
        }
        // handle returning a number of matches
        else {
          do {
            if (element.nodeType == ELEMENT_NODE && selectors.call(count, element))
              result[i++] = fromElement(element);
          } while (i < count && (element = element[property]));
        }
      }
      else {
        // handle no arguments
        if (selectors == null) {
          // handle returning first match
          if (isSingle) {
            do {
              if (element.nodeType == ELEMENT_NODE)
                return fromElement(element);
            } while (element = element[property]);
          }
          // handle returning a number of matches
          else {
            do {
              if (element.nodeType == ELEMENT_NODE)
                result[i++] = fromElement(element);
            } while (i < count && (element = element[property]));
          }
        }
        // handle when selectors are passed
        else if (isString(selectors)) {
          // handle returning first match
          match = fuse.dom.selector.match;
          if (isSingle) {
            do {
              if (element.nodeType == ELEMENT_NODE && match(element, selectors))
                return fromElement(element);
            } while (element = element[property]);
          }
          // handle returning a number of matches
          else {
            do {
              if (element.nodeType == ELEMENT_NODE &&
                  match(element, selectors))
                result[i++] = fromElement(element);
            } while (i < count && (element = element[property]));
          }
        }
      }
      return result;
    };

    if (isHostType(fuse._docEl, NEXT_ELEMENT) &&
        isHostType(fuse._docEl, PREV_ELEMENT)) {
      NEXT_NODE  = NEXT_ELEMENT;
      PREV_NODE  = PREV_ELEMENT;
      FIRST_NODE = 'firstElementChild';
      LAST_NODE  = 'lastElementChild';
    }

    /*------------------------------------------------------------------------*/

    plugin.getChildren = function getChildren(selectors) {
      var element = (this.raw || this)[FIRST_NODE];
      while (element && element.nodeType != ELEMENT_NODE) {
        element = element[NEXT_NODE];
      }
      if (!element) {
        return NodeList();
      }

      element = fromElement(element);
      return !selectors || selectors == '' ||
          selectors && fuse.dom.selector.match(element, selectors)
        ? concatList(NodeList(element), plugin.getNextSiblings.call(element, selectors))
        : plugin.getNextSiblings.call(element, selectors);
    };

    plugin.getSiblings = function getSiblings(selectors) {
      var match, element = this.raw || this, i = 0,
       original = element, result = NodeList();

      if (element = element[PARENT_NODE]) {
        element = element[FIRST_NODE];
        if (selectors && selectors.length) {
          match = fuse.dom.selector.match;
          do {
            if (element.nodeType == ELEMENT_NODE &&
                element !== original && match(element, selectors))
              result[i++] = fromElement(element);
          } while (element = element[NEXT_NODE]);
        } else {
          do {
            if (element.nodeType == ELEMENT_NODE && element != original)
              result[i++] = fromElement(element);
          } while (element = element[NEXT_NODE]);
        }
      }
      return result;
    };

    plugin.down = function down(count, selectors, thisArg) {
      var isSingle, match, node, nodes, result = null, i = 0, j = 0,
       element = this.raw || this;

      if (toString.call(count) != NUMBER_CLASS) {
        selectors = count;
        count = null;
      }
      if (!(isSingle = count == null)) {
        if (count < 1) count = 1;
        result = NodeList();
      }
      if (!(isSingle && selectors == null)) {
        nodes = element.getElementsByTagName('*');
      }

      // handle when a callback and optional thisArg is passed
      // callback = selectors;
      if (typeof selectors == 'function') {
        // handle returning first match
        if (isSingle) {
          while (node = nodes[i++]) {
            if (node.nodeType == ELEMENT_NODE && selectors.call(thisArg, node))
              return fromElement(node);
          }
        }
        // handle returning a number of matches
        else {
          while (j < count && (node = nodes[i++])) {
            if (node.nodeType == ELEMENT_NODE && selectors.call(count, node))
              result[j++] = fromElement(node);
          }
        }
      }
      else {
        // handle no arguments
        if (selectors == null) {
          // handle returning first match
          if (isSingle) {
            return plugin.first.call(this);
          }
          // handle returning a number of matches
          while (j < count && (node = nodes[i++])) {
            if (node.nodeType == ELEMENT_NODE)
              result[j++] = fromElement(node);
          }
        }
        // handle when selectors are passed
        else if (isString(selectors)) {
          // handle returning first match
          match = fuse.dom.selector.match;
          if (isSingle) {
            while (node = nodes[i++]) {
              if (node.nodeType == ELEMENT_NODE && match(node, selectors))
                return fromElement(node);
            }
          }
          // handle returning a number of matches
          else {
            while (j < count && (node = nodes[i++])) {
              if (node.nodeType == ELEMENT_NODE && match(node, selectors))
                result[j++] = fromElement(node);
            }
          }
        }
      }
      return result;
    };

    plugin.next = function next(count, selectors, thisArg) {
      return getSome((this.raw || this)[NEXT_NODE], NEXT_NODE, count, selectors, thisArg);
    };

    plugin.previous = function previous(count, selectors, thisArg) {
      return getSome((this.raw || this)[PREV_NODE], PREV_NODE, count, selectors, thisArg);
    };

    plugin.up = function up(count, selectors, thisArg) {
      return getSome((this.raw || this)[PARENT_NODE], PARENT_NODE, count, selectors, thisArg);
    };

    plugin.first = function first(count, selectors, thisArg) {
      return getSome((this.raw || this)[FIRST_NODE], NEXT_NODE, count, selectors, thisArg);
    };

    plugin.last = function last(count, selectors, thisArg) {
      return getSome((this.raw || this)[LAST_NODE], PREV_NODE, count, selectors, thisArg);
    };

    plugin.getAncestors = function getAncestors(selectors, thisArg) {
      return getSome((this.raw || this)[PARENT_NODE], PARENT_NODE, Infinity, selectors, thisArg) || NodeList();
    };

    plugin.getDescendants = function getDescendants(selectors, thisArg) {
      return plugin.down.call(this, Infinity, selectors, thisArg);
    };

    plugin.getNextSiblings = function getNextSiblings(selectors, thisArg) {
      return getSome((this.raw || this)[NEXT_NODE], NEXT_NODE, Infinity, selectors, thisArg) || NodeList();
    };

    plugin.getPreviousSiblings = function getPreviousSiblings(selectors, thisArg) {
      return getSome((this.raw || this)[PREV_NODE], PREV_NODE, Infinity, selectors, thisArg) || NodeList();
    };

    // prevent JScript bug with named function expressions
    var down =             null,
     first =               null,
     getAncestors =        null,
     getChildren =         null,
     getDescendants =      null,
     getNextSiblings =     null,
     getPreviousSiblings = null,
     getSiblings =         null,
     last =                null,
     next =                null,
     previous =            null,
     up =                  null;
  })(Element.plugin);

  /*--------------------------------------------------------------------------*/

  Element.plugin.contains = (function() {
    var contains = function contains(descendant) {
      if (descendant = fuse(descendant)) {
        var element = this.raw || this;
        descendant = descendant.raw || descendant;
        while (descendant = descendant[PARENT_NODE])
          if (descendant == element) return true;
      }
      return false;
    };

    if (envTest('ELEMENT_COMPARE_DOCUMENT_POSITION')) {
      contains = function contains(descendant) {
        /* DOCUMENT_POSITION_CONTAINS = 0x08 */
        if (descendant = fuse(descendant)) {
          var element = this.raw || this;
          return ((descendant.raw || descendant)
            .compareDocumentPosition(element) & 8) == 8;
        }
        return false;
      };
    }
    else if (envTest('ELEMENT_CONTAINS')) {
      var __contains = contains;
      contains = function contains(descendant) {
        if (this.nodeType != ELEMENT_NODE)
          return __contains.call(this, descendant);

        descendant = fuse(descendant);
        var descendantElem = descendant.raw || descendant,
         element = this.raw || this;

        return element != descendantElem && element.contains(descendantElem);
      };
    }
    return contains;
  })();

  /*------------------------------ FORM: FIELD -------------------------------*/

  (function() {
    var buttonPlugin = CONTROL_PLUGINS.BUTTON,

    inputPlugin = CONTROL_PLUGINS.INPUT,

    optionPlugin = CONTROL_PLUGINS.OPTION,

    selectPlugin = CONTROL_PLUGINS.SELECT,

    textAreaPlugin = CONTROL_PLUGINS.TEXTAREA,

    getOptionValue = function getValue() {
      return fuse.String((this.raw || this)[optionPlugin.hasAttribute.call(this, 'value')
        ? 'value'
        : 'text'] || '');
    };


    /* define common field class methods */

    selectPlugin.initialize = function initialize() {
      this.options = this.raw.options;
    };

    buttonPlugin.activate =
    selectPlugin.activate = function activate() {
      try { (this.raw || this).focus(); } catch(e) { }
      return this;
    };

    inputPlugin.activate =
    textAreaPlugin.activate = function activate() {
      var element = this.raw || this;
      try { element.focus(); } catch(e) { }
      if (element.select && !INPUT_BUTTONS[element.type]) {
        element.select();
      }
      return this;
    };

    selectPlugin.clear =
    textAreaPlugin.clear = function clear() {
      return CONTROL_PLUGINS[getNodeName(this.raw || this)].setValue.call(this, null);
    };

    inputPlugin.clear = function clear() {
      var element = this.raw || this, type = element.type;
      if (CHECKED_INPUT_TYPES[type]) {
        element.checked = false;
      } else if (!INPUT_BUTTONS[type]) {
        CONTROL_PLUGINS[getNodeName(element)].setValue.call(this, null);
      }
      return this;
    };

    buttonPlugin.disable =
    inputPlugin.disable =
    selectPlugin.disable =
    textAreaPlugin.disable = function disable() {
      (this.raw || this).disabled = true;
      return this;
    };

    buttonPlugin.enable =
    inputPlugin.enable =
    selectPlugin.enable =
    textAreaPlugin.enable = function enable() {
      (this.raw || this).disabled = false;
      return this;
    };

    buttonPlugin.focus =
    inputPlugin.focus =
    selectPlugin.focus =
    textAreaPlugin.focus = function focus() {
      // avoid IE errors when element or ancestors are not rendered
      try { (this.raw || this).focus(); } catch(e) { }
      return this;
    };

    inputPlugin.present =
    textAreaPlugin.present = function present() {
      return !!(this.raw || this).value;
    };

    buttonPlugin.serialize =
    inputPlugin.serialize =
    textAreaPlugin.serialize = function serialize() {
      var pair, name, nodeName, element = this.raw || this;
      if (element.disabled || !(name = element.name)) {
        return fuse.String('');
      }
      pair = { };
      pair[name] = CONTROL_PLUGINS[getNodeName(element)].getValue.call(this);
      return fuse.Object.toQueryString(pair);
    };

    selectPlugin.serialize = function serialize() {
      var value, pair, name, nodeName, element = this.raw || this;
      if (element.disabled || !(name = element.name) ||
          element.selectedIndex == -1) {
        return fuse.String('');
      }
      value = selectPlugin.getValue.call(this);
      if (isArray(value) && value.length < 2) {
        value = value[0];
      }
      pair = { };
      pair[name] = value;
      return fuse.Object.toQueryString(pair);
    };

    inputPlugin.select =
    textAreaPlugin.select = function select() {
      (this.raw || this).select();
      return this;
    };


    /* define getValue/setValue for each field class */

    buttonPlugin.getValue =
    textAreaPlugin.getValue = function getValue() {
      return fuse.String((this.raw || this).value || '');
    };

    inputPlugin.getValue = function getValue() {
      var element = this.raw || this,
        fallback = CHECKED_INPUT_TYPES[element.type] ? 'on' : '';
      return fuse.String(element.value || fallback);
    };

    buttonPlugin.setValue =
    inputPlugin.setValue =
    optionPlugin.setValue =
    textAreaPlugin.setValue = function setValue(value) {
      (this.raw || this).value = value || '';
      return this;
    };

    selectPlugin.getValue = function getValue() {
      var i, node, result, element = this.raw || this;
      if (element.type == 'select-one') {
        var index = element.selectedIndex;
        if (index > -1) result = getOptionValue.call(element.options[index]);
      }
      else if (element.options.length) {
        result = fuse.Array(); i = 0;
        while (node = element.options[i++]) {
          if (node.selected) result.push(getOptionValue.call(node));
        }
      }
      else {
        result = fuse.String('');
      }
      return result;
    };

    selectPlugin.setValue = function setValue(value) {
      var node, i = -1, element = this.raw || this;
      if (value === null) {
        element.selectedIndex = -1;
      }
      else if (isArray(value)) {
        // quick indexOf
        value = uid + value.join(uid) + uid;
        while (node = element.options[++i]) {
          node.selected = value.indexOf(uid + getOptionValue.call(node) + uid) > -1;
        }
      }
      else {
        value = String(value);
        while (node = element.options[++i]) {
          if (getOptionValue.call(node) == value) {
            node.selected = true;
            break;
          }
        }
      }
      return this;
    };

    optionPlugin.getValue = getOptionValue;

    // handle IE6/7 bug with button elements
    if (envTest('BUTTON_VALUE_CHANGES_AFFECT_INNER_CONTENT')) {
      buttonPlugin.getValue = function getValue() {
        return buttonPlugin.getAttribute.call(this, 'value');
      };

      buttonPlugin.setValue = function setValue(value) {
        return buttonPlugin.setAttribute.call(this, 'value', value);
      };
    }

    // prevent JScript bug with named function expressions
    var initialize = null,
     activate =      null,
     clear =         null,
     disable =       null,
     enable =        null,
     focus =         null,
     getValue =      null,
     present =       null,
     select =        null,
     setValue =      null,
     serialize =     null;
  })();
  /*---------------------------------- FORM ----------------------------------*/

  (function(plugin) {

    var Obj = fuse.Object,

    CONTROL_NODE_NAMES = { 'BUTTON': 1, 'INPUT': 1, 'SELECT': 1, 'TEXTAREA': 1 },

    SKIPPED_INPUT_TYPES = { 'file': 1, 'reset': 1 },

    eachElement = function(element, callback) {
      var node, i = 0,
       nodes = (element.raw || element).getElementsByTagName('*');

      if (node = nodes[0]) {
        do {
          CONTROL_NODE_NAMES[getNodeName(node)] && callback(node);
        } while (node = nodes[++i]);
      }
    };

    plugin.initialize = function initialize() {
      this.options = this.raw.options;
    };

    plugin.disable = function disable() {
      eachElement(this, function(node) { node.disabled = true; });
      return this;
    };

    plugin.enable = function enable() {
      eachElement(this, function(node) { node.disabled = false; });
      return this;
    };

    plugin.getFirstControl = function getFirstControl() {
      var firstByIndex, result, tabIndex,
       firstNode = null, minTabIndex = Infinity;

      eachElement(this, function(node) {
        if (node.type != 'hidden' && !node.disabled) {
          if (!firstNode) {
            firstNode = node;
          }
          if ((tabIndex = node.tabIndex) > -1 && tabIndex < minTabIndex) {
            minTabIndex  = tabIndex;
            firstByIndex = node;
          }
        }
      });

      result = firstByIndex || firstNode;
      return result && fromElement(result);
    };

    plugin.focusFirstControl = function focusFirstControl() {
      var element = plugin.getFirstControl.call(this);
      if (element) {
        try { (element.raw || element).focus(); } catch(e) { }
      }
      return this;
    };

    plugin.getControls = function getControls() {
      var node, result = NodeList(), i = 0, j = -1,
       nodes = (this.raw || this).getElementsByTagName('*');

      if (node = nodes[0]) {
        do {
          if (CONTROL_NODE_NAMES[node.nodeName.toUpperCase()])
            result[++j] = fromElement(node);
        } while (node = nodes[++i]);
      }
      return result;
    };

    plugin.getInputs = function getInputs(typeName, name) {
      typeName = String(typeName || '');
      name = String(typeName || '');

      var input, inputs = (this.raw || this).getElementsByTagName('input'),
       result = NodeList(), i = -1, j = i;

      if (!typeName && !name) {
        while (input = inputs[++i]) {
          result[i] = fromElement(input);
        }
      }
      else if (typeName && !name) {
        while (input = inputs[++i]) {
          if (typeName == input.type)
            result[++j] = fromElement(input);
        }
      }
      else {
        while (input = inputs[++i]) {
          if ((!typeName || typeName == input.type) && (!name || name == input.name))
            result[++j] = fromElement(input);
        }
      }
      return result;
    };

    plugin.request = function request(options) {
      options = Obj.clone(options);
      var params = options.parameters, submit = options.submit;

      delete options.submit;
      options.parameters = plugin.serialize.call(this, { 'submit':submit, 'hash':true });

      if (params) {
        if (isString(params)) params = fuse.String.toQueryParams(params);
        Obj.extend(options.parameters, params);
      }
      if (plugin.hasAttribute.call(this, 'method') && !options.method) {
        options.method = plugin.getAttribute.call(this, 'method');
      }
      return fuse.ajax.Request(plugin.getAttribute.call(this, 'action'), options);
    };

    plugin.reset = function reset() {
      (this.raw || this).reset();
      return this;
    };

    plugin.serialize = function serialize(options) {
      return plugin.serializeElements.call(this, null, options);
    };

    plugin.serializeElements = function serializeElements(elements, options) {
      if (typeof options != 'object') {
        options = { 'hash': !!options };
      } else if (typeof options.hash == 'undefined') {
        options.hash = true;
      }

      var isImageType, isSubmitButton, key, nodeName, prefix,
       submitSerialized, type, value, i = 0,
       element     = this.raw || this,
       checkString = !!elements,
       doc         = getDocument(element),
       result      = Obj(),
       submit      = options.submit;

      if (submit && submit.raw) {
        submit = submit.raw;
      }
      if (!elements) {
        elements = element.getElementsByTagName('*');
      }
      if (!elements.length) {
        elements = [element];
      }
      if (element = elements[0]) {
        do {
          // avoid checking for element ids if we are iterating the default nodeList
          if (checkString && isString(element) &&
             !(element = doc.getElementById(element))) {
            continue;
          } else {
            element = element.raw || element;
          }

          // skip if not a form control
          nodeName = getNodeName(element);
          if (!CONTROL_NODE_NAMES[nodeName]) {
            continue;
          }

          key            = element.name;
          type           = element.type;
          isImageType    = type == 'image';
          isSubmitButton = type == 'submit' || isImageType;

          if (element.disabled ||                                         // skip disabled
              SKIPPED_INPUT_TYPES[type] ||                                // skip file/reset controls
              CHECKED_INPUT_TYPES[type] && !element.checked ||            // skip unchecked
              nodeName === 'SELECT' && element.selectedIndex === -1 ||    // skip unselected
              (isSubmitButton && (submit === false || submitSerialized || // skip non-active submit buttons
                (submit && !(key == submit || element == submit))))) {
            continue;
          }

          if (isSubmitButton) {
            submitSerialized = true;
            if (isImageType) {
              var prefix = key ? key + '.' : '',
               x = options.x || 0, y = options.y || 0;
              result[prefix + 'x'] = x;
              result[prefix + 'y'] = y;
            }
          }
          // skip unnamed
          if (!key) {
            continue;
          }

          value = CONTROL_PLUGINS[nodeName].getValue.call(element);
          if (isArray(value) && value.length < 2) {
            value = value[0];
          }

          // property exists and and belongs to result
          if (hasKey(result, key)) {
            // a key is already present; construct an array of values
            if (!isArray(result[key])) result[key] = [result[key]];
            result[key].push(value);
          } else {
            result[key] = value;
          }
        }
        while (element = elements[++i]);
      }

      return options.hash
        ? result
        : Obj.toQueryString(result);
    };

    // prevent JScript bug with named function expressions
    var initialize =     null,
     disable =           null,
     enable =            null,
     getFirstControl =   null,
     focusFirstControl = null,
     getControls =       null,
     getInputs =         null,
     request =           null,
     reset =             null,
     serializeElements = null,
     serialize =         null;
  })(HTMLFormElement.plugin);
  /*-------------------------- FORM: EVENT OBSERVER --------------------------*/

  (function() {
    var BaseEventObserver = fuse.Class(function() {
      var BaseEventObserver = function BaseEventObserver(element, callback) {
        var member, name, i = -1,
         eventObserver = this, onElementEvent = this.onElementEvent;

        element =
        this.element = fuse(element);

        this.onElementEvent = function(event) {
          onElementEvent.call(eventObserver, event);
        };

        element = element.raw || element;
        if (getNodeName(element) == 'FORM') {
          return this.registerFormCallbacks();
        }

        name = element.name;
        this.group =
          (name && fuse.query(element.nodeName +
          '[name="' + name + '"]', getDocument(element)).get()) ||
          NodeList(fuse(element));

        this.callback = callback;
        this.lastValue = this.getValue();

        while (member = this.group[++i]) {
          this.registerCallback(member);
        }
        return this;
      },

      onElementEvent = function onElementEvent(event) {
        var value = this.getValue();
        if (String(this.lastValue) != String(value)) {
          this.callback(this.element, value, event);
          this.lastValue = value;
        }
      },

      registerCallback = function registerCallback(element) {
        var type, decorator = fuse(element);
        element = decorator.raw || decorator;
        if (type = element.type) {
          decorator.observe(CHECKED_INPUT_TYPES[type] ? 'click' : 'change',
            this.onElementEvent);
        }
      },

      registerFormCallbacks = function registerFormCallbacks() {
        var element, elements = this.element.getControls(), i= 0;
        while (element = elements[i++]) this.registerCallback(element);
      };

      return {
        'constructor': BaseEventObserver,
        'onElementEvent': onElementEvent,
        'registerCallback': registerCallback,
        'registerFormCallbacks': registerFormCallbacks
      };
    });

    /*------------------------------------------------------------------------*/

    HTMLInputElement.EventObserver = (function() {
      var Klass = function() { },

      FieldEventObserver = function FieldEventObserver(element, callback) {
        return BaseEventObserver.call(new Klass, element, callback);
      };

      fuse.Class(BaseEventObserver, { 'constructor': FieldEventObserver });
      Klass.prototype = FieldEventObserver.plugin;
      return FieldEventObserver;
    })();

    HTMLInputElement.EventObserver.plugin.getValue = function getValue() {
      var element, member, value, i = -1;
      if (this.group.length == 1) {
        return this.element.getValue();
      }
      while (member = this.group[++i]) {
        element = member.raw || member;
        if (CHECKED_INPUT_TYPES[element.type]) {
          if (element.checked) {
            return member.getValue();
          }
        } else if (value = member.getValue()) {
          return value;
        }
      }
    };

    HTMLFormElement.EventObserver = (function() {
      var Klass = function() { },

      FormEventObserver = function FormEventObserver(element, callback) {
        return BaseEventObserver.call(new Klass, element, callback);
      };

      fuse.Class(BaseEventObserver, { 'constructor': FormEventObserver });
      Klass.prototype = FormEventObserver.plugin;
      return FormEventObserver;
    })();

    HTMLFormElement.EventObserver.plugin.getValue = function getValue() {
      return this.element.serialize();
    };

    // prevent JScript bug with named function expressions
    var getValue = null;
  })();
  /*-------------------------- FORM: TIMED OBSERVER --------------------------*/

  (function() {
    var BaseTimedObserver = fuse.Class(fuse.Timer, function() {
      var BaseTimedObserver = function BaseTimedObserver(element, callback, interval, options) {
        // this._super() equivalent
        fuse.Timer.call(this, callback, interval, options);

        this.element = fuse(element);
        this.lastValue = this.getValue();
        this.start();
        return this;
      },

      execute = function execute() {
        var value = this.getValue();
        if (String(this.lastValue) != String(value)) {
          this.callback(this.element, value);
          this.lastValue = value;
        }
      };

      return { 'constructor': BaseTimedObserver, 'execute': execute };
    });

    /*------------------------------------------------------------------------*/

    HTMLInputElement.Observer =
    HTMLInputElement.TimedObserver = (function() {
      var Klass = function() { },

      FieldTimedObserver = function FieldTimedObserver(element, callback, interval, options) {
        return BaseTimedObserver.call(new Klass, element, callback, interval, options);
      };

      fuse.Class(BaseTimedObserver, { 'constructor': FieldTimedObserver });
      Klass.prototype = FieldTimedObserver.plugin;
      return FieldTimedObserver;
    })();

    HTMLInputElement.Observer.plugin.getValue = function getValue() {
      return this.element.getValue();
    };

    HTMLFormElement.Observer =
    HTMLFormElement.TimedObserver = (function() {
      var Klass = function() { },

      FormTimedObserver = function FormTimedObserver(element, callback, interval, options) {
        return BaseTimedObserver.call(new Klass, element, callback, interval, options);
      };

      fuse.Class(BaseTimedObserver, { 'constructor': FormTimedObserver });
      Klass.prototype = FormTimedObserver.plugin;
      return FormTimedObserver;
    })();

    HTMLFormElement.Observer.plugin.getValue = function getValue() {
      return this.element.serialize();
    };

    // prevent JScript bug with named function expressions
    var getValue = null;
  })();

  /*----------------------------- DOM: NODELIST ------------------------------*/

  NodeList =
  fuse.dom.NodeList = fuse.Fusebox().Array;

  addNodeListMethod = (function(plugin) {

    var SKIPPED_KEYS = { 'callSuper': 1, 'constructor': 1, 'match': 1, 'query': 1 },
     domClassCache   = { },
     reBool          = /^(?:(?:is|has)[A-Z]|contains$)/,
     reGetter        = /^(?:(?:get|read)[A-Z]|(?:(?:down|first|identify|inspect|last|next|previous)$))/,
     reMod           = /^(?:update|replace|(?:append|prepend)(?:Child|Sibling)(?:To)?)$/,
     reScript        = /<script[\x20\t\n\r>]/i,
     arrEach         = ['for(;i<l;i++){if(e=es[i]){', '}}'],
     arrEvery        = ['for(;i<l;i++){if((e=es[i])&&!(', '))return false}return true'],
     arrSome         = ['for(;i<l;i++){if((e=es[i])&&(', '))return true}return false'];

    return function(value, key, object) {
      var snippet, arrMethod = reBool.test(key) ?
        (key.indexOf('is') ? arrSome : arrEvery) : arrEach;

      if (!SKIPPED_KEYS[key] && hasKey(object, key) && isFunction(value)) {
        if (reGetter.test(key)) {
          // getters return the value of the first element
          plugin[key] = Function('c,gc',
            'function ' + key + '(){' +
            'var m,n,e=this[0];' +
            'if(e){' +
            'm=(c[n=e.nodeName]||(c[n]=gc(n))).plugin.' + key + ';' +
            'return m&&(arguments.length?m.apply(e,arguments):m.call(e))' +
            '}}return ' + key)(domClassCache, getOrCreateTagClass);
        }
        else if (reMod.test(key)) {
          // when a html string is used with dom modification methods convert it
          // to an element/fragment once and clone it instead of converting it
          // for each iteration
          snippet = 'p=(c[n=e.nodeName]||(c[n]=gc(n))).plugin;m=p.' + key + ';m&&m.call(e,';

          plugin[key] = Function('c,gc,gf,re',
            'function ' + key + '(s,o){' +
            'var e,m,n,p,es=this,l=es.length,i=0,x={events:1,deep:1};' +
            'if((s||s=="0")&&!s.nodeType&&!re.test(s)){' +
            's=gf(s);' +
            arrMethod[0] + snippet + 's.cloneNode(true),o)' + arrMethod[1] +
            '}else{' +
            arrMethod[0] + snippet + 'p.clone.call(s,x),o)' + arrMethod[1] +
            '}return es' +
            '}return ' + key)(domClassCache, getOrCreateTagClass, getFragmentFromHTML, reScript);
        }
        else {
          // return true for methods prefixed with `is` when all return true OR
          // return true for methods prefixed with `has`/`contains` when some return true OR
          // return the array after executing a method for all elements
          snippet = '(m=(c[n=e.nodeName]||(c[n]=gc(n))).plugin.' + key + ')&&m.';

          plugin[key] = Function('c,gc',
            'function ' + key + '(){' +
            'var e,m,n,es=this,l=es.length,i=0;' +
            'if(arguments.length){' +
            arrMethod[0] + snippet + 'apply(e,arguments)' + arrMethod[1] +
            '}else{' +
            arrMethod[0] + snippet + 'call(e)' + arrMethod[1] +
            '}return es' +
            '}return ' + key)(domClassCache, getOrCreateTagClass);
        }
      }
    };
  })(NodeList.plugin);

  /*--------------------------------------------------------------------------*/

  (function(plugin) {
    var elemPlugin = fuse.dom.HTMLElement.plugin,
     funcPlugin    = fuse.Function.plugin,
     funcApply     = funcPlugin.apply,
     funcCall      = funcPlugin.call;

    plugin.get = function get(index) {
      var result, object = Object(this), length = object.length >>> 0;
      if (index == null) {
        result = NodeList();
        for (index = 0; index < length; index++) {
          if (index in object) result[index] = Node(object[index]);
        }
        return result;
      }

      if (index < 0) {
        if ((index += length) < 0) index = 0;
      } else if (index > (length && --length)) {
        index = length;
      }
      return Node(object[index]);
    };

    plugin.invoke = function invoke(method) {
      var args, item, i = 0, result = fuse.Array(),
       object = Object(this), length = object.length >>> 0;

      if (arguments.length < 2) {
        while (length--) {
          if (length in object) {
            result[length] = funcCall
              .call(elemPlugin[method] || object[length][method], object[length]);
          }
        }
      } else {
        args = slice.call(arguments, 1);
        while (length--) {
          if (length in object) {
            result[length] = funcApply
              .call(elemPlugin[method] || object[length][method], object[length], args);
          }
        }
      }
      return result;
    }

    // prevent JScript bug with named function expressions
    var get = null, invoke = null;
  })(NodeList.plugin);
  /*--------------------------- ELEMENT: SELECTOR ----------------------------*/

  fuse.addNS('dom.selector');

  (function(docPlugin, elemPlugin) {
    docPlugin.match  =
    elemPlugin.match = function match(selectors) {
      return isString(selectors)
        ? fuse.dom.selector.match(this, selectors)
        : selectors.match(this);
    };

    docPlugin.query  =
    elemPlugin.query = function query(selectors, callback) {
      return fuse.dom.selector.select(selectors, this, callback);
    };

    fuse.query = function query(selectors, context, callback) {
      if (typeof context === 'function') {
        callback = context; context = null;
      }
      return fuse.dom.selector.select(selectors, context, callback);
    };

    // prevent JScript bug with named function expressions
    var match = null, query = null;
  })(HTMLDocument.plugin, Element.plugin);
  /*--------------------------- SELECTOR: NWMATCHER --------------------------*/

  fuse._engine = window.NW;

/*
 * Copyright (C) 2007-2010 Diego Perini
 * All rights reserved.
 *
 * nwmatcher.js - A fast CSS selector engine and matcher
 *
 * Author: Diego Perini <diego.perini at gmail com>
 * Version: 1.2.3
 * Created: 20070722
 * Release: 20100901
 *
 * License:
 *  http://javascript.nwbox.com/NWMatcher/MIT-LICENSE
 * Download:
 *  http://javascript.nwbox.com/NWMatcher/nwmatcher.js
 */

(function(global) {

  var version = 'nwmatcher-1.2.3',

  // processing context
  doc = global.document,

  // context root element
  root = doc.documentElement,

  // save method reference
  slice = Array.prototype.slice,

  // persist last selector/matcher parsing data
  lastError = '',
  lastSlice = '',
  lastMatcher = '',
  lastSelector = '',
  isSingleMatch = false,
  isSingleSelect = false,

  // initialize selector/matcher loading context
  lastMatchContext = doc,
  lastSelectContext = doc,

  // prefixes identifying id, class & pseudo-class
  prefixes = '[.:#]?',

  // attributes operators
  // ! invalid but compat !
  operators = '([~*^$|!]?={1})',

  // whitespace characters
  whitespace = '[\\x20\\t\\n\\r\\f]*',

  // 4 combinators F E, F>E, F+E, F~E
  combinators = '[\\x20]|[>+~][^>+~]',

  // an+b format params for psuedo-classes
  pseudoparms = '[-+]?\\d*n?[-+]?\\d*',

  // CSS quoted string values
  quotedvalue = '"[^"]*"' + "|'[^']*'",

  // http://www.w3.org/TR/css3-syntax/#characters
  // unicode/ISO 10646 characters 161 and higher
  // NOTE: Safari 2.0.x crashes with escaped (\\)
  // Unicode ranges in regular expressions so we
  // use a negated character range class instead
  encoding = '(?:[-\\w]|[^\\x00-\\xa0]|\\\\.)+',

  // CSS identifier syntax
  identifier = '(?:-?[_a-zA-Z]{1}[-\\w]*|[^\\x00-\\xa0]+|\\\\.+)+',

  // build attribute string
  attributes =
    whitespace + '(' + encoding + ':?' + encoding + ')' +
    whitespace + '(?:' + operators + whitespace + '(' +
    quotedvalue + '|' + identifier + '))?' + whitespace,

  // build pseudoclass string
  pseudoclass = '((?:' +
    // an+b parameters or quoted string
    pseudoparms + '|' + quotedvalue + '|' +
    // id, class, pseudo-class selector
    prefixes + '|' + encoding + '|' +
    // nested HTML attribute selector
    '\\[' + attributes + '\\]|' +
    // nested pseudo-class selector
    '\\(.+\\)|' + whitespace + '|' +
    // nested pseudos/separators
    ',)+)',

  // placeholder for extensions
  extensions = '.+',

  // CSS3: syntax scanner and
  // one pass validation only
  // using regular expression
  standardValidator =
    // discard start
    '(?=\s*[^>+~(){}<>])' +
    // open match group
    '(' +
    //universal selector
    '\\*' +
    // id/class/tag/pseudo-class identifier
    '|(?:' + prefixes + identifier + ')' +
    // combinator selector
    '|' + combinators +
    // HTML attribute selector
    '|\\[' + attributes + '\\]' +
    // pseudo-classes parameters
    '|\\(' + pseudoclass + '\\)' +
    // dom properties selector (extension)
    '|\\{' + extensions + '\\}' +
    // selector group separator (comma)
    '|,' +
    // close match group
    ')+',

  // validator for standard selectors as default
  reValidator = new RegExp(standardValidator, 'g'),

  // validator for complex selectors in ':not()' pseudo-classes
  extendedValidator = standardValidator.replace(pseudoclass, '.*'),

  // whitespace is any combination of these 5 character [\x20\t\n\r\f]
  // http://www.w3.org/TR/css3-selectors/#selector-syntax
  reTrimSpaces = new RegExp('^' +
    whitespace + '|' + whitespace + '$', 'g'),

  // only allow simple selectors nested in ':not()' pseudo-classes
  reSimpleNot = new RegExp('^(' +
    '(?!:not)' +
    '(' + prefixes +
    '|' + identifier +
    '|\\([^()]*\\))+' +
    '|\\[' + attributes + '\\]' +
    ')$'),

  // skip group of round brackets
  skipround = '\\([^()]+\\)|\\(.*\\)',
  // skip group of curly brackets
  skipcurly = '\\{[^{}]+\\}|\\{.*\\}',
  // skip group of square brackets
  skipsquare = '\\[[^[\\]]*\\]|\\[.*\\]',

  // skip [ ], ( ), { } groups in token tails
  skipgroup = '\\[.*\\]|\\(.*\\)|\\{.*\\}',

  // split comma groups, exclude commas from
  // quotes '' "" and from brackets () [] {}
  reSplitGroup = new RegExp('(' +
    '[^(,)\\\\\\[\\]]+' +
    '|\\[(?:' + skipsquare +
    '|' + quotedvalue +
    '|[^\\[\\]]+)+\\]' +
    '|' + skipround +
    '|' + skipcurly +
    '|\\\\.' +
    ')+', 'g'),

  // split last, right most, selector group token
  reSplitToken = new RegExp('(' +
    '\\(' + pseudoclass + '\\)|' +
    '\\[' + attributes + '\\]|' +
    '[^\x20>+~]|\\\\.)+', 'g'),

  // for pseudos, ids and in excess whitespace removal
  reClassValue = new RegExp('(' + identifier + ')'),
  reIdSelector = new RegExp('#(' + identifier + ')'),
  reWhiteSpace = /[\x20\t\n\r\f]+/g,

  // match missing R/L context
  reLeftContext = /^\s*[>+~]{1}/,
  reRightContext = /[>+~]{1}\s*$/,

  /*----------------------------- FEATURE TESTING ----------------------------*/

  // detect native methods
  isNative = (function() {
    var s = (global.open + '').replace(/open/g, '');
    return function(object, method) {
      var m = object ? object[method] : false, r = new RegExp(method, 'g');
      return !!(m && typeof m != 'string' && s === (m + '').replace(r, ''));
    };
  })(),

  // Safari 2 missing document.compatMode property
  // makes harder to detect Quirks vs. Strict mode
  isQuirks =
    function(document) {
      return typeof document.compatMode == 'string' ?
        document.compatMode.indexOf('CSS') < 0 :
        (function() {
          var div = document.createElement('div'),
            isStrict = div.style &&
              (div.style.width = 1) &&
              div.style.width != '1px';
          div = null;
          return !isStrict;
        })();
    },

  // XML is functional in W3C browsers
  isXML = 'xmlVersion' in doc ?
    function(document) {
      return !!document.xmlVersion ||
        (/xml$/).test(document.contentType) ||
        !(/html/i).test(document.documentElement.nodeName);
    } :
    function(document) {
      return document.firstChild.nodeType == 7 &&
        (/xml/i).test(document.firstChild.nodeName) ||
        !(/html/i).test(document.documentElement.nodeName);
    },

  // initialized with the loading context
  // and reset for each selection query
  isQuirksMode = isQuirks(doc),
  isXMLDocument = isXML(doc),

  // NATIVE_XXXXX true if method exist and is callable
  // detect if DOM methods are native in browsers
  NATIVE_FOCUS = isNative(doc, 'hasFocus'),
  NATIVE_QSAPI = isNative(doc, 'querySelector'),
  NATIVE_GEBID = isNative(doc, 'getElementById'),
  NATIVE_GEBTN = isNative(root, 'getElementsByTagName'),
  NATIVE_GEBCN = isNative(root, 'getElementsByClassName'),

  // detect native getAttribute/hasAttribute methods,
  // frameworks extend these to elements, but it seems
  // this does not work for XML namespaced attributes,
  // used to check both getAttribute/hasAttribute in IE
  NATIVE_GET_ATTRIBUTE = isNative(root, 'getAttribute'),
  NATIVE_HAS_ATTRIBUTE = isNative(root, 'hasAttribute'),

  // check if slice() can convert nodelist to array
  // see http://yura.thinkweb2.com/cft/
  NATIVE_SLICE_PROTO =
    (function() {
      var isBuggy = false, id = root.id;
      root.id = 'length';
      try {
        isBuggy = !!slice.call(doc.childNodes, 0)[0];
      } catch(e) { }
      root.id = id;
      return isBuggy;
    })(),

  // supports the new traversal API
  NATIVE_TRAVERSAL_API =
    'nextElementSibling' in root && 'previousElementSibling' in root,

  // BUGGY_XXXXX true if method is feature tested and has known bugs
  // detect buggy gEBID
  BUGGY_GEBID = NATIVE_GEBID ?
    (function() {
      var isBuggy = true, x = 'x' + String(+new Date),
        a = doc.createElementNS ? 'a' : '<a name="' + x + '">';
      (a = doc.createElement(a)).name = x;
      root.insertBefore(a, root.firstChild);
      isBuggy = !!doc.getElementById(x);
      root.removeChild(a);
      a = null;
      return isBuggy;
    })() :
    true,

  // detect IE gEBTN comment nodes bug
  BUGGY_GEBTN = NATIVE_GEBTN ?
    (function() {
      var isBuggy, div = doc.createElement('div');
      div.appendChild(doc.createComment(''));
      isBuggy = div.getElementsByTagName('*')[0];
      div.removeChild(div.firstChild);
      div = null;
      return !!isBuggy;
    })() :
    true,

  // detect Opera gEBCN second class and/or UTF8 bugs as well as Safari 3.2
  // caching class name results and not detecting when changed,
  // tests are based on the jQuery selector test suite
  BUGGY_GEBCN = NATIVE_GEBCN ?
    (function() {
      var isBuggy, div = doc.createElement('div'), test = '\u53f0\u5317';

      // Opera tests
      div.appendChild(doc.createElement('span')).
        setAttribute('class', test + 'abc ' + test);
      div.appendChild(doc.createElement('span')).
        setAttribute('class', 'x');

      isBuggy = !div.getElementsByClassName(test)[0];

      // Safari test
      div.lastChild.className = test;
      if (!isBuggy)
        isBuggy = div.getElementsByClassName(test).length !== 2;

      div.removeChild(div.firstChild);
      div.removeChild(div.firstChild);
      div = null;
      return isBuggy;
    })() :
    true,

  // detect IE bug with dynamic attributes
  BUGGY_GET_ATTRIBUTE = NATIVE_GET_ATTRIBUTE ?
    (function() {
      var isBuggy, input;
      (input = doc.createElement('input')).setAttribute('value', '5');
      return isBuggy = input.defaultValue != 5;
    })() :
    true,

  // detect IE bug with non-standard boolean attributes
  BUGGY_HAS_ATTRIBUTE = NATIVE_HAS_ATTRIBUTE ?
    (function() {
      var isBuggy, option = doc.createElement('option');
      option.setAttribute('selected', 'selected');
      isBuggy = !option.hasAttribute('selected');
      return isBuggy;
    })() :
    true,

  // check Seletor API implementations
  RE_BUGGY_QSAPI = NATIVE_QSAPI ?
    (function() {
      var pattern = [ ], div = doc.createElement('div'), input;

      // In quirks mode css class names are case insensitive.
      // In standards mode they are case sensitive. See docs:
      // https://developer.mozilla.org/en/Mozilla_Quirks_Mode_Behavior
      // http://www.whatwg.org/specs/web-apps/current-work/#selectors

      // Safari 3.2 QSA doesn't work with mixedcase in quirksmode
      // https://bugs.webkit.org/show_bug.cgi?id=19047
      // must test the attribute selector '[class~=xxx]'
      // before '.xXx' or the bug may not present itself
      div.appendChild(doc.createElement('p')).setAttribute('class', 'xXx');
      div.appendChild(doc.createElement('p')).setAttribute('class', 'xxx');
      if (isQuirks(doc) &&
        (div.querySelectorAll('[class~=xxx]').length != 2 ||
        div.querySelectorAll('.xXx').length != 2)) {
        pattern.push('(?:\\[[\\x20\\t\\n\\r\\f]*class\\b|\\.' + identifier + ')');
      }
      div.removeChild(div.firstChild);
      div.removeChild(div.firstChild);

      // ^= $= *= operators bugs whith empty values (Opera 10 / IE8)
      div.appendChild(doc.createElement('p')).setAttribute('class', '');
      try {
        div.querySelectorAll('[class^=""]').length === 1 &&
          pattern.push('\\[\\s*.*(?=\\^=|\\$=|\\*=).*]');
      } catch(e) { }
      div.removeChild(div.firstChild);

      // :checked bugs whith checkbox (Opera 10 to 10.53)
      input = doc.createElement('input');
      input.setAttribute('type', 'checkbox');
      input.setAttribute('checked', 'checked');
      div.appendChild(input);
      try {
        div.querySelectorAll(':checked').length !== 1 &&
          pattern.push(':checked');
      } catch(e) { }
      div.removeChild(div.firstChild);

      // :enabled :disabled bugs with hidden fields (Firefox 3.5 QSA bug)
      // http://www.w3.org/TR/html5/interactive-elements.html#selector-enabled
      // IE8 QSA has problems too and throws error with these dynamic pseudos
      (input = doc.createElement('input')).setAttribute('type', 'hidden');
      div.appendChild(input);
      try {
        div.querySelectorAll(':enabled').length === 1 &&
          pattern.push(':enabled', ':disabled');
      } catch(e) { }
      div.removeChild(div.firstChild);

      // :link bugs with hyperlinks matching (Firefox/Safari)
      div.appendChild(doc.createElement('a')).setAttribute('href', 'x');
      div.querySelectorAll(':link').length !== 1 && pattern.push(':link');
      div.removeChild(div.firstChild);

      // avoid following selectors for IE QSA
      if (BUGGY_HAS_ATTRIBUTE) {
        pattern.push(
          // IE fails reading original values for input/textarea
          '\\[\\s*value',
          // IE fails reading original boolean value for controls
          '\\[\\s*ismap',
          '\\[\\s*checked',
          '\\[\\s*disabled',
          '\\[\\s*multiple',
          '\\[\\s*readonly',
          '\\[\\s*selected');
      }

      div = null;
      return pattern.length ?
        new RegExp(pattern.join('|')) :
        { 'test': function() { return false; } };
    })() :
    true,

  // matches simple id, tag & class selectors
  RE_SIMPLE_SELECTOR = new RegExp(
    !(BUGGY_GEBTN && BUGGY_GEBCN) ?
      '^(?:\\*|[.#]?-?[_a-zA-Z]{1}' + encoding + ')$' :
      '^#?-?[_a-zA-Z]{1}' + encoding + '$'),

  /*----------------------------- LOOKUP OBJECTS -----------------------------*/

  LINK_NODES = { 'a': 1, 'A': 1, 'area': 1, 'AREA': 1, 'link': 1, 'LINK': 1 },

  QSA_NODE_TYPES = { '9': 1, '11': 1 },

  // boolean attributes should return attribute name instead of true/false
  ATTR_BOOLEAN = {
    checked: 1, disabled: 1, ismap: 1, multiple: 1, readonly: 1, selected: 1
  },

  // dynamic attributes that needs to be checked against original HTML value
  ATTR_DEFAULT = {
    value: 'defaultValue',
    checked: 'defaultChecked',
    selected: 'defaultSelected'
  },

  // HTML to DOM namespace mapping for special case attributes (IE engines)
  ATTR_MAPPING = {
    'class': 'className', 'for': 'htmlFor'
  },

  // attribute referencing URI data values need special treatment in IE
  ATTR_URIDATA = {
    'action': 2, 'cite': 2, 'codebase': 2, 'data': 2, 'href': 2,
    'longdesc': 2, 'lowsrc': 2, 'src': 2, 'usemap': 2
  },

  // HTML 5 draft specifications
  // http://www.whatwg.org/specs/web-apps/current-work/#selectors
  HTML_TABLE = {
    // class attribute must be treated case-insensitive in HTML quirks mode
    // initialized by default to Standard Mode (case-sensitive),
    // set dynamically by the attribute resolver
    'class': 0,
    'accept': 1, 'accept-charset': 1, 'align': 1, 'alink': 1, 'axis': 1,
    'bgcolor': 1, 'charset': 1, 'checked': 1, 'clear': 1, 'codetype': 1, 'color': 1,
    'compact': 1, 'declare': 1, 'defer': 1, 'dir': 1, 'direction': 1, 'disabled': 1,
    'enctype': 1, 'face': 1, 'frame': 1, 'hreflang': 1, 'http-equiv': 1, 'lang': 1,
    'language': 1, 'link': 1, 'media': 1, 'method': 1, 'multiple': 1, 'nohref': 1,
    'noresize': 1, 'noshade': 1, 'nowrap': 1, 'readonly': 1, 'rel': 1, 'rev': 1,
    'rules': 1, 'scope': 1, 'scrolling': 1, 'selected': 1, 'shape': 1, 'target': 1,
    'text': 1, 'type': 1, 'valign': 1, 'valuetype': 1, 'vlink': 1
  },

  // the following attributes must be treated case-insensitive in XHTML mode
  // Niels Leenheer http://rakaz.nl/item/css_selector_bugs_case_sensitivity
  XHTML_TABLE = {
    'accept': 1, 'accept-charset': 1, 'alink': 1, 'axis': 1,
    'bgcolor': 1, 'charset': 1, 'codetype': 1, 'color': 1,
    'enctype': 1, 'face': 1, 'hreflang': 1, 'http-equiv': 1,
    'lang': 1, 'language': 1, 'link': 1, 'media': 1, 'rel': 1,
    'rev': 1, 'target': 1, 'text': 1, 'type': 1, 'vlink': 1
  },

  /*-------------------------- REGULAR EXPRESSIONS ---------------------------*/

  // placeholder to add functionalities
  Selectors = {
    // as a simple example this will check
    // for chars not in standard ascii table
    //
    // 'mySpecialSelector': {
    //  'Expression': /\u0080-\uffff/,
    //  'Callback': mySelectorCallback
    // }
    //
    // 'mySelectorCallback' will be invoked
    // only after passing all other standard
    // checks and only if none of them worked
  },

  // attribute operators
  Operators = {
     '=': "n=='%m'",
    '^=': "n.indexOf('%m')==0",
    '*=': "n.indexOf('%m')>-1",
    '|=': "(n+'-').indexOf('%m-')==0",
    '~=': "(' '+n+' ').indexOf(' %m ')>-1",
    '$=': "n.substr(n.length-'%m'.length)=='%m'"
  },

  // optimization expressions
  Optimize = {
    ID: new RegExp('^#(' + encoding + ')|' + skipgroup),
    TAG: new RegExp('^(' + encoding + ')|' + skipgroup),
    CLASS: new RegExp('^\\.(' + encoding + '$)|' + skipgroup),
    NAME: /\[\s*name\s*=\s*((["']*)([^'"()]*?)\2)?\s*\]/
  },

  // precompiled Regular Expressions
  Patterns = {
    // structural pseudo-classes and child selectors
    spseudos: /^\:(root|empty|nth)?-?(first|last|only)?-?(child)?-?(of-type)?(?:\(([^\x29]*)\))?(.*)/,
    // uistates + dynamic + negation pseudo-classes
    dpseudos: /^\:([\w]+|[^\x00-\xa0]+)(?:\((["']*)(.*?(\(.*\))?[^'"()]*?)\2\))?(.*)/,
    // element attribute matcher
    attribute: new RegExp('^\\[' + attributes + '\\](.*)'),
    // E > F
    children: /^[\x20\t\n\r\f]*\>[\x20\t\n\r\f]*(.*)/,
    // E + F
    adjacent: /^[\x20\t\n\r\f]*\+[\x20\t\n\r\f]*(.*)/,
    // E ~ F
    relative: /^[\x20\t\n\r\f]*\~[\x20\t\n\r\f]*(.*)/,
    // E F
    ancestor: /^[\x20\t\n\r\f]+(.*)/,
    // all
    universal: /^\*(.*)/,
    // id
    id: new RegExp('^#(' + encoding + ')(.*)'),
    // tag
    tagName: new RegExp('^(' + encoding + ')(.*)'),
    // class
    className: new RegExp('^\\.(' + encoding + ')(.*)')
  },

  // current CSS3 grouping of Pseudo-Classes
  // they allow implementing extensions
  // and improve error notifications;
  // the assigned value represent current spec status:
  // 3 = CSS3, 2 = CSS2, '?' = maybe implemented
  CSS3PseudoClasses = {
    Structural: {
      'root': 3, 'empty': 3,
      'nth-child': 3, 'nth-last-child': 3,
      'nth-of-type': 3, 'nth-last-of-type': 3,
      'first-child': 3, 'last-child': 3, 'only-child': 3,
      'first-of-type': 3, 'last-of-type': 3, 'only-of-type': 3
    },
    Others: {
      'link': 3, 'visited': 3,
      'target': 3, 'lang': 3, 'not': 3,
      'active': 3, 'focus': 3, 'hover': 3,
      'checked': 3, 'disabled': 3, 'enabled': 3
    }
  },

  /*------------------------------ DOM METHODS -------------------------------*/

  // concat elements to data
  concatList =
    function(data, elements) {
      var i = -1, element;
      if (data.length === 0 && Array.slice)
        return Array.slice(elements);
      while ((element = elements[++i]))
        data[data.length] = element;
      return data;
    },

  // concat elements to data and callback
  concatCall =
    function(data, elements, callback) {
      var i = -1, element;
      while ((element = elements[++i]))
        callback(data[data.length] = element);
      return data;
    },

  // element by id (raw)
  byIdRaw =
    function(id, elements) {
      var i = -1, element = null;
      while ((element = elements[++i])) {
        if (element.getAttribute('id') == id) {
          break;
        }
      }
      return element;
    },

  // element by id
  // @return element reference or null
  byId = !BUGGY_GEBID ?
    function(id, from) {
      from || (from = doc);
      id = id.replace(/\\/g, '');
      if (isXMLDocument || from.nodeType != 9) {
        return byIdRaw(id, from.getElementsByTagName('*'));
      }
      return from.getElementById(id);
    } :
    function(id, from) {
      var element = null;
      from || (from = doc);
      id = id.replace(/\\/g, '');
      if (isXMLDocument || from.nodeType != 9) {
        return byIdRaw(id, from.getElementsByTagName('*'));
      }
      if ((element = from.getElementById(id)) &&
        element.name == id && from.getElementsByName) {
        return byIdRaw(id, from.getElementsByName(id));
      }
      return element;
    },

  // elements by tag (raw)
  // @return array
  byTagRaw = function(tag, from) {
    var any = tag == '*', element = from, elements = [ ], next = element.firstChild;
    any || (tag = tag.toUpperCase());
    while ((element = next)) {
      if (element.tagName > '@' && (any || element.tagName.toUpperCase() == tag)) {
        elements[elements.length] = element;
      }
      if (next = element.firstChild || element.nextSibling) continue;
      while (!next && (element = element.parentNode) && element != from) {
        next = element.nextSibling;
      }
    }
    return elements;
  },

  // elements by tag
  // @return array
  byTag = !BUGGY_GEBTN && NATIVE_SLICE_PROTO ?
    function(tag, from) {
      from || (from = doc);
      return slice.call(from.getElementsByTagName ?
        from.getElementsByTagName(tag) :
        byTagRaw(tag, from), 0);
    } :
    function(tag, from) {
      var i = -1, data = [ ],
        element, elements = (from || doc).getElementsByTagName(tag);
      if (tag == '*') {
        var j = -1;
        while ((element = elements[++i])) {
          if (element.nodeName > '@')
            data[++j] = element;
        }
      } else {
        while ((element = elements[++i])) {
          data[i] = element;
        }
      }
      return data;
    },

  // elements by name
  // @return array
  byName =
    function(name, from) {
      return select('[name="' + name.replace(/\\/g, '') + '"]', from || doc);
    },

  // elements by class
  // @return array
  byClass = !BUGGY_GEBCN && NATIVE_SLICE_PROTO ?
    function(className, from) {
      return slice.call((from || doc).
        getElementsByClassName(className.replace(/\\/g, '')), 0);
    } :
    function(className, from) {
      from || (from = doc);
      var i = -1, j = i,
        data = [ ], element,
        elements = byTag('*', from),
        host = from.ownerDocument || from,
        quirks = isQuirks(host), xml = isXML(host),
        n = quirks ? className.toLowerCase() : className;
      className = ' ' + n.replace(/\\/g, '') + ' ';
      while ((element = elements[++i])) {
        n = xml ? element.getAttribute('class') : element.className;
        if (n && n.length && (' ' + (quirks ? n.toLowerCase() : n).
          replace(reWhiteSpace, ' ') + ' ').indexOf(className) > -1) {
          data[++j] = element;
        }
      }
      return data;
    },

  // check if an element is a descendant of container
  contains = 'compareDocumentPosition' in root ?
    function(container, element) {
      return (container.compareDocumentPosition(element) & 16) == 16;
    } : 'contains' in root ?
    function(container, element) {
      return container !== element && container.contains(element);
    } :
    function(container, element) {
      while ((element = element.parentNode)) {
        if (element === container) return true;
      }
      return false;
    },

  // children position by nodeType
  // @return number
  getIndexesByNodeType =
    function(element) {
      var i = 0, indexes,
        id = element[CSS_INDEX] || (element[CSS_INDEX] = ++CSS_ID);
      if (!indexesByNodeType[id]) {
        indexes = { };
        element = element.firstChild;
        while (element) {
          if (element.nodeName > '@') {
            indexes[element[CSS_INDEX] || (element[CSS_INDEX] = ++CSS_ID)] = ++i;
          }
          element = element.nextSibling;
        }
        indexes.length = i;
        indexesByNodeType[id] = indexes;
      }
      return indexesByNodeType[id];
    },

  // children position by nodeName
  // @return number
  getIndexesByNodeName =
    function(element, name) {
      var i = 0, indexes,
        id = element[CSS_INDEX] || (element[CSS_INDEX] = ++CSS_ID);
      if (!indexesByNodeName[id] || !indexesByNodeName[id][name]) {
        indexes = { };
        element = element.firstChild;
        while (element) {
          if (element.nodeName.toUpperCase() == name) {
            indexes[element[CSS_INDEX] || (element[CSS_INDEX] = ++CSS_ID)] = ++i;
          }
          element = element.nextSibling;
        }
        indexes.length = i;
        indexesByNodeName[id] ||
          (indexesByNodeName[id] = { });
        indexesByNodeName[id][name] = indexes;
      }
      return indexesByNodeName[id];
    },

  // attribute value
  // @return string
  getAttribute = !BUGGY_GET_ATTRIBUTE ?
    function(node, attribute) {
      return node.getAttribute(attribute) || '';
    } :
    function(node, attribute) {
      attribute = attribute.toLowerCase();
      if (ATTR_DEFAULT[attribute] in node) {
        return node[ATTR_DEFAULT[attribute]] || '';
      }
      return (
        // specific URI data attributes (parameter 2 to fix IE bug)
        ATTR_URIDATA[attribute] ? node.getAttribute(attribute, 2) || '' :
        // boolean attributes should return name instead of true/false
        ATTR_BOOLEAN[attribute] ? node.getAttribute(attribute) ? attribute : '' :
          ((node = node.getAttributeNode(attribute)) && node.value) || '');
    },

  // attribute presence
  // @return boolean
  hasAttribute = !BUGGY_HAS_ATTRIBUTE ?
    function(node, attribute) {
      return node.hasAttribute(attribute);
    } :
    function(node, attribute) {
      attribute = attribute.toLowerCase();
      // older IE engines requires DOM mapping
      // see NetFront/Playstation as an example
      attribute = attribute in ATTR_MAPPING ?
        ATTR_MAPPING[attribute] : attribute;
      if (ATTR_DEFAULT[attribute] in node) {
        return !!node[ATTR_DEFAULT[attribute]];
      }
      // need to get at AttributeNode first on IE
      node = node.getAttributeNode(attribute);
      // use both "specified" & "nodeValue" properties
      return !!(node && (node.specified || node.nodeValue));
    },

  // check node emptyness
  isEmpty =
    function(node) {
      node = node.firstChild;
      while (node) {
        if (node.nodeType == 3 || node.nodeName > '@') return false;
        node = node.nextSibling;
      }
      return true;
    },

  // check if element matches the :link pseudo
  // @return boolean
  isLink =
    function(element) {
      return hasAttribute(element,'href') && LINK_NODES[element.nodeName];
    },

  /*------------------------------- DEBUGGING --------------------------------*/

  // compile selectors to ad-hoc functions resolvers
  // @selector string
  // @mode boolean
  // false = select resolvers
  // true = match resolvers
  compile =
    function(selector, mode) {
      return compileGroup(selector, '', mode || false);
    },

  // set working mode
  configure =
    function(options) {
      for (var i in options) {
        if (i == 'VERBOSITY') {
          VERBOSITY = !!options[i];
        } else if (i == 'SIMPLENOT') {
          SIMPLENOT = !!options[i];
          HTMLResolvers = { };
          XMLResolvers = { };
          HTMLMatchers = { };
          XMLMatchers = { };
          USE_QSAPI = false;
          reValidator = new RegExp(extendedValidator, 'g');
        } else if (i == 'SHORTCUTS') {
          SHORTCUTS = !!options[i];
        } else if (i == 'USE_QSAPI') {
          USE_QSAPI = !!options[i] && NATIVE_QSAPI;
          reValidator = new RegExp(standardValidator, 'g');
        }
      }
    },

  // control user notifications
  emit =
    function(message) {
      if (VERBOSITY) {
        // FF/Safari/Opera DOMException.SYNTAX_ERR = 12
        if (typeof global.DOMException !== 'undefined') {
          var err = new Error();
          err.name = 'SYNTAX_ERR';
          err.message = '(Selectors) ' + message;
          err.code = 12;
          throw err;
        } else {
          throw new Error(12, 'SYNTAX_ERR: (Selectors) ' + message);
        }
      } else {
        var console = global.console;
        if (console && console.log) {
          console.log(message);
        } else {
          if (/exception/i.test(message)) {
            global.status = message;
            global.defaultStatus = message;
          } else {
            global.status += message;
          }
        }
      }
    },

  // by default disable complex selectors nested in
  // ':not()' pseudo-classes, as for specifications
  SIMPLENOT = true,

  // by default do not add missing left/right context
  // to selector string shortcuts like "+div" or "ul>"
  SHORTCUTS = false,

  // controls the engine error/warning notifications
  VERBOSITY = true,

  // controls enabling the Query Selector API branch
  USE_QSAPI = NATIVE_QSAPI,

  /*---------------------------- COMPILER METHODS ----------------------------*/

  // do not change this, it is searched & replaced
  // in multiple places to build compiled functions
  ACCEPT_NODE = 'f&&f(c[k]);r[r.length]=c[k];continue main;',

  // checks if nodeName comparisons need to be uppercased
  TO_UPPER_CASE = doc.createElement('nAv').nodeName == 'nAv' ?
    '.toUpperCase()' : '',

  // compile a comma separated group of selector
  // @mode boolean true for select, false for match
  // return a compiled function
  compileGroup =
    function(selector, source, mode) {
      var i = -1, seen = { }, parts, token;
      if ((parts = selector.match(reSplitGroup))) {
        // for each selector in the group
        while ((token = parts[++i])) {
          token = token.replace(reTrimSpaces, '');
          // avoid repeating the same token in comma separated group (p, p)
          if (!seen[token]) {
            seen[token] = true;
            source += i > 0 ? (mode ? 'e=c[k];': 'e=k;') : '';
            source += compileSelector(token, mode ? ACCEPT_NODE : 'f&&f(k);return true;');
          }
        }
      }
      if (mode) {
        // for select method
        return new Function('c,s,r,d,h,g,f',
          'var N,n,x=0,k=-1,e;main:while(e=c[++k]){' + source + '}return r;');
      } else {
        // for match method
        return new Function('e,s,r,d,h,g,f',
          'var N,n,x=0,k=e;' + source + 'return false;');
      }
    },

  // compile a CSS3 string selector into ad-hoc javascript matching function
  // @return string (to be compiled)
  compileSelector =
    function(selector, source) {

      var i, a, b, n, k, expr, match, result, status, test, type;

      k = 0;

      while (selector) {

        // *** Universal selector
        // * match all (empty block, do not remove)
        if ((match = selector.match(Patterns.universal))) {
          // do nothing, handled in the compiler where
          // BUGGY_GEBTN return comment nodes (ex: IE)
          i = true;
        }

        // *** ID selector
        // #Foo Id case sensitive
        else if ((match = selector.match(Patterns.id))) {
          // document can contain conflicting elements (id/name)
          // prototype selector unit need this method to recover bad HTML forms
          source = 'if(' + (isXMLDocument ?
            's.getAttribute(e,"id")' :
            '(e.submit?s.getAttribute(e,"id"):e.id)') +
            '=="' + match[1] + '"' +
            '){' + source + '}';
        }

        // *** Type selector
        // Foo Tag (case insensitive)
        else if ((match = selector.match(Patterns.tagName))) {
          // both tagName and nodeName properties may be upper/lower case
          // depending on their creation NAMESPACE in createElementNS()
          source = 'if(e.nodeName' + (isXMLDocument ?
            '=="' + match[1] + '"' : TO_UPPER_CASE +
            '=="' + match[1].toUpperCase() + '"') +
            '){' + source + '}';
        }

        // *** Class selector
        // .Foo Class (case sensitive)
        else if ((match = selector.match(Patterns.className))) {
          // W3C CSS3 specs: element whose "class" attribute has been assigned a
          // list of whitespace-separated values, see section 6.4 Class selectors
          // and notes at the bottom; explicitly non-normative in this specification.
          source = 'if((n=' + (isXMLDocument ?
            's.getAttribute(e,"class")' : 'e.className') +
            ')&&n.length&&(" "+' + (isQuirksMode ? 'n.toLowerCase()' : 'n') +
            '.replace(' + reWhiteSpace + '," ")+" ").indexOf(" ' +
            (isQuirksMode ? match[1].toLowerCase() : match[1]) + ' ")>-1' +
            '){' + source + '}';
        }

        // *** Attribute selector
        // [attr] [attr=value] [attr="value"] [attr='value'] and !=, *=, ~=, |=, ^=, $=
        // case sensitivity is treated differently depending on the document type (see map)
        else if ((match = selector.match(Patterns.attribute))) {
          if (match[3]) match[3] = match[3].replace(/^\x22|\x22$/g, '').replace(/^\x27|\x27$/g, '');

          // xml namespaced attribute ?
          expr = match[1].split(':');
          expr = expr.length == 2 ? expr[1] : expr[0] + '';

          if (match[2] && !Operators[match[2]]) {
            emit('Unsupported operator in attribute selectors "' + selector + '"');
            return '';
          }

          // replace Operators parameter if needed
          if (match[2] && match[3] && (type = Operators[match[2]])) {
            // case treatment depends on document
            HTML_TABLE['class'] = isQuirksMode ? 1 : 0;
            // replace escaped values and HTML entities
            match[3] = match[3].replace(/\\([0-9a-f]{2,2})/, '\\x$1');
            test = (isXMLDocument ? XHTML_TABLE : HTML_TABLE)[expr.toLowerCase()];
            type = type.replace(/\%m/g, test ? match[3].toLowerCase() : match[3]);
          } else {
            test = false;
            // handle empty values
            type = match[2] == '=' ? 'n==""' : 'false';
          }

          // build expression for has/getAttribute
          expr = 'n=s.' + (match[2] ? 'get' : 'has') +
            'Attribute(e,"' + match[1] + '")' +
            (test ? '.toLowerCase();' : ';');

          source = expr + 'if(' + (match[2] ? type : 'n') + '){' + source + '}';
        }

        // *** Adjacent sibling combinator
        // E + F (F adiacent sibling of E)
        else if ((match = selector.match(Patterns.adjacent))) {
          k++;
          source = NATIVE_TRAVERSAL_API ?
            'var N' + k + '=e;if(e&&(e=e.previousElementSibling)){' + source + '}e=N' + k + ';' :
            'var N' + k + '=e;while(e&&(e=e.previousSibling)){if(e.nodeName>"@"){' + source + 'break;}}e=N' + k + ';';
        }

        // *** General sibling combinator
        // E ~ F (F relative sibling of E)
        else if ((match = selector.match(Patterns.relative))) {
          k++;
          source = NATIVE_TRAVERSAL_API ?
            ('var N' + k + '=e;e=e.parentNode.firstElementChild;' +
            'while(e&&e!=N' + k + '){' + source + 'e=e.nextElementSibling;}e=N' + k + ';') :
            ('var N' + k + '=e;e=e.parentNode.firstChild;' +
            'while(e&&e!=N' + k + '){if(e.nodeName>"@"){' + source + '}e=e.nextSibling;}e=N' + k + ';');
        }

        // *** Child combinator
        // E > F (F children of E)
        else if ((match = selector.match(Patterns.children))) {
          k++;
          source = 'var N' + k + '=e;if(e&&e!==h&&e!==g&&(e=e.parentNode)){' + source + '}e=N' + k + ';';
        }

        // *** Descendant combinator
        // E F (E ancestor of F)
        else if ((match = selector.match(Patterns.ancestor))) {
          k++;
          source = 'var N' + k + '=e;while(e&&e!==h&&e!==g&&(e=e.parentNode)){' + source + '}e=N' + k + ';';
        }

        // *** Structural pseudo-classes
        // :root, :empty,
        // :first-child, :last-child, :only-child,
        // :first-of-type, :last-of-type, :only-of-type,
        // :nth-child(), :nth-last-child(), :nth-of-type(), :nth-last-of-type()
        else if ((match = selector.match(Patterns.spseudos)) &&
          CSS3PseudoClasses.Structural[selector.match(reClassValue)[0]]) {

          switch (match[1]) {
            case 'root':
              // element root of the document
              source = 'if(e===h){' + source + '}';
              break;

            case 'empty':
              // element that has no children
              source = 'if(s.isEmpty(e)){' + source + '}';
              break;

            default:
              if (match[1] && match[5]) {
                if (match[5] == 'n') {
                  source = 'if(e!==h){' + source + '}';
                  break;
                } else if (match[5] == 'even') {
                  a = 2;
                  b = 0;
                } else if (match[5] == 'odd') {
                  a = 2;
                  b = 1;
                } else {
                  // assumes correct "an+b" format, "b" before "a" to keep "n" values
                  b = ((n = match[5].match(/(-?\d+)$/)) ? parseInt(n[1], 10) : 0);
                  a = ((n = match[5].match(/(-?\d*)n/)) ? parseInt(n[1], 10) : 0);
                  if (n && n[1] == '-') a = -1;
                }

                // executed after the count is computed
                type = match[4] ? 'n[N]' : 'n';
                expr = match[2] == 'last' && b >= 0 ? type + '.length-(' + (b - 1) + ')' : b;

                // shortcut check for of-type selectors
                type = type + '[e.' + CSS_INDEX + ']';

                // build test expression out of structural pseudo (an+b) parameters
                // see here: http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
                test =  b < 1 && a > 1 ? '(' + type + '-(' + expr + '))%' + a + '==0' : a > +1 ?
                  (match[2] == 'last') ? '(' + type + '-(' + expr + '))%' + a + '==0' :
                  type + '>=' + expr + '&&(' + type + '-(' + expr + '))%' + a + '==0' : a < -1 ?
                  (match[2] == 'last') ? '(' + type + '-(' + expr + '))%' + a + '==0' :
                  type + '<=' + expr + '&&(' + type + '-(' + expr + '))%' + a + '==0' : a=== 0 ?
                  type + '==' + expr :
                  (match[2] == 'last') ?
                    a == -1 ? type + '>=' + expr : type + '<=' + expr :
                    a == -1 ? type + '<=' + expr : type + '>=' + expr;

                // 4 cases: 1 (nth) x 4 (child, of-type, last-child, last-of-type)
                source =
                  (match[4] ? 'N=e.nodeName' + TO_UPPER_CASE + ';' : '') +
                  'if(e!==h){' +
                    'n=s.getIndexesBy' + (match[4] ? 'NodeName' : 'NodeType') +
                    '(e.parentNode' + (match[4] ? ',N' : '') + ');' +
                    'if(' + test + '){' + source + '}' +
                  '}';

              } else {
                // 6 cases: 3 (first, last, only) x 1 (child) x 2 (-of-type)
                a = match[2] == 'first' ? 'previous' : 'next';
                n = match[2] == 'only' ? 'previous' : 'next';
                b = match[2] == 'first' || match[2] == 'last';

                type = match[4] ? '&&n.nodeName!=e.nodeName' : '&&n.nodeName<"@"';

                source = 'if(e!==h){' +
                  ( 'n=e;while((n=n.' + a + 'Sibling)' + type + ');if(!n){' + (b ? source :
                    'n=e;while((n=n.' + n + 'Sibling)' + type + ');if(!n){' + source + '}') + '}' ) + '}';
              }
              break;
          }
        }

        // *** negation, user action and target pseudo-classes
        // *** UI element states and dynamic pseudo-classes
        // CSS3 :not, :checked, :enabled, :disabled, :target
        // CSS3 :active, :hover, :focus
        // CSS3 :link, :visited
        else if ((match = selector.match(Patterns.dpseudos)) &&
          CSS3PseudoClasses.Others[selector.match(reClassValue)[0]]) {

          switch (match[1]) {
            // CSS3 negation pseudo-class
            case 'not':
              // compile nested selectors, DO NOT pass the callback parameter
              // SIMPLENOT allow disabling complex selectors nested
              // in ':not()' pseudo-classes, breaks some test units
              expr = match[3].replace(reTrimSpaces, '');

              if (SIMPLENOT && !reSimpleNot.test(expr)) {
                // see above, log error but continue execution
                emit('Negation pseudo-class only accepts simple selectors "' + selector + '"');
                return '';
              } else {
                if ('compatMode' in doc) {
                  source = 'N=' + compileGroup(expr, '', false) + '(e,s,r,d,h,g);if(!N){' + source + '}';
                } else {
                  source = 'if(!s.match(e, "' + expr.replace(/\x22/g, '\\"') + '",r)){' + source +'}';
                }
              }
              break;

            // CSS3 UI element states
            case 'checked':
              // only radio buttons, check boxes and option elements
              source = 'if(((typeof e.form!=="undefined"&&(/radio|checkbox/i).test(e.type))||/option/i.test(e.nodeName))&&(e.checked||e.selected)){' + source + '}';
              break;
            case 'enabled':
              // does not consider hidden input fields
              source = 'if(((typeof e.form!=="undefined"&&!(/hidden/i).test(e.type))||s.isLink(e))&&!e.disabled){' + source + '}';
              break;
            case 'disabled':
              // does not consider hidden input fields
              source = 'if(((typeof e.form!=="undefined"&&!(/hidden/i).test(e.type))||s.isLink(e))&&e.disabled){' + source + '}';
              break;

            // CSS3 lang pseudo-class
            case 'lang':
              test = '';
              if (match[3]) test = match[3].substr(0, 2) + '-';
              source = 'do{(n=e.lang||"").toLowerCase();' +
                'if((n==""&&h.lang=="' + match[3].toLowerCase() + '")||' +
                '(n&&(n=="' + match[3].toLowerCase() +
                '"||n.substr(0,3)=="' + test.toLowerCase() + '")))' +
                '{' + source + 'break;}}while((e=e.parentNode)&&e!==g);';
              break;

            // CSS3 target pseudo-class
            case 'target':
              n = doc.location ? doc.location.hash : '';
              if (n) {
                source = 'if(e.id=="' + n.slice(1) + '"){' + source + '}';
              }
              break;

            // CSS3 dynamic pseudo-classes
            case 'link':
              source = 'if(s.isLink(e)&&!e.visited){' + source + '}';
              break;
            case 'visited':
              source = 'if(s.isLink(e)&&e.visited){' + source + '}';
              break;

            // CSS3 user action pseudo-classes IE & FF3 have native support
            // these capabilities may be emulated by some event managers
            case 'active':
              if (isXMLDocument) break;
              source = 'if(e===d.activeElement){' + source + '}';
              break;
            case 'hover':
              if (isXMLDocument) break;
              source = 'if(e===d.hoverElement){' + source + '}';
              break;
            case 'focus':
              if (isXMLDocument) break;
              source = NATIVE_FOCUS ?
                'if(e===d.activeElement&&d.hasFocus()&&(e.type||e.href)){' + source + '}' :
                'if(e===d.activeElement&&(e.type||e.href)){' + source + '}';
              break;

            default:
              break;
          }
        } else {

          // this is where external extensions are
          // invoked if expressions match selectors
          expr = false;
          status = true;

          for (expr in Selectors) {
            if ((match = selector.match(Selectors[expr].Expression))) {
              result = Selectors[expr].Callback(match, source);
              source = result.source;
              status = result.status;
              if (status) break;
            }
          }

          // if an extension fails to parse the selector
          // it must return a false boolean in "status"
          if (!status) {
            // log error but continue execution, don't throw real exceptions
            // because blocking following processes maybe is not a good idea
            emit('Unknown pseudo-class selector "' + selector + '"');
            return '';
          }

          if (!expr) {
            // see above, log error but continue execution
            emit('Unknown token in selector "' + selector + '"');
            return '';
          }

        }

        // error if no matches found by the pattern scan
        if (!match) {
          emit('Invalid syntax in selector "' + selector + '"');
          return '';
        }

        // ensure "match" is not null or empty since
        // we do not throw real DOMExceptions above
        selector = match && match[match.length - 1];
      }

      return source;
    },

  /*----------------------------- QUERY METHODS ------------------------------*/

  // match element with selector
  // @return boolean
  match =
    function(element, selector, from, callback) {

      var changed, parts, resolver;

      // ensures a valid element node and selector was passed
      if (!element || element.nodeName < 'A' || !selector) return false;

      // if passed, check context contains element
      if (from && from.nodeType == 1) {
        if (!contains(from, element)) return false;
      }

      selector = selector.replace(reTrimSpaces, '');

      // ensure context is set
      from || (from = doc);

      // extract context if changed
      if (lastMatchContext != from) {
        // save passed context
        lastMatchContext = from;
        // reference element ownerDocument and document root (HTML)
        root = (doc = element.ownerDocument || element).documentElement;
        isQuirksMode = isQuirks(doc);
        isXMLDocument = isXML(doc);
      }

      if (changed = lastMatcher != selector) {
        // process valid selector strings
        if ((parts = selector.match(reValidator)) && parts[0] == selector) {
          // save passed selector
          lastMatcher = selector;
          isSingleMatch = (parts = selector.match(reSplitGroup)).length < 2;
        } else {
          emit('The string "' + selector + '", is not a valid CSS selector');
          return false;
        }
      }

      // compile matcher resolver if necessary
      if (isXMLDocument && !(resolver = XMLMatchers[selector])) {
        resolver = XMLMatchers[selector] = isSingleMatch ?
          new Function('e,s,r,d,h,g,f', 'var N,n,x=0,k=e;' +
            compileSelector(selector, 'f&&f(k);return true;') +
            'return false;') : compileGroup(selector, '', false);
      } else if (!(resolver = HTMLMatchers[selector])) {
        resolver = HTMLMatchers[selector] = isSingleMatch ?
          new Function('e,s,r,d,h,g,f', 'var N,n,x=0,k=e;' +
            compileSelector(selector, 'f&&f(k);return true;') +
            'return false;') : compileGroup(selector, '', false);
      }

      // reinitialize indexes
      indexesByNodeType = { };
      indexesByNodeName = { };

      return resolver(element, snap, [ ], doc, root, from || doc, callback);
    },

  // select elements matching selector
  // using new Query Selector API
  // or cross-browser client API
  // @return array
  select =
    function(selector, from, callback) {

      var i, changed, element, elements, parts, resolver, token;

      if (arguments.length === 0) {
        emit('Missing required selector parameters');
        return [ ];
      } else if (selector === '') {
        emit('Empty selector string');
        return [ ];
      } else if (typeof selector != 'string') {
        // QSA capable browsers do not throw
        return [ ];
      }

      selector = selector.replace(reTrimSpaces, '');

      // ensure context is set
      from || (from = doc);

      if (SHORTCUTS) {
        // add left context if missing
        if (reLeftContext.test(selector)) {
          selector = from.nodeType == 9 ? '* ' + selector :
            from.id ? '#' + from.id + ' ' + selector :
              selector;
        }
        // add right context if missing
        if (reRightContext.test(selector)) {
          selector = selector + ' *';
        }
      }

      if (RE_SIMPLE_SELECTOR.test(selector)) {
        switch (selector.charAt(0)) {
          case '#':
            if ((element = byId(selector.slice(1), from))) {
              callback && callback(element);
              return [ element ];
            }
            return [ ];
          case '.':
            elements = byClass(selector.slice(1), from);
            break;
          default:
            elements = byTag(selector, from);
            break;
        }
        return callback ?
          concatCall([ ], elements, callback) : elements;
      }

      if (USE_QSAPI && !RE_BUGGY_QSAPI.test(selector) &&
        QSA_NODE_TYPES[from.nodeType]) {

        // clear error state
        lastError = null;

        try {
          elements = from.querySelectorAll(selector);
        } catch(e) {
          // remember last error
          lastError = e;
          if (selector === '') throw e;
        }

        if (elements) {
          switch (elements.length) {
            case 0:
              return [ ];
            case 1:
              element = elements.item(0);
              callback && callback(element);
              return [ element ];
            default:
              return callback ?
                concatCall([ ], elements, callback) :
                NATIVE_SLICE_PROTO ?
                  slice.call(elements) :
                  concatList([ ], elements);
          }
        }
      }

      // extract context if changed
      if (lastSelectContext != from) {
        // save passed context
        lastSelectContext = from;
        // reference context ownerDocument and document root (HTML)
        root = (doc = from.ownerDocument || from).documentElement;
        isQuirksMode = isQuirks(doc);
        isXMLDocument = isXML(doc);
      }

      if (changed = lastSelector != selector) {
        // process valid selector strings
        if ((parts = selector.match(reValidator)) && parts[0] == selector) {
          // save passed selector
          lastSelector = selector;
          isSingleSelect = (parts = selector.match(reSplitGroup)).length < 2;
        } else {
          emit('The string "' + selector + '", is not a valid CSS selector');
          return [ ];
        }
      }

      // commas separators are treated sequentially to maintain order
      if (isSingleSelect && from.nodeType != 11) {

        if (changed) {
          // get right most selector token
          parts = selector.match(reSplitToken);
          token = parts[parts.length - 1];

          // only last slice before :not rules
          lastSlice = token.split(':not')[0];
        }

        // ID optimization RTL, to reduce number of elements to visit
        if ((parts = lastSlice.match(Optimize.ID)) && (token = parts[1])) {
          if ((element = byId(token, from))) {
            if (match(element, selector)) {
              callback && callback(element);
              return [ element ];
            }
          }
          return [ ];
        }

        // ID optimization LTR, to reduce selection context searches
        else if ((parts = selector.match(Optimize.ID)) && (token = parts[1])) {
          if ((element = byId(token, doc))) {
            if (/[>+~]/.test(selector)) {
              from = element.parentNode;
            } else {
              selector = selector.replace('#' + token, '*');
              from = element;
            }
          } else return [ ];
        }

        if (NATIVE_GEBCN) {
          // RTL optimization for browsers with GEBCN, CLASS first TAG second
          if ((parts = lastSlice.match(Optimize.CLASS)) && (token = parts[1])) {
            if ((elements = byClass(token, from)).length === 0) { return [ ]; }
          } else if ((parts = lastSlice.match(Optimize.TAG)) && (token = parts[1])) {
            if ((elements = byTag(token, from)).length === 0) { return [ ]; }
          }
        } else {
          // RTL optimization for browser without GEBCN, TAG first CLASS second
          if ((parts = lastSlice.match(Optimize.TAG)) && (token = parts[1])) {
            if ((elements = byTag(token, from)).length === 0) { return [ ]; }
          } else if ((parts = lastSlice.match(Optimize.CLASS)) && (token = parts[1])) {
            if ((elements = byClass(token, from)).length === 0) { return [ ]; }
          }
        }

      }

      if (!elements) {
        elements = byTag('*', from);
      }
      // end of prefiltering pass

      // compile selector resolver if necessary
      if (isXMLDocument && !(resolver = XMLResolvers[selector])) {
        resolver = XMLResolvers[selector] = isSingleSelect ?
          new Function('c,s,r,d,h,g,f',
            'var N,n,x=0,k=-1,e;main:while(e=c[++k]){' +
            compileSelector(selector, ACCEPT_NODE) + '}return r;') :
          compileGroup(selector, '', true);
      } else if (!(resolver = HTMLResolvers[selector])) {
        resolver = HTMLResolvers[selector] = isSingleSelect ?
          new Function('c,s,r,d,h,g,f',
            'var N,n,x=0,k=-1,e;main:while(e=c[++k]){' +
            compileSelector(selector, ACCEPT_NODE) + '}return r;') :
          compileGroup(selector, '', true);
      }

      // reinitialize indexes
      indexesByNodeType = { };
      indexesByNodeName = { };

      return resolver(elements, snap, [ ], doc, root, from, callback);
    },

  /*-------------------------------- STORAGE ---------------------------------*/

  // CSS_ID expando on elements
  // used to keep child indexes
  // during a selection session
  CSS_ID = 1,

  CSS_INDEX = 'uniqueID' in root ? 'uniqueID' : 'CSS_ID',

  // ordinal position by nodeType or nodeName
  indexesByNodeType = { },
  indexesByNodeName = { },

  // compiled select functions returning collections
  HTMLResolvers = { },
  XMLResolvers = { },

  // compiled match functions returning booleans
  HTMLMatchers = { },
  XMLMatchers = { },

  // used to pass methods to compiled functions
  snap = {

    // element indexing methods (nodeType/nodeName)
    getIndexesByNodeType: getIndexesByNodeType,
    getIndexesByNodeName: getIndexesByNodeName,

    // element inspection methods
    getAttribute: getAttribute,
    hasAttribute: hasAttribute,

    // element selection methods
    byClass: byClass,
    byName: byName,
    byTag: byTag,
    byId: byId,

    // helper/check methods
    isEmpty: isEmpty,
    isLink: isLink,

    // selection/matching
    select: select,
    match: match
  };

  /*------------------------------- PUBLIC API -------------------------------*/

  global.NW || (global.NW = { });

  NW.Dom = {

    // retrieve element by id attr
    byId: byId,

    // retrieve elements by tag name
    byTag: byTag,

    // retrieve elements by name attr
    byName: byName,

    // retrieve elements by class name
    byClass: byClass,

    // read the value of the attribute
    // as was in the original HTML code
    getAttribute: getAttribute,

    // check for the attribute presence
    // as was in the original HTML code
    hasAttribute: hasAttribute,

    // element match selector, return boolean true/false
    match: match,

    // elements matching selector, starting from element
    select: select,

    // compile selector into ad-hoc javascript resolver
    compile: compile,

    // check that two elements are ancestor/descendant
    contains: contains,

    // handle selector engine configuration settings
    configure: configure,

    // add or overwrite user defined operators
    registerOperator:
      function(symbol, resolver) {
        if (!Operators[symbol]) {
          Operators[symbol] = resolver;
        }
      },

    // add selector patterns for user defined callbacks
    registerSelector:
      function(name, rexp, func) {
        if (!Selectors[name]) {
          Selectors[name] = { };
          Selectors[name].Expression = rexp;
          Selectors[name].Callback = func;
        }
      }
  };

})(this);

  (function(engine, object, NodeList) {
    var engMatch = engine.match, engSelect = engine.select,

    match = function match(element, selectors, context) {
      return engMatch(
        element.raw || fuse(element).raw,
        String(selectors || ''),
        context && fuse(context).raw);
    },

    select = function select(selectors, context, callback) {
      var i = -1, result = NodeList();
      engSelect(
        String(selectors || ''),
        context && fuse(context).raw,
        function(node) {
          result[++i] = node;
          callback && callback(node);
        });

      return result;
    };

    // back compat negated attribute operator '!='
    // comment this out for strict CSS3 compliance
    engine.registerOperator('!=', 'n!="%m"');

    // allow complex :not() selectors
    engine.configure({ 'SIMPLENOT': false });

    object.engine = engine;
    object.match  = match;
    object.select = select;

  })(NW.Dom, fuse.dom.selector, fuse.dom.NodeList);

  // restore
  if (fuse._engine) window.NW = fuse._engine;
  delete fuse._engine;

  /*---------------------------------- EVENT ---------------------------------*/

  fuse.dom.Event = (function() {

    var Decorator = function(event, currTarget) {
      var getCurrentTarget =
      this.getCurrentTarget = function getCurrentTarget() {
        var getCurrentTarget = function getCurrentTarget() { return currTarget; };
        if (currTarget) currTarget = Node(Window(currTarget));
        this.getCurrentTarget = getCurrentTarget;
        return currTarget;
      };
    },

    Event = function Event(event, target) {
      var decorated;
      if (event) {
        if (typeof event.raw != 'undefined') {
          return event;
        }
        decorated = new Decorator(event, target);
        decorated.raw  = event;
        decorated.type = event.type;
      }
      else {
        // fired events have no raw
        decorated = new Decorator(event, target);
        decorated.raw = null;
      }
      return decorated;
    };

    fuse.Class({ 'constructor': Event });
    Decorator.prototype = Event.plugin;

    Event.addStatics({
      'KEY_BACKSPACE': 8,
      'KEY_DELETE':    46,
      'KEY_DOWN':      40,
      'KEY_END':       35,
      'KEY_ESC':       27,
      'KEY_HOME':      36,
      'KEY_INSERT':    45,
      'KEY_LEFT':      37,
      'KEY_PAGEDOWN':  34,
      'KEY_PAGEUP':    33,
      'KEY_RETURN':    13,
      'KEY_RIGHT':     39,
      'KEY_TAB':       9,
      'KEY_UP':        38,
      'updateGenerics': Node.updateGenerics
    });

    return Event;
  })();

  /*--------------------------------------------------------------------------*/

  (function(Event) {

    var stopObserving,

    BUGGY_EVENT_TYPES = { 'error': 1, 'load': 1 },

    CLICK_MAP  = { 'L': 1, 'M': 2, 'R': 3 },

    CLICK_PROP = 'which',

    plugin = Event.plugin,

    arrIndexOf = (function(fn) {
      return fn && fn.raw || function(value) {
        var length = this.length;
        while (length--) {
          if (this[length] === value) return length;
        }
        return -1;
      };
    })(fuse.Array.plugin.indexOf),

    defineIsClick = function() {
      var object = this.raw ? plugin : this,

      isLeftClick = function isLeftClick() {
        var event = this.raw;
        return (this.isLeftClick = createGetter('isLeftClick',
          !!event && event[CLICK_PROP] == CLICK_MAP.L))();
      },

      isMiddleClick = function isMiddleClick() {
        var event = this.raw;
        return (this.isMiddleClick = createGetter('isMiddleClick',
          !!event && event[CLICK_PROP] == CLICK_MAP.M))();
      },

      isRightClick = function isRightClick() {
        var event = this.raw;
        return (this.isRightClick = createGetter('isRightClick',
          !!event && event[CLICK_PROP] == CLICK_MAP.R))();
      };

      if (this.raw && typeof this.raw.which == 'number') {
        // simulate a middle click by pressing the Apple key in Safari 2.x
        if (typeof this.raw.metaKey == 'boolean') {
          isMiddleClick = function isMiddleClick() {
            var event = this.raw, which = event && event.which;
            return (this.isMiddleClick = createGetter('isMiddleClick',
              which == CLICK_MAP.L ? event.metaKey : which == CLICK_MAP.M))();
          };
        }
      }
      // for IE
      // check for `button` second for browsers that have `which` and `button`
      // compatibility charts found at http://unixpapa.com/js/mouse.html
      else if (this.raw && typeof this.raw.button == 'number') {
        CLICK_MAP  = { 'L': 1, 'M': 4, 'R': 2 };
        CLICK_PROP = 'button';
      }
      // fallback
      else {
        isLeftClick   = createGetter('isLeftClick',   false);
        isMiddleClick = createGetter('isMiddleClick', false);
        isRightClick  = createGetter('isRightClick',  false);
      }

      object.isLeftClick   = isLeftClick;
      object.isMiddleClick = isMiddleClick;
      object.isRightClick  = isRightClick;

      object = null;
      return this[arguments[0]]();
    },

    definePointerXY = function() {
      var info = fuse._info,

      currTarget = this.getCurrentTarget(),

      doc = getDocument(currTarget.raw || currTarget),

      object = this.raw && doc[info.root.property] &&
        doc[info.scrollEl.property] ? plugin : this,

      // defacto standard
      getPointerX = function getPointerX() {
        return (this.getPointerX = createGetter('getPointerX',
          this.raw && this.raw.pageX || 0))();
      },

      getPointerY = function getPointerY() {
        return (this.getPointerY = createGetter('getPointerY',
          this.raw && this.raw.pageY || 0))();
      };

      // fired events have no raw
      if (!this.raw) {
        getPointerX = createGetter('getPointerX', 0);
        getPointerY = createGetter('getPointerY', 0);
      }
      // IE and others
      if (typeof this.raw.pageX !== 'number') {
        getPointerX = function getPointerX() {
          var currTarget, doc, root, scrollEl, x = 0;
          if (this.raw) {
            currTarget = this.getCurrentTarget();
            doc = getDocument(currTarget.raw || currTarget);
            root = doc[info.root.property];
            scrollEl = doc[info.scrollEl.property];
            x = this.raw.clientX + scrollEl.scrollLeft - root.clientLeft;
            if (x < 0) x = 0;
          }
          this.getPointerX = createGetter('getPointerX', x);
          return x;
        };

        getPointerY = function getPointerY() {
          var currTarget, doc, root, scrollEl, y = 0;
          if (this.raw) {
            currTarget = this.getCurrentTarget();
            doc = getDocument(currTarget.raw || currTarget);
            root = doc[info.root.property];
            scrollEl = doc[info.scrollEl.property];
            y = this.raw.clientY + scrollEl.scrollTop - root.clientTop;
            if (y < 0) y = 0;
          }
          this.getPointerY = createGetter('getPointerY', y);
          return y;
        };
      }

      object.getPointerX = getPointerX;
      object.getPointerY = getPointerY;

      currTarget = doc = object = null;
      return this[arguments[0]]();
    },

    addCache = function(element, type, handler, id) {
      id || (id = getFuseId(element));
      var data, result = false, ec = getOrCreateCache(id, type);

      ec.handlers.push(handler);
      if (!ec.dispatcher) {
        (data = domData[id]).decorator || data.raw || (data.raw = element);
        ec.dispatcher = Event._createDispatcher(id, type);
        result = ec.dispatcher;
      }
      return result;
    },

    addDispatcher = function(element, type, dispatcher, id) {
      id || (id = getFuseId(element));
      var data, result, ec = getOrCreateCache(id, type);

      if (result = !ec.dispatcher) {
        (data = domData[id]).decorator || data.raw || (data.raw = element);
        addObserver(element, type,
          (ec.dispatcher = dispatcher || Event._createDispatcher(id, type)));
      }
      return result;
    },

    addObserver = function(element, type, handler) {
      element.addEventListener(type, handler, false);
    },

    getOrCreateCache = function(id, type) {
      var data = domData[id], events = data.events || (data.events = { });
      return events[type] || (events[type] = { 'handlers': [], 'dispatcher': false });
    },

    getEventTarget = function(decorator) {
      getEventTarget = function(decorator) {
        var currRaw, type,
         event = decorator.raw,
         currTarget = decorator.getCurrentTarget(),
         node = currTarget;

        if (event) {
          currRaw = currTarget.raw || currTarget;
          node = event.target || currTarget;
          type = event.type;

          // 1) Firefox screws up the "load" and "error" events on images
          // 2) Firefox also screws up the "click" event when
          //    moving between radio buttons via arrow keys.
          // 3) Force window to return window
          if (BUGGY_EVENT_TYPES[type] ||
              (getNodeName(currRaw) == 'INPUT' &&
              currRaw.type == 'radio' && type == 'click') ||
              currRaw == getWindow(currRaw)) {
            node = currTarget;
          }
          // Fix a Safari bug where a text node gets passed as the target of an
          // anchor click rather than the anchor itself.
          else if (node.nodeType == TEXT_NODE) {
            node = node.parentNode;
          }
        }
        return node;
      };

      if (typeof decorator.raw.target == 'undefined') {
        getEventTarget = function(decorator) {
          var node, event = decorator.raw;
          if (event) {
            node = event.srcElement;
          }
          if (!node) {
            node = decorator.getCurrentTarget();
          }
          return node;
        };
      };
      return getEventTarget(decorator);
    },

    removeObserver = function(element, type, handler) {
      element.removeEventListener(type, handler, false);
    };

    /*------------------------------------------------------------------------*/

    if (!envTest('ELEMENT_ADD_EVENT_LISTENER')) {
      // JScript
      if (envTest('ELEMENT_ATTACH_EVENT')) {
        addObserver = function(element, type, handler) {
          element.attachEvent('on' + type, handler);
        };

        removeObserver =  function(element, type, handler) {
          element.detachEvent('on' + type, handler);
        };
      }
      // DOM Level 0
      else {
        addObserver = function(element, type, handler) {
          var attrName = 'on' + type, id = getFuseId(element),
           oldHandler = element[attrName];

          if (oldHandler) {
            if (oldHandler._isDispatcher) return false;
            addCache(element, type, element[attrName], id);
          }
          element[attrName] = domData[id].events[type].dispatcher;
        };

        removeObserver = function(element, type, handler) {
          var attrName = 'on' + type;
          if (element[attrName] == handler) {
            element[attrName] = null;
          }
        };
      }
    }

    /*------------------------------------------------------------------------*/

    plugin.cancel = function cancel() {
      var setCancelled = function(object) {
        object.isCancelled = createGetter('isCancelled', true);
        return object;
      },

      cancel = function cancel() {
        this.raw && this.raw.preventDefault();
        return setCancelled(this);
      };

      // fired events have no raw
      if (this.raw) {
        // for IE
        if (typeof this.raw.preventDefault == 'undefined') {
          cancel = function cancel() {
            if (this.raw) this.raw.returnValue = false;
            return setCancelled(this);
          };
        }
        plugin.cancel = cancel;
        return this.cancel();
      }
      return setCancelled(this);
    };

    plugin.stopBubbling = function stopBubbling() {
      var setBubbling = function(object) {
        object.isBubbling = createGetter('isBubbling', false);
        return object;
      },

      stopBubbling = function stopBubbling() {
        this.raw && this.raw.stopPropagation();
        return setBubbling(this);
      };

      // fired events have no raw
      if (this.raw) {
        // for IE
        if (typeof this.raw.stopPropagation == 'undefined') {
          stopBubbling = function stopBubbling() {
            if (this.raw) this.raw.cancelBubble = true;
            return setBubbling(this);;
          };
        }
        plugin.stopBubbling = stopBubbling;
        return this.stopBubbling();
      }
      return setBubbling(this);
    };

    plugin.getTarget = function getTarget() {
      var setTarget = function(object, value) {
        object.getTarget = createGetter('getTarget', value);
        return value;
      },

      getTarget = function getTarget() {
        var node = getEventTarget(this);
        return setTarget(this, node && fromElement(node));
      };

      // fired events have no raw
      if (!this.raw) {
        return setTarget(this, this.getCurrentTarget());
      }
      plugin.getTarget = getTarget;
      return this.getTarget();
    };

    plugin.getRelatedTarget = function getRelatedTarget() {
      var setRelatedTarget = function(object, value) {
        object.getRelatedTarget = createGetter('getRelatedTarget', value);
        return value;
      },

      getRelatedTarget = function getRelatedTarget() {
        var node = this.raw && this.raw.relatedTarget;
        return setRelatedTarget(this, node && fromElement(node));
      };

      // fired events have no raw
      if (!this.raw) {
        return setRelatedTarget(this, null);
      }
      // for IE
      if (typeof this.raw.relatedTarget == 'undefined') {
        getRelatedTarget = function getRelatedTarget() {
          var node = null, event = this.raw;
          switch (event && event.type) {
            case 'mouseover': node = fromElement(event.fromElement);
            case 'mouseout':  node = fromElement(event.toElement);
          }
          return setRelatedTarget(this, node);
        };
      }

      plugin.getRelatedTarget = getRelatedTarget;
      return this.getRelatedTarget();
    };

    plugin.getPointerX = function getPointerX() {
      return definePointerXY.call(this, 'getPointerX');
    };

    plugin.getPointerY = function getPointerY() {
      return definePointerXY.call(this, 'getPointerY');
    };

    plugin.getPointer = function getPointer() {
      return { 'x': this.getPointerX(), 'y': this.getPageY() };
    };

    plugin.findElement = function findElement(selectors, untilElement) {
      var decorator, match = fuse.dom.selector.match,
       element = this.getTarget == plugin.getTarget ? getEventTarget(this) : this.getTarget();

      if (element.raw) {
        decorator = element;
        element = element.raw;
      }
      if (element != untilElement) {
        if (!selectors || selectors == '' || match(element, selectors)) {
          return decorator || fromElement(element);
        }
        if (element = element.parentNode) {
          do {
            if (element == untilElement)
              break;
            if (element.nodeType == ELEMENT_NODE && match(element, selectors))
              return fromElement(element);
          } while (element = element.parentNode);
        }
      }
      return null;
    };

    plugin.isLeftClick = function isLeftClick() {
      return defineIsClick.call(this, 'isLeftClick');
    };

    plugin.isMiddleClick = function isMiddleClick() {
      return defineIsClick.call(this, 'isMiddleClick');
    };

    plugin.isRightClick = function isRightClick() {
      return defineIsClick.call(this, 'isRightClick');
    };

    plugin.stop = function stop() {
      // set so that a custom event can be inspected
      // after the fact to determine whether or not it was stopped.
      this.isStopped = createGetter('isStopped', true);
      this.cancel();
      this.stopBubbling();
      return this;
    };

    plugin.isCancelled = createGetter('isCancelled', false);
    plugin.isStopped   = createGetter('isStopped',   false);
    plugin.isBubbling  = createGetter('isBubbling',  true);

    /*------------------------------------------------------------------------*/

    HTMLDocument.plugin.isLoaded =
      createGetter('isLoaded', false);

    Window.plugin.fire =
    HTMLDocument.plugin.fire =
    HTMLElement.plugin.fire  = function fire(type, memo, event) {
      var backup, checked, dispatcher, ec, data, id,
       first    = true,
       element  = this.raw || this,
       attrName = 'on' + type;

      event = Event(event || null, element);
      event.type = type && String(type);
      event.memo = memo || event.memo || { };

      // change checked state before calling handlers
      if (type == 'click' && getNodeName(element) == 'INPUT' &&
          CHECKED_INPUT_TYPES[element.type]) {
        checked = element.checked;
        element.checked = !checked;
      }

      do {
        id   = element.nodeType == ELEMENT_NODE ? element[DATA_ID_PROP] : getFuseId(element);
        data = id && domData[id];
        ec   = data && data.events && data.events[type];

        // fire DOM Level 0
        if (typeof element[attrName] == 'function' &&
            !element[attrName]._isDispatcher) {
          // stop event if handler result is false
          if (element[attrName](event) === false) {
            event.stop();
          }
        }
        // fire DOM Level 2
        if (event.isBubbling() &&
           (dispatcher = ec && ec.dispatcher)) {
          dispatcher(event);
        }
        // default action
        if (first) {
          first = false;

          if (event.isCancelled()) {
            // restore previous checked value
            if (checked != null) {
              element.checked = checked;
            }
          }
          else if (isHostType(element, type)) {
            // temporarily remove handler so its not triggered
            if (typeof element[attrName] == 'function') {
              backup = element[attrName];
              element[attrName] = null;
            }
            // trigger default action
            element[type]();

            // ensure checked didn't change
            if (checked != null) {
              element.checked = !checked;
            }
            // restore backup
            if (backup) {
              element[attrName] = backup;
            }
          }
        }
        // stop propagating
        if (!event.isBubbling()) {
          break;
        }
      } while (element = element.parentNode);

      return event;
    };

    Window.plugin.observe =
    HTMLDocument.plugin.observe =
    HTMLElement.plugin.observe  = function observe(type, handler) {
      var element = this.raw || this,
       dispatcher = addCache(element, type, handler);

      if (!dispatcher) return this;
      addObserver(element, type, dispatcher);
      return this;
    };

    stopObserving =
    Window.plugin.stopObserving =
    HTMLDocument.plugin.stopObserving =
    HTMLElement.plugin.stopObserving  = function stopObserving(type, handler) {
      var ec, foundAt, length,
       element = this.raw || this,
       id      = getFuseId(this),
       events  = domData[id].events;

      if (!events) return this;
      type = isString(type) ? type && String(type) : null;

      // if the event type is omitted we stop
      // observing all handlers on the element
      if (!type) {
        eachKey(events, function(handlers, type) {
          stopObserving.call(element, type);
        });
        return this;
      }
      if (ec = events[type]) {
        // if the handler is omitted we stop
        // observing all handlers of that type
        if (handler == null) {
          length = ec.handlers.length || 1;
          while (length--) stopObserving.call(element, type, length);
          return this;
        }
      } else {
        // bail when no event data
        return this;
      }

      if (isNumber(handler)) {
        // bail if handler is a delegator
        foundAt = handler;
        handler = ec.handlers[foundAt];
        if (handler && handler._delegatee) {
          foundAt = -1;
        }
      } else {
        foundAt = arrIndexOf.call(ec.handlers, handler);
      }

      if (foundAt < 0) return this;

      // remove handler
      ec.handlers.splice(foundAt, 1);

      // if no more handlers and not bubbling for
      // delegation then remove the event type data and dispatcher
      if (!ec.handlers.length && !ec._isBubblingForDelegation) {
        removeObserver(element, type, ec.dispatcher);
        delete events[type];
      }
      return this;
    };

    // expose implied private methods
    Event._addDispatcher = addDispatcher;
    Event._createGetter  = createGetter;

    // prevent JScript bug with named function expressions
    var cancel =        null,
     fire =             null,
     findElement =      null,
     getPointer  =      null,
     getPointerX =      null,
     getPointerY =      null,
     getRelatedTarget = null,
     getTarget =        null,
     isBubbling =       null,
     isCancelled =      null,
     isLeftClick =      null,
     isLoaded =         null,
     isMiddleClick =    null,
     isRightClick =     null,
     isStopped =        null,
     observe =          null,
     preventDefault =   null,
     stop =             null,
     stopBubbling =     null;
  })(fuse.dom.Event);
  /*---------------------------- EVENT: DELEGATE -----------------------------*/

  (function(plugin) {

    var BUTTON_TYPES    = { 'image': 1, 'reset': 1, 'submit': 1 },

    REAL_EVENT_TYPE     = { 'delegate:blur': 'blur', 'delegate:focus': 'focus' },

    CHANGEABLE_ELEMENTS = { 'INPUT': 1, 'SELECT': 1, 'TEXTAREA': 1 },

    NON_BUBBLING_EVENTS = { 'delegate:blur': 1, 'delegate:focus': 1 },

    PROBLEM_ELEMENTS = {
      'LABEL':    1,
      'BUTTON':   1,
      'INPUT':    1,
      'SELECT':   1,
      'TEXTAREA': 1
    },

    Event = fuse.dom.Event,

    addDispatcher = Event._addDispatcher,

    addWatcher = NOOP,

    removeWatcher = NOOP,

    getFuseId = Node.getFuseId,

    addBubbler = function(element, id, type) {
      // initialize event type data if it isn't
      var events = domData[id] && domData[id].events;
      if (!events || !events[type]) {
        addDispatcher(element, type, null, id);
        events = domData[id].events;
      }
      // flag event system to manually bubble after all the
      // element's handlers for the event type have been executed
      events[type]._isBubblingForDelegation = true;
    },

    createHandler = function(selector, delegatee) {
      // normal usage
      if (selector) {
        return function(event) {
          var type, match = event.findElement(selector, this.raw || this);
          if (match) {
            type = event.type;
            if (type = REAL_EVENT_TYPE[type]) {
              event.type = type;
              event.stopBubbling();
            }
            event.getDelegator = createGetter('getDelegator', this);
            event.getCurrentTarget = createGetter('getCurrentTarget', match);
            return delegatee.call(match, event);
          }
        };
      }
      // power usage
      return function(event) {
        type = event.type;
        if (type = REAL_EVENT_TYPE[type]) {
          event.type = type;
          event.stopBubbling();
        }
        return delegatee.call(this, event);
      };
    },

    // for IE
    onBeforeActivate = function() {
      var id, data, form, type,
       target = window.event.srcElement,
       nodeName = target && getNodeName(target);

      // ensure we patch the elements event data only once
      if (PROBLEM_ELEMENTS[nodeName]) {
        id = getFuseId(target);
        data = domData[id];
        if (!data._isPatchedForDelegation) {
          // form controls
          if (nodeName != 'FORM') {
            if (CHANGEABLE_ELEMENTS[nodeName] && !BUTTON_TYPES[target.type]) {
              addBubbler(target, id, 'change');
            }
            addBubbler(target, id, 'blur');
            addBubbler(target, id, 'focus');
            data._isPatchedForDelegation = true;
          }
          // form element
          if (form = target.form || target) {
            if (form != target) {
              id   = getFuseId(form);
              data = domData[id];
            }
            if (!data._isPatchedForDelegation) {
              addBubbler(form, id, 'reset');
              addBubbler(form, id, 'submit');
              data._isPatchedForDelegation = true;
            }
          }
        }
      }
    },

    // for others
    onCapture = function(event) {
      var data, id, target = (event.raw || event).target;
      if (PROBLEM_ELEMENTS[getNodeName(target)]) {
        id = getFuseId(target);
        data = domData[id];
        if (!data._isPatchedForDelegation) {
          addBubbler(target, id, 'blur');
          addBubbler(target, id, 'focus');
          data._isPatchedForDelegation = true;
        }
      }
    };

    // DOM Level 2
    if (envTest('ELEMENT_ADD_EVENT_LISTENER')) {
      addWatcher = function(element, data) {
        element.addEventListener('focus', onCapture, true);
        (data || domData[getFuseId(element)])._isWatchingDelegation = true;
      };

      removeWatcher = function(element, data) {
        element.removeEventListener('focus', onCapture, true);
        delete (data || domData[getFuseId(element)])._isWatchingDelegation;
      };
    }
    // JScript
    else if (envTest('ELEMENT_ATTACH_EVENT')) {
      PROBLEM_ELEMENTS.FORM =
      NON_BUBBLING_EVENTS.change =
      NON_BUBBLING_EVENTS.reset  =
      NON_BUBBLING_EVENTS.submit = 1;

      addWatcher = function(element, data) {
        element.attachEvent('onbeforeactivate', onBeforeActivate);
        (data || domData[getFuseId(element)])._isWatchingDelegation = true;
      };

      removeWatcher = function(element, data) {
        element.detachEvent('onbeforeactivate', onBeforeActivate);
        delete (data || domData[getFuseId(element)])._isWatchingDelegation;
      };
    }

    plugin.delegate =
    HTMLDocument.plugin.delegate = function delegate(type, selector, delegatee) {
      var handler,element = this.raw || this,
       id = getFuseId(this), data = domData[id];

      // juggle arguments
      if (typeof selector == 'function') {
        delegatee = selector;
        selector = null;
      }

      handler = createHandler(selector, delegatee);
      handler._delegatee = delegatee;
      handler._selector  = selector;

      type = EVENT_TYPE_ALIAS[type] || type;
      plugin.observe.call(this, type, handler);

      // if not already watching on the element, add a watcher for
      // non-bubbling events to signal the event system when manual
      // bubbling is needed
      if (NON_BUBBLING_EVENTS[type] && !data._isWatchingDelegation) {
        addWatcher(element, data);
      }
      return this;
    };

    plugin.stopDelegating =
    HTMLDocument.plugin.stopDelegating = function stopDelegating(type, selector, delegatee) {
      var ec, handler, handlers, i = -1,
       element = this.raw || this,
       isEmpty = true,
       id      = getFuseId(this),
       data    = domData[id];
       events  = data.events;

      if (!events) return this;
      if (!isString(type)) type = null;

      type = EVENT_TYPE_ALIAS[type] || type && String(type);
      selector && (selector = String(selector));

      // if the event type is omitted we stop
      // observing all delegatees on the element
      if (!type) {
        eachKey(events, function(handlers, type) {
          plugin.stopDelegating.call(element, type);
        });
        return this;
      }
      if (ec = events[type]) {
        handlers = ec.handlers;

        // if told exactly which delegatee to remove
        if (isNumber(delegatee)) {
          plugin.stopObserving.call(this, type, delegatee);
        }
        else if (selector) {
          // if nothing is omitted
          if (delegatee) {
            while (handler = handlers[++i]) {
              if (handler._delegatee == delegatee && handler._selector == selector) {
                plugin.stopObserving.call(this, type, handler);
                break;
              }
            }
          }
          // if the handler is omitted we stop observing
          // all delegatees of that type and selector
          else {
            while (handler = handlers[++i]) {
              if (handler._selector == selector) {
                delete handler._delegatee;
                stopDelegating.call(this, type, selector, i);
              }
            }
            return this;
          }
        }
        // if the selector is omitted we stop
        // observing all delegatees of that type
        else {
          while (handler = handlers[++i]) {
            if (handler._delegatee) {
              delete handler._delegatee;
              stopDelegating.call(this, type, null, i);
            }
          }
          return this;
        }
      } else  {
        // bail when no event data
        return this;
      }

      // detect if event data is empty
      eachKey(events, function(handlers) {
        if (handlers.length) return (isEmpty = false);
      });

      // if no handlers for any events then remove the watcher
      if (isEmpty) {
        removeWatcher(element, data);
      }
      return this;
    };

    // expose implied private method
    Event._addWatcher = addWatcher;

    // prevent JScript bug with named function expressions
    var delegate = null, stopDelegating = null;
  })(HTMLElement.plugin);

  /*------------------------------ LANG: CONSOLE -----------------------------*/

  fuse.addNS('console');

  (function(console) {

    var logger, object,

    error = fuse.Function.FALSE,

    info = error,

    log = error,

    hasGlobalConsole = (
      isHostType(window, 'console') &&
      isHostType(window.console, 'info') &&
      isHostType(window.console, 'error')),

    hasOperaConsole = (
      isHostType(window, 'opera') &&
      isHostType(window.opera, 'postError')),

    hasJaxerConsole = (
      isHostType(window, 'Jaxer') &&
      isHostType(window.Jaxer, 'Log') &&
      isHostType(window.Jaxer.Log, 'info') &&
      isHostType(window.Jaxer.Log, 'error')),

    consoleWrite = function(type, message) {
      var doc = fuse._doc,
       consoleElement = doc.createElement('div'),
       textNode = doc.createTextNode('');

      consoleElement.id = 'fusejs-console';
      fuse._body.appendChild(consoleElement)
       .appendChild(doc.createElement('pre'))
       .appendChild(textNode);

      consoleWrite = function(type, message) {
        // append text and scroll to bottom of console
        var top = textNode.data ? consoleElement.scrollHeight : 0;
        textNode.data += type + ': ' + message + '\r\n';
        consoleElement.scrollTop = top;
      };
      return consoleWrite(type, message);
    };

    if (hasOperaConsole) {
      object = window.opera;

      info = function info(message) {
        object.postError('Info: ' + message);
      };

      log = function log(message) {
        object.postError('Log: ' + message);
      };

      error = function error(message, exception) {
        object.postError(['Error: ' + message + '\n', exception]);
      };
    }
    else if (hasGlobalConsole || hasJaxerConsole) {
      object = hasGlobalConsole ? window.console : window.Jaxer.Log;
      logger = isHostType(object, 'log') ? 'log' :
        isHostType(object, 'debug') ? 'debug' : 'info';

      info = function info(message) {
        object.info(message);
      };

      log = function log(message) {
        object[logger](message);
      };

      error = function error(message, exception) {
        object.error(message, exception);
      };
    }
    else if (fuse._doc) {
      info = function info(message) {
        consoleWrite('Info', message);
      };

      log = function log(message) {
        consoleWrite('Log', message);
      };

      error = function error(message, error) {
        var result = message ? [message] : [];
        if (error) {
          result.push(
            '[Error:',
            'name: '    + error.name,
            'message: ' + (error.description || error.message),
            ']');
        }
        consoleWrite('Error', result.join('\r\n'));
      };
    }

    console.error = error;
    console.info  = info;
    console.log   = log;
  })(fuse.console);
  /*----------------------------- LANG: ES5 BUGS -----------------------------*/

  (function() {

   var arrPlugin  = fuse.Array.plugin,
    funcPlugin    = fuse.Function.plugin,
    regPlugin     = fuse.RegExp.plugin,
    strPlugin     = fuse.String.plugin,
    __apply       = funcPlugin.apply,
    __call        = funcPlugin.call,
    __concat      = arrPlugin.concat,
    __exec        = regPlugin.exec,
    __lastIndexOf = strPlugin.lastIndexOf,
    __match       = strPlugin.match,
    __replace     = strPlugin.replace,
    __search      = strPlugin.search,
    __slice       = arrPlugin.slice,
    __split       = strPlugin.split,
    __test        = regPlugin.test,
    __trim        = strPlugin.trim,
    __trimLeft    = strPlugin.trimLeft,
    __trimRight   = strPlugin.trimRight,
    rawExec       = __exec.raw,
    reOptCapture  = /\)[*?]/,
    regExec       = rawExec,
    sMap          = fuse.RegExp.SPECIAL_CHARS.s,
    strReplace    = __replace.raw,

    apply = function apply(thisArg) {
      if (thisArg == null) throw new TypeError;
      return __apply.apply(this, arguments);
    },

    call = function call(thisArg) {
      if (thisArg == null) throw new TypeError;
      return arguments.length > 1
        ? __call.apply(this, arguments)
        : __call.call(this, thisArg);
    },

    // enforce ES5 rules for Array and String methods
    // where `this` cannot be undefined or null
    wrapApplyAndCall = function(object) {
      eachKey(object, function(value, key) {
        if (hasKey(object, key)) {
          object[key].call = call;
          object[key].apply = apply;
        }
      });
    },

    ARRAY_CONCAT_ARGUMENTS_BUGGY = (function() {
      // true for Opera
      var array = [];
      return array.concat && array.concat(arguments).length == 2;
    })(1, 2),

    ARRAY_SLICE_EXLUDES_TRAILING_UNDEFINED_INDEXES = (function() {
      // true for Opera 9.25
      var array = [1]; array[2] = 1;
      return array.slice && array.slice(0, 2).length == 1;
    })(),

    // true for IE; String#match is affected too
    REGEXP_EXEC_RETURNS_UNDEFINED_VALUES_AS_STRINGS =
      typeof /x(y)?/.exec('x')[1] == 'string',

    REGEXP_INCREMENTS_LAST_INDEX_AFTER_ZERO_LENGTH_MATCHES = (function() {
      // true for IE
      var pattern = /^/g, data = [];
      data[0] = !!pattern.test('').lastIndex;
      ''.match(pattern);
      data[1] = !!pattern.lastIndex;
      return data[0] || data[1];
    })(),

    // true for Chrome 1-2 and Opera 9.25
    STRING_LAST_INDEX_OF_BUGGY_WITH_NEGATIVE_OR_NAN_POSITION =
      'xox'.lastIndexOf('x', -1) != 0 ||  'xox'.lastIndexOf('x', +'x') != 2,

    STRING_METHODS_WRONGLY_SET_REGEXP_LAST_INDEX = (function() {
      // true for IE
      var string = 'oxo', data = [], pattern = /x/;
      string.replace(pattern, '');
      data[0] = !!pattern.lastIndex;
      string.match(pattern);
      data[1] = !!pattern.lastIndex;
      string.search(pattern);
      data[2] = !!pattern.lastIndex;
      return data[0] || data[1] || data[2];
    })(),

    STRING_REPLACE_BUGGY_WITH_GLOBAL_FLAG_AND_EMPTY_PATTERN = (function() {
      // true for Chrome 1
      var string = 'xy', replacement = function() { return 'o'; };
      return !(string.replace(/()/g, 'o') == 'oxoyo' &&
        string.replace(new RegExp('', 'g'), replacement) == 'oxoyo' &&
        string.replace(/(y|)/g, replacement) == 'oxoo');
    })(),

    STRING_REPLACE_PASSES_UNDEFINED_VALUES_AS_STRINGS = (function() {
      // true for Firefox
      var result;
      'x'.replace(/x(y)?/, function(x, y) { result = typeof y == 'string'; });
      return result;
    })(),

    STRING_SPLIT_RETURNS_UNDEFINED_VALUES_AS_STRINGS = (function() {
      // true for Firefox
      var result = 'oxo'.split(/x(y)?/);
      return result.length == 3 && typeof result[1] == 'string';
    })(),

    STRING_SPLIT_ZERO_LENGTH_MATCH_RETURNS_NON_EMPTY_ARRAY =
      !!''.split(/^/).length,

    STRING_TRIM_INCOMPLETE = (function() {
      // true for Firefox
      var key, whitespace = '';
      for (key in sMap) whitespace += key;
      return !isFunction(whitespace.trim) || !!whitespace.trim();
    })();

    /*------------------------------------------------------------------------*/

    // Opera's implementation of Array.prototype.concat treats a functions arguments
    // object as an array so we overwrite concat to fix it.
    // ES5 15.4.4.4
    if (ARRAY_CONCAT_ARGUMENTS_BUGGY) {
      var concat =
      arrPlugin.concat = function concat() {
        var item, itemLen, j, i = -1,
         Array = concat[ORIGIN].Array,
         length = arguments.length,
         object = Object(this),
         result = isArray(object) ? Array.fromArray(object) : Array(object),
         n      = result.length;

        while (++i < length) {
          item = arguments[i];
          if (isArray(item)) {
            j = 0; itemLen = item.length;
            for ( ; j < itemLen; j++, n++) {
              if (j in item) result[n] = item[j];
            }
          } else {
            result[n++] = item;
          }
        }
        return result;
      };
      concat[ORIGIN] = fuse;
    }

    // ES5 15.4.4.10
    if (ARRAY_SLICE_EXLUDES_TRAILING_UNDEFINED_INDEXES) {
      arrPlugin.slice = function slice(start, end) {
        var endIndex, result, object = Object(this),
         length = object.length >>> 0;

        end = typeof end == 'undefined' ? length : toInteger(end);
        endIndex = end - 1;

        if (end > length || endIndex in object) {
          return __slice.call(object, start, end);
        }
        object[endIndex] = undef;
        result = __slice.call(object, start, end);
        delete object[endIndex];
        return result;
      };
    }

    /*------------------------------------------------------------------------*/

    // For IE
    // Based on work by Steve Levithan
    if (REGEXP_EXEC_RETURNS_UNDEFINED_VALUES_AS_STRINGS ||
        REGEXP_INCREMENTS_LAST_INDEX_AFTER_ZERO_LENGTH_MATCHES) {
      reExec =
      regPlugin.exec = function exec(string) {
        var cache, exec = __exec;
        if (reOptCapture.test(this.source)) {
          cache = { };
          exec  = function exec(string) {
            var backup, result, pattern = this, source = pattern.source;
            if (result = __exec.call(pattern, string)) {
              // convert to non-window regexp
              if (pattern.global) {
                if (cache.source != source) {
                  cache = new RegExp(source,
                    (pattern.ignoreCase ? 'i' : '') +
                    (pattern.multiline  ? 'm' : ''));
                }
                pattern = cache;
              }
              // using `slice(result.index)` rather than `result[0]` in case
              // lookahead allowed matching due to characters outside the match
              strReplace.call(result.input.slice(result.index), pattern, function() {
                var i = -1, length = arguments.length - 2;
                while (++i < length) {
                  if (arguments[i] === undef)
                    result[i] = undef;
                }
              });
            }
            return result;
          };
        } else if (this.global) {
          exec = function exec(string) {
            var pattern = this, result = __exec.call(pattern, string);
            if (result && !result[0].length && result.lastIndex > result.index) {
              pattern.lastIndex--;
            }
            return result;
          };
        }

        // lazy define
        exec.raw = __exec.raw;
        this.exec = exec;
        return this.exec(string);
      };
    }

    // For IE
    if (REGEXP_INCREMENTS_LAST_INDEX_AFTER_ZERO_LENGTH_MATCHES) {
      regPlugin.test = function test(string) {
        var test = __test;
        if (this.global) {
          test = function test(string) {
            var pattern = this, match = rawExec.call(pattern, string);
            if (match && !match[0].length && pattern.lastIndex > match.index) {
              pattern.lastIndex--;
            }
            return !!match;
          };

          test.raw = __test;
        }
        // lazy define
        this.test = test;
        return this.test(string);
      };

      regPlugin.test.raw = __test;
    }

    /*------------------------------------------------------------------------*/

    // For Chrome 1-2 and Opera 9.25
    if (STRING_LAST_INDEX_OF_BUGGY_WITH_NEGATIVE_OR_NAN_POSITION) {
      strPlugin.lastIndexOf = function lastIndexOf(searchString, position) {
        return isNaN(position)
          ? __lastIndexOf.call(this, searchString)
          : __lastIndexOf.call(this, searchString, position < 0 ? 0 : position);
      };
    }

    // ES5 15.5.4.10
    // For IE
    if (STRING_METHODS_WRONGLY_SET_REGEXP_LAST_INDEX ||
        REGEXP_EXEC_RETURNS_UNDEFINED_VALUES_AS_STRINGS) {
      strPlugin.match = function match(pattern) {
        var result = __match.call(this, pattern);
        if (isRegExp(pattern)) {
          if (!pattern.global && reOptCapture.test(pattern)) {
            // ensure undefined values are not turned to empty strings
            strReplace.call(this, pattern, function() {
              var i = -1, length = arguments.length - 2;
              while (++i < length) {
                if (arguments[i] === undef)
                  result[i] = undef;
              }
            });
          }
          pattern.lastIndex = 0;
        }
        return result;
      };
    }

    // ES5 15.5.4.11
    // For Safari 2.0.2- and Chrome 1+
    // Based on work by Dean Edwards:
    // http://code.google.com/p/base2/source/browse/trunk/lib/src/base2-legacy.js?r=239#174
    if (envTest('STRING_REPLACE_COERCE_FUNCTION_TO_STRING') ||
        STRING_REPLACE_BUGGY_WITH_GLOBAL_FLAG_AND_EMPTY_PATTERN) {
      strReplace =
      strPlugin.replace = function replace(pattern, replacement) {
        if (typeof replacement != 'function') {
          return __replace.call(this, pattern, replacement);
        }
        if (!isRegExp(pattern)) {
          pattern = new RegExp(escapeRegExpChars(pattern));
        }

        // set pattern.lastIndex to 0 before we perform string operations
        var match,
         index     = 0,
         nonGlobal = !pattern.global,
         result    = '',
         source    = String(this),
         srcLength = source.length,
         lastIndex = pattern.lastIndex = 0;

        while (match = regExec.call(pattern, source)) {
          index = match.index;
          result += source.slice(lastIndex, index);

          // set lastIndex before replacement call to avoid potential
          // pattern.lastIndex tampering
          lastIndex = index + match[0].length;
          match.push(index, source);
          result += replacement.apply(window, match);
          pattern.lastIndex = lastIndex;

          if (nonGlobal) {
            break;
          }
          // handle empty pattern matches like /()/g
          if (lastIndex == index) {
            if (lastIndex == srcLength) break;
            pattern.lastIndex = lastIndex++;
            result += source.charAt(lastIndex);
          }
        }
        // append the remaining source to the result
        if (lastIndex < srcLength) {
          result += source.slice(lastIndex, srcLength);
        }
        return fuse.String(result);
      };
    }

    // For Firefox
    if (STRING_REPLACE_PASSES_UNDEFINED_VALUES_AS_STRINGS) {
      var __replace2 = strPlugin.replace;
      strPlugin.replace = function replace(pattern, replacement) {
        if (typeof replacement == 'function' && isRegExp(pattern) &&
            reOptCapture.test(pattern.source)) {
          var __replacement = replacement;
          replacement = function(match) {
            var args, backup = pattern.lastIndex, length = arguments.length;
            pattern.lastIndex = 0;
            args = regExec.call(pattern, match);
            pattern.lastIndex = backup;
            args.push(arguments[length - 2], arguments[length - 1]);
            return __replacement.apply(window, args);
          };
        }
        return __replace2.call(this, pattern, replacement);
      };
    }

    // For IE
    if (STRING_METHODS_WRONGLY_SET_REGEXP_LAST_INDEX) {
      var __replace3 = strPlugin.replace;
      strPlugin.replace = function replace(pattern, replacement) {
        if (typeof replacement == 'function') {
          var __replacement = replacement;
          replacement = function() {
            // ensure string `null` and `undefined` are returned
            var result = __replacement.apply(window, arguments);
            return result || String(result);
          };
        }
        var result = __replace3.call(this, pattern, replacement);
        if (isRegExp(pattern)) pattern.lastIndex = 0;
        return result;
      };

      // ES5 15.5.4.12
      strPlugin.search = function search(pattern) {
        if (isRegExp(pattern)) {
          var backup = pattern.lastIndex,
           result = __search.call(this, pattern);
          pattern.lastIndex = backup;
          return result;
        }
        return __search.call(this, pattern);
      };
    }

    // ES5 15.5.4.14
    // For IE and Firefox
    // Based on work by Steve Levithan
    // http://xregexp.com/
    if (envTest('STRING_SPLIT_BUGGY_WITH_REGEXP') ||
        STRING_SPLIT_RETURNS_UNDEFINED_VALUES_AS_STRINGS) {
      strPlugin.split = function split(separator, limit) {
        // max limit Math.pow(2, 32) - 1
        limit = typeof limit == 'undefined' ? 4294967295 : limit >>> 0;
        if (!limit || !isRegExp(separator)) {
          return __split.call(this, separator, limit);
        }

        var backup, index, lastIndex, length, match, string, strLength, j,
         i = -1, lastLastIndex = 0, result = fuse.Array();

        string = fuse.String(this);
        strLength = string.length;

        if (!separator.global) {
          separator = new RegExp(separator.source, 'g' +
            (separator.ignoreCase ? 'i' : '') +
            (separator.multiline  ? 'm' : ''));
        } else {
          backup = separator.lastIndex;
          separator.lastIndex = 0;
        }

        while (match = regExec.call(separator, string)) {
          index  = match.index;
          length = match.length;

          // set separator.lastIndex because IE may report the wrong value
          lastIndex =
          separator.lastIndex = index + match[0].length;

          // only the first match at a given position of the string is considered
          // and if the regexp can match an empty string then don't match the
          // empty substring at the beginning or end of the input string
          if (lastIndex > lastLastIndex && index < strLength) {
            result[++i] = string.slice(lastLastIndex, index);
            if (result.length == limit) return result;

            // add capture groups
            j = 0;
            while (++j < length) {
              result[++i] = match[j] == null ? match[j] : fuse.String(match[j]);
              if (result.length == limit) break;
            }
            lastLastIndex = lastIndex;
          }
          // avoid infinite loop
          if (lastIndex == index) {
            separator.lastIndex++;
          }
        }

        // don't match empty substring at end if the input string is empty
        separator.lastIndex = 0;
        if (!(strLength == 0 && separator.test(''))) {
          result[++i] = string.slice(lastLastIndex);
        }
        if (backup != null) {
          separator.lastIndex = backup;
        }
        return result;
      };
    }
    // For Chrome 1+
    else if (STRING_SPLIT_ZERO_LENGTH_MATCH_RETURNS_NON_EMPTY_ARRAY) {
      strPlugin.split = function split(separator, limit) {
        var backup, result = __split.call(this, separator, limit);
        if (result && isRegExp(separator)) {
          if (separator.global) {
            backup = separator.lastIndex;
            separator.lastIndex = 0;
          }
          if (!String(this).length && separator.test('')) {
            result.length = 0;
          }
          if (backup != null) {
            separator.lastIndex = backup;
          }
        }
        return result;
      };
    }

    // ES5 15.5.4.20
    if (STRING_TRIM_INCOMPLETE) {
      strPlugin.trim = function trim() {
        var string = String(this),
         start = -1, end = string.length;

        if (!end) return fuse.String(string);
        while (sMap[string.charAt(++start)]) { };
        if (start == end) return fuse.String('');

        while (sMap[string.charAt(--end)]) { }
        return fuse.String(string.slice(start, end + 1));
      };

      // non-standard
      strPlugin.trimLeft = function trimLeft() {
        var string = String(this), start = -1;
        if (!string) return fuse.String(string);
        while (sMap[string.charAt(++start)]) { }
        return fuse.String(string.slice(start));
      };

      // non-standard
      strPlugin.trimRight = function trimRight() {
        var string = String(this), end = string.length;
        if (!end) return fuse.String(string);
        while (sMap[string.charAt(--end)]) { }
        return fuse.String(string.slice(0, end + 1));
      };
    }

    arrPlugin.concat.raw      = __concat.raw;
    arrPlugin.slice.raw       = __slice.raw;
    regPlugin.exec.raw        = __exec.raw;
    strPlugin.lastIndexOf.raw = __lastIndexOf.raw;
    strPlugin.match.raw       = __match.raw;
    strPlugin.replace.raw     = __replace.raw;
    strPlugin.search.raw      = __search.raw;
    strPlugin.split.raw       = __split.raw;
    strPlugin.trim.raw        = __trim.raw;
    strPlugin.trimLeft.raw    = __trimLeft.raw;
    strPlugin.trimRight.raw   = __trimRight.raw;

    // enforce ES5 rules for `this`
    wrapApplyAndCall(arrPlugin);
    wrapApplyAndCall(strPlugin);

    // prevent JScript bug with named function expressions
    var exec =     null,
     lastIndexOf = null,
     match =       null,
     replace =     null,
     search =      null,
     split =       null,
     test =        null,
     trim =        null,
     trimLeft =    null,
     trimRight =   null;
  })();
  /*------------------------------- LANG: GREP -------------------------------*/

  (function() {

    var grep =
    fuse.Array.plugin.grep = function grep(pattern, callback, thisArg) {
      var item, result, i = -1, Array = grep[ORIGIN].Array,
       object = Object(this), length = object.length >>> 0, result = Array();

      if (!pattern || pattern == '' || isRegExp(pattern) && !pattern.source) {
        result = Array.prototype.slice.call(object, 0);
      }
      else {
        result = Array();
        callback || (callback = IDENTITY);
        if (isString(pattern)) {
          pattern = new RegExp(escapeRegExpChars(pattern));
        }
        while (++i < length) {
          if (i in object && pattern.test(object[i]))
            result.push(callback.call(thisArg, object[i], i, object));
        }
      }
      return result;
    };

    grep[ORIGIN] = fuse;

    if (fuse.Class.mixins.enumerable) {
      fuse.Class.mixins.enumerable.grep = function grep(pattern, callback, thisArg) {
        if (!pattern || pattern == '' || isRegExp(pattern) &&!pattern.source) {
          return this.toArray();
        }
        var result = fuse.Array();
        if (isString(pattern)) {
          pattern = new RegExp(escapeRegExpChars(pattern));
        }
        callback || (callback = IDENTITY);
        this._each(function(value, index, iterable) {
          if (pattern.test(value))
            result.push(callback.call(thisArg, value, index, iterable));
        });
        return result;
      };
    }

    if (fuse.Hash) {
      fuse.Hash.plugin.grep = function grep(pattern, callback, thisArg) {
        if (!pattern || pattern == '' || isRegExp(pattern) && !pattern.source) {
          return this.clone();
        }
        var key, pair, value, i = 0, pairs = this._pairs, result = $H();
        if (isString(pattern)) {
          pattern = new RegExp(escapeRegExpChars(pattern));
        }
        callback || (callback = IDENTITY);
        while (pair = pairs[i++]) {
          if (pattern.test(value = pair[1]))
            result.set(key = pair[0], callback.call(thisArg, value, key, this));
        }
        return result;
      };
    }
  })();
  /*------------------------------- LANG: HTML -------------------------------*/

  (function(plugin) {

    var rawIndexOf = plugin.indexOf.raw,

    rawReplace = plugin.replace.raw,

    // tag parsing instructions:
    // http://www.w3.org/TR/REC-xml-names/#ns-using
    reTags = (function() {
      var name   = '[-\\w]+',
       space     = '[\\x20\\t\\n\\r]',
       eq        = space + '*=' + space + '*',
       charRef   = '&#[0-9]+;',
       entityRef = '&' + name + ';',
       reference = entityRef + '|' + charRef,
       attValue  = '"(?:[^<&"]|' + reference + ')*"|\'(?:[^<&\']|' + reference + ')*\'',
       attribute = '(?:' + name + eq + attValue + '|' + name + ')';

      return new RegExp('<'+ name + '(?:' + space + '+' + attribute + ')*' + space + '*/?>|' +
        '</' + name + space + '*>', 'g');
    })(),

    define = function() {
      var div     = fuse._div,
       container  = fuse._doc.createElement('pre'),
       textNode   = container.appendChild(fuse._doc.createTextNode('')),
       reEsAmp    = /&amp;/g,
       reEsLt     = /&lt;/g,
       reEsGt     = /&gt;/g,
       reUnAmp    = /&/g,
       reUnLt     = /</g,
       reUnGt     = />/g,
       reTokens   = /@fuseTagToken/g,
       swapTags   = [],

      getText = function() {
        return div.textContent;
      },

      swapTagsToTokens = function(tag) {
        swapTags.unshift(tag);
        return '@fuseTagToken';
      },

      swapTokensToTags = function() {
        return swapTags.pop();
      },

      // entity definitions
      // http://www.w3.org/TR/html401/sgml/intro.html
      escapeHTML = function escapeHTML(all) {
        var result;
        if (all) {
          textNode.data = String(this);
          result = container.innerHTML;
        } else {
          result = rawReplace
            .call(this, reUnAmp, '&amp;')
            .replace(reUnLt, '&lt;')
            .replace(reUnGt, '&gt;');
        }
        return fuse.String(result);
      },

      unescapeHTML = function unescapeHTML(all) {
        // tokenize tags before setting innerHTML then swap them after
        var tokenized, result = this;
        if (tokenized = rawIndexOf.call(result, '<') > -1) {
          result = plugin.replace.call(result, reTags, swapTagsToTokens);
        }
        if (all) {
          div.innerHTML = '<pre>' + result + '<\/pre>';
          result = getText();
        } else {
          result = rawReplace
            .call(result, reEsLt, '<')
            .replace(reEsGt, '>')
            .replace(reEsAmp, '&');
        }
        return fuse.String(tokenized
          ? plugin.replace.call(result, reTokens, swapTokensToTags)
          : result);
      };

      if (envTest('ELEMENT_INNER_HTML')) {
        // Safari 2.x has issues with escaping html inside a `pre`
        // element so we use the deprecated `xmp` element instead.
        textNode.data = '&';
        if (container.innerHTML != '&amp;') {
          textNode = (container = fuse._doc.createElement('xmp'))
            .appendChild(fuse._doc.createTextNode(''));
        }

        // Safari 3.x has issues with escaping the ">" character
        textNode.data = '>';
        if (container.innerHTML != '&gt;') {
          var __escapeHTML = escapeHTML;
          escapeHTML = function escapeHTML(all) {
            var result;
            if (all) {
              textNode.data = String(this);
              result = fuse.String(rawReplace.call(container.innerHTML, reUnGt, '&gt;'));
            } else {
              result = __escapeHTML.call(this);
            }
            return result;
          };
        }

        if (!envTest('ELEMENT_TEXT_CONTENT')) {
          div.innerHTML = '<pre>&lt;p&gt;x&lt;\/p&gt;<\/pre>';
          if (envTest('ELEMENT_INNER_TEXT') && div.firstChild.innerText == '<p>x<\/p>') {
            getText = function() { return div.firstChild.innerText.replace(/\r/g, ''); };
          }
          else if (div.firstChild.innerHTML == '<p>x<\/p>') {
            getText = function() { return div.firstChild.innerHTML; };
          }
          else {
            getText = function() {
              var node, nodes = div.firstChild.childNodes, parts = [], i = -1;
              while (node = nodes[++i]) parts[i] = node.data;
              return parts.join('');
            };
          }
        }
      }
      // lazy define methods
      plugin.escapeHTML = escapeHTML;
      plugin.unescapeHTML = unescapeHTML;

      return plugin[arguments[0]];
    };

    /*------------------------------------------------------------------------*/

    plugin.escapeHTML = function escapeHTML() {
      return define('escapeHTML').call(this);
    };

    plugin.unescapeHTML = function unescapeHTML() {
      return define('unescapeHTML').call(this);
    };

    plugin.stripTags = function stripTags() {
      return fuse.String(rawReplace.call(this, reTags, ''));
    };

    // prevent JScript bug with named function expressions
    var escapeHTML = null, stripTags = null, unescapeHTML = null;
  })(fuse.String.plugin);
  /*----------------------------- LANG: INSPECT ------------------------------*/

  (function() {
    var elemPlugin, eventPlugin, hashPlugin, strInspect,

    SPECIAL_CHARS = {
      '\b': '\\b',
      '\f': '\\f',
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t',
      '\\': '\\\\',
      '"' : '\\"',
      "'" : "\\'"
    },

    // charCodes 0-31 and \ and '
    reWithSingleQuotes = /[\x00-\x1f\\']/g,

    // charCodes 0-31 and \ and "
    reWithDoubleQuotes = /[\x00-\x1f\\"]/g,

    arrPlugin = fuse.Array.plugin,

    nlPlugin  = NodeList && NodeList.plugin || arrPlugin,

    strPlugin = fuse.String.plugin,

    escapeSpecialChars = function(match) {
      return SPECIAL_CHARS[match];
    },

    inspectPlugin = function(plugin) {
      var result, backup = plugin.inspect;
      plugin.inspect = uid;
      result = fuse.Object.inspect(plugin).replace(uid, String(backup));
      plugin.inspect = backup;
      return result;
    };

    // populate SPECIAL_CHARS with control characters
    (function(i, key) {
      while (--i) {
        key = String.fromCharCode(i);
        SPECIAL_CHARS[key] || (SPECIAL_CHARS[key] = '\\u' + ('0000' + i.toString(16)).slice(-4));
      }
    })(32);

    /*------------------------------------------------------------------------*/

    strInspect =
    strPlugin.inspect = function inspect(useDoubleQuotes) {
      // called by Obj.inspect on fuse.String or its plugin object
      if (this == strPlugin || window == this || this == null) {
        return inspectPlugin(strPlugin);
      }
      // called normally
      var string = String(this);
      return fuse.String(useDoubleQuotes
        ? '"' + string.replace(reWithDoubleQuotes, escapeSpecialChars) + '"'
        : "'" + string.replace(reWithSingleQuotes, escapeSpecialChars) + "'");
    };

    arrPlugin.inspect = function inspect() {
      // called by Obj.inspect on fuse.Array/fuse.dom.NodeList or its plugin object
      var length, object, result, plugin = this == nlPlugin ? nlPlugin : arrPlugin;
      if (this == plugin || window == this || this == null) {
        return inspectPlugin(plugin);
      }
      // called normally
      object = Object(this);
      length = object.length >>> 0;
      result = [];

      while (length--) {
        result[length] = fuse.Object.inspect(object[length]);
      }
      return fuse.String('[' + result.join(', ') + ']');
    };

    fuse.Object.inspect = function inspect(value) {
      var classOf, object, result;
      if (value != null) {
        object = fuse.Object(value);

        // this is not duplicating checks, one is a type check for host objects
        // and the other is an internal [[Class]] check because Safari 3.1
        // mistakes regexp instances as typeof `function`
        if (typeof object.inspect == 'function' &&
            isFunction(object.inspect)) {
          return object.inspect();
        }
        // attempt to avoid inspecting DOM nodes.
        // IE treats nodes like objects:
        // IE7 and below are missing the node's constructor property
        // IE8 node constructors are typeof "object"
        try {
          classOf = toString.call(object);
          if (classOf == OBJECT_CLASS && typeof object.constructor == 'function') {
            result = [];
            eachKey(object, function(value, key) {
              hasKey(object, key) &&
                result.push(strInspect.call(key) + ': ' + fuse.Object.inspect(object[key]));
            });
            return fuse.String('{' + result.join(', ') + '}');
          }
        } catch (e) { }
      }
      // try coercing to string
      try {
        return fuse.String(value);
      } catch (e) {
        // probably caused by having the `toString` of an object call inspect()
        if (e.constructor == window.RangeError) {
          return fuse.String('...');
        }
        throw e;
      }
    };

    if (fuse.Class.mixins.enumerable) {
      fuse.Class.mixins.enumerable.inspect = function inspect() {
        return isFunction(this._each)
          ? fuse.String('#<Enumerable:' + this.toArray().inspect() + '>')
          : inspectPlugin(fuse.Class.mixins.enumerable);
      };
    }

    if (fuse.Hash) {
      hashPlugin = fuse.Hash.plugin;
      hashPlugin.inspect = function inspect() {
        // called by Obj.inspect() on fuse.Hash or its plugin object
        if (this == hashPlugin || window == this || this == null) {
          return inspectPlugin(hashPlugin);
        }
        // called normally
        var pair, i = -1, pairs = this._pairs, result = [];
        while (pair = pairs[++i]) {
          result[i] = pair[0].inspect() + ': ' + fuse.Object.inspect(pair[1]);
        }
        return '#<Hash:{' + result.join(', ') + '}>';
      };
    }

    if (fuse.dom) {
      elemPlugin = HTMLElement.plugin;
      elemPlugin.inspect = function inspect() {
        // called by Obj.inspect() on a fuse Element class or its plugin object
        if (this == elemPlugin || window == this || this == null) {
          return inspectPlugin(this);
        }
        // called normally
        var element = this.raw || this,
         id         = element.id,
         className  = element.className,
         result     = '<' + element.nodeName.toLowerCase();

        if (id) {
          result += ' id=' + strInspect.call(id, true);
        }
        if (className) {
          result += ' class=' + strInspect.call(className, true);
        }
        return fuse.String(result + '>');
      };
    }

    if (fuse.dom.Event) {
      eventPlugin = fuse.dom.Event.plugin;
      eventPlugin.inspect = function inspect() {
        return this == eventPlugin
          ? inspectPlugin(eventPlugin)
          : '[object Event]';
      };
    }

    // prevent JScript bug with named function expressions
    var inspect = null;
  })();
  /*------------------------------- LANG: JSON -------------------------------*/

  (function(Obj) {

    var STRINGABLE_TYPES = { 'boolean': 1, 'object': 1, 'number': 1, 'string': 1 },
     inspect = fuse.String.plugin.inspect;

    Obj.JSON_FILTER = /^\/\*-secure-([\s\S]*)\*\/\s*$/;

    // ES5 15.12.3
    Obj.toJSON = function toJSON(value) {
      if (!STRINGABLE_TYPES[typeof value]) return;

      var length, i = -1, result = [], object = Object(value),
       classOf = toString.call(object);

      switch (classOf) {
        case BOOLEAN_CLASS : return fuse.String(value);
        case NUMBER_CLASS  : return fuse.String(isFinite(value) ? value : 'null');
        case STRING_CLASS  : return inspect.call(value, true);
        case ARRAY_CLASS   :
          length = object.length;
          while (++i < length) {
            value = Obj.toJSON(object[i]);
            result[i] = typeof value == 'undefined' ? 'null' : value;
          }
          return fuse.String('[' + result.join(',') + ']');

        case OBJECT_CLASS :
          // handle null
          if (value === null) {
            return fuse.String(value);
          }
          if (isFunction(object.toJSON)) {
            return Obj.toJSON(object.toJSON());
          }
          eachKey(object, function(value, key) {
            if (hasKey(object, key) &&
                typeof (value = Obj.toJSON(value)) != 'undefined') {
              result.push(inspect.call(key, true) + ':' + value);
            }
          });
          return fuse.String('{' + result.join(',') + '}');

        default:
          // other objects
          if (isFunction(object.toJSON)) {
            return Obj.toJSON(object.toJSON());
          }
      }
    };

    // ES5 15.9.5.43
    if (!isFunction(fuse.Date.plugin.toISOString)) {
      fuse.Date.plugin.toISOString = function toISOString() {
        return fuse.String(this.getUTCFullYear() + '-' +
          fuse.Number(this.getUTCMonth() + 1).toPaddedString(2) + '-' +
          this.getUTCDate().toPaddedString(2)    + 'T' +
          this.getUTCHours().toPaddedString(2)   + ':' +
          this.getUTCMinutes().toPaddedString(2) + ':' +
          this.getUTCSeconds().toPaddedString(2) + 'Z');
      };
    }

    // ES5 15.9.5.44
    if (!isFunction(fuse.Date.plugin.toJSON)) {
      fuse.Date.plugin.toJSON = function toJSON() {
        return this.toISOString();
      };
    }

    if (fuse.Hash) {
      fuse.Hash.plugin.toJSON = function toJSON() {
        return this.toObject();
      };
    }

    if (envTest('JSON')) {
      Obj.toJSON = function toJSON(object) {
        var result = JSON.stringify(object)
        return result != null ? fuse.String(result) : result;
      };
    }

    // prevent JScript bug with named function expressions
    var toJSON = null;
  })(fuse.Object);

  /*--------------------------------------------------------------------------*/

  // complementary JSON methods for String.plugin

  (function(plugin) {
    // Note from json2.js:
    // Replace certain Unicode characters with escape sequences. JavaScript
    // handles many characters incorrectly, either silently deleting them, or
    // treating them as line endings.
    var escapeProblemChars = function(match) {
      return problemChars[match];
    },

    unfilter = function(string, filter) {
      return string.replace(filter || fuse.Object.JSON_FILTER, '$1');
    },

    problemChars = {
     '\u0000': '\\u0000',
     '\u00ad': '\\u00ad',
     '\u070f': '\\u070f',
     '\u17b4': '\\u17b4',
     '\u17b5': '\\u17b5',
     '\ufeff': '\\ufeff'
    },

    // Opera 9.25 chokes on the literal
    reProblemChars = new RegExp('[\\u0000\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]', 'g'),

    reEscapedChars = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,

    reOpenBrackets = /(?:^|:|,)(?:[\n\r\t\x20]*\[)+/g,

    reSafeString   = /^[\],:{}\n\r\t\x20]*$/,

    reSimpleValues = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;

    /*------------------------------------------------------------------------*/

    plugin.isJSON = function isJSON() {
      // Note from json2.js:
      // Split the second stage into 4 regexp operations in order to work around
      // crippling inefficiencies in IE's and Safari's regexp engines.
      var string = String(this);
      return string != false && reSafeString.test(string
        // replace the JSON backslash pairs with '@' (a non-JSON character)
        .replace(reEscapedChars, '@')
        // replace all simple value tokens with ']'
        .replace(reSimpleValues, ']')
        // delete all open brackets that follow a colon, comma, or that begin the text
        .replace(reOpenBrackets, ''));
    };

    plugin.unfilterJSON = function unfilterJSON(filter) {
      return unfilter(fuse.String(this), filter);
    };

    plugin.evalJSON = function evalJSON(sanitize) {
      var json = unfilter(String(this));
      reProblemChars.lastIndex = 0;

      if (reProblemChars.test(json)) {
        json = String(plugin.replace.call(json, reProblemChars, escapeProblemChars));
      }
      try {
        if (!sanitize || plugin.isJSON.call(json)) {
          return eval('(' + json + ')');
        }
      } catch (e) { }

      throw new SyntaxError('Badly formed JSON string: ' + plugin.inspect.call(json));
    };

    if (envTest('JSON')) {
      var __evalJSON = plugin.evalJSON;
      plugin.evalJSON = function evalJSON(sanitize) {
        var result, json = unfilter(String(this));
        if (!sanitize) {
          try {
            result = JSON.parse(json);
          } catch(e) {
            result = __evalJSON.call(json);
          }
        } else {
          result = JSON.parse(json);
        }
        return result;
      };
    }

    // prevent JScript bug with named function expressions
    var evalJSON = null, isJSON = null, unfilterJSON = null;
  })(fuse.String.plugin);
  /*------------------------------ LANG: QUERY -------------------------------*/

  (function() {

    var split = envTest('STRING_SPLIT_BUGGY_WITH_REGEXP') ?
      fuse.String.plugin.split : fuse.String.plugin.split.raw,

    toQueryPair = function(key, value) {
      return fuse.String(typeof value == 'undefined' ? key :
        key + '=' + encodeURIComponent(value == null ? '' : value));
    };

    fuse.Object.toQueryString = function toQueryString(object) {
      var result = [];
      eachKey(object, function(value, key) {
        if (hasKey(object, key)) {
          key = encodeURIComponent(key);
          if (value && isArray(value)) {
            var i = result.length, j = 0, length = i + value.length;
            while (i < length) result[i++] = toQueryPair(key, value[j++]);
          }
          else if (!value || toString.call(value) != OBJECT_CLASS) {
            result.push(toQueryPair(key, value));
          }
        }
      });
      return fuse.String(result.join('&'));
    };

    fuse.String.plugin.toQueryParams = function toQueryParams(separator) {
      // grab query after the ? (question mark) and before the # (hash) and\or spaces
      var match = String(this).split('?'), object = fuse.Object();
      if (match.length > 1 && !match[1] ||
          !((match = (match = match[1] || match[0]).split('#')) &&
          (match = match[0].split(' ')[0]))) {
        // bail if there is no query
        return object;
      }

      var pair, key, value, index, i = -1,
       pairs  = split.call(match, separator || '&'),
       length = pairs.length;

      // iterate over key-value pairs
      while (++i < length) {
        value = undef;
        index = (pair = pairs[i]).indexOf('=');
        if (pair && index) {
          if (index != -1) {
            key = decodeURIComponent(pair.slice(0, index));
            value = pair.slice(index + 1);
            if (value) value = decodeURIComponent(value);
          } else {
            key = pair;
          }
          if (hasKey(object, key)) {
            if (!isArray(object[key])) object[key] = [object[key]];
            object[key].push(value);
          } else {
            object[key] = value;
          }
        }
      }
      return object;
    };

    if (fuse.Hash) {
      fuse.Hash.plugin.toQueryString = function toQueryString() {
        return fuse.Object.toQueryString(this._object);
      };
    }

    // prevent JScript bug with named function expressions
    var toQueryParams = null, toQueryString = null;
  })();
  /*------------------------------ LANG: SCRIPT ------------------------------*/

  (function(plugin) {

    var counter         = 0,
     rawIndexOf         = plugin.indexOf.raw,
     reHTMLComments     = /<!--[^\x00]*?-->/g,
     reOpenHTMLComments = /<!--/g,
     reOpenScriptTag    = /<script/i,
     reQuotes           = /(["'])(?:(?!\1)[^\\]|[^\\]|\\.)+?\1/g,
     reRegexps          = /(\/)(?:(?!\1)[^\\]|[^\\]|\\.)+?\1/g, //"
     reScripts          = /<script[^>]*>([^\x00]*?)<\/script>/gi,
     reQuoteTokens      = /@fuseQuoteToken/g,
     reRegexpTokens     = /@fuseRegexpToken/g,
     reScriptTokens     = /@fuseScript\d+Token/g,
     swappedQuotes      = [],
     swappedRegExps     = [],
     swappedScripts     = {},

    runCallback = function(code, index, array) {
      array[index] = fuse.run(code);
    },

    strReplace = function(pattern, replacement) {
      return (strReplace = envTest('STRING_REPLACE_COERCE_FUNCTION_TO_STRING') ?
        plugin.replace : plugin.replace.raw).call(this, pattern, replacement);
    },

    swapQuotesToTokens = function(quote) {
      swappedQuotes.unshift(quote);
      return '@fuseQuoteToken';
    },

    swapRegexpsToTokens = function(regexp) {
      swappedRegExps.unshift(regexp);
      return '@fuseRegexpToken';
    },

    swapScriptsToTokens = function(script) {
      var token = '@fuseScript' + (counter++) + 'Token';
      swappedScripts[token] = script;
      return token;
    },

    swapTokensToQuotes = function() {
      return swappedQuotes.pop();
    },

    swapTokensToRegexps = function() {
      return swappedRegExps.pop();
    },

    swapTokensToScripts = function(token) {
      return swappedScripts[token];
    };

    /*------------------------------------------------------------------------*/

    plugin.runScripts = function runScripts() {
      return plugin.extractScripts.call(this, runCallback);
    };

    plugin.extractScripts = function extractScripts(callback) {
      var match, i = -1, string = String(this), result = fuse.Array();

      if (!reOpenScriptTag.test(string)) {
        return result;
      }
      if (rawIndexOf.call(string, '<!--') > -1) {
        string = strReplace
          .call(string, reScripts, swapScriptsToTokens)
          .replace(reHTMLComments, '')
          .replace(reScriptTokens, swapTokensToScripts);

        // cleanup
        swappedScripts = { };
      }
      // clear lastIndex because exec() uses it as a starting point
      reScripts.lastIndex = 0;

      while (match = reScripts.exec(string)) {
        if (match = match[1]) {
          result[++i] = match;
          callback && callback(match, i, result);
        }
      }
      return result;
    };

    plugin.stripScripts = function stripScripts() {
      return fuse.String(String(this).replace(reScripts, ''));
    };

    /*------------------------------------------------------------------------*/

    fuse.run = function run(code, context) {
      var backup = window.fuse,

      makeExecuter = function(context) {
        return context.Function('window',
          'return function (' + uid + '){' +
          'var arguments=window.arguments;' +
          'return window.eval(String(' + uid + '))}')(context);
      },

      run = function run(code, context) {
        context || (context = window);
        if (context == window) return execute(code);

        context = getWindow(context.raw || context);
        if (context == window) return execute(code);

        // cache executer for other contexts
        var id = getFuseId(context), data = domData[id];
        return (data._evaluator || (data._evaluator = makeExecuter(context)))(code);
      },

      execute = makeExecuter(window);

      run('var fuse="x"');

      if (window.fuse != 'x' && isHostType(window, 'document')) {
        window.fuse = backup;
        if (runScriptText('typeof this.fuse=="function"')) {
          run = runScriptText;
        } else {
          // for Safari 2.0.0 and Firefox 2.0.0.2
          fuse.dom.runScriptText = runScriptText = run;
        }
      } else {
        window.fuse = backup;
      }

      // IE's eval will error if code contains <!--
      try {
        eval('<!--\n//-->');
      }
      catch (e) {
        var __run = run;
        run = function(code, context) {
          if (rawIndexOf.call(code, '<!--') > -1) {
            code = strReplace
              .call(code, reQuotes,    swapQuotesToTokens)
              .replace(reRegexps,      swapRegexpsToTokens)
              .replace(reHTMLComments, '//<!--')
              .replace(reQuoteTokens,  swapTokensToQuotes)
              .replace(reRegexpTokens, swapTokensToRegexps);
          }
          return __run(code, context);
        };
      }

      fuse.run = run;
      return run(code, context);
    };

    // prevent JScript bug with named function expressions
    var extractScripts = null, run = null, runScripts = null, stripScripts = null;
  })(fuse.String.plugin);
  /*------------------------------- LANG: UTIL -------------------------------*/

  fuse.addNS('util');

  (function(util) {
    var reSpace  = fuse.RegExp('\\s+'),
     reTrimLeft  = fuse.RegExp('^\\s\\s*'),
     reTrimRight = fuse.RegExp('\\s\\s*$');

    util.$w = function $w(string) {
      if (!isString(string)) return fuse.Array();
      string = fuse.String(string.replace(reTrimLeft, '').replace(reTrimRight, ''));
      return string != '' ? string.split(reSpace) : fuse.Array();
    };

    if (fuse.Array.from) {
      util.$A = fuse.Array.from;
    }
    if (fuse.Hash) {
      util.$H = fuse.Hash;
    }
    if (fuse.Range) {
      util.$R = fuse.Range;
    }
    if (fuse.dom) {
      var doc = window.document;
      util.$ = function $(object) {
        var objects, length = arguments.length;
        if (length > 1) {
          objects = NodeList();
          while (length--) objects[length] = util.$(arguments[length]);
          return objects;
        }
        if (isString(object)) {
          object = doc.getElementById(object || uid);
          return object && fromElement(object);
        }
        // attempt window decorator first, and then node decorator
        return Node(Window(object));
      };

      util.$$ = function $$(selectors) {
        var callback, context, args = slice.call(arguments, 0);
        if (typeof args[args.length - 1] == 'function') {
          callback = args.pop();
        }
        if (!isString(args[args.length - 1])) {
          context = args.pop();
        }

        return fuse.query(args.length
          ? slice.call(args).join(',')
          : selectors, context, callback).get();
      };

      util.$F = function $F(element) {
        element = fuse(element);
        return element && element.getValue
          ? element.getValue()
          : null;
      };
    }

    // prevent JScript bug with named function expressions
    var $ = null, $$ = null, $w = null, $A = null, $F = null, $H = null, $R = null;
  })(fuse.util);

  /*---------------------------------- AJAX ----------------------------------*/

  fuse.addNS('ajax');

  fuse.ajax.create = (function() {
    // The `Difference between MSXML2.XMLHTTP and Microsoft.XMLHTTP ProgIDs`
    // thread explains that the `Microsoft` namespace is deprecated and we should
    // use MSXML2.XMLHTTP where available.
    // http://forums.asp.net/p/1000060/1622845.aspx
    //
    // ProgID lookups
    // http://msdn.microsoft.com/en-us/library/ms766426(VS.85).aspx
    //
    // Attempt ActiveXObject first because IE7+ implementation of
    // XMLHttpRequest doesn't work with local files.
    var create = fuse.Function.FALSE;
    if (envTest('ACTIVE_X_OBJECT')) {
      try {
        new ActiveXObject('MSXML2.XMLHTTP');
        create = function create() {
          return new ActiveXObject('MSXML2.XMLHTTP');
        };
      } catch (e) {
        try {
          new ActiveXObject('Microsoft.XMLHTTP');
          create = function create() {
            return new ActiveXObject('Microsoft.XMLHTTP');
          };
        } catch (e) { }
      }
    } else if (isHostType(window, 'XMLHttpRequest')) {
      create = function create() {
        return new XMLHttpRequest();
      };
    }
    return create;
  })();
  /*---------------------------- AJAX: RESPONDERS ----------------------------*/

  fuse.addNS('ajax.responders');

  fuse.ajax.activeRequestCount = 0;

  (function(responders) {

    var eventMixins = fuse.Class.mixins.event,
     observe = eventMixins.observe,
     stopObserving = eventMixins.stopObserving;

    responders._events = { };

    responders.fire = eventMixins.fire;

    responders.register = function register(responder) {
      var name;
      if (isHash(responder)) responder = responder._object;
      for (name in responder) {
        observe.call(responders, name.slice(2).toLowerCase(), responder[name]);
      }
    };

    responders.unregister = function unregister(responder) {
      var name;
      if (isHash(responder)) responder = responder._object;
      for (name in responder) {
        stopObserving.call(responders, name.slice(2).toLowerCase(), responder[name]);
      }
    };

    responders.register({
      'onCreate': function() {
        fuse.ajax.activeRequestCount++;
      },
      'onDone': function() {
        fuse.ajax.activeRequestCount--;
      }
    });

    // prevent JScript bug with named function expressions
    var register = null, unregister = null;
  })(fuse.ajax.responders);
 /*------------------------------- AJAX: BASE -------------------------------*/

  fuse.ajax.Base = fuse.Class(function() {

    var Obj = fuse.Object,

    Base = function Base(url, options) {
      var customHeaders, queryString, body = null,
       location = window.location,
       defaults = Base.defaults,
       defaultHeaders = defaults.headers;

      // remove headers from user options to be added in further down
      if (options && options.headers) {
        customHeaders = options.headers;
        delete options.headers;
      }

      // clone default options/headers and overwrite with user options
      delete defaults.headers;
      defaults = Obj.clone(defaults);
      Base.defaults.headers = defaultHeaders;

      defaults.headers = Obj.clone(defaultHeaders);
      options = this.options = Obj.extend(defaults, options);

      var encoding = options.encoding,
       headers = options.headers,
       method  = options.method.toLowerCase(),
       params  = options.parameters;

      // if no url is provided use the window's location data
      if (!url || url == '') {
        url = location.protocol + '//' + location.host + location.pathname;
        if (!params || params == '') {
          params = location.search.slice(1);
        }
      }

      // convert string/hash parameters to an object
      if (isString(params)) {
        params = fuse.String(params).toQueryParams();
      } else if (isHash(params)) {
        params = params.toObject();
      } else {
        params = Obj.clone(params);
      }

      // simulate other verbs over post
      if (!/^(get|post)$/.test(method)) {
        params['_method'] = method;
        method = 'post';
      }

      // when GET request, append parameters to URL
      queryString = Obj.toQueryString(params);
      if ( method == 'get' && queryString != '') {
        url += (url.indexOf('?') > -1 ? '&' : '?') + queryString;
      }

      // add in user defined array/hash/object headers over the default
      if (typeof customHeaders == 'object') {
        if (isArray(customHeaders)) {
          for (var i = 0, length = customHeaders.length; i < length; i += 2)
            headers[customHeaders[i]] = customHeaders[i + 1];
        } else {
          if (isHash(customHeaders)) customHeaders = customHeaders._object;
          for (key in customHeaders) headers[key] = customHeaders[key];
        }
      }

      // ensure character encoding is set in headers of POST requests
      if (method == 'post' && (headers['Content-type'] || '').indexOf('charset=') < 0) {
        headers['Content-type'] = options.contentType +
          (encoding ? '; charset=' + encoding : '');
      }

      // set default timeout multiplier
      this.timerMultiplier = options.timerMultiplier ||
        fuse.Timer && fuse.Timer.defaults.multiplier || 1;

      // Playing it safe here, even though we could not reproduce this bug,
      // jQuery tickets #2570, #2865 report versions of Opera will display a
      // login prompt when passing null-like values for username/password when
      // no authorization is needed.
      if (!options.username) {
        options.username = options.password = '';
      }

      // body is null for every method except POST
      if (method == 'post') {
        body = options.postBody || queryString;
      }

      this.body       = body;
      this.method     = fuse.String(method);
      this.parameters = params;
      this.url        = fuse.String(url);
    };

    return { 'constructor': Base };
  });

  fuse.ajax.Base.defaults = {
    'asynchronous': true,
    'contentType':  'application/x-www-form-urlencoded',
    'encoding':     'UTF-8',
    'evalJS':       true,
    'evalJSON':     !!fuse.String.plugin.evalJSON,
    'forceMethod':  false,
    'method':       'post',
    'parameters':   '',
    'headers':      {
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
      'X-Fuse-Version': fuse.version,
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
  /*---------------------------- AJAX: REQUEST -------------------------------*/

  fuse.ajax.Request = (function() {

    var Klass = function() { },

    Request = function Request(url, options) {
      var instance   = __instance || new Klass,
       onStateChange = instance.onStateChange,
       onTimeout     = instance.onTimeout;

      __instance = null;
      instance.raw = fuse.ajax.create();

      instance.onTimeout =
        function() { onTimeout.call(instance); };

      instance.onStateChange =
        function(event, forceState) { onStateChange.call(instance, event, forceState); };

      instance.request(url, options);
      return instance;
    },

    __instance,
    __apply = Request.apply,
    __call  = Request.call;

    Request.call = function(thisArg) {
      __instance = thisArg;
      return __call.apply(this, arguments);
    };

    Request.apply = function(thisArg, argArray) {
      __instance = thisArg;
      return __apply.call(this, thisArg, argArray);
    };

    fuse.Class(fuse.ajax.Base, { 'constructor': Request });
    Klass.prototype = Request.plugin;

    Request.READY_STATES = fuse.Array('unsent', 'opened', 'headersReceived', 'loading', 'done');
    Request.addMixins(fuse.Class.mixins.event);
    return Request;
  })();

  /*--------------------------------------------------------------------------*/

  (function(plugin) {

    var EVENT_TYPES = ['abort', 'exception', 'failure', 'success', 'timeout'],
     euid           = uid + '_error',
     fireEvent      = fuse.Class.mixins.event.fire,
     isSameOrigin   = fuse.Object.isSameOrigin,
     responders     = fuse.ajax.responders,
     reHTTP         = /^https?:/,
     // content-type is case-insensitive
     // http://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.7
     reContentTypeJS   = /^\s*(?:text|application)\/(x-)?(?:java|ecma)script(?:;|\s|$)/i,
     reContentTypeJSON = /^\s*(?:application\/json)(?:;|\s|$)/i;

    function fireException(request, exception) {
      fireEvent.call(request, 'exception', request, exception);
      responders && responders.fire('exception', request, exception);
      // throw error if not caught by a request exception handler
      var handlers = request._events.exception;
      if (!handlers || !handlers.length) throw exception;
    }

    /*------------------------------------------------------------------------*/

    plugin._useStatus   = true;
    plugin._timerId     = null;
    plugin.readyState   = fuse.Number(0);
    plugin.responseText = fuse.String('');
    plugin.status       = fuse.Number(0);
    plugin.statusText   = fuse.String('');

    plugin.headerJSON   =
    plugin.responseJSON =
    plugin.responseXML  = null;

    plugin.isAborted    = createGetter('isAborted', false);
    plugin.isTimedout   = createGetter('isTimedout', false);

    plugin.abort = function abort() {
      var xhr = this.raw;
      if (this.readyState != 4) {
        // clear onreadystatechange handler to stop some browsers calling
        // it when the request is aborted
        xhr.onreadystatechange = NOOP;
        xhr.abort();

        // skip to complete readyState and flag it as aborted
        this.isAborted = createGetter('isAborted', true);
        this.setReadyState(4);
      }
    };

    plugin.fire = function fire(eventType) {
      try {
        fireEvent.apply(this, arguments);
      } catch (e) {
        fireException(this, e);
      }
      if (responders) {
        responders.fire.apply(responders, arguments);
      }
    };

    plugin.getAllHeaders = function getAllHeaders() {
      var result;
      try { result = this.raw.getAllResponseHeaders(); } catch (e) { }
      return fuse.String(result || '');
    };

    plugin.getHeader = function getHeader(name) {
      var result;
      try { result = this.raw.getResponseHeader(name); } catch (e) { }
      return result ? fuse.String(result) : null;
    };

    plugin.onTimeout = function onTimeout() {
      var xhr = this.raw;
      if (this.readyState != 4) {
        xhr.onreadystatechange = NOOP;
        xhr.abort();

        // skip to complete readyState and flag it as timedout
        this.isTimedout = createGetter('isTimedout', true);
        this.setReadyState(4);
      }
    };

    plugin.onStateChange = function onStateChange(event, forceState) {
      // ensure all states are fired and only fired once per change
      var endState = this.raw.readyState, readyState = this.readyState;
      if (readyState < 4) {
        if (forceState != null) {
          readyState = forceState - 1;
        }
        while (readyState < endState) {
          this.setReadyState(++readyState);
        }
      }
    };

    plugin.request = function request(url, options) {
      var async, body, eventType, handler, headers, key, timeout, url,
       i = -1, j = i, xhr = this.raw;

      // treat request() as the constructor and call Base as $super
      // if first call or new options are passed
      if (!this.options || options) {
        fuse.ajax.Base.call(this, url, options);
        options = this.options;

        while (eventType = fuse.ajax.Request.READY_STATES[++i]) {
          if (handler = options['on' + capitalize(eventType)]) {
            this.observe(eventType, handler);
          }
        }
        while (eventType = EVENT_TYPES[++j]) {
          if (handler = options['on' + capitalize(eventType)]) {
            this.observe(eventType, handler);
          }
        }
      } else {
        options = this.options;
      }

      async   = options.asynchronous;
      headers = options.headers;
      timeout = options.timeout;
      body    = this.body;
      url     = this.url;

      // reset flags
      this.isAborted  = createGetter('isAborted', false);
      this.isTimedout = createGetter('isTimedout', false);

      // reset response values
      this.headerJSON   = this.responseJSON = this.responseXML = null;
      this.readyState   = fuse.Number(0);
      this.responseText = fuse.String('');
      this.status       = fuse.Number(0);
      this.statusText   = fuse.String('');

      // non-http requests don't use http status codes
      // return true if request url is http(s) or, if relative, the pages url is http(s)
      this._useStatus = reHTTP.test(url) ||
        (url.slice(0, 6).indexOf(':') < 0 ?
          reHTTP.test(window.location.protocol) : false);

      // start timeout timer if provided
      if (timeout != null) {
        this._timerId = setTimeout(this.onTimeout, timeout * this.timerMultiplier);
      }

      // fire onCreate callbacks
      this.fire('create', options.onCreate);

      // trigger uninitialized readyState 0
      this.onStateChange(null, 0);

      try {
        // attach onreadystatechange event after open() to avoid some browsers
        // firing duplicate readyState events
        xhr.open(this.method.toUpperCase(), url, async, options.username, options.password);
        xhr.onreadystatechange = this.onStateChange;

        // set headers
        // use regular for...in because we aren't worried about shadowed properties
        for (key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }

        // if body is a string ensure it's a primitive
        xhr.send(isString(body) ? String(body) : body);

        // force Firefox to handle readyState 4 for synchronous requests
        if (!async) this.onStateChange();
      }
      catch (e) {
        fireException(this, e);
      }
    };

    plugin.setReadyState = function setReadyState(readyState) {
      var contentType, e, evalJS, eventType, hasText, heandlers, json, responseText,
       responseXML, status, statusText, successOrFailure, timerId, i = -1,
       events       = this._events,
       eventTypes   = [],
       skipped      = { },
       options      = this.options,
       url          = this.url,
       xhr          = this.raw,
       isAborted    = this.isAborted(),
       isTimedout   = this.isTimedout(),
       evalJSON     = options.evalJSON,
       sanitizeJSON = options.sanitizeJSON || !isSameOrigin(url);

      // exit if no headers and wait for state 3 to fire states 2 and 3
      if (readyState == 2 && this.getAllHeaders() == '' &&
        xhr.readyState == 2) {
        return;
      }

      this.readyState = fuse.Number(readyState);

      // clear response values on aborted/timedout requests
      if (isAborted || isTimedout) {
        this.headerJSON   = this.responseJSON = this.responseXML = null;
        this.responseText = fuse.String('');
        this.status       = fuse.Number(0);
        this.statusText   = fuse.String('');
      }
      else if (readyState > 1) {
        // Request status/statusText have really bad cross-browser consistency.
        // Monsur Hossain has done an exceptional job cataloging the cross-browser
        // differences.
        // http://replay.waybackmachine.org/20090629230725/http://monsur.com/blog/2007/12/28/xmlhttprequest-status-codes/
        // http://blogs.msdn.com/b/ieinternals/archive/2009/07/23/the-ie8-native-xmlhttprequest-object.aspx

        // Assume Firefox is throwing an error accessing status/statusText
        // caused by a 408 request timeout
        try {
          status = xhr.status;
          statusText = xhr.statusText;
        } catch(e) {
          status = 408;
          statusText = 'Request Timeout';
        }

        // IE will return 1223 for 204 no content
        this.status = fuse.Number(status == 1223 ? 204 : status);

        // set statusText
        this.statusText = fuse.String(statusText);

        // set responseText
        if (readyState > 2) {
          // IE will throw an error when accessing responseText in state 3
          try {
            if (responseText = xhr.responseText) {
              this.responseText = fuse.String(responseText);
            }
          } catch (e) { }
        }
        else if (readyState == 2 && evalJSON &&
            (json = this.getHeader('X-JSON')) && json != '') {
          // set headerJSON
          try {
            this.headerJSON = json.evalJSON(sanitizeJSON);
          } catch (e) {
            fireException(this, e);
          }
        }
      }

      if (readyState == 4) {
        contentType  = this.getHeader('Content-type') || '',
        evalJS       = options.evalJS,
        timerId      = this._timerId;
        responseText = this.responseText;
        hasText      = !responseText.isBlank();

        // clear timeout timer
        if (timerId != null) {
          window.clearTimeout(timerId);
          this._timerId = null;
        }

        if (status != null) {
          status = String(status);
        }
        if (isAborted) {
          eventTypes.push('abort');
          if (status) eventTypes.push(status);
        }
        else if (isTimedout) {
          eventTypes.push('timeout');
          if (status) eventTypes.push(status);
        }
        else {
          // don't call global/request onSuccess/onFailure callbacks on aborted/timedout requests
          if (status) eventTypes.push(status);
          successOrFailure = this.isSuccess() ? 'success' : 'failure';
          eventTypes.push(successOrFailure);

          // skip success/failure request events if status handler exists
          skipped['on' + (options['on' + status] ?
            successOrFailure : status)] = 1;

          // remove event handler to avoid memory leak in IE
          xhr.onreadystatechange = NOOP;

          // set responseXML
          responseXML = xhr.responseXML;

          // IE will return an invalid XML object if the response
          // content-type header is not text/xml
          if (responseXML && isHostType(responseXML, 'documentElement')) {
            this.responseXML = responseXML;
          }

          // set responseJSON
          if (evalJSON == 'force' || evalJSON && hasText &&
              reContentTypeJSON.test(contentType)) {
            try {
              this.responseJSON = responseText.evalJSON(sanitizeJSON);
            } catch (e) {
              fireException(this, e);
            }
          }

          // eval javascript
          if (hasText && (evalJS == 'force' || evalJS && isSameOrigin(url) &&
              reContentTypeJS.test(contentType))) {

            fuse.run('try{' + responseText.unfilterJSON() + '}catch(e){fuse.'  + euid + '=e}');

            if (e = fuse[euid]) {
              delete fuse[euid];
              fireException(this, e);
            }
          }
        }
      }

      // add readyState to the list of events to fire
      eventTypes.push(fuse.ajax.Request.READY_STATES[readyState]);

      while (eventType = eventTypes[++i]) {
        // temporarily remove handlers so only responders are called
        if (skipped[eventType]) {
          handlers = events[eventType];
          delete events[eventType];
          this.fire(eventType, this, this.headerJSON);
          events[eventType] = handlers;
        }
        else {
          this.fire(eventType, this, this.headerJSON);
        }
      }
    };

    plugin.isSuccess = function isSuccess() {
      // http status code definitions
      // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
      var status = this.status;
      return this._useStatus
        ? (status >= 200 && status < 300 || status == 304)
        : status == 0;
    };

    // prevent JScript bug with named function expressions
    var abort =      null,
     fire =          null,
     getHeader =     null,
     getAllHeaders = null,
     isSuccess =     null,
     onStateChange = null,
     onTimeout =     null,
     request =       null,
     setReadyState = null;
  })(fuse.ajax.Request.plugin);
  /*------------------------------ AJAX: UPDATER -----------------------------*/

  fuse.ajax.Updater = (function() {
    var Request = fuse.ajax.Request,

    Klass = function() { },

    Updater = function Updater(container, url, options) {
      var callbackName = 'on' + capitalize(Request.READY_STATES[4]),
       instance = __instance || new Klass,
       onDone = options[callbackName];

      __instance = null;

      instance.container = {
        'success': fuse(container.success || container),
        'failure': fuse(container.failure || (container.success ? null : container))
      };

      options[callbackName] = function(request, json) {
        instance.updateContent(request.responseText);
        onDone && onDone(request, json);
      };

      // this._super() equivalent
      fuse.ajax.Request.call(instance, url, options);
      if (onDone) options[callbackName] = onDone;

      return instance;
    },

    __instance,
    __apply = Updater.apply,
    __call = Updater.call;

    Updater.call = function(thisArg) {
      __instance = thisArg;
      return __call.apply(this, arguments);
    };

    Updater.apply = function(thisArg, argArray) {
      __instance = thisArg;
      return __apply.call(this, thisArg, argArray);
    };

    fuse.Class(fuse.ajax.Request, { 'constructor': Updater });
    Klass.prototype = Updater.plugin;
    return Updater;
  })();

  fuse.ajax.Updater.plugin.updateContent = (function() {
    var updateContent = function updateContent(responseText) {
      var options = this.options,
       updateBy = optiona.updateBy || 'appendChild',
       receiver = this.container[this.isSuccess() ? 'success' : 'failure'];

      if (receiver) {
        if (!options.runScripts) {
          responseText = responseText.stripScripts();
        }
        if (isString(updateBy)) {
          receiver[updateBy](responseText);
        } else {
          updateBy(receiver, responseText);
        }
      }
    };

    return updateContent;
  })();
  /*------------------------ AJAX: PERIODICAL UPDATER ------------------------*/

  fuse.ajax.TimedUpdater = (function() {

    var Obj = fuse.Object,

    Request = fuse.ajax.Request,

    Klass   = function() { },

    TimedUpdater = function TimedUpdater(container, url, options) {
      var onDone,
       callbackName = 'on' + capitalize(Request.READY_STATES[4]),
       instance     = __instance || new Klass,
       options      = Obj.extend(Obj.clone(TimedUpdater.defaults), options);

      __instance = null;

      // this._super() equivalent
      fuse.ajax.Base.call(instance, url, options);
      options = instance.options;

      // dynamically set readyState eventName to allow for easy customization
      onDone = options[callbackName];

      instance.container = container;
      instance.frequency = options.frequency;
      instance.maxDecay  = options.maxDecay;

      options[callbackName] = function(request, json) {
        if (!request.aborted) {
          instance.updateDone(request);
          onDone && onDone(request, json);
        }
      };

      instance.onStop = options.onStop;
      instance.onTimerEvent = function() { instance.start(); };
      instance.start();
      return instance;
    },

    __instance,
    __apply = TimedUpdater.apply,
    __call = TimedUpdater.call;

    TimedUpdater.call = function(thisArg) {
      __instance = thisArg;
      return __call.apply(this, arguments);
    };

    TimedUpdater.apply = function(thisArg, argArray) {
      __instance = thisArg;
      return __apply.call(this, thisArg, argArray);
    };

    fuse.Class(fuse.ajax.Base, { 'constructor': TimedUpdater });
    Klass.prototype = TimedUpdater.plugin;
    return TimedUpdater;
  })();

  (function(plugin) {
    plugin.updateDone = function updateDone(request) {
      var options = this.options, decay = options.decay,
       responseText = request.responseText;

      if (decay) {
        this.decay = Math.min(responseText == String(this.lastText) ?
          (this.decay * decay) : 1, this.maxDecay);

        this.lastText = responseText;
      }

      this.timer = setTimeout(this.onTimerEvent,
        this.decay * this.frequency * this.timerMultiplier);
    };

    plugin.start = function start() {
      this.updater = new fuse.ajax.Updater(this.container, this.url, this.options);
    };

    plugin.stop = function stop() {
      window.clearTimeout(this.timer);
      this.lastText = null;
      this.updater.abort();
      this.onStop && this.onStop.apply(this, arguments);
    };

    // prevent JScript bug with named function expressions
    var updateDone = null, start = null, stop = null;
  })(fuse.ajax.TimedUpdater.plugin);

  fuse.ajax.TimedUpdater.defaults = {
    'decay':     1,
    'frequency': 2,
    'maxDecay':  Infinity
  };
  /*--------------------------------------------------------------------------*/

  if (fuse.dom && NodeList) {
    HTMLFormElement && eachKey(HTMLFormElement.plugin, addNodeListMethod);
    HTMLInputElement && eachKey(HTMLInputElement.plugin, addNodeListMethod);

    eachKey(HTMLElement.plugin, addNodeListMethod);
    eachKey(Element.plugin, addNodeListMethod);

    (function(nlPlugin, origin) {
      // Pave any NodeList methods that fuse.Array shares.
      // Element first(), last(), and contains() may be called by using invoke()
      // Ex: elements.invoke('first');
      eachKey(fuse.Array.plugin, function(value, key) {
        if (value[ORIGIN]) {
          nlPlugin[key] = cloneMethod(value, origin);
        }
        else if (!nlPlugin[key]) {
          nlPlugin[key] = value;
        }
      });

      NodeList.from = cloneMethod(fuse.Array.from, origin);
      NodeList.fromNodeList = cloneMethod(fuse.Array.fromNodeList, origin);
    })(NodeList.plugin, { 'Number': fuse.Number, 'Array': NodeList });
  }
})(this);

(function(window) {
  /*--------------------------- EVENT: DISPATCHER ----------------------------*/

  // Seperate from primary closure to avoid memory leaks in IE6

  // Event dispatchers manage several handlers and ensure
  // FIFO execution order. They are attached as the primary event
  // listener and execute all handlers they manage.
  fuse.dom.Event._createDispatcher = (function() {

    var EVENT_TYPE_ALIAS =
      { 'blur': 'delegate:blur', 'focus': 'delegate:focus' },

    huid = fuse.uid + '_domHandler',

    runScriptText = fuse.dom.runScriptText,

    createDispatcher = function createDispatcher(id, type) {
      return function(event) {
        var decorator, handler, parentNode, node, stopped, i = -1,
         debug     = fuse.debug,
         data      = fuse.dom.data[id],
         decorator = data.decorator,
         ec        = data.events[type],
         handlers  = ec.handlers.slice(0);

        decorator || (decorator = fuse(data.raw));
        node = decorator.raw;
        event = fuse.dom.Event(event || getWindow(node).event, decorator);

        while (handler = handlers[++i]) {
          if (debug) {
            // script injection allows handlers to fail without halting the while loop
            fuse[huid] = function() { handler.call(decorator, event) };
            stopped = runScriptText('fuse.' + huid + '()') === false;
            delete fuse[huid];
          } else {
            stopped = handler.call(decorator, event);
          }
          stopped && event.stop();
        }

        // bubble if flagged by delegation
        if (ec._isBubblingForDelegation && event.isBubbling() &&
            (parentNode = node.parentNode)) {
          // cancel real bubbling
          event.stopBubbling();
          // fake out and set it to bubbling
          event.isBubbling = fuse.dom.Event._createGetter('isBubbling', true);
          // start manual bubbling
          decorator.fire.call(parentNode, EVENT_TYPE_ALIAS[type] || type, null, event);
        }
      };
    };

    // DOM Level 0
    if (!fuse.env.test('ELEMENT_ADD_EVENT_LISTENER') &&
        !fuse.env.test('ELEMENT_ATTACH_EVENT')) {
      var __createDispatcher = createDispatcher;
      createDispatcher = function createDispatcher(id, type) {
        var dispatcher = __createDispatcher(id, type);
        dispatcher._isDispatcher = true;
        return dispatcher;
      };
    }

    delete fuse.uid;
    return createDispatcher;
  })();

  /*--------------------------------------------------------------------------*/

  (function(Event) {

    var addDispatcher = Event._addDispatcher,

    createGetter      = Event._createGetter,

    createDispatcher  = Event._createDispatcher,

    domLoadDispatcher = createDispatcher(1, 'dom:loaded'),

    winLoadDispatcher = createDispatcher(0, 'load'),

    fixReadyState     = typeof fuse._doc.readyState != 'string',

    domLoadWrapper = function(event) {
      var doc = fuse._doc, docEl = fuse._docEl, decorated = fuse(doc);
      if (!decorated.isLoaded()) {
        fuse._body     =
        fuse._scrollEl = doc.body;
        fuse._root     = docEl;

        if (fuse.env.test('BODY_ACTING_AS_ROOT')) {
          fuse._root = doc.body;
          fuse._info.root = fuse._info.body;
        }
        if (fuse.env.test('BODY_SCROLL_COORDS_ON_DOCUMENT_ELEMENT')) {
          fuse._scrollEl = docEl;
          fuse._info.scrollEl = fuse._info.docEl;
        }
        // fixed for Firefox < 3.6
        if (fixReadyState) {
          doc.readyState = 'interactive';
        }

        event = Event(event || window.event, doc);
        event.type = 'dom:loaded';

        decorated.isLoaded = createGetter('isLoaded', true);
        domLoadDispatcher(event);
        decorated.stopObserving('DOMContentLoaded').stopObserving('dom:loaded');
        delete fuse.dom.data[1].events['dom:loaded'];
      }
    },

    winLoadWrapper = function(event) {
      event || (event = window.event);
      var doc = fuse._doc;

      // make dom:loaded dispatch if it hasn't
      if (!fuse(doc).isLoaded()) {
        domLoadWrapper(event);
      }
      // try again later if dom:loaded is still executing handlers
      else if (fuse.dom.data[1].events['dom:loaded']) {
        return setTimeout(function() { winLoadWrapper(event); }, 10);
      }
      // fixed for Firefox < 3.6
      if (fixReadyState) {
        doc.readyState = 'complete';
      }

      // prepare event wrapper
      event = Event(event, window);
      event.type = 'load';
      winLoadDispatcher(event);

      // clear event cache
      fuse(window).stopObserving('load');
    };

    // fixed for Firefox < 3.6
    if (fixReadyState) {
      fuse._doc.readyState = 'loading';
    }

    // Ensure that the dom:loaded event has finished executing its observers
    // before allowing the window onload event to proceed
    addDispatcher(fuse._doc, 'dom:loaded', domLoadWrapper);

    // Perform feature tests and define pseudo private
    // body/root properties when the dom is loaded
    addDispatcher(window, 'load', winLoadWrapper);
  })(fuse.dom.Event);
  /*--------------------------- EVENT: DOM-LOADED ----------------------------*/

  (function() {
    var cssPoller, readyStatePoller,

    FINAL_DOCUMENT_READY_STATES =
      { 'loaded': 1, 'interactive': 1, 'complete': 1 },

    doc = fuse._doc,

    decoratedDoc = fuse(doc),

    envTest      = fuse.env.test,

    isFramed     = true,

    isHostType   = fuse.Object.isHostType,

    isSameOrigin = fuse.Object.isSameOrigin,

    Poller = function(method) {
      var poller = this,
      callback = function() {
        if (!method() && poller.id != null) {
          poller.id = setTimeout(callback, 10);
        }
      };

      this.id = setTimeout(callback, 10);
    },

    cssDoneLoading = function() {
      return (isCssLoaded = fuse.Function.TRUE)();
    },

    fireDomLoadedEvent = function() {
      readyStatePoller.clear();
      cssPoller && cssPoller.clear();
      return !decoratedDoc.isLoaded() && !!decoratedDoc.fire('dom:loaded');
    },

    checkCssAndFire = function() {
      return decoratedDoc.isLoaded()
        ? fireDomLoadedEvent()
        : !!(isCssLoaded() && fireDomLoadedEvent());
    },

    getSheetElements = function() {
      var i = 0, link, links = doc.getElementsByTagName('link'),
       result = fuse.Array.fromNodeList(doc.getElementsByTagName('style'));
      while (link = links[i++]) {
        if (link.rel.toLowerCase() == 'stylesheet')
          result.push(link);
      }
      return result;
    },

    getSheetObjects = function(elements) {
      for (var i = 0, result = [], element, sheet; element = elements[i++]; ) {
        sheet = getSheet(element);
        // bail when sheet is null/undefined on elements
        if (sheet == null) return false;
        if (isSameOrigin(sheet.href)) {
          result.push(sheet);
          if (!addImports(result, sheet))
            return false;
        }
      }
      return result;
    },

    checkDomLoadedState = function(event) {
      if (decoratedDoc.isLoaded()) {
        readyStatePoller.clear();
      }
      // Safari hits `loaded` while others may hit `interactive` or `complete`
      // and should be able to interact with the dom at that time.
      else if ((event && event.type == 'DOMContentLoaded') ||
          (FINAL_DOCUMENT_READY_STATES[doc.readyState] && isModifiable())) {
        readyStatePoller.clear();
        decoratedDoc.stopObserving('readystatechange', checkDomLoadedState);
        if (!checkCssAndFire()) cssPoller = new Poller(checkCssAndFire);
      }
    },

    addImports = function(collection, sheet) {
      addImports = function(collection, sheet) {
        // Catch errors on partially loaded elements. Firefox may also
        // error when accessing css rules of sources using the file:// protocol
        try {
          var ss, rules = getRules(sheet), length = rules.length;
        } catch(e) {
          return false;
        }
        while (length--) {
          // bail when sheet is null on rules
          ss = rules[length].styleSheet;
          if (ss === null) return false;
          if (ss && isSameOrigin(ss.href)) {
            collection.push(ss);
            if (!addImports(collection, ss))
              return false;
          }
        }
        return collection;
      };

      if (isHostType(sheet, 'imports')) {
        addImports = function(collection, sheet) {
          var length = sheet.imports.length;
          while (length--) {
            if (isSameOrigin(sheet.imports[length].href)) {
              collection.push(sheet.imports[length]);
              addImports(collection, sheet.imports[length]);
            }
          }
          return collection;
        };
      }
      return addImports(collection, sheet);
    },

    getStyle = function(element, styleName) {
      getStyle = function(element, styleName) {
        var style = element.ownerDocument.defaultView.getComputedStyle(element, null);
        return (style || element.style)[styleName];
      };

      if (!envTest('ELEMENT_COMPUTED_STYLE')) {
        getStyle = function(element, styleName) {
          return (element.currentStyle || element.style)[styleName];
        };
      }
      return getStyle(element, styleName);
    },

    getSheet = function(element) {
      getSheet = function(element) {
        return element.sheet;
      };

      if (isHostType(element, 'styleSheet')) {
        getSheet = function(element) {
          return element.styleSheet;
        };
      }
      return getSheet(element);
    },

    getRules = function(sheet) {
      getRules = function(sheet) {
        return sheet.cssRules;
      };

      if (isHostType(sheet, 'rules')) {
        getRules = function(sheet) {
          return sheet.rules;
        };
      }
      return getRules(sheet);
    },

    addRule = function(sheet, selector, cssText) {
      addRule = function(sheet, selector, cssText) {
        return sheet.insertRule(selector + '{' + cssText + '}', getRules(sheet).length);
      };

      if (isHostType(sheet, 'addRule')) {
        addRule = function(sheet, selector, cssText) {
          return sheet.addRule(selector, cssText);
        };
      }
      return addRule(sheet, selector, cssText);
    },

    removeRule = function(sheet, index) {
      removeRule = function(sheet, index) {
        return sheet.deleteRule(index);
      };

      if (isHostType(sheet, 'removeRule')) {
        removeRule = function(sheet, index) {
          return sheet.removeRule(index);
        };
      }
      return removeRule(sheet, index);
    },

    injectRules = function(sheetElements, cache) {
      var className, length, sheets = getSheetObjects(sheetElements);
      if (!sheets) return false;
      length = sheets.length;
      while (length--) {
        className = 'fuse_css_loaded_' + cache.length;
        cache.push({ 'className': className, 'sheet': sheets[length] });
        addRule(sheets[length], '.' + className, 'margin-top: -1234px!important;');
      }
      return true;
    },

    isModifiable = function() {
      var body, parent, sibling, result = false;
      try {
        body    = doc.body;
        parent  = body.parentNode;
        sibling = body.nextSibling;
        parent.insertBefore(parent.removeChild(body), sibling);
        result = true;
      } catch(e) { }
      return result;
    },

    isCssLoaded = function() {
      var sheetElements = getSheetElements();
      if (!sheetElements.length) return cssDoneLoading();

      isCssLoaded = function() {
        var cache = [];
        if (!injectRules(sheetElements, cache)) return false;

        isCssLoaded = function() {
          var c, lastIndex, rules, length = cache.length, done = true;
          while (length--) {
            c = cache[length];
            rules = getRules(c.sheet);
            lastIndex = rules.length && rules.length - 1;

            // if styleSheet was still loading when test rule
            // was added it will have removed the rule.
            if (rules[lastIndex].selectorText.indexOf(c.className) > -1) {
              done = false;

              // if the styleSheet has only the test rule then skip
              if (rules.length === 1) {
                continue;
              }
              // add dummy element to body to test css rules
              if (!c.div) {
                c.div = doc.createElement('div');
                c.div.className = c.className;
                c.div.style.cssText = 'position:absolute;visibility:hidden;';
              }

              doc.body.appendChild(c.div);

              // when loaded clear cache entry
              if (getStyle(c.div, 'marginTop') == '-1234px') {
                cache.splice(length, 1);
              }

              // cleanup
              removeRule(c.sheet, lastIndex);
              doc.body.removeChild(c.div);
            }
          }
          if (done) {
            cache = null;
            return cssDoneLoading();
          }
          return done;
        };
        return isCssLoaded();
      };
      return isCssLoaded();
    };

    Poller.prototype.clear = function() {
      this.id != null && (this.id = window.clearTimeout(this.id));
    };

    /*------------------------------------------------------------------------*/

    if (doc.readyState == 'complete') {
      // fire dom:loaded and window load events if window is already loaded
      return fuse(window).fire('load');
    }

    if (envTest('ELEMENT_ADD_EVENT_LISTENER')) {
      decoratedDoc.observe('DOMContentLoaded', checkDomLoadedState);
    }
    // Weak inference used as IE 6/7 have the operation aborted error
    else if (envTest('ELEMENT_DO_SCROLL') && !envTest('JSON')) {
      // Avoid a potential browser hang when checking window.top (thanks Rich Dougherty)
      // The value of frameElement can be null or an object.
      // Checking window.frameElement could throw if not accessible.
      try { isFramed = window.frameElement != null; } catch(e) { }

      // doScroll will not throw an error when in an iframe
      // so we rely on the event system to fire the dom:loaded event
      // before the window onload in IE6/7
      if (isFramed) return;

      // Derived with permission from Diego Perini's IEContentLoaded
      // http://javascript.nwbox.com/IEContentLoaded/
      checkDomLoadedState = function() {
        if (decoratedDoc.isLoaded()) {
          readyStatePoller.clear();
        } else {
          try { fuse._div.doScroll(); } catch(e) { return; }
          fireDomLoadedEvent();
        }
      };
    }

    // readystate and poller are used (first one to complete wins)
    decoratedDoc.observe('readystatechange', checkDomLoadedState);
    readyStatePoller = new Poller(checkDomLoadedState);
  })();
})(this);

// update native generics and element methods
fuse.updateGenerics(true);