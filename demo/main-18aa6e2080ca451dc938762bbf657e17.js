// Permutation: locale:en_US; qx.application:"apiviewer.Application"; qx.client:"gecko"; qx.debug:"on"; qx.dynlocale:"off"; qx.globalErrorHandling:"off"; qx.jstools:true; qx.theme:"apiviewer.Theme"; qx.version:1.0 (18aa6e2080ca451dc938762bbf657e17)
// Optimization: {'privates', 'variables', 'declarations', 'blocks'}

// qx.Bootstrap
//   - size: 4751 bytes
//   - modified: 2010-10-14T23:42:57
//   - names:
//       Array, 3x
//       Date, 1x
//       Error, 1x
//       Function, 3x
//       Object, 5x
//       String, 1x
//       qx, 29x
//       undefined, 3x
//       window, 3x
//   - packages:
//       Array.prototype.slice.call, 2x
//       Object.keys, 2x
//       Object.prototype.hasOwnProperty, 2x
//       Object.prototype.toString.call, 1x
//       qx.$$start, 1x
//       qx.Bootstrap, 1x
//       qx.Bootstrap.$$firstUp, 1x
//       qx.Bootstrap.$$logs.push, 4x
//       qx.Bootstrap.$$registry, 2x
//       qx.Bootstrap.__classToTypeMap, 1x
//       qx.Bootstrap.__shadowedKeys, 1x
//       qx.Bootstrap.createNamespace, 1x
//       qx.Bootstrap.define, 2x
//       qx.Bootstrap.genericToString, 1x
//       qx.Bootstrap.getByInterface, 1x
//       qx.Bootstrap.getByName, 1x
//       qx.Bootstrap.getClass, 4x
//       qx.Bootstrap.getEventType, 1x
//       qx.Bootstrap.getKeys, 3x
//       qx.Bootstrap.setDisplayName, 1x
//       qx.Bootstrap.setDisplayNames, 3x
//       window.qx, 2x
window.qx||(window.qx={});
qx.Bootstrap={genericToString:function(){return"[Class "+this.classname+"]"},
createNamespace:function(g,f){for(var c=g.split("."),a=window,b=c[0],d=0,e=c.length-1;
d<e;
d++,b=c[d])a=a[b]?a[b]:a[b]={};
a[b]=f;
return b},
setDisplayName:function(a,c,b){a.displayName=c+"."+b+"()"},
setDisplayNames:function(c,d){for(a in c){var b=c[a],a;
b instanceof Function&&(b.displayName=d+"."+a+"()")}},
define:function(d,b){if(!b)var b={statics:{}},a,g,k,c,e,i,f,h,j;
g=null;
qx.Bootstrap.setDisplayNames(b.statics,d);
if(b.members||b.extend){qx.Bootstrap.setDisplayNames(b.members,d+".prototype");
a=b.construct||new Function;
b.extend&&this.extendClass(a,a,b.extend,d,j);
k=b.statics||{},c=0,e=qx.Bootstrap.getKeys(k),i=e.length;
for(;
c<i;
c++){f=e[c];
a[f]=k[f]}g=a.prototype;
h=b.members||{},c=0,e=qx.Bootstrap.getKeys(h),i=e.length;
for(;
c<i;
c++){f=e[c];
g[f]=h[f]}}else a=b.statics||{};
j=this.createNamespace(d,a);
a.name=a.classname=d;
a.basename=j;
a.$$type="Class";
a.hasOwnProperty("toString")||(a.toString=this.genericToString);
b.defer&&b.defer(a,g);
qx.Bootstrap.$$registry[d]=b.statics;
return a}};
qx.Bootstrap.define("qx.Bootstrap",{statics:{LOADSTART:qx.$$start||new Date(),
createNamespace:qx.Bootstrap.createNamespace,
define:qx.Bootstrap.define,
setDisplayName:qx.Bootstrap.setDisplayName,
setDisplayNames:qx.Bootstrap.setDisplayNames,
genericToString:qx.Bootstrap.genericToString,
extendClass:function(b,d,c,h,g){var f=c.prototype,e=new Function,a;
e.prototype=f;
a=new e;
b.prototype=a;
a.name=a.classname=h;
a.basename=g;
d.base=b.superclass=c;
d.self=b.constructor=a.constructor=b},
getByName:function(b,c){var a=qx.Bootstrap.$$registry[b];
if(!a&&c)throw new Error("Missing class: "+b+"! "+c);
return a},
$$registry:{},
objectGetLength:{count:function(a){return a.__count__},
"default":function(c){var a=0,b;
for(b in c)a++;
return a}}[{}.__count__==0?"count":"default"],
__VSYME:["isPrototypeOf","hasOwnProperty","toLocaleString","toString","valueOf","constructor"],
getKeys:{ES5:Object.keys,
BROKEN_IE:function(d){var c=[],f=Object.prototype.hasOwnProperty,b,h,a,e,g;
for(b in d)f.call(d,b)&&c.push(b);
h=qx.Bootstrap.__VSYME,a=0,e=h,g=e.length;
for(;
a<g;
a++)f.call(d,e[a])&&c.push(e[a]);
return c},
"default":function(c){var b=[],d=Object.prototype.hasOwnProperty,a;
for(a in c)d.call(c,a)&&b.push(a);
return b}}[typeof Object.keys=="function"?"ES5":(function(){for(var a in {toString:1})return a})()!=="toString"?"BROKEN_IE":"default"],
getKeysAsString:function(b){var a=qx.Bootstrap.getKeys(b);
if(a.length==0)return"";
return"\""+a.join("\", \"")+"\""},
__9jTYa:{"[object String]":"String",
"[object Array]":"Array",
"[object Object]":"Object",
"[object RegExp]":"RegExp",
"[object Number]":"Number",
"[object Boolean]":"Boolean",
"[object Date]":"Date",
"[object Function]":"Function",
"[object Error]":"Error"},
bind:function(a,b,d){var c=Array.prototype.slice.call(arguments,2,arguments.length);
return function(){var d=Array.prototype.slice.call(arguments,0,arguments.length);
return a.apply(b,c.concat(d))}},
$$firstUp:{},
firstUp:function(a){var c=qx.Bootstrap.$$firstUp,b=c[a];
return b!=null?b:c[a]=a.charAt(0).toUpperCase()+a.substr(1)},
firstLow:function(a){return a.charAt(0).toLowerCase()+a.substr(1)},
getClass:function(b){var a=Object.prototype.toString.call(b);
return qx.Bootstrap.__9jTYa[a]||a.slice(8,-1)},
isString:function(a){return a!==null&&(typeof a==="string"||qx.Bootstrap.getClass(a)=="String"||a instanceof String||!!a&&!!a.$$isString)},
isArray:function(a){return a!==null&&(a instanceof Array||qx.Bootstrap.getClass(a)=="Array"||!!a&&!!a.$$isArray)},
isObject:function(a){return a!==undefined&&a!==null&&qx.Bootstrap.getClass(a)=="Object"},
isFunction:function(a){return qx.Bootstrap.getClass(a)=="Function"},
classIsDefined:function(a){return qx.Bootstrap.getByName(a)!==undefined},
getEventType:function(a,b){var a=a.constructor;
while(a.superclass){if(a.$$events&&a.$$events[b]!==undefined)return a.$$events[b];
a=a.superclass}return null},
supportsEvent:function(a,b){return!!qx.Bootstrap.getEventType(a,b)},
getByInterface:function(a,e){var c,b,d;
while(a){if(a.$$implements){c=a.$$flatImplements;
for(b=0,d=c.length;
b<d;
b++)if(c[b]===e)return a}a=a.superclass}return null},
hasInterface:function(a,b){return!!qx.Bootstrap.getByInterface(a,b)},
getMixins:function(a){var b=[];
while(a)a.$$includes&&b.push.apply(b,a.$$flatIncludes),a=a.superclass;
return b},
$$logs:[],
debug:function(a,b){qx.Bootstrap.$$logs.push(["debug",arguments])},
info:function(a,b){qx.Bootstrap.$$logs.push(["info",arguments])},
warn:function(a,b){qx.Bootstrap.$$logs.push(["warn",arguments])},
error:function(a,b){qx.Bootstrap.$$logs.push(["error",arguments])},
trace:function(a){}}});


// qx.lang.Core
//   - size: 2479 bytes
//   - modified: 2010-05-21T19:22:00
//   - names:
//       Array, 21x
//       Error, 4x
//       Math, 2x
//       String, 3x
//       qx, 10x
//       undefined, 5x
//       window, 5x
//   - packages:
//       Array.prototype.every, 3x
//       Array.prototype.filter, 3x
//       Array.prototype.forEach, 3x
//       Array.prototype.indexOf, 3x
//       Array.prototype.lastIndexOf, 3x
//       Array.prototype.map, 3x
//       Array.prototype.some, 3x
//       Error.prototype.toString, 4x
//       Math.max, 2x
//       String.prototype.quote, 3x
//       qx.Bootstrap.define, 1x
//       qx.lang.Core.arrayEvery, 1x
//       qx.lang.Core.arrayFilter, 1x
//       qx.lang.Core.arrayForEach, 1x
//       qx.lang.Core.arrayIndexOf, 1x
//       qx.lang.Core.arrayLastIndexOf, 1x
//       qx.lang.Core.arrayMap, 1x
//       qx.lang.Core.arraySome, 1x
//       qx.lang.Core.errorToString, 1x
//       qx.lang.Core.stringQuote, 1x
qx.Bootstrap.define("qx.lang.Core",{statics:{errorToString:{"native":Error.prototype.toString,
emulated:function(){return this.message}}[!Error.prototype.toString||Error.prototype.toString()=="[object Error]"?"emulated":"native"],
arrayIndexOf:{"native":Array.prototype.indexOf,
emulated:function(c,a){a==null?a=0:a<0&&(a=Math.max(0,this.length+a));
for(var b=a;
b<this.length;
b++)if(this[b]===c)return b;
return-1}}[Array.prototype.indexOf?"native":"emulated"],
arrayLastIndexOf:{"native":Array.prototype.lastIndexOf,
emulated:function(c,a){a==null?a=this.length-1:a<0&&(a=Math.max(0,this.length+a));
for(var b=a;
b>=0;
b--)if(this[b]===c)return b;
return-1}}[Array.prototype.lastIndexOf?"native":"emulated"],
arrayForEach:{"native":Array.prototype.forEach,
emulated:function(e,d){for(var c=this.length,a=0,b;
a<c;
a++){b=this[a];
b!==undefined&&e.call(d||window,b,a,this)}}}[Array.prototype.forEach?"native":"emulated"],
arrayFilter:{"native":Array.prototype.filter,
emulated:function(f,e){for(var c=[],d=this.length,a=0,b;
a<d;
a++){b=this[a];
b!==undefined&&f.call(e||window,b,a,this)&&c.push(this[a])}return c}}[Array.prototype.filter?"native":"emulated"],
arrayMap:{"native":Array.prototype.map,
emulated:function(f,e){for(var c=[],d=this.length,a=0,b;
a<d;
a++){b=this[a];
b!==undefined&&(c[a]=f.call(e||window,b,a,this))}return c}}[Array.prototype.map?"native":"emulated"],
arraySome:{"native":Array.prototype.some,
emulated:function(e,d){for(var c=this.length,a=0,b;
a<c;
a++){b=this[a];
if(b!==undefined)if(e.call(d||window,b,a,this))return true}return false}}[Array.prototype.some?"native":"emulated"],
arrayEvery:{"native":Array.prototype.every,
emulated:function(e,d){for(var c=this.length,a=0,b;
a<c;
a++){b=this[a];
if(b!==undefined)if(!e.call(d||window,b,a,this))return false}return true}}[Array.prototype.every?"native":"emulated"],
stringQuote:{"native":String.prototype.quote,
emulated:function(){return"\""+this.replace(/\\/g,"\\\\").replace(/\"/g,"\\\"")+"\""}}[String.prototype.quote?"native":"emulated"]}});
Error.prototype.toString=qx.lang.Core.errorToString;
Array.prototype.indexOf=qx.lang.Core.arrayIndexOf;
Array.prototype.lastIndexOf=qx.lang.Core.arrayLastIndexOf;
Array.prototype.forEach=qx.lang.Core.arrayForEach;
Array.prototype.filter=qx.lang.Core.arrayFilter;
Array.prototype.map=qx.lang.Core.arrayMap;
Array.prototype.some=qx.lang.Core.arraySome;
Array.prototype.every=qx.lang.Core.arrayEvery;
String.prototype.quote=qx.lang.Core.stringQuote;


// qx.core.Setting
//   - size: 1333 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 4x
//       decodeURIComponent, 1x
//       document, 1x
//       qx, 1x
//       undefined, 5x
//       window, 5x
//   - packages:
//       document.location.search.slice, 1x
//       qx.Bootstrap.define, 1x
//       window.qxsettings, 5x
qx.Bootstrap.define("qx.core.Setting",{statics:{__zP2zc:{},
define:function(a,b){if(b===undefined)throw new Error("Default value of setting \""+a+"\" must be defined!");
if(!this.__zP2zc[a])this.__zP2zc[a]={};
else if(this.__zP2zc[a].defaultValue!==undefined)throw new Error("Setting \""+a+"\" is already defined!");
this.__zP2zc[a].defaultValue=b},
get:function(b){var a=this.__zP2zc[b];
if(a===undefined)throw new Error("Setting \""+b+"\" is not defined.");
if(a.value!==undefined)return a.value;
return a.defaultValue},
set:function(a,b){if((a.split(".")).length<2)throw new Error("Malformed settings key \""+a+"\". Must be following the schema \"namespace.key\".");
this.__zP2zc[a]||(this.__zP2zc[a]={});
this.__zP2zc[a].value=b},
__jA3lT:function(){if(window.qxsettings){for(a in window.qxsettings)this.set(a,window.qxsettings[a]);
window.qxsettings=undefined;
try{delete window.qxsettings}catch(b){}this.__bg8Heh()}var a},
__bg8Heh:function(){if(this.get("qx.allowUrlSettings")!=true)return;
for(var c=document.location.search.slice(1).split("&"),b=0,a;
b<c.length;
b++){a=c[b].split(":");
if(a.length!=3||a[0]!="qxsetting")continue;
this.set(a[1],decodeURIComponent(a[2]))}}},
defer:function(a){a.define("qx.allowUrlSettings",false);
a.define("qx.allowUrlVariants",false);
a.define("qx.propertyDebugLevel",0);
a.__jA3lT()}});


// qx.core.Type
//   - size: 2978 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       Array, 1x
//       Error, 3x
//       Function, 1x
//       Object, 1x
//       RegExp, 1x
//       isFinite, 1x
//       qx, 8x
//       window, 2x
//   - packages:
//       Object.prototype.toString.call, 1x
//       qx.Bootstrap.define, 1x
//       qx.Bootstrap.getByName, 1x
//       qx.Bootstrap.hasInterface, 1x
//       qx.Class, 1x
//       qx.Class.hasMixin, 1x
//       qx.Interface.getByName, 1x
//       qx.Mixin.getByName, 1x
//       qx.core.Type.check, 1x
qx.Bootstrap.define("qx.core.Type",{statics:{__mtv7d:{String:"$$isString"},
__qxW2Q:{String:1,
Number:1,
Function:1,
RegExp:1,
Date:1,
Boolean:1,
Array:1,
Object:1,
Error:1},
__bqGsvO:{Integer:"Number",
PositiveNumber:"Number",
PositiveInteger:"Number"},
__E0WFw:{String:"string",
Number:"number",
Boolean:"boolean"},
__3iKAd:{"[object String]":"String",
"[object Array]":"Array",
"[object Object]":"Object",
"[object RegExp]":"RegExp",
"[object Number]":"Number",
"[object Boolean]":"Boolean",
"[object Date]":"Date",
"[object Function]":"Function",
"[object Error]":"Error"},
__DBL9i:{Class:1,
Mixin:1,
Interface:1,
Theme:1},
__yBAW6:{Node:1,
Element:1,
Document:1},
__p3qB2:{},
add:function(a,d,c){var b=this.__p3qB2;
if(b[a])throw new Error("Type if already registered by another class: "+a);
b[a]={method:d,
context:c}},
check:function(c,a,r,d){var b,n,o,h,k,g,i,m,j,l,f,e,p;
d||(d=Error);
if(c==null){b=a=="Null";
if(b==false)throw new d("Value: '"+c+"' is null but needs to be: "+a+"!")}else if(typeof a=="string"){if(this.__qxW2Q[a]||this.__bqGsvO[a]){n=this.__bqGsvO[a];
n&&(o=a,a=n);
h=this.__E0WFw[a];
h&&(b=typeof c==h);
b||(b=this.__3iKAd[Object.prototype.toString.call(c)]==a);
k=this.__mtv7d[a];
!b&&k&&(b=k in c);
b&&a=="Number"&&(b=isFinite(c));
o&&(a=o,b&&(a=="Integer"?b=c%1==0:a=="PositiveInteger"?b=c%1==0&&c>=0:a=="PositiveNumber"&&(b=c>=0)));
if(b==false)throw new d("Value: '"+c+"' is not type of: "+a+"!")}else if(this.__yBAW6[a]){g=c.nodeType;
b=g!=null&&(a=="Node"||g==1&&a=="Element"||g==9&&a=="Document");
if(b==false)throw new d("Value: '"+c+"' is not type of "+a+"!")}else if(this.__DBL9i[a]){b=c.$$type==a;
if(b==false)throw new d("Value: '"+c+"' is not type of "+a+"!")}else{i=qx.Bootstrap.getByName(a);
if(i){b=c.hasOwnProperty&&c instanceof i;
if(b==false)throw new d("Value: '"+c+"' is not an instance of "+a+"!")}else{m=c.constructor;
j=qx.Interface.getByName(a);
if(j){b=qx.Bootstrap.hasInterface(m,j);
if(b==false)throw new d("Value: '"+c+"' do not implement interface: "+a+"!")}else{l=qx.Mixin.getByName(a);
if(l){b=qx.Class&&qx.Class.hasMixin(m,l);
if(b==false)throw new d("Value: '"+c+"' does not include mixin: "+a+"!")}}}}b==null&&(f=this.__p3qB2[a],f&&(b=f.method.call(f.context||window,c)))}else if(a instanceof Array){if(a.indexOf)b=a.indexOf(c)!=-1;
else{b=false;
for(e=0,p=a.length;
e<p;
e++)if(c===a[e]){b=true;
break}}if(b==false)throw new d("Value: '"+c+"' is not listed in possible values: "+a)}else if(a instanceof RegExp){qx.core.Type.check(c,"String");
b=a.match(c);
if(b==false)throw new d("Value: '"+c+"' does not match regular expression: "+a)}else if(a instanceof Function){try{b=a.call(r||window,c);
b==null&&(b=true)}catch(q){throw new d("Value: '"+c+"' is not accepted by check routine: "+q)}if(b==false)throw new d("Value: '"+c+"' is not accepted by check routine.")}if(b==null||b==false){d||(d=Error);
if(b==null)throw new d("Unsupported check: "+a);
throw new d("Value: '"+c+"' does not validates as: "+a)}}}});


// qx.core.property.Util
//   - size: 501 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       qx, 2x
//   - packages:
//       qx.Bootstrap.define, 1x
//       qx.Bootstrap.getKeys, 1x
qx.Bootstrap.define("qx.core.property.Util",{statics:{getPropertyDefinition:function(a,c){var b;
while(a){b=a.$$properties;
if(b&&b[c])return b[c];
a=a.superclass}return null},
hasProperty:function(a,b){return!!this.getPropertyDefinition(a,b)},
getProperties:function(a){var b=[];
while(a)a.$$properties&&b.push.apply(b,qx.Bootstrap.getKeys(a.$$properties)),a=a.superclass;
return b},
getByProperty:function(a,b){while(a){if(a.$$properties&&a.$$properties[b])return a;
a=a.superclass}return null}}});


// qx.Interface
//   - size: 4266 bytes
//   - modified: 2010-08-28T00:14:34
//   - names:
//       Array, 2x
//       Date, 1x
//       Error, 12x
//       RegExp, 1x
//       qx, 12x
//       undefined, 5x
//   - packages:
//       qx.Bootstrap.createNamespace, 1x
//       qx.Bootstrap.define, 1x
//       qx.Bootstrap.firstLow, 1x
//       qx.Bootstrap.hasInterface, 1x
//       qx.Bootstrap.isFunction, 2x
//       qx.Bootstrap.objectGetLength, 1x
//       qx.Bootstrap.supportsEvent, 1x
//       qx.Interface.$$registry, 1x
//       qx.core.property.Util.getPropertyDefinition, 3x
qx.Bootstrap.define("qx.Interface",{statics:{define:function(c,a){if(a){a.extend&&!(a.extend instanceof Array)&&(a.extend=[a.extend]);
this.__9AoUd(c,a);
var b=a.statics?a.statics:{};
a.extend&&(b.$$extends=a.extend);
a.properties&&(b.$$properties=a.properties);
a.members&&(b.$$members=a.members);
a.events&&(b.$$events=a.events)}else b={};
b.$$type="Interface";
b.name=c;
b.toString=this.genericToString;
b.basename=qx.Bootstrap.createNamespace(c,b);
qx.Interface.$$registry[c]=b;
return b},
getByName:function(a){return this.$$registry[a]},
isDefined:function(a){return this.getByName(a)!==undefined},
getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry)},
flatten:function(a){if(!a)return[];
for(var c=a.concat(),b=0,d=a.length;
b<d;
b++)a[b].$$extends&&c.push.apply(c,this.flatten(a[b].$$extends));
return c},
__209sm:function(b,e,c,h){var d=c.$$members,a,f,i,g;
if(d){for(a in d)if(qx.Bootstrap.isFunction(d[a])){f=this.__bq36Iv(e,a),i=f||qx.Bootstrap.isFunction(b[a]);
if(!i)throw new Error("Implementation of method \""+a+"\" is missing in class \""+e.classname+"\" required by interface \""+c.name+"\"");
g=h===true&&!f&&!qx.Bootstrap.hasInterface(e,c);
g&&(b[a]=this.__bRcQ2M(c,b[a],a,d[a]))}else if(typeof b[a]===undefined)if(typeof b[a]!=="function")throw new Error("Implementation of member \""+a+"\" is missing in class \""+e.classname+"\" required by interface \""+c.name+"\"")}},
__bq36Iv:function(b,f){var a=f.match(/^(is|toggle|get|set|reset)(.*)$/),c,d,e;
if(!a)return false;
c=qx.Bootstrap.firstLow(a[2]),d=qx.core.property.Util.getPropertyDefinition(b,c);
if(!d)return false;
e=a[0]=="is"||a[0]=="toggle";
if(e)return qx.core.property.Util.getPropertyDefinition(b,c).check=="Boolean";
return true},
__brN1Tm:function(b,c){if(c.$$properties)for(var a in c.$$properties)if(!qx.core.property.Util.getPropertyDefinition(b,a))throw new Error("The property \""+a+"\" is not supported by Class \""+b.classname+"\"!")},
__WoSsQ:function(b,c){if(c.$$events)for(var a in c.$$events)if(!qx.Bootstrap.supportsEvent(b,a))throw new Error("The event \""+a+"\" is not supported by Class \""+b.classname+"\"!")},
assertObject:function(c,a){var b=c.constructor,e,d,f;
this.__209sm(c,b,a,false);
this.__brN1Tm(b,a);
this.__WoSsQ(b,a);
e=a.$$extends;
if(e)for(d=0,f=e.length;
d<f;
d++)this.assertObject(c,e[d])},
assert:function(a,b,e){this.__209sm(a.prototype,a,b,e);
this.__brN1Tm(a,b);
this.__WoSsQ(a,b);
var c=b.$$extends,d,f;
if(c)for(d=0,f=c.length;
d<f;
d++)this.assert(a,c[d],e)},
genericToString:function(){return"[Interface "+this.name+"]"},
$$registry:{},
__bRcQ2M:function(e,b,d,c){function a(){c.apply(this,arguments);
return b.apply(this,arguments)}b.wrapper=a;
return a},
__PnQ3H:{extend:"object",
statics:"object",
members:"object",
properties:"object",
events:"object"},
__9AoUd:function(d,b){{var e=this.__PnQ3H,a,g,c,h,f;
for(a in b){if(e[a]===undefined)throw new Error("The configuration key \""+a+"\" in class \""+d+"\" is not allowed!");
if(b[a]==null)throw new Error("Invalid key '"+a+"' in interface '"+d+"'! The value is undefined/null!");
if(e[a]!==null&&typeof b[a]!==e[a])throw new Error("Invalid type of key \""+a+"\" in interface \""+d+"\"! The type of the key must be \""+e[a]+"\"!")}g=["statics","members","properties","events"],c=0,h=g.length;
for(;
c<h;
c++){a=g[c];
if(b[a]!==undefined&&(b[a] instanceof Array||b[a] instanceof RegExp||b[a] instanceof Date||b[a].classname!==undefined))throw new Error("Invalid key \""+a+"\" in interface \""+d+"\"! The value needs to be a map!")}if(b.extend)for(c=0,f=b.extend,h=f.length;
c<h;
c++){if(f[c]==null)throw new Error("Extends of interfaces must be interfaces. The extend number '"+c+1+"' in interface '"+d+"' is undefined/null!");
if(f[c].$$type!=="Interface")throw new Error("Extends of interfaces must be interfaces. The extend number '"+c+1+"' in interface '"+d+"' is not an interface!")}if(b.statics)for(a in b.statics){if(a.toUpperCase()!==a)throw new Error("Invalid key \""+a+"\" in interface \""+d+"\"! Static constants must be all uppercase.");
switch(typeof b.statics[a]){case"boolean":case"string":case"number":break;
default:throw new Error("Invalid key \""+a+"\" in interface \""+d+"\"! Static constants must be all of a primitive type.")}}}}}});


// qx.core.property.Core
//   - size: 87 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       qx, 1x
//   - packages:
//       qx.Bootstrap.define, 1x
qx.Bootstrap.define("qx.core.property.Core",{statics:{RUNTIME_OVERRIDE:false,
ID:0}});


// qx.core.property.Group
//   - size: 656 bytes
//   - modified: 2010-09-18T15:03:07
//   - names:
//       Array, 3x
//       qx, 2x
//   - packages:
//       Array.prototype.slice.call, 1x
//       qx.Bootstrap.define, 1x
//       qx.Bootstrap.firstUp, 1x
qx.Bootstrap.define("qx.core.property.Group",{statics:{expandShortHand:function(b){var a=b instanceof Array?b.concat():Array.prototype.slice.call(b);
switch(a.length){case 1:a[1]=a[2]=a[3]=a[0];
break;
case 2:a[2]=a[0];
case 3:a[3]=a[1]}return a},
add:function(a,g,b){var f=qx.Bootstrap.firstUp(g),d=a.prototype,h=a.$$propertyGroups,j,c,e,i;
h||(h=a.$$propertyGroups={});
a.$$propertyGroups[g]=b;
j=b.shorthand,c=b.group,e=c.length,i=this;
d["set"+f]=function(d){var b=d instanceof Array?d:arguments,f,a;
j&&(b=i.expandShortHand(b));
f={},a=0;
for(;
a<e;
a++)f[c[a]]=b[a];
this.set(f)};
d["reset"+f]=function(){for(var a=0;
a<e;
a++)this.reset(c[a])}}}});


// qx.Mixin
//   - size: 3239 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Array, 2x
//       Date, 1x
//       Error, 9x
//       Function, 2x
//       RegExp, 1x
//       qx, 9x
//       undefined, 3x
//   - packages:
//       qx.Bootstrap.createNamespace, 1x
//       qx.Bootstrap.define, 1x
//       qx.Bootstrap.getMixins, 1x
//       qx.Bootstrap.objectGetLength, 1x
//       qx.Bootstrap.setDisplayName, 2x
//       qx.Bootstrap.setDisplayNames, 2x
//       qx.Mixin.checkCompatibility, 1x
qx.Bootstrap.define("qx.Mixin",{statics:{define:function(c,a){if(a){a.include&&!(a.include instanceof Array)&&(a.include=[a.include]);
this.__9AoUd(c,a);
var b=a.statics?a.statics:{},d;
qx.Bootstrap.setDisplayNames(b,c);
for(d in b)b[d] instanceof Function&&(b[d].$$mixin=b);
a.construct&&(b.$$constructor=a.construct,qx.Bootstrap.setDisplayName(a.construct,c,"constructor"));
a.include&&(b.$$includes=a.include);
a.properties&&(b.$$properties=a.properties);
a.members&&(b.$$members=a.members,qx.Bootstrap.setDisplayNames(a.members,c+".prototype"));
for(d in b.$$members)b.$$members[d] instanceof Function&&(b.$$members[d].$$mixin=b);
a.events&&(b.$$events=a.events);
a.destruct&&(b.$$destructor=a.destruct,qx.Bootstrap.setDisplayName(a.destruct,c,"destruct"))}else b={};
b.$$type="Mixin";
b.name=c;
b.toString=this.genericToString;
b.basename=qx.Bootstrap.createNamespace(c,b);
this.$$registry[c]=b;
return b},
checkCompatibility:function(i){var h=this.flatten(i),g=h.length,e,d,c,b,f,a;
if(g<2)return true;
e={},d={},c={},f=0;
for(;
f<g;
f++){b=h[f];
for(a in b.events){if(c[a])throw new Error("Conflict between mixin \""+b.name+"\" and \""+c[a]+"\" in member \""+a+"\"!");
c[a]=b.name}for(a in b.properties){if(e[a])throw new Error("Conflict between mixin \""+b.name+"\" and \""+e[a]+"\" in property \""+a+"\"!");
e[a]=b.name}for(a in b.members){if(d[a])throw new Error("Conflict between mixin \""+b.name+"\" and \""+d[a]+"\" in member \""+a+"\"!");
d[a]=b.name}}return true},
isCompatible:function(c,b){var a=qx.Bootstrap.getMixins(b);
a.push(c);
return qx.Mixin.checkCompatibility(a)},
getByName:function(a){return this.$$registry[a]},
isDefined:function(a){return this.getByName(a)!==undefined},
getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry)},
flatten:function(a){if(!a)return[];
for(var c=a.concat(),b=0,d=a.length;
b<d;
b++)a[b].$$includes&&c.push.apply(c,this.flatten(a[b].$$includes));
return c},
genericToString:function(){return"[Mixin "+this.name+"]"},
$$registry:{},
__PnQ3H:{include:"object",
statics:"object",
members:"object",
properties:"object",
events:"object",
destruct:"function",
construct:"function"},
__9AoUd:function(d,b){var e=this.__PnQ3H,a,g,c,h,f;
for(a in b){if(!e[a])throw new Error("The configuration key \""+a+"\" in mixin \""+d+"\" is not allowed!");
if(b[a]==null)throw new Error("Invalid key \""+a+"\" in mixin \""+d+"\"! The value is undefined/null!");
if(e[a]!==null&&typeof b[a]!==e[a])throw new Error("Invalid type of key \""+a+"\" in mixin \""+d+"\"! The type of the key must be \""+e[a]+"\"!")}g=["statics","members","properties","events"],c=0,h=g.length;
for(;
c<h;
c++){a=g[c];
if(b[a]!==undefined&&(b[a] instanceof Array||b[a] instanceof RegExp||b[a] instanceof Date||b[a].classname!==undefined))throw new Error("Invalid key \""+a+"\" in mixin \""+d+"\"! The value needs to be a map!")}if(b.include){for(c=0,f=b.include,h=f.length;
c<h;
c++){if(f[c]==null)throw new Error("Includes of mixins must be mixins. The include number '"+(c+1)+"' in mixin '"+d+"'is undefined/null!");
if(f[c].$$type!=="Mixin")throw new Error("Includes of mixins must be mixins. The include number '"+(c+1)+"' in mixin '"+d+"'is not a mixin!")}this.checkCompatibility(b.include)}}}});


// qx.core.property.Debug
//   - size: 2446 bytes
//   - modified: 2010-11-02T15:58:25
//   - names:
//       Error, 11x
//       qx, 3x
//       undefined, 3x
//   - packages:
//       qx.Bootstrap.define, 1x
//       qx.core.Type.check, 1x
//       qx.core.property.Util, 1x
qx.Bootstrap.define("qx.core.property.Debug",{statics:{checkSetter:function(a,c,d){var b=c.name,e,f;
if(d.length==0)throw new Error("Called set() method of property "+b+" on object "+a+" with no arguments!");
d.length>1&&(a.warn("Called set() method of property "+b+" on object "+a+" with too many arguments!"),a.trace());
e=d[0];
if(e==null){if(!c.nullable)throw new Error("Property "+b+" in object "+a+" is not nullable!")}else{f=c.check;
if(f)try{qx.core.Type.check(e,f,a)}catch(g){throw new Error("Could not set() property "+b+" of object "+a+": "+g)}}},
checkResetter:function(a,b,c){c.length!=0&&(a.warn("Called reset method of property "+b.name+" on "+a+" with too many arguments!"),a.trace())},
checkGetter:function(a,b,c){c.length!=0&&(a.warn("Called get method of property "+b.name+" on "+a+" with too many arguments!"),a.trace())},
__XFwsu:{name:"string",
inheritable:"boolean",
nullable:"boolean",
themeable:"boolean",
refine:"boolean",
init:null,
apply:"string",
event:"string",
check:null,
validate:null},
__bBN7cT:{name:"string",
group:"object",
shorthand:"boolean",
themeable:"boolean"},
validateConfig:function(c,b,d,h){var g=qx.core.property.Util,f=g.hasProperty(c,b),i,a,e;
if(f){i=g.getPropertyDefinition(c,b);
if(d.refine&&i.init===undefined)throw new Error("Could not refine a init value if there was previously no init value defined. Property '"+b+"' of class '"+c.classname+"'.")}if(!f&&d.refine)throw new Error("Could not refine non-existent property: "+b+"!");
if(f&&!h)throw new Error("Class "+c.classname+" already has a property: "+b+"!");
if(f&&h){if(!d.refine)throw new Error("Could not refine property \""+b+"\" without a \"refine\" flag in the property definition! This class: "+c.classname+", original class: "+g.getByProperty(c,b).classname+".");
for(a in d)if(a!=="init"&&a!=="refine")throw new Error("Class "+c.classname+" could not refine property: "+b+"! Key: "+a+" could not be refined!")}e=d.group?this.__bBN7cT:this.__XFwsu;
for(a in d){if(e[a]===undefined)throw new Error("The configuration key \""+a+"\" of property \""+b+"\" in class \""+c.classname+"\" is not allowed!");
if(d[a]===undefined)throw new Error("Invalid key \""+a+"\" of property \""+b+"\" in class \""+c.classname+"\"! The value is undefined: "+d[a]);
if(e[a]!==null&&typeof d[a]!==e[a])throw new Error("Invalid type of key \""+a+"\" of property \""+b+"\" in class \""+c.classname+"\"! The type of the key must be \""+e[a]+"\"!")}}}});


// qx.core.property.Multi
//   - size: 4356 bytes
//   - modified: 2010-11-02T15:58:34
//   - names:
//       Error, 3x
//       Object, 1x
//       isNaN, 1x
//       qx, 11x
//       undefined, 1x
//   - packages:
//       qx.Bootstrap, 1x
//       qx.Bootstrap.define, 1x
//       qx.core.Type, 1x
//       qx.core.ValidationError, 1x
//       qx.core.property.Core.ID, 2x
//       qx.core.property.Debug.checkGetter, 1x
//       qx.core.property.Debug.checkResetter, 1x
//       qx.core.property.Debug.checkSetter, 1x
//       qx.core.property.Util, 2x
(function(){var k=0,d={},c={4:{},
3:{},
2:{get:"getThemedValue"},
1:{get:"getInheritedValue"}},g={inherited:1,
theme:2,
user:3,
override:4},f="$$init-",b="$$data",a,i=qx.Bootstrap,j=qx.core.Type,h=qx.core.property.Util,e=function(u,B,x,n){if(!u._getChildren)return;
var q=u._getChildren(),y=q.length,p,m,v,w,o,t,h,l,j,i,s,k,z,r,A;
if(!y)return;
p=g.inherited,m=n.name,v=n.apply,w=n.event,o=d[m],t=f+m,z=qx.core.property.Util,r=0,A=q.length;
for(;
r<A;
r++){h=q[r];
if(!z.getPropertyDefinition(h.constructor,m))continue;
l=h[b];
l||(l=h[b]={});
j=l[o];
if(j!==a&&j>p)continue;
j===p?i=x:j!==a?(s=c[j].get,i=s?h[s](m):h[o+j]):i=h[t];
k=B;
k===a?(k=h[t],l[o]=a):l[o]=p;
k!==i&&(v&&h[v](k,i,m),w&&h.fireDataEvent(w,k,i),e(h,k,i,n))}};
qx.Bootstrap.define("qx.core.property.Multi",{statics:{add:function(x,m,g){k++;
var h=d[m],o,l,n,w,q,p,t,r,s,v,u;
h||(h=d[m]=qx.core.property.Core.ID,qx.core.property.Core.ID+=5);
o=x.prototype;
if(g.init!==a){l=f+m;
o[l]=g.init}n=i.$$firstUp[m]||i.firstUp(m),w=g.nullable,q=g.event,p=g.apply,t=g.validate,r=g.inheritable,s=function(d){return function(i){var f=this,k,n,s,o;
qx.core.property.Debug.checkSetter(f,g,arguments);
t&&j.check(i,t,f,qx.core.ValidationError);
k=f[b];
if(!k)k=f[b]={};
else{n=k[h];
if(n!==a){s=c[n].get;
if(s)o=f[s](m);
else o=k[h+n]}}k[h+d]=i;
(n===a||n<=d)&&(n!==d&&(k[h]=d),o===a&&l&&(o=f[l]),i!==o&&(p&&f[p](i,o,g.name),q&&f.fireDataEvent(q,i,o),r&&e(f,i,o,g)));
return i}},v=function(d){return function(t){var f=this,k,s,o,i,n,j;
qx.core.property.Debug.checkResetter(f,g,arguments);
k=f[b],s=k[h];
if(s===d){o=k[h+s],j=d-1;
for(;
j>0;
j--){n=c[j].get;
i=n?f[n]?f[n](m):a:k[h+j];
if(i!==a)break}i===a&&(j=a,l?i=f[l]:w||f.error("Missing value for: "+m+" (during reset())"));
k[h]=j}k[h+d]=a;
s===d&&o!==i&&(p&&f[p](i,o,g.name),q&&f.fireDataEvent(q,i,o),r&&e(f,i,o,g))}},u=function(){var d=this,i,e,f,j;
qx.core.property.Debug.checkGetter(d,g,arguments);
i=d[b],e=i&&i[h];
if(e===a){if(l)return d[l];
if(w)return null;
d.error("Missing value for: "+m+" (during get()). Either define an init value, make the property nullable or define a fallback value.");
return}f=c[e].get;
if(f){j=d[f](m);
if(j===a)throw new Error("Ooops. Invalid value at getter: "+m+" in "+d+" via getter: "+f);
return j}return i[h+e]};
o["get"+n]=u;
l&&(o["init"+n]=function(){var c=this,d=c[b],f;
if(d){f=d[h];
if(f!==a)return}p&&c[p](c[l],a,g.name);
q&&c.fireDataEvent(q,c[l],a);
r&&e(c,c[l],a,g)});
o["set"+n]=s(3);
o["reset"+n]=v(3);
this.RUNTIME_OVERRIDE&&(o["setRuntime"+n]=s(4),o["resetRuntime"+n]=v(4));
g.check==="Boolean"&&(o["toggle"+n]=function(){this["set"+n](!this["get"+n]())},o["is"+n]=u)},
getSingleValue:function(f,c,e){var a=d[c]+g[e];
if(typeof a!="number"||isNaN(a))throw new Error("Invalid property or field: "+c+", "+e);
return f[b][a]},
importData:function(i,v,w,x){var p=i[b],r,k,o,j,l,n,t,u,s,q,m;
p||(p=i[b]={});
r=g[x];
for(k in v){o=d[k];
if(o===undefined)throw new Error(i+": Invalid property to import: "+k);
n=p[o];
if(n>r)continue;
j=v[k];
if(n===a&&j===a)continue;
if(n!=null){if(w&&n==r)l=w[k];
else{u=c[n].get;
l=u?i[u]?i[u](k):a:p[o+n]}}else l=a;
if(l===j)continue;
if(j===a){q=r-1;
for(;
q>0;
q--){s=c[q].get;
j=s?i[s]?i[s](k):a:p[o+q];
if(j!==a)break}if(j===a){q=a;
t=f+k;
if(t)j=i[t];
else{m=h.getPropertyDefinition(i.constructor,k);
m.nullable||i.error("Missing value for: "+k+" (during reset() - from theme system)")}}p[o]=q}else n!=r&&(p[o]=r);
if(j!==l){m=h.getPropertyDefinition(i.constructor,k);
m.apply&&i[m.apply](j,l,m.name);
m.event&&i.fireDataEvent(m.event,j,l);
m.inheritable&&e(i,j,l,m)}}},
getInheritableProperties:function(d){var e=d.$$inheritables={},b=d.$$properties,a,c,f;
if(b)for(a in b)b[a].inheritable&&(e[a]=b[a]);
c=d.superclass;
if(c&&c!==Object){f=c.$$inheritables||this.getInheritableProperties(c);
for(a in f)e[a]=f[a]}return e},
moveObject:function(i,j,x){if(j==x)return;
var t,u,v,l,m,o,p,k,w,n,h,r,s,q;
t=g.inherited;
k=i[b];
k||(k=i[b]={});
r=j?j[b]:a;
u=i.constructor;
v=u.$$inheritables||this.getInheritableProperties(u);
for(l in v){m=d[l];
p=f+l;
w=k?k[m]:a;
if(w===a)n=i[p];
else if(w==t)n=x.get(l);
else continue;
h=a;
j&&(s=r?r[m]:a,s===a?h=j[p]:(q=c[s].get,h=q?j[q]?j[q](l):a:r[m+s],h===a&&(h=j[p])));
h===a?(h=i[p],k[m]!==a&&(k[m]=a)):k[m]=t;
h!==n&&(o=v[l],o.apply&&i[o.apply](h,n,l),o.event&&i.fireDataEvent(o.event,h,n),e(i,h,n,o))}}}})})();


// qx.core.property.Simple
//   - size: 1336 bytes
//   - modified: 2010-11-02T15:58:41
//   - names:
//       qx, 9x
//   - packages:
//       qx.Bootstrap, 1x
//       qx.Bootstrap.define, 1x
//       qx.core.Type.check, 1x
//       qx.core.ValidationError, 1x
//       qx.core.property.Core.ID, 2x
//       qx.core.property.Debug.checkGetter, 1x
//       qx.core.property.Debug.checkResetter, 1x
//       qx.core.property.Debug.checkSetter, 1x
qx.Bootstrap.define("qx.core.property.Simple",{statics:{__uSSUl:0,
__brLhnR:{},
add:function(q,c,b){var g,o=this,k="fireDataEvent",j="$$data",l,e,f,a,n,d,p,i,h,m;
o.__uSSUl++;
l=o.__brLhnR;
e=l[c];
e||(e=l[c]=qx.core.property.Core.ID,qx.core.property.Core.ID++);
f=q.prototype;
b.init!==g&&(a="$$init-"+c,f[a]=b.init);
n=qx.Bootstrap,d=(n.$$firstUp[c]||n.firstUp(c)),p=b.nullable,i=b.event,h=b.apply,m=b.validate;
f["get"+d]=function(){var d,h,f;
d=this;
qx.core.property.Debug.checkGetter(d,b,arguments);
h=d[j];
h&&(f=h[e]);
if(f===g){if(a)return d[a];
p||d.error("Missing value for: "+c+" (during get())");
f=null}return f};
a&&(f["init"+d]=function(){var b=this,d=b[j];
(!d||d[e]===g)&&(h&&b[h](b[a],g,c),i&&b[k](i,b[a],g))});
f["set"+d]=function(f){var d,n,l;
d=this;
qx.core.property.Debug.checkSetter(d,b,arguments);
m&&qx.core.Type.check(f,m,d,qx.core.ValidationError);
n=d[j];
n?l=n[e]:n=d[j]={};
f!==l&&(l===g&&a&&(l=d[a]),n[e]=f,h&&d[h](f,l,c),i&&d[k](i,f,l));
return f};
f["reset"+d]=function(){var d,m,l,f;
d=this;
qx.core.property.Debug.checkResetter(d,b,arguments);
m=d[j];
if(!m)return;
l=m[e];
f=g;
l!==f&&(m[e]=f,a?f=d[a]:p||d.error("Missing value for: "+c+" (during reset())"),h&&d[h](f,l,c),i&&d[k](i,f,l))};
b.check==="Boolean"&&(f["toggle"+d]=function(){this["set"+d](!this["get"+d]())},f["is"+d]=f["get"+d])}}});


// qx.Class
//   - size: 10611 bytes
//   - modified: 2010-11-02T15:56:19
//   - names:
//       Array, 5x
//       Error, 24x
//       Function, 1x
//       qx, 44x
//       undefined, 6x
//       window, 1x
//   - packages:
//       qx.Bootstrap.$$registry, 1x
//       qx.Bootstrap.classIsDefined, 1x
//       qx.Bootstrap.createNamespace, 2x
//       qx.Bootstrap.define, 1x
//       qx.Bootstrap.extendClass, 1x
//       qx.Bootstrap.getByInterface, 1x
//       qx.Bootstrap.getByName, 1x
//       qx.Bootstrap.getEventType, 1x
//       qx.Bootstrap.getKeys, 4x
//       qx.Bootstrap.getMixins, 1x
//       qx.Bootstrap.hasInterface, 1x
//       qx.Bootstrap.isFunction, 1x
//       qx.Bootstrap.isObject, 1x
//       qx.Bootstrap.objectGetLength, 2x
//       qx.Bootstrap.setDisplayName, 2x
//       qx.Bootstrap.setDisplayNames, 3x
//       qx.Bootstrap.supportsEvent, 1x
//       qx.Class.__addMixin, 2x
//       qx.Class.__addProperties, 1x
//       qx.Interface.assert, 3x
//       qx.Interface.assertObject, 1x
//       qx.Interface.flatten, 1x
//       qx.Mixin.checkCompatibility, 1x
//       qx.Mixin.flatten, 2x
//       qx.Mixin.isCompatible, 2x
//       qx.core.property.Core.RUNTIME_OVERRIDE, 1x
//       qx.core.property.Debug, 1x
//       qx.core.property.Debug.validateConfig, 1x
//       qx.core.property.Group, 1x
//       qx.core.property.Multi, 1x
//       qx.core.property.Simple, 1x
qx.Bootstrap.define("qx.Class",{statics:{define:function(f,a){if(!a)var a={},g,b,c,e;
a.include&&!(a.include instanceof Array)&&(a.include=[a.include]);
a.implement&&!(a.implement instanceof Array)&&(a.implement=[a.implement]);
g=false;
!a.hasOwnProperty("extend")&&!a.type&&(a.type="static",g=true);
try{this.__9AoUd(f,a)}catch(d){g&&(d.message="Assumed static class because no \"extend\" key was found. "+d.message);
throw d}b=this.__OCPGL(f,a.type,a.extend,a.statics,a.construct,a.destruct,a.include);
if(a.extend){a.properties&&this.__1PJoD(b,a.properties,true);
a.members&&this.__HQEVz(b,a.members,true,true,false);
a.events&&this.__CPEAH(b,a.events,true);
if(a.include)for(c=0,e=a.include.length;
c<e;
c++)this.__x0tlN(b,a.include[c],false)}if(a.implement)for(c=0,e=a.implement.length;
c<e;
c++)this.__T8Du9(b,a.implement[c]);
this.__c8iCoT(b);
a.defer&&(a.defer.self=b,a.defer(b,b.prototype,{add:function(c,d){var a={};
a[c]=d;
qx.Class.__1PJoD(b,a,true)}}));
return b},
undefine:function(d){delete this.$$registry[d];
for(var c=d.split("."),b=[window],a=0,e,f;
a<c.length;
a++)b.push(b[a][c[a]]);
for(a=b.length-1;
a>=1;
a--){e=b[a],f=b[a-1];
if(qx.Bootstrap.isFunction(e)||qx.Bootstrap.objectGetLength(e)===0)delete f[c[a-1]];
else break}},
isDefined:qx.Bootstrap.classIsDefined,
getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry)},
getByName:qx.Bootstrap.getByName,
include:function(a,b){{if(!b)throw new Error("The mixin to include into class '"+a.classname+"' is undefined/null!");
qx.Mixin.isCompatible(b,a)}qx.Class.__x0tlN(a,b,false)},
patch:function(a,b){{if(!b)throw new Error("The mixin to patch class '"+a.classname+"' is undefined/null!");
qx.Mixin.isCompatible(b,a)}qx.Class.__x0tlN(a,b,true)},
isSubClassOf:function(a,b){if(!a)return false;
if(a==b)return true;
if(a.prototype instanceof b)return true;
return false},
getEventType:qx.Bootstrap.getEventType,
supportsEvent:qx.Bootstrap.supportsEvent,
hasOwnMixin:function(a,b){return a.$$includes&&a.$$includes.indexOf(b)!==-1},
getByMixin:function(a,e){var c,b,d;
while(a){if(a.$$includes){c=a.$$flatIncludes;
for(b=0,d=c.length;
b<d;
b++)if(c[b]===e)return a}a=a.superclass}return null},
getMixins:qx.Bootstrap.getMixins,
hasMixin:function(a,b){return!!this.getByMixin(a,b)},
hasOwnInterface:function(a,b){return a.$$implements&&a.$$implements.indexOf(b)!==-1},
getByInterface:qx.Bootstrap.getByInterface,
getInterfaces:function(a){var b=[];
while(a)a.$$implements&&b.push.apply(b,a.$$flatImplements),a=a.superclass;
return b},
hasInterface:qx.Bootstrap.hasInterface,
implementsInterface:function(c,a){var b=c.constructor;
if(this.hasInterface(b,a))return true;
try{qx.Interface.assertObject(c,a);
return true}catch(d){}try{qx.Interface.assert(b,a,false);
return true}catch(d){}return false},
getInstance:function(){this.$$instance||(this.$$allowconstruct=true,this.$$instance=new this,delete this.$$allowconstruct);
return this.$$instance},
genericToString:function(){return"[Class "+this.classname+"]"},
$$registry:qx.Bootstrap.$$registry,
__PnQ3H:{type:"string",
extend:"function",
implement:"object",
include:"object",
construct:"function",
statics:"object",
properties:"object",
members:"object",
events:"object",
defer:"function",
destruct:"function"},
__byMQSR:{type:"string",
statics:"object",
defer:"function"},
__9AoUd:function(d,a){if(a.type&&!(a.type==="static"||a.type==="abstract"||a.type==="singleton"))throw new Error("Invalid type \""+a.type+"\" definition for class \""+d+"\"!");
if(a.type&&a.type!=="static"&&!a.extend)throw new Error("Invalid config in class \""+d+"\"! Every non-static class has to extend at least the \"qx.core.Object\" class.");
var f=a.type==="static"?this.__byMQSR:this.__PnQ3H,c,h,b,g,e;
for(c in a){if(!f[c])throw new Error("The configuration key \""+c+"\" in class \""+d+"\" is not allowed!");
if(a[c]==null)throw new Error("Invalid key \""+c+"\" in class \""+d+"\"! The value is undefined/null!");
if(typeof a[c]!==f[c])throw new Error("Invalid type of key \""+c+"\" in class \""+d+"\"! The type of the key must be \""+f[c]+"\"!")}h=["statics","properties","members","events"],b=0,g=h.length;
for(;
b<g;
b++){c=h[b];
if(a[c]!==undefined&&(a[c].$$hash!==undefined||!qx.Bootstrap.isObject(a[c])))throw new Error("Invalid key \""+c+"\" in class \""+d+"\"! The value needs to be a map!")}if(a.include){if(a.include instanceof Array){for(b=0,e=a.include,g=e.length;
b<g;
b++)if(e[b]==null||e[b].$$type!=="Mixin")throw new Error("The include definition in class \""+d+"\" contains an invalid mixin at position "+b+": "+e[b])}else throw new Error("Invalid include definition in class \""+d+"\"! Only mixins and arrays of mixins are allowed!")}if(a.implement){if(a.implement instanceof Array){for(b=0,e=a.implement,g=e.length;
b<g;
b++)if(e[b]==null||e[b].$$type!=="Interface")throw new Error("The implement definition in class \""+d+"\" contains an invalid interface at position "+b+": "+e[b])}else throw new Error("Invalid implement definition in class \""+d+"\"! Only interfaces and arrays of interfaces are allowed!")}if(a.include)try{qx.Mixin.checkCompatibility(a.include)}catch(i){throw new Error("Error in include definition of class \""+d+"\"! "+i.message)}},
__c8iCoT:function(d){var a=d.superclass,b,c;
while(a){if(a.$$classtype!=="abstract")break;
b=a.$$implements;
if(b)for(c=0;
c<b.length;
c++)qx.Interface.assert(d,b[c],true);
a=a.superclass}},
__OCPGL:function(b,f,d,e,c,h,m){var a,g,i,k,l,n,j;
if(!d)a=e||{},qx.Bootstrap.setDisplayNames(a,b);
else{a={};
d&&(c||(c=this.__cIHX98()),a=this.__cAma3d(d,m)?this.__bjnhTv(c,b,f):c,f==="singleton"&&(a.getInstance=this.getInstance),qx.Bootstrap.setDisplayName(c,b,"constructor"));
if(e){qx.Bootstrap.setDisplayNames(e,b);
i=0,k=qx.Bootstrap.getKeys(e),l=k.length;
for(;
i<l;
i++){g=k[i];
n=e[g];
a[g]=n}}}j=qx.Bootstrap.createNamespace(b,a);
a.name=a.classname=b;
a.basename=j;
a.$$type="Class";
f&&(a.$$classtype=f);
a.hasOwnProperty("toString")||(a.toString=this.genericToString);
d&&(qx.Bootstrap.extendClass(a,c,d,b,j),h&&(a.$$destructor=h,qx.Bootstrap.setDisplayName(h,b,"destruct")));
this.$$registry[b]=a;
return a},
__CPEAH:function(c,b,d){{if(typeof b!=="object"||b instanceof Array)throw new Error(c.classname+": the events must be defined as map!");
for(var a in b)if(typeof b[a]!=="string")throw new Error(c.classname+"/"+a+": the event value needs to be a string with the class name of the event object which will be fired.");
if(c.$$events&&d!==true)for(var a in b)if(c.$$events[a]!==undefined&&c.$$events[a]!==b[a])throw new Error(c.classname+"/"+a+": the event value/type cannot be changed from "+c.$$events[a]+" to "+b[a])}if(c.$$events)for(var a in b)c.$$events[a]=b[a];
else c.$$events=b},
__1PJoD:function(b,f,d){var a,i,g,h,e,c;
d===undefined&&(d=false);
i=qx.core.property.Simple,g=qx.core.property.Multi,h=qx.core.property.Group;
for(c in f)a=f[c],qx.core.property.Debug.validateConfig(b,c,a,d),a.name=c,a.refine||(b.$$properties===undefined&&(b.$$properties={}),b.$$properties[c]=a),a.event&&(e={},e[a.event]="qx.event.type.Data",this.__CPEAH(b,e,d)),a.refine?b.prototype["$$init-"+c]=a.init:a.group?h.add(b,c,a):a.themeable||a.inheritable||qx.core.property.Core.RUNTIME_OVERRIDE?g.add(b,c,a):i.add(b,c,a)},
__HQEVz:function(d,e,h,j,i){var c=d.prototype,a,b,f,g,k;
qx.Bootstrap.setDisplayNames(e,d.classname+".prototype");
for(f=0,g=qx.Bootstrap.getKeys(e),k=g.length;
f<k;
f++){a=g[f];
b=e[a];
{if(c[a]!==undefined&&a.charAt(0)=="_"&&a.charAt(1)=="_")throw new Error("Overwriting private member \""+a+"\" of Class \""+d.classname+"\" is not allowed!");
if(h!==true&&c.hasOwnProperty(a))throw new Error("Overwriting member \""+a+"\" of Class \""+d.classname+"\" is not allowed!")}j!==false&&b instanceof Function&&b.$$type==null&&(i==true?b=this.__bHXe0n(b,c[a]):(c[a]&&(b.base=c[a]),b.self=d));
c[a]=b}},
__bHXe0n:function(a,b){return b?function(){var c=a.base,d;
a.base=b;
d=a.apply(this,arguments);
a.base=c;
return d}:a},
__T8Du9:function(a,b){{if(!a||!b)throw new Error("Incomplete parameters!");
if(this.hasOwnInterface(a,b))throw new Error("Interface \""+b.name+"\" is already used by Class \""+a.classname+"!");
a.$$classtype!=="abstract"&&qx.Interface.assert(a,b,true)}var c=qx.Interface.flatten([b]);
a.$$implements?(a.$$implements.push(b),a.$$flatImplements.push.apply(a.$$flatImplements,c)):(a.$$implements=[b],a.$$flatImplements=c)},
__cCFIAn:function(a){for(var h=a.classname,c=this.__bjnhTv(a,h,a.$$classtype),e=0,f=qx.Bootstrap.getKeys(a),j=f.length,i,g,d,b;
e<j;
e++)d=f[e],c[d]=a[d];
c.prototype=a.prototype;
i=a.prototype,e=0,f=qx.Bootstrap.getKeys(i),j=f.length;
for(;
e<j;
e++){d=f[e];
g=i[d];
g&&g.self==a&&(g.self=c)}for(d in this.$$registry){b=this.$$registry[d];
if(!b)continue;
b.base==a&&(b.base=c);
b.superclass==a&&(b.superclass=c);
b.$$original&&(b.$$original.base==a&&(b.$$original.base=c),b.$$original.superclass==a&&(b.$$original.superclass=c))}qx.Bootstrap.createNamespace(h,c);
this.$$registry[h]=c;
return c},
__x0tlN:function(a,c,d){if(!a||!c)throw new Error("Incomplete parameters!");
if(this.hasMixin(a,c))return;
var h=a.$$original,e,b,f,g;
c.$$constructor&&!h&&(a=this.__cCFIAn(a));
e=qx.Mixin.flatten([c]),f=0,g=e.length;
for(;
f<g;
f++)b=e[f],b.$$events&&this.__CPEAH(a,b.$$events,d),b.$$properties&&this.__1PJoD(a,b.$$properties,d),b.$$members&&this.__HQEVz(a,b.$$members,d,d,d);
a.$$includes?(a.$$includes.push(c),a.$$flatIncludes.push.apply(a.$$flatIncludes,e)):(a.$$includes=[c],a.$$flatIncludes=e)},
__cIHX98:function(){function a(){a.base.apply(this,arguments)}return a},
__bQQz5M:function(){return function(){}},
__cAma3d:function(b,e){return true;
if(b&&b.$$includes){for(var f=b.$$flatIncludes,a=0,d=f.length,c;
a<d;
a++)if(f[a].$$constructor)return true}if(e){c=qx.Mixin.flatten(e),a=0,d=c.length;
for(;
a<d;
a++)if(c[a].$$constructor)return true}return false},
__bjnhTv:function(c,a,d){var b=function(){var c=b,h,f,e,g;
{if(!(this instanceof c))throw new Error("Please initialize '"+a+"' objects using the new keyword!");
if(d==="abstract"){if(this.classname===a)throw new Error("The class ',"+a+"' is abstract! It is not possible to instantiate it.")}else if(d==="singleton")if(!c.$$allowconstruct)throw new Error("The class '"+a+"' is a singleton! It is not possible to instantiate it directly. Use the static getInstance() method instead.")}h=c.$$original.apply(this,arguments);
if(c.$$includes){f=c.$$flatIncludes,e=0,g=f.length;
for(;
e<g;
e++)f[e].$$constructor&&f[e].$$constructor.apply(this,arguments)}this.classname===a&&(this.$$initialized=true);
return h};
b.$$original=c;
c.wrapper=b;
return b}}});
qx.core.property.Debug;


// qx.type.BaseError
//   - size: 344 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 2x
//       qx, 2x
//   - packages:
//       Error.call, 1x
//       qx.Class.define, 1x
//       qx.type.BaseError.DEFAULTMESSAGE, 1x
qx.Class.define("qx.type.BaseError",{extend:Error,
construct:function(b,a){Error.call(this,a);
this.__uzUwU=b||"";
this.message=a||qx.type.BaseError.DEFAULTMESSAGE},
statics:{DEFAULTMESSAGE:"error"},
members:{__uzUwU:null,
message:null,
getComment:function(){return this.__uzUwU},
toString:function(){return this.__uzUwU+": "+this.message}}});


// qx.core.ValidationError
//   - size: 71 bytes
//   - modified: 2010-11-01T15:46:16
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.type.BaseError, 1x
qx.Class.define("qx.core.ValidationError",{extend:qx.type.BaseError});


// qx.core.WindowError
//   - size: 356 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 2x
//       qx, 1x
//       undefined, 1x
//   - packages:
//       Error.call, 1x
//       qx.Bootstrap.define, 1x
qx.Bootstrap.define("qx.core.WindowError",{extend:Error,
construct:function(b,c,a){Error.call(this,b);
this.__OnqWO=b;
this.__g0JOt=c||"";
this.__JeJe8=a===undefined?-1:a},
members:{__OnqWO:null,
__g0JOt:null,
__JeJe8:null,
toString:function(){return this.__OnqWO},
getUri:function(){return this.__g0JOt},
getLineNumber:function(){return this.__JeJe8}}});


// qx.bom.client.Engine
//   - size: 1592 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Object, 1x
//       RegExp, 9x
//       document, 2x
//       parseFloat, 1x
//       qx, 2x
//       window, 8x
//   - packages:
//       Object.prototype.toString.call, 1x
//       RegExp.$1, 5x
//       RegExp.$2, 1x
//       RegExp.$3, 2x
//       document.documentMode, 2x
//       qx.Bootstrap.define, 1x
//       qx.Bootstrap.warn, 1x
//       window.controllers, 1x
//       window.navigator.cpuClass, 1x
//       window.navigator.product, 1x
//       window.navigator.userAgent, 1x
//       window.navigator.userAgent.indexOf, 1x
//       window.opera, 2x
//       window.qxFail, 1x
qx.Bootstrap.define("qx.bom.client.Engine",{statics:{NAME:"",
FULLVERSION:"0.0.0",
VERSION:0,
OPERA:false,
WEBKIT:false,
GECKO:false,
MSHTML:false,
UNKNOWN_ENGINE:false,
UNKNOWN_VERSION:false,
DOCUMENT_MODE:null,
__jA3lT:function(){var b="unknown",a="0.0.0",c=window.navigator.userAgent,f=false,d=false,g,e;
if(window.opera&&Object.prototype.toString.call(window.opera)=="[object Opera]")b="opera",this.OPERA=true,/Opera[\s\/]([0-9]+)\.([0-9])([0-9]*)/.test(c)?(a=RegExp.$1+"."+RegExp.$2,RegExp.$3!=""&&(a+="."+RegExp.$3)):(d=true,a="9.6.0");
else if(window.navigator.userAgent.indexOf("AppleWebKit/")!=-1){b="webkit";
this.WEBKIT=true;
if(/AppleWebKit\/([^ ]+)/.test(c)){a=RegExp.$1;
g=RegExp("[^\\.0-9]").exec(a);
g&&(a=a.slice(0,g.index))}else d=true,a="525.26"}else if(window.controllers&&window.navigator.product==="Gecko")b="gecko",this.GECKO=true,/rv\:([^\);]+)(\)|;)/.test(c)?a=RegExp.$1:(d=true,a="1.9.0.0");
else if(window.navigator.cpuClass&&/MSIE\s+([^\);]+)(\)|;)/.test(c))b="mshtml",a=RegExp.$1,document.documentMode&&(this.DOCUMENT_MODE=document.documentMode),a<8&&/Trident\/([^\);]+)(\)|;)/.test(c)&&RegExp.$1==="4.0"&&(a="8.0"),this.MSHTML=true;
else{e=window.qxFail;
if(e&&typeof e==="function"){b=e();
b.NAME&&b.FULLVERSION&&(b=b.NAME,this[b.toUpperCase()]=true,a=b.FULLVERSION)}else f=true,d=true,a="1.9.0.0",b="gecko",this.GECKO=true,qx.Bootstrap.warn("Unsupported client: "+c+"! Assumed gecko version 1.9.0.0 (Firefox 3.0).")}this.UNKNOWN_ENGINE=f;
this.UNKNOWN_VERSION=d;
this.NAME=b;
this.FULLVERSION=a;
this.VERSION=parseFloat(a)}},
defer:function(a){a.__jA3lT()}});


// qx.Theme
//   - size: 4076 bytes
//   - modified: 2010-11-02T18:10:07
//   - names:
//       Array, 1x
//       Date, 1x
//       Error, 15x
//       RegExp, 1x
//       qx, 4x
//       undefined, 6x
//   - packages:
//       qx.Bootstrap.createNamespace, 1x
//       qx.Bootstrap.define, 1x
//       qx.Bootstrap.isArray, 1x
//       qx.Bootstrap.objectGetLength, 1x
qx.Bootstrap.define("qx.Theme",{statics:{define:function(d,a){if(!a)var a={},b,c,e,f;
a.include=this.__ba6rD1(a.include);
a.patch=this.__ba6rD1(a.patch);
this.__9AoUd(d,a);
b={$$type:"Theme",
name:d,
title:a.title,
toString:this.genericToString};
a.extend&&(b.supertheme=a.extend);
b.basename=qx.Bootstrap.createNamespace(d,b);
this.__uNnVI(b,a);
this.$$registry[d]=b;
for(c=0,e=a.include,f=e.length;
c<f;
c++)this.include(b,e[c]);
for(c=0,e=a.patch,f=e.length;
c<f;
c++)this.patch(b,e[c])},
__ba6rD1:function(a){if(!a)return[];
return qx.Bootstrap.isArray(a)?a:[a]},
getAll:function(){return this.$$registry},
getByName:function(a){return this.$$registry[a]},
isDefined:function(a){return this.getByName(a)!==undefined},
getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry)},
genericToString:function(){return"[Theme "+this.name+"]"},
__QriHM:function(d){for(var a=0,b=this.__bh2e6M,c=b.length;
a<c;
a++)if(d[b[a]])return b[a]},
__uNnVI:function(f,a){var c=this.__QriHM(a),d,e,g,b;
a.extend&&!c&&(c=a.extend.type);
f.type=c||"other";
if(!c)return;
d=function(){};
a.extend&&(d.prototype=new a.extend.$$clazz);
e=d.prototype,g=a[c];
for(b in g){e[b]=g[b];
if(e[b].base){if(!a.extend)throw new Error("Found base flag in entry '"+b+"' of theme '"+a.name+"'. Base flags are not allowed for themes without a valid super theme!");
e[b].base=a.extend}}f.$$clazz=d;
f[c]=new d},
$$registry:{},
__bh2e6M:["colors","decorations","fonts","appearances","meta"],
__PnQ3H:{title:"string",
type:"string",
extend:"object",
colors:"object",
decorations:"object",
fonts:"object",
appearances:"object",
meta:"object",
include:"object",
patch:"object"},
__yIb8g:{color:"object",
decoration:"object",
font:"object",
appearance:"object"},
__9AoUd:function(d,a){var f=this.__PnQ3H,b,g,c,h,i,e;
for(b in a){if(f[b]===undefined)throw new Error("The configuration key \""+b+"\" in theme \""+d+"\" is not allowed!");
if(a[b]==null)throw new Error("Invalid key \""+b+"\" in theme \""+d+"\"! The value is undefined/null!");
if(f[b]!==null&&typeof a[b]!==f[b])throw new Error("Invalid type of key \""+b+"\" in theme \""+d+"\"! The type of the key must be \""+f[b]+"\"!")}g=["colors","decorations","fonts","appearances","meta"],c=0,h=g.length;
for(;
c<h;
c++){b=g[c];
if(a[b]!==undefined&&(a[b] instanceof Array||a[b] instanceof RegExp||a[b] instanceof Date||a[b].classname!==undefined))throw new Error("Invalid key \""+b+"\" in theme \""+d+"\"! The value needs to be a map!")}i=0,c=0,h=g.length;
for(;
c<h;
c++){b=g[c];
a[b]&&i++;
if(i>1)throw new Error("You can only define one theme category per file! Invalid theme: "+d)}if(!a.extend&&i===0)throw new Error("You must define at least one entry in your theme configuration :"+d);
if(a.meta){for(b in a.meta){e=a.meta[b];
if(this.__yIb8g[b]===undefined)throw new Error("The key \""+b+"\" is not allowed inside a meta theme block.");
if(typeof e!==this.__yIb8g[b])throw new Error("The type of the key \""+b+"\" inside the meta block is wrong.");
if(!(typeof e==="object"&&e!==null&&e.$$type==="Theme"))throw new Error("The content of a meta theme must reference to other themes. The value for \""+b+"\" in theme \""+d+"\" is invalid: "+e)}}if(a.extend&&a.extend.$$type!=="Theme")throw new Error("Invalid extend in theme \""+d+"\": "+a.extend);
if(a.include)for(c=0,h=a.include.length;
c<h;
c++)if(typeof a.include[c]=="undefined"||a.include[c].$$type!=="Theme")throw new Error("Invalid include in theme \""+d+"\": "+a.include[c]);
if(a.patch)for(c=0,h=a.patch.length;
c<h;
c++)if(typeof a.patch[c]=="undefined"||a.patch[c].$$type!=="Theme")throw new Error("Invalid patch in theme \""+d+"\": "+a.patch[c])},
patch:function(b,c){var d=this.__QriHM(c),e,f,a;
if(d!==this.__QriHM(b))throw new Error("The mixins '"+b.name+"' are not compatible '"+c.name+"'!");
e=c[d],f=b.$$clazz.prototype;
for(a in e)f[a]=e[a]},
include:function(b,c){var d=c.type,f,e,a;
if(d!==b.type)throw new Error("The mixins '"+b.name+"' are not compatible '"+c.name+"'!");
f=c[d],e=b.$$clazz.prototype;
for(a in f){if(e[a]!==undefined)continue;
e[a]=f[a]}}}});


// qx.ui.form.MModelProperty
//   - size: 104 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 1x
//   - packages:
//       qx.Mixin.define, 1x
qx.Mixin.define("qx.ui.form.MModelProperty",{properties:{model:{nullable:true,
event:"changeModel"}}});


// qx.theme.Color
//   - size: 1623 bytes
//   - modified: 2010-11-02T19:07:57
//   - names:
//       qx, 1x
//   - packages:
//       qx.Theme.define, 1x
qx.Theme.define("qx.theme.Color",{colors:{"background-application":"#DFDFDF",
"background-pane":"#F3F3F3",
"background-light":"#FCFCFC",
"background-medium":"#EEEEEE",
"background-splitpane":"#AFAFAF",
"background-tip":"#ffffdd",
"background-tip-error":"#C72B2B",
"background-odd":"#E4E4E4",
"text-light":"#909090",
"text-gray":"#4a4a4a",
"text-label":"#1a1a1a",
"text-title":"#314a6e",
"text-input":"#000000",
"text-hovered":"#001533",
"text-disabled":"#7B7A7E",
"text-selected":"#fffefe",
"text-active":"#26364D",
"text-inactive":"#404955",
"text-placeholder":"#CBC8CD",
"border-main":"#4d4d4d",
"border-separator":"#808080",
"border-input":"#334866",
"border-disabled":"#B6B6B6",
"border-pane":"#00204D",
"border-button":"#666666",
"border-column":"#CCCCCC",
"border-focused":"#99C3FE",
invalid:"#990000",
"border-focused-invalid":"#FF9999",
"table-pane":"#F3F3F3",
"table-focus-indicator":"#0880EF",
"table-row-background-focused-selected":"#084FAB",
"table-row-background-focused":"#80B4EF",
"table-row-background-selected":"#084FAB",
"table-row-background-even":"#F3F3F3",
"table-row-background-odd":"#E4E4E4",
"table-row-selected":"#fffefe",
"table-row":"#1a1a1a",
"table-row-line":"#CCCCCC",
"table-column-line":"#CCCCCC",
"progressive-table-header":"#AAAAAA",
"progressive-table-row-background-even":"#F4F4F4",
"progressive-table-row-background-odd":"#E4E4E4",
"progressive-progressbar-background":"gray",
"progressive-progressbar-indicator-done":"#CCCCCC",
"progressive-progressbar-indicator-undone":"white",
"progressive-progressbar-percent-background":"gray",
"progressive-progressbar-percent-text":"white"}});


// qx.ui.core.MRemoteLayoutHandling
//   - size: 206 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Mixin.define, 1x
qx.Mixin.define("qx.ui.core.MRemoteLayoutHandling",{members:{setLayout:function(a){return this.getChildrenContainer().setLayout(a)},
getLayout:function(){return this.getChildrenContainer().getLayout()}}});


// qx.ui.core.MBlocker
//   - size: 998 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       qx, 2x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.ui.core.Blocker, 1x
qx.Mixin.define("qx.ui.core.MBlocker",{construct:function(){this.__ukeJN=new qx.ui.core.Blocker(this)},
properties:{blockerColor:{check:"Color",
init:null,
nullable:true,
apply:"_applyBlockerColor",
themeable:true},
blockerOpacity:{check:"Number",
init:1,
apply:"_applyBlockerOpacity",
themeable:true}},
members:{__ukeJN:null,
_applyBlockerColor:function(a,b){this.__ukeJN.setColor(a)},
_applyBlockerOpacity:function(a,b){this.__ukeJN.setOpacity(a)},
block:function(){this.__ukeJN.block()},
isBlocked:function(){return this.__ukeJN.isBlocked()},
unblock:function(){this.__ukeJN.unblock()},
forceUnblock:function(){this.__ukeJN.forceUnblock()},
blockContent:function(a){this.__ukeJN.blockContent(a)},
isContentBlocked:function(){return this.__ukeJN.isContentBlocked()},
unblockContent:function(){this.__ukeJN.unblockContent()},
forceUnblockContent:function(){this.__ukeJN.forceUnblockContent()},
getBlocker:function(){return this.__ukeJN}},
destruct:function(){this._disposeObjects("__blocker")}});


// qx.ui.core.MRemoteChildrenHandling
//   - size: 725 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Mixin.define, 1x
qx.Mixin.define("qx.ui.core.MRemoteChildrenHandling",{members:{__uR3K4:function(a,e,c,d){var b=this.getChildrenContainer();
b===this&&(a="_"+a);
return(b[a])(e,c,d)},
getChildren:function(){return this.__uR3K4("getChildren")},
hasChildren:function(){return this.__uR3K4("hasChildren")},
add:function(a,b){return this.__uR3K4("add",a,b)},
remove:function(a){return this.__uR3K4("remove",a)},
removeAll:function(){return this.__uR3K4("removeAll")},
indexOf:function(a){return this.__uR3K4("indexOf",a)},
addAt:function(a,c,b){this.__uR3K4("addAt",a,c,b)},
addBefore:function(c,a,b){this.__uR3K4("addBefore",c,a,b)},
addAfter:function(a,c,b){this.__uR3K4("addAfter",a,c,b)},
removeAt:function(a){this.__uR3K4("removeAt",a)}}});


// qx.ui.core.MLayoutHandling
//   - size: 237 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Mixin.define, 1x
qx.Mixin.define("qx.ui.core.MLayoutHandling",{members:{setLayout:function(a){return this._setLayout(a)},
getLayout:function(){return this._getLayout()}},
statics:{remap:function(a){a.getLayout=a._getLayout;
a.setLayout=a._setLayout}}});


// qx.bom.client.Feature
//   - size: 1664 bytes
//   - modified: 2010-11-02T15:54:33
//   - names:
//       document, 13x
//       navigator, 1x
//       qx, 7x
//       window, 5x
//   - packages:
//       document.compatMode, 1x
//       document.createElement, 1x
//       document.createElementNS, 1x
//       document.documentElement.classList, 2x
//       document.documentElement.style, 3x
//       document.evaluate, 1x
//       document.implementation, 1x
//       document.implementation.hasFeature, 3x
//       navigator.userAgent.toLowerCase, 1x
//       qx.Bootstrap.define, 1x
//       qx.Bootstrap.getClass, 1x
//       qx.bom.client.Engine.DOCUMENT_MODE, 1x
//       qx.bom.client.Engine.MSHTML, 3x
//       qx.bom.client.Engine.VERSION, 1x
//       window.CanvasRenderingContext2D, 1x
//       window.google, 1x
//       window.google.gears, 1x
//       window.location.protocol, 1x
qx.Bootstrap.define("qx.bom.client.Feature",{statics:{STANDARD_MODE:false,
QUIRKS_MODE:false,
CONTENT_BOX:false,
BORDER_BOX:false,
SVG:false,
CANVAS:!!window.CanvasRenderingContext2D,
VML:false,
XPATH:!!document.evaluate,
AIR:navigator.userAgent.toLowerCase().indexOf("adobeair")!==-1,
GEARS:!!(window.google&&window.google.gears),
SSL:window.location.protocol==="https:",
ECMA_OBJECT_COUNT:({}.__count__==0),
CSS_POINTER_EVENTS:"pointerEvents"in document.documentElement.style,
XUL:false,
CSS_TEXT_OVERFLOW:("textOverflow"in document.documentElement.style||"OTextOverflow"in document.documentElement.style),
HTML5_CLASSLIST:(document.documentElement.classList&&qx.Bootstrap.getClass(document.documentElement.classList)==="DOMTokenList"),
TOUCH:("ontouchstart"in window),
PLACEHOLDER:false,
__jA3lT:function(){this.QUIRKS_MODE=this.__VT4YB();
this.STANDARD_MODE=!this.QUIRKS_MODE;
this.CONTENT_BOX=!qx.bom.client.Engine.MSHTML||this.STANDARD_MODE;
this.BORDER_BOX=!this.CONTENT_BOX;
this.SVG=document.implementation&&document.implementation.hasFeature&&(document.implementation.hasFeature("org.w3c.dom.svg","1.0")||document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"));
this.VML=qx.bom.client.Engine.MSHTML;
try{document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul","label");
this.XUL=true}catch(b){this.XUL=false}var a=document.createElement("input");
this.PLACEHOLDER="placeholder"in a},
__VT4YB:function(){return qx.bom.client.Engine.MSHTML&&qx.bom.client.Engine.VERSION>=8?qx.bom.client.Engine.DOCUMENT_MODE===5:document.compatMode!=="CSS1Compat"}},
defer:function(a){a.__jA3lT()}});


// qx.ui.core.MContentPadding
//   - size: 1074 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       qx, 1x
//   - packages:
//       qx.Mixin.define, 1x
qx.Mixin.define("qx.ui.core.MContentPadding",{properties:{contentPaddingTop:{check:"Integer",
init:0,
apply:"_applyContentPadding",
themeable:true},
contentPaddingRight:{check:"Integer",
init:0,
apply:"_applyContentPadding",
themeable:true},
contentPaddingBottom:{check:"Integer",
init:0,
apply:"_applyContentPadding",
themeable:true},
contentPaddingLeft:{check:"Integer",
init:0,
apply:"_applyContentPadding",
themeable:true},
contentPadding:{group:["contentPaddingTop","contentPaddingRight","contentPaddingBottom","contentPaddingLeft"],
shorthand:true,
themeable:true}},
members:{__b1yWhg:{contentPaddingTop:"setPaddingTop",
contentPaddingRight:"setPaddingRight",
contentPaddingBottom:"setPaddingBottom",
contentPaddingLeft:"setPaddingLeft"},
__cm5qGh:{contentPaddingTop:"resetPaddingTop",
contentPaddingRight:"resetPaddingRight",
contentPaddingBottom:"resetPaddingBottom",
contentPaddingLeft:"resetPaddingLeft"},
_applyContentPadding:function(b,f,c){var a=this._getContentPaddingTarget(),e,d;
if(b==null){e=this.__cm5qGh[c];
a[e]()}else{d=this.__b1yWhg[c];
a[d](b)}}}});


// qx.ui.core.MChildrenHandling
//   - size: 777 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Mixin.define, 1x
qx.Mixin.define("qx.ui.core.MChildrenHandling",{members:{getChildren:function(){return this._getChildren()},
hasChildren:function(){return this._hasChildren()},
indexOf:function(a){return this._indexOf(a)},
add:function(a,b){this._add(a,b)},
addAt:function(a,c,b){this._addAt(a,c,b)},
addBefore:function(c,a,b){this._addBefore(c,a,b)},
addAfter:function(a,c,b){this._addAfter(a,c,b)},
remove:function(a){this._remove(a)},
removeAt:function(a){return this._removeAt(a)},
removeAll:function(){this._removeAll()}},
statics:{remap:function(a){a.getChildren=a._getChildren;
a.hasChildren=a._hasChildren;
a.indexOf=a._indexOf;
a.add=a._add;
a.addAt=a._addAt;
a.addBefore=a._addBefore;
a.addAfter=a._addAfter;
a.remove=a._remove;
a.removeAt=a._removeAt;
a.removeAll=a._removeAll}}});


// qx.event.IEventHandler
//   - size: 239 bytes
//   - modified: 2010-09-23T21:51:03
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.event.IEventHandler",{statics:{TARGET_DOMNODE:1,
TARGET_WINDOW:2,
TARGET_OBJECT:4,
TARGET_DOCUMENT:8},
members:{canHandleEvent:function(a,b){},
registerEvent:function(a,b,c){},
unregisterEvent:function(a,b,c){}}});


// qx.data.IListData
//   - size: 271 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.data.IListData",{events:{change:"qx.event.type.Data",
changeLength:"qx.event.type.Event"},
members:{getItem:function(a){},
setItem:function(b,a){},
splice:function(c,b,a){},
contains:function(a){},
getLength:function(){},
toArray:function(){}}});


// qx.ui.decoration.IDecorator
//   - size: 159 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.decoration.IDecorator",{members:{getMarkup:function(){},
resize:function(b,c,a){},
tint:function(a,b){},
getInsets:function(){}}});


// qx.ui.form.IExecutable
//   - size: 196 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.form.IExecutable",{events:{execute:"qx.event.type.Data"},
members:{setCommand:function(a){return arguments.length==1},
getCommand:function(){},
execute:function(){}}});


// qx.ui.form.IStringForm
//   - size: 199 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.form.IStringForm",{events:{changeValue:"qx.event.type.Data"},
members:{setValue:function(a){return arguments.length==1},
resetValue:function(){},
getValue:function(){}}});


// qx.event.GlobalError
//   - size: 454 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//       window, 1x
//   - packages:
//       qx.Bootstrap.define, 1x
//       qx.core.Setting.define, 1x
//       qx.core.WindowError, 1x
qx.Bootstrap.define("qx.event.GlobalError",{statics:{setErrorHandler:function(b,a){this.__yn7yy=b||null;
this.__uOt7U=a||window},
__2AKLi:function(c,b,a){if(this.__yn7yy){this.handleError(new qx.core.WindowError(c,b,a));
return true}},
observeMethod:function(a){return a},
handleError:function(a){this.__yn7yy&&this.__yn7yy.call(this.__uOt7U,a)}},
defer:function(a){qx.core.Setting.define("qx.globalErrorHandling","on");
a.setErrorHandler(null,null)}});


// qx.ui.core.MExecutable
//   - size: 1105 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       qx, 2x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.core.property.Util.hasProperty, 1x
qx.Mixin.define("qx.ui.core.MExecutable",{events:{execute:"qx.event.type.Event"},
properties:{command:{check:"qx.ui.core.Command",
apply:"_applyCommand",
event:"changeCommand",
nullable:true}},
members:{__b0TXYK:null,
__EsQBb:false,
__bzr6dB:null,
_bindableProperties:["enabled","label","icon","toolTipText","value","menu"],
execute:function(){var a=this.getCommand();
a&&(this.__EsQBb?this.__EsQBb=false:(this.__EsQBb=true,a.execute(this)));
this.fireEvent("execute")},
__bote5O:function(a){if(this.__EsQBb){this.__EsQBb=false;
return}this.__EsQBb=true;
this.execute()},
_applyCommand:function(c,d){d!=null&&d.removeListenerById(this.__bzr6dB);
c!=null&&(this.__bzr6dB=c.addListener("execute",this.__bote5O,this));
var b=this.__b0TXYK,e,a,g,f;
b==null&&(this.__b0TXYK=b={});
for(e=0;
e<this._bindableProperties.length;
e++){a=this._bindableProperties[e];
d!=null&&b[a]!=null&&(d.removeBinding(b[a]),b[a]=null);
if(c!=null&&qx.core.property.Util.hasProperty(this.constructor,a)){g=c.get(a);
if(g==null)f=this.get(a);
b[a]=c.bind(a,this,a);
f&&this.set(a,f)}}}},
destruct:function(){this.__b0TXYK=null}});


// qx.ui.window.IWindowManager
//   - size: 334 bytes
//   - modified: 2010-10-13T22:40:51
//   - names:
//       qx, 4x
//   - packages:
//       qx.Interface.define, 1x
//       qx.ui.window.IDesktop, 1x
//       qx.ui.window.Window, 2x
qx.Interface.define("qx.ui.window.IWindowManager",{members:{setDesktop:function(a){this.assertInterface(a,qx.ui.window.IDesktop)},
changeActiveWindow:function(b,a){},
updateStack:function(){},
bringToFront:function(a){this.assertInstance(a,qx.ui.window.Window)},
sendToBack:function(a){this.assertInstance(a,qx.ui.window.Window)}}});


// qx.ui.window.IDesktop
//   - size: 305 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Interface.define, 1x
//       qx.ui.window.IWindowManager, 1x
qx.Interface.define("qx.ui.window.IDesktop",{members:{setWindowManager:function(a){this.assertInterface(a,qx.ui.window.IWindowManager)},
getWindows:function(){},
supportsMaximize:function(){},
blockContent:function(a){this.assertInteger(a)},
unblockContent:function(){},
isContentBlocked:function(){}}});


// qx.dom.Node
//   - size: 1348 bytes
//   - modified: 2010-05-16T19:23:13
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.dom.Node.getName, 1x
qx.Class.define("qx.dom.Node",{statics:{ELEMENT:1,
ATTRIBUTE:2,
TEXT:3,
CDATA_SECTION:4,
ENTITY_REFERENCE:5,
ENTITY:6,
PROCESSING_INSTRUCTION:7,
COMMENT:8,
DOCUMENT:9,
DOCUMENT_TYPE:10,
DOCUMENT_FRAGMENT:11,
NOTATION:12,
getDocument:function(a){return a.nodeType===this.DOCUMENT?a:a.ownerDocument||a.document},
getWindow:function(a){if(a.nodeType==null)return a;
a.nodeType!==this.DOCUMENT&&(a=a.ownerDocument);
return a.defaultView||a.parentWindow||null},
getDocumentElement:function(a){return this.getDocument(a).documentElement},
getBodyElement:function(a){return this.getDocument(a).body},
isNode:function(a){return!!(a&&a.nodeType!=null)},
isElement:function(a){return!!(a&&a.nodeType===this.ELEMENT)},
isDocument:function(a){return!!(a&&a.nodeType===this.DOCUMENT)},
isText:function(a){return!!(a&&a.nodeType===this.TEXT)},
isWindow:function(a){return!!(a&&a.history&&a.location&&a.document)},
isNodeName:function(a,b){if(!b||!a||!a.nodeName)return false;
return b.toLowerCase()==qx.dom.Node.getName(a)},
getName:function(a){return a&&a.nodeName&&a.nodeName.toLowerCase()||null},
getText:function(a){if(!a||!a.nodeType)return null;
switch(a.nodeType){case 1:var b,c=[],d=a.childNodes,e=d.length;
for(b=0;
b<e;
b++)c[b]=this.getText(d[b]);
return c.join("");
case 2:return a.nodeValue;
break;
case 3:return a.nodeValue;
break}return null}}});


// qx.bom.client.Platform
//   - size: 691 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       navigator, 2x
//       qx, 1x
//   - packages:
//       navigator.platform, 1x
//       navigator.userAgent, 1x
//       qx.Class.define, 1x
qx.Class.define("qx.bom.client.Platform",{statics:{NAME:"",
WIN:false,
MAC:false,
UNIX:false,
UNKNOWN_PLATFORM:false,
__jA3lT:function(){var a=navigator.platform;
(a==null||a==="")&&(a=navigator.userAgent);
a.indexOf("Windows")!=-1||a.indexOf("Win32")!=-1||a.indexOf("Win64")!=-1?(this.WIN=true,this.NAME="win"):a.indexOf("Macintosh")!=-1||a.indexOf("MacPPC")!=-1||a.indexOf("MacIntel")!=-1||a.indexOf("iPod")!=-1||a.indexOf("iPhone")!=-1||a.indexOf("iPad")!=-1?(this.MAC=true,this.NAME="mac"):a.indexOf("X11")!=-1||a.indexOf("Linux")!=-1||a.indexOf("BSD")!=-1?(this.UNIX=true,this.NAME="unix"):(this.UNKNOWN_PLATFORM=true,this.WIN=true,this.NAME="win")}},
defer:function(a){a.__jA3lT()}});


// qx.bom.element.Attribute
//   - size: 1945 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
qx.Class.define("qx.bom.element.Attribute",{statics:{__mQlbl:{names:{"class":"className",
"for":"htmlFor",
html:"innerHTML",
text:"textContent",
colspan:"colSpan",
rowspan:"rowSpan",
valign:"vAlign",
datetime:"dateTime",
accesskey:"accessKey",
tabindex:"tabIndex",
maxlength:"maxLength",
readonly:"readOnly",
longdesc:"longDesc",
cellpadding:"cellPadding",
cellspacing:"cellSpacing",
frameborder:"frameBorder",
usemap:"useMap"},
runtime:{html:1,
text:1},
bools:{compact:1,
nowrap:1,
ismap:1,
declare:1,
noshade:1,
checked:1,
disabled:1,
readOnly:1,
multiple:1,
selected:1,
noresize:1,
defer:1,
allowTransparency:1},
property:{$$html:1,
$$widget:1,
disabled:1,
checked:1,
readOnly:1,
multiple:1,
selected:1,
value:1,
maxLength:1,
className:1,
innerHTML:1,
innerText:1,
textContent:1,
htmlFor:1,
tabIndex:1},
qxProperties:{$$widget:1,
$$html:1},
propertyDefault:{disabled:false,
checked:false,
readOnly:false,
multiple:false,
selected:false,
value:"",
className:"",
innerHTML:"",
innerText:"",
textContent:"",
htmlFor:"",
tabIndex:0,
maxLength:-1},
removeableProperties:{disabled:1,
multiple:1,
maxLength:1},
original:{href:1,
src:1,
type:1}},
compile:function(c){var b=[],d=this.__mQlbl.runtime,a;
for(a in c)d[a]||b.push(a,"='",c[a],"'");
return b.join("")},
get:function(d,a){var c=this.__mQlbl,b;
a=c.names[a]||a;
if(c.property[a]){b=d[a];
if(typeof c.propertyDefault[a]!=="undefined"&&b==c.propertyDefault[a])return typeof c.bools[a]==="undefined"?null:b}else b=d.getAttribute(a);
if(c.bools[a])return!!b;
return b},
set:function(d,a,b){var c=this.__mQlbl;
a=c.names[a]||a;
c.bools[a]&&(b=!!b);
if(c.property[a]&&(!(d[a]===undefined)||c.qxProperties[a])){if(b==null){if(c.removeableProperties[a]){d.removeAttribute(a);
return}typeof c.propertyDefault[a]!=="undefined"&&(b=c.propertyDefault[a])}d[a]=b}else b===true?d.setAttribute(a,a):b===false||b===null?d.removeAttribute(a):d.setAttribute(a,b)},
reset:function(a,b){this.set(a,b,null)}}});


// qx.lang.Date
//   - size: 78 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Date, 1x
//       qx, 1x
//   - packages:
//       qx.Class.define, 1x
qx.Class.define("qx.lang.Date",{statics:{now:function(){return +new Date}}});


// qx.lang.RingBuffer
//   - size: 1181 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Array, 1x
//       Object, 1x
//       qx, 1x
//   - packages:
//       qx.Class.define, 1x
qx.Class.define("qx.lang.RingBuffer",{extend:Object,
construct:function(a){this.setMaxEntries(a||50)},
members:{__bHMv5N:0,
__3Ng1e:0,
__UksBG:false,
__cofKxn:0,
__uPjgP:null,
__Jk3m7:null,
setMaxEntries:function(a){this.__Jk3m7=a;
this.clear()},
getMaxEntries:function(){return this.__Jk3m7},
addEntry:function(b){this.__uPjgP[this.__bHMv5N]=b;
this.__bHMv5N=this.__HDJCN(this.__bHMv5N,1);
var a=this.getMaxEntries();
this.__3Ng1e<a&&this.__3Ng1e++;
this.__UksBG&&this.__cofKxn<a&&this.__cofKxn++},
mark:function(){this.__UksBG=true;
this.__cofKxn=0},
clearMark:function(){this.__UksBG=false},
getAllEntries:function(){return this.getEntries(this.getMaxEntries(),false)},
getEntries:function(a,e){a>this.__3Ng1e&&(a=this.__3Ng1e);
e&&this.__UksBG&&a>this.__cofKxn&&(a=this.__cofKxn);
if(a>0){var c=this.__HDJCN(this.__bHMv5N,-1),d=this.__HDJCN(c,-a+1),b;
b=d<=c?this.__uPjgP.slice(d,c+1):this.__uPjgP.slice(d,this.__3Ng1e).concat(this.__uPjgP.slice(0,c+1))}else b=[];
return b},
clear:function(){this.__uPjgP=new Array(this.getMaxEntries());
this.__3Ng1e=0;
this.__cofKxn=0;
this.__bHMv5N=0},
__HDJCN:function(c,d){var b=this.getMaxEntries(),a=(c+d)%b;
a<0&&(a+=b);
return a}}});


// qx.lang.Type
//   - size: 617 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Boolean, 1x
//       Date, 1x
//       Error, 1x
//       Number, 1x
//       qx, 6x
//   - packages:
//       qx.Bootstrap.getClass, 1x
//       qx.Bootstrap.isArray, 1x
//       qx.Bootstrap.isFunction, 1x
//       qx.Bootstrap.isObject, 1x
//       qx.Bootstrap.isString, 1x
//       qx.Class.define, 1x
qx.Class.define("qx.lang.Type",{statics:{getClass:qx.Bootstrap.getClass,
isString:qx.Bootstrap.isString,
isArray:qx.Bootstrap.isArray,
isObject:qx.Bootstrap.isObject,
isFunction:qx.Bootstrap.isFunction,
isRegExp:function(a){return this.getClass(a)=="RegExp"},
isNumber:function(a){return a!==null&&(this.getClass(a)=="Number"||a instanceof Number)},
isBoolean:function(a){return a!==null&&(this.getClass(a)=="Boolean"||a instanceof Boolean)},
isDate:function(a){return a!==null&&(this.getClass(a)=="Date"||a instanceof Date)},
isError:function(a){return a!==null&&(this.getClass(a)=="Error"||a instanceof Error)}}});


// qx.bom.Selector
//   - size: 13129 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Array, 3x
//       Date, 1x
//       Object, 1x
//       Range, 1x
//       RegExp, 2x
//       document, 15x
//       qx, 2x
//       undefined, 2x
//   - packages:
//       Array.prototype.push.apply, 1x
//       Array.prototype.slice.call, 2x
//       Object.prototype.toString, 1x
//       Range.START_TO_END, 1x
//       document.compareDocumentPosition, 1x
//       document.createComment, 1x
//       document.createElement, 4x
//       document.createRange, 1x
//       document.documentElement, 2x
//       document.documentElement.childNodes, 1x
//       document.documentElement.compareDocumentPosition, 1x
//       document.getElementById, 1x
//       document.querySelectorAll, 1x
//       qx.Class.define, 1x
//       qx.bom.Selector, 1x
qx.Class.define("qx.bom.Selector",{statics:{query:null,
matches:null}});
(function(){var g=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,h=0,j=Object.prototype.toString,c=false,k=true,b,a,o,p,d,f,e,l,n;
[0,0].sort(function(){k=false;
return 0});
b=function(m,d,i,s){i=i||[];
d=d||document;
var x=d,c,p,n,e,u,v,t,w,k,q,r,h;
if(d.nodeType!==1&&d.nodeType!==9)return[];
if(!m||typeof m!=="string")return i;
c=[],v=true,t=b.isXML(d),w=m;
do{g.exec("");
p=g.exec(w);
if(p){w=p[3];
c.push(p[1]);
if(p[2]){u=p[3];
break}}}while(p);
if(c.length>1&&o.exec(m)){if(c.length===2&&a.relative[c[0]])n=l(c[0]+c[1],d);
else{n=a.relative[c[0]]?[d]:b(c.shift(),d);
while(c.length)m=c.shift(),a.relative[m]&&(m+=c.shift()),n=l(m,n)}}else{!s&&c.length>1&&d.nodeType===9&&!t&&a.match.ID.test(c[0])&&!a.match.ID.test(c[c.length-1])&&(k=b.find(c.shift(),d,t),d=k.expr?b.filter(k.expr,k.set)[0]:k.set[0]);
if(d){k=s?{expr:c.pop(),
set:f(s)}:b.find(c.pop(),c.length===1&&(c[0]==="~"||c[0]==="+")&&d.parentNode?d.parentNode:d,t);
n=k.expr?b.filter(k.expr,k.set):k.set;
c.length>0?e=f(n):v=false;
while(c.length)q=c.pop(),r=q,a.relative[q]?r=c.pop():q="",r==null&&(r=d),a.relative[q](e,r,t)}else e=c=[]}e||(e=n);
e||b.error(q||m);
if(j.call(e)==="[object Array]"){if(!v)i.push.apply(i,e);
else if(d&&d.nodeType===1)for(h=0;
e[h]!=null;
h++)e[h]&&(e[h]===true||e[h].nodeType===1&&b.contains(d,e[h]))&&i.push(n[h]);
else for(h=0;
e[h]!=null;
h++)e[h]&&e[h].nodeType===1&&i.push(n[h])}else f(e,i);
u&&(b(u,x,i,s),b.uniqueSort(i));
return i};
b.uniqueSort=function(a){if(e){c=k;
a.sort(e);
if(c)for(var b=1;
b<a.length;
b++)a[b]===a[b-1]&&a.splice(b--,1)}return a};
b.matches=function(c,a){return b(c,null,null,a)};
b.find=function(c,h,i){var d,f,j,e,b,g;
if(!c)return[];
for(f=0,j=a.order.length;
f<j;
f++){e=a.order[f];
if(b=a.leftMatch[e].exec(c)){g=b[1];
b.splice(1,1);
if(g.substr(g.length-1)!=="\\"){b[1]=(b[1]||"").replace(/\\/g,"");
d=a.find[e](b,h,i);
if(d!=null){c=c.replace(a.match[e],"");
break}}}}d||(d=h.getElementsByTagName("*"));
return{set:d,
expr:c}};
b.filter=function(d,j,m,o){var q=d,i=[],e=j,c,f,s=j&&j[0]&&b.isXML(j[0]),g,r,h,k,n,l,p;
while(d&&j.length){for(g in a.filter)if((c=a.leftMatch[g].exec(d))!=null&&c[2]){r=a.filter[g],n=c[1];
f=false;
c.splice(1,1);
if(n.substr(n.length-1)==="\\")continue;
e===i&&(i=[]);
if(a.preFilter[g]){c=a.preFilter[g](c,e,m,i,o,s);
if(!c)f=h=true;
else if(c===true)continue}if(c)for(l=0;
(k=e[l])!=null;
l++)if(k){h=r(k,c,l,e);
p=o^!!h;
m&&h!=null?p?f=true:e[l]=false:p&&(i.push(k),f=true)}if(h!==undefined){m||(e=i);
d=d.replace(a.match[g],"");
if(!f)return[];
break}}if(d===q){if(f==null)b.error(d);
else break}q=d}return e};
b.error=function(a){throw "Syntax error, unrecognized expression: "+a};
a=b.selectors={order:["ID","NAME","TAG"],
match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},
leftMatch:{},
attrMap:{"class":"className",
"for":"htmlFor"},
attrHandle:{href:function(a){return a.getAttribute("href")}},
relative:{"+":function(e,c){var h=typeof c==="string",g=h&&!/\W/.test(c),f=h&&!g,d,i,a;
g&&(c=c.toLowerCase());
for(d=0,i=e.length;
d<i;
d++)if(a=e[d]){while((a=a.previousSibling)&&a.nodeType!==1);
e[d]=f||a&&a.nodeName.toLowerCase()===c?a||false:a===c}f&&b.filter(c,e,true)},
">":function(e,d){var f=typeof d==="string",c,a=0,g=e.length,h;
if(f&&!/\W/.test(d)){d=d.toLowerCase();
for(;
a<g;
a++){c=e[a];
if(c){h=c.parentNode;
e[a]=h.nodeName.toLowerCase()===d?h:false}}}else{for(;
a<g;
a++)c=e[a],c&&(e[a]=f?c.parentNode:c.parentNode===d);
f&&b.filter(d,e,true)}},
"":function(f,a,d){var e=h++,b=i,c;
typeof a==="string"&&!/\W/.test(a)&&(a=a.toLowerCase(),c=a,b=m);
b("parentNode",a,e,f,c,d)},
"~":function(f,a,d){var e=h++,b=i,c;
typeof a==="string"&&!/\W/.test(a)&&(a=a.toLowerCase(),c=a,b=m);
b("previousSibling",a,e,f,c,d)}},
find:{ID:function(d,a,c){if(typeof a.getElementById!=="undefined"&&!c){var b=a.getElementById(d[1]);
return b?[b]:[]}},
NAME:function(d,e){if(typeof e.getElementsByName!=="undefined"){for(var c=[],b=e.getElementsByName(d[1]),a=0,f=b.length;
a<f;
a++)b[a].getAttribute("name")===d[1]&&c.push(b[a]);
return c.length===0?null:c}},
TAG:function(b,a){return a.getElementsByTagName(b[1])}},
preFilter:{CLASS:function(b,e,d,h,g,f){b=" "+b[1].replace(/\\/g,"")+" ";
if(f)return b;
for(var c=0,a;
(a=e[c])!=null;
c++)a&&(g^(a.className&&(" "+a.className+" ").replace(/[\t\n]/g," ").indexOf(b)>=0)?d||h.push(a):d&&(e[c]=false));
return false},
ID:function(a){return a[1].replace(/\\/g,"")},
TAG:function(a,b){return a[1].toLowerCase()},
CHILD:function(a){if(a[1]==="nth"){var b=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);
a[2]=(b[1]+(b[2]||1))-0;
a[3]=b[3]-0}a[0]=h++;
return a},
ATTR:function(b,g,e,h,f,d){var c=b[1].replace(/\\/g,"");
!d&&a.attrMap[c]&&(b[1]=a.attrMap[c]);
b[2]==="~="&&(b[4]=" "+b[4]+" ");
return b},
PSEUDO:function(c,e,d,f,i){if(c[1]==="not"){if((g.exec(c[3])||"").length>1||/^\w/.test(c[3]))c[3]=b(c[3],null,null,e);
else{var h=b.filter(c[3],e,d,true^i);
d||f.push.apply(f,h);
return false}}else if(a.match.POS.test(c[0])||a.match.CHILD.test(c[0]))return true;
return c},
POS:function(a){a.unshift(true);
return a}},
filters:{enabled:function(a){return a.disabled===false&&a.type!=="hidden"},
disabled:function(a){return a.disabled===true},
checked:function(a){return a.checked===true},
selected:function(a){a.parentNode.selectedIndex;
return a.selected===true},
parent:function(a){return!!a.firstChild},
empty:function(a){return!a.firstChild},
has:function(c,d,a){return!!b(a[3],c).length},
header:function(a){return/h\d/i.test(a.nodeName)},
text:function(a){return"text"===a.type},
radio:function(a){return"radio"===a.type},
checkbox:function(a){return"checkbox"===a.type},
file:function(a){return"file"===a.type},
password:function(a){return"password"===a.type},
submit:function(a){return"submit"===a.type},
image:function(a){return"image"===a.type},
reset:function(a){return"reset"===a.type},
button:function(a){return"button"===a.type||a.nodeName.toLowerCase()==="button"},
input:function(a){return/input|select|textarea|button/i.test(a.nodeName)}},
setFilters:{first:function(b,a){return a===0},
last:function(d,b,c,a){return b===a.length-1},
even:function(b,a){return a%2===0},
odd:function(b,a){return a%2===1},
lt:function(c,b,a){return b<a[3]-0},
gt:function(c,b,a){return b>a[3]-0},
nth:function(c,b,a){return a[3]-0===b},
eq:function(c,b,a){return a[3]-0===b}},
filter:{PSEUDO:function(c,d,k,i){var e=d[1],h=a.filters[e],g,f,j;
if(h)return h(c,k,d,i);
if(e==="contains")return(c.textContent||c.innerText||b.getText([c])||"").indexOf(d[3])>=0;
if(e==="not"){g=d[3],f=0,j=g.length;
for(;
f<j;
f++)if(g[f]===c)return false;
return true}b.error("Syntax error, unrecognized expression: "+e)},
CHILD:function(b,d){var g=d[1],a=b,c,i,h,e,j,f;
switch(g){case"only":case"first":while(a=a.previousSibling)if(a.nodeType===1)return false;
if(g==="first")return true;
a=b;
case"last":while(a=a.nextSibling)if(a.nodeType===1)return false;
return true;
case"nth":c=d[2],i=d[3];
if(c===1&&i===0)return true;
h=d[0],e=b.parentNode;
if(e&&(e.sizcache!==h||!b.nodeIndex)){j=0;
for(a=e.firstChild;
a;
a=a.nextSibling)a.nodeType===1&&(a.nodeIndex=++j);
e.sizcache=h};
f=b.nodeIndex-i;
return c===0?f===0:f%c===0&&f/c>=0}},
ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},
TAG:function(b,a){return a==="*"&&b.nodeType===1||b.nodeName.toLowerCase()===a},
CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},
ATTR:function(f,g){var e=g[1],h=a.attrHandle[e]?a.attrHandle[e](f):f[e]!=null?f[e]:f.getAttribute(e),c=h+"",d=g[2],b=g[4];
return h==null?d==="!=":d==="="?c===b:d==="*="?c.indexOf(b)>=0:d==="~="?(" "+c+" ").indexOf(b)>=0:b?d==="!="?c!==b:d==="^="?c.indexOf(b)===0:d==="$="?c.substr(c.length-b.length)===b:d==="|="?c===b||c.substr(0,b.length+1)===b+"-":false:c&&h!==false},
POS:function(d,b,f,e){var g=b[2],c=a.setFilters[g];
if(c)return c(d,f,b,e)}}},o=a.match.POS,p=function(b,a){return"\\"+(a-0+1)};
for(d in a.match)a.match[d]=new RegExp(a.match[d].source+/(?![^\[]*\])(?![^\(]*\))/.source),a.leftMatch[d]=new RegExp(/(^(?:.|\r|\n)*?)/.source+a.match[d].source.replace(/\\(\d+)/g,p));
f=function(b,a){b=Array.prototype.slice.call(b,0);
if(a){a.push.apply(a,b);
return a}return b};
try{Array.prototype.slice.call(document.documentElement.childNodes,0)[0].nodeType}catch(q){f=function(a,e){var c=e||[],b=0,d;
if(j.call(a)==="[object Array]")Array.prototype.push.apply(c,a);
else if(typeof a.length==="number")for(d=a.length;
b<d;
b++)c.push(a[b]);
else for(;
a[b];
b++)c.push(a[b]);
return c}}document.documentElement.compareDocumentPosition?(e=function(a,b){if(!a.compareDocumentPosition||!b.compareDocumentPosition){a==b&&(c=true);
return a.compareDocumentPosition?-1:1}var d=a.compareDocumentPosition(b)&4?-1:a===b?0:1;
d===0&&(c=true);
return d}):"sourceIndex"in document.documentElement?(e=function(a,b){if(!a.sourceIndex||!b.sourceIndex){a==b&&(c=true);
return a.sourceIndex?-1:1}var d=a.sourceIndex-b.sourceIndex;
d===0&&(c=true);
return d}):document.createRange&&(e=function(a,b){if(!a.ownerDocument||!b.ownerDocument){a==b&&(c=true);
return a.ownerDocument?-1:1}var e=a.ownerDocument.createRange(),d=b.ownerDocument.createRange(),f;
e.setStart(a,0);
e.setEnd(a,0);
d.setStart(b,0);
d.setEnd(b,0);
f=e.compareBoundaryPoints(Range.START_TO_END,d);
f===0&&(c=true);
return f});
b.getText=function(e){for(var c="",a,d=0;
e[d];
d++)a=e[d],a.nodeType===3||a.nodeType===4?c+=a.nodeValue:a.nodeType!==8&&(c+=b.getText(a.childNodes));
return c};
(function(){var b=document.createElement("div"),d="script"+new Date().getTime(),c;
b.innerHTML="<a name='"+d+"'/>";
c=document.documentElement;
c.insertBefore(b,c.firstChild);
document.getElementById(d)&&(a.find.ID=function(b,c,d){if(typeof c.getElementById!=="undefined"&&!d){var a=c.getElementById(b[1]);
return a?a.id===b[1]||typeof a.getAttributeNode!=="undefined"&&a.getAttributeNode("id").nodeValue===b[1]?[a]:undefined:[]}},a.filter.ID=function(a,c){var b=typeof a.getAttributeNode!=="undefined"&&a.getAttributeNode("id");
return a.nodeType===1&&b&&b.nodeValue===c});
c.removeChild(b);
c=b=null})();
(function(){var b=document.createElement("div");
b.appendChild(document.createComment(""));
b.getElementsByTagName("*").length>0&&(a.find.TAG=function(c,e){var a=e.getElementsByTagName(c[1]),d,b;
if(c[1]==="*"){d=[],b=0;
for(;
a[b];
b++)a[b].nodeType===1&&d.push(a[b]);
a=d}return a});
b.innerHTML="<a href='#'></a>";
b.firstChild&&typeof b.firstChild.getAttribute!=="undefined"&&b.firstChild.getAttribute("href")!=="#"&&(a.attrHandle.href=function(a){return a.getAttribute("href",2)});
b=null})();
document.querySelectorAll&&(function(){var d=b,a=document.createElement("div"),c;
a.innerHTML="<p class='TEST'></p>";
if(a.querySelectorAll&&a.querySelectorAll(".TEST").length===0)return;
b=function(g,a,c,e){a=a||document;
if(!e&&a.nodeType===9&&!b.isXML(a))try{return f(a.querySelectorAll(g),c)}catch(h){}return d(g,a,c,e)};
for(c in d)b[c]=d[c];
a=null})();
(function(){var b=document.createElement("div");
b.innerHTML="<div class='test e'></div><div class='test'></div>";
if(!b.getElementsByClassName||b.getElementsByClassName("e").length===0)return;
b.lastChild.className="e";
if(b.getElementsByClassName("e").length===1)return;
a.order.splice(1,0,"CLASS");
a.find.CLASS=function(c,a,b){if(typeof a.getElementsByClassName!=="undefined"&&!b)return a.getElementsByClassName(c[1])};
b=null})();
function m(e,h,f,c,j,g){for(var b=0,i=c.length,a,d;
b<i;
b++){a=c[b];
if(a){a=a[e];
d=false;
while(a){if(a.sizcache===f){d=c[a.sizset];
break}a.nodeType===1&&!g&&(a.sizcache=f,a.sizset=b);
if(a.nodeName.toLowerCase()===h){d=a;
break}a=a[e]}c[b]=d}}}function i(g,f,h,e,k,i){for(var c=0,j=e.length,a,d;
c<j;
c++){a=e[c];
if(a){a=a[g];
d=false;
while(a){if(a.sizcache===h){d=e[a.sizset];
break}if(a.nodeType===1){i||(a.sizcache=h,a.sizset=c);
if(typeof f!=="string"){if(a===f){d=true;
break}}else if(b.filter(f,[a]).length>0){d=a;
break}}a=a[g]}e[c]=d}}}b.contains=document.compareDocumentPosition?function(b,a){return!!(b.compareDocumentPosition(a)&16)}:function(a,b){return a!==b&&(a.contains?a.contains(b):true)};
b.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;
return b?b.nodeName!=="HTML":false};
l=function(c,d){var h=[],i="",f,g=d.nodeType?[d]:d,e,j;
while(f=a.match.PSEUDO.exec(c))i+=f[0],c=c.replace(a.match.PSEUDO,"");
c=a.relative[c]?c+"*":c;
for(e=0,j=g.length;
e<j;
e++)b(c,g[e],h);
return b.filter(i,h)},n=qx.bom.Selector;
n.query=function(a,c){return b(a,c)};
n.matches=function(a,c){return b(a,null,null,c)}})();


// qx.bom.Viewport
//   - size: 698 bytes
//   - modified: 2010-09-18T15:10:19
//   - names:
//       Math, 1x
//       qx, 3x
//       window, 5x
//   - packages:
//       Math.abs, 1x
//       qx.Class.define, 1x
//       qx.bom.Document.isStandardMode, 2x
qx.Class.define("qx.bom.Viewport",{statics:{getWidth:function(b){var a=(b||window).document;
return qx.bom.Document.isStandardMode(b)?a.documentElement.clientWidth:a.body.clientWidth},
getHeight:function(b){var a=(b||window).document;
return qx.bom.Document.isStandardMode(b)?a.documentElement.clientHeight:a.body.clientHeight},
getScrollLeft:function(a){return(a||window).pageXOffset},
getScrollTop:function(a){return(a||window).pageYOffset},
getOrientation:function(b){var a=(b||window).orientation;
a==null&&(a=this.getWidth(b)>this.getHeight(b)?90:0);
return a},
isLandscape:function(a){return Math.abs(this.getOrientation(a))==90},
isPortrait:function(a){return this.getOrientation(a)==0}}});


// qx.bom.Document
//   - size: 540 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       Math, 2x
//       qx, 3x
//       window, 3x
//   - packages:
//       Math.max, 2x
//       qx.Class.define, 1x
//       qx.bom.Viewport.getHeight, 1x
//       qx.bom.Viewport.getWidth, 1x
qx.Class.define("qx.bom.Document",{statics:{isQuirksMode:function(a){return(a||window).document.compatMode!=="CSS1Compat"},
isStandardMode:function(a){return!this.isQuirksMode(a)},
getWidth:function(a){var b=(a||window).document,d=qx.bom.Viewport.getWidth(a),c=this.isStandardMode(a)?b.documentElement.scrollWidth:b.body.scrollWidth;
return Math.max(c,d)},
getHeight:function(a){var b=(a||window).document,d=qx.bom.Viewport.getHeight(a),c=this.isStandardMode(a)?b.documentElement.scrollHeight:b.body.scrollHeight;
return Math.max(c,d)}}});


// qx.core.ObjectRegistry
//   - size: 1440 bytes
//   - modified: 2010-05-06T22:42:39
//   - names:
//       Error, 3x
//       parseInt, 2x
//       qx, 3x
//   - packages:
//       qx.Bootstrap.debug, 1x
//       qx.Bootstrap.error, 1x
//       qx.Class.define, 1x
qx.Class.define("qx.core.ObjectRegistry",{statics:{inShutDown:false,
__zAUSy:{},
__y4b2Q:0,
__IA8cb:[],
register:function(a){var c=this.__zAUSy,b,d;
if(!c)return;
b=a.$$hash;
if(b==null){d=this.__IA8cb;
b=d.length>0?d.pop():this.__y4b2Q+++"";
a.$$hash=b}if(!a.dispose)throw new Error("Invalid object: "+a);
c[b]=a},
unregister:function(a){var b=a.$$hash,c;
if(b==null)return;
c=this.__zAUSy;
c&&c[b]&&(delete c[b],this.__IA8cb.push(b));
try{delete a.$$hash}catch(d){a.removeAttribute&&a.removeAttribute("$$hash")}},
toHashCode:function(b){if(b==null)throw new Error("Invalid object: "+b);
var a=b.$$hash,c;
if(a!=null)return a;
c=this.__IA8cb;
a=c.length>0?c.pop():this.__y4b2Q+++"";
return b.$$hash=a},
clearHashCode:function(a){if(a==null)throw new Error("Invalid object: "+a);
var b=a.$$hash;
if(b!=null){this.__IA8cb.push(b);
try{delete a.$$hash}catch(c){a.removeAttribute&&a.removeAttribute("$$hash")}}},
fromHashCode:function(a){return this.__zAUSy[a]||null},
shutdown:function(){this.inShutDown=true;
var f=this.__zAUSy,c=[],d,b,a,e;
for(d in f)c.push(d);
c.sort(function(b,a){return parseInt(a)-parseInt(b)});
a=0,e=c.length;
while(true){try{for(;
a<e;
a++)d=c[a],b=f[d],b&&b.dispose&&b.dispose()}catch(g){qx.Bootstrap.error(this,"Could not dispose object "+b.toString()+": "+g);
if(a!==e){a++;
continue}}break}qx.Bootstrap.debug(this,"Disposed "+e+" objects");
delete this.__zAUSy},
getRegistry:function(){return this.__zAUSy}}});


// qx.bom.client.Locale
//   - size: 288 bytes
//   - modified: 2010-11-02T15:54:54
//   - names:
//       navigator, 2x
//       qx, 1x
//   - packages:
//       navigator.language, 1x
//       navigator.userLanguage, 1x
//       qx.Class.define, 1x
qx.Class.define("qx.bom.client.Locale",{statics:{LOCALE:"",
VARIANT:"",
__jA3lT:function(){var a=(navigator.userLanguage||navigator.language).toLowerCase(),c="",b=a.indexOf("-");
b!=-1&&(c=a.substr(b+1),a=a.substr(0,b));
this.LOCALE=a;
this.VARIANT=c}},
defer:function(a){a.__jA3lT()}});


// qx.bom.element.Cursor
//   - size: 292 bytes
//   - modified: 2010-10-15T14:15:43
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Style.get, 1x
qx.Class.define("qx.bom.element.Cursor",{statics:{__gMIjx:{},
compile:function(a){return"cursor:"+(this.__gMIjx[a]||a)+";"},
get:function(a,b){return qx.bom.element.Style.get(a,"cursor",b,false)},
set:function(b,a){b.style.cursor=this.__gMIjx[a]||a},
reset:function(a){a.style.cursor=""}}});


// qx.bom.element.Opacity
//   - size: 730 bytes
//   - modified: 2010-10-15T14:16:07
//   - names:
//       document, 1x
//       parseFloat, 1x
//       qx, 6x
//   - packages:
//       document.documentElement.style.opacity, 1x
//       qx.Class.define, 1x
//       qx.bom.element.Opacity.SUPPORT_CSS3_OPACITY, 4x
//       qx.bom.element.Style.get, 1x
qx.Class.define("qx.bom.element.Opacity",{statics:{SUPPORT_CSS3_OPACITY:false,
compile:function(a){a>=1&&(a=.999999);
return qx.bom.element.Opacity.SUPPORT_CSS3_OPACITY?"opacity:"+a+";":"-moz-opacity:"+a+";"},
set:function(b,a){a>=1&&(a=.999999);
qx.bom.element.Opacity.SUPPORT_CSS3_OPACITY?b.style.opacity=a:b.style.MozOpacity=a},
reset:function(a){qx.bom.element.Opacity.SUPPORT_CSS3_OPACITY?a.style.opacity="":a.style.MozOpacity=""},
get:function(b,c){var a=qx.bom.element.Style.get(b,qx.bom.element.Opacity.SUPPORT_CSS3_OPACITY?"opacity":"MozOpacity",c,false);
a==.999999&&(a=1);
if(a!=null)return parseFloat(a);
return 1}},
defer:function(a){a.SUPPORT_CSS3_OPACITY=typeof document.documentElement.style.opacity=="string"}});


// qx.bom.element.Overflow
//   - size: 2063 bytes
//   - modified: 2010-10-15T14:17:24
//   - names:
//       Math, 2x
//       document, 3x
//       parseInt, 1x
//       qx, 13x
//   - packages:
//       Math.max, 2x
//       document.body.appendChild, 1x
//       document.body.removeChild, 1x
//       document.createElement, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Engine.VERSION, 7x
//       qx.bom.element.Style, 1x
//       qx.bom.element.Style.get, 4x
qx.Class.define("qx.bom.element.Overflow",{statics:{__3wL46:null,
getScrollbarWidth:function(){if(this.__3wL46!==null)return this.__3wL46;
var b=qx.bom.element.Style,f=function(c,a){return parseInt(b.get(c,a))||0},d=function(a){return b.get(a,"borderRightStyle")=="none"?0:f(a,"borderRightWidth")},i=function(a){return b.get(a,"borderLeftStyle")=="none"?0:f(a,"borderLeftWidth")},g=function(a){if(a.clientWidth==0){var c=b.get(a,"overflow"),e=(c=="scroll"||c=="-moz-scrollbars-vertical"?16:0);
return Math.max(0,d(a)+e)}return Math.max(0,(a.offsetWidth-a.clientWidth-i(a)))},h=function(a){return g(a)-d(a)},a=document.createElement("div"),c=a.style,e;
c.height=c.width="100px";
c.overflow="scroll";
document.body.appendChild(a);
e=h(a);
this.__3wL46=e?e:16;
document.body.removeChild(a);
return this.__3wL46},
_compile:qx.bom.client.Engine.VERSION<1.8?function(b,a){a=="hidden"&&(a="-moz-scrollbars-none");
return"overflow:"+a+";"}:function(a,b){return a+":"+b+";"},
compileX:function(a){return this._compile("overflow-x",a)},
compileY:function(a){return this._compile("overflow-y",a)},
getX:qx.bom.client.Engine.VERSION<1.8?function(b,c){var a=qx.bom.element.Style.get(b,"overflow",c,false);
a==="-moz-scrollbars-none"&&(a="hidden");
return a}:function(a,b){return qx.bom.element.Style.get(a,"overflowX",b,false)},
setX:qx.bom.client.Engine.VERSION<1.8?function(b,a){a=="hidden"&&(a="-moz-scrollbars-none");
b.style.overflow=a}:function(a,b){a.style.overflowX=b},
resetX:qx.bom.client.Engine.VERSION<1.8?function(a){a.style.overflow=""}:function(a){a.style.overflowX=""},
getY:qx.bom.client.Engine.VERSION<1.8?function(b,c){var a=qx.bom.element.Style.get(b,"overflow",c,false);
a==="-moz-scrollbars-none"&&(a="hidden");
return a}:function(a,b){return qx.bom.element.Style.get(a,"overflowY",b,false)},
setY:qx.bom.client.Engine.VERSION<1.8?function(b,a){a==="hidden"&&(a="-moz-scrollbars-none");
b.style.overflow=a}:function(a,b){a.style.overflowY=b},
resetY:qx.bom.client.Engine.VERSION<1.8?function(a){a.style.overflow=""}:function(a){a.style.overflowY=""}}});


// qx.core.Assert
//   - size: 7034 bytes
//   - modified: 2010-11-02T15:56:33
//   - names:
//       Error, 3x
//       Object, 1x
//       isFinite, 4x
//       qx, 25x
//       undefined, 3x
//   - packages:
//       qx.Bootstrap.error, 2x
//       qx.Class.define, 1x
//       qx.Class.getByName, 1x
//       qx.Class.implementsInterface, 1x
//       qx.Class.isDefined, 1x
//       qx.core.AssertionError, 1x
//       qx.lang.Json.stringify, 3x
//       qx.lang.String.format, 1x
//       qx.lang.Type.isArray, 2x
//       qx.lang.Type.isBoolean, 1x
//       qx.lang.Type.isFunction, 1x
//       qx.lang.Type.isNumber, 4x
//       qx.lang.Type.isObject, 2x
//       qx.lang.Type.isRegExp, 2x
//       qx.lang.Type.isString, 2x
qx.Class.define("qx.core.Assert",{statics:{__yM80Z:true,
__jkPsB:function(e,g){for(var a="",b=1,f=arguments.length,c,d;
b<f;
b++)a=a+this.__zpmOH(arguments[b]);
c="Assertion error! "+e+": "+a;
this.__yM80Z&&qx.Bootstrap.error(c);
if(qx.Class.isDefined("qx.core.AssertionError")){d=new qx.core.AssertionError(e,a);
this.__yM80Z&&qx.Bootstrap.error("Stack trace: \n"+d.getStackTrace());
throw d}throw new Error(c)},
__zpmOH:function(a){var b;
if(a===null)b="null";
else if(qx.lang.Type.isArray(a)&&a.length>10)b="Array["+a.length+"]";
else if(a instanceof Object&&a.toString==null)b=qx.lang.Json.stringify(a,null,2);
else try{b=a.toString()}catch(c){b=""}return b},
assert:function(a,b){a==true||this.__jkPsB(b||"","Called assert with 'false'")},
fail:function(a){this.__jkPsB(a||"","Called fail().")},
assertTrue:function(a,b){a===true||this.__jkPsB(b||"","Called assertTrue with '",a,"'")},
assertFalse:function(a,b){a===false||this.__jkPsB(b||"","Called assertFalse with '",a,"'")},
assertEquals:function(b,a,c){b==a||this.__jkPsB(c||"","Expected '",b,"' but found '",a,"'!")},
assertNotEquals:function(b,a,c){b!=a||this.__jkPsB(c||"","Expected '",b,"' to be not equal with '",a,"'!")},
assertIdentical:function(b,a,c){b===a||this.__jkPsB(c||"","Expected '",b,"' (identical) but found '",a,"'!")},
assertNotIdentical:function(b,a,c){b!==a||this.__jkPsB(c||"","Expected '",b,"' to be not identical with '",a,"'!")},
assertNotUndefined:function(a,b){a!==undefined||this.__jkPsB(b||"","Expected value not to be undefined but found ",a,"!")},
assertUndefined:function(a,b){a===undefined||this.__jkPsB(b||"","Expected value to be undefined but found ",a,"!")},
assertNotNull:function(a,b){a!==null||this.__jkPsB(b||"","Expected value not to be null but found ",a,"!")},
assertNull:function(a,b){a===null||this.__jkPsB(b||"","Expected value to be null but found ",a,"!")},
assertJsonEquals:function(c,b,a){this.assertEquals(qx.lang.Json.stringify(c),qx.lang.Json.stringify(b),a)},
assertMatch:function(b,a,c){this.assertString(b);
this.assert(qx.lang.Type.isRegExp(a)||qx.lang.Type.isString(a),"The parameter 're' must be a string or a regular expression.");
b.search(a)>=0||this.__jkPsB(c||"","The String '",b,"' does not match the regular expression '",a.toString(),"'!")},
assertArgumentsCount:function(d,c,a,e){var b=d.length;
b>=c&&b<=a||this.__jkPsB(e||"","Wrong number of arguments given. Expected '",c,"' to '",a,"' arguments but found '",arguments.length,"' arguments.")},
assertEventFired:function(a,b,f,c,h){var d=false,i=function(b){c&&c.call(a,b);
d=true},e;
try{e=a.addListener(b,i,a);
f.call()}catch(g){throw g}finally{try{a.removeListenerById(e)}catch(g){}}d===true||this.__jkPsB(h||"","Event (",b,") not fired.")},
assertEventNotFired:function(a,c,e,f){var b=false,g=function(a){b=true},d=a.addListener(c,g,a);
e.call();
b===false||this.__jkPsB(f||"","Event (",c,") was fired.");
a.removeListenerById(d)},
assertException:function(f,c,d,b){var c=c||Error,a;
try{this.__yM80Z=false;
f()}catch(e){a=e}finally{this.__yM80Z=true}a==null&&this.__jkPsB(b||"","The function did not raise an exception!");
a instanceof c||this.__jkPsB(b||"","The raised exception does not have the expected type! ",c," != ",a);
d&&this.assertMatch(a.toString(),d,b)},
assertInArray:function(a,b,c){b.indexOf(a)!==-1||this.__jkPsB(c||"","The value '",a,"' must have any of the values defined in the array '",b,"'")},
assertArrayEquals:function(c,d,a){this.assertArray(c,a);
this.assertArray(d,a);
this.assertEquals(c.length,d.length,a);
for(var b=0;
b<c.length;
b++)this.assertIdentical(c[b],d[b],a)},
assertKeyInMap:function(a,b,c){b[a]!==undefined||this.__jkPsB(c||"","The value '",a,"' must must be a key of the map '",b,"'")},
assertFunction:function(a,b){qx.lang.Type.isFunction(a)||this.__jkPsB(b||"","Expected value to be typeof function but found ",a,"!")},
assertString:function(a,b){qx.lang.Type.isString(a)||this.__jkPsB(b||"","Expected value to be a string but found ",a,"!")},
assertBoolean:function(a,b){qx.lang.Type.isBoolean(a)||this.__jkPsB(b||"","Expected value to be a boolean but found ",a,"!")},
assertNumber:function(a,b){qx.lang.Type.isNumber(a)&&isFinite(a)||this.__jkPsB(b||"","Expected value to be a number but found ",a,"!")},
assertPositiveNumber:function(a,b){qx.lang.Type.isNumber(a)&&isFinite(a)&&a>=0||this.__jkPsB(b||"","Expected value to be a number >= 0 but found ",a,"!")},
assertInteger:function(a,b){qx.lang.Type.isNumber(a)&&isFinite(a)&&a%1===0||this.__jkPsB(b||"","Expected value to be an integer but found ",a,"!")},
assertPositiveInteger:function(a,c){var b=(qx.lang.Type.isNumber(a)&&isFinite(a)&&a%1===0&&a>=0);
b||this.__jkPsB(c||"","Expected value to be an integer >= 0 but found ",a,"!")},
assertInRange:function(a,b,c,d){a>=b&&a<=c||this.__jkPsB(d||"",qx.lang.String.format("Expected value '%1' to be in the range '%2'..'%3'!",[a,b,c]))},
assertObject:function(a,c){var b=a!==null&&(qx.lang.Type.isObject(a)||typeof a==="object");
b||this.__jkPsB(c||"","Expected value to be typeof object but found ",(a),"!")},
assertArray:function(a,b){qx.lang.Type.isArray(a)||this.__jkPsB(b||"","Expected value to be an array but found ",a,"!")},
assertMap:function(a,b){qx.lang.Type.isObject(a)||this.__jkPsB(b||"","Expected value to be a map but found ",a,"!")},
assertRegExp:function(a,b){qx.lang.Type.isRegExp(a)||this.__jkPsB(b||"","Expected value to be a regular expression but found ",a,"!")},
assertType:function(b,a,c){this.assertString(a,"Invalid argument 'type'");
typeof b===a||this.__jkPsB(c||"","Expected value to be typeof '",a,"' but found ",b,"!")},
assertInstance:function(b,a,d){var c=a.classname||a+"";
b instanceof a||this.__jkPsB(d||"","Expected value to be instanceof '",c,"' but found ",b,"!")},
assertInterface:function(a,b,c){qx.Class.implementsInterface(a,b)||this.__jkPsB(c||"","Expected object '",a,"' to implement the interface '",b,"'!")},
assertCssColor:function(e,c,f){var d=qx.Class.getByName("qx.util.ColorUtil"),a,b,g;
if(!d)throw new Error("qx.util.ColorUtil not available! Your code must have a dependency on 'qx.util.ColorUtil'");
a=d.stringToRgb(e);
try{b=d.stringToRgb(c)}catch(h){this.__jkPsB(f||"","Expected value to be the CSS color '",e,"' (rgb(",a.join(","),")), but found value '",c,"', which cannot be converted to a CSS color!")}g=a[0]==b[0]&&a[1]==b[1]&&a[2]==b[2];
g||this.__jkPsB(f||"","Expected value to be the CSS color '",a,"' (rgb(",a.join(","),")), but found value '",c,"' (rgb(",b.join(","),"))!")},
assertElement:function(a,b){!!(a&&a.nodeType===1)||this.__jkPsB(b||"","Expected value to be a DOM element but found  '",a,"'!")},
assertQxObject:function(a,b){this.__VkBFl(a,"qx.core.Object")||this.__jkPsB(b||"","Expected value to be a qooxdoo object but found ",a,"!")},
assertQxWidget:function(a,b){this.__VkBFl(a,"qx.ui.core.Widget")||this.__jkPsB(b||"","Expected value to be a qooxdoo widget but found ",a,"!")},
__VkBFl:function(b,c){if(!b)return false;
var a=b.constructor;
while(a){if(a.classname===c)return true;
a=a.superclass}return false}}});


// qx.lang.Array
//   - size: 2598 bytes
//   - modified: 2010-09-18T15:07:11
//   - names:
//       Array, 5x
//       Error, 1x
//       Object, 1x
//       qx, 14x
//       undefined, 3x
//   - packages:
//       Array.prototype.push.apply, 1x
//       Array.prototype.slice.call, 3x
//       Object.prototype.toString.call, 1x
//       qx.Class.define, 1x
//       qx.core.Assert, 6x
//       qx.core.Assert.assertArray, 6x
//       qx.lang.Date.now, 1x
qx.Class.define("qx.lang.Array",{statics:{toArray:function(b,a){return this.cast(b,Array,a)},
cast:function(b,d,c){if(b.constructor===d)return b;
var a=new d;
Object.prototype.toString.call(b)==="[object Array]"&&c==null?a.push.apply(a,b):a.push.apply(a,Array.prototype.slice.call(b,c||0));
return a},
fromArguments:function(b,a){return Array.prototype.slice.call(b,a||0)},
fromCollection:function(a){return Array.prototype.slice.call(a,0)},
clone:function(a){return a.concat()},
insertAt:function(a,b,c){a.splice(c,0,b);
return a},
insertBefore:function(a,b,d){var c=a.indexOf(d);
c==-1?a.push(b):a.splice(c,0,b);
return a},
insertAfter:function(a,c,d){var b=a.indexOf(d);
b==-1||b==a.length-1?a.push(c):a.splice(b+1,0,c);
return a},
removeAt:function(a,b){return a.splice(b,1)[0]},
removeAll:function(a){a.length=0;
return this},
append:function(a,b){qx.core.Assert&&qx.core.Assert.assertArray(a,"The first parameter must be an array."),qx.core.Assert&&qx.core.Assert.assertArray(b,"The second parameter must be an array.");
Array.prototype.push.apply(a,b);
return a},
exclude:function(a,b){qx.core.Assert&&qx.core.Assert.assertArray(a,"The first parameter must be an array."),qx.core.Assert&&qx.core.Assert.assertArray(b,"The second parameter must be an array.");
for(var d=0,e=b.length,c;
d<e;
d++)c=a.indexOf(b[d]),c!=-1&&a.splice(c,1);
return a},
remove:function(b,a){var c=b.indexOf(a);
if(c!=-1){b.splice(c,1);
return a}},
contains:function(b,a){return b.indexOf(a)!==-1},
equals:function(b,c){var d=b.length,a;
if(d!==c.length)return false;
for(a=0;
a<d;
a++)if(b[a]!==c[a])return false;
return true},
sum:function(c){for(var b=0,a=0,d=c.length;
a<d;
a++)b+=c[a];
return b},
max:function(a){qx.core.Assert&&qx.core.Assert.assertArray(a,"Parameter must be an array.");
var b,d=a.length,c=a[0];
for(b=1;
b<d;
b++)a[b]>c&&(c=a[b]);
return c===undefined?null:c},
min:function(a){qx.core.Assert&&qx.core.Assert.assertArray(a,"Parameter must be an array.");
var b,d=a.length,c=a[0];
for(b=1;
b<d;
b++)a[b]<c&&(c=a[b]);
return c===undefined?null:c},
unique:function(k){for(var c=[],l={},i={},e={},a,n=0,d="qx"+qx.lang.Date.now(),j=false,h=false,g=false,f=0,m=k.length,b;
f<m;
f++)a=k[f],a===null?j||(j=true,c.push(a)):a===undefined||(a===false?h||(h=true,c.push(a)):a===true?g||(g=true,c.push(a)):typeof a==="string"?l[a]||(l[a]=1,c.push(a)):typeof a==="number"?i[a]||(i[a]=1,c.push(a)):(b=a[d],b==null&&(b=a[d]=n++),e[b]||(e[b]=a,c.push(a))));
for(b in e)try{delete e[b][d]}catch(o){try{e[b][d]=null}catch(o){throw new Error("Cannot clean-up map entry doneObjects["+b+"]["+d+"]")}}return c}}});


// qx.lang.Function
//   - size: 2559 bytes
//   - modified: 2010-11-02T15:59:43
//   - names:
//       eval, 1x
//       qx, 11x
//       window, 7x
//   - packages:
//       eval.call, 1x
//       qx.Class.define, 1x
//       qx.core.Assert, 1x
//       qx.core.Assert.assertFunction, 1x
//       qx.event.GlobalError.observeMethod, 1x
//       qx.lang.Array.fromArguments, 7x
//       window.event, 2x
//       window.execScript, 2x
//       window.setInterval, 1x
//       window.setTimeout, 1x
qx.Class.define("qx.lang.Function",{statics:{getCaller:function(a){return a.caller?a.caller.callee:a.callee.caller},
getName:function(a){if(a.displayName)return a.displayName;
if(a.$$original||a.wrapper||a.classname)return a.classname+".constructor()";
if(a.$$mixin){for(b in a.$$mixin.$$members)if(a.$$mixin.$$members[b]==a)return a.$$mixin.name+".prototype."+b+"()";
for(b in a.$$mixin)if(a.$$mixin[b]==a)return a.$$mixin.name+"."+b+"()"}if(a.self){var c=a.self.constructor,b,d;
if(c){for(b in c.prototype)if(c.prototype[b]==a)return c.classname+".prototype."+b+"()";
for(b in c)if(c[b]==a)return c.classname+"."+b+"()"}}d=a.toString().match(/function\s*(\w*)\s*\(.*/);
if(d&&d.length>=1&&d[1])return d[1]+"()";
return"anonymous()"},
globalEval:function(a){return window.execScript?window.execScript(a):eval.call(window,a)},
empty:function(){},
returnTrue:function(){return true},
returnFalse:function(){return false},
returnNull:function(){return null},
returnThis:function(){return this},
returnZero:function(){return 0},
create:function(b,a){qx.core.Assert&&qx.core.Assert.assertFunction(b,"Invalid parameter 'func'.");
if(!a)return b;
if(!(a.self||a.args||a.delay!=null||a.periodical!=null||a.attempt))return b;
return function(g){var c=qx.lang.Array.fromArguments(arguments),e,d;
a.args&&(c=a.args.concat(c));
if(a.delay||a.periodical){e=qx.event.GlobalError.observeMethod(function(){return b.apply(a.self||this,c)});
if(a.delay)return window.setTimeout(e,a.delay);
if(a.periodical)return window.setInterval(e,a.periodical)}else{if(a.attempt){d=false;
try{d=b.apply(a.self||this,c)}catch(f){}return d}return b.apply(a.self||this,c)}}},
bind:function(a,b,c){return this.create(a,{self:b,
args:arguments.length>2?qx.lang.Array.fromArguments(arguments,2):null})},
curry:function(a,b){return this.create(a,{args:arguments.length>1?qx.lang.Array.fromArguments(arguments,1):null})},
listener:function(a,b,d){if(arguments.length<3)return function(c){return a.call(b||this,c||window.event)};
var c=qx.lang.Array.fromArguments(arguments,2);
return function(e){var d=[e||window.event];
d.push.apply(d,c);
a.apply(b||this,d)}},
attempt:function(a,b,c){return this.create(a,{self:b,
attempt:true,
args:arguments.length>2?qx.lang.Array.fromArguments(arguments,2):null})()},
delay:function(a,c,b,d){return this.create(a,{delay:c,
self:b,
args:arguments.length>3?qx.lang.Array.fromArguments(arguments,3):null})()},
periodical:function(a,b,c,d){return this.create(a,{periodical:b,
self:c,
args:arguments.length>3?qx.lang.Array.fromArguments(arguments,3):null})()}}});


// qx.lang.JsonImpl
//   - size: 3609 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Math, 2x
//       Object, 3x
//       String, 2x
//       SyntaxError, 1x
//       TypeError, 2x
//       eval, 1x
//       isFinite, 2x
//       qx, 10x
//       undefined, 3x
//   - packages:
//       Math.floor, 1x
//       Math.min, 1x
//       Object.hasOwnProperty.call, 2x
//       qx.Class.define, 1x
//       qx.lang.Function.bind, 2x
//       qx.lang.Type.getClass, 1x
//       qx.lang.Type.isArray, 1x
//       qx.lang.Type.isDate, 1x
//       qx.lang.Type.isFunction, 2x
//       qx.lang.Type.isNumber, 1x
//       qx.lang.Type.isString, 1x
qx.Class.define("qx.lang.JsonImpl",{extend:Object,
construct:function(){this.stringify=qx.lang.Function.bind(this.stringify,this);
this.parse=qx.lang.Function.bind(this.parse,this)},
members:{__gHLqR:null,
__qmoZp:null,
__gS2rq:null,
__mVh3F:null,
stringify:function(d,b,a){this.__gHLqR="";
this.__qmoZp="";
this.__mVh3F=[];
if(qx.lang.Type.isNumber(a)){for(var a=Math.min(10,Math.floor(a)),c=0;
c<a;
c+=1)this.__qmoZp+=" "}else qx.lang.Type.isString(a)&&(a.length>10&&(a=a.slice(0,10)),this.__qmoZp=a);
this.__gS2rq=b&&(qx.lang.Type.isFunction(b)||qx.lang.Type.isArray(b))?b:null;
return this.__g2E9Q("",{"":d})},
__g2E9Q:function(h,i){var g=this.__gHLqR,b,a=i[h],j,d,e,c,f;
a&&qx.lang.Type.isFunction(a.toJSON)?a=a.toJSON(h):qx.lang.Type.isDate(a)&&(a=this.dateToJSON(a));
typeof this.__gS2rq==="function"&&(a=this.__gS2rq.call(i,h,a));
if(a===null)return"null";
if(a===undefined)return undefined;
switch(qx.lang.Type.getClass(a)){case"String":return this.__ncTb7(a);
case"Number":return isFinite(a)?String(a):"null";
case"Boolean":return String(a);
case"Array":this.__gHLqR+=this.__qmoZp;
b=[];
if(this.__mVh3F.indexOf(a)!==-1)throw new TypeError("Cannot stringify a recursive object.");
this.__mVh3F.push(a);
j=a.length,d=0;
for(;
d<j;
d+=1)b[d]=this.__g2E9Q(d,a)||"null";
this.__mVh3F.pop();
if(b.length===0)e="[]";
else e=this.__gHLqR?"[\n"+this.__gHLqR+b.join(",\n"+this.__gHLqR)+"\n"+g+"]":"["+b.join(",")+"]";
this.__gHLqR=g;
return e;
case"Object":this.__gHLqR+=this.__qmoZp;
b=[];
if(this.__mVh3F.indexOf(a)!==-1)throw new TypeError("Cannot stringify a recursive object.");
this.__mVh3F.push(a);
if(this.__gS2rq&&typeof this.__gS2rq==="object"){j=this.__gS2rq.length,d=0;
for(;
d<j;
d+=1){c=this.__gS2rq[d];
if(typeof c==="string"){f=this.__g2E9Q(c,a);
f&&b.push(this.__ncTb7(c)+(this.__gHLqR?": ":":")+f)}}}else for(c in a)if(Object.hasOwnProperty.call(a,c)){f=this.__g2E9Q(c,a);
f&&b.push(this.__ncTb7(c)+(this.__gHLqR?": ":":")+f)};
this.__mVh3F.pop();
if(b.length===0)e="{}";
else e=this.__gHLqR?"{\n"+this.__gHLqR+b.join(",\n"+this.__gHLqR)+"\n"+g+"}":"{"+b.join(",")+"}";
this.__gHLqR=g;
return e}},
dateToJSON:function(a){var b=function(a){return a<10?"0"+a:a},c=function(a){var c=b(a);
return a<100?"0"+c:c};
return isFinite(a.valueOf())?a.getUTCFullYear()+"-"+b(a.getUTCMonth()+1)+"-"+b(a.getUTCDate())+"T"+b(a.getUTCHours())+":"+b(a.getUTCMinutes())+":"+b(a.getUTCSeconds())+"."+c(a.getUTCMilliseconds())+"Z":null},
__ncTb7:function(b){var c={"\b":"\\b",
"\t":"\\t",
"\n":"\\n",
"\f":"\\f",
"\r":"\\r",
"\"":"\\\"",
"\\":"\\\\"},a=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
a.lastIndex=0;
return a.test(b)?"\""+b.replace(a,function(b){var a=c[b];
return typeof a==="string"?a:"\\u"+("0000"+b.charCodeAt(0).toString(16)).slice(-4)})+"\"":"\""+b+"\""},
parse:function(a,d){var b=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,c;
b.lastIndex=0;
b.test(a)&&(a=a.replace(b,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));
if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){c=eval("("+a+")");
return typeof d==="function"?this.__jET2g({"":c},"",d):c}throw new SyntaxError("JSON.parse")},
__jET2g:function(c,e,f){var a=c[e],b,d;
if(a&&typeof a==="object")for(b in a)if(Object.hasOwnProperty.call(a,b)){d=this.__jET2g(a,b,f);
d!==undefined?a[b]=d:delete a[b]}return f.call(c,e,a)}}});


// qx.lang.Json
//   - size: 258 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       JSON, 1x
//       qx, 3x
//       window, 2x
//   - packages:
//       JSON.parse, 1x
//       qx.Class.define, 1x
//       qx.lang.JsonImpl, 1x
//       qx.lang.Type.getClass, 1x
//       window.JSON, 2x
qx.Class.define("qx.lang.Json",{statics:{JSON:qx.lang.Type.getClass(window.JSON)=="JSON"&&JSON.parse("{\"x\":1}").x===1?window.JSON:new qx.lang.JsonImpl(),
stringify:null,
parse:null},
defer:function(a){a.stringify=a.JSON.stringify;
a.parse=a.JSON.parse}});


// qx.lang.String
//   - size: 1519 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Array, 1x
//       RegExp, 1x
//       qx, 4x
//   - packages:
//       qx.Bootstrap.firstLow, 1x
//       qx.Bootstrap.firstUp, 1x
//       qx.Class.define, 1x
//       qx.lang.Function.globalEval, 1x
qx.Class.define("qx.lang.String",{statics:{camelCase:function(a){return a.replace(/\-([a-z])/g,function(b,a){return a.toUpperCase()})},
hyphenate:function(a){return a.replace(/[A-Z]/g,function(a){return"-"+a.charAt(0).toLowerCase()})},
capitalize:function(a){return a.replace(/\b[a-z]/g,function(a){return a.toUpperCase()})},
clean:function(a){return this.trim(a.replace(/\s+/g," "))},
trimLeft:function(a){return a.trimLeft?a.trimLeft():a.replace(/^\s+/,"")},
trimRight:function(a){return a.trimRight?a.trimRight():a.replace(/\s+$/,"")},
trim:function(a){return a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")},
startsWith:function(a,b){return a.indexOf(b)===0},
endsWith:function(a,b){return a.substring(a.length-b.length,a.length)===b},
repeat:function(a,b){return a.length>0?new Array(b+1).join(a):""},
pad:function(a,d,b){var c=d-a.length;
if(c>0){typeof b==="undefined"&&(b="0");
return this.repeat(b,c)+a}return a},
firstUp:qx.Bootstrap.firstUp,
firstLow:qx.Bootstrap.firstLow,
contains:function(a,b){return a.indexOf(b)!=-1},
format:function(d,c){for(var b=d,a=0;
a<c.length;
a++)b=b.replace(new RegExp("%"+(a+1),"g"),c[a]+"");
return b},
escapeRegexpChars:function(a){return a.replace(/([.*+?^${}()|[\]\/\\])/g,"\\$1")},
toArray:function(a){return a.split(/\B|\b/g)},
stripTags:function(a){return a.replace(/<\/?[^>]+>/gi,"")},
stripScripts:function(c,b){var a="",d=c.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi,function(){a+=arguments[1]+"\n";
return""});
b===true&&qx.lang.Function.globalEval(a);
return d}}});


// qx.dev.StackTrace
//   - size: 1140 bytes
//   - modified: 2010-08-29T12:24:44
//   - names:
//       Error, 1x
//       Math, 1x
//       qx, 6x
//   - packages:
//       Math.min, 1x
//       qx.Class.define, 1x
//       qx.Class.getByName, 1x
//       qx.core.ObjectRegistry.toHashCode, 1x
//       qx.lang.Array.removeAt, 1x
//       qx.lang.Function.getCaller, 1x
//       qx.lang.Function.getName, 1x
qx.Class.define("qx.dev.StackTrace",{statics:{getStackTrace:function(){try{throw new Error()}catch(n){var a=this.getStackTraceFromError(n),c,j,b,i,e,l,k,o,f,g,m,h,d;
qx.lang.Array.removeAt(a,0);
c=this.getStackTraceFromCaller(arguments),j=c.length>a.length?c:a,b=0;
for(;
b<Math.min(c.length,a.length);
b++){i=c[b];
if(i.indexOf("anonymous")>=0)continue;
e=i.split(":");
if(e.length!=2)continue;
l=e[0],k=e[1],o=a[b],f=o.split(":"),g=f[0],m=f[1];
if(qx.Class.getByName(g))h=g;
else h=l;
d=h+":";
k&&(d+=k+":");
d+=m;
j[b]=d}return j}},
getStackTraceFromCaller:function(e){var b=[],a=qx.lang.Function.getCaller(e),d={},f,c;
while(a){f=qx.lang.Function.getName(a);
b.push(f);
try{a=a.caller}catch(g){break}if(!a)break;
c=qx.core.ObjectRegistry.toHashCode(a);
if(d[c]){b.push("...");
break}d[c]=a}return b},
getStackTraceFromError:function(b){if(!b.stack)return[];
var f=/@(.+):(\d+)$/gm,a,c=[],e,d,g;
while((a=f.exec(b.stack))!=null){e=a[1],d=a[2],g=this.__bMVLSw(e);
c.push(g+":"+d)}return c},
__bMVLSw:function(a){var b="/source/class/",c=a.indexOf(b),d=c==-1?a:a.substring(c+b.length).replace(/\//g,".").replace(/\.js$/,"");
return d}}});


// qx.core.AssertionError
//   - size: 248 bytes
//   - modified: 2010-08-30T22:23:15
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.dev.StackTrace.getStackTrace, 1x
//       qx.type.BaseError, 1x
//       qx.type.BaseError.call, 1x
qx.Class.define("qx.core.AssertionError",{extend:qx.type.BaseError,
construct:function(b,a){qx.type.BaseError.call(this,b,a);
this.__mSOCg=qx.dev.StackTrace.getStackTrace()},
members:{__mSOCg:null,
getStackTrace:function(){return this.__mSOCg}}});


// qx.bom.element.Clip
//   - size: 1482 bytes
//   - modified: 2010-10-15T14:15:30
//   - names:
//       Error, 1x
//       RegExp, 1x
//       parseInt, 4x
//       qx, 8x
//   - packages:
//       RegExp.$1.split, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Engine.MSHTML, 1x
//       qx.bom.element.Style.get, 1x
//       qx.lang.String.trim, 5x
qx.Class.define("qx.bom.element.Clip",{statics:{compile:function(c){if(!c)return"clip:auto;";
var a=c.left,b=c.top,e=c.width,d=c.height,g,f;
a==null?(g=e==null?"auto":e+"px",a="auto"):(g=e==null?"auto":a+e+"px",a=a+"px");
b==null?(f=d==null?"auto":d+"px",b="auto"):(f=d==null?"auto":b+d+"px",b=b+"px");
return"clip:rect("+b+","+g+","+f+","+a+");"},
get:function(j,i){var e=qx.bom.element.Style.get(j,"clip",i,false),c,d,h,g,b,a,f;
if(typeof e==="string"&&e!=="auto"&&e!==""){e=qx.lang.String.trim(e);
if(/\((.*)\)/.test(e)){f=RegExp.$1.split(",");
d=qx.lang.String.trim(f[0]);
b=qx.lang.String.trim(f[1]);
a=qx.lang.String.trim(f[2]);
c=qx.lang.String.trim(f[3]);
c==="auto"&&(c=null);
d==="auto"&&(d=null);
b==="auto"&&(b=null);
a==="auto"&&(a=null);
d!=null&&(d=parseInt(d,10));
b!=null&&(b=parseInt(b,10));
a!=null&&(a=parseInt(a,10));
c!=null&&(c=parseInt(c,10));
b!=null&&c!=null?h=b-c:b!=null&&(h=b);
a!=null&&d!=null?g=a-d:a!=null&&(g=a)}else throw new Error("Could not parse clip string: "+e)}return{left:c||null,
top:d||null,
width:h||null,
height:g||null}},
set:function(h,c){if(!c){h.style.clip="rect(auto,auto,auto,auto)";
return}var a=c.left,b=c.top,e=c.width,d=c.height,g,f;
a==null?(g=e==null?"auto":e+"px",a="auto"):(g=e==null?"auto":a+e+"px",a=a+"px");
b==null?(f=d==null?"auto":d+"px",b="auto"):(f=d==null?"auto":b+d+"px",b=b+"px");
h.style.clip="rect("+b+","+g+","+f+","+a+")"},
reset:function(a){a.style.clip=qx.bom.client.Engine.MSHTML?"rect(auto)":"auto"}}});


// qx.bom.element.Style
//   - size: 3403 bytes
//   - modified: 2010-11-02T15:55:23
//   - names:
//       Error, 1x
//       document, 2x
//       qx, 38x
//       undefined, 3x
//   - packages:
//       document.documentElement.style, 2x
//       qx.Class.define, 1x
//       qx.bom.element.BoxSizing, 1x
//       qx.bom.element.Clip, 1x
//       qx.bom.element.Cursor, 1x
//       qx.bom.element.Opacity, 1x
//       qx.bom.element.Overflow, 8x
//       qx.bom.element.Overflow.compileX, 1x
//       qx.bom.element.Overflow.compileY, 1x
//       qx.bom.element.Overflow.getX, 1x
//       qx.bom.element.Overflow.getY, 1x
//       qx.bom.element.Overflow.resetX, 1x
//       qx.bom.element.Overflow.resetY, 1x
//       qx.bom.element.Overflow.setX, 1x
//       qx.bom.element.Overflow.setY, 1x
//       qx.core.Assert.assertBoolean, 2x
//       qx.core.Assert.assertElement, 2x
//       qx.core.Assert.assertMap, 1x
//       qx.core.Assert.assertString, 1x
//       qx.dom.Node.getDocument, 1x
//       qx.lang.Function.bind, 8x
//       qx.lang.String.firstUp, 1x
//       qx.lang.String.hyphenate, 1x
qx.Class.define("qx.bom.element.Style",{statics:{__cnanzb:function(){for(var i=["appearance","userSelect","textOverflow","borderImage","transition","transform"],c={},h=document.documentElement.style,f=["Moz","Webkit","Khtml","O","Ms"],e=0,k=i.length,a,b,d,j,g;
e<k;
e++){a=i[e],b=a;
if(h[a]){c[b]=a;
continue}a=qx.lang.String.firstUp(a);
for(d=0,j=f.length;
d<j;
d++){g=f[d]+a;
if(typeof h[g]=="string"){c[b]=g;
break}}}this.__KhlJ2=c;
this.__KhlJ2["userModify"]="MozUserModify";
this.__yFaAO={};
for(b in c)this.__yFaAO[b]=this.__EHYhZ(c[b]);
this.__KhlJ2["float"]="cssFloat"},
__Qi3eI:{width:"pixelWidth",
height:"pixelHeight",
left:"pixelLeft",
right:"pixelRight",
top:"pixelTop",
bottom:"pixelBottom"},
__uEji8:{clip:qx.bom.element.Clip,
cursor:qx.bom.element.Cursor,
opacity:qx.bom.element.Opacity,
boxSizing:qx.bom.element.BoxSizing,
overflowX:{set:qx.lang.Function.bind(qx.bom.element.Overflow.setX,qx.bom.element.Overflow),
get:qx.lang.Function.bind(qx.bom.element.Overflow.getX,qx.bom.element.Overflow),
reset:qx.lang.Function.bind(qx.bom.element.Overflow.resetX,qx.bom.element.Overflow),
compile:qx.lang.Function.bind(qx.bom.element.Overflow.compileX,qx.bom.element.Overflow)},
overflowY:{set:qx.lang.Function.bind(qx.bom.element.Overflow.setY,qx.bom.element.Overflow),
get:qx.lang.Function.bind(qx.bom.element.Overflow.getY,qx.bom.element.Overflow),
reset:qx.lang.Function.bind(qx.bom.element.Overflow.resetY,qx.bom.element.Overflow),
compile:qx.lang.Function.bind(qx.bom.element.Overflow.compileY,qx.bom.element.Overflow)}},
compile:function(e){var c=[],d=this.__uEji8,f=this.__yFaAO,a,b;
for(a in e){b=e[a];
if(b==null)continue;
a=f[a]||a;
d[a]?c.push(d[a].compile(b)):c.push(this.__EHYhZ(a),":",b,";")}return c.join("")},
__uYnSY:{},
__EHYhZ:function(b){var c=this.__uYnSY,a=c[b];
a||(a=c[b]=qx.lang.String.hyphenate(b));
return a},
setCss:function(a,b){a.setAttribute("style",b)},
getCss:function(a){return a.getAttribute("style")},
isPropertySupported:function(a){return this.__uEji8[a]||this.__KhlJ2[a]||a in document.documentElement.style},
COMPUTED_MODE:1,
CASCADED_MODE:2,
LOCAL_MODE:3,
set:function(b,a,d,c){qx.core.Assert.assertElement(b,"Invalid argument 'element'"),qx.core.Assert.assertString(a,"Invalid argument 'name'"),c!==undefined&&qx.core.Assert.assertBoolean(c,"Invalid argument 'smart'");
a=this.__KhlJ2[a]||a;
if(c!==false&&this.__uEji8[a])return this.__uEji8[a].set(b,d);
b.style[a]=d!==null?d:""},
setStyles:function(e,g,b){qx.core.Assert.assertElement(e,"Invalid argument 'element'"),qx.core.Assert.assertMap(g,"Invalid argument 'styles'"),b!==undefined&&qx.core.Assert.assertBoolean(b,"Invalid argument 'smart'");
var i=this.__KhlJ2,d=this.__uEji8,h=e.style,c,f,a;
for(c in g){f=g[c],a=i[c]||c;
f===undefined?b!==false&&d[a]?d[a].reset(e):h[a]="":b!==false&&d[a]?d[a].set(e,f):h[a]=f!==null?f:""}},
reset:function(b,a,c){a=this.__KhlJ2[a]||a;
if(c!==false&&this.__uEji8[a])return this.__uEji8[a].reset(b);
b.style[a]=""},
get:function(b,a,c,e){a=this.__KhlJ2[a]||a;
if(e!==false&&this.__uEji8[a])return this.__uEji8[a].get(b,c);
switch(c){case this.LOCAL_MODE:return b.style[a]||"";
case this.CASCADED_MODE:if(b.currentStyle)return b.currentStyle[a]||"";
throw new Error("Cascaded styles are not supported in this browser!");
default:var f=qx.dom.Node.getDocument(b),d=f.defaultView.getComputedStyle(b,null);
return d?d[a]:""}}},
defer:function(a){a.__cnanzb()}});


// qx.bom.element.BoxSizing
//   - size: 749 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Style.get, 1x
qx.Class.define("qx.bom.element.BoxSizing",{statics:{__bkeUqL:["MozBoxSizing"],
__3tKx7:["-moz-box-sizing"],
__bhqzo1:{tags:{button:true,
select:true},
types:{search:true,
button:true,
submit:true,
reset:true,
checkbox:true,
radio:true}},
__bRvhj7:function(a){var b=this.__bhqzo1;
return b.tags[a.tagName.toLowerCase()]||b.types[a.type]},
compile:function(d){var a=this.__3tKx7,c="",b,e;
if(a)for(b=0,e=a.length;
b<e;
b++)c+=a[b]+":"+d+";";
return c},
get:function(d){var b=this.__bkeUqL,a,c,e;
if(b)for(c=0,e=b.length;
c<e;
c++){a=qx.bom.element.Style.get(d,b[c],null,false);
if(a!=null&&a!=="")return a}return""},
set:function(c,d){var a=this.__bkeUqL,b,e;
if(a)for(b=0,e=a.length;
b<e;
b++)c.style[a[b]]=d},
reset:function(a){this.set(a,"")}}});


// qx.xml.Document
//   - size: 413 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       DOMParser, 1x
//       document, 1x
//       qx, 1x
//   - packages:
//       document.implementation.createDocument, 1x
//       qx.Class.define, 1x
qx.Class.define("qx.xml.Document",{statics:{DOMDOC:null,
XMLHTTP:null,
isXmlDocument:function(a){return a.nodeType===9?a.documentElement.nodeName!=="HTML":a.ownerDocument?this.isXmlDocument(a.ownerDocument):false},
create:function(b,a){return document.implementation.createDocument(b||"",a||"",null)},
fromString:function(a){var b=new DOMParser();
return b.parseFromString(a,"text/xml")}},
defer:function(a){}});


// qx.util.DisposeUtil
//   - size: 1120 bytes
//   - modified: 2010-08-29T12:27:35
//   - names:
//       Error, 4x
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.ObjectRegistry.inShutDown, 3x
qx.Class.define("qx.util.DisposeUtil",{statics:{disposeObjects:function(b,d,f){for(var a,c=0,e=d.length;
c<e;
c++){a=d[c];
if(b[a]==null||!b.hasOwnProperty(a))continue;
if(!qx.core.ObjectRegistry.inShutDown){if(b[a].dispose){if(!f&&b[a].constructor.$$instance)throw new Error("The object stored in key "+a+" is a singleton! Please use disposeSingleton instead.");
b[a].dispose()}else throw new Error("Has no disposable object under key: "+a+"!")}b[a]=null}},
disposeArray:function(b,c){var a=b[c],d,e;
if(!a)return;
if(qx.core.ObjectRegistry.inShutDown){b[c]=null;
return}try{e=a.length-1;
for(;
e>=0;
e--)d=a[e],d&&d.dispose()}catch(f){throw new Error("The array field: "+c+" of object: "+b+" has non disposable entries: "+f)}a.length=0;
b[c]=null},
disposeMap:function(b,c){var a=b[c],d;
if(!a)return;
if(qx.core.ObjectRegistry.inShutDown){b[c]=null;
return}try{for(d in a)a.hasOwnProperty(d)&&a[d].dispose()}catch(e){throw new Error("The map field: "+c+" of object: "+b+" has non disposable entries: "+e)}b[c]=null},
disposeTriggeredBy:function(c,a){var b=a.dispose;
a.dispose=function(){b.call(a);
c.dispose()}}}});


// qx.log.appender.RingBuffer
//   - size: 440 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.lang.RingBuffer, 1x
qx.Class.define("qx.log.appender.RingBuffer",{extend:qx.lang.RingBuffer,
construct:function(a){this.setMaxMessages(a||50)},
members:{setMaxMessages:function(a){this.setMaxEntries(a)},
getMaxMessages:function(){return this.getMaxEntries()},
process:function(a){this.addEntry(a)},
getAllLogEvents:function(){return this.getAllEntries()},
retrieveLogEvents:function(b,a){return this.getEntries(b,a)},
clearHistory:function(){this.clear()}}});


// qx.bom.Event
//   - size: 1038 bytes
//   - modified: 2010-10-06T12:19:56
//   - names:
//       document, 3x
//       qx, 3x
//   - packages:
//       document.createEvent, 1x
//       document.createEventObject, 2x
//       qx.Class.define, 1x
//       qx.bom.client.Engine.VERSION, 2x
qx.Class.define("qx.bom.Event",{statics:{addNativeListener:function(a,b,c){a.addEventListener(b,c,false)},
removeNativeListener:function(a,b,c){a.removeEventListener(b,c,false)},
getTarget:function(a){return a.target||a.srcElement},
getRelatedTarget:function(a){try{a.relatedTarget&&a.relatedTarget.nodeType}catch(a){return null}return a.relatedTarget},
preventDefault:function(a){if(qx.bom.client.Engine.VERSION>=1.9&&a.type=="mousedown"&&a.button==2)return;
a.preventDefault();
if(qx.bom.client.Engine.VERSION<1.9)try{a.keyCode=0}catch(b){}},
stopPropagation:function(a){a.stopPropagation&&a.stopPropagation();
a.cancelBubble=true},
fire:function(b,c){if(document.createEventObject){var a=document.createEventObject();
return b.fireEvent("on"+c,a)}a=document.createEvent("HTMLEvents");
a.initEvent(c,true,true);
return!b.dispatchEvent(a)},
supportsEvent:function(a,d){var c="on"+d,b=(c in a);
b||(b=typeof a[c]=="function",!b&&a.setAttribute&&(a.setAttribute(c,"return;"),b=typeof a[c]=="function",a.removeAttribute(c)));
return b}}});


// qx.core.MAssert
//   - size: 2747 bytes
//   - modified: 2010-11-02T15:56:49
//   - names:
//       qx, 41x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.core.Assert.assert, 1x
//       qx.core.Assert.assertArgumentsCount, 1x
//       qx.core.Assert.assertArray, 1x
//       qx.core.Assert.assertArrayEquals, 1x
//       qx.core.Assert.assertBoolean, 1x
//       qx.core.Assert.assertCssColor, 1x
//       qx.core.Assert.assertElement, 1x
//       qx.core.Assert.assertEquals, 1x
//       qx.core.Assert.assertEventFired, 1x
//       qx.core.Assert.assertEventNotFired, 1x
//       qx.core.Assert.assertException, 1x
//       qx.core.Assert.assertFalse, 1x
//       qx.core.Assert.assertFunction, 1x
//       qx.core.Assert.assertIdentical, 1x
//       qx.core.Assert.assertInArray, 1x
//       qx.core.Assert.assertInRange, 1x
//       qx.core.Assert.assertInstance, 1x
//       qx.core.Assert.assertInteger, 1x
//       qx.core.Assert.assertInterface, 1x
//       qx.core.Assert.assertJsonEquals, 1x
//       qx.core.Assert.assertKeyInMap, 1x
//       qx.core.Assert.assertMap, 1x
//       qx.core.Assert.assertMatch, 1x
//       qx.core.Assert.assertNotEquals, 1x
//       qx.core.Assert.assertNotIdentical, 1x
//       qx.core.Assert.assertNotNull, 1x
//       qx.core.Assert.assertNotUndefined, 1x
//       qx.core.Assert.assertNull, 1x
//       qx.core.Assert.assertNumber, 1x
//       qx.core.Assert.assertObject, 1x
//       qx.core.Assert.assertPositiveInteger, 1x
//       qx.core.Assert.assertPositiveNumber, 1x
//       qx.core.Assert.assertQxObject, 1x
//       qx.core.Assert.assertQxWidget, 1x
//       qx.core.Assert.assertRegExp, 1x
//       qx.core.Assert.assertString, 1x
//       qx.core.Assert.assertTrue, 1x
//       qx.core.Assert.assertType, 1x
//       qx.core.Assert.assertUndefined, 1x
//       qx.core.Assert.fail, 1x
qx.Mixin.define("qx.core.MAssert",{members:{assert:function(a,b){qx.core.Assert.assert(a,b)},
fail:function(a){qx.core.Assert.fail(a)},
assertTrue:function(a,b){qx.core.Assert.assertTrue(a,b)},
assertFalse:function(a,b){qx.core.Assert.assertFalse(a,b)},
assertEquals:function(c,b,a){qx.core.Assert.assertEquals(c,b,a)},
assertNotEquals:function(c,b,a){qx.core.Assert.assertNotEquals(c,b,a)},
assertIdentical:function(c,b,a){qx.core.Assert.assertIdentical(c,b,a)},
assertNotIdentical:function(c,b,a){qx.core.Assert.assertNotIdentical(c,b,a)},
assertNotUndefined:function(a,b){qx.core.Assert.assertNotUndefined(a,b)},
assertUndefined:function(a,b){qx.core.Assert.assertUndefined(a,b)},
assertNotNull:function(a,b){qx.core.Assert.assertNotNull(a,b)},
assertNull:function(a,b){qx.core.Assert.assertNull(a,b)},
assertJsonEquals:function(c,b,a){qx.core.Assert.assertJsonEquals(c,b,a)},
assertMatch:function(a,b,c){qx.core.Assert.assertMatch(a,b,c)},
assertArgumentsCount:function(b,c,a,d){qx.core.Assert.assertArgumentsCount(b,c,a,d)},
assertEventFired:function(c,b,e,d,a){qx.core.Assert.assertEventFired(c,b,e,d,a)},
assertEventNotFired:function(b,a,d,c){qx.core.Assert.assertEventNotFired(b,a,d,c)},
assertException:function(c,b,a,d){qx.core.Assert.assertException(c,b,a,d)},
assertInArray:function(a,b,c){qx.core.Assert.assertInArray(a,b,c)},
assertArrayEquals:function(c,b,a){qx.core.Assert.assertArrayEquals(c,b,a)},
assertKeyInMap:function(a,b,c){qx.core.Assert.assertKeyInMap(a,b,c)},
assertFunction:function(a,b){qx.core.Assert.assertFunction(a,b)},
assertString:function(a,b){qx.core.Assert.assertString(a,b)},
assertBoolean:function(a,b){qx.core.Assert.assertBoolean(a,b)},
assertNumber:function(a,b){qx.core.Assert.assertNumber(a,b)},
assertPositiveNumber:function(a,b){qx.core.Assert.assertPositiveNumber(a,b)},
assertInteger:function(a,b){qx.core.Assert.assertInteger(a,b)},
assertPositiveInteger:function(a,b){qx.core.Assert.assertPositiveInteger(a,b)},
assertInRange:function(b,a,c,d){qx.core.Assert.assertInRange(b,a,c,d)},
assertObject:function(a,b){qx.core.Assert.assertObject(a,b)},
assertArray:function(a,b){qx.core.Assert.assertArray(a,b)},
assertMap:function(a,b){qx.core.Assert.assertMap(a,b)},
assertRegExp:function(a,b){qx.core.Assert.assertRegExp(a,b)},
assertType:function(a,b,c){qx.core.Assert.assertType(a,b,c)},
assertInstance:function(b,a,c){qx.core.Assert.assertInstance(b,a,c)},
assertInterface:function(a,b,c){qx.core.Assert.assertInterface(a,b,c)},
assertCssColor:function(c,a,b){qx.core.Assert.assertCssColor(c,a,b)},
assertElement:function(a,b){qx.core.Assert.assertElement(a,b)},
assertQxObject:function(a,b){qx.core.Assert.assertQxObject(a,b)},
assertQxWidget:function(a,b){qx.core.Assert.assertQxWidget(a,b)}}});


// qx.lang.Object
//   - size: 2619 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       Error, 1x
//       qx, 36x
//   - packages:
//       qx.Bootstrap.getKeys, 1x
//       qx.Bootstrap.getKeysAsString, 1x
//       qx.Bootstrap.objectGetLength, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Feature.ECMA_OBJECT_COUNT, 2x
//       qx.core.Assert, 15x
//       qx.core.Assert.assertArray, 1x
//       qx.core.Assert.assertInteger, 2x
//       qx.core.Assert.assertMap, 12x
qx.Class.define("qx.lang.Object",{statics:{empty:function(a){qx.core.Assert&&qx.core.Assert.assertMap(a,"Invalid argument 'map'");
for(var b in a)a.hasOwnProperty(b)&&delete a[b]},
isEmpty:qx.bom.client.Feature.ECMA_OBJECT_COUNT?function(a){qx.core.Assert&&qx.core.Assert.assertMap(a,"Invalid argument 'map'");
return a.__count__===0}:function(a){qx.core.Assert&&qx.core.Assert.assertMap(a,"Invalid argument 'map'");
for(var b in a)return false;
return true},
hasMinLength:qx.bom.client.Feature.ECMA_OBJECT_COUNT?function(b,a){qx.core.Assert&&qx.core.Assert.assertMap(b,"Invalid argument 'map'"),qx.core.Assert&&qx.core.Assert.assertInteger(a,"Invalid argument 'minLength'");
return b.__count__>=a}:function(b,a){qx.core.Assert&&qx.core.Assert.assertMap(b,"Invalid argument 'map'"),qx.core.Assert&&qx.core.Assert.assertInteger(a,"Invalid argument 'minLength'");
if(a<=0)return true;
var d=0,c;
for(c in b)if(++d>=a)return true;
return false},
getLength:qx.Bootstrap.objectGetLength,
getKeys:qx.Bootstrap.getKeys,
getKeysAsString:qx.Bootstrap.getKeysAsString,
findWinnerKey:function(c,b,a){if(!(b in c))return a in c?a:null;
if(!(a in c))return b in c?b:null;
for(var d in c){if(d==b)return b;
if(d==a)return a}return null},
getValues:function(b){qx.core.Assert&&qx.core.Assert.assertMap(b,"Invalid argument 'map'");
for(var c=[],d=this.getKeys(b),a=0,e=d.length;
a<e;
a++)c.push(b[d[a]]);
return c},
merge:function(c,f){qx.core.Assert&&qx.core.Assert.assertMap(c,"Invalid argument 'target'");
for(var e=arguments.length,d,b,a=1;
a<e;
a++){d=arguments[a];
for(b in d)c[b]=d[b]}return c},
clone:function(b){qx.core.Assert&&qx.core.Assert.assertMap(b,"Invalid argument 'source'");
var c={},a;
for(a in b)c[a]=b[a];
return c},
invert:function(b){qx.core.Assert&&qx.core.Assert.assertMap(b,"Invalid argument 'map'");
var c={},a;
for(a in b)c[b[a].toString()]=a;
return c},
getKeyFromValue:function(b,c){qx.core.Assert&&qx.core.Assert.assertMap(b,"Invalid argument 'map'");
for(var a in b)if(b.hasOwnProperty(a)&&b[a]===c)return a;
return null},
contains:function(a,b){qx.core.Assert&&qx.core.Assert.assertMap(a,"Invalid argument 'map'");
return this.getKeyFromValue(a,b)!==null},
select:function(b,a){qx.core.Assert&&qx.core.Assert.assertMap(a,"Invalid argument 'map'");
return a[b]},
fromArray:function(b){qx.core.Assert&&qx.core.Assert.assertArray(b,"Invalid argument 'array'");
for(var c={},a=0,d=b.length;
a<d;
a++){switch(typeof b[a]){case"object":case"function":case"undefined":throw new Error("Could not convert complex objects like "+b[a]+" at array index "+a+" to map syntax")}c[b[a].toString()]=true}return c}}});


// qx.dom.Hierarchy
//   - size: 1862 bytes
//   - modified: 2010-09-30T14:19:27
//   - names:
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Selector, 1x
//       qx.dom.Node.ELEMENT, 3x
//       qx.lang.Array.fromCollection, 1x
qx.Class.define("qx.dom.Hierarchy",{statics:{getNodeIndex:function(a){var b=0;
while(a&&(a=a.previousSibling))b++;
return b},
getElementIndex:function(a){var b=0,c=qx.dom.Node.ELEMENT;
while(a&&(a=a.previousSibling))a.nodeType==c&&b++;
return b},
getNextElementSibling:function(a){var b=qx.dom.Node.ELEMENT;
while(a&&(a=a.nextSibling)&&a.nodeType!=b)continue;
return a||null},
getPreviousElementSibling:function(a){var b=qx.dom.Node.ELEMENT;
while(a&&(a=a.previousSibling)&&a.nodeType!=b)continue;
return a||null},
contains:function(a,b){return!!(a.compareDocumentPosition(b)&16)},
isDescendantOf:function(a,b){return this.contains(b,a)},
isRendered:function(a){if(!a.parentNode||!a.offsetParent)return false;
var b=a.ownerDocument||a.document;
return this.contains(b.body,a)},
closest:function(a,b){var c=qx.bom.Selector;
while(a&&a.ownerDocument){if(c.matches(b,[a]).length>0)return a;
a=a.parentNode}},
getCommonParent:function(a,b){if(a===b)return a;
while(a&&a.nodeType==1){if(this.contains(a,b))return a;
a=a.parentNode}return null},
getAncestors:function(a){return this.__bKqGiY(a,"parentNode")},
getChildElements:function(a){a=a.firstChild;
if(!a)return[];
var b=this.getNextSiblings(a);
a.nodeType===1&&b.unshift(a);
return b},
getDescendants:function(a){return qx.lang.Array.fromCollection(a.getElementsByTagName("*"))},
getFirstDescendant:function(a){a=a.firstChild;
while(a&&a.nodeType!=1)a=a.nextSibling;
return a},
getLastDescendant:function(a){a=a.lastChild;
while(a&&a.nodeType!=1)a=a.previousSibling;
return a},
getPreviousSiblings:function(a){return this.__bKqGiY(a,"previousSibling")},
getNextSiblings:function(a){return this.__bKqGiY(a,"nextSibling")},
__bKqGiY:function(a,c){var b=[];
while(a=a[c])a.nodeType==1&&b.push(a);
return b},
getSiblings:function(a){return this.getPreviousSiblings(a).reverse().concat(this.getNextSiblings(a))}}});


// qx.core.Object
//   - size: 4427 bytes
//   - modified: 2010-11-02T15:57:03
//   - names:
//       Array, 1x
//       Error, 5x
//       Object, 1x
//       qx, 35x
//       undefined, 2x
//   - packages:
//       Array.prototype.slice.call, 1x
//       qx.Bootstrap, 3x
//       qx.Bootstrap.debug, 1x
//       qx.Bootstrap.firstUp, 1x
//       qx.Bootstrap.isFunction, 1x
//       qx.Bootstrap.warn, 1x
//       qx.Class.define, 1x
//       qx.Class.include, 1x
//       qx.core.MAssert, 1x
//       qx.core.ObjectRegistry.inShutDown, 1x
//       qx.core.ObjectRegistry.register, 1x
//       qx.core.ObjectRegistry.unregister, 1x
//       qx.core.Setting.define, 1x
//       qx.core.Setting.get, 2x
//       qx.event.Registration.addListener, 1x
//       qx.event.Registration.deleteAllListeners, 1x
//       qx.event.Registration.dispatchEvent, 1x
//       qx.event.Registration.fireEvent, 1x
//       qx.event.Registration.fireNonBubblingEvent, 2x
//       qx.event.Registration.hasListener, 1x
//       qx.event.Registration.removeAllListeners, 1x
//       qx.event.Registration.removeListener, 1x
//       qx.event.Registration.removeListenerById, 1x
//       qx.event.type.Data, 1x
//       qx.lang.Array.fromArguments, 1x
//       qx.log.Logger, 2x
//       qx.log.Logger.trace, 1x
//       qx.util.DisposeUtil.disposeArray, 1x
//       qx.util.DisposeUtil.disposeMap, 1x
//       qx.util.DisposeUtil.disposeObjects, 2x
qx.Class.define("qx.core.Object",{extend:Object,
construct:function(){qx.core.ObjectRegistry.register(this)},
statics:{$$type:"Object"},
members:{toHashCode:function(){return this.$$hash},
toString:function(){return this.classname+"["+this.$$hash+"]"},
base:function(a,b){if(!qx.Bootstrap.isFunction(a.callee.base))throw new Error("Cannot call super class. Method is not derived: "+a.callee.displayName);
return arguments.length===1?a.callee.base.call(this):a.callee.base.apply(this,Array.prototype.slice.call(arguments,1))},
self:function(a){return a.callee.self},
set:function(b,f){var e=qx.Bootstrap,a,d=this,c;
if(typeof b==="string"){a="set"+(e.$$firstUp[b]||e.firstUp(b));
if(!d[a])throw new Error(this.toString()+" Could not find generic setter for: "+b);
return d[a](f)}for(c in b){a="set"+(e.$$firstUp[c]||e.firstUp(c));
if(!d[a])throw new Error(this.toString()+" Could not find generic setter for: "+c);
d[a](b[c])}return d},
reset:function(a){var c=qx.Bootstrap,b="reset"+(c.$$firstUp[a]||c.firstUp(a));
if(!this[b])throw new Error(this.toString()+" Could not find generic resetter for: "+a);
return this[b]()},
get:function(a){var c=qx.Bootstrap,b="get"+(c.$$firstUp[a]||qx.Bootstrap.firstUp(a));
if(!this[b])throw new Error(this.toString()+" Could not find generic getter for: "+a);
return this[b]()},
addListener:function(a,d,b,c){if(!this.$$disposed)return qx.event.Registration.addListener(this,a,d,b,c);
return null},
addListenerOnce:function(b,e,d,c){var a=function(f){e.call(d||this,f);
this.removeListener(b,a,this,c)};
return this.addListener(b,a,this,c)},
removeListener:function(a,d,b,c){if(!this.$$disposed)return qx.event.Registration.removeListener(this,a,d,b,c);
return false},
removeListenerById:function(a){if(!this.$$disposed)return qx.event.Registration.removeListenerById(this,a);
return false},
hasListener:function(a,b){return qx.event.Registration.hasListener(this,a,b)},
dispatchEvent:function(a){if(!this.$$disposed)return qx.event.Registration.dispatchEvent(this,a);
return true},
fireEvent:function(b,a,c){if(!this.$$disposed)return qx.event.Registration.fireEvent(this,b,a,c);
return true},
fireNonBubblingEvent:function(b,a,c){if(!this.$$disposed)return qx.event.Registration.fireNonBubblingEvent(this,b,a,c);
return true},
fireDataEvent:function(d,c,a,b){if(!this.$$disposed){a===undefined&&(a=null);
return qx.event.Registration.fireNonBubblingEvent(this,d,qx.event.type.Data,[c,a,!!b])}return true},
__y6FtY:null,
setUserData:function(b,a){this.__y6FtY||(this.__y6FtY={});
this.__y6FtY[b]=a},
getUserData:function(b){var a=this.__y6FtY&&this.__y6FtY[b];
return a===undefined?null:a},
debug:function(a){this.__I6tL0("debug",arguments)},
info:function(a){this.__I6tL0("info",arguments)},
warn:function(a){this.__I6tL0("warn",arguments)},
error:function(a){this.__I6tL0("error",arguments)},
trace:function(){qx.log.Logger.trace(this)},
__I6tL0:function(c,b){var a=qx.lang.Array.fromArguments(b);
a.unshift(this);
qx.log.Logger[c].apply(qx.log.Logger,a)},
isDisposed:function(){return this.$$disposed||false},
dispose:function(){if(this.$$disposed)return;
this.$$disposed=true;
this.$$instance=null;
this.$$allowconstruct=null;
qx.core.Setting.get("qx.disposerDebugging")&&qx.Bootstrap.debug(this,"Disposing "+this);
var a=this.constructor,d,e,f,b,c;
while(a.superclass){a.$$destructor&&a.$$destructor.call(this);
if(a.$$includes){d=a.$$flatIncludes;
for(e=0,f=d.length;
e<f;
e++)d[e].$$destructor&&d[e].$$destructor.call(this)}a=a.superclass}this.$$data&&(this.$$data=null);
if(qx.core.Setting.get("qx.disposerDebugging")){for(b in this)this.hasOwnProperty(b)&&(c=this[b],c!=null&&typeof c=="object"&&(qx.Bootstrap.warn(this,"Missing destruct definition for '"+b+"' in "+this.classname+"["+this.toHashCode()+"]: "+c),this[b]=null))}},
_disposeObjects:function(a){qx.util.DisposeUtil.disposeObjects(this,arguments)},
_disposeSingletonObjects:function(a){qx.util.DisposeUtil.disposeObjects(this,arguments,true)},
_disposeArray:function(a){qx.util.DisposeUtil.disposeArray(this,a)},
_disposeMap:function(a){qx.util.DisposeUtil.disposeMap(this,a)}},
defer:function(a,b){qx.core.Setting.define("qx.disposerDebugging",false);
qx.Class.include(a,qx.core.MAssert)},
destruct:function(){qx.core.ObjectRegistry.inShutDown?qx.event.Registration.deleteAllListeners(this):qx.event.Registration.removeAllListeners(this);
qx.core.ObjectRegistry.unregister(this);
this.__y6FtY&&(this.__y6FtY=null)}});


// qx.util.ObjectPool
//   - size: 838 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 2x
//       Infinity, 1x
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
qx.Class.define("qx.util.ObjectPool",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
this.__jKF37={};
a!=null&&this.setSize(a)},
properties:{size:{check:"Integer",
init:Infinity}},
members:{__jKF37:null,
getObject:function(b){if(this.$$disposed)return new b;
if(!b)throw new Error("Class needs to be defined!");
var a=null,c=this.__jKF37[b.classname];
c&&(a=c.pop());
a?a.$$pooled=false:a=new b;
return a},
poolObject:function(a){if(!this.__jKF37)return;
var c=a.classname,b=this.__jKF37[c];
if(a.$$pooled)throw new Error("Object is already pooled: "+a);
b||(this.__jKF37[c]=b=[]);
if(b.length>this.getSize()){a.destroy?a.destroy():a.dispose();
return}a.$$pooled=true;
b.push(a)}},
destruct:function(){var c=this.__jKF37,e,b,a,d;
for(e in c){b=c[e];
for(a=0,d=b.length;
a<d;
a++)b[a].dispose()}delete this.__jKF37}});


// qx.event.Pool
//   - size: 127 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.util.ObjectPool, 1x
qx.Class.define("qx.event.Pool",{extend:qx.util.ObjectPool,
type:"singleton",
construct:function(){this.base(arguments,30)}});


// qx.event.type.Event
//   - size: 2498 bytes
//   - modified: 2010-11-02T16:12:21
//   - names:
//       Date, 1x
//       qx, 5x
//       undefined, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Assert.assertBoolean, 2x
//       qx.core.Object, 1x
//       qx.event.Pool.getInstance, 1x
qx.Class.define("qx.event.type.Event",{extend:qx.core.Object,
statics:{CAPTURING_PHASE:1,
AT_TARGET:2,
BUBBLING_PHASE:3},
members:{init:function(a,b){a!==undefined&&qx.core.Assert.assertBoolean(a,"Invalid argument value 'canBubble'."),b!==undefined&&qx.core.Assert.assertBoolean(b,"Invalid argument value 'cancelable'.");
this._type=null;
this._target=null;
this._currentTarget=null;
this._relatedTarget=null;
this._originalTarget=null;
this._stopPropagation=false;
this._preventDefault=false;
this._bubbles=!!a;
this._cancelable=!!b;
this._timeStamp=new Date().getTime();
this._eventPhase=null;
return this},
clone:function(b){if(b)var a=b;
else a=qx.event.Pool.getInstance().getObject(this.constructor);
a._type=this._type;
a._target=this._target;
a._currentTarget=this._currentTarget;
a._relatedTarget=this._relatedTarget;
a._originalTarget=this._originalTarget;
a._stopPropagation=this._stopPropagation;
a._bubbles=this._bubbles;
a._preventDefault=this._preventDefault;
a._cancelable=this._cancelable;
return a},
stop:function(){this._bubbles&&this.stopPropagation();
this._cancelable&&this.preventDefault()},
stopPropagation:function(){this.assertTrue(this._bubbles,"Cannot stop propagation on a non bubbling event: "+this.getType());
this._stopPropagation=true},
getPropagationStopped:function(){return!!this._stopPropagation},
preventDefault:function(){this.assertTrue(this._cancelable,"Cannot prevent default action on a non cancelable event: "+this.getType());
this._preventDefault=true},
getDefaultPrevented:function(){return!!this._preventDefault},
getType:function(){return this._type},
setType:function(a){this._type=a},
getEventPhase:function(){return this._eventPhase},
setEventPhase:function(a){this._eventPhase=a},
getTimeStamp:function(){return this._timeStamp},
getTarget:function(){return this._target},
setTarget:function(a){this._target=a},
getCurrentTarget:function(){return this._currentTarget||this._target},
setCurrentTarget:function(a){this._currentTarget=a},
getRelatedTarget:function(){return this._relatedTarget},
setRelatedTarget:function(a){this._relatedTarget=a},
getOriginalTarget:function(){return this._originalTarget},
setOriginalTarget:function(a){this._originalTarget=a},
getBubbles:function(){return this._bubbles},
setBubbles:function(a){this._bubbles=a},
isCancelable:function(){return this._cancelable},
setCancelable:function(a){this._cancelable=a}},
destruct:function(){this._target=this._currentTarget=this._relatedTarget=this._originalTarget=null}});


// qx.event.IEventDispatcher
//   - size: 258 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Interface.define, 1x
//       qx.event.type.Event, 2x
qx.Interface.define("qx.event.IEventDispatcher",{members:{canDispatchEvent:function(c,a,b){this.assertInstance(a,qx.event.type.Event);
this.assertString(b)},
dispatchEvent:function(c,a,b){this.assertInstance(a,qx.event.type.Event);
this.assertString(b)}}});


// qx.log.Logger
//   - size: 4595 bytes
//   - modified: 2010-10-06T12:19:56
//   - names:
//       Array, 1x
//       Date, 2x
//       Error, 1x
//       qx, 20x
//       undefined, 1x
//       window, 1x
//   - packages:
//       qx.Bootstrap.$$logs, 1x
//       qx.Bootstrap.LOADSTART, 1x
//       qx.Bootstrap.debug, 1x
//       qx.Bootstrap.error, 1x
//       qx.Bootstrap.info, 1x
//       qx.Bootstrap.trace, 1x
//       qx.Bootstrap.warn, 1x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.dev.StackTrace.getStackTrace, 1x
//       qx.dev.StackTrace.getStackTraceFromError, 1x
//       qx.lang.Function.getName, 3x
//       qx.log.Logger.__log, 5x
//       qx.log.appender.RingBuffer, 1x
qx.Class.define("qx.log.Logger",{statics:{__mNRJP:"debug",
setLevel:function(a){this.__mNRJP=a},
getLevel:function(){return this.__mNRJP},
setTreshold:function(a){this.__qh0cL.setMaxMessages(a)},
getTreshold:function(){return this.__qh0cL.getMaxMessages()},
__y2gHO:{},
__evm88:0,
register:function(a){if(a.$$id)return;
var d=this.__evm88++,c,b,e;
this.__y2gHO[d]=a;
a.$$id=d;
c=this.__qh0cL.getAllLogEvents(),b=0,e=c.length;
for(;
b<e;
b++)a.process(c[b])},
unregister:function(b){var a=b.$$id;
if(a==null)return;
delete this.__y2gHO[a];
delete b.$$id},
debug:function(a,b){qx.log.Logger.__gQ657("debug",arguments)},
info:function(a,b){qx.log.Logger.__gQ657("info",arguments)},
warn:function(a,b){qx.log.Logger.__gQ657("warn",arguments)},
error:function(a,b){qx.log.Logger.__gQ657("error",arguments)},
trace:function(a){qx.log.Logger.__gQ657("info",[a,qx.dev.StackTrace.getStackTrace().join("\n")])},
deprecatedMethodWarning:function(a,c){{var b=qx.lang.Function.getName(a);
this.warn("The method '"+b+"' is deprecated: "+(c||"Please consult the API documentation of this method for alternatives."));
this.trace()}},
deprecatedClassWarning:function(a,c){{var b=a.classname||"unknown";
this.warn("The class '"+b+"' is deprecated: "+(c||"Please consult the API documentation of this class for alternatives."));
this.trace()}},
deprecatedEventWarning:function(a,b,d){{var c=a.self?a.self.classname:"unknown";
this.warn("The event '"+(b||"unknown")+"' from class '"+c+"' is deprecated: "+(d||"Please consult the API documentation of this class for alternatives."));
this.trace()}},
deprecatedMixinWarning:function(a,c){{var b=a?a.name:"unknown";
this.warn("The mixin '"+b+"' is deprecated: "+(c||"Please consult the API documentation of this class for alternatives."));
this.trace()}},
deprecatedConstantWarning:function(a,b,e){if(a.__defineGetter__){var c=this,d=a[b];
a.__defineGetter__(b,function(){c.warn("The constant '"+b+"' is deprecated: "+(e||"Please consult the API documentation for alternatives."));
c.trace();
return d})}},
deprecateMethodOverriding:function(c,d,b,e){{var a=c.constructor;
while(a.classname!==d.classname){if(a.prototype.hasOwnProperty(b)){this.warn("The method '"+qx.lang.Function.getName(c[b])+"' overrides a deprecated method: "+(e||"Please consult the API documentation for alternatives."));
this.trace();
break}a=a.superclass}}},
clear:function(){this.__qh0cL.clearHistory()},
__qh0cL:new qx.log.appender.RingBuffer(50),
__qxoWQ:{debug:0,
info:1,
warn:2,
error:3},
__gQ657:function(j,c){var g=this.__qxoWQ,a,k,i,d,l,f,b,h,e;
if(g[j]<g[this.__mNRJP])return;
a=c.length<2?null:c[0],k=a?1:0,i=[],d=k,l=c.length;
for(;
d<l;
d++)i.push(this.__EyTFX(c[d],true));
f=new Date,b={time:f,
offset:f-qx.Bootstrap.LOADSTART,
level:j,
items:i,
win:window};
a&&(a instanceof qx.core.Object?b.object=a.$$hash:a.$$type&&(b.clazz=a));
this.__qh0cL.process(b);
h=this.__y2gHO;
for(e in h)h[e].process(b)},
__qdknc:function(a){if(a===undefined)return"undefined";
if(a===null)return"null";
if(a.$$type)return"class";
var b=typeof a;
if(b==="function"||b=="string"||b==="number"||b==="boolean")return b;
if(b==="object")return a.nodeType?"node":a.classname?"instance":a instanceof Array?"array":a instanceof Error?"error":a instanceof Date?"date":"map";
if(a.toString)return"stringify";
return"unknown"},
__EyTFX:function(b,i){var e=this.__qdknc(b),a="unknown",k=[],c,g,h,f,d,j;
switch(e){case"null":case"undefined":a=e;
break;
case"string":case"number":case"boolean":case"date":a=b;
break;
case"node":b.nodeType===9?a="document":b.nodeType===3?a="text["+b.nodeValue+"]":b.nodeType===1?(a=b.nodeName.toLowerCase(),b.id&&(a+="#"+b.id)):a="node";
break;
case"function":a=qx.lang.Function.getName(b)||e;
break;
case"instance":a=b.basename+"["+b.$$hash+"]";
break;
case"class":case"stringify":a=b.toString();
break;
case"error":k=qx.dev.StackTrace.getStackTraceFromError(b);
a=b.toString();
break;
case"array":if(i){a=[];
for(c=0,g=b.length;
c<g;
c++){if(a.length>20){a.push("...(+"+(g-c)+")");
break}a.push(this.__EyTFX(b[c],false))}}else a="[...("+b.length+")]";
break;
case"map":if(i){f=[];
for(d in b)f.push(d);
f.sort();
a=[];
for(c=0,g=f.length;
c<g;
c++){if(a.length>20){a.push("...(+"+(g-c)+")");
break}d=f[c];
h=this.__EyTFX(b[d],false);
h.key=d;
a.push(h)}}else{j=0;
for(d in b)j++;
a="{...("+j+")}"};
break}return{type:e,
text:a,
trace:k}}},
defer:function(a){for(var c=qx.Bootstrap.$$logs,b=0;
b<c.length;
b++)a.__gQ657(c[b][0],c[b][1]);
qx.Bootstrap.debug=a.debug;
qx.Bootstrap.info=a.info;
qx.Bootstrap.warn=a.warn;
qx.Bootstrap.error=a.error;
qx.Bootstrap.trace=a.trace}});


// qx.event.Manager
//   - size: 6928 bytes
//   - modified: 2010-11-02T15:59:18
//   - names:
//       Error, 2x
//       Object, 1x
//       qx, 44x
//       undefined, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Event.addNativeListener, 1x
//       qx.bom.Event.removeNativeListener, 1x
//       qx.core.Assert.assertBoolean, 2x
//       qx.core.Assert.assertFunction, 2x
//       qx.core.Assert.assertInstance, 1x
//       qx.core.Assert.assertNotNull, 1x
//       qx.core.Assert.assertNotUndefined, 1x
//       qx.core.Assert.assertObject, 4x
//       qx.core.Assert.assertString, 3x
//       qx.core.ObjectRegistry.toHashCode, 10x
//       qx.event.GlobalError.observeMethod, 1x
//       qx.event.IEventHandler, 1x
//       qx.event.Manager, 1x
//       qx.event.Manager.__lastUnique, 1x
//       qx.event.Pool.getInstance, 2x
//       qx.event.type.Event, 1x
//       qx.lang.Array.removeAt, 2x
//       qx.log.Logger.error, 1x
//       qx.log.Logger.trace, 2x
//       qx.log.Logger.warn, 2x
//       qx.util.DisposeUtil.disposeMap, 2x
qx.Class.define("qx.event.Manager",{extend:Object,
construct:function(a,b){this.__qOaV1=a;
this.__zt2DU=qx.core.ObjectRegistry.toHashCode(a);
this.__W9lJC=b;
if(a.qx!==qx){var c=this;
qx.bom.Event.addNativeListener(a,"unload",qx.event.GlobalError.observeMethod(function(){qx.bom.Event.removeNativeListener(a,"unload",arguments.callee);
c.dispose()}))}this.__EOip2={};
this.__yQayq={};
this.__PRhiv={};
this.__UDqYD={}},
statics:{__JNVvG:0,
getNextUniqueId:function(){return this.__JNVvG+++""}},
members:{__W9lJC:null,
__EOip2:null,
__PRhiv:null,
__ba0ozr:null,
__yQayq:null,
__UDqYD:null,
__qOaV1:null,
__zt2DU:null,
getWindow:function(){return this.__qOaV1},
getWindowId:function(){return this.__zt2DU},
getHandler:function(a){var b=this.__yQayq[a.classname];
if(b)return b;
return this.__yQayq[a.classname]=new a(this)},
getDispatcher:function(a){var b=this.__PRhiv[a.classname];
if(b)return b;
return this.__PRhiv[a.classname]=new a(this,this.__W9lJC)},
getListeners:function(c,d,g){var e=c.$$hash||qx.core.ObjectRegistry.toHashCode(c),a=this.__EOip2[e],f,b;
if(!a)return null;
f=d+(g?"|capture":"|bubble"),b=a[f];
return b?b.concat():null},
serializeListeners:function(i){var l=i.$$hash||qx.core.ObjectRegistry.toHashCode(i),b=this.__EOip2[l],h=[],f,g,j,e,c,a,d,k;
if(b){for(a in b){f=a.indexOf("|");
g=a.substring(0,f);
j=a.charAt(f+1)=="c";
e=b[a];
for(d=0,k=e.length;
d<k;
d++)c=e[d],h.push({self:c.context,
handler:c.handler,
type:g,
capture:j})}}return h},
toggleAttachedEvents:function(b,i){var g=b.$$hash||qx.core.ObjectRegistry.toHashCode(b),c=this.__EOip2[g],e,d,f,h,a;
if(c){for(a in c)e=a.indexOf("|"),d=a.substring(0,e),f=a.charCodeAt(e+1)===99,h=c[a],i?this.__byk4Wh(b,d,f):this.__bSFSeQ(b,d,f)}},
hasListener:function(a,d,g){if(a==null){qx.log.Logger.trace(this);
throw new Error("Invalid object: "+a)}var e=a.$$hash||qx.core.ObjectRegistry.toHashCode(a),b=this.__EOip2[e],f,c;
if(!b)return false;
f=d+(g?"|capture":"|bubble"),c=b[f];
return c&&c.length>0},
importListeners:function(b,f){if(b==null){qx.log.Logger.trace(this);
throw new Error("Invalid object: "+b)}var h=b.$$hash||qx.core.ObjectRegistry.toHashCode(b),d=this.__EOip2[h]={},i=qx.event.Manager,g,a,e,c;
for(g in f){a=f[g],e=a.type+(a.capture?"|capture":"|bubble"),c=d[e];
c||(c=d[e]=[],this.__byk4Wh(b,a.type,a.capture));
c.push({handler:a.listener,
context:a.self,
unique:a.unique||i.__JNVvG+++""})}},
addListener:function(a,c,i,l,e){{var f="Failed to add event listener for type '"+c+"'"+" to the target '"+a.classname+"': ",j,b,g,d,h,k;
qx.core.Assert.assertObject(a,f+"Invalid Target.");
qx.core.Assert.assertString(c,f+"Invalid event type.");
qx.core.Assert.assertFunction(i,f+"Invalid callback function");
e!==undefined&&qx.core.Assert.assertBoolean(e,"Invalid capture flag.")}j=a.$$hash||qx.core.ObjectRegistry.toHashCode(a),b=this.__EOip2[j];
b||(b=this.__EOip2[j]={});
g=c+(e?"|capture":"|bubble"),d=b[g];
d||(d=b[g]=[]);
d.length===0&&this.__byk4Wh(a,c,e);
h=qx.event.Manager.__JNVvG+++"",k={handler:i,
context:l,
unique:h};
d.push(k);
return g+"|"+h},
findHandler:function(a,c){var o=false,p=false,n=false,m=false,b,l,j,i,g,f,k,d,h,q,e;
a.nodeType===1?(o=true,b="DOM_"+a.tagName.toLowerCase()+"_"+c):a.nodeType===9?(m=true,b="DOCUMENT_"+c):a==this.__qOaV1?(p=true,b="WIN_"+c):a.classname?(n=true,b="QX_"+a.classname+"_"+c):b="UNKNOWN_"+a+"_"+c;
l=this.__UDqYD;
if(l[b])return l[b];
j=this.__W9lJC.getHandlers(),i=qx.event.IEventHandler,h=0,q=j.length;
for(;
h<q;
h++){g=j[h];
k=g.SUPPORTED_TYPES;
if(k&&!k[c])continue;
d=g.TARGET_CHECK;
if(d){e=false;
o&&(d&i.TARGET_DOMNODE)!=0?e=true:p&&(d&i.TARGET_WINDOW)!=0?e=true:n&&(d&i.TARGET_OBJECT)!=0?e=true:m&&(d&i.TARGET_DOCUMENT)!=0&&(e=true);
if(!e)continue}f=this.getHandler(j[h]);
if(g.IGNORE_CAN_HANDLE||f.canHandleEvent(a,c)){l[b]=f;
return f}}return null},
__byk4Wh:function(a,b,d){var c=this.findHandler(a,b);
if(c){c.registerEvent(a,b,d);
return}qx.log.Logger.warn(this,"There is no event handler for the event '"+b+"' on target '"+a+"'!")},
removeListener:function(b,c,j,h,e){{var f="Failed to remove event listener for type '"+c+"'"+" from the target '"+b.classname+"': ",m,i,k,a,g,d,l;
qx.core.Assert.assertObject(b,f+"Invalid Target.");
qx.core.Assert.assertString(c,f+"Invalid event type.");
qx.core.Assert.assertFunction(j,f+"Invalid callback function");
h!==undefined&&qx.core.Assert.assertObject(h,"Invalid context for callback.");
e!==undefined&&qx.core.Assert.assertBoolean(e,"Invalid capture falg.")}m=b.$$hash||qx.core.ObjectRegistry.toHashCode(b),i=this.__EOip2[m];
if(!i)return false;
k=c+(e?"|capture":"|bubble"),a=i[k];
if(!a)return false;
d=0,l=a.length;
for(;
d<l;
d++){g=a[d];
if(g.handler===j&&g.context===h){qx.lang.Array.removeAt(a,d);
a.length==0&&this.__bSFSeQ(b,c,e);
return true}}return false},
removeListenerById:function(b,d){{var i="Failed to remove event listener for id '"+d+"'"+" from the target '"+b.classname+"': ",e,g,j,k,n,f,l,a,h,c,m;
qx.core.Assert.assertObject(b,i+"Invalid Target.");
qx.core.Assert.assertString(d,i+"Invalid id type.")}e=d.split("|"),g=e[0],j=e[1].charCodeAt(0)==99,k=e[2],n=b.$$hash||qx.core.ObjectRegistry.toHashCode(b),f=this.__EOip2[n];
if(!f)return false;
l=g+(j?"|capture":"|bubble"),a=f[l];
if(!a)return false;
c=0,m=a.length;
for(;
c<m;
c++){h=a[c];
if(h.unique===k){qx.lang.Array.removeAt(a,c);
a.length==0&&this.__bSFSeQ(b,g,j);
return true}}return false},
removeAllListeners:function(d){var f=d.$$hash||qx.core.ObjectRegistry.toHashCode(d),b=this.__EOip2[f],a,e,g,c;
if(!b)return false;
for(c in b)b[c].length>0&&(a=c.split("|"),e=a[0],g=a[1]==="capture",this.__bSFSeQ(d,e,g));
delete this.__EOip2[f];
return true},
deleteAllListeners:function(a){delete this.__EOip2[a]},
__bSFSeQ:function(a,b,d){var c=this.findHandler(a,b);
if(c){c.unregisterEvent(a,b,d);
return}qx.log.Logger.warn(this,"There is no event handler for the event '"+b+"' on target '"+a+"'!")},
dispatchEvent:function(b,a){{var d="Could not dispatch event '"+a+"' on target '"+b.classname+"': ",c,g,e,h,f,i,j;
qx.core.Assert.assertNotUndefined(b,d+"Invalid event target.");
qx.core.Assert.assertNotNull(b,d+"Invalid event target.");
qx.core.Assert.assertInstance(a,qx.event.type.Event,d+"Invalid event object.")}c=a.getType();
if(!a.getBubbles()&&!this.hasListener(b,c)){qx.event.Pool.getInstance().poolObject(a);
return true}a.getTarget()||a.setTarget(b);
g=this.__W9lJC.getDispatchers(),h=false,f=0,i=g.length;
for(;
f<i;
f++){e=this.getDispatcher(g[f]);
if(e.canDispatchEvent(b,a,c)){e.dispatchEvent(b,a,c);
h=true;
break}}if(!h){qx.log.Logger.error(this,"No dispatcher can handle event of type "+c+" on "+b);
return true}j=a.getDefaultPrevented();
qx.event.Pool.getInstance().poolObject(a);
return!j},
dispose:function(){this.__W9lJC.removeManager(this);
qx.util.DisposeUtil.disposeMap(this,"__handlers");
qx.util.DisposeUtil.disposeMap(this,"__dispatchers");
this.__EOip2=this.__qOaV1=this.__ba0ozr=null;
this.__W9lJC=this.__UDqYD=null}}});


// qx.event.Registration
//   - size: 2918 bytes
//   - modified: 2010-11-02T15:59:26
//   - names:
//       Error, 3x
//       qx, 15x
//       undefined, 5x
//       window, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Assert.assertInterface, 2x
//       qx.core.Assert.assertNotNull, 1x
//       qx.core.Assert.assertNotUndefined, 1x
//       qx.core.ObjectRegistry.toHashCode, 1x
//       qx.dom.Node.getWindow, 1x
//       qx.dom.Node.isWindow, 1x
//       qx.event.IEventDispatcher, 1x
//       qx.event.IEventHandler, 1x
//       qx.event.Manager, 1x
//       qx.event.Pool.getInstance, 1x
//       qx.event.type.Event, 1x
//       qx.log.Logger.error, 1x
//       qx.log.Logger.trace, 1x
qx.Class.define("qx.event.Registration",{statics:{__yRxNx:{},
getManager:function(a){a==null?(qx.log.Logger.error("qx.event.Registration.getManager(null) was called!"),qx.log.Logger.trace(this),a=window):a.nodeType?a=qx.dom.Node.getWindow(a):qx.dom.Node.isWindow(a)||(a=window);
var c=a.$$hash||qx.core.ObjectRegistry.toHashCode(a),b=this.__yRxNx[c];
b||(b=new qx.event.Manager(a,this),this.__yRxNx[c]=b);
return b},
removeManager:function(b){var a=b.getWindowId();
delete this.__yRxNx[a]},
addListener:function(a,b,e,c,d){return this.getManager(a).addListener(a,b,e,c,d)},
removeListener:function(a,b,e,c,d){return this.getManager(a).removeListener(a,b,e,c,d)},
removeListenerById:function(a,b){return this.getManager(a).removeListenerById(a,b)},
removeAllListeners:function(a){return this.getManager(a).removeAllListeners(a)},
deleteAllListeners:function(a){var b=a.$$hash;
b&&this.getManager(a).deleteAllListeners(b)},
hasListener:function(a,b,c){return this.getManager(a).hasListener(a,b,c)},
serializeListeners:function(a){return this.getManager(a).serializeListeners(a)},
createEvent:function(c,b,d){if(arguments.length>1&&b===undefined)throw new Error("Create event of type "+c+" with undefined class. Please use null to explicit fallback to default event type!");
b==null&&(b=qx.event.type.Event);
var a=qx.event.Pool.getInstance().getObject(b);
d?a.init.apply(a,d):a.init();
c&&a.setType(c);
return a},
dispatchEvent:function(a,b){return this.getManager(a).dispatchEvent(a,b)},
fireEvent:function(a,b,c,d){{if(arguments.length>2&&c===undefined&&d!==undefined)throw new Error("Create event of type "+b+" with undefined class. Please use null to explicit fallback to default event type!");
var e="Could not fire event '"+b+"' on target '"+(a?a.classname:"undefined")+"': ",f;
qx.core.Assert.assertNotUndefined(a,e+"Invalid event target.");
qx.core.Assert.assertNotNull(a,e+"Invalid event target.")}f=this.createEvent(b,c||null,d);
return this.getManager(a).dispatchEvent(a,f)},
fireNonBubblingEvent:function(b,a,c,d){if(arguments.length>2&&c===undefined&&d!==undefined)throw new Error("Create event of type "+a+" with undefined class. Please use null to explicit fallback to default event type!");
var e=this.getManager(b),f;
if(!e.hasListener(b,a,false))return true;
f=this.createEvent(a,c||null,d);
return e.dispatchEvent(b,f)},
PRIORITY_FIRST:-32000,
PRIORITY_NORMAL:0,
PRIORITY_LAST:32000,
__yQayq:[],
addHandler:function(a){qx.core.Assert.assertInterface(a,qx.event.IEventHandler,"Invalid event handler.");
this.__yQayq.push(a);
this.__yQayq.sort(function(b,a){return b.PRIORITY-a.PRIORITY})},
getHandlers:function(){return this.__yQayq},
__PRhiv:[],
addDispatcher:function(a,b){qx.core.Assert.assertInterface(a,qx.event.IEventDispatcher,"Invalid event dispatcher!");
this.__PRhiv.push(a);
this.__PRhiv.sort(function(b,a){return b.PRIORITY-a.PRIORITY})},
getDispatchers:function(){return this.__PRhiv}}});


// qx.event.dispatch.Direct
//   - size: 851 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 9x
//   - packages:
//       qx.Class.define, 1x
//       qx.Class.getByName, 1x
//       qx.Class.getEventType, 1x
//       qx.core.Object, 2x
//       qx.event.IEventDispatcher, 1x
//       qx.event.Registration.PRIORITY_LAST, 1x
//       qx.event.Registration.addDispatcher, 1x
//       qx.event.type.Event.AT_TARGET, 1x
qx.Class.define("qx.event.dispatch.Direct",{extend:qx.core.Object,
implement:qx.event.IEventDispatcher,
construct:function(a){this._manager=a},
statics:{PRIORITY:qx.event.Registration.PRIORITY_LAST},
members:{canDispatchEvent:function(b,a,c){return!a.getBubbles()},
dispatchEvent:function(a,b,e){if(a instanceof qx.core.Object){var f=qx.Class.getEventType(a.constructor,e),g=qx.Class.getByName(f),c,d,i,h;
g?b instanceof g||this.error("Expected event type to be instanceof '"+f+"' but found '"+b.classname+"'"):this.error("The event type '"+e+"' declared in the class '"+a.constructor+" is not an available class': "+f)}b.setEventPhase(qx.event.type.Event.AT_TARGET);
c=this._manager.getListeners(a,e,false);
if(c)for(d=0,i=c.length;
d<i;
d++){h=c[d].context||a;
c[d].handler.call(h,b)}}},
defer:function(a){qx.event.Registration.addDispatcher(a)}});


// qx.event.handler.Object
//   - size: 468 bytes
//   - modified: 2010-08-29T12:24:44
//   - names:
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.Class.supportsEvent, 1x
//       qx.core.Object, 1x
//       qx.event.IEventHandler, 1x
//       qx.event.IEventHandler.TARGET_OBJECT, 1x
//       qx.event.Registration.PRIORITY_LAST, 1x
//       qx.event.Registration.addHandler, 1x
qx.Class.define("qx.event.handler.Object",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
statics:{PRIORITY:qx.event.Registration.PRIORITY_LAST,
SUPPORTED_TYPES:null,
TARGET_CHECK:qx.event.IEventHandler.TARGET_OBJECT,
IGNORE_CAN_HANDLE:false},
members:{canHandleEvent:function(a,b){return qx.Class.supportsEvent(a.constructor,b)},
registerEvent:function(a,b,c){},
unregisterEvent:function(a,b,c){}},
defer:function(a){qx.event.Registration.addHandler(a)}});


// qx.event.type.Data
//   - size: 448 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Event, 1x
qx.Class.define("qx.event.type.Data",{extend:qx.event.type.Event,
members:{__jlEBF:null,
__gQ654:null,
init:function(b,a,c){this.base(arguments,false,c);
this.__jlEBF=b;
this.__gQ654=a;
return this},
clone:function(b){var a=this.base(arguments,b);
a.__jlEBF=this.__jlEBF;
a.__gQ654=this.__gQ654;
return a},
getData:function(){return this.__jlEBF},
getOldData:function(){return this.__gQ654}},
destruct:function(){this.__jlEBF=this.__gQ654=null}});


// qx.io.ImageLoader
//   - size: 1762 bytes
//   - modified: 2010-09-07T21:24:54
//   - names:
//       Image, 1x
//       qx, 3x
//       window, 1x
//   - packages:
//       qx.Bootstrap.define, 1x
//       qx.event.GlobalError.observeMethod, 1x
//       qx.lang.Function.listener, 1x
qx.Bootstrap.define("qx.io.ImageLoader",{statics:{__jlEBF:{},
__O6wYB:{width:null,
height:null},
__cbGrT1:/\.(png|gif|jpg|jpeg|bmp)\b/i,
isLoaded:function(b){var a=this.__jlEBF[b];
return!!(a&&a.loaded)},
isFailed:function(b){var a=this.__jlEBF[b];
return!!(a&&a.failed)},
isLoading:function(b){var a=this.__jlEBF[b];
return!!(a&&a.loading)},
getFormat:function(b){var a=this.__jlEBF[b];
return a?a.format:null},
getSize:function(b){var a=this.__jlEBF[b];
return a?{width:a.width,
height:a.height}:this.__O6wYB},
getWidth:function(b){var a=this.__jlEBF[b];
return a?a.width:null},
getHeight:function(b){var a=this.__jlEBF[b];
return a?a.height:null},
load:function(e,b,d){var a=this.__jlEBF[e],c,f;
a||(a=this.__jlEBF[e]={});
b&&!d&&(d=window);
if(a.loaded||a.loading||a.failed)b&&(a.loading?a.callbacks.push(b,d):b.call(d,e,a));
else{a.loading=true;
a.callbacks=[];
b&&a.callbacks.push(b,d);
c=new Image(),f=qx.lang.Function.listener(this.__qBNI8,this,c,e);
c.onload=f;
c.onerror=f;
c.src=e;
a.element=c}},
abort:function(d){var a=this.__jlEBF[d],c,e,b,f;
if(a&&!a.loaded){a.aborted=true;
c=a.callbacks,e=a.element;
e.onload=e.onerror=null;
delete a.callbacks;
delete a.element;
delete a.loading;
for(b=0,f=c.length;
b<f;
b+=2)c[b].call(c[b+1],d,a)}this.__jlEBF[d]=null},
__qBNI8:qx.event.GlobalError.observeMethod(function(g,b,d){var a=this.__jlEBF[d],f,e,c,h;
if(g.type==="load"){a.loaded=true;
a.width=this.__yHD19(b);
a.height=this.__Dbnsa(b);
f=this.__cbGrT1.exec(d);
f!=null&&(a.format=f[1])}else a.failed=true;
b.onload=b.onerror=null;
e=a.callbacks;
delete a.loading;
delete a.callbacks;
delete a.element;
for(c=0,h=e.length;
c<h;
c+=2)e[c].call(e[c+1],d,a)}),
__yHD19:function(a){return a.naturalWidth},
__Dbnsa:function(a){return a.naturalHeight}}});


// qx.util.ValueManager
//   - size: 479 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
qx.Class.define("qx.util.ValueManager",{type:"abstract",
extend:qx.core.Object,
construct:function(){this.base(arguments);
this._dynamic={}},
members:{_dynamic:null,
resolveDynamic:function(a){return this._dynamic[a]},
isDynamic:function(a){return!!this._dynamic[a]},
resolve:function(a){if(a&&this._dynamic[a])return this._dynamic[a];
return a},
_setDynamic:function(a){this._dynamic=a},
_getDynamic:function(){return this._dynamic}},
destruct:function(){this._dynamic=null}});


// qx.theme.manager.Appearance
//   - size: 1684 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       qx, 2x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
qx.Class.define("qx.theme.manager.Appearance",{type:"singleton",
extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__JRMbw={};
this.__ynipn={}},
properties:{theme:{check:"Theme",
nullable:true,
event:"changeTheme",
apply:"_applyTheme"}},
members:{__2qiTY:{},
__JRMbw:null,
__ynipn:null,
_applyTheme:function(a,b){this.__ynipn={};
this.__JRMbw={}},
__EDQx6:function(e,b,c){var h=b.appearances,a=h[e],d,i,g,f,k,j;
if(!a){d="/",i=[],g=e.split(d);
while(!a&&g.length>0){i.unshift(g.pop());
k=g.join(d);
a=h[k];
if(a){f=a.alias||a;
if(typeof f==="string"){j=f+d+i.join(d);
return this.__EDQx6(j,b,c)}}}if(c!=null)return this.__EDQx6(c,b);
return null}if(typeof a==="string")return this.__EDQx6(a,b,c);
if(a.include&&!a.style)return this.__EDQx6(a.include,b,c);
return e},
styleFrom:function(k,c,e,p){e||(e=this.getTheme());
var q=this.__ynipn,i=q[k],a,l,h,o,f,n,d,g,j,m,b;
i||(i=q[k]=this.__EDQx6(k,e,p));
a=e.appearances[i];
if(!a){this.warn("Missing appearance: "+k);
return null}if(!a.style)return null;
l=i;
if(c){h=a.$$bits;
h||(h=a.$$bits={},a.$$length=0);
o=0;
for(f in c){if(!c[f])continue;
h[f]==null&&(h[f]=1<<a.$$length++);
o+=h[f]}o>0&&(l+=":"+o)}n=this.__JRMbw;
if(n[l]!==undefined)return n[l];
c||(c=this.__2qiTY);
if(a.include||a.base){g=a.style(c);
a.include&&(j=this.styleFrom(a.include,c,e,p));
d={};
if(a.base){m=this.styleFrom(i,c,a.base,p);
if(a.include)for(b in m)!j.hasOwnProperty(b)&&!g.hasOwnProperty(b)&&(d[b]=m[b]);
else for(b in m)g.hasOwnProperty(b)||(d[b]=m[b])}if(a.include)for(b in j)g.hasOwnProperty(b)||(d[b]=j[b]);
for(b in g)d[b]=g[b]}else d=a.style(c);
return n[l]=d||null}},
destruct:function(){this.__JRMbw=this.__ynipn=null}});


// qx.theme.manager.Decoration
//   - size: 1133 bytes
//   - modified: 2010-11-02T17:45:47
//   - names:
//       Error, 1x
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.Class.hasInterface, 1x
//       qx.core.Object, 1x
//       qx.core.Type.add, 1x
//       qx.ui.decoration.IDecorator, 1x
qx.Class.define("qx.theme.manager.Decoration",{type:"singleton",
extend:qx.core.Object,
construct:function(){this.base(arguments);
qx.core.Type.add("Decorator",this.isValidPropertyValue,this)},
properties:{theme:{check:"Theme",
nullable:true,
apply:"_applyTheme",
event:"changeTheme"}},
members:{__uFGym:null,
resolve:function(a){if(!a)return null;
if(typeof a==="object")return a;
var d=this.getTheme(),b,f,c,e;
if(!d)return null;
d=this.getTheme();
if(!d)return null;
b=this.__uFGym;
b||(b=this.__uFGym={});
f=b[a];
if(f)return f;
c=d.decorations[a];
if(!c)return null;
e=c.decorator;
if(e==null)throw new Error("Missing definition of which decorator to use in entry: "+a+"!");
return b[a]=(new e).set(c.style)},
isValidPropertyValue:function(a){if(typeof a==="string")return this.isDynamic(a);
if(typeof a==="object"){var b=a.constructor;
return qx.Class.hasInterface(b,qx.ui.decoration.IDecorator)}return false},
isDynamic:function(a){if(!a)return false;
var b=this.getTheme();
if(!b)return false;
return!!b.decorations[a]},
_applyTheme:function(a,b){a||(this.__uFGym={})}},
destruct:function(){this._disposeMap("__dynamic")}});


// qx.theme.manager.Color
//   - size: 846 bytes
//   - modified: 2010-10-26T17:35:52
//   - names:
//       Array, 1x
//       Error, 2x
//       qx, 3x
//       undefined, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.util.ColorUtil, 1x
//       qx.util.ValueManager, 1x
qx.Class.define("qx.theme.manager.Color",{type:"singleton",
extend:qx.util.ValueManager,
properties:{theme:{check:"Theme",
nullable:true,
apply:"_applyTheme",
event:"changeTheme"}},
members:{_applyTheme:function(c){var d={},e,f,a,b;
if(c){e=c.colors,f=qx.util.ColorUtil;
for(b in e){a=e[b];
if(typeof a==="string"){if(!f.isCssString(a))throw new Error("Could not parse color: "+a)}else if(a instanceof Array)a=f.rgbToRgbString(a);
else throw new Error("Could not parse color: "+a);
d[b]=a}}this._setDynamic(d)},
resolve:function(a){var c=this._dynamic,d=c[a],b;
if(d)return d;
b=this.getTheme();
if(b!==null&&b.colors[a])return c[a]=b.colors[a];
return a},
isDynamic:function(a){var c=this._dynamic,b;
if(a&&c[a]!==undefined)return true;
b=this.getTheme();
if(b!==null&&a&&b.colors[a]!==undefined){c[a]=b.colors[a];
return true}return false}}});


// qx.util.ColorUtil
//   - size: 5538 bytes
//   - modified: 2010-09-12T00:46:52
//   - names:
//       Error, 7x
//       Math, 14x
//       RegExp, 15x
//       parseInt, 15x
//       qx, 8x
//       undefined, 2x
//   - packages:
//       Math.floor, 5x
//       Math.random, 3x
//       Math.round, 6x
//       RegExp.$1, 4x
//       RegExp.$2, 4x
//       RegExp.$3, 4x
//       RegExp.$4, 1x
//       RegExp.$5, 1x
//       RegExp.$6, 1x
//       qx.Class.define, 1x
//       qx.Class.isDefined, 1x
//       qx.core.Type.add, 1x
//       qx.lang.String.pad, 3x
//       qx.theme.manager.Color.getInstance, 2x
qx.Class.define("qx.util.ColorUtil",{statics:{REGEXP:{hex3:/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
hex6:/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
rgb:/^rgb\(\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*\)$/,
rgba:/^rgba\(\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*\)$/},
SYSTEM:{activeborder:true,
activecaption:true,
appworkspace:true,
background:true,
buttonface:true,
buttonhighlight:true,
buttonshadow:true,
buttontext:true,
captiontext:true,
graytext:true,
highlight:true,
highlighttext:true,
inactiveborder:true,
inactivecaption:true,
inactivecaptiontext:true,
infobackground:true,
infotext:true,
menu:true,
menutext:true,
scrollbar:true,
threeddarkshadow:true,
threedface:true,
threedhighlight:true,
threedlightshadow:true,
threedshadow:true,
window:true,
windowframe:true,
windowtext:true},
NAMED:{black:[0,0,0],
silver:[192,192,192],
gray:[128,128,128],
white:[255,255,255],
maroon:[128,0,0],
red:[255,0,0],
purple:[128,0,128],
fuchsia:[255,0,255],
green:[0,128,0],
lime:[0,255,0],
olive:[128,128,0],
yellow:[255,255,0],
navy:[0,0,128],
blue:[0,0,255],
teal:[0,128,128],
aqua:[0,255,255],
transparent:[-1,-1,-1],
magenta:[255,0,255],
orange:[255,165,0],
brown:[165,42,42]},
isNamedColor:function(a){return this.NAMED[a]!==undefined},
isSystemColor:function(a){return this.SYSTEM[a]!==undefined},
supportsThemes:function(){return qx.Class.isDefined("qx.theme.manager.Color")},
isThemedColor:function(a){if(!this.supportsThemes())return false;
return qx.theme.manager.Color.getInstance().isDynamic(a)},
stringToRgb:function(a){if(this.supportsThemes()&&this.isThemedColor(a))var a=qx.theme.manager.Color.getInstance().resolveDynamic(a);
if(this.isNamedColor(a))return this.NAMED[a];
if(this.isSystemColor(a))throw new Error("Could not convert system colors to RGB: "+a);
if(this.isRgbString(a))return this.__9qu8N();
if(this.isHex3String(a))return this.__beRC7k();
if(this.isHex6String(a))return this.__be1wSx();
throw new Error("Could not parse color: "+a)},
cssStringToRgb:function(a){if(this.isNamedColor(a))return this.NAMED[a];
if(this.isSystemColor(a))throw new Error("Could not convert system colors to RGB: "+a);
if(this.isRgbString(a))return this.__9qu8N();
if(this.isRgbaString(a))return this.__bgPIQe();
if(this.isHex3String(a))return this.__beRC7k();
if(this.isHex6String(a))return this.__be1wSx();
throw new Error("Could not parse color: "+a)},
stringToRgbString:function(a){return this.rgbToRgbString(this.stringToRgb(a))},
rgbToRgbString:function(a){return"rgb("+a[0]+","+a[1]+","+a[2]+")"},
rgbToHexString:function(a){return qx.lang.String.pad(a[0].toString(16).toUpperCase(),2)+qx.lang.String.pad(a[1].toString(16).toUpperCase(),2)+qx.lang.String.pad(a[2].toString(16).toUpperCase(),2)},
isValidPropertyValue:function(a){return this.isThemedColor(a)||this.isNamedColor(a)||this.isHex3String(a)||this.isHex6String(a)||this.isRgbString(a)},
isCssString:function(a){return this.isSystemColor(a)||this.isNamedColor(a)||this.isHex3String(a)||this.isHex6String(a)||this.isRgbString(a)},
isHex3String:function(a){return this.REGEXP.hex3.test(a)},
isHex6String:function(a){return this.REGEXP.hex6.test(a)},
isRgbString:function(a){return this.REGEXP.rgb.test(a)},
isRgbaString:function(a){return this.REGEXP.rgba.test(a)},
__9qu8N:function(){var a=parseInt(RegExp.$1,10),b=parseInt(RegExp.$2,10),c=parseInt(RegExp.$3,10);
return[a,b,c]},
__bgPIQe:function(){var a=parseInt(RegExp.$1,10),b=parseInt(RegExp.$2,10),c=parseInt(RegExp.$3,10);
return[a,b,c]},
__beRC7k:function(){var a=parseInt(RegExp.$1,16)*17,b=parseInt(RegExp.$2,16)*17,c=parseInt(RegExp.$3,16)*17;
return[a,b,c]},
__be1wSx:function(){var a=parseInt(RegExp.$1,16)*16+parseInt(RegExp.$2,16),b=parseInt(RegExp.$3,16)*16+parseInt(RegExp.$4,16),c=parseInt(RegExp.$5,16)*16+parseInt(RegExp.$6,16);
return[a,b,c]},
hex3StringToRgb:function(a){if(this.isHex3String(a))return this.__beRC7k(a);
throw new Error("Invalid hex3 value: "+a)},
hex6StringToRgb:function(a){if(this.isHex6String(a))return this.__be1wSx(a);
throw new Error("Invalid hex6 value: "+a)},
hexStringToRgb:function(a){if(this.isHex3String(a))return this.__beRC7k(a);
if(this.isHex6String(a))return this.__be1wSx(a);
throw new Error("Invalid hex value: "+a)},
rgbToHsb:function(h){var b,g,l,c=h[0],d=h[1],f=h[2],a=c>d?c:d,e,j,i,k;
f>a&&(a=f);
e=c<d?c:d;
f<e&&(e=f);
l=a/255;
g=a!=0?(a-e)/a:0;
if(g==0)b=0;
else{j=(a-c)/(a-e),i=(a-d)/(a-e),k=(a-f)/(a-e);
b=c==a?k-i:d==a?2+j-k:4+i-j;
b=b/6;
b<0&&(b=b+1)}return[Math.round(b*360),Math.round(g*100),Math.round(l*100)]},
hsbToRgb:function(k){var i,j,c,g,f,e=k[0]/360,d=k[1]/100,h=k[2]/100,b,a;
e>=1&&(e%=1);
d>1&&(d=1);
h>1&&(h=1);
b=Math.floor(255*h),a={};
if(d==0)a.red=a.green=a.blue=b;
else{e*=6;
i=Math.floor(e);
j=e-i;
c=Math.floor(b*(1-d));
g=Math.floor(b*(1-d*j));
f=Math.floor(b*(1-d*(1-j)));
switch(i){case 0:a.red=b;
a.green=f;
a.blue=c;
break;
case 1:a.red=g;
a.green=b;
a.blue=c;
break;
case 2:a.red=c;
a.green=b;
a.blue=f;
break;
case 3:a.red=c;
a.green=g;
a.blue=b;
break;
case 4:a.red=f;
a.green=c;
a.blue=b;
break;
case 5:a.red=b;
a.green=c;
a.blue=g;
break}}return[a.red,a.green,a.blue]},
randomColor:function(){var c=Math.round(Math.random()*255),a=Math.round(Math.random()*255),b=Math.round(Math.random()*255);
return this.rgbToRgbString([c,a,b])}},
defer:function(a){qx.core.Type.add("Color",a.isValidPropertyValue,a)}});


// qx.ui.layout.Util
//   - size: 2622 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Infinity, 1x
//       Math, 11x
//       qx, 3x
//   - packages:
//       Math.abs, 1x
//       Math.ceil, 1x
//       Math.max, 3x
//       Math.min, 4x
//       Math.round, 2x
//       qx.Class.define, 1x
//       qx.theme.manager.Decoration.getInstance, 2x
qx.Class.define("qx.ui.layout.Util",{statics:{PERCENT_VALUE:/[0-9]+(?:\.[0-9]+)?%/,
computeFlexOffsets:function(k,j,l){var a,b,f,d,i=j>l,h=Math.abs(j-l),g,c,e={};
for(b in k)a=k[b],e[b]={potential:i?a.max-a.value:a.value-a.min,
flex:i?a.flex:1/a.flex,
offset:0};
while(h!=0){d=Infinity;
f=0;
for(b in e)a=e[b],a.potential>0&&(f+=a.flex,d=Math.min(d,a.potential/a.flex));
if(f==0)break;
d=Math.min(h,d*f)/f;
g=0;
for(b in e)a=e[b],a.potential>0&&(c=Math.min(h,a.potential,Math.ceil(d*a.flex)),g+=c-d*a.flex,g>=1&&(g-=1,c-=1),a.potential-=c,i?a.offset+=c:a.offset-=c,h-=c)}return e},
computeHorizontalAlignOffset:function(f,e,d,b,c){b==null&&(b=0);
c==null&&(c=0);
var a=0;
switch(f){case"left":a=b;
break;
case"right":a=d-e-c;
break;
case"center":a=Math.round((d-e)/2);
a<b?a=b:a<c&&(a=Math.max(b,d-e-c));
break}return a},
computeVerticalAlignOffset:function(f,d,e,b,c){b==null&&(b=0);
c==null&&(c=0);
var a=0;
switch(f){case"top":a=b;
break;
case"bottom":a=e-d-c;
break;
case"middle":a=Math.round((e-d)/2);
a<b?a=b:a<c&&(a=Math.max(b,e-d-c));
break}return a},
collapseMargins:function(f){for(var c=0,b=0,d=0,e=arguments.length,a;
d<e;
d++){a=arguments[d];
a<0?b=Math.min(b,a):a>0&&(c=Math.max(c,a))}return c+b},
computeHorizontalGaps:function(a,e,f){e==null&&(e=0);
var c=0,b,d;
if(f){c+=a[0].getMarginLeft();
for(b=1,d=a.length;
b<d;
b+=1)c+=this.collapseMargins(e,a[b-1].getMarginRight(),a[b].getMarginLeft());
c+=a[d-1].getMarginRight()}else{for(b=1,d=a.length;
b<d;
b+=1)c+=a[b].getMarginLeft()+a[b].getMarginRight();
c+=e*(d-1)}return c},
computeVerticalGaps:function(a,e,f){e==null&&(e=0);
var c=0,b,d;
if(f){c+=a[0].getMarginTop();
for(b=1,d=a.length;
b<d;
b+=1)c+=this.collapseMargins(e,a[b-1].getMarginBottom(),a[b].getMarginTop());
c+=a[d-1].getMarginBottom()}else{for(b=1,d=a.length;
b<d;
b+=1)c+=a[b].getMarginTop()+a[b].getMarginBottom();
c+=e*(d-1)}return c},
computeHorizontalSeparatorGaps:function(c,g,h){for(var j=qx.theme.manager.Decoration.getInstance().resolve(h),e=j.getInsets(),i=e.left+e.right,a=0,b=0,f=c.length,d;
b<f;
b++){d=c[b];
a+=d.getMarginLeft()+d.getMarginRight()}a+=(g+i+g)*(f-1);
return a},
computeVerticalSeparatorGaps:function(c,g,h){for(var i=qx.theme.manager.Decoration.getInstance().resolve(h),e=i.getInsets(),j=e.top+e.bottom,a=0,b=0,f=c.length,d;
b<f;
b++){d=c[b];
a+=d.getMarginTop()+d.getMarginBottom()}a+=(g+j+g)*(f-1);
return a},
arrangeIdeals:function(e,b,d,f,a,c){(b<e||a<f)&&(b<e&&a<f?(b=e,a=f):b<e?(a-=e-b,b=e,a<f&&(a=f)):a<f&&(b-=f-a,a=f,b<e&&(b=e)));
(b>d||a>c)&&(b>d&&a>c?(b=d,a=c):b>d?(a+=b-d,b=d,a>c&&(a=c)):a>c&&(b+=a-c,a=c,b>d&&(b=d)));
return{begin:b,
end:a}}}});


// qx.event.Timer
//   - size: 1324 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 4x
//       window, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.GlobalError.observeMethod, 1x
//       qx.event.Timer, 1x
//       window.clearInterval, 2x
//       window.setInterval, 1x
qx.Class.define("qx.event.Timer",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
this.setEnabled(false);
a!=null&&this.setInterval(a);
var b=this;
this.__KCwvZ=function(){b._oninterval.call(b)}},
events:{interval:"qx.event.type.Event"},
statics:{once:function(c,b,d){var a=new qx.event.Timer(d);
a.__yECuy=c;
a.addListener("interval",function(d){a.stop();
c.call(b,d);
a.dispose();
b=null},b);
a.start();
return a}},
properties:{enabled:{init:true,
check:"Boolean",
apply:"_applyEnabled"},
interval:{check:"Integer",
init:1000,
apply:"_applyInterval"}},
members:{__bioe1m:null,
__KCwvZ:null,
_applyInterval:function(a,b){this.getEnabled()&&this.restart()},
_applyEnabled:function(a,b){b?(window.clearInterval(this.__bioe1m),this.__bioe1m=null):a&&(this.__bioe1m=window.setInterval(this.__KCwvZ,this.getInterval()))},
start:function(){this.setEnabled(true)},
startWith:function(a){this.setInterval(a);
this.start()},
stop:function(){this.setEnabled(false)},
restart:function(){this.stop();
this.start()},
restartWith:function(a){this.stop();
this.startWith(a)},
_oninterval:qx.event.GlobalError.observeMethod(function(){if(this.$$disposed)return;
this.getEnabled()&&this.fireEvent("interval")})},
destruct:function(){this.__bioe1m&&window.clearInterval(this.__bioe1m);
this.__bioe1m=this.__KCwvZ=null}});


// qx.util.ResourceManager
//   - size: 919 bytes
//   - modified: 2010-09-17T21:15:51
//   - names:
//       qx, 5x
//   - packages:
//       qx.$$libraries, 1x
//       qx.$$resources, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Feature.SSL, 1x
//       qx.core.Object, 1x
qx.Class.define("qx.util.ResourceManager",{extend:qx.core.Object,
type:"singleton",
statics:{__zAUSy:qx.$$resources||{},
__EoIRE:{}},
members:{has:function(a){return!!this.self(arguments).__zAUSy[a]},
getData:function(a){return this.self(arguments).__zAUSy[a]||null},
getImageWidth:function(b){var a=this.self(arguments).__zAUSy[b];
return a?a[0]:null},
getImageHeight:function(b){var a=this.self(arguments).__zAUSy[b];
return a?a[1]:null},
getImageFormat:function(b){var a=this.self(arguments).__zAUSy[b];
return a?a[2]:null},
isClippedImage:function(b){var a=this.self(arguments).__zAUSy[b];
return a&&a.length>4},
toUri:function(a){if(a==null)return a;
var b=this.self(arguments).__zAUSy[a],c,d;
if(!b)return a;
if(typeof b==="string")c=b;
else{c=b[3];
if(!c)return a}d="";
false&&qx.bom.client.Feature.SSL&&(d=this.self(arguments).__EoIRE[c]);
return d+qx.$$libraries[c].resourceUri+"/"+a}},
defer:function(a){}});


// qx.event.type.Focus
//   - size: 183 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Event, 1x
qx.Class.define("qx.event.type.Focus",{extend:qx.event.type.Event,
members:{init:function(a,c,b){this.base(arguments,b,false);
this._target=a;
this._relatedTarget=c;
return this}}});


// qx.bom.element.Background
//   - size: 947 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.client.Engine, 1x
//       qx.util.ResourceManager.getInstance, 2x
qx.Class.define("qx.bom.element.Background",{statics:{__jNYEy:["background-image:url(",null,");","background-position:",null,";","background-repeat:",null,";"],
__QC7Ow:{backgroundImage:null,
backgroundPosition:null,
backgroundRepeat:null},
__bjlUD7:function(a,b){var e=qx.bom.client.Engine,d,c;
e.GECKO&&e.VERSION<1.9&&a==b&&typeof a=="number"&&(b+=.01);
if(a)d=typeof a=="number"?a+"px":a;
else d="0";
if(b)c=typeof b=="number"?b+"px":b;
else c="0";
return d+" "+c},
compile:function(g,f,b,c){var d=this.__bjlUD7(b,c),e=qx.util.ResourceManager.getInstance().toUri(g),a=this.__jNYEy;
a[1]=e;
a[4]=d;
a[7]=f;
return a.join("")},
getStyles:function(c,b,d,e){if(!c)return this.__QC7Ow;
var f=this.__bjlUD7(d,e),g=qx.util.ResourceManager.getInstance().toUri(c),a={backgroundPosition:f,
backgroundImage:"url("+g+")"};
b!=null&&(a.backgroundRepeat=b);
return a},
set:function(c,g,f,d,e){var b=this.getStyles(g,f,d,e),a;
for(a in b)c.style[a]=b[a]}}});


// qx.event.dispatch.AbstractBubbling
//   - size: 1343 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.IEventDispatcher, 1x
//       qx.event.type.Event.AT_TARGET, 1x
//       qx.event.type.Event.BUBBLING_PHASE, 1x
//       qx.event.type.Event.CAPTURING_PHASE, 1x
qx.Class.define("qx.event.dispatch.AbstractBubbling",{extend:qx.core.Object,
implement:qx.event.IEventDispatcher,
type:"abstract",
construct:function(a){this._manager=a},
members:{_getParent:function(a){throw new Error("Missing implementation")},
canDispatchEvent:function(b,a,c){return a.getBubbles()},
dispatchEvent:function(j,a,l){var f=j,n=this._manager,k,g,e,c,h,i,m=[],o,t,p,s,b,d,q,r;
k=n.getListeners(j,l,true);
g=n.getListeners(j,l,false);
k&&m.push(k);
g&&m.push(g);
f=this._getParent(j),o=[],t=[],p=[],s=[];
while(f!=null)k=n.getListeners(f,l,true),k&&(p.push(k),s.push(f)),g=n.getListeners(f,l,false),g&&(o.push(g),t.push(f)),f=this._getParent(f);
a.setEventPhase(qx.event.type.Event.CAPTURING_PHASE);
for(b=p.length-1;
b>=0;
b--){i=s[b];
a.setCurrentTarget(i);
e=p[b];
for(d=0,q=e.length;
d<q;
d++)c=e[d],h=c.context||i,c.handler.call(h,a);
if(a.getPropagationStopped())return}a.setEventPhase(qx.event.type.Event.AT_TARGET);
a.setCurrentTarget(j);
for(b=0,r=m.length;
b<r;
b++){e=m[b];
for(d=0,q=e.length;
d<q;
d++)c=e[d],h=c.context||j,c.handler.call(h,a);
if(a.getPropagationStopped())return}a.setEventPhase(qx.event.type.Event.BUBBLING_PHASE);
for(b=0,r=o.length;
b<r;
b++){i=t[b];
a.setCurrentTarget(i);
e=o[b];
for(d=0,q=e.length;
d<q;
d++)c=e[d],h=c.context||i,c.handler.call(h,a);
if(a.getPropagationStopped())return}}}});


// qx.bom.Font
//   - size: 1949 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       parseInt, 1x
//       qx, 5x
//       undefined, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Font, 2x
//       qx.core.Object, 1x
//       qx.lang.String.contains, 1x
qx.Class.define("qx.bom.Font",{extend:qx.core.Object,
construct:function(a,b){this.base(arguments);
a!==undefined&&this.setSize(a);
b!==undefined&&this.setFamily(b)},
statics:{fromString:function(g){for(var a=new qx.bom.Font(),f=g.split(/\s+/),d=[],b,c=0,e;
c<f.length;
c++)switch(b=f[c]){case"bold":a.setBold(true);
break;
case"italic":a.setItalic(true);
break;
case"underline":a.setDecoration("underline");
break;
default:e=parseInt(b,10);
e==b||qx.lang.String.contains(b,"px")?a.setSize(e):d.push(b);
break}d.length>0&&a.setFamily(d);
return a},
fromConfig:function(b){var a=new qx.bom.Font;
a.set(b);
return a},
__2J6qy:{fontFamily:"",
fontSize:"",
fontWeight:"",
fontStyle:"",
textDecoration:"",
lineHeight:1.2},
getDefaultStyles:function(){return this.__2J6qy}},
properties:{size:{check:"Integer",
nullable:true,
apply:"_applySize"},
lineHeight:{check:"Number",
nullable:true,
apply:"_applyLineHeight"},
family:{check:"Array",
nullable:true,
apply:"_applyFamily"},
bold:{check:"Boolean",
nullable:true,
apply:"_applyBold"},
italic:{check:"Boolean",
nullable:true,
apply:"_applyItalic"},
decoration:{check:["underline","line-through","overline"],
nullable:true,
apply:"_applyDecoration"}},
members:{__jM9vq:null,
__qc3kj:null,
__jrqDs:null,
__qpHzB:null,
__JrEx1:null,
__IKKUm:null,
_applySize:function(a,b){this.__jM9vq=a===null?null:a+"px"},
_applyLineHeight:function(a,b){this.__IKKUm=a===null?null:a},
_applyFamily:function(b,e){for(var c="",a=0,d=b.length;
a<d;
a++)c+=b[a].indexOf(" ")>0?"\""+b[a]+"\"":b[a],a!==d-1&&(c+=",");
this.__qc3kj=c},
_applyBold:function(a,b){this.__jrqDs=a===null?null:a?"bold":"normal"},
_applyItalic:function(a,b){this.__qpHzB=a===null?null:a?"italic":"normal"},
_applyDecoration:function(a,b){this.__JrEx1=a===null?null:a},
getStyles:function(){return{fontFamily:this.__qc3kj,
fontSize:this.__jM9vq,
fontWeight:this.__jrqDs,
fontStyle:this.__qpHzB,
textDecoration:this.__JrEx1,
lineHeight:this.__IKKUm}}}});


// qx.locale.Manager
//   - size: 2100 bytes
//   - modified: 2010-11-02T16:00:30
//   - names:
//       qx, 13x
//   - packages:
//       qx.$$locales, 1x
//       qx.$$translations, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Locale, 1x
//       qx.core.Object, 1x
//       qx.lang.Array.fromArguments, 3x
//       qx.lang.String.format, 1x
//       qx.locale.Manager.getInstance, 4x
qx.Class.define("qx.locale.Manager",{type:"singleton",
extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__XruXR=qx.$$translations||{};
this.__uqPUA=qx.$$locales||{};
var a=qx.bom.client.Locale,c=a.LOCALE,b=a.VARIANT;
b!==""&&(c+="_"+b);
this.setLocale(c||this.__1UpdE)},
statics:{tr:function(b,c){var a=qx.lang.Array.fromArguments(arguments);
a.splice(0,1);
return qx.locale.Manager.getInstance().translate(b,a)},
trn:function(c,b,d,e){var a=qx.lang.Array.fromArguments(arguments);
a.splice(0,3);
return d!=1?qx.locale.Manager.getInstance().translate(b,a):qx.locale.Manager.getInstance().translate(c,a)},
trc:function(d,b,c){var a=qx.lang.Array.fromArguments(arguments);
a.splice(0,2);
return qx.locale.Manager.getInstance().translate(b,a)},
marktr:function(a){return a}},
properties:{locale:{check:"String",
nullable:true,
apply:"_applyLocale",
event:"changeLocale"}},
members:{__1UpdE:"C",
__qi6oJ:null,
__yZNgl:null,
__XruXR:null,
__uqPUA:null,
getLanguage:function(){return this.__yZNgl},
getTerritory:function(){return this.getLocale().split("_")[1]||""},
getAvailableLocales:function(){var b=[],a;
for(a in this.__uqPUA)a!=this.__1UpdE&&b.push(a);
return b},
__bitbTS:function(b){var a,c=b.indexOf("_");
a=c==-1?b:b.substring(0,c);
return a},
_applyLocale:function(a,b){this.__qi6oJ=a;
this.__yZNgl=this.__bitbTS(a)},
addTranslation:function(d,a){var c=this.__XruXR,b;
if(c[d])for(b in a)c[d][b]=a[b];
else c[d]=a},
addLocale:function(a,c){var d=this.__uqPUA,b;
if(d[a])for(b in c)d[a][b]=c[b];
else d[a]=c},
translate:function(a,b,d){var c=this.__XruXR;
return this.__bhMQmC(c,a,b,d)},
localize:function(a,b,d){var c=this.__uqPUA;
return this.__bhMQmC(c,a,b,d)},
__bhMQmC:function(b,c,g,e){var a,h,i,d,f;
if(!b)return c;
if(e)h=this.__bitbTS(e);
else e=this.__qi6oJ,h=this.__yZNgl;
!a&&b[e]&&(a=b[e][c]);
!a&&b[h]&&(a=b[h][c]);
!a&&b[this.__1UpdE]&&(a=b[this.__1UpdE][c]);
a||(a=c);
if(g.length>0){i=[],d=0;
for(;
d<g.length;
d++){f=g[d];
i[d]=f&&f.translate?f.translate():f}a=qx.lang.String.format(a,i)}return a}},
destruct:function(){this.__XruXR=this.__uqPUA=null}});


// qx.util.DeferredCallManager
//   - size: 1115 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 6x
//       window, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.GlobalError.observeMethod, 1x
//       qx.lang.Function.bind, 1x
//       qx.lang.Object.clone, 1x
//       qx.lang.Object.isEmpty, 1x
//       window.clearTimeout, 2x
//       window.setTimeout, 1x
qx.Class.define("qx.util.DeferredCallManager",{extend:qx.core.Object,
type:"singleton",
construct:function(){this.__muCjq={};
this.__bbKRP9=qx.lang.Function.bind(this.__uZ2bi,this);
this.__x5qek=false},
members:{__EEWKl:null,
__WYlL1:null,
__muCjq:null,
__x5qek:null,
__bbKRP9:null,
schedule:function(a){this.__EEWKl==null&&(this.__EEWKl=window.setTimeout(this.__bbKRP9,0));
var b=a.toHashCode();
if(this.__WYlL1&&this.__WYlL1[b])return;
this.__muCjq[b]=a;
this.__x5qek=true},
cancel:function(b){var a=b.toHashCode();
if(this.__WYlL1&&this.__WYlL1[a]){this.__WYlL1[a]=null;
return}delete this.__muCjq[a];
qx.lang.Object.isEmpty(this.__muCjq)&&this.__EEWKl!=null&&(window.clearTimeout(this.__EEWKl),this.__EEWKl=null)},
__uZ2bi:qx.event.GlobalError.observeMethod(function(){this.__EEWKl=null;
while(this.__x5qek){this.__WYlL1=qx.lang.Object.clone(this.__muCjq);
this.__muCjq={};
this.__x5qek=false;
for(a in this.__WYlL1){var b=this.__WYlL1[a],a;
b&&(this.__WYlL1[a]=null,b.call())}}this.__WYlL1=null})},
destruct:function(){this.__EEWKl!=null&&window.clearTimeout(this.__EEWKl);
this.__bbKRP9=this.__muCjq=null}});


// qx.locale.MTranslation
//   - size: 762 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 4x
//       qx, 5x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.locale.Manager, 4x
qx.Mixin.define("qx.locale.MTranslation",{members:{tr:function(c,b){var a=qx.locale.Manager;
if(a)return a.tr.apply(a,arguments);
throw new Error("To enable localization please include qx.locale.Manager into your build!")},
trn:function(d,c,e,b){var a=qx.locale.Manager;
if(a)return a.trn.apply(a,arguments);
throw new Error("To enable localization please include qx.locale.Manager into your build!")},
trc:function(d,b,c){var a=qx.locale.Manager;
if(a)return a.trc.apply(a,arguments);
throw new Error("To enable localization please include qx.locale.Manager into your build!")},
marktr:function(b){var a=qx.locale.Manager;
if(a)return a.marktr.apply(a,arguments);
throw new Error("To enable localization please include qx.locale.Manager into your build!")}}});


// qx.util.DeferredCall
//   - size: 517 bytes
//   - modified: 2010-11-02T16:08:53
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.util.DeferredCallManager.getInstance, 1x
qx.Class.define("qx.util.DeferredCall",{extend:qx.core.Object,
construct:function(b,a){this.base(arguments);
this.__yn7yy=b;
this.__uOt7U=a||null;
this.__ugn3e=qx.util.DeferredCallManager.getInstance()},
members:{__yn7yy:null,
__uOt7U:null,
__ugn3e:null,
cancel:function(){this.__ugn3e.cancel(this)},
schedule:function(){this.__ugn3e.schedule(this)},
call:function(){this.__uOt7U?this.__yn7yy.apply(this.__uOt7U):this.__yn7yy()}},
destruct:function(b,a){this.cancel();
this.__uOt7U=this.__yn7yy=this.__ugn3e=null}});


// qx.bom.element.Dimension
//   - size: 1417 bytes
//   - modified: 2010-10-13T17:38:57
//   - names:
//       Math, 6x
//       parseInt, 4x
//       qx, 7x
//   - packages:
//       Math.max, 2x
//       Math.round, 4x
//       qx.Class.define, 1x
//       qx.bom.client.Engine, 2x
//       qx.bom.element.Overflow.getX, 1x
//       qx.bom.element.Overflow.getY, 1x
//       qx.bom.element.Style, 2x
qx.Class.define("qx.bom.element.Dimension",{statics:{getWidth:function(a){if(a.getBoundingClientRect){var b=a.getBoundingClientRect();
return Math.round(b.right)-Math.round(b.left)}return a.offsetWidth},
getHeight:function(a){if(a.getBoundingClientRect){var b=a.getBoundingClientRect();
return Math.round(b.bottom)-Math.round(b.top)}return a.offsetHeight},
getSize:function(a){return{width:this.getWidth(a),
height:this.getHeight(a)}},
__bo0366:{visible:true,
hidden:true},
getContentWidth:function(a){var f=qx.bom.element.Style,h=qx.bom.element.Overflow.getX(a),d=parseInt(f.get(a,"paddingLeft")||"0px",10),c=parseInt(f.get(a,"paddingRight")||"0px",10),b,e,g;
if(this.__bo0366[h]){b=a.clientWidth;
b>0&&(b=b-d-c);
return b}if(a.clientWidth>=a.scrollWidth)return Math.max(a.clientWidth,a.scrollWidth)-d-c;
e=a.scrollWidth-d,g=qx.bom.client.Engine;
g.NAME==="mshtml"&&g.VERSION==6&&(e-=c);
return e},
getContentHeight:function(a){var e=qx.bom.element.Style,g=qx.bom.element.Overflow.getY(a),b=parseInt(e.get(a,"paddingTop")||"0px",10),c=parseInt(e.get(a,"paddingBottom")||"0px",10),d,f;
if(this.__bo0366[g])return a.clientHeight-b-c;
if(a.clientHeight>=a.scrollHeight)return Math.max(a.clientHeight,a.scrollHeight)-b-c;
d=a.scrollHeight-b,f=qx.bom.client.Engine;
f.NAME==="mshtml"&&f.VERSION==6&&(d-=c);
return d},
getContentSize:function(a){return{width:this.getContentWidth(a),
height:this.getContentHeight(a)}}}});


// qx.event.type.Native
//   - size: 861 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Event.getRelatedTarget, 1x
//       qx.bom.Event.getTarget, 1x
//       qx.bom.Event.preventDefault, 1x
//       qx.event.type.Event, 1x
//       qx.lang.Function.empty, 1x
qx.Class.define("qx.event.type.Native",{extend:qx.event.type.Event,
members:{init:function(a,b,d,c,e){this.base(arguments,c,e);
this._target=b||qx.bom.Event.getTarget(a);
this._relatedTarget=d||qx.bom.Event.getRelatedTarget(a);
a.timeStamp&&(this._timeStamp=a.timeStamp);
this._native=a;
this._returnValue=null;
return this},
clone:function(c){var a=this.base(arguments,c),b={};
a._native=this._cloneNativeEvent(this._native,b);
a._returnValue=this._returnValue;
return a},
_cloneNativeEvent:function(b,a){a.preventDefault=qx.lang.Function.empty;
return a},
preventDefault:function(){this.base(arguments);
qx.bom.Event.preventDefault(this._native)},
getNativeEvent:function(){return this._native},
setReturnValue:function(a){this._returnValue=a},
getReturnValue:function(){return this._returnValue}},
destruct:function(){this._native=this._returnValue=null}});


// qx.theme.manager.Font
//   - size: 1195 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       qx, 9x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Font, 5x
//       qx.core.Type.add, 1x
//       qx.lang.Object.mergeWith, 1x
//       qx.util.ValueManager, 1x
qx.Class.define("qx.theme.manager.Font",{type:"singleton",
extend:qx.util.ValueManager,
construct:function(){this.base(arguments);
qx.core.Type.add("Font",this.isDynamic,this)},
properties:{theme:{check:"Theme",
nullable:true,
apply:"_applyTheme",
event:"changeTheme"}},
members:{resolveDynamic:function(a){var b=this._dynamic;
return a instanceof qx.bom.Font?a:b[a]},
resolve:function(a){var c=this._dynamic,d=c[a],b;
if(d)return d;
b=this.getTheme();
if(b!==null&&b.fonts[a])return c[a]=(new qx.bom.Font).set(b.fonts[a]);
return a},
isDynamic:function(a){var c=this._dynamic,b;
if(a&&(a instanceof qx.bom.Font||c[a]!==undefined))return true;
b=this.getTheme();
if(b!==null&&a&&b.fonts[a]){c[a]=(new qx.bom.Font).set(b.fonts[a]);
return true}return false},
__ba0WFb:function(a,b){if(a[b].include){var c=a[a[b].include];
a[b].include=null;
delete a[b].include;
a[b]=qx.lang.Object.mergeWith(a[b],c,false);
this.__ba0WFb(a,b)}},
_applyTheme:function(d){var b=this._getDynamic(),a,c,e;
for(a in b)b[a].themed&&(b[a].dispose(),delete b[a]);
if(d){c=d.fonts,e=qx.bom.Font;
for(a in c)c[a].include&&c[c[a].include]&&this.__ba0WFb(c,a),b[a]=(new e).set(c[a]),b[a].themed=true}this._setDynamic(b)}}});


// qx.bom.element.Location
//   - size: 3637 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Math, 2x
//       document, 1x
//       parseInt, 1x
//       qx, 18x
//   - packages:
//       Math.round, 2x
//       document.body, 1x
//       qx.Class.define, 1x
//       qx.bom.Viewport.getScrollLeft, 1x
//       qx.bom.Viewport.getScrollTop, 1x
//       qx.bom.client.Engine.OPERA, 1x
//       qx.bom.client.Engine.VERSION, 1x
//       qx.bom.element.BoxSizing, 1x
//       qx.bom.element.BoxSizing.get, 1x
//       qx.bom.element.Overflow.getX, 1x
//       qx.bom.element.Overflow.getY, 1x
//       qx.bom.element.Style, 1x
//       qx.bom.element.Style.COMPUTED_MODE, 2x
//       qx.bom.element.Style.get, 2x
//       qx.dom.Node.getDocument, 3x
//       qx.dom.Node.getWindow, 1x
qx.Class.define("qx.bom.element.Location",{statics:{__nioaO:function(a,b){return qx.bom.element.Style.get(a,b,qx.bom.element.Style.COMPUTED_MODE,false)},
__gXIg7:function(a,b){return parseInt(qx.bom.element.Style.get(a,b,qx.bom.element.Style.COMPUTED_MODE,false),10)||0},
__3BZ0V:function(a){var b=0,c=0,d,e;
if(a.getBoundingClientRect&&!qx.bom.client.Engine.OPERA){d=qx.dom.Node.getWindow(a);
b-=qx.bom.Viewport.getScrollLeft(d);
c-=qx.bom.Viewport.getScrollTop(d)}else{e=qx.dom.Node.getDocument(a).body;
a=a.parentNode;
while(a&&a!=e)b+=a.scrollLeft,c+=a.scrollTop,a=a.parentNode}return{left:b,
top:c}},
__PRyli:function(d){var a=qx.dom.Node.getDocument(d).body,b=a.offsetLeft,c=a.offsetTop;
qx.bom.client.Engine.VERSION<1.9&&(b+=this.__gXIg7(a,"marginLeft"),c+=this.__gXIg7(a,"marginTop"));
qx.bom.element.BoxSizing.get(a)!=="border-box"&&(b+=this.__gXIg7(a,"borderLeftWidth"),c+=this.__gXIg7(a,"borderTopWidth"));
return{left:b,
top:c}},
__3nYv9:function(a){if(a.getBoundingClientRect){var d=a.getBoundingClientRect(),b=Math.round(d.left),c=Math.round(d.top),f,e}else{b=0,c=0,f=qx.dom.Node.getDocument(a).body,e=qx.bom.element.BoxSizing;
e.get(a)!=="border-box"&&(b-=this.__gXIg7(a,"borderLeftWidth"),c-=this.__gXIg7(a,"borderTopWidth"));
while(a&&a!==f)b+=a.offsetLeft,c+=a.offsetTop,e.get(a)!=="border-box"&&(b+=this.__gXIg7(a,"borderLeftWidth"),c+=this.__gXIg7(a,"borderTopWidth")),a.parentNode&&this.__nioaO(a.parentNode,"overflow")!="visible"&&(b+=this.__gXIg7(a.parentNode,"borderLeftWidth"),c+=this.__gXIg7(a.parentNode,"borderTopWidth")),a=a.offsetParent}return{left:b,
top:c}},
get:function(a,f){if(a.tagName=="BODY"){var g=this.__bf0iHy(a),b=g.left,c=g.top,l,k,h,e,d,i,j}else{l=this.__PRyli(a),k=this.__3nYv9(a),h=this.__3BZ0V(a),b=k.left+l.left-h.left,c=k.top+l.top-h.top}e=b+a.offsetWidth,d=c+a.offsetHeight;
if(f){if(f=="padding"||f=="scroll"){i=qx.bom.element.Overflow.getX(a);
(i=="scroll"||i=="auto")&&(e+=a.scrollWidth-a.offsetWidth+this.__gXIg7(a,"borderLeftWidth")+this.__gXIg7(a,"borderRightWidth"));
j=qx.bom.element.Overflow.getY(a);
(j=="scroll"||j=="auto")&&(d+=a.scrollHeight-a.offsetHeight+this.__gXIg7(a,"borderTopWidth")+this.__gXIg7(a,"borderBottomWidth"))}switch(f){case"padding":b+=this.__gXIg7(a,"paddingLeft"),c+=this.__gXIg7(a,"paddingTop"),e-=this.__gXIg7(a,"paddingRight"),d-=this.__gXIg7(a,"paddingBottom");
case"scroll":b-=a.scrollLeft,c-=a.scrollTop,e-=a.scrollLeft,d-=a.scrollTop;
case"border":b+=this.__gXIg7(a,"borderLeftWidth");
c+=this.__gXIg7(a,"borderTopWidth");
e-=this.__gXIg7(a,"borderRightWidth");
d-=this.__gXIg7(a,"borderBottomWidth");
break;
case"margin":b-=this.__gXIg7(a,"marginLeft");
c-=this.__gXIg7(a,"marginTop");
e+=this.__gXIg7(a,"marginRight");
d+=this.__gXIg7(a,"marginBottom");
break}}return{left:b,
top:c,
right:e,
bottom:d}},
__bf0iHy:function(a){var c=a.offsetTop+this.__gXIg7(a,"marginTop")+this.__gXIg7(a,"borderLeftWidth"),b=a.offsetLeft+this.__gXIg7(a,"marginLeft")+this.__gXIg7(a,"borderTopWidth");
return{left:b,
top:c}},
getLeft:function(b,a){return this.get(b,a).left},
getTop:function(b,a){return this.get(b,a).top},
getRight:function(b,a){return this.get(b,a).right},
getBottom:function(b,a){return this.get(b,a).bottom},
getRelative:function(c,d,e,f){var a=this.get(c,e),b=this.get(d,f);
return{left:a.left-b.left,
top:a.top-b.top,
right:a.right-b.right,
bottom:a.bottom-b.bottom}},
getPosition:function(a){return this.getRelative(a,this.getOffsetParent(a))},
getOffsetParent:function(b){var a=b.offsetParent||document.body,c=qx.bom.element.Style;
while(a&&(!/^body|html$/i.test(a.tagName)&&c.get(a,"position")==="static"))a=a.offsetParent;
return a}}});


// qx.event.type.Dom
//   - size: 870 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.client.Platform.MAC, 1x
//       qx.event.type.Dom.ALT_MASK, 1x
//       qx.event.type.Dom.CTRL_MASK, 1x
//       qx.event.type.Dom.META_MASK, 1x
//       qx.event.type.Dom.SHIFT_MASK, 1x
//       qx.event.type.Native, 1x
qx.Class.define("qx.event.type.Dom",{extend:qx.event.type.Native,
statics:{SHIFT_MASK:1,
CTRL_MASK:2,
ALT_MASK:4,
META_MASK:8},
members:{_cloneNativeEvent:function(b,a){var a=this.base(arguments,b,a);
a.shiftKey=b.shiftKey;
a.ctrlKey=b.ctrlKey;
a.altKey=b.altKey;
a.metaKey=b.metaKey;
return a},
getModifiers:function(){var a=0,b=this._native;
b.shiftKey&&(a|=qx.event.type.Dom.SHIFT_MASK);
b.ctrlKey&&(a|=qx.event.type.Dom.CTRL_MASK);
b.altKey&&(a|=qx.event.type.Dom.ALT_MASK);
b.metaKey&&(a|=qx.event.type.Dom.META_MASK);
return a},
isCtrlPressed:function(){return this._native.ctrlKey},
isShiftPressed:function(){return this._native.shiftKey},
isAltPressed:function(){return this._native.altKey},
isMetaPressed:function(){return this._native.metaKey},
isCtrlOrCommandPressed:function(){return qx.bom.client.Platform.MAC?this._native.metaKey:this._native.ctrlKey}}});


// qx.event.type.KeyInput
//   - size: 372 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       String, 1x
//       qx, 2x
//   - packages:
//       String.fromCharCode, 1x
//       qx.Class.define, 1x
//       qx.event.type.Dom, 1x
qx.Class.define("qx.event.type.KeyInput",{extend:qx.event.type.Dom,
members:{init:function(b,a,c){this.base(arguments,b,a,null,true,true);
this._charCode=c;
return this},
clone:function(b){var a=this.base(arguments,b);
a._charCode=this._charCode;
return a},
getCharCode:function(){return this._charCode},
getChar:function(){return String.fromCharCode(this._charCode)}}});


// qx.event.type.KeySequence
//   - size: 420 bytes
//   - modified: 2010-09-07T21:24:54
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Dom, 1x
qx.Class.define("qx.event.type.KeySequence",{extend:qx.event.type.Dom,
members:{init:function(a,b,c){this.base(arguments,a,b,null,true,true);
this._keyCode=a.keyCode;
this._identifier=c;
return this},
clone:function(b){var a=this.base(arguments,b);
a._keyCode=this._keyCode;
a._identifier=this._identifier;
return a},
getKeyIdentifier:function(){return this._identifier},
getKeyCode:function(){return this._keyCode}}});


// qx.data.SingleValueBinding
//   - size: 9914 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 3x
//       isNaN, 1x
//       parseFloat, 1x
//       parseInt, 2x
//       qx, 61x
//       undefined, 10x
//   - packages:
//       qx.Class.define, 1x
//       qx.Class.getEventType, 1x
//       qx.Class.implementsInterface, 3x
//       qx.Class.supportsEvent, 2x
//       qx.core.Assert.assertEquals, 1x
//       qx.core.Assert.assertNotNull, 1x
//       qx.core.AssertionError, 1x
//       qx.core.ObjectRegistry.fromHashCode, 2x
//       qx.core.ValidationError, 2x
//       qx.core.property.Util.getPropertyDefinition, 2x
//       qx.data.IListData, 3x
//       qx.data.SingleValueBinding.DEBUG_ON, 2x
//       qx.data.SingleValueBinding.__convertValue, 2x
//       qx.data.SingleValueBinding.__getEventNameForProperty, 1x
//       qx.data.SingleValueBinding.__resetTargetValue, 2x
//       qx.data.SingleValueBinding.__setTargetValue, 1x
//       qx.data.SingleValueBinding.__updateTarget, 1x
//       qx.lang.Array.remove, 1x
//       qx.lang.Function.bind, 3x
//       qx.lang.String.endsWith, 1x
//       qx.lang.String.firstUp, 21x
//       qx.lang.Type.getClass, 1x
//       qx.log.Logger.debug, 4x
//       qx.log.Logger.warn, 2x
qx.Class.define("qx.data.SingleValueBinding",{statics:{DEBUG_ON:false,
__yQrBp:{},
bind:function(j,k,e,f,g){for(var n=this.__bGuuQ2(j,k,e,f,g),c=k.split("."),d=this.__duzi0s(c),l=[],m=[],i=[],h=[],b=j,a=0,r,q,s,p,o;
a<c.length;
a++){d[a]!==""?h.push("change"):h.push(this.__cvbO3u(b,c[a]));
l[a]=b;
if(a==c.length-1){if(d[a]!==""){r=d[a]==="last"?b.length-1:d[a],q=b.getItem(r);
this.__bhsdHi(q,e,f,g,j);
i[a]=this.__bPE918(b,h[a],e,f,g,d[a])}else{if(c[a]!=null&&b["get"+qx.lang.String.firstUp(c[a])]!=null){q=b["get"+qx.lang.String.firstUp(c[a])]();
this.__bhsdHi(q,e,f,g,j)}i[a]=this.__bPE918(b,h[a],e,f,g)}}else{s={index:a,
propertyNames:c,
sources:l,
listenerIds:i,
arrayIndexValues:d,
targetObject:e,
targetPropertyChain:f,
options:g,
listeners:m},p=qx.lang.Function.bind(this.__1Iz7A,this,s);
m.push(p);
i[a]=b.addListener(h[a],p)}b=b["get"+qx.lang.String.firstUp(c[a])]==null?null:d[a]!==""?b["get"+qx.lang.String.firstUp(c[a])](d[a]):b["get"+qx.lang.String.firstUp(c[a])]();
if(!b)break}o={type:"deepBinding",
listenerIds:i,
sources:l,
targetListenerIds:n.listenerIds,
targets:n.targets};
this.__WkcCN(o,j,k,e,f);
return o},
__1Iz7A:function(a){a.options&&a.options.onUpdate&&a.options.onUpdate(a.sources[a.index],a.targetObject);
for(var b=a.index+1,c,f,d,e,g;
b<a.propertyNames.length;
b++){c=a.sources[b];
a.sources[b]=null;
if(!c)continue;
c.removeListenerById(a.listenerIds[b])}c=a.sources[a.index],b=a.index+1;
for(;
b<a.propertyNames.length;
b++){c=a.arrayIndexValues[b-1]!==""?c["get"+qx.lang.String.firstUp(a.propertyNames[b-1])](a.arrayIndexValues[b-1]):c["get"+qx.lang.String.firstUp(a.propertyNames[b-1])]();
a.sources[b]=c;
if(!c){this.__bqjDrC(a.targetObject,a.targetPropertyChain);
break}if(b==a.propertyNames.length-1){if(qx.Class.implementsInterface(c,qx.data.IListData)){f=a.arrayIndexValues[b]==="last"?c.length-1:a.arrayIndexValues[b],d=c.getItem(f);
this.__bhsdHi(d,a.targetObject,a.targetPropertyChain,a.options,a.sources[a.index]);
a.listenerIds[b]=this.__bPE918(c,"change",a.targetObject,a.targetPropertyChain,a.options,a.arrayIndexValues[b])}else{if(a.propertyNames[b]!=null&&c["get"+qx.lang.String.firstUp(a.propertyNames[b])]!=null){d=c["get"+qx.lang.String.firstUp(a.propertyNames[b])]();
this.__bhsdHi(d,a.targetObject,a.targetPropertyChain,a.options,a.sources[a.index])}e=this.__cvbO3u(c,a.propertyNames[b]);
a.listenerIds[b]=this.__bPE918(c,e,a.targetObject,a.targetPropertyChain,a.options)}}else{if(a.listeners[b]==null){g=qx.lang.Function.bind(this.__1Iz7A,this,a);
a.listeners.push(g)}if(qx.Class.implementsInterface(c,qx.data.IListData))e="change";
else e=this.__cvbO3u(c,a.propertyNames[b]);
a.listenerIds[b]=c.addListener(e,a.listeners[b])}}},
__bGuuQ2:function(o,n,k,l,m){for(var c=l.split("."),e=this.__duzi0s(c),d=[],f=[],g=[],h=[],b=k,a=0,i,j;
a<c.length-1;
a++){if(e[a]!=="")h.push("change");
else try{h.push(this.__cvbO3u(b,c[a]))}catch(p){break}d[a]=b;
i=function(){for(var b=a+1,h,j,p,q;
b<c.length-1;
b++){h=d[b];
d[b]=null;
if(!h)continue;
h.removeListenerById(g[b])}h=d[a],b=a+1;
for(;
b<c.length-1;
b++){j=qx.lang.String.firstUp(c[b-1]);
if(e[b-1]!==""){p=e[b-1]==="last"?h.getLength()-1:e[b-1];
h=h["get"+j](p)}else h=h["get"+j]();
d[b]=h;
f[b]==null&&f.push(i);
if(qx.Class.implementsInterface(h,qx.data.IListData))q="change";
else try{q=qx.data.SingleValueBinding.__cvbO3u(h,c[b])}catch(r){break}g[b]=h.addListener(q,f[b])}qx.data.SingleValueBinding.__V2BuL(o,n,k,l,m)};
f.push(i);
g[a]=b.addListener(h[a],i);
j=qx.lang.String.firstUp(c[a]);
b=b["get"+j]==null?null:e[a]!==""?b["get"+j](e[a]):b["get"+j]();
if(!b)break}return{listenerIds:g,
targets:d}},
__V2BuL:function(k,b,g,h,i){var d=this.__bFIEk5(k,b),a,f,j,c,e;
if(d!=null){a=b.substring(b.lastIndexOf(".")+1,b.length);
if(a.charAt(a.length-1)=="]"){f=a.substring(a.lastIndexOf("[")+1,a.length-1),j=a.substring(0,a.lastIndexOf("[")),c=d["get"+qx.lang.String.firstUp(j)]();
f=="last"&&(f=c.length-1);
if(c!=null)e=c.getItem(f)}else e=d["get"+qx.lang.String.firstUp(a)]()}e=qx.data.SingleValueBinding.__WDr3p(e,g,h,i);
this.__9Oqo7(g,h,e)},
__cvbO3u:function(b,a){var c=this.__bP8jdF(b,a);
if(c==null){if(qx.Class.supportsEvent(b.constructor,a))c=a;
else if(qx.Class.supportsEvent(b.constructor,"change"+qx.lang.String.firstUp(a)))c="change"+qx.lang.String.firstUp(a);
else throw new qx.core.AssertionError("Binding property "+a+" of object "+b+" not possible: No event available. ")}return c},
__bqjDrC:function(d,b){var c=this.__bFIEk5(d,b),a;
if(c!=null){a=b.substring(b.lastIndexOf(".")+1,b.length);
if(a.charAt(a.length-1)=="]"){this.__9Oqo7(d,b,null);
return}c["reset"+qx.lang.String.firstUp(a)]!=undefined?c["reset"+qx.lang.String.firstUp(a)]():c["set"+qx.lang.String.firstUp(a)](null)}},
__9Oqo7:function(g,b,f){var d=this.__bFIEk5(g,b),a,e,h,c;
if(d!=null){a=b.substring(b.lastIndexOf(".")+1,b.length);
if(a.charAt(a.length-1)=="]"){e=a.substring(a.lastIndexOf("[")+1,a.length-1),h=a.substring(0,a.lastIndexOf("[")),c=d["get"+qx.lang.String.firstUp(h)]();
e=="last"&&(e=c.length-1);
c!=null&&c.setItem(e,f)}else d["set"+qx.lang.String.firstUp(a)](f)}},
__bFIEk5:function(f,g){for(var e=g.split("."),b=f,d=0,a,c;
d<e.length-1;
d++)try{a=e[d];
if(a.indexOf("]")==a.length-1){c=a.substring(a.indexOf("[")+1,a.length-1);
a=a.substring(0,a.indexOf("["))}b=b["get"+qx.lang.String.firstUp(a)]();
c!=null&&(c=="last"&&(c=b.length-1),b=b.getItem(c),c=null)}catch(h){return null}return b},
__bhsdHi:function(a,c,e,b,f){a=this.__WDr3p(a,c,e,b);
a===undefined&&this.__bqjDrC(c,e);
if(a!==undefined)try{this.__9Oqo7(c,e,a);
b&&b.onUpdate&&b.onUpdate(f,c,a)}catch(d){if(!(d instanceof qx.core.ValidationError))throw d;
b&&b.onSetFail?b.onSetFail(d):qx.log.Logger.warn("Failed so set value "+a+" on "+c+". Error message: "+d)}},
__duzi0s:function(c){for(var d=[],b=0,a,e;
b<c.length;
b++){a=c[b];
if(qx.lang.String.endsWith(a,"]")){e=a.substring(a.indexOf("[")+1,a.indexOf("]"));
if(a.indexOf("]")!=a.length-1)throw new Error("Please use only one array at a time: "+a+" does not work.");
if(e!=="last")if(e==""||isNaN(parseInt(e)))throw new Error("No number or 'last' value hast been given in a array binding: "+a+" does not work.");
a.indexOf("[")!=0?(c[b]=a.substring(0,a.indexOf("[")),d[b]="",d[b+1]=e,c.splice(b+1,0,"item"),b++):(d[b]=e,c.splice(b,1,"item"))}else d[b]=""}return d},
__bPE918:function(a,e,c,d,b,f){{var h=qx.Class.getEventType(a.constructor,e),g,i;
qx.core.Assert.assertEquals("qx.event.type.Data",h,e+" is not an data (qx.event.type.Data) event on "+a+".")}g=function(h,g){if(h!==""){h==="last"&&(h=a.length-1);
var f=a.getItem(h),j,i;
f===undefined&&qx.data.SingleValueBinding.__bqjDrC(c,d);
j=g.getData().start,i=g.getData().end;
if(h<j||h>i)return}else f=g.getData();
qx.data.SingleValueBinding.DEBUG_ON&&(qx.log.Logger.debug("Binding executed from "+a+" by "+e+" to "+c+" ("+d+")"),qx.log.Logger.debug("Data before conversion: "+f));
f=qx.data.SingleValueBinding.__WDr3p(f,c,d,b);
qx.data.SingleValueBinding.DEBUG_ON&&qx.log.Logger.debug("Data after conversion: "+f);
try{f!==undefined?qx.data.SingleValueBinding.__9Oqo7(c,d,f):qx.data.SingleValueBinding.__bqjDrC(c,d);
b&&b.onUpdate&&b.onUpdate(a,c,f)}catch(g){if(!(g instanceof qx.core.ValidationError))throw g;
b&&b.onSetFail?b.onSetFail(g):qx.log.Logger.warn("Failed so set value "+f+" on "+c+". Error message: "+g)}};
f||(f="");
g=qx.lang.Function.bind(g,a,f);
i=a.addListener(e,g);
return i},
__WkcCN:function(b,a,d,c,e){this.__yQrBp[a.toHashCode()]===undefined&&(this.__yQrBp[a.toHashCode()]=[]);
this.__yQrBp[a.toHashCode()].push([b,a,d,c,e])},
__WDr3p:function(d,b,a,c){if(c&&c.converter){var f,g,h,e,i;
b.getModel&&(f=b.getModel());
return c.converter(d,f)}g=this.__bFIEk5(b,a),h=a.substring(a.lastIndexOf(".")+1,a.length);
if(g==null)return d;
e=qx.core.property.Util.getPropertyDefinition(g.constructor,h),i=e==null?"":e.check;
return this.__byBiP0(d,i)},
__bP8jdF:function(c,b){var a=qx.core.property.Util.getPropertyDefinition(c.constructor,b);
if(a==null)return null;
return a.event},
__byBiP0:function(a,c){var b=qx.lang.Type.getClass(a);
(b=="Number"||b=="String")&&(c=="Integer"||c=="PositiveInteger")&&(a=parseInt(a));
(b=="Boolean"||b=="Number"||b=="Date")&&c=="String"&&(a=a+"");
(b=="Number"||b=="String")&&(c=="Number"||c=="PositiveNumber")&&(a=parseFloat(a));
return a},
removeBindingFromObject:function(d,b){if(b.type=="deepBinding"){for(var a=0,c;
a<b.sources.length;
a++)b.sources[a]&&b.sources[a].removeListenerById(b.listenerIds[a]);
for(a=0;
a<b.targets.length;
a++)b.targets[a]&&b.targets[a].removeListenerById(b.targetListenerIds[a])}else d.removeListenerById(b);
c=this.__yQrBp[d.toHashCode()];
if(c!=undefined)for(a=0;
a<c.length;
a++)if(c[a][0]==b){qx.lang.Array.remove(c,c[a]);
return}throw new Error("Binding could not be found!")},
removeAllBindingsForObject:function(a){qx.core.Assert.assertNotNull(a,"Can not remove the bindings for null object!");
var b=this.__yQrBp[a.toHashCode()],c;
if(b!=undefined)for(c=b.length-1;
c>=0;
c--)this.removeBindingFromObject(a,b[c][0])},
getAllBindingsForObject:function(a){this.__yQrBp[a.toHashCode()]===undefined&&(this.__yQrBp[a.toHashCode()]=[]);
return this.__yQrBp[a.toHashCode()]},
removeAllBindings:function(){for(a in this.__yQrBp){var b=qx.core.ObjectRegistry.fromHashCode(a),a;
if(b==null){delete this.__yQrBp[a];
continue}this.removeAllBindingsForObject(b)}this.__yQrBp={}},
getAllBindings:function(){return this.__yQrBp},
showBindingInLog:function(c,d){for(var a,b=0,e;
b<this.__yQrBp[c.toHashCode()].length;
b++)if(this.__yQrBp[c.toHashCode()][b][0]==d){a=this.__yQrBp[c.toHashCode()][b];
break}if(a===undefined)e="Binding does not exist!";
else e="Binding from '"+a[1]+"' ("+a[2]+") to the object '"+a[3]+"' ("+a[4]+").";
qx.log.Logger.debug(e)},
showAllBindingsInLog:function(){for(a in this.__yQrBp){for(var c=qx.core.ObjectRegistry.fromHashCode(a),b=0,a;
b<this.__yQrBp[a].length;
b++)this.showBindingInLog(c,this.__yQrBp[a][b][0])}}}});


// qx.data.MBinding
//   - size: 393 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 5x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.data.SingleValueBinding.bind, 1x
//       qx.data.SingleValueBinding.getAllBindingsForObject, 1x
//       qx.data.SingleValueBinding.removeAllBindingsForObject, 1x
//       qx.data.SingleValueBinding.removeBindingFromObject, 1x
qx.Mixin.define("qx.data.MBinding",{members:{bind:function(d,a,c,b){return qx.data.SingleValueBinding.bind(this,d,a,c,b)},
removeBinding:function(a){qx.data.SingleValueBinding.removeBindingFromObject(this,a)},
removeAllBindings:function(){qx.data.SingleValueBinding.removeAllBindingsForObject(this)},
getBindings:function(){return qx.data.SingleValueBinding.getAllBindingsForObject(this)}}});


// qx.event.handler.Appear
//   - size: 1218 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 11x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.core.ObjectRegistry.toHashCode, 2x
//       qx.event.IEventHandler, 1x
//       qx.event.IEventHandler.TARGET_DOMNODE, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addHandler, 1x
//       qx.event.Registration.createEvent, 1x
//       qx.event.handler.Appear.__instances, 2x
qx.Class.define("qx.event.handler.Appear",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(a){this.base(arguments);
this.__ugn3e=a;
this.__uMPPx={};
qx.event.handler.Appear.__EDzvv[this.$$hash]=this},
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,
SUPPORTED_TYPES:{appear:true,
disappear:true},
TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,
IGNORE_CAN_HANDLE:true,
__EDzvv:{},
refresh:function(){var b=this.__EDzvv,a;
for(a in b)b[a].refresh()}},
members:{__ugn3e:null,
__uMPPx:null,
canHandleEvent:function(a,b){},
registerEvent:function(a,d,e){var c=qx.core.ObjectRegistry.toHashCode(a)+d,b=this.__uMPPx;
b&&!b[c]&&(b[c]=a,a.$$displayed=a.offsetWidth>0)},
unregisterEvent:function(c,d,e){var b=qx.core.ObjectRegistry.toHashCode(c)+d,a=this.__uMPPx;
if(!a)return;
a[b]&&delete a[b]},
refresh:function(){var d=this.__uMPPx,a,c,b,e;
for(c in d){a=d[c];
b=a.offsetWidth>0;
if(!!a.$$displayed!==b){a.$$displayed=b;
e=qx.event.Registration.createEvent(b?"appear":"disappear");
this.__ugn3e.dispatchEvent(a,e)}}}},
destruct:function(){this.__ugn3e=this.__uMPPx=null;
delete qx.event.handler.Appear.__EDzvv[this.$$hash]},
defer:function(a){qx.event.Registration.addHandler(a)}});


// qx.event.handler.Application
//   - size: 2313 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       document, 2x
//       qx, 25x
//   - packages:
//       document.readyState, 2x
//       qx.$$domReady, 1x
//       qx.$$loader, 2x
//       qx.$$loader.scriptLoaded, 1x
//       qx.Class.define, 1x
//       qx.Class.getByName, 1x
//       qx.bom.Event.addNativeListener, 3x
//       qx.bom.Event.removeNativeListener, 2x
//       qx.core.Object, 1x
//       qx.core.ObjectRegistry.shutdown, 1x
//       qx.event.GlobalError.observeMethod, 2x
//       qx.event.IEventHandler, 1x
//       qx.event.IEventHandler.TARGET_WINDOW, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addHandler, 1x
//       qx.event.Registration.fireEvent, 2x
//       qx.event.handler.Application.$$instance, 2x
//       qx.lang.Function.bind, 2x
qx.Class.define("qx.event.handler.Application",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(a){this.base(arguments);
this._window=a.getWindow();
this.__yqR20=false;
this.__qffIa=false;
this._initObserver();
qx.event.handler.Application.$$instance=this},
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,
SUPPORTED_TYPES:{ready:1,
shutdown:1},
TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,
IGNORE_CAN_HANDLE:true,
onScriptLoaded:function(){var a=qx.event.handler.Application.$$instance;
a&&a.__DpoWQ()}},
members:{canHandleEvent:function(a,b){},
registerEvent:function(a,b,c){},
unregisterEvent:function(a,b,c){},
__t0Ige:null,
__yqR20:null,
__qffIa:null,
__Jjo4x:null,
__DpoWQ:function(){if(!this.__t0Ige&&this.__yqR20&&qx.$$loader&&qx.$$loader.scriptLoaded){try{var a="apiviewer.Application";
if(!qx.Class.getByName(a))return}catch(b){}this.__t0Ige=true,qx.event.Registration.fireEvent(this._window,"ready")}},
isApplicationReady:function(){return this.__t0Ige},
_initObserver:function(){qx.$$domReady||document.readyState=="complete"||document.readyState=="ready"?(this.__yqR20=true,this.__DpoWQ()):(this._onNativeLoadWrapped=qx.lang.Function.bind(this._onNativeLoad,this),qx.bom.Event.addNativeListener(this._window,"DOMContentLoaded",this._onNativeLoadWrapped),qx.bom.Event.addNativeListener(this._window,"load",this._onNativeLoadWrapped));
this._onNativeUnloadWrapped=qx.lang.Function.bind(this._onNativeUnload,this);
qx.bom.Event.addNativeListener(this._window,"unload",this._onNativeUnloadWrapped)},
_stopObserver:function(){this._onNativeLoadWrapped&&qx.bom.Event.removeNativeListener(this._window,"load",this._onNativeLoadWrapped);
qx.bom.Event.removeNativeListener(this._window,"unload",this._onNativeUnloadWrapped);
this._onNativeLoadWrapped=null;
this._onNativeUnloadWrapped=null},
_onNativeLoad:qx.event.GlobalError.observeMethod(function(){qx.$$loader={scriptLoaded:true};
this.__yqR20=true;
this.__DpoWQ()}),
_onNativeUnload:qx.event.GlobalError.observeMethod(function(){if(!this.__Jjo4x){this.__Jjo4x=true;
try{qx.event.Registration.fireEvent(this._window,"shutdown")}catch(a){throw a}finally{qx.core.ObjectRegistry.shutdown()}}})},
destruct:function(){this._stopObserver();
this._window=null},
defer:function(a){qx.event.Registration.addHandler(a)}});


// qx.event.handler.UserAction
//   - size: 607 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.IEventHandler, 1x
//       qx.event.IEventHandler.TARGET_WINDOW, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addHandler, 1x
qx.Class.define("qx.event.handler.UserAction",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(a){this.base(arguments);
this.__ugn3e=a;
this.__qOaV1=a.getWindow()},
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,
SUPPORTED_TYPES:{useraction:1},
TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,
IGNORE_CAN_HANDLE:true},
members:{__ugn3e:null,
__qOaV1:null,
canHandleEvent:function(a,b){},
registerEvent:function(a,b,c){},
unregisterEvent:function(a,b,c){}},
destruct:function(){this.__ugn3e=this.__qOaV1=null},
defer:function(a){qx.event.Registration.addHandler(a)}});


// qx.event.dispatch.DomBubbling
//   - size: 347 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 4x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addDispatcher, 1x
//       qx.event.dispatch.AbstractBubbling, 1x
qx.Class.define("qx.event.dispatch.DomBubbling",{extend:qx.event.dispatch.AbstractBubbling,
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL},
members:{_getParent:function(a){return a.parentNode},
canDispatchEvent:function(b,a,c){return b.nodeType!==undefined&&a.getBubbles()}},
defer:function(a){qx.event.Registration.addDispatcher(a)}});


// qx.event.handler.DragDrop
//   - size: 5607 bytes
//   - modified: 2010-11-02T15:57:47
//   - names:
//       Error, 3x
//       Math, 2x
//       qx, 10x
//       window, 2x
//   - packages:
//       Math.abs, 2x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.IEventHandler, 1x
//       qx.event.Registration, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addHandler, 1x
//       qx.event.Registration.addListener, 1x
//       qx.event.Registration.removeListener, 1x
//       qx.event.Timer.once, 1x
//       qx.event.type.Drag, 1x
qx.Class.define("qx.event.handler.DragDrop",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(a){this.base(arguments);
this.__ugn3e=a;
this.__jO4QN=a.getWindow().document.documentElement;
this.__ugn3e.addListener(this.__jO4QN,"mousedown",this._onMouseDown,this);
this.__bAf88A()},
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,
SUPPORTED_TYPES:{dragstart:1,
dragend:1,
dragover:1,
dragleave:1,
drop:1,
drag:1,
dragchange:1,
droprequest:1},
IGNORE_CAN_HANDLE:true},
members:{__ugn3e:null,
__jO4QN:null,
__JuW8d:null,
__IIPzc:null,
__nhP4O:null,
__upsFE:null,
__jElWp:null,
__mg8Up:null,
__QxTSG:null,
__3ofy8:null,
__3AlIx:false,
__EuLWe:0,
__zE2BE:0,
canHandleEvent:function(a,b){},
registerEvent:function(a,b,c){},
unregisterEvent:function(a,b,c){},
addType:function(a){this.__nhP4O[a]=true},
addAction:function(a){this.__upsFE[a]=true},
supportsType:function(a){return!!this.__nhP4O[a]},
supportsAction:function(a){return!!this.__upsFE[a]},
getData:function(a){if(!this.__DMu3I||!this.__JuW8d)throw new Error("This method must not be used outside the drop event listener!");
if(!this.__nhP4O[a])throw new Error("Unsupported data type: "+a+"!");
this.__mg8Up[a]||(this.__QxTSG=a,this.__DxEp1("droprequest",this.__IIPzc,this.__JuW8d,false));
if(!this.__mg8Up[a])throw new Error("Please use a droprequest listener to the drag source to fill the manager with data!");
return this.__mg8Up[a]||null},
getCurrentAction:function(){return this.__3ofy8},
addData:function(b,a){this.__mg8Up[b]=a},
getCurrentType:function(){return this.__QxTSG},
isSessionActive:function(){return this.__3AlIx},
__bAf88A:function(){this.__nhP4O={};
this.__upsFE={};
this.__jElWp={};
this.__mg8Up={}},
__UZHWQ:function(){if(this.__IIPzc==null)return;
var b=this.__upsFE,c=this.__jElWp,a=null;
this.__DMu3I&&(c.Shift&&c.Ctrl&&b.alias?a="alias":c.Shift&&c.Alt&&b.copy?a="copy":c.Shift&&b.move?a="move":c.Alt&&b.alias?a="alias":c.Ctrl&&b.copy?a="copy":b.move?a="move":b.copy?a="copy":b.alias&&(a="alias"));
a!=this.__3ofy8&&(this.__3ofy8=a,this.__DxEp1("dragchange",this.__IIPzc,this.__JuW8d,false))},
__DxEp1:function(f,c,b,g,e){var a=qx.event.Registration,d=a.createEvent(f,qx.event.type.Drag,[g,e]);
c!==b&&d.setRelatedTarget(b);
return a.dispatchEvent(c,d)},
__0WJBd:function(a){while(a&&a.nodeType==1){if(a.getAttribute("qxDraggable")=="on")return a;
a=a.parentNode}return null},
__1OUe5:function(a){while(a&&a.nodeType==1){if(a.getAttribute("qxDroppable")=="on")return a;
a=a.parentNode}return null},
__DifF0:function(){this.__IIPzc=null;
this.__ugn3e.removeListener(this.__jO4QN,"mousemove",this._onMouseMove,this,true);
this.__ugn3e.removeListener(this.__jO4QN,"mouseup",this._onMouseUp,this,true);
qx.event.Registration.removeListener(window,"blur",this._onWindowBlur,this);
this.__bAf88A()},
__VgcS6:function(){this.__3AlIx&&(this.__ugn3e.removeListener(this.__jO4QN,"mouseover",this._onMouseOver,this,true),this.__ugn3e.removeListener(this.__jO4QN,"mouseout",this._onMouseOut,this,true),this.__ugn3e.removeListener(this.__jO4QN,"keydown",this._onKeyDown,this,true),this.__ugn3e.removeListener(this.__jO4QN,"keyup",this._onKeyUp,this,true),this.__DxEp1("dragend",this.__IIPzc,this.__JuW8d,false),this.__3AlIx=false);
this.__DMu3I=false;
this.__JuW8d=null;
this.__DifF0()},
__DMu3I:false,
_onWindowBlur:function(a){this.__VgcS6()},
_onKeyDown:function(b){var a=b.getKeyIdentifier();
switch(a){case"Alt":case"Ctrl":case"Shift":this.__jElWp[a]||(this.__jElWp[a]=true,this.__UZHWQ())}},
_onKeyUp:function(b){var a=b.getKeyIdentifier();
switch(a){case"Alt":case"Ctrl":case"Shift":this.__jElWp[a]&&(this.__jElWp[a]=false,this.__UZHWQ())}},
_onMouseDown:function(a){if(this.__3AlIx)return;
var b=this.__0WJBd(a.getTarget());
b&&(this.__EuLWe=a.getDocumentLeft(),this.__zE2BE=a.getDocumentTop(),this.__IIPzc=b,this.__ugn3e.addListener(this.__jO4QN,"mousemove",this._onMouseMove,this,true),this.__ugn3e.addListener(this.__jO4QN,"mouseup",this._onMouseUp,this,true),qx.event.Registration.addListener(window,"blur",this._onWindowBlur,this))},
_onMouseUp:function(a){this.__DMu3I&&this.__DxEp1("drop",this.__JuW8d,this.__IIPzc,false,a);
this.__3AlIx&&a.stopPropagation();
this.__VgcS6()},
_onMouseMove:function(a){if(this.__3AlIx)this.__DxEp1("drag",this.__IIPzc,this.__JuW8d,true,a)||this.__VgcS6();
else if(Math.abs(a.getDocumentLeft()-this.__EuLWe)>3||Math.abs(a.getDocumentTop()-this.__zE2BE)>3){if(this.__DxEp1("dragstart",this.__IIPzc,this.__JuW8d,true,a)){this.__3AlIx=true;
this.__ugn3e.addListener(this.__jO4QN,"mouseover",this._onMouseOver,this,true);
this.__ugn3e.addListener(this.__jO4QN,"mouseout",this._onMouseOut,this,true);
this.__ugn3e.addListener(this.__jO4QN,"keydown",this._onKeyDown,this,true);
this.__ugn3e.addListener(this.__jO4QN,"keyup",this._onKeyUp,this,true);
var b=this.__jElWp;
b.Ctrl=a.isCtrlPressed();
b.Shift=a.isShiftPressed();
b.Alt=a.isAltPressed();
this.__UZHWQ()}else this.__DxEp1("dragend",this.__IIPzc,this.__JuW8d,false),this.__DifF0()}},
_onMouseOver:function(b){var c=b.getTarget(),a=this.__1OUe5(c);
a&&a!=this.__JuW8d&&(this.__DMu3I=this.__DxEp1("dragover",a,this.__IIPzc,true,b),this.__JuW8d=a,this.__UZHWQ())},
_onMouseOut:function(b){var a=this.__1OUe5(b.getTarget()),c=this.__1OUe5(b.getRelatedTarget());
a&&a!==c&&a==this.__JuW8d&&(this.__DxEp1("dragleave",this.__JuW8d,c,false,b),this.__JuW8d=null,this.__DMu3I=false,qx.event.Timer.once(this.__UZHWQ,this,0))}},
destruct:function(){this.__IIPzc=this.__JuW8d=this.__ugn3e=this.__jO4QN=this.__nhP4O=this.__upsFE=this.__jElWp=this.__mg8Up=null},
defer:function(a){qx.event.Registration.addHandler(a)}});


// qx.event.type.Drag
//   - size: 1149 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.Registration.getManager, 1x
//       qx.event.handler.DragDrop, 1x
//       qx.event.type.Event, 1x
qx.Class.define("qx.event.type.Drag",{extend:qx.event.type.Event,
members:{init:function(b,a){this.base(arguments,true,b);
a?(this._native=a.getNativeEvent()||null,this._originalTarget=a.getTarget()||null):(this._native=null,this._originalTarget=null);
return this},
clone:function(b){var a=this.base(arguments,b);
a._native=this._native;
return a},
getDocumentLeft:function(){if(this._native==null)return 0;
return this._native.pageX},
getDocumentTop:function(){if(this._native==null)return 0;
return this._native.pageY},
getManager:function(){return qx.event.Registration.getManager(this.getTarget()).getHandler(qx.event.handler.DragDrop)},
addType:function(a){this.getManager().addType(a)},
addAction:function(a){this.getManager().addAction(a)},
supportsType:function(a){return this.getManager().supportsType(a)},
supportsAction:function(a){return this.getManager().supportsAction(a)},
addData:function(b,a){this.getManager().addData(b,a)},
getData:function(a){return this.getManager().getData(a)},
getCurrentType:function(){return this.getManager().getCurrentType()},
getCurrentAction:function(){return this.getManager().getCurrentAction()}}});


// qx.event.handler.Window
//   - size: 1504 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 15x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Event.addNativeListener, 1x
//       qx.bom.Event.removeNativeListener, 1x
//       qx.core.Object, 1x
//       qx.event.GlobalError.observeMethod, 1x
//       qx.event.IEventHandler, 1x
//       qx.event.IEventHandler.TARGET_WINDOW, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addHandler, 1x
//       qx.event.Registration.createEvent, 1x
//       qx.event.Registration.dispatchEvent, 1x
//       qx.event.handler.Window.SUPPORTED_TYPES, 2x
//       qx.event.type.Native, 1x
//       qx.lang.Function.listener, 1x
qx.Class.define("qx.event.handler.Window",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(a){this.base(arguments);
this._manager=a;
this._window=a.getWindow();
this._initWindowObserver()},
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,
SUPPORTED_TYPES:{error:1,
load:1,
beforeunload:1,
unload:1,
resize:1,
scroll:1,
beforeshutdown:1},
TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,
IGNORE_CAN_HANDLE:true},
members:{canHandleEvent:function(a,b){},
registerEvent:function(a,b,c){},
unregisterEvent:function(a,b,c){},
_initWindowObserver:function(){this._onNativeWrapper=qx.lang.Function.listener(this._onNative,this);
var b=qx.event.handler.Window.SUPPORTED_TYPES,a;
for(a in b)qx.bom.Event.addNativeListener(this._window,a,this._onNativeWrapper)},
_stopWindowObserver:function(){var b=qx.event.handler.Window.SUPPORTED_TYPES,a;
for(a in b)qx.bom.Event.removeNativeListener(this._window,a,this._onNativeWrapper)},
_onNative:qx.event.GlobalError.observeMethod(function(a){if(this.isDisposed())return;
var b=this._window,f,g,c,e,d;
try{f=b.document}catch(a){return}g=f.documentElement,c=a.target||a.srcElement;
if(c==null||c===b||c===f||c===g){e=qx.event.Registration.createEvent(a.type,qx.event.type.Native,[a,b]);
qx.event.Registration.dispatchEvent(b,e);
d=e.getReturnValue();
if(d!=null){a.returnValue=d;
return d}}})},
destruct:function(){this._stopWindowObserver();
this._manager=this._window=null},
defer:function(a){qx.event.Registration.addHandler(a)}});


// qx.bom.element.Decoration
//   - size: 4502 bytes
//   - modified: 2010-08-30T22:06:23
//   - names:
//       Error, 1x
//       isNaN, 2x
//       parseInt, 6x
//       qx, 22x
//       undefined, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Background.getStyles, 2x
//       qx.bom.element.Style, 1x
//       qx.bom.element.Style.compile, 1x
//       qx.io.ImageLoader.getFormat, 1x
//       qx.io.ImageLoader.getHeight, 1x
//       qx.io.ImageLoader.getWidth, 1x
//       qx.log.Logger.debug, 1x
//       qx.log.Logger.warn, 1x
//       qx.util.ResourceManager.getInstance, 12x
qx.Class.define("qx.bom.element.Decoration",{statics:{DEBUG:false,
__zFAHQ:{},
__7JJu3:false,
__bfU4LQ:null,
__bg787E:{"scale-x":"img",
"scale-y":"img",
scale:"img",
repeat:"div",
"no-repeat":"div",
"repeat-x":"div",
"repeat-y":"div"},
update:function(a,d,e,g){var c=this.getTagName(e,d),b,f;
if(c!=a.tagName.toLowerCase())throw new Error("Image modification not possible because elements could not be replaced at runtime anymore!");
b=this.getAttributes(d,e,g);
c==="img"&&(a.src=b.src||qx.util.ResourceManager.getInstance().toUri("qx/static/blank.gif"));
a.style.backgroundPosition!=""&&b.style.backgroundPosition===undefined&&(b.style.backgroundPosition=null);
a.style.clip!=""&&b.style.clip===undefined&&(b.style.clip=null);
f=qx.bom.element.Style;
f.setStyles(a,b.style);
if(this.__7JJu3)try{a.filters["DXImageTransform.Microsoft.AlphaImageLoader"].apply()}catch(h){}},
create:function(d,c,f){var e=this.getTagName(c,d),b=this.getAttributes(d,c,f),a=qx.bom.element.Style.compile(b.style);
return e==="img"?"<img src=\""+b.src+"\" style=\""+a+"\"/>":"<div style=\""+a+"\"></div>"},
getTagName:function(a,b){return this.__bg787E[a]},
getAttributes:function(c,a,b){b||(b={});
b.position||(b.position="absolute");
var e=qx.util.ResourceManager.getInstance().getImageFormat(c)||qx.io.ImageLoader.getFormat(c),d;
c!=null&&e==null&&qx.log.Logger.warn("ImageLoader: Not recognized format of external image '"+c+"'!");
d=this.__7JJu3&&this.__bfU4LQ[a]&&e==="png"?this.__bh1pXj(b,a,c):a==="scale"?this.__WvtC6(b,a,c):a==="scale-x"||a==="scale-y"?this.__bQY6AB(b,a,c):this.__ba283G(b,a,c);
return d},
__b2R3HN:function(a,c,b){a.width==null&&c!=null&&(a.width=c+"px");
a.height==null&&b!=null&&(a.height=b+"px");
return a},
__U05cf:function(a){var b=qx.util.ResourceManager.getInstance().getImageWidth(a)||qx.io.ImageLoader.getWidth(a),c=qx.util.ResourceManager.getInstance().getImageHeight(a)||qx.io.ImageLoader.getHeight(a);
return{width:b,
height:c}},
__bh1pXj:function(a,e,c){var b=this.__U05cf(c),d,f;
a=this.__b2R3HN(a,b.width,b.height);
d=e=="no-repeat"?"crop":"scale",f="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+qx.util.ResourceManager.getInstance().toUri(c)+"', sizingMethod='"+d+"')";
a.filter=f;
a.backgroundImage=a.backgroundRepeat="";
return{style:a}},
__WvtC6:function(a,e,c){var d=qx.util.ResourceManager.getInstance().toUri(c),b=this.__U05cf(c);
a=this.__b2R3HN(a,b.width,b.height);
return{src:d,
style:a}},
__bQY6AB:function(a,f,c){var d=qx.util.ResourceManager.getInstance(),h=d.isClippedImage(c),b=this.__U05cf(c),e,g;
if(h){e=d.getData(c),g=d.toUri(e[4]);
a=f==="scale-x"?this.__cVefep(a,e,b.height):this.__cVewhs(a,e,b.width);
return{src:g,
style:a}}this.__dJK7xk(c);
f=="scale-x"?a.height=b.height==null?null:b.height+"px":f=="scale-y"&&(a.width=b.width==null?null:b.width+"px");
g=d.toUri(c);
return{src:g,
style:a}},
__cVefep:function(a,b,c){var d=qx.util.ResourceManager.getInstance().getImageHeight(b[4]);
a.clip={top:-b[6],
height:c};
a.height=d+"px";
a.top!=null?a.top=(parseInt(a.top,10)+b[6])+"px":a.bottom!=null&&(a.bottom=(parseInt(a.bottom,10)+c-d-b[6])+"px");
return a},
__cVewhs:function(a,b,d){var c=qx.util.ResourceManager.getInstance().getImageWidth(b[4]);
a.clip={left:-b[5],
width:d};
a.width=c+"px";
a.left!=null?a.left=(parseInt(a.left,10)+b[5])+"px":a.right!=null&&(a.right=(parseInt(a.right,10)+d-c-b[5])+"px");
return a},
__ba283G:function(a,b,d){var h=qx.util.ResourceManager.getInstance().isClippedImage(d),c=this.__U05cf(d),e,g,f;
if(h&&b!=="repeat"){e=qx.util.ResourceManager.getInstance().getData(d),g=qx.bom.element.Background.getStyles(e[4],b,e[5],e[6]);
for(f in g)a[f]=g[f];
c.width!=null&&a.width==null&&(b=="repeat-y"||b==="no-repeat")&&(a.width=c.width+"px");
c.height!=null&&a.height==null&&(b=="repeat-x"||b==="no-repeat")&&(a.height=c.height+"px");
return{style:a}}b!=="repeat"&&this.__dJK7xk(d);
a=this.__b2R3HN(a,c.width,c.height);
a=this.__cJIofF(a,d,b);
return{style:a}},
__cJIofF:function(a,g,h){var d=null,b=null,c,f,e;
if(a.backgroundPosition){c=a.backgroundPosition.split(" ");
b=parseInt(c[0]);
isNaN(b)&&(b=c[0]);
d=parseInt(c[1]);
isNaN(d)&&(d=c[1])}f=qx.bom.element.Background.getStyles(g,h,b,d);
for(e in f)a[e]=f[e];
a.filter&&(a.filter="");
return a},
__dJK7xk:function(a){this.DEBUG&&qx.util.ResourceManager.getInstance().has(a)&&a.indexOf("qx/icon")==-1&&(this.__zFAHQ[a]||(qx.log.Logger.debug("Potential clipped image candidate: "+a),this.__zFAHQ[a]=true))},
isAlphaImageLoaderEnabled:function(){return false}}});


// qx.event.dispatch.MouseCapture
//   - size: 1850 bytes
//   - modified: 2010-11-02T16:11:35
//   - names:
//       qx, 12x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Event.addNativeListener, 1x
//       qx.bom.Event.removeNativeListener, 1x
//       qx.bom.client.Engine.MSHTML, 1x
//       qx.dom.Hierarchy.contains, 1x
//       qx.event.Registration.PRIORITY_FIRST, 1x
//       qx.event.Registration.addDispatcher, 1x
//       qx.event.dispatch.AbstractBubbling, 1x
//       qx.event.type.Event, 2x
//       qx.lang.Function.empty, 2x
qx.Class.define("qx.event.dispatch.MouseCapture",{extend:qx.event.dispatch.AbstractBubbling,
construct:function(a,b){this.base(arguments,a);
this.__qOaV1=a.getWindow();
this.__W9lJC=b;
a.addListener(this.__qOaV1,"blur",this.releaseCapture,this);
a.addListener(this.__qOaV1,"focus",this.releaseCapture,this);
a.addListener(this.__qOaV1,"scroll",this.releaseCapture,this)},
statics:{PRIORITY:qx.event.Registration.PRIORITY_FIRST},
members:{__W9lJC:null,
__90fvJ:null,
__bqnt8k:true,
__qOaV1:null,
_getParent:function(a){return a.parentNode},
canDispatchEvent:function(c,b,a){return this.__90fvJ&&this.__21HyC[a]},
dispatchEvent:function(a,b,c){if(c=="click"){b.stopPropagation();
this.releaseCapture();
return}(this.__bqnt8k||!qx.dom.Hierarchy.contains(this.__90fvJ,a))&&(a=this.__90fvJ);
this.base(arguments,a,b,c)},
__21HyC:{mouseup:1,
mousedown:1,
click:1,
dblclick:1,
mousemove:1,
mouseout:1,
mouseover:1},
activateCapture:function(a,b){var b=b!==false,c;
if(this.__90fvJ===a&&this.__bqnt8k==b)return;
this.__90fvJ&&this.releaseCapture();
this.nativeSetCapture(a,b);
if(this.hasNativeCapture){c=this;
qx.bom.Event.addNativeListener(a,"losecapture",function(){qx.bom.Event.removeNativeListener(a,"losecapture",arguments.callee);
c.releaseCapture()})}this.__bqnt8k=b;
this.__90fvJ=a;
this.__W9lJC.fireEvent(a,"capture",qx.event.type.Event,[true,false])},
getCaptureElement:function(){return this.__90fvJ},
releaseCapture:function(){var a=this.__90fvJ;
if(!a)return;
this.__90fvJ=null;
this.__W9lJC.fireEvent(a,"losecapture",qx.event.type.Event,[true,false]);
this.nativeReleaseCapture(a)},
hasNativeCapture:qx.bom.client.Engine.MSHTML,
nativeSetCapture:qx.lang.Function.empty,
nativeReleaseCapture:qx.lang.Function.empty},
destruct:function(){this.__90fvJ=this.__qOaV1=this.__W9lJC=null},
defer:function(a){qx.event.Registration.addDispatcher(a)}});


// qx.core.Init
//   - size: 908 bytes
//   - modified: 2010-11-02T15:56:44
//   - names:
//       Date, 5x
//       qx, 10x
//       window, 3x
//   - packages:
//       qx.Bootstrap.LOADSTART, 1x
//       qx.Class.define, 1x
//       qx.Class.getByName, 1x
//       qx.event.Registration.addListener, 3x
//       qx.log.Logger.debug, 3x
//       qx.log.Logger.warn, 1x
qx.Class.define("qx.core.Init",{statics:{getApplication:function(){return this.__PJiSt||null},
ready:function(){if(this.__PJiSt)return;
qx.log.Logger.debug(this,"Load runtime: "+(new Date-qx.Bootstrap.LOADSTART)+"ms");
var b="apiviewer.Application",a=qx.Class.getByName(b),c;
if(a){this.__PJiSt=new a;
c=new Date;
this.__PJiSt.main();
qx.log.Logger.debug(this,"Main runtime: "+(new Date-c)+"ms");
c=new Date;
this.__PJiSt.finalize();
qx.log.Logger.debug(this,"Finalize runtime: "+(new Date-c)+"ms")}else qx.log.Logger.warn("Missing application class: "+b)},
__mJbUf:function(b){var a=this.__PJiSt;
a&&b.setReturnValue(a.close())},
__z0dnz:function(){var a=this.__PJiSt;
a&&a.terminate()}},
defer:function(a){qx.event.Registration.addListener(window,"ready",a.ready,a);
qx.event.Registration.addListener(window,"shutdown",a.__z0dnz,a);
qx.event.Registration.addListener(window,"beforeunload",a.__mJbUf,a)}});


// qx.event.handler.Focus
//   - size: 4848 bytes
//   - modified: 2010-11-02T16:12:02
//   - names:
//       qx, 25x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Event.preventDefault, 2x
//       qx.bom.element.Attribute.get, 1x
//       qx.core.Object, 1x
//       qx.event.GlobalError.observeMethod, 9x
//       qx.event.IEventHandler, 1x
//       qx.event.Registration, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addHandler, 1x
//       qx.event.handler.Focus.FOCUSABLE_ELEMENTS, 1x
//       qx.event.type.Focus, 1x
//       qx.lang.Function.listener, 5x
qx.Class.define("qx.event.handler.Focus",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(a){this.base(arguments);
this._manager=a;
this._window=a.getWindow();
this._document=this._window.document;
this._root=this._document.documentElement;
this._body=this._document.body;
this._initObserver()},
properties:{active:{apply:"_applyActive",
nullable:true},
focus:{apply:"_applyFocus",
nullable:true}},
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,
SUPPORTED_TYPES:{focus:1,
blur:1,
focusin:1,
focusout:1,
activate:1,
deactivate:1},
IGNORE_CAN_HANDLE:true,
FOCUSABLE_ELEMENTS:{a:1,
body:1,
button:1,
frame:1,
iframe:1,
img:1,
input:1,
object:1,
select:1,
textarea:1}},
members:{__cJoRML:null,
__cl8Rgc:null,
__b0rUZ6:null,
__bQkXsP:null,
__c6AKzt:null,
__c70b70:null,
__ckUXKV:null,
__cxdups:null,
__4lm5w:null,
__bbDIy4:null,
canHandleEvent:function(a,b){},
registerEvent:function(a,b,c){},
unregisterEvent:function(a,b,c){},
focus:function(a){try{a.focus()}catch(b){}this.setFocus(a);
this.setActive(a)},
activate:function(a){this.setActive(a)},
blur:function(a){try{a.blur()}catch(b){}this.getActive()===a&&this.resetActive();
this.getFocus()===a&&this.resetFocus()},
deactivate:function(a){this.getActive()===a&&this.resetActive()},
tryActivate:function(b){var a=this.__cjW05C(b);
a&&this.setActive(a)},
__DxEp1:function(b,c,d,e){var a=qx.event.Registration,f=a.createEvent(d,qx.event.type.Focus,[b,c,e]);
a.dispatchEvent(b,f)},
_windowFocused:true,
__U8My3:function(){this._windowFocused&&(this._windowFocused=false,this.__DxEp1(this._window,null,"blur",false))},
__1XHOo:function(){this._windowFocused||(this._windowFocused=true,this.__DxEp1(this._window,null,"focus",false))},
_initObserver:function(){this.__cJoRML=qx.lang.Function.listener(this.__bxUpcm,this);
this.__cl8Rgc=qx.lang.Function.listener(this.__bhcxUr,this);
this.__b0rUZ6=qx.lang.Function.listener(this.__1T8aR,this);
this.__bQkXsP=qx.lang.Function.listener(this.__U68gK,this);
this.__c6AKzt=qx.lang.Function.listener(this.__bPgpCC,this);
this._document.addEventListener("mousedown",this.__cJoRML,true);
this._document.addEventListener("mouseup",this.__cl8Rgc,true);
this._window.addEventListener("focus",this.__b0rUZ6,true);
this._window.addEventListener("blur",this.__bQkXsP,true);
this._window.addEventListener("draggesture",this.__c6AKzt,true)},
_stopObserver:function(){this._document.removeEventListener("mousedown",this.__cJoRML,true);
this._document.removeEventListener("mouseup",this.__cl8Rgc,true);
this._window.removeEventListener("focus",this.__b0rUZ6,true);
this._window.removeEventListener("blur",this.__bQkXsP,true);
this._window.removeEventListener("draggesture",this.__c6AKzt,true)},
__bPgpCC:qx.event.GlobalError.observeMethod(function(a){this.__U7pjD(a.target)||qx.bom.Event.preventDefault(a)}),
__bgGVhm:qx.event.GlobalError.observeMethod(null),
__boY8LL:qx.event.GlobalError.observeMethod(null),
__U68gK:qx.event.GlobalError.observeMethod(function(a){(a.target===this._window||a.target===this._document)&&(this.__U8My3(),this.resetActive(),this.resetFocus())}),
__1T8aR:qx.event.GlobalError.observeMethod(function(b){var a=b.target;
(a===this._window||a===this._document)&&(this.__1XHOo(),a=this._body);
this.setFocus(a);
this.tryActivate(a)}),
__bxUpcm:qx.event.GlobalError.observeMethod(function(b){var a=this.__bYXwyE(b.target);
a?a===this._body&&this.setFocus(a):qx.bom.Event.preventDefault(b)}),
__bhcxUr:qx.event.GlobalError.observeMethod(function(b){var a=b.target;
while(a&&a.offsetWidth===undefined)a=a.parentNode;
a&&this.tryActivate(a)}),
__yFIG2:qx.event.GlobalError.observeMethod(function(a){return a}),
__bP88mj:qx.event.GlobalError.observeMethod(null),
__OSvtH:function(b){var a=qx.bom.element.Attribute.get(b,"tabIndex"),c;
if(a>=1)return true;
c=qx.event.handler.Focus.FOCUSABLE_ELEMENTS;
if(a>=0&&c[b.tagName])return true;
return false},
__bYXwyE:function(a){while(a&&a.nodeType===1){if(a.getAttribute("qxKeepFocus")=="on")return null;
if(this.__OSvtH(a))return a;
a=a.parentNode}return this._body},
__cjW05C:function(a){var b=a;
while(a&&a.nodeType===1){if(a.getAttribute("qxKeepActive")=="on")return null;
a=a.parentNode}return b},
__U7pjD:function(a){while(a&&a.nodeType===1){var b=a.getAttribute("qxSelectable");
if(b!=null)return b==="on";
a=a.parentNode}return true},
_applyActive:function(a,b){b&&this.__DxEp1(b,a,"deactivate",true);
a&&this.__DxEp1(a,b,"activate",true)},
_applyFocus:function(a,b){b&&this.__DxEp1(b,a,"focusout",true);
a&&this.__DxEp1(a,b,"focusin",true);
b&&this.__DxEp1(b,a,"blur",false);
a&&this.__DxEp1(a,b,"focus",false)}},
destruct:function(){this._stopObserver();
this._manager=this._window=this._document=this._root=this._body=this.__PKXaq=null},
defer:function(b){qx.event.Registration.addHandler(b);
var c=b.FOCUSABLE_ELEMENTS,a;
for(a in c)c[a.toUpperCase()]=1}});


// qx.bom.Element
//   - size: 1669 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 1x
//       qx, 15x
//       undefined, 1x
//       window, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Element.__allowMarkup, 2x
//       qx.bom.Element.__helperElement, 3x
//       qx.bom.Element.allowCreationWithMarkup, 1x
//       qx.bom.Element.getHelperElement, 1x
//       qx.bom.element.Attribute.set, 1x
//       qx.core.ObjectRegistry.toHashCode, 2x
//       qx.dom.Hierarchy.getDescendants, 2x
//       qx.event.Registration.getManager, 1x
//       qx.xml.Document.isXmlDocument, 1x
qx.Class.define("qx.bom.Element",{statics:{__PoXf0:{},
allowCreationWithMarkup:function(b){b||(b=window);
var a=qx.core.ObjectRegistry.toHashCode(b),c=qx.bom.Element.__PoXf0;
if(c[a]==undefined)try{b.document.createElement("<INPUT TYPE='RADIO' NAME='RADIOTEST' VALUE='Second Choice'>");
c[a]=true}catch(d){c[a]=false}return qx.bom.Element.__PoXf0[a]},
getHelperElement:function(a){a||(a=window);
var b=qx.core.ObjectRegistry.toHashCode(a),c;
if(!qx.bom.Element.__19NXN[b])c=qx.bom.Element.__19NXN[b]=a.document.createElement("div");
return qx.bom.Element.__19NXN[b]},
__bzowAS:{onload:true,
onpropertychange:true,
oninput:true,
onchange:true,
name:true,
type:true,
checked:true,
disabled:true},
__19NXN:{},
create:function(d,e,b){b||(b=window);
if(!d)throw new Error("The tag name is missing!");
var g=this.__bzowAS,f="",a,c,h;
for(a in e)g[a]&&(f+=a+"='"+e[a]+"' ");
if(f!=""){if(qx.bom.Element.allowCreationWithMarkup(b))c=b.document.createElement("<"+d+" "+f+">");
else{h=qx.bom.Element.getHelperElement(b);
h.innerHTML="<"+d+" "+f+"></"+d+">";
c=h.firstChild}}else c=b.document.createElement(d);
for(a in e)g[a]||qx.bom.element.Attribute.set(c,a,e[a]);
return c},
empty:function(a){return a.innerHTML=""},
clone:function(a,h){var f,l,g,i,c,j,k,b,d,m,e,n;
if(h||false&&!qx.xml.Document.isXmlDocument(a)){l=qx.event.Registration.getManager(a),g=qx.dom.Hierarchy.getDescendants(a);
g.push(a)}f=a.cloneNode(true);
if(h===true){i=qx.dom.Hierarchy.getDescendants(f);
i.push(f);
d=0,m=g.length;
for(;
d<m;
d++){k=g[d];
c=l.serializeListeners(k);
if(c.length>0){j=i[d];
for(e=0,n=c.length;
e<n;
e++)b=c[e],l.addListener(j,b.type,b.handler,b.self,b.capture)}}}return f}}});


// qx.bom.Selection
//   - size: 2332 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 22x
//       undefined, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Element.blur, 1x
//       qx.bom.Range.get, 2x
//       qx.bom.Selection.getSelectionObject, 1x
//       qx.bom.Selection.set, 1x
//       qx.dom.Node.getDocument, 4x
//       qx.dom.Node.getWindow, 2x
//       qx.dom.Node.isDocument, 2x
//       qx.dom.Node.isElement, 5x
//       qx.dom.Node.isText, 3x
qx.Class.define("qx.bom.Selection",{statics:{getSelectionObject:function(a){return qx.dom.Node.getWindow(a).getSelection()},
get:function(a){return this.__byrF7m(a)?a.value.substring(a.selectionStart,a.selectionEnd):this.getSelectionObject(qx.dom.Node.getDocument(a)).toString()},
getLength:function(a){return this.__byrF7m(a)?a.selectionEnd-a.selectionStart:this.get(a).length},
getStart:function(b){if(this.__byrF7m(b))return b.selectionStart;
var c=qx.dom.Node.getDocument(b),a=this.getSelectionObject(c);
return a.anchorOffset<a.focusOffset?a.anchorOffset:a.focusOffset},
getEnd:function(b){if(this.__byrF7m(b))return b.selectionEnd;
var c=qx.dom.Node.getDocument(b),a=this.getSelectionObject(c);
return a.focusOffset>a.anchorOffset?a.focusOffset:a.anchorOffset},
__byrF7m:function(a){return qx.dom.Node.isElement(a)&&(a.nodeName.toLowerCase()=="input"||a.nodeName.toLowerCase()=="textarea")},
set:function(a,c,b){var g=a.nodeName.toLowerCase(),f,d,e;
if(qx.dom.Node.isElement(a)&&(g=="input"||g=="textarea")){b===undefined&&(b=a.value.length);
if(c>=0&&c<=a.value.length&&b>=0&&b<=a.value.length){a.focus();
a.select();
a.setSelectionRange(c,b);
return true}}else{f=false,d=qx.dom.Node.getWindow(a).getSelection(),e=qx.bom.Range.get(a);
qx.dom.Node.isText(a)?(b===undefined&&(b=a.length),c>=0&&c<a.length&&b>=0&&b<=a.length&&(f=true)):qx.dom.Node.isElement(a)?(b===undefined&&(b=a.childNodes.length-1),c>=0&&a.childNodes[c]&&b>=0&&a.childNodes[b]&&(f=true)):qx.dom.Node.isDocument(a)&&(a=a.body,b===undefined&&(b=a.childNodes.length-1),c>=0&&a.childNodes[c]&&b>=0&&a.childNodes[b]&&(f=true));
if(f){d.isCollapsed||d.collapseToStart();
e.setStart(a,c);
qx.dom.Node.isText(a)?e.setEnd(a,b):e.setEndAfter(a.childNodes[b]);
d.rangeCount>0&&d.removeAllRanges();
d.addRange(e);
return true}}return false},
setAll:function(a){return qx.bom.Selection.set(a,0)},
clear:function(a){var f=qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(a)),c=a.nodeName.toLowerCase(),e,b,d;
if(qx.dom.Node.isElement(a)&&(c=="input"||c=="textarea"))a.setSelectionRange(0,0),qx.bom.Element.blur(a);
else if(qx.dom.Node.isDocument(a)||c=="body")f.collapse(a.body?a.body:a,0);
else{e=qx.bom.Range.get(a);
if(!e.collapsed){d=e.commonAncestorContainer;
b=qx.dom.Node.isElement(a)&&qx.dom.Node.isText(d)?d.parentNode:d;
b==a&&f.collapse(a,0)}}}}});


// qx.bom.Range
//   - size: 191 bytes
//   - modified: 2010-09-18T15:10:12
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Selection.getSelectionObject, 1x
//       qx.dom.Node.getDocument, 1x
qx.Class.define("qx.bom.Range",{statics:{get:function(c){var b=qx.dom.Node.getDocument(c),a=qx.bom.Selection.getSelectionObject(b);
return a.rangeCount>0?a.getRangeAt(0):b.createRange()}}});


// qx.bom.element.Scroll
//   - size: 1979 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       parseInt, 4x
//       qx, 23x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Viewport.getHeight, 2x
//       qx.bom.Viewport.getWidth, 2x
//       qx.bom.client.Engine.GECKO, 2x
//       qx.bom.client.Engine.OPERA, 2x
//       qx.bom.element.Location.get, 4x
//       qx.bom.element.Overflow.getY, 2x
//       qx.bom.element.Style.get, 4x
//       qx.dom.Node.getDocument, 2x
//       qx.event.Registration.fireNonBubblingEvent, 2x
qx.Class.define("qx.bom.element.Scroll",{statics:{intoViewX:function(d,i,q){var a=d.parentNode,r=qx.dom.Node.getDocument(d),p=r.body,o,g,m,n,c,s,k,f,j,l,u,v,t,h,e,b,x=q==="left",w=q==="right";
i=i?i.parentNode:r;
while(a&&a!=i){a.scrollWidth>a.clientWidth&&(a===p||qx.bom.element.Overflow.getY(a)!="visible")&&(a===p?(g=a.scrollLeft,m=g+qx.bom.Viewport.getWidth(),n=qx.bom.Viewport.getWidth(),c=a.clientWidth,s=a.scrollWidth,k=0,f=0,j=0):(o=qx.bom.element.Location.get(a),g=o.left,m=o.right,n=a.offsetWidth,c=a.clientWidth,s=a.scrollWidth,k=parseInt(qx.bom.element.Style.get(a,"borderLeftWidth"),10)||0,f=parseInt(qx.bom.element.Style.get(a,"borderRightWidth"),10)||0,j=n-c-k-f),l=qx.bom.element.Location.get(d),u=l.left,v=l.right,t=d.offsetWidth,h=u-g-k,e=v-m+f,b=0,x?b=h:w?b=e+j:h<0||t>c?b=h:e>0&&(b=e+j),a.scrollLeft+=b,(qx.bom.client.Engine.GECKO||qx.bom.client.Engine.OPERA)&&qx.event.Registration.fireNonBubblingEvent(a,"scroll"));
if(a===p)break;
a=a.parentNode}},
intoViewY:function(c,h,s){var a=c.parentNode,t=qx.dom.Node.getDocument(c),p=t.body,n,k,o,m,d,v,f,j,e,l,q,r,u,g,i,b,x=s==="top",w=s==="bottom";
h=h?h.parentNode:t;
while(a&&a!=h){a.scrollHeight>a.clientHeight&&(a===p||qx.bom.element.Overflow.getY(a)!="visible")&&(a===p?(k=a.scrollTop,o=k+qx.bom.Viewport.getHeight(),m=qx.bom.Viewport.getHeight(),d=a.clientHeight,v=a.scrollHeight,f=0,j=0,e=0):(n=qx.bom.element.Location.get(a),k=n.top,o=n.bottom,m=a.offsetHeight,d=a.clientHeight,v=a.scrollHeight,f=parseInt(qx.bom.element.Style.get(a,"borderTopWidth"),10)||0,j=parseInt(qx.bom.element.Style.get(a,"borderBottomWidth"),10)||0,e=m-d-f-j),l=qx.bom.element.Location.get(c),q=l.top,r=l.bottom,u=c.offsetHeight,g=q-k-f,i=r-o+j,b=0,x?b=g:w?b=i+e:g<0||u>d?b=g:i>0&&(b=i+e),a.scrollTop+=b,(qx.bom.client.Engine.GECKO||qx.bom.client.Engine.OPERA)&&qx.event.Registration.fireNonBubblingEvent(a,"scroll"));
if(a===p)break;
a=a.parentNode}},
intoView:function(a,b,c,d){this.intoViewX(a,b,c);
this.intoViewY(a,b,d)}}});


// qx.event.handler.Keyboard
//   - size: 6094 bytes
//   - modified: 2010-11-02T15:57:52
//   - names:
//       String, 3x
//       parseInt, 2x
//       qx, 29x
//   - packages:
//       String.fromCharCode, 3x
//       qx.Class.define, 1x
//       qx.bom.Event, 2x
//       qx.bom.Event.addNativeListener, 1x
//       qx.bom.Event.stopPropagation, 1x
//       qx.bom.client.Platform.MAC, 2x
//       qx.bom.client.Platform.WIN, 1x
//       qx.core.Object, 1x
//       qx.core.ObjectRegistry.toHashCode, 1x
//       qx.event.GlobalError.observeMethod, 3x
//       qx.event.IEventHandler, 1x
//       qx.event.IEventHandler.TARGET_DOMNODE, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addHandler, 1x
//       qx.event.Registration.createEvent, 2x
//       qx.event.Registration.fireEvent, 2x
//       qx.event.handler.Focus, 1x
//       qx.event.handler.Keyboard._identifierToKeyCodeMap, 1x
//       qx.event.type.Data, 2x
//       qx.event.type.KeyInput, 1x
//       qx.event.type.KeySequence, 1x
//       qx.lang.Function.listener, 2x
qx.Class.define("qx.event.handler.Keyboard",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(a){this.base(arguments);
this.__ugn3e=a;
this.__qOaV1=a.getWindow();
this.__jO4QN=this.__qOaV1;
this.__9CBiM={};
this._initKeyObserver()},
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,
SUPPORTED_TYPES:{keyup:1,
keydown:1,
keypress:1,
keyinput:1},
TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,
IGNORE_CAN_HANDLE:true,
isValidKeyIdentifier:function(a){if(this._identifierToKeyCodeMap[a])return true;
if(a.length!=1)return false;
if(a>="0"&&a<="9")return true;
if(a>="A"&&a<="Z")return true;
switch(a){case"+":case"-":case"*":case"/":return true;
default:return false}}},
members:{__bFUKu7:null,
__ugn3e:null,
__qOaV1:null,
__jO4QN:null,
__9CBiM:null,
__OJqRf:null,
__bbrCpU:null,
__bxY419:null,
canHandleEvent:function(a,b){},
registerEvent:function(a,b,c){},
unregisterEvent:function(a,b,c){},
_fireInputEvent:function(c,d){var a=this.__80VBc(),b;
if(a&&a.offsetWidth!=0){b=qx.event.Registration.createEvent("keyinput",qx.event.type.KeyInput,[c,a,d]);
this.__ugn3e.dispatchEvent(a,b)}this.__qOaV1&&qx.event.Registration.fireEvent(this.__qOaV1,"useraction",qx.event.type.Data,["keyinput"])},
_fireSequenceEvent:function(c,a,e){var b=this.__80VBc(),f=c.keyCode,d=qx.event.Registration.createEvent(a,qx.event.type.KeySequence,[c,b,e]);
this.__ugn3e.dispatchEvent(b,d);
this.__qOaV1&&qx.event.Registration.fireEvent(this.__qOaV1,"useraction",qx.event.type.Data,[a])},
__80VBc:function(){var b=this.__ugn3e.getHandler(qx.event.handler.Focus),a=b.getActive();
(!a||a.offsetWidth==0)&&(a=b.getFocus());
(!a||a.offsetWidth==0)&&(a=this.__ugn3e.getWindow().document.body);
return a},
_initKeyObserver:function(){this.__bFUKu7=qx.lang.Function.listener(this.__Ol3HG,this);
this.__bxY419=qx.lang.Function.listener(this.__IUnCM,this);
var a=qx.bom.Event;
a.addNativeListener(this.__jO4QN,"keyup",this.__bFUKu7);
a.addNativeListener(this.__jO4QN,"keydown",this.__bFUKu7);
a.addNativeListener(this.__jO4QN,"keypress",this.__bxY419)},
_stopKeyObserver:function(){var a=qx.bom.Event,b,c;
a.removeNativeListener(this.__jO4QN,"keyup",this.__bFUKu7);
a.removeNativeListener(this.__jO4QN,"keydown",this.__bFUKu7);
a.removeNativeListener(this.__jO4QN,"keypress",this.__bxY419);
for(b in (this.__bbrCpU||{})){c=this.__bbrCpU[b];
a.removeNativeListener(c.target,"keypress",c.callback)}delete this.__bbrCpU},
__Ol3HG:qx.event.GlobalError.observeMethod(function(a){var c=this._keyCodeFix[a.keyCode]||a.keyCode,d=0,b=a.type,e;
if(qx.bom.client.Platform.WIN){e=c?this._keyCodeToIdentifier(c):this._charCodeToIdentifier(d);
this.__9CBiM[e]=="keydown"&&b=="keydown"||this._idealKeyHandler(c,d,b,a);
this.__9CBiM[e]=b}else this._idealKeyHandler(c,d,b,a);
this.__bh7s2v(a.target,b,c)}),
__bh7s2v:function(a,d,b){if(d==="keydown"&&(b==33||b==34||b==38||b==40)&&a.type=="text"&&a.tagName.toLowerCase()==="input"&&a.getAttribute("autoComplete")!=="off"){this.__bbrCpU||(this.__bbrCpU={});
var c=qx.core.ObjectRegistry.toHashCode(a),e,f;
if(this.__bbrCpU[c])return;
e=this;
this.__bbrCpU[c]={target:a,
callback:function(a){qx.bom.Event.stopPropagation(a);
e.__IUnCM(a)}};
f=qx.event.GlobalError.observeMethod(this.__bbrCpU[c].callback);
qx.bom.Event.addNativeListener(a,"keypress",f)}},
__IUnCM:qx.event.GlobalError.observeMethod(function(a){var b=this._keyCodeFix[a.keyCode]||a.keyCode,c=a.charCode,d=a.type;
this._idealKeyHandler(b,c,d,a)}),
_idealKeyHandler:function(b,d,e,c){var a;
b||!b&&!d?(a=this._keyCodeToIdentifier(b),this._fireSequenceEvent(c,e,a)):(a=this._charCodeToIdentifier(d),this._fireSequenceEvent(c,"keypress",a),this._fireInputEvent(c,d))},
_specialCharCodeMap:{8:"Backspace",
9:"Tab",
13:"Enter",
27:"Escape",
32:"Space"},
_emulateKeyPress:{},
_keyCodeToIdentifierMap:{16:"Shift",
17:"Control",
18:"Alt",
20:"CapsLock",
224:"Meta",
37:"Left",
38:"Up",
39:"Right",
40:"Down",
33:"PageUp",
34:"PageDown",
35:"End",
36:"Home",
45:"Insert",
46:"Delete",
112:"F1",
113:"F2",
114:"F3",
115:"F4",
116:"F5",
117:"F6",
118:"F7",
119:"F8",
120:"F9",
121:"F10",
122:"F11",
123:"F12",
144:"NumLock",
44:"PrintScreen",
145:"Scroll",
19:"Pause",
91:qx.bom.client.Platform.MAC?"cmd":"Win",
92:"Win",
93:qx.bom.client.Platform.MAC?"cmd":"Apps"},
_numpadToCharCode:{96:"0".charCodeAt(0),
97:"1".charCodeAt(0),
98:"2".charCodeAt(0),
99:"3".charCodeAt(0),
100:"4".charCodeAt(0),
101:"5".charCodeAt(0),
102:"6".charCodeAt(0),
103:"7".charCodeAt(0),
104:"8".charCodeAt(0),
105:"9".charCodeAt(0),
106:"*".charCodeAt(0),
107:"+".charCodeAt(0),
109:"-".charCodeAt(0),
110:",".charCodeAt(0),
111:"/".charCodeAt(0)},
_charCodeA:"A".charCodeAt(0),
_charCodeZ:"Z".charCodeAt(0),
_charCode0:"0".charCodeAt(0),
_charCode9:"9".charCodeAt(0),
_isNonPrintableKeyCode:function(a){return this._keyCodeToIdentifierMap[a]?true:false},
_isIdentifiableKeyCode:function(a){if(a>=this._charCodeA&&a<=this._charCodeZ)return true;
if(a>=this._charCode0&&a<=this._charCode9)return true;
if(this._specialCharCodeMap[a])return true;
if(this._numpadToCharCode[a])return true;
if(this._isNonPrintableKeyCode(a))return true;
return false},
_keyCodeToIdentifier:function(a){if(this._isIdentifiableKeyCode(a)){var b=this._numpadToCharCode[a];
if(b)return String.fromCharCode(b);
return this._keyCodeToIdentifierMap[a]||this._specialCharCodeMap[a]||String.fromCharCode(a)}return"Unidentified"},
_charCodeToIdentifier:function(a){return this._specialCharCodeMap[a]||String.fromCharCode(a).toUpperCase()},
_identifierToKeyCode:function(a){return qx.event.handler.Keyboard._identifierToKeyCodeMap[a]||a.charCodeAt(0)}},
destruct:function(){this._stopKeyObserver();
this.__OJqRf=this.__ugn3e=this.__qOaV1=this.__jO4QN=this.__9CBiM=null},
defer:function(c,a){qx.event.Registration.addHandler(c);
if(!c._identifierToKeyCodeMap){c._identifierToKeyCodeMap={};
for(var b in a._keyCodeToIdentifierMap)c._identifierToKeyCodeMap[a._keyCodeToIdentifierMap[b]]=parseInt(b,10);
for(var b in a._specialCharCodeMap)c._identifierToKeyCodeMap[a._specialCharCodeMap[b]]=parseInt(b,10)}a._keyCodeFix={12:a._identifierToKeyCode("NumLock")}}});


// qx.bom.Label
//   - size: 2798 bytes
//   - modified: 2010-09-23T21:51:03
//   - names:
//       document, 5x
//       qx, 21x
//       undefined, 1x
//       window, 1x
//   - packages:
//       document.body.firstChild, 2x
//       document.body.insertBefore, 2x
//       document.createElementNS, 1x
//       qx.Class.define, 1x
//       qx.bom.Element.create, 1x
//       qx.bom.client.Engine.VERSION, 1x
//       qx.bom.client.Feature.CSS_TEXT_OVERFLOW, 6x
//       qx.bom.client.Feature.XUL, 6x
//       qx.bom.client.Platform.WIN, 1x
//       qx.bom.element.Attribute.get, 1x
//       qx.bom.element.Attribute.set, 2x
//       qx.bom.element.Dimension.getSize, 1x
//       qx.bom.element.Style.setStyles, 1x
qx.Class.define("qx.bom.Label",{statics:{__q8NBD:{fontFamily:1,
fontSize:1,
fontWeight:1,
fontStyle:1,
lineHeight:1},
__PYHCh:function(){var a=this.__bZOR3b(false);
document.body.insertBefore(a,document.body.firstChild);
return this._textElement=a},
__PPCZX:function(){var a=this.__bZOR3b(true);
document.body.insertBefore(a,document.body.firstChild);
return this._htmlElement=a},
__bZOR3b:function(e){var b=qx.bom.Element.create("div"),a=b.style,d,c;
a.width=a.height="auto";
a.left=a.top="-1000px";
a.visibility="hidden";
a.position="absolute";
a.overflow="visible";
if(e)a.whiteSpace="normal";
else{a.whiteSpace="nowrap";
if(!qx.bom.client.Feature.CSS_TEXT_OVERFLOW&&qx.bom.client.Feature.XUL){d=document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul","label"),a=d.style;
a.padding="0";
for(c in this.__q8NBD)a[c]="inherit";
b.appendChild(d)}}return b},
__D7WSJ:function(b){var a={};
b?a.whiteSpace="normal":!qx.bom.client.Feature.CSS_TEXT_OVERFLOW&&qx.bom.client.Feature.XUL?a.display="block":(a.overflow="hidden",a.whiteSpace="nowrap",a.textOverflow="ellipsis",a.userSelect="none");
return a},
create:function(g,f,a){a||(a=window);
if(f){var c=a.document.createElement("div"),d,b,e;
c.useHtml=true}else if(!qx.bom.client.Feature.CSS_TEXT_OVERFLOW&&qx.bom.client.Feature.XUL){c=a.document.createElement("div"),d=a.document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul","label"),b=d.style;
b.cursor="inherit";
b.color="inherit";
b.overflow="hidden";
b.maxWidth="100%";
b.padding="0";
for(e in this.__q8NBD)d.style[e]="inherit";
d.setAttribute("crop","end");
c.appendChild(d)}else{c=a.document.createElement("div");
qx.bom.element.Style.setStyles(c,this.__D7WSJ(f))}g&&this.setValue(c,g);
return c},
setValue:function(b,a){a=a||"";
b.useHtml?b.innerHTML=a:!qx.bom.client.Feature.CSS_TEXT_OVERFLOW&&qx.bom.client.Feature.XUL?b.firstChild.setAttribute("value",a):qx.bom.element.Attribute.set(b,"text",a)},
getValue:function(a){return a.useHtml?a.innerHTML:!qx.bom.client.Feature.CSS_TEXT_OVERFLOW&&qx.bom.client.Feature.XUL?a.firstChild.getAttribute("value")||"":qx.bom.element.Attribute.get(a,"text")},
getHtmlSize:function(d,c,b){var a=this._htmlElement||this.__PPCZX();
a.style.width=b!==undefined?b+"px":"auto";
a.innerHTML=d;
return this.__POfKW(a,c)},
getTextSize:function(b,c){var a=this._textElement||this.__PYHCh();
!qx.bom.client.Feature.CSS_TEXT_OVERFLOW&&qx.bom.client.Feature.XUL?a.firstChild.setAttribute("value",b):qx.bom.element.Attribute.set(a,"text",b);
return this.__POfKW(a,c)},
__POfKW:function(d,c){var e=this.__q8NBD,a,b;
c||(c={});
for(a in e)d.style[a]=c[a]||"";
b=qx.bom.element.Dimension.getSize(d);
qx.bom.client.Platform.WIN||b.width++;
false&&qx.bom.client.Engine.VERSION==9&&b.width++;
return b}}});


// qx.html.Element
//   - size: 17164 bytes
//   - modified: 2010-11-02T16:00:16
//   - names:
//       Error, 10x
//       document, 1x
//       qx, 88x
//       undefined, 6x
//       window, 2x
//   - packages:
//       document.createDocumentFragment, 1x
//       qx.Class.define, 1x
//       qx.bom.Element.create, 1x
//       qx.bom.Element.getHelperElement, 1x
//       qx.bom.Selection.clear, 1x
//       qx.bom.Selection.get, 1x
//       qx.bom.Selection.getEnd, 1x
//       qx.bom.Selection.getLength, 1x
//       qx.bom.Selection.getStart, 1x
//       qx.bom.Selection.set, 2x
//       qx.bom.element.Attribute, 2x
//       qx.bom.element.Attribute.set, 1x
//       qx.bom.element.Scroll.intoViewX, 2x
//       qx.bom.element.Scroll.intoViewY, 2x
//       qx.bom.element.Style, 3x
//       qx.bom.element.Style.set, 1x
//       qx.core.Object, 1x
//       qx.core.ObjectRegistry, 1x
//       qx.core.ObjectRegistry.fromHashCode, 1x
//       qx.core.ObjectRegistry.inShutDown, 1x
//       qx.dom.Hierarchy.isRendered, 1x
//       qx.event.Manager.getNextUniqueId, 1x
//       qx.event.Registration.addListener, 1x
//       qx.event.Registration.getManager, 7x
//       qx.event.Registration.hasListener, 1x
//       qx.event.Registration.removeListener, 1x
//       qx.event.Registration.removeListenerById, 1x
//       qx.event.dispatch.MouseCapture, 3x
//       qx.event.handler.Appear.refresh, 1x
//       qx.event.handler.Focus, 2x
//       qx.event.handler.Focus.FOCUSABLE_ELEMENTS, 2x
//       qx.html.Element.DEBUG, 1x
//       qx.html.Element.__deferredCall.schedule, 1x
//       qx.html.Element.__selection, 2x
//       qx.html.Element._actions, 1x
//       qx.html.Element._modified, 5x
//       qx.html.Element._scheduleFlush, 13x
//       qx.html.Element._scroll, 4x
//       qx.html.Element._visibility, 2x
//       qx.lang.Array.insertAfter, 1x
//       qx.lang.Array.insertAt, 3x
//       qx.lang.Array.insertBefore, 1x
//       qx.lang.Array.remove, 3x
//       qx.lang.Array.removeAt, 2x
//       qx.log.Logger.debug, 2x
//       qx.util.DeferredCall, 1x
qx.Class.define("qx.html.Element",{extend:qx.core.Object,
construct:function(a,c,b){this.base(arguments);
this.__yyimE=a||"div";
this.__QCQLc=c||null;
this.__WcMi9=b||null},
statics:{DEBUG:false,
_modified:{},
_visibility:{},
_scroll:{},
_actions:[],
__EoIRJ:{},
_scheduleFlush:function(a){qx.html.Element.__UOqV6.schedule()},
flush:function(){var a,h,r,l,i,n,p,b,f,u,j,c,k,e,o,m,g,q,w,d,v,t,s;
this.DEBUG&&qx.log.Logger.debug(this,"Flushing elements...");
h=this.__bf6CO9(),r=h.getFocus();
r&&this.__bQdObH(r)&&h.blur(r);
l=h.getActive();
l&&this.__bQdObH(l)&&h.deactivate(l);
i=this.__bxcXs9();
i&&this.__bQdObH(i)&&qx.event.Registration.getManager(i).getDispatcher(qx.event.dispatch.MouseCapture).releaseCapture(i);
n=[],p=this._modified;
for(b in p)a=p[b],a.__06Upf()&&(a.__unOnl&&qx.dom.Hierarchy.isRendered(a.__unOnl)?n.push(a):(this.DEBUG&&a.debug("Flush invisible element"),a.__mS5FB()),delete p[b]);
for(f=0,u=n.length;
f<u;
f++)a=n[f],this.DEBUG&&a.debug("Flush rendered element"),a.__mS5FB();
j=this._visibility;
for(b in j){a=j[b];
c=a.__unOnl;
if(!c){delete j[b];
continue}this.DEBUG&&qx.log.Logger.debug(this,"Switching visibility to: "+a.__uWJAv);
a.$$disposed||(c.style.display=a.__uWJAv?"":"none");
delete j[b]}k=this._scroll;
for(b in k){a=k[b];
e=a.__unOnl;
if(e&&e.offsetWidth){o=true;
a.__PYYE6!=null&&(a.__unOnl.scrollLeft=a.__PYYE6,delete a.__PYYE6);
a.__PZfH9!=null&&(a.__unOnl.scrollTop=a.__PZfH9,delete a.__PZfH9);
m=a.__bSiL79;
if(m!=null){g=m.element.getDomElement();
g&&g.offsetWidth?(qx.bom.element.Scroll.intoViewX(g,e,m.align),delete a.__bSiL79):o=false}q=a.__bSi3bc;
if(q!=null){g=q.element.getDomElement();
g&&g.offsetWidth?(qx.bom.element.Scroll.intoViewY(g,e,q.align),delete a.__bSi3bc):o=false}o&&delete k[b]}}w={releaseCapture:1,
blur:1,
deactivate:1},f=0;
for(;
f<this._actions.length;
f++){d=this._actions[f],c=d.element.__unOnl;
if(!c||!w[d.type]&&!d.element.__06Upf())continue;
v=d.args;
v.unshift(c);
if(d.type=="capture"||d.type=="releaseCapture"){t=qx.event.Registration.getManager(c).getDispatcher(qx.event.dispatch.MouseCapture);
d.type=="capture"?t.activateCapture(c):t.releaseCapture(c)}else{h=qx.event.Registration.getManager(c).getHandler(qx.event.handler.Focus);
h[d.type](c)}}this._actions=[];
for(b in this.__EoIRJ){s=this.__EoIRJ[b],e=s.element.__unOnl;
e&&(qx.bom.Selection.set(e,s.start,s.end),delete this.__EoIRJ[b])}qx.event.handler.Appear.refresh()},
__bf6CO9:function(){if(!this.__Vsi2j){var a=qx.event.Registration.getManager(window);
this.__Vsi2j=a.getHandler(qx.event.handler.Focus)}return this.__Vsi2j},
__bxcXs9:function(){if(!this.__WoSsG){var a=qx.event.Registration.getManager(window);
this.__WoSsG=a.getDispatcher(qx.event.dispatch.MouseCapture)}return this.__WoSsG.getCaptureElement()},
__bQdObH:function(b){var a=qx.core.ObjectRegistry.fromHashCode(b.$$element);
return a&&!a.__06Upf()}},
members:{__yyimE:null,
__unOnl:null,
__jO4QN:false,
__y72Jn:true,
__uWJAv:true,
__bSiL79:null,
__bSi3bc:null,
__PYYE6:null,
__PZfH9:null,
__EN1mA:null,
__JDcA3:null,
__Xz1tC:null,
__QCQLc:null,
__WcMi9:null,
__bcpP8a:null,
__PLMjJ:null,
__yONi8:null,
__boRIrB:null,
__qvtBB:null,
_scheduleChildrenUpdate:function(){if(this.__boRIrB)return;
this.__boRIrB=true;
qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush("element")},
_createDomElement:function(){return qx.bom.Element.create(this.__yyimE)},
__mS5FB:function(){this.DEBUG&&this.debug("Flush: "+this.getAttribute("id"));
var b=this.__yONi8,d,a,c;
if(b){d=b.length,c=0;
for(;
c<d;
c++)a=b[c],a.__uWJAv&&a.__y72Jn&&!a.__unOnl&&a.__mS5FB()}this.__unOnl?(this._syncData(),this.__boRIrB&&this._syncChildren()):(this.__unOnl=this._createDomElement(),this.__unOnl.$$element=this.$$hash,this._copyData(false),b&&d>0&&this._insertChildren());
delete this.__boRIrB},
_insertChildren:function(){var d=this.__yONi8,e=d.length,a,c,b;
if(e>2){c=document.createDocumentFragment(),b=0;
for(;
b<e;
b++)a=d[b],a.__unOnl&&a.__y72Jn&&c.appendChild(a.__unOnl);
this.__unOnl.appendChild(c)}else{c=this.__unOnl,b=0;
for(;
b<e;
b++)a=d[b],a.__unOnl&&a.__y72Jn&&c.appendChild(a.__unOnl)}},
_syncChildren:function(){for(var j=qx.core.ObjectRegistry,i=this.__yONi8,k=i.length,g,a,d=this.__unOnl,e=d.childNodes,h=0,b,f=0,c=e.length-1;
c>=0;
c--)b=e[c],a=j.fromHashCode(b.$$element),(!a||!a.__y72Jn||a.__qvtBB!==this)&&(d.removeChild(b),f++);
for(c=0;
c<k;
c++){g=i[c];
if(g.__y72Jn){a=g.__unOnl;
b=e[h];
if(!a)continue;
a!=b&&(b?d.insertBefore(a,b):d.appendChild(a),f++);
h++}}qx.html.Element.DEBUG&&this.debug("Synced DOM with "+f+" operations")},
_copyData:function(f){var c=this.__unOnl,a=this.__WcMi9,e,b,d;
if(a){e=qx.bom.element.Attribute;
for(b in a)e.set(c,b,a[b])}a=this.__QCQLc;
if(a){d=qx.bom.element.Style;
f?d.setStyles(c,a):d.setCss(c,d.compile(a))}a=this.__bcpP8a;
if(a)for(b in a)this._applyProperty(b,a[b]);
a=this.__PLMjJ;
a&&(qx.event.Registration.getManager(c).importListeners(c,a),delete this.__PLMjJ)},
_syncData:function(){var e=this.__unOnl,f=qx.bom.element.Attribute,h=qx.bom.element.Style,c=this.__JDcA3,b,d,a,g;
if(c){b=this.__WcMi9;
if(b){for(a in c)d=b[a],d!==undefined?f.set(e,a,d):f.reset(e,a)}this.__JDcA3=null}c=this.__EN1mA;
if(c){b=this.__QCQLc;
if(b){g={};
for(a in c)g[a]=b[a];
h.setStyles(e,g)}this.__EN1mA=null}c=this.__Xz1tC;
if(c){b=this.__bcpP8a;
if(b){for(a in c)this._applyProperty(a,b[a])}this.__Xz1tC=null}},
__06Upf:function(){var a=this;
while(a){if(a.__jO4QN)return true;
if(!a.__y72Jn||!a.__uWJAv)return false;
a=a.__qvtBB}return false},
__6nAw4:function(a){if(a.__qvtBB===this)throw new Error("Child is already in: "+a);
if(a.__jO4QN)throw new Error("Root elements could not be inserted into other ones.");
a.__qvtBB&&a.__qvtBB.remove(a);
a.__qvtBB=this;
this.__yONi8||(this.__yONi8=[]);
this.__unOnl&&this._scheduleChildrenUpdate()},
__bxTz2X:function(a){if(a.__qvtBB!==this)throw new Error("Has no child: "+a);
this.__unOnl&&this._scheduleChildrenUpdate();
delete a.__qvtBB},
__bgrfuw:function(a){if(a.__qvtBB!==this)throw new Error("Has no child: "+a);
this.__unOnl&&this._scheduleChildrenUpdate()},
getChildren:function(){return this.__yONi8||null},
getChild:function(b){var a=this.__yONi8;
return a&&a[b]||null},
hasChildren:function(){var a=this.__yONi8;
return a&&a[0]!==undefined},
indexOf:function(b){var a=this.__yONi8;
return a?a.indexOf(b):-1},
hasChild:function(b){var a=this.__yONi8;
return a&&a.indexOf(b)!==-1},
add:function(b){if(arguments[1]){for(var a=0,c=arguments.length;
a<c;
a++)this.__6nAw4(arguments[a]);
this.__yONi8.push.apply(this.__yONi8,arguments)}else this.__6nAw4(b),this.__yONi8.push(b);
return this},
addAt:function(a,b){this.__6nAw4(a);
qx.lang.Array.insertAt(this.__yONi8,a,b);
return this},
remove:function(d){var a=this.__yONi8,b,c,e;
if(!a)return;
if(arguments[1]){c=0,e=arguments.length;
for(;
c<e;
c++)b=arguments[c],this.__bxTz2X(b),qx.lang.Array.remove(a,b)}else this.__bxTz2X(d),qx.lang.Array.remove(a,d);
return this},
removeAt:function(c){var b=this.__yONi8,a;
if(!b)throw new Error("Has no children!");
a=b[c];
if(!a)throw new Error("Has no child at this position!");
this.__bxTz2X(a);
qx.lang.Array.removeAt(this.__yONi8,c);
return this},
removeAll:function(){var a=this.__yONi8,b,c;
if(a){for(b=0,c=a.length;
b<c;
b++)this.__bxTz2X(a[b]);
a.length=0}return this},
getParent:function(){return this.__qvtBB||null},
insertInto:function(a,b){a.__6nAw4(this);
b==null?a.__yONi8.push(this):qx.lang.Array.insertAt(this.__yONi8,this,b);
return this},
insertBefore:function(a){var b=a.__qvtBB;
b.__6nAw4(this);
qx.lang.Array.insertBefore(b.__yONi8,this,a);
return this},
insertAfter:function(a){var b=a.__qvtBB;
b.__6nAw4(this);
qx.lang.Array.insertAfter(b.__yONi8,this,a);
return this},
moveTo:function(b){var a=this.__qvtBB,c;
a.__bgrfuw(this);
c=a.__yONi8.indexOf(this);
if(c===b)throw new Error("Could not move to same index!");
c<b&&b--;
qx.lang.Array.removeAt(a.__yONi8,c);
qx.lang.Array.insertAt(a.__yONi8,this,b);
return this},
moveBefore:function(a){var b=this.__qvtBB;
return this.moveTo(b.__yONi8.indexOf(a))},
moveAfter:function(a){var b=this.__qvtBB;
return this.moveTo(b.__yONi8.indexOf(a)+1)},
free:function(){var a=this.__qvtBB;
if(!a)throw new Error("Has no parent to remove from.");
if(!a.__yONi8)return;
a.__bxTz2X(this);
qx.lang.Array.remove(a.__yONi8,this);
return this},
getDomElement:function(){return this.__unOnl||null},
getNodeName:function(){return this.__yyimE},
setNodeName:function(a){this.__yyimE=a},
setRoot:function(a){this.__jO4QN=a},
useMarkup:function(b){if(this.__unOnl)throw new Error("Could not overwrite existing element!");
var a=qx.bom.Element.getHelperElement();
a.innerHTML=b;
this.useElement(a.firstChild);
return this.__unOnl},
useElement:function(a){if(this.__unOnl)throw new Error("Could not overwrite existing element!");
this.__unOnl=a;
this.__unOnl.$$element=this.$$hash;
this._copyData(true)},
isFocusable:function(){var a=this.getAttribute("tabIndex"),b;
if(a>=1)return true;
b=qx.event.handler.Focus.FOCUSABLE_ELEMENTS;
if(a>=0&&b[this.__yyimE])return true;
return false},
setSelectable:function(a){this.setAttribute("qxSelectable",a?"on":"off");
this.setStyle("MozUserSelect",a?"text":"-moz-none")},
isNativelyFocusable:function(){return!!qx.event.handler.Focus.FOCUSABLE_ELEMENTS[this.__yyimE]},
include:function(){if(this.__y72Jn)return;
delete this.__y72Jn;
this.__qvtBB&&this.__qvtBB._scheduleChildrenUpdate();
return this},
exclude:function(){if(!this.__y72Jn)return;
this.__y72Jn=false;
this.__qvtBB&&this.__qvtBB._scheduleChildrenUpdate();
return this},
isIncluded:function(){return this.__y72Jn===true},
show:function(){if(this.__uWJAv)return;
this.__unOnl&&(qx.html.Element._visibility[this.$$hash]=this,qx.html.Element._scheduleFlush("element"));
this.__qvtBB&&this.__qvtBB._scheduleChildrenUpdate();
delete this.__uWJAv},
hide:function(){if(!this.__uWJAv)return;
this.__unOnl&&(qx.html.Element._visibility[this.$$hash]=this,qx.html.Element._scheduleFlush("element"));
this.__uWJAv=false},
isVisible:function(){return this.__uWJAv===true},
scrollChildIntoViewX:function(c,d,e){var b=this.__unOnl,a=c.getDomElement();
e!==false&&b&&b.offsetWidth&&a&&a.offsetWidth?qx.bom.element.Scroll.intoViewX(a,b,d):(this.__bSiL79={element:c,
align:d},qx.html.Element._scroll[this.$$hash]=this,qx.html.Element._scheduleFlush("element"));
delete this.__PYYE6},
scrollChildIntoViewY:function(c,d,e){var b=this.__unOnl,a=c.getDomElement();
e!==false&&b&&b.offsetWidth&&a&&a.offsetWidth?qx.bom.element.Scroll.intoViewY(a,b,d):(this.__bSi3bc={element:c,
align:d},qx.html.Element._scroll[this.$$hash]=this,qx.html.Element._scheduleFlush("element"));
delete this.__PZfH9},
scrollToX:function(b,c){var a=this.__unOnl;
c!==true&&a&&a.offsetWidth?a.scrollLeft=b:(this.__PYYE6=b,qx.html.Element._scroll[this.$$hash]=this,qx.html.Element._scheduleFlush("element"));
delete this.__bSiL79},
getScrollX:function(){var a=this.__unOnl;
if(a)return a.scrollLeft;
return this.__PYYE6||0},
scrollToY:function(b,c){var a=this.__unOnl;
c!==true&&a&&a.offsetWidth?a.scrollTop=b:(this.__PZfH9=b,qx.html.Element._scroll[this.$$hash]=this,qx.html.Element._scheduleFlush("element"));
delete this.__bSi3bc},
getScrollY:function(){var a=this.__unOnl;
if(a)return a.scrollTop;
return this.__PZfH9||0},
disableScrolling:function(){this.enableScrolling();
this.scrollToX(0);
this.scrollToY(0);
this.addListener("scroll",this.__yUihP,this)},
enableScrolling:function(){this.removeListener("scroll",this.__yUihP,this)},
__yG5Wb:null,
__yUihP:function(a){this.__yG5Wb||(this.__yG5Wb=true,this.__unOnl.scrollTop=0,this.__unOnl.scrollLeft=0,delete this.__yG5Wb)},
getTextSelection:function(){var a=this.__unOnl;
if(a)return qx.bom.Selection.get(a);
return null},
getTextSelectionLength:function(){var a=this.__unOnl;
if(a)return qx.bom.Selection.getLength(a);
return null},
getTextSelectionStart:function(){var a=this.__unOnl;
if(a)return qx.bom.Selection.getStart(a);
return null},
getTextSelectionEnd:function(){var a=this.__unOnl;
if(a)return qx.bom.Selection.getEnd(a);
return null},
setTextSelection:function(c,b){var a=this.__unOnl;
if(a){qx.bom.Selection.set(a,c,b);
return}qx.html.Element.__EoIRJ[this.toHashCode()]={element:this,
start:c,
end:b};
qx.html.Element._scheduleFlush("element")},
clearTextSelection:function(){var a=this.__unOnl;
a&&qx.bom.Selection.clear(a);
delete qx.html.Element.__EoIRJ[this.toHashCode()]},
__24Z8K:function(c,b){var a=qx.html.Element._actions;
a.push({type:c,
element:this,
args:b||[]});
qx.html.Element._scheduleFlush("element")},
focus:function(){this.__24Z8K("focus")},
blur:function(){this.__24Z8K("blur")},
activate:function(){this.__24Z8K("activate")},
deactivate:function(){this.__24Z8K("deactivate")},
capture:function(a){this.__24Z8K("capture",[a!==false])},
releaseCapture:function(){this.__24Z8K("releaseCapture")},
setStyle:function(a,b,c){this.__QCQLc||(this.__QCQLc={});
if(this.__QCQLc[a]==b)return;
b==null?delete this.__QCQLc[a]:this.__QCQLc[a]=b;
if(this.__unOnl){if(c){qx.bom.element.Style.set(this.__unOnl,a,b);
return this}this.__EN1mA||(this.__EN1mA={});
this.__EN1mA[a]=true;
qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush("element")}return this},
setStyles:function(c,d){var e=qx.bom.element.Style,a,b;
this.__QCQLc||(this.__QCQLc={});
if(this.__unOnl){this.__EN1mA||(this.__EN1mA={});
for(a in c){b=c[a];
if(this.__QCQLc[a]==b)continue;
b==null?delete this.__QCQLc[a]:this.__QCQLc[a]=b;
if(d){e.set(this.__unOnl,a,b);
continue}this.__EN1mA[a]=true}qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush("element")}else for(a in c){b=c[a];
if(this.__QCQLc[a]==b)continue;
b==null?delete this.__QCQLc[a]:this.__QCQLc[a]=b}return this},
removeStyle:function(a,b){this.setStyle(a,null,b)},
getStyle:function(a){return this.__QCQLc?this.__QCQLc[a]:null},
getAllStyles:function(){return this.__QCQLc||null},
setAttribute:function(a,b,c){this.__WcMi9||(this.__WcMi9={});
if(this.__WcMi9[a]==b)return;
b==null?delete this.__WcMi9[a]:this.__WcMi9[a]=b;
if(this.__unOnl){if(c){qx.bom.element.Attribute.set(this.__unOnl,a,b);
return this}this.__JDcA3||(this.__JDcA3={});
this.__JDcA3[a]=true;
qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush("element")}return this},
setAttributes:function(b,c){for(var a in b)this.setAttribute(a,b[a],c);
return this},
removeAttribute:function(a,b){this.setAttribute(a,null,b)},
getAttribute:function(a){return this.__WcMi9?this.__WcMi9[a]:null},
_applyProperty:function(b,a){},
_setProperty:function(a,b,c){this.__bcpP8a||(this.__bcpP8a={});
if(this.__bcpP8a[a]==b)return;
b==null?delete this.__bcpP8a[a]:this.__bcpP8a[a]=b;
if(this.__unOnl){if(c){this._applyProperty(a,b);
return this}this.__Xz1tC||(this.__Xz1tC={});
this.__Xz1tC[a]=true;
qx.html.Element._modified[this.$$hash]=this;
qx.html.Element._scheduleFlush("element")}return this},
_removeProperty:function(a,b){this._setProperty(a,null,b)},
_getProperty:function(c){var b=this.__bcpP8a,a;
if(!b)return null;
a=b[c];
return a==null?null:a},
addListener:function(b,d,c,a){if(this.$$disposed)return null;
{var g="Failed to add event listener for type '"+b+"'"+" to the target '"+this+"': ",f,e;
this.assertString(b,g+"Invalid event type.");
this.assertFunction(d,g+"Invalid callback function");
c!==undefined&&this.assertObject(c,"Invalid context for callback.");
a!==undefined&&this.assertBoolean(a,"Invalid capture falg.")}if(this.__unOnl)return qx.event.Registration.addListener(this.__unOnl,b,d,c,a);
this.__PLMjJ||(this.__PLMjJ={});
a==null&&(a=false);
f=qx.event.Manager.getNextUniqueId(),e=b+(a?"|capture|":"|bubble|")+f;
this.__PLMjJ[e]={type:b,
listener:d,
self:c,
capture:a,
unique:f};
return e},
removeListener:function(c,g,d,a){if(this.$$disposed)return null;
{var h="Failed to remove event listener for type '"+c+"'"+" from the target '"+this+"': ",f,b,e;
this.assertString(c,h+"Invalid event type.");
this.assertFunction(g,h+"Invalid callback function");
d!==undefined&&this.assertObject(d,"Invalid context for callback.");
a!==undefined&&this.assertBoolean(a,"Invalid capture flag.")}if(this.__unOnl)qx.event.Registration.removeListener(this.__unOnl,c,g,d,a);
else{f=this.__PLMjJ;
a==null&&(a=false);
for(e in f){b=f[e];
if(b.listener===g&&b.self===d&&b.capture===a&&b.type===c){delete f[e];
break}}}return this},
removeListenerById:function(a){if(this.$$disposed)return null;
this.__unOnl?qx.event.Registration.removeListenerById(this.__unOnl,a):delete this.__PLMjJ[a];
return this},
hasListener:function(d,a){if(this.$$disposed)return false;
if(this.__unOnl)return qx.event.Registration.hasListener(this.__unOnl,d,a);
var e=this.__PLMjJ,b,c;
a==null&&(a=false);
for(c in e){b=e[c];
if(b.capture===a&&b.type===d)return true}return false}},
defer:function(a){a.__UOqV6=new qx.util.DeferredCall(a.flush,a)},
destruct:function(){var a=this.__unOnl,b;
a&&(qx.event.Registration.getManager(a).removeAllListeners(a),a.$$element="");
if(!qx.core.ObjectRegistry.inShutDown){b=this.__qvtBB;
b&&!b.$$disposed&&b.remove(this)}this._disposeArray("__children");
this.__WcMi9=this.__QCQLc=this.__PLMjJ=this.__bcpP8a=this.__JDcA3=this.__EN1mA=this.__Xz1tC=this.__unOnl=this.__qvtBB=this.__bSiL79=this.__bSi3bc=null}});


// qx.html.Decorator
//   - size: 656 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.client.Feature.CSS_POINTER_EVENTS, 1x
//       qx.html.Element, 1x
qx.Class.define("qx.html.Decorator",{extend:qx.html.Element,
construct:function(a,c){var b={position:"absolute",
top:0,
left:0};
qx.bom.client.Feature.CSS_POINTER_EVENTS&&(b.pointerEvents="none");
this.base(arguments,null,b);
this.__DWFSo=a;
this.__evm88=c||a.toHashCode();
this.useMarkup(a.getMarkup())},
members:{__evm88:null,
__DWFSo:null,
getId:function(){return this.__evm88},
getDecorator:function(){return this.__DWFSo},
resize:function(b,a){this.__DWFSo.resize(this.getDomElement(),b,a)},
tint:function(a){this.__DWFSo.tint(this.getDomElement(),a)},
getInsets:function(){return this.__DWFSo.getInsets()}},
destruct:function(){this.__DWFSo=null}});


// qx.ui.core.queue.Manager
//   - size: 1646 bytes
//   - modified: 2010-11-02T19:05:04
//   - names:
//       qx, 16x
//       window, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.client.Feature.TOUCH, 1x
//       qx.core.property.Multi.flush, 1x
//       qx.event.Registration.addListener, 1x
//       qx.html.Element._scheduleFlush, 1x
//       qx.html.Element.flush, 1x
//       qx.ui.core.queue.Appearance.flush, 1x
//       qx.ui.core.queue.Dispose.flush, 1x
//       qx.ui.core.queue.Layout.flush, 1x
//       qx.ui.core.queue.Manager, 3x
//       qx.ui.core.queue.Manager.PAUSE, 1x
//       qx.ui.core.queue.Visibility.flush, 1x
//       qx.ui.core.queue.Widget.flush, 1x
//       qx.util.DeferredCall, 1x
//       window.clearTimeout, 1x
//       window.setTimeout, 1x
qx.Class.define("qx.ui.core.queue.Manager",{statics:{__D9j7A:false,
__jyQXx:{},
__uZt45:0,
MAX_RETRIES:10,
scheduleFlush:function(b){var a=qx.ui.core.queue.Manager;
a.__jyQXx[b]=true;
a.__D9j7A||(a.__UOqV6.schedule(),a.__D9j7A=true)},
flush:function(){if(qx.ui.core.queue.Manager.PAUSE)return;
var b=qx.ui.core.queue.Manager,a;
if(b.__t3JNI)return;
b.__t3JNI=true;
b.__UOqV6.cancel();
a=b.__jyQXx;
b.__dj4YjQ(function(){while(a.visibility||a.widget||a.appearance||a.layout||a.element){a.widget&&(delete a.widget,qx.ui.core.queue.Widget.flush());
a.visibility&&(delete a.visibility,qx.ui.core.queue.Visibility.flush());
a.appearance&&(delete a.appearance,qx.ui.core.queue.Appearance.flush());
a.inheritance&&(delete a.inheritance,qx.core.property.Multi.flush());
if(a.widget||a.visibility||a.appearance||a.inheritance)continue;
a.layout&&(delete a.layout,qx.ui.core.queue.Layout.flush());
if(a.widget||a.visibility||a.appearance||a.layout)continue;
a.element&&(delete a.element,qx.html.Element.flush())}},function(){b.__D9j7A=false});
b.__dj4YjQ(function(){a.dispose&&(delete a.dispose,qx.ui.core.queue.Dispose.flush())},function(){b.__t3JNI=false});
b.__uZt45=0},
__dj4YjQ:function(b,a){b();
a()},
__Vdblt:function(b){var a=qx.ui.core.queue.Manager;
b.getData()=="touchend"?(a.PAUSE=true,a.__Wiyk4&&window.clearTimeout(a.__Wiyk4),a.__Wiyk4=window.setTimeout(function(){a.PAUSE=false;
a.__Wiyk4=null;
a.flush()},500)):a.flush()}},
defer:function(a){a.__UOqV6=new qx.util.DeferredCall(a.flush);
qx.html.Element._scheduleFlush=a.scheduleFlush;
qx.event.Registration.addListener(window,"useraction",qx.bom.client.Feature.TOUCH?a.__Vdblt:a.flush)}});


// qx.ui.core.queue.Visibility
//   - size: 784 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.queue.Manager.scheduleFlush, 1x
qx.Class.define("qx.ui.core.queue.Visibility",{statics:{__m5bO4:{},
__jlEBF:{},
remove:function(b){var a=b.$$hash;
delete this.__jlEBF[a];
delete this.__m5bO4[a]},
isVisible:function(a){return this.__jlEBF[a.$$hash]||false},
__ba6aAU:function(b){var e=this.__jlEBF,d=b.$$hash,a,c;
if(b.isExcluded())a=false;
else{c=b.$$parent;
a=c?this.__ba6aAU(c):b.isRootWidget()}return e[d]=a},
add:function(a){var b=this.__m5bO4;
if(b[a.$$hash])return;
b[a.$$hash]=a;
qx.ui.core.queue.Manager.scheduleFlush("visibility")},
flush:function(){var b=this.__m5bO4,c=this.__jlEBF,a,e,d;
for(a in b)c[a]!=null&&b[a].addChildrenToQueue(b);
e={};
for(a in b)e[a]=c[a],c[a]=null;
for(a in b){d=b[a];
delete b[a];
c[a]==null&&this.__ba6aAU(d);
c[a]&&c[a]!=e[a]&&d.checkAppearanceNeeds()}this.__m5bO4={}}}});


// qx.ui.core.queue.Appearance
//   - size: 459 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.queue.Manager.scheduleFlush, 1x
//       qx.ui.core.queue.Visibility, 1x
qx.Class.define("qx.ui.core.queue.Appearance",{statics:{__m5bO4:{},
remove:function(a){delete this.__m5bO4[a.$$hash]},
add:function(a){var b=this.__m5bO4;
if(b[a.$$hash])return;
b[a.$$hash]=a;
qx.ui.core.queue.Manager.scheduleFlush("appearance")},
has:function(a){return!!this.__m5bO4[a.$$hash]},
flush:function(){var d=qx.ui.core.queue.Visibility,c=this.__m5bO4,a,b;
for(b in c)a=c[b],delete c[b],d.isVisible(a)?a.syncAppearance():a.$$stateChanges=true}}});


// qx.ui.core.queue.Dispose
//   - size: 317 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.queue.Manager.scheduleFlush, 1x
qx.Class.define("qx.ui.core.queue.Dispose",{statics:{__m5bO4:{},
add:function(a){var b=this.__m5bO4;
if(b[a.$$hash])return;
b[a.$$hash]=a;
qx.ui.core.queue.Manager.scheduleFlush("dispose")},
flush:function(){var b=this.__m5bO4,a,c;
for(a in b){c=b[a];
delete b[a];
c.dispose()}for(a in b)return;
this.__m5bO4={}}}});


// qx.ui.core.queue.Widget
//   - size: 367 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.queue.Manager.scheduleFlush, 1x
qx.Class.define("qx.ui.core.queue.Widget",{statics:{__m5bO4:{},
remove:function(a){delete this.__m5bO4[a.$$hash]},
add:function(a){var b=this.__m5bO4;
if(b[a.$$hash])return;
b[a.$$hash]=a;
qx.ui.core.queue.Manager.scheduleFlush("widget")},
flush:function(){var b=this.__m5bO4,c,a;
for(a in b)c=b[a],delete b[a],c.syncWidget();
for(a in b)return;
this.__m5bO4={}}}});


// qx.ui.core.queue.Layout
//   - size: 1496 bytes
//   - modified: 2010-09-23T21:51:03
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.queue.Manager.scheduleFlush, 1x
//       qx.ui.core.queue.Visibility, 1x
qx.Class.define("qx.ui.core.queue.Layout",{statics:{__m5bO4:{},
remove:function(a){delete this.__m5bO4[a.$$hash]},
add:function(a){this.__m5bO4[a.$$hash]=a;
qx.ui.core.queue.Manager.scheduleFlush("layout")},
flush:function(){for(var e=this.__9Pfyj(),c=e.length-1,a,d,b;
c>=0;
c--){a=e[c];
if(a.hasValidLayout())continue;
if(a.isRootWidget()&&!a.hasUserBounds()){d=a.getSizeHint();
a.renderLayout(0,0,d.width,d.height)}else{b=a.getBounds();
a.renderLayout(b.left,b.top,b.width,b.height)}}},
getNestingLevel:function(b){var d=this.__uUf9n,c=0,a=b,e;
while(true){if(d[a.$$hash]!=null){c+=d[a.$$hash];
break}if(!a.$$parent)break;
a=a.$$parent;
c+=1}e=c;
while(b&&b!==a)d[b.$$hash]=e--,b=b.$$parent;
return c},
__ck6vOq:function(){var f=qx.ui.core.queue.Visibility,c,e,d,a,b;
this.__uUf9n={};
c=[],e=this.__m5bO4;
for(b in e)d=e[b],f.isVisible(d)&&(a=this.getNestingLevel(d),c[a]||(c[a]={}),c[a][b]=d,delete e[b]);
return c},
__9Pfyj:function(){for(var f=[],d=this.__ck6vOq(),b=d.length-1,i,a,c,e,g,h;
b>=0;
b--){if(!d[b])continue;
for(i in d[b]){a=d[b][i];
if(b==0||a.isRootWidget()||a.hasUserBounds()){f.push(a);
a.invalidateLayoutCache();
continue}c=a.getSizeHint(false);
if(c){a.invalidateLayoutCache();
e=a.getSizeHint(),g=(!a.getBounds()||c.minWidth!==e.minWidth||c.width!==e.width||c.maxWidth!==e.maxWidth||c.minHeight!==e.minHeight||c.height!==e.height||c.maxHeight!==e.maxHeight)}else g=true;
if(g){h=a.getLayoutParent();
d[b-1]||(d[b-1]={});
d[b-1][h.$$hash]=h}else f.push(a)}}return f}}});


// qx.ui.core.DecoratorFactory
//   - size: 1221 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       qx, 9x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.core.ObjectRegistry.inShutDown, 1x
//       qx.html.Decorator, 1x
//       qx.lang.Type.isString, 1x
//       qx.theme.manager.Decoration.getInstance, 1x
//       qx.ui.core.DecoratorFactory, 2x
//       qx.util.DisposeUtil.disposeArray, 1x
qx.Class.define("qx.ui.core.DecoratorFactory",{extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__jKF37={}},
statics:{MAX_SIZE:15,
__DM27F:"$$nopool$$"},
members:{__jKF37:null,
getDecoratorElement:function(a){var f=qx.ui.core.DecoratorFactory,b,e,c,d;
if(qx.lang.Type.isString(a)){b=a,e=qx.theme.manager.Decoration.getInstance().resolve(a)}else{b=f.__DM27F;
e=a}c=this.__jKF37;
if(c[b]&&c[b].length>0)d=c[b].pop();
else d=this._createDecoratorElement(e,b);
d.$$pooled=false;
return d},
poolDecorator:function(a){if(!a||a.$$pooled||a.isDisposed())return;
var d=qx.ui.core.DecoratorFactory,b=a.getId(),c;
if(b==d.__DM27F){a.dispose();
return}c=this.__jKF37;
c[b]||(c[b]=[]);
c[b].length>d.MAX_SIZE?a.dispose():(a.$$pooled=true,c[b].push(a))},
_createDecoratorElement:function(b,c){var a=new qx.html.Decorator(b,c);
a.setAttribute("qxType","decorator");
return a},
toString:function(){var c=0,b=0,a;
for(a in this.__jKF37)c+=1,b+=this.__jKF37[a].length;
return["qx.ui.core.DecoratorFactory[",this.$$hash,"] ","keys: ",c,", elements: ",b].join("")}},
destruct:function(){if(!qx.core.ObjectRegistry.inShutDown){var b=this.__jKF37,a;
for(a in b)qx.util.DisposeUtil.disposeArray(b,a)}this.__jKF37=null}});


// qx.html.Label
//   - size: 682 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 1x
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Label.create, 1x
//       qx.bom.Label.setValue, 1x
//       qx.html.Element, 1x
qx.Class.define("qx.html.Label",{extend:qx.html.Element,
members:{__jAecz:null,
_applyProperty:function(b,a){this.base(arguments,b,a);
if(b=="value"){var c=this.getDomElement();
qx.bom.Label.setValue(c,a)}},
_createDomElement:function(){var a=this.__jAecz,b=qx.bom.Label.create(this._content,a);
return b},
_copyData:function(a){return this.base(arguments,true)},
setRich:function(a){var b=this.getDomElement();
if(b)throw new Error("The label mode cannot be modified after initial creation");
a=!!a;
if(this.__jAecz==a)return;
this.__jAecz=a;
return this},
setValue:function(a){this._setProperty("value",a);
return this},
getValue:function(){return this._getProperty("value")}}});


// qx.ui.window.Manager
//   - size: 1159 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.lang.Array.remove, 2x
//       qx.ui.core.queue.Widget.add, 1x
//       qx.ui.window.IWindowManager, 1x
qx.Class.define("qx.ui.window.Manager",{extend:qx.core.Object,
implement:qx.ui.window.IWindowManager,
members:{__uDc7p:null,
setDesktop:function(a){this.__uDc7p=a;
this.updateStack()},
getDesktop:function(){return this.__uDc7p},
changeActiveWindow:function(a,b){a&&(this.bringToFront(a),a.setActive(true));
b&&b.resetActive()},
_minZIndex:1e5,
updateStack:function(){qx.ui.core.queue.Widget.add(this)},
syncWidget:function(){this.__uDc7p.forceUnblockContent();
for(var d=this.__uDc7p.getWindows(),c=this._minZIndex,g=c+d.length*2,e=c+d.length*4,b=null,f=0,h=d.length,a;
f<h;
f++){a=d[f];
if(!a.isVisible())continue;
b=b||a;
a.isModal()?(a.setZIndex(e),this.__uDc7p.blockContent(e-1),e+=2,b=a):a.isAlwaysOnTop()?(a.setZIndex(g),g+=2):(a.setZIndex(c),c+=2);
(!b.isModal()&&a.isActive()||a.getZIndex()>b.getZIndex())&&(b=a)}this.__uDc7p.setActiveWindow(b)},
bringToFront:function(a){var b=this.__uDc7p.getWindows(),c=qx.lang.Array.remove(b,a);
c&&(b.push(a),this.updateStack())},
sendToBack:function(a){var b=this.__uDc7p.getWindows(),c=qx.lang.Array.remove(b,a);
c&&(b.unshift(a),this.updateStack())}},
destruct:function(){this._disposeObjects("__desktop")}});


// qx.html.Image
//   - size: 1020 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Decoration.getTagName, 1x
//       qx.bom.element.Decoration.update, 1x
//       qx.html.Element, 1x
qx.Class.define("qx.html.Image",{extend:qx.html.Element,
members:{tagNameHint:null,
_applyProperty:function(b,d){this.base(arguments,b,d);
if(b==="source"){var e=this.getDomElement(),a=this.getAllStyles(),c,g,f;
this.getNodeName()=="div"&&this.getStyle("backgroundImage")&&(a.backgroundPosition=null,a.backgroundRepeat=null);
c=this._getProperty("source"),g=this._getProperty("scale"),f=g?"scale":"no-repeat";
c!=null&&qx.bom.element.Decoration.update(e,c,f,a)}},
_createDomElement:function(){var b=this._getProperty("scale"),a=b?"scale":"no-repeat";
this.setNodeName(qx.bom.element.Decoration.getTagName(a));
return this.base(arguments)},
_copyData:function(a){return this.base(arguments,true)},
setSource:function(a){this._setProperty("source",a);
return this},
getSource:function(){return this._getProperty("source")},
resetSource:function(){this._removeProperty("source",true);
return this},
setScale:function(a){this._setProperty("scale",a);
return this},
getScale:function(){return this._getProperty("scale")}}});


// qx.ui.core.LayoutItem
//   - size: 5736 bytes
//   - modified: 2010-09-30T14:19:27
//   - names:
//       Infinity, 2x
//       qx, 11x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Init.getApplication, 1x
//       qx.core.Object, 1x
//       qx.ui.core.queue.Layout.add, 7x
//       qx.ui.core.queue.Visibility.add, 1x
qx.Class.define("qx.ui.core.LayoutItem",{type:"abstract",
extend:qx.core.Object,
properties:{minWidth:{check:"Integer",
nullable:true,
apply:"_applyDimension",
init:null,
themeable:true},
width:{check:"Integer",
nullable:true,
apply:"_applyDimension",
init:null,
themeable:true},
maxWidth:{check:"Integer",
nullable:true,
apply:"_applyDimension",
init:null,
themeable:true},
minHeight:{check:"Integer",
nullable:true,
apply:"_applyDimension",
init:null,
themeable:true},
height:{check:"Integer",
nullable:true,
apply:"_applyDimension",
init:null,
themeable:true},
maxHeight:{check:"Integer",
nullable:true,
apply:"_applyDimension",
init:null,
themeable:true},
allowGrowX:{check:"Boolean",
apply:"_applyStretching",
init:true,
themeable:true},
allowShrinkX:{check:"Boolean",
apply:"_applyStretching",
init:true,
themeable:true},
allowGrowY:{check:"Boolean",
apply:"_applyStretching",
init:true,
themeable:true},
allowShrinkY:{check:"Boolean",
apply:"_applyStretching",
init:true,
themeable:true},
allowStretchX:{group:["allowGrowX","allowShrinkX"],
shorthand:true,
themeable:true},
allowStretchY:{group:["allowGrowY","allowShrinkY"],
shorthand:true,
themeable:true},
marginTop:{check:"Integer",
init:0,
apply:"_applyMargin",
themeable:true},
marginRight:{check:"Integer",
init:0,
apply:"_applyMargin",
themeable:true},
marginBottom:{check:"Integer",
init:0,
apply:"_applyMargin",
themeable:true},
marginLeft:{check:"Integer",
init:0,
apply:"_applyMargin",
themeable:true},
margin:{group:["marginTop","marginRight","marginBottom","marginLeft"],
shorthand:true,
themeable:true},
alignX:{check:["left","center","right"],
nullable:true,
apply:"_applyAlign",
themeable:true},
alignY:{check:["top","middle","bottom","baseline"],
nullable:true,
apply:"_applyAlign",
themeable:true}},
members:{__cmOnDM:null,
__baXU8g:null,
__bozQgS:null,
__zcIy1:null,
__VRBxk:null,
__JXPgP:null,
__bsuVwA:null,
getBounds:function(){return this.__JXPgP||this.__baXU8g||null},
clearSeparators:function(){},
renderSeparator:function(b,a){},
renderLayout:function(e,h,d,f){{var c="Something went wrong with the layout of "+this.toString()+"!",g,a,b;
this.assertInteger(e,"Wrong 'left' value. "+c);
this.assertInteger(h,"Wrong 'top' value. "+c);
this.assertInteger(d,"Wrong 'width' value. "+c);
this.assertInteger(f,"Wrong 'height' value. "+c)}g=null;
if(this.getHeight()==null&&this._hasHeightForWidth())g=this._getHeightForWidth(d);
if(g!=null&&g!==this.__cmOnDM){this.__cmOnDM=g;
qx.ui.core.queue.Layout.add(this);
return null}a=this.__baXU8g;
a||(a=this.__baXU8g={});
b={};
(e!==a.left||h!==a.top)&&(b.position=true,a.left=e,a.top=h);
(d!==a.width||f!==a.height)&&(b.size=true,a.width=d,a.height=f);
this.__bozQgS&&(b.local=true,delete this.__bozQgS);
this.__VRBxk&&(b.margin=true,delete this.__VRBxk);
return b},
isExcluded:function(){return false},
hasValidLayout:function(){return!this.__bozQgS},
scheduleLayoutUpdate:function(){qx.ui.core.queue.Layout.add(this)},
invalidateLayoutCache:function(){this.__bozQgS=true;
this.__zcIy1=null},
getSizeHint:function(b){var a=this.__zcIy1;
if(a)return a;
if(b===false)return null;
a=this.__zcIy1=this._computeSizeHint();
this._hasHeightForWidth()&&this.__cmOnDM&&this.getHeight()==null&&(a.height=this.__cmOnDM);
a.minWidth>a.width&&(a.width=a.minWidth);
a.maxWidth<a.width&&(a.width=a.maxWidth);
this.getAllowGrowX()||(a.maxWidth=a.width);
this.getAllowShrinkX()||(a.minWidth=a.width);
a.minHeight>a.height&&(a.height=a.minHeight);
a.maxHeight<a.height&&(a.height=a.maxHeight);
this.getAllowGrowY()||(a.maxHeight=a.height);
this.getAllowShrinkY()||(a.minHeight=a.height);
return a},
_computeSizeHint:function(){var b=this.getMinWidth()||0,a=this.getMinHeight()||0,f=this.getWidth()||b,c=this.getHeight()||a,e=this.getMaxWidth()||Infinity,d=this.getMaxHeight()||Infinity;
return{minWidth:b,
width:f,
maxWidth:e,
minHeight:a,
height:c,
maxHeight:d}},
_hasHeightForWidth:function(){var a=this._getLayout();
if(a)return a.hasHeightForWidth();
return false},
_getHeightForWidth:function(b){var a=this._getLayout();
if(a&&a.hasHeightForWidth())return a.getHeightForWidth(b);
return null},
_getLayout:function(){return null},
_applyMargin:function(){this.__VRBxk=true;
var a=this.$$parent;
a&&a.updateLayoutProperties()},
_applyAlign:function(){var a=this.$$parent;
a&&a.updateLayoutProperties()},
_applyDimension:function(){qx.ui.core.queue.Layout.add(this)},
_applyStretching:function(){qx.ui.core.queue.Layout.add(this)},
hasUserBounds:function(){return!!this.__JXPgP},
setUserBounds:function(b,c,d,a){this.__JXPgP={left:b,
top:c,
width:d,
height:a};
qx.ui.core.queue.Layout.add(this)},
resetUserBounds:function(){delete this.__JXPgP;
qx.ui.core.queue.Layout.add(this)},
__bjKV6d:{},
setLayoutProperties:function(a){if(a==null)return;
var c=this.__bsuVwA,d,b;
c||(c=this.__bsuVwA={});
d=this.getLayoutParent();
d&&d.updateLayoutProperties(a);
for(b in a)a[b]==null?delete c[b]:c[b]=a[b]},
getLayoutProperties:function(){return this.__bsuVwA||this.__bjKV6d},
clearLayoutProperties:function(){delete this.__bsuVwA},
updateLayoutProperties:function(a){var c=this._getLayout(),b;
if(c){if(a)for(b in a)a[b]!==null&&c.verifyLayoutProperty(this,b,a[b]);
c.invalidateChildrenCache()}qx.ui.core.queue.Layout.add(this)},
getApplicationRoot:function(){return qx.core.Init.getApplication().getRoot()},
getLayoutParent:function(){return this.$$parent||null},
setLayoutParent:function(a){if(this.$$parent===a)return;
this.$$parent=a||null;
qx.ui.core.queue.Visibility.add(this)},
isRootWidget:function(){return false},
_getRoot:function(){var a=this;
while(a){if(a.isRootWidget())return a;
a=a.$$parent}return null}},
destruct:function(){this.$$parent=this.$$subparent=this.__bsuVwA=this.__baXU8g=this.__JXPgP=this.__zcIy1=null}});


// qx.ui.layout.Abstract
//   - size: 1283 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.ui.core.LayoutItem, 1x
qx.Class.define("qx.ui.layout.Abstract",{type:"abstract",
extend:qx.core.Object,
members:{__zcIy1:null,
_invalidChildrenCache:null,
__qzkhX:null,
invalidateLayoutCache:function(){this.__zcIy1=null},
renderLayout:function(b,a){this.warn("Missing renderLayout() implementation!")},
getSizeHint:function(){if(this.__zcIy1)return this.__zcIy1;
return this.__zcIy1=this._computeSizeHint()},
hasHeightForWidth:function(){return false},
getHeightForWidth:function(a){this.warn("Missing getHeightForWidth() implementation!");
return null},
_computeSizeHint:function(){return null},
invalidateChildrenCache:function(){this._invalidChildrenCache=true},
verifyLayoutProperty:function(c,b,a){},
_clearSeparators:function(){var a=this.__qzkhX;
a instanceof qx.ui.core.LayoutItem&&a.clearSeparators()},
_renderSeparator:function(b,a){this.__qzkhX.renderSeparator(b,a)},
connectToWidget:function(a){if(a&&this.__qzkhX)throw new Error("It is not possible to manually set the connected widget.");
this.__qzkhX=a;
this.invalidateChildrenCache()},
_getWidget:function(){return this.__qzkhX},
_applyLayoutChange:function(){this.__qzkhX&&this.__qzkhX.scheduleLayoutUpdate()},
_getLayoutChildren:function(){return this.__qzkhX.getLayoutChildren()}},
destruct:function(){this.__qzkhX=this.__zcIy1=null}});


// qx.ui.layout.VBox
//   - size: 3493 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Array, 2x
//       Math, 6x
//       parseFloat, 1x
//       qx, 6x
//   - packages:
//       Math.floor, 1x
//       Math.max, 2x
//       Math.min, 1x
//       Math.round, 2x
//       qx.Class.define, 1x
//       qx.theme.manager.Decoration.getInstance, 1x
//       qx.ui.layout.Abstract, 1x
//       qx.ui.layout.Util, 2x
//       qx.ui.layout.Util.PERCENT_VALUE, 1x
qx.Class.define("qx.ui.layout.VBox",{extend:qx.ui.layout.Abstract,
construct:function(c,b,a){this.base(arguments);
c&&this.setSpacing(c);
b&&this.setAlignY(b);
a&&this.setSeparator(a)},
properties:{alignY:{check:["top","middle","bottom"],
init:"top",
apply:"_applyLayoutChange"},
alignX:{check:["left","center","right"],
init:"left",
apply:"_applyLayoutChange"},
spacing:{check:"Integer",
init:0,
apply:"_applyLayoutChange"},
separator:{check:"Decorator",
nullable:true,
apply:"_applyLayoutChange"},
reversed:{check:"Boolean",
init:false,
apply:"_applyReversed"}},
members:{__umq8d:null,
__mLFlJ:null,
__ItYVd:null,
__yONi8:null,
_applyReversed:function(){this._invalidChildrenCache=true;
this._applyLayoutChange()},
__VfnJe:function(){var b=this._getLayoutChildren(),d=b.length,g=false,f=this.__umq8d&&this.__umq8d.length!=d&&this.__mLFlJ&&this.__umq8d,c,h=f?this.__umq8d:new Array(d),e=f?this.__mLFlJ:new Array(d),a;
this.getReversed()&&(b=b.concat().reverse());
for(a=0;
a<d;
a++)c=b[a].getLayoutProperties(),c.height!=null&&(h[a]=parseFloat(c.height)/100),c.flex!=null?(e[a]=c.flex,g=true):e[a]=0;
f||(this.__umq8d=h,this.__mLFlJ=e);
this.__ItYVd=g;
this.__yONi8=b;
delete this._invalidChildrenCache},
verifyLayoutProperty:function(c,a,b){this.assert(a==="flex"||a==="height","The property '"+a+"' is not supported by the VBox layout!");
a=="height"?this.assertMatch(b,qx.ui.layout.Util.PERCENT_VALUE):(this.assertNumber(b),this.assert(b>=0))},
renderLayout:function(s,i){this._invalidChildrenCache&&this.__VfnJe();
var d=this.__yONi8,n=d.length,j=qx.ui.layout.Util,k=this.getSpacing(),f=this.getSeparator(),A,a,c,h,q,l,e,x,u,p,z,b,g,v,o,t,m,r,w,y;
if(f)A=j.computeVerticalSeparatorGaps(d,k,f);
else A=j.computeVerticalGaps(d,k,true);
l=[],e=A;
for(a=0;
a<n;
a+=1)q=this.__umq8d[a],h=q!=null?Math.floor((i-A)*q):d[a].getSizeHint().height,l.push(h),e+=h;
if(this.__ItYVd&&e!=i){x={};
for(a=0;
a<n;
a+=1)u=this.__mLFlJ[a],u>0&&(g=d[a].getSizeHint(),x[a]={min:g.minHeight,
value:l[a],
max:g.maxHeight,
flex:u});
z=j.computeFlexOffsets(x,i,e);
for(a in z)p=z[a].offset,l[a]+=p,e+=p}b=d[0].getMarginTop();
e<i&&this.getAlignY()!="top"&&(b=i-e,this.getAlignY()==="middle"&&(b=Math.round(b/2)));
this._clearSeparators();
if(f){w=qx.theme.manager.Decoration.getInstance().resolve(f).getInsets(),y=w.top+w.bottom}for(a=0;
a<n;
a+=1)c=d[a],h=l[a],g=c.getSizeHint(),m=c.getMarginLeft(),r=c.getMarginRight(),o=Math.max(g.minWidth,Math.min(s-m-r,g.maxWidth)),v=j.computeHorizontalAlignOffset(c.getAlignX()||this.getAlignX(),o,s,m,r),a>0&&(f?(b+=t+k,this._renderSeparator(f,{top:b,
left:0,
height:y,
width:s}),b+=y+k+c.getMarginTop()):b+=j.collapseMargins(k,t,c.getMarginTop())),c.renderLayout(v,b,o,h),b+=h,t=c.getMarginBottom()},
_computeSizeHint:function(){this._invalidChildrenCache&&this.__VfnJe();
for(var n=qx.ui.layout.Util,d=this.__yONi8,f=0,o=0,k=0,i=0,h=0,e,a,b,c=0,p=d.length,q,m,l,g,j;
c<p;
c+=1){e=d[c];
a=e.getSizeHint();
o+=a.height;
q=this.__mLFlJ[c],m=this.__umq8d[c];
q?f+=a.minHeight:m?k=Math.max(k,Math.round(a.minHeight/m)):f+=a.height;
b=e.getMarginLeft()+e.getMarginRight();
a.width+b>h&&(h=a.width+b);
a.minWidth+b>i&&(i=a.minWidth+b)}f+=k;
l=this.getSpacing(),g=this.getSeparator();
if(g)j=n.computeVerticalSeparatorGaps(d,l,g);
else j=n.computeVerticalGaps(d,l,true);
this.assertInteger(j,"Layout utility returned invalid gaps. Used separator: "+g);
return{minHeight:f+j,
height:o+j,
minWidth:i,
width:h}}},
destruct:function(){this.__umq8d=this.__mLFlJ=this.__yONi8=null}});


// qx.ui.layout.HBox
//   - size: 3518 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Array, 2x
//       Math, 6x
//       parseFloat, 1x
//       qx, 6x
//   - packages:
//       Math.floor, 1x
//       Math.max, 2x
//       Math.min, 1x
//       Math.round, 2x
//       qx.Class.define, 1x
//       qx.theme.manager.Decoration.getInstance, 1x
//       qx.ui.layout.Abstract, 1x
//       qx.ui.layout.Util, 2x
//       qx.ui.layout.Util.PERCENT_VALUE, 1x
qx.Class.define("qx.ui.layout.HBox",{extend:qx.ui.layout.Abstract,
construct:function(c,b,a){this.base(arguments);
c&&this.setSpacing(c);
b&&this.setAlignX(b);
a&&this.setSeparator(a)},
properties:{alignX:{check:["left","center","right"],
init:"left",
apply:"_applyLayoutChange"},
alignY:{check:["top","middle","bottom"],
init:"top",
apply:"_applyLayoutChange"},
spacing:{check:"Integer",
init:0,
apply:"_applyLayoutChange"},
separator:{check:"Decorator",
nullable:true,
apply:"_applyLayoutChange"},
reversed:{check:"Boolean",
init:false,
apply:"_applyReversed"}},
members:{__qLqrC:null,
__mLFlJ:null,
__ItYVd:null,
__yONi8:null,
_applyReversed:function(){this._invalidChildrenCache=true;
this._applyLayoutChange()},
__VfnJe:function(){var b=this._getLayoutChildren(),d=b.length,g=false,f=this.__qLqrC&&this.__qLqrC.length!=d&&this.__mLFlJ&&this.__qLqrC,c,h=f?this.__qLqrC:new Array(d),e=f?this.__mLFlJ:new Array(d),a;
this.getReversed()&&(b=b.concat().reverse());
for(a=0;
a<d;
a++)c=b[a].getLayoutProperties(),c.width!=null&&(h[a]=parseFloat(c.width)/100),c.flex!=null?(e[a]=c.flex,g=true):e[a]=0;
f||(this.__qLqrC=h,this.__mLFlJ=e);
this.__ItYVd=g;
this.__yONi8=b;
delete this._invalidChildrenCache},
verifyLayoutProperty:function(c,a,b){this.assert(a==="flex"||a==="width","The property '"+a+"' is not supported by the HBox layout!");
a=="width"?this.assertMatch(b,qx.ui.layout.Util.PERCENT_VALUE):(this.assertNumber(b),this.assert(b>=0))},
renderLayout:function(i,q){this._invalidChildrenCache&&this.__VfnJe();
var d=this.__yONi8,n=d.length,j=qx.ui.layout.Util,k=this.getSpacing(),e=this.getSeparator(),A,a,c,f,p,l,h,y,u,o,z,b,g,x,r,s,m,t,w,v;
if(e)A=j.computeHorizontalSeparatorGaps(d,k,e);
else A=j.computeHorizontalGaps(d,k,true);
l=[],h=A;
for(a=0;
a<n;
a+=1)p=this.__qLqrC[a],f=p!=null?Math.floor((i-A)*p):d[a].getSizeHint().width,l.push(f),h+=f;
if(this.__ItYVd&&h!=i){y={};
for(a=0;
a<n;
a+=1)u=this.__mLFlJ[a],u>0&&(g=d[a].getSizeHint(),y[a]={min:g.minWidth,
value:l[a],
max:g.maxWidth,
flex:u});
z=j.computeFlexOffsets(y,i,h);
for(a in z)o=z[a].offset,l[a]+=o,h+=o}b=d[0].getMarginLeft();
h<i&&this.getAlignX()!="left"&&(b=i-h,this.getAlignX()==="center"&&(b=Math.round(b/2)));
k=this.getSpacing();
this._clearSeparators();
if(e){w=qx.theme.manager.Decoration.getInstance().resolve(e).getInsets(),v=w.left+w.right}for(a=0;
a<n;
a+=1)c=d[a],f=l[a],g=c.getSizeHint(),m=c.getMarginTop(),t=c.getMarginBottom(),r=Math.max(g.minHeight,Math.min(q-m-t,g.maxHeight)),x=j.computeVerticalAlignOffset(c.getAlignY()||this.getAlignY(),r,q,m,t),a>0&&(e?(b+=s+k,this._renderSeparator(e,{left:b,
top:0,
width:v,
height:q}),b+=v+k+c.getMarginLeft()):b+=j.collapseMargins(k,s,c.getMarginLeft())),c.renderLayout(b,x,f,r),b+=f,s=c.getMarginRight()},
_computeSizeHint:function(){this._invalidChildrenCache&&this.__VfnJe();
for(var n=qx.ui.layout.Util,e=this.__yONi8,d=0,l=0,i=0,k=0,j=0,f,a,b,c=0,p=e.length,q,m,o,g,h;
c<p;
c+=1){f=e[c];
a=f.getSizeHint();
l+=a.width;
q=this.__mLFlJ[c],m=this.__qLqrC[c];
q?d+=a.minWidth:m?i=Math.max(i,Math.round(a.minWidth/m)):d+=a.width;
b=f.getMarginTop()+f.getMarginBottom();
a.height+b>j&&(j=a.height+b);
a.minHeight+b>k&&(k=a.minHeight+b)}d+=i;
o=this.getSpacing(),g=this.getSeparator();
if(g)h=n.computeHorizontalSeparatorGaps(e,o,g);
else h=n.computeHorizontalGaps(e,o,true);
this.assertInteger(h,"Layout utility returned invalid gaps. Used separator: "+g);
return{minWidth:d+h,
width:l+h,
minHeight:k,
height:j}}},
destruct:function(){this.__qLqrC=this.__mLFlJ=this.__yONi8=null}});


// qx.ui.layout.Grid
//   - size: 10379 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 2x
//       Infinity, 3x
//       Math, 18x
//       qx, 9x
//       undefined, 7x
//   - packages:
//       Math.max, 14x
//       Math.min, 4x
//       qx.Class.define, 1x
//       qx.ui.layout.Abstract, 1x
//       qx.ui.layout.Util, 1x
//       qx.ui.layout.Util.computeFlexOffsets, 6x
qx.Class.define("qx.ui.layout.Grid",{extend:qx.ui.layout.Abstract,
construct:function(a,b){this.base(arguments);
this.__usc9t=[];
this.__tKdjT=[];
a&&this.setSpacingX(a);
b&&this.setSpacingY(b)},
properties:{spacingX:{check:"Integer",
init:0,
apply:"_applyLayoutChange"},
spacingY:{check:"Integer",
init:0,
apply:"_applyLayoutChange"}},
members:{__jxKLh:null,
__usc9t:null,
__tKdjT:null,
__yElrO:null,
__ztuye:null,
__O01ZN:null,
__ObSTn:null,
__JCnsd:null,
__DHg8i:null,
verifyLayoutProperty:function(d,b,a){var c={row:1,
column:1,
rowSpan:1,
colSpan:1};
this.assert(c[b]==1,"The property '"+b+"' is not supported by the Grid layout!");
this.assertInteger(a);
this.assert(a>=0,"Value must be positive")},
__DCSll:function(){for(var c=[],m=[],l=[],h=-1,j=-1,k=this._getLayoutChildren(),i=0,n=k.length,e,a,d,f,g,b;
i<n;
i++){e=k[i],a=e.getLayoutProperties(),d=a.row,f=a.column;
a.colSpan=a.colSpan||1;
a.rowSpan=a.rowSpan||1;
if(d==null||f==null)throw new Error("The layout properties 'row' and 'column' of the child widget '"+e+"' must be defined!");
if(c[d]&&c[d][f])throw new Error("Cannot add widget '"+e+"'!. "+"There is already a widget '"+c[d][f]+"' in this cell ("+d+", "+f+")");
for(g=f;
g<f+a.colSpan;
g++)for(b=d;
b<d+a.rowSpan;
b++)c[b]==undefined&&(c[b]=[]),c[b][g]=e,j=Math.max(j,g),h=Math.max(h,b);
a.rowSpan>1&&l.push(e);
a.colSpan>1&&m.push(e)}for(b=0;
b<=h;
b++)c[b]==undefined&&(c[b]=[]);
this.__jxKLh=c;
this.__yElrO=m;
this.__ztuye=l;
this.__O01ZN=h;
this.__ObSTn=j;
this.__JCnsd=null;
this.__DHg8i=null;
delete this._invalidChildrenCache},
_setRowData:function(a,c,b){var d=this.__usc9t[a];
d?d[c]=b:(this.__usc9t[a]={},this.__usc9t[a][c]=b)},
_setColumnData:function(a,c,b){var d=this.__tKdjT[a];
d?d[c]=b:(this.__tKdjT[a]={},this.__tKdjT[a][c]=b)},
setSpacing:function(a){this.setSpacingY(a);
this.setSpacingX(a);
return this},
setColumnAlign:function(a,c,b){this.assertInteger(a,"Invalid parameter 'column'"),this.assertInArray(c,["left","center","right"]),this.assertInArray(b,["top","middle","bottom"]);
this._setColumnData(a,"hAlign",c);
this._setColumnData(a,"vAlign",b);
this._applyLayoutChange();
return this},
getColumnAlign:function(b){var a=this.__tKdjT[b]||{};
return{vAlign:a.vAlign||"top",
hAlign:a.hAlign||"left"}},
setRowAlign:function(a,c,b){this.assertInteger(a,"Invalid parameter 'row'"),this.assertInArray(c,["left","center","right"]),this.assertInArray(b,["top","middle","bottom"]);
this._setRowData(a,"hAlign",c);
this._setRowData(a,"vAlign",b);
this._applyLayoutChange();
return this},
getRowAlign:function(b){var a=this.__usc9t[b]||{};
return{vAlign:a.vAlign||"top",
hAlign:a.hAlign||"left"}},
getCellWidget:function(a,b){this._invalidChildrenCache&&this.__DCSll();
var a=this.__jxKLh[a]||{};
return a[b]||null},
getRowCount:function(){this._invalidChildrenCache&&this.__DCSll();
return this.__O01ZN+1},
getColumnCount:function(){this._invalidChildrenCache&&this.__DCSll();
return this.__ObSTn+1},
getCellAlign:function(g,h){var d="top",e="left",a=this.__usc9t[g],b=this.__tKdjT[h],f=this.__jxKLh[g][h],c;
if(f)c={vAlign:f.getAlignY(),
hAlign:f.getAlignX()};
else c={};
c.vAlign?d=c.vAlign:a&&a.vAlign?d=a.vAlign:b&&b.vAlign&&(d=b.vAlign);
c.hAlign?e=c.hAlign:b&&b.hAlign?e=b.hAlign:a&&a.hAlign&&(e=a.hAlign);
return{vAlign:d,
hAlign:e}},
setColumnFlex:function(b,a){this._setColumnData(b,"flex",a);
this._applyLayoutChange();
return this},
getColumnFlex:function(b){var a=this.__tKdjT[b]||{};
return a.flex!==undefined?a.flex:0},
setRowFlex:function(a,b){this._setRowData(a,"flex",b);
this._applyLayoutChange();
return this},
getRowFlex:function(b){var a=this.__usc9t[b]||{},c=a.flex!==undefined?a.flex:0;
return c},
setColumnMaxWidth:function(b,a){this._setColumnData(b,"maxWidth",a);
this._applyLayoutChange();
return this},
getColumnMaxWidth:function(b){var a=this.__tKdjT[b]||{};
return a.maxWidth!==undefined?a.maxWidth:Infinity},
setColumnWidth:function(b,a){this._setColumnData(b,"width",a);
this._applyLayoutChange();
return this},
getColumnWidth:function(b){var a=this.__tKdjT[b]||{};
return a.width!==undefined?a.width:null},
setColumnMinWidth:function(b,a){this._setColumnData(b,"minWidth",a);
this._applyLayoutChange();
return this},
getColumnMinWidth:function(b){var a=this.__tKdjT[b]||{};
return a.minWidth||0},
setRowMaxHeight:function(a,b){this._setRowData(a,"maxHeight",b);
this._applyLayoutChange();
return this},
getRowMaxHeight:function(a){var b=this.__usc9t[a]||{};
return b.maxHeight||Infinity},
setRowHeight:function(b,a){this._setRowData(b,"height",a);
this._applyLayoutChange();
return this},
getRowHeight:function(b){var a=this.__usc9t[b]||{};
return a.height!==undefined?a.height:null},
setRowMinHeight:function(a,b){this._setRowData(a,"minHeight",b);
this._applyLayoutChange();
return this},
getRowMinHeight:function(a){var b=this.__usc9t[a]||{};
return b.minHeight||0},
__VF3t7:function(b){var a=b.getSizeHint(),c=b.getMarginLeft()+b.getMarginRight(),d=b.getMarginTop()+b.getMarginBottom(),e={height:a.height+d,
width:a.width+c,
minHeight:a.minHeight+d,
minWidth:a.minWidth+c,
maxHeight:a.maxHeight+d,
maxWidth:a.maxWidth+c};
return e},
_fixHeightsRowSpan:function(h){for(var q=this.getSpacingY(),i=0,p=this.__ztuye.length,o,f,c,b,e,l,k,a,j,d,m,g,n;
i<p;
i++){o=this.__ztuye[i],f=this.__VF3t7(o),c=o.getLayoutProperties(),b=c.row,e=q*(c.rowSpan-1),l=e,k={},a=0;
for(;
a<c.rowSpan;
a++){j=c.row+a,d=h[j],m=this.getRowFlex(j);
m>0&&(k[j]={min:d.minHeight,
value:d.height,
max:d.maxHeight,
flex:m});
e+=d.height;
l+=d.minHeight}if(e<f.height){g=qx.ui.layout.Util.computeFlexOffsets(k,f.height,e),a=0;
for(;
a<c.rowSpan;
a++){n=g[b+a]?g[b+a].offset:0;
h[b+a].height+=n}}if(l<f.minHeight){g=qx.ui.layout.Util.computeFlexOffsets(k,f.minHeight,l),a=0;
for(;
a<c.rowSpan;
a++){n=g[b+a]?g[b+a].offset:0;
h[b+a].minHeight+=n}}}},
_fixWidthsColSpan:function(m){for(var q=this.getSpacingX(),l=0,p=this.__yElrO.length,o,g,b,c,f,k,i,h,a,j,d,n,e;
l<p;
l++){o=this.__yElrO[l],g=this.__VF3t7(o),b=o.getLayoutProperties(),c=b.column,f=q*(b.colSpan-1),k=f,i={},a=0;
for(;
a<b.colSpan;
a++){j=b.column+a,d=m[j],n=this.getColumnFlex(j);
n>0&&(i[j]={min:d.minWidth,
value:d.width,
max:d.maxWidth,
flex:n});
f+=d.width;
k+=d.minWidth}if(f<g.width){e=qx.ui.layout.Util.computeFlexOffsets(i,g.width,f),a=0;
for(;
a<b.colSpan;
a++)h=e[c+a]?e[c+a].offset:0,m[c+a].width+=h}if(k<g.minWidth){e=qx.ui.layout.Util.computeFlexOffsets(i,g.minWidth,k),a=0;
for(;
a<b.colSpan;
a++)h=e[c+a]?e[c+a].offset:0,m[c+a].minWidth+=h}}},
_getRowHeights:function(){if(this.__JCnsd!=null)return this.__JCnsd;
for(var c=[],j=this.__O01ZN,k=this.__ObSTn,a=0,b,d,h,e,g,i,f;
a<=j;
a++){b=0,d=0,h=0,e=0;
for(;
e<=k;
e++){g=this.__jxKLh[a][e];
if(!g)continue;
i=g.getLayoutProperties().rowSpan||0;
if(i>1)continue;
f=this.__VF3t7(g);
b=this.getRowFlex(a)>0?Math.max(b,f.minHeight):Math.max(b,f.height);
d=Math.max(d,f.height)}b=Math.max(b,this.getRowMinHeight(a)),h=this.getRowMaxHeight(a);
if(this.getRowHeight(a)!==null)d=this.getRowHeight(a);
else d=Math.max(b,Math.min(d,h));
c[a]={minHeight:b,
height:d,
maxHeight:h}}this.__ztuye.length>0&&this._fixHeightsRowSpan(c);
this.__JCnsd=c;
return c},
_getColWidths:function(){if(this.__DHg8i!=null)return this.__DHg8i;
for(var d=[],k=this.__ObSTn,j=this.__O01ZN,a=0,c,b,h,e,g,i,f;
a<=k;
a++){c=0,b=0,h=Infinity,e=0;
for(;
e<=j;
e++){g=this.__jxKLh[e][a];
if(!g)continue;
i=g.getLayoutProperties().colSpan||0;
if(i>1)continue;
f=this.__VF3t7(g);
b=this.getColumnFlex(a)>0?Math.max(b,f.minWidth):Math.max(b,f.width);
c=Math.max(c,f.width)}b=Math.max(b,this.getColumnMinWidth(a)),h=this.getColumnMaxWidth(a);
if(this.getColumnWidth(a)!==null)c=this.getColumnWidth(a);
else c=Math.max(b,Math.min(c,h));
d[a]={minWidth:b,
width:c,
maxWidth:h}}this.__yElrO.length>0&&this._fixWidthsColSpan(d);
this.__DHg8i=d;
return d},
_getColumnFlexOffsets:function(e){var h=this.getSizeHint(),c=e-h.width,f,g,b,i,a,d;
if(c==0)return{};
f=this._getColWidths(),g={},b=0,i=f.length;
for(;
b<i;
b++){a=f[b],d=this.getColumnFlex(b);
if(d<=0||a.width==a.maxWidth&&c>0||a.width==a.minWidth&&c<0)continue;
g[b]={min:a.minWidth,
value:a.width,
max:a.maxWidth,
flex:d}}return qx.ui.layout.Util.computeFlexOffsets(g,e,h.width)},
_getRowFlexOffsets:function(f){var h=this.getSizeHint(),c=f-h.height,e,g,b,i,a,d;
if(c==0)return{};
e=this._getRowHeights(),g={},b=0,i=e.length;
for(;
b<i;
b++){a=e[b],d=this.getRowFlex(b);
if(d<=0||a.height==a.maxHeight&&c>0||a.height==a.minHeight&&c<0)continue;
g[b]={min:a.minHeight,
value:a.height,
max:a.maxHeight,
flex:d}}return qx.ui.layout.Util.computeFlexOffsets(g,f,h.height)},
renderLayout:function(D,E){this._invalidChildrenCache&&this.__DCSll();
for(var u=qx.ui.layout.Util,y=this.getSpacingX(),i=this.getSpacingY(),C=this._getColWidths(),s=this._getColumnFlexOffsets(D),m=[],r=this.__ObSTn,z=this.__O01ZN,g,b=0,F,v,f,a,o,h,c,e,k,d,l,j,p,t,A,x,w,n,q,B,G;
b<=r;
b++)g=s[b]?s[b].offset:0,m[b]=C[b].width+g;
F=this._getRowHeights(),v=this._getRowFlexOffsets(E),f=[],a=0;
for(;
a<=z;
a++)g=v[a]?v[a].offset:0,f[a]=F[a].height+g;
o=0,b=0;
for(;
b<=r;
b++){h=0,a=0;
for(;
a<=z;
a++){c=this.__jxKLh[a][b];
if(!c){h+=f[a]+i;
continue}e=c.getLayoutProperties();
if(e.row!==a||e.column!==b){h+=f[a]+i;
continue}k=y*(e.colSpan-1),d=0;
for(;
d<e.colSpan;
d++)k+=m[b+d];
l=i*(e.rowSpan-1),d=0;
for(;
d<e.rowSpan;
d++)l+=f[a+d];
j=c.getSizeHint(),p=c.getMarginTop(),t=c.getMarginLeft(),A=c.getMarginBottom(),x=c.getMarginRight(),w=Math.max(j.minWidth,Math.min(k-t-x,j.maxWidth)),n=Math.max(j.minHeight,Math.min(l-p-A,j.maxHeight)),q=this.getCellAlign(a,b),B=o+u.computeHorizontalAlignOffset(q.hAlign,w,k,t,x),G=h+u.computeVerticalAlignOffset(q.vAlign,n,l,p,A);
c.renderLayout(B,G,w,n);
h+=f[a]+i}o+=m[b]+y}},
invalidateLayoutCache:function(){this.base(arguments);
this.__DHg8i=null;
this.__JCnsd=null},
_computeSizeHint:function(){this._invalidChildrenCache&&this.__DCSll();
for(var f=this._getColWidths(),g=0,h=0,a=0,l=f.length,d,c,e,k,b,i,j,m;
a<l;
a++){d=f[a];
g+=this.getColumnFlex(a)>0?d.minWidth:d.width;
h+=d.width}c=this._getRowHeights(),e=0,k=0,a=0,l=c.length;
for(;
a<l;
a++){b=c[a];
e+=this.getRowFlex(a)>0?b.minHeight:b.height;
k+=b.height}i=this.getSpacingX()*(f.length-1),j=this.getSpacingY()*(c.length-1),m={minWidth:g+i,
width:h+i,
minHeight:e+j,
height:k+j};
return m}},
destruct:function(){this.__jxKLh=this.__usc9t=this.__tKdjT=this.__yElrO=this.__ztuye=this.__DHg8i=this.__JCnsd=null}});


// qx.ui.core.Widget
//   - size: 29695 bytes
//   - modified: 2010-11-02T16:05:49
//   - names:
//       Array, 1x
//       Error, 14x
//       Infinity, 2x
//       qx, 83x
//       undefined, 2x
//   - packages:
//       qx.Bootstrap.getKeys, 1x
//       qx.Class.define, 1x
//       qx.Class.isSubClassOf, 1x
//       qx.bom.client.Engine.OPERA, 1x
//       qx.bom.client.Feature.CSS_POINTER_EVENTS, 1x
//       qx.bom.element.Decoration.isAlphaImageLoaderEnabled, 1x
//       qx.bom.element.Location.get, 2x
//       qx.core.ObjectRegistry.fromHashCode, 1x
//       qx.core.ObjectRegistry.inShutDown, 2x
//       qx.core.property.Group, 1x
//       qx.core.property.Multi.getInheritableProperties, 1x
//       qx.core.property.Multi.importData, 1x
//       qx.core.property.Multi.moveObject, 1x
//       qx.core.property.Util.getPropertyDefinition, 1x
//       qx.data.MBinding, 1x
//       qx.html.Element, 3x
//       qx.html.Image, 1x
//       qx.lang.Array.insertAfter, 1x
//       qx.lang.Array.insertBefore, 2x
//       qx.lang.Array.remove, 6x
//       qx.lang.Array.removeAt, 1x
//       qx.lang.Object.findWinnerKey, 1x
//       qx.locale.MTranslation, 1x
//       qx.theme.manager.Appearance.getInstance, 1x
//       qx.theme.manager.Color.getInstance, 1x
//       qx.theme.manager.Decoration.getInstance, 1x
//       qx.ui.core.DecoratorFactory, 2x
//       qx.ui.core.DragDropCursor.getInstance, 5x
//       qx.ui.core.LayoutItem, 2x
//       qx.ui.core.Widget, 7x
//       qx.ui.core.Widget.DEBUG, 1x
//       qx.ui.core.Widget.__decoratorPool, 2x
//       qx.ui.core.Widget.__decoratorPool.getDecoratorElement, 1x
//       qx.ui.core.Widget.__shadowPool, 1x
//       qx.ui.core.Widget.__styleCache, 2x
//       qx.ui.core.queue.Appearance.add, 6x
//       qx.ui.core.queue.Appearance.remove, 1x
//       qx.ui.core.queue.Dispose.add, 1x
//       qx.ui.core.queue.Layout.add, 7x
//       qx.ui.core.queue.Layout.remove, 1x
//       qx.ui.core.queue.Visibility.add, 2x
//       qx.ui.core.queue.Visibility.isVisible, 3x
//       qx.ui.core.queue.Visibility.remove, 1x
//       qx.ui.core.queue.Widget.remove, 1x
//       qx.ui.layout.Abstract, 1x
qx.Class.define("qx.ui.core.Widget",{extend:qx.ui.core.LayoutItem,
include:[qx.locale.MTranslation,qx.data.MBinding],
construct:function(){this.base(arguments);
this.__bqbnYK=this._createContainerElement();
this.__bamNwu=this.__b0a80W();
this.__bqbnYK.add(this.__bamNwu);
this.initFocusable();
this.initSelectable();
this.initNativeContextMenu()},
events:{appear:"qx.event.type.Event",
disappear:"qx.event.type.Event",
createChildControl:"qx.event.type.Data",
resize:"qx.event.type.Data",
move:"qx.event.type.Data",
mousemove:"qx.event.type.Mouse",
mouseover:"qx.event.type.Mouse",
mouseout:"qx.event.type.Mouse",
mousedown:"qx.event.type.Mouse",
mouseup:"qx.event.type.Mouse",
click:"qx.event.type.Mouse",
dblclick:"qx.event.type.Mouse",
contextmenu:"qx.event.type.Mouse",
beforeContextmenuOpen:"qx.event.type.Mouse",
mousewheel:"qx.event.type.MouseWheel",
touchstart:"qx.event.type.Touch",
touchend:"qx.event.type.Touch",
touchmove:"qx.event.type.Touch",
touchcancel:"qx.event.type.Touch",
tap:"qx.event.type.Touch",
swipe:"qx.event.type.Touch",
keyup:"qx.event.type.KeySequence",
keydown:"qx.event.type.KeySequence",
keypress:"qx.event.type.KeySequence",
keyinput:"qx.event.type.KeyInput",
focus:"qx.event.type.Focus",
blur:"qx.event.type.Focus",
focusin:"qx.event.type.Focus",
focusout:"qx.event.type.Focus",
activate:"qx.event.type.Focus",
deactivate:"qx.event.type.Focus",
capture:"qx.event.type.Event",
losecapture:"qx.event.type.Event",
drop:"qx.event.type.Drag",
dragleave:"qx.event.type.Drag",
dragover:"qx.event.type.Drag",
drag:"qx.event.type.Drag",
dragstart:"qx.event.type.Drag",
dragend:"qx.event.type.Drag",
dragchange:"qx.event.type.Drag",
droprequest:"qx.event.type.Drag"},
properties:{paddingTop:{check:"Integer",
init:0,
apply:"_applyPadding",
themeable:true},
paddingRight:{check:"Integer",
init:0,
apply:"_applyPadding",
themeable:true},
paddingBottom:{check:"Integer",
init:0,
apply:"_applyPadding",
themeable:true},
paddingLeft:{check:"Integer",
init:0,
apply:"_applyPadding",
themeable:true},
padding:{group:["paddingTop","paddingRight","paddingBottom","paddingLeft"],
shorthand:true,
themeable:true},
transition:{check:"qx.ui.core.ITransition",
nullable:true,
event:"changeTransition",
apply:"_applyTransition"},
transform:{check:"qx.ui.core.Transform",
nullable:true,
event:"changeTransform",
apply:"_applyTransform"},
zIndex:{nullable:true,
init:null,
apply:"_applyZIndex",
event:"changeZIndex",
check:"Integer",
themeable:true},
decorator:{nullable:true,
init:null,
apply:"_applyDecorator",
event:"changeDecorator",
check:"Decorator",
themeable:true},
shadow:{nullable:true,
init:null,
apply:"_applyShadow",
event:"changeShadow",
check:"Decorator",
themeable:true},
backgroundColor:{nullable:true,
check:"Color",
apply:"_applyBackgroundColor",
event:"changeBackgroundColor",
themeable:true},
textColor:{nullable:true,
check:"Color",
apply:"_applyTextColor",
event:"changeTextColor",
themeable:true,
inheritable:true},
font:{nullable:true,
apply:"_applyFont",
check:"Font",
event:"changeFont",
themeable:true,
inheritable:true},
opacity:{check:"Number",
apply:"_applyOpacity",
themeable:true,
nullable:true,
init:null},
cursor:{check:"String",
apply:"_applyCursor",
themeable:true,
inheritable:true,
nullable:true},
toolTip:{check:"qx.ui.tooltip.ToolTip",
nullable:true},
toolTipText:{check:"String",
nullable:true,
event:"changeToolTipText",
apply:"_applyToolTipText"},
toolTipIcon:{check:"String",
nullable:true,
event:"changeToolTipText"},
blockToolTip:{check:"Boolean",
init:false},
visibility:{check:["visible","hidden","excluded"],
init:"visible",
apply:"_applyVisibility",
event:"changeVisibility"},
transparentVisibility:{check:["visible","hidden","excluded"],
init:"visible",
apply:"_applyTransparentVisibility"},
enabled:{check:"Boolean",
inheritable:true,
apply:"_applyEnabled",
event:"changeEnabled",
init:true},
anonymous:{init:false,
check:"Boolean"},
tabIndex:{check:"Integer",
nullable:true,
apply:"_applyTabIndex"},
focusable:{check:"Boolean",
init:false,
apply:"_applyFocusable"},
keepFocus:{check:"Boolean",
init:false,
apply:"_applyKeepFocus"},
keepActive:{check:"Boolean",
init:false,
apply:"_applyKeepActive"},
draggable:{check:"Boolean",
init:false,
apply:"_applyDraggable"},
droppable:{check:"Boolean",
init:false,
apply:"_applyDroppable"},
selectable:{check:"Boolean",
init:false,
event:"changeSelectable",
apply:"_applySelectable"},
contextMenu:{check:"qx.ui.menu.Menu",
apply:"_applyContextMenu",
nullable:true,
event:"changeContextMenu"},
nativeContextMenu:{check:"Boolean",
init:false,
themeable:true,
event:"changeNativeContextMenu",
apply:"_applyNativeContextMenu"},
appearance:{check:"String",
init:"widget",
apply:"_applyAppearance",
event:"changeAppearance"}},
statics:{__JRMbw:{},
DEBUG:false,
getWidgetByElement:function(a,d){while(a){var c=a.$$widget,b;
if(c!=null){b=qx.core.ObjectRegistry.fromHashCode(c);
if(!d||!b.getAnonymous())return b}try{a=a.parentNode}catch(e){return null}}return null},
contains:function(b,a){while(a){if(b==a)return true;
a=a.getLayoutParent()}return false},
__2MiOC:new qx.ui.core.DecoratorFactory(),
__JEQTr:new qx.ui.core.DecoratorFactory()},
members:{__bqbnYK:null,
__bamNwu:null,
__bpNsIW:null,
__2svh5:null,
__brW6u7:null,
__cIPWyW:null,
__ccWxNu:null,
__3l3aK:null,
_getLayout:function(){return this.__3l3aK},
_setLayout:function(a){a&&this.assertInstance(a,qx.ui.layout.Abstract);
this.__3l3aK&&this.__3l3aK.connectToWidget(null);
a&&a.connectToWidget(this);
this.__3l3aK=a;
qx.ui.core.queue.Layout.add(this)},
setLayoutParent:function(a){if(this.$$parent===a)return;
var b=this.getContainerElement(),c=this.$$parent;
qx.core.property.Multi.moveObject(this,a,c);
this.$$parent&&!this.$$parent.$$disposed&&this.$$parent.getContentElement().remove(b);
this.$$parent=a||null;
a&&!a.$$disposed&&this.$$parent.getContentElement().add(b);
qx.ui.core.queue.Visibility.add(this)},
_updateInsets:null,
__bPi96K:function(d,c){if(d==c)return false;
if(d==null||c==null)return true;
var e=qx.theme.manager.Decoration.getInstance(),a=e.resolve(d).getInsets(),b=e.resolve(c).getInsets();
if(a.top!=b.top||a.right!=b.right||a.bottom!=b.bottom||a.left!=b.left)return true;
return false},
renderLayout:function(k,m,d,e){var a=this.base(arguments,k,m,d,e),o,n,j,c,i,b,g,f,h,l,q,p;
if(!a)return;
o=this.getContainerElement(),n=this.getContentElement(),j=a.size||this._updateInsets,c="px",i={};
a.position&&(i.left=k+c,i.top=m+c);
a.size&&(i.width=d+c,i.height=e+c);
(a.position||a.size)&&o.setStyles(i);
if(j||a.local||a.margin){b=this.getInsets(),g=d-b.left-b.right,f=e-b.top-b.bottom;
g=g<0?0:g;
f=f<0?0:f}h={};
this._updateInsets&&(h.left=b.left+c,h.top=b.top+c);
j&&(h.width=g+c,h.height=f+c);
(j||this._updateInsets)&&n.setStyles(h);
if(a.size){l=this.__brW6u7;
l&&l.setStyles({width:d+"px",
height:e+"px"})}(a.size||this._updateInsets)&&this.__bpNsIW&&this.__bpNsIW.resize(d,e);
if(a.size)if(this.__2svh5){b=this.__2svh5.getInsets(),q=d+b.left+b.right,p=e+b.top+b.bottom;
this.__2svh5.resize(q,p)}if(j||a.local||a.margin){if(this.__3l3aK&&this.hasLayoutChildren())this.__3l3aK.renderLayout(g,f);
else if(this.hasLayoutChildren())throw new Error("At least one child in control "+this._findTopControl()+" requires a layout, but no one was defined!")}a.position&&this.hasListener("move")&&this.fireDataEvent("move",this.getBounds());
a.size&&this.hasListener("resize")&&this.fireDataEvent("resize",this.getBounds());
delete this._updateInsets;
return a},
__KgwBr:null,
clearSeparators:function(){var a=this.__KgwBr,d,f,b,c,e;
if(!a)return;
d=qx.ui.core.Widget.__2MiOC,f=this.getContentElement(),c=0,e=a.length;
for(;
c<e;
c++)b=a[c],d.poolDecorator(b),f.remove(b);
a.length=0},
renderSeparator:function(c,b){var a=qx.ui.core.Widget.__2MiOC.getDecoratorElement(c);
this.getContentElement().add(a);
a.resize(b.width,b.height);
a.setStyles({left:b.left+"px",
top:b.top+"px"});
this.__KgwBr?this.__KgwBr.push(a):this.__KgwBr=[a]},
_computeSizeHint:function(){var i=this.getWidth(),e=this.getMinWidth(),d=this.getMaxWidth(),j=this.getHeight(),c=this.getMinHeight(),b=this.getMaxHeight(),a,f,g,h;
e!==null&&d!==null&&this.assert(e<=d,"minWidth is larger than maxWidth!"),c!==null&&b!==null&&this.assert(c<=b,"minHeight is larger than maxHeight!");
a=this._getContentHint(),f=this.getInsets(),g=f.left+f.right,h=f.top+f.bottom;
i==null&&(i=a.width+g);
j==null&&(j=a.height+h);
e==null&&(e=g,a.minWidth!=null&&(e+=a.minWidth));
c==null&&(c=h,a.minHeight!=null&&(c+=a.minHeight));
d==null&&(d=a.maxWidth==null?Infinity:a.maxWidth+g);
b==null&&(b=a.maxHeight==null?Infinity:a.maxHeight+h);
return{width:i,
minWidth:e,
maxWidth:d,
height:j,
minHeight:c,
maxHeight:b}},
invalidateLayoutCache:function(){this.base(arguments);
this.__3l3aK&&this.__3l3aK.invalidateLayoutCache()},
_getContentHint:function(){var b=this.__3l3aK,a,c;
if(b){if(this.hasLayoutChildren()){a=b.getSizeHint();
{c="The layout "+b.toString()+" of the widget "+this.toString()+" returned an invalid size hint!";
this.assertInteger(a.width,"Wrong 'width' value. "+c);
this.assertInteger(a.height,"Wrong 'height' value. "+c)}return a}return{width:0,
height:0}}return{width:100,
height:50}},
_getHeightForWidth:function(d){var a=this.getInsets(),h=a.left+a.right,e=a.top+a.bottom,f=d-h,b=this._getLayout(),c,g;
if(b&&b.hasHeightForWidth())c=b.getHeightForWidth(d);
else c=this._getContentHeightForWidth(f);
g=c+e;
return g},
_getContentHeightForWidth:function(a){throw new Error("Abstract method call: _getContentHeightForWidth()!")},
getInsets:function(){var c=this.getPaddingTop(),d=this.getPaddingRight(),e=this.getPaddingBottom(),b=this.getPaddingLeft(),a;
if(this.__bpNsIW){a=this.__bpNsIW.getInsets();
this.assertNumber(a.top,"Invalid top decorator inset detected: "+a.top),this.assertNumber(a.right,"Invalid right decorator inset detected: "+a.right),this.assertNumber(a.bottom,"Invalid bottom decorator inset detected: "+a.bottom),this.assertNumber(a.left,"Invalid left decorator inset detected: "+a.left);
c+=a.top;
d+=a.right;
e+=a.bottom;
b+=a.left}return{top:c,
right:d,
bottom:e,
left:b}},
getInnerSize:function(){var b=this.getBounds(),a;
if(!b)return null;
a=this.getInsets();
return{width:b.width-a.left-a.right,
height:b.height-a.top-a.bottom}},
show:function(){this.setVisibility("visible")},
hide:function(){this.setVisibility("hidden")},
exclude:function(){this.setVisibility("excluded")},
isVisible:function(){return this.getVisibility()==="visible"},
isHidden:function(){return this.getVisibility()!=="visible"},
isExcluded:function(){return this.getVisibility()==="excluded"},
isSeeable:function(){var b=this.getContainerElement().getDomElement(),a;
if(b)return b.offsetWidth>0;
a=this;
do{if(!a.isVisible())return false;
if(a.isRootWidget())return true;
a=a.getLayoutParent()}while(a);
return false},
_createContainerElement:function(){var a={$$widget:this.toHashCode()},b;
a.qxType="container",a.qxClass=this.classname;
b={zIndex:0,
position:"absolute"};
return new qx.html.Element("div",b,a)},
__b0a80W:function(){var a=this._createContentElement();
a.setAttribute("qxType","content");
a.setStyles({position:"absolute",
zIndex:10});
return a},
_createContentElement:function(){return new qx.html.Element("div",{overflowX:"hidden",
overflowY:"hidden"})},
getContainerElement:function(){return this.__bqbnYK},
getContentElement:function(){return this.__bamNwu},
getDecoratorElement:function(){return this.__bpNsIW||null},
getShadowElement:function(){return this.__2svh5||null},
__9FlM0:null,
getLayoutChildren:function(){var a=this.__9FlM0,b,d,e,c;
if(!a)return this.__2YW31;
d=0,e=a.length;
for(;
d<e;
d++){c=a[d];
(c.hasUserBounds()||c.isExcluded())&&(b==null&&(b=a.concat()),qx.lang.Array.remove(b,c))}return b||a},
scheduleLayoutUpdate:function(){qx.ui.core.queue.Layout.add(this)},
invalidateLayoutChildren:function(){var a=this.__3l3aK;
a&&a.invalidateChildrenCache();
qx.ui.core.queue.Layout.add(this)},
hasLayoutChildren:function(){var a=this.__9FlM0,b,c,d;
if(!a)return false;
c=0,d=a.length;
for(;
c<d;
c++){b=a[c];
if(!b.hasUserBounds()&&!b.isExcluded())return true}return false},
getChildrenContainer:function(){return this},
__2YW31:[],
_getChildren:function(){return this.__9FlM0||this.__2YW31},
_indexOf:function(b){var a=this.__9FlM0;
if(!a)return-1;
return a.indexOf(b)},
_hasChildren:function(){var a=this.__9FlM0;
return a!=null&&!!a[0]},
addChildrenToQueue:function(d){var b=this.__9FlM0,a,c,e;
if(!b)return;
c=0,e=b.length;
for(;
c<e;
c++)a=b[c],d[a.$$hash]=a,a.addChildrenToQueue(d)},
_add:function(a,b){a.getLayoutParent()==this&&qx.lang.Array.remove(this.__9FlM0,a);
this.__9FlM0?this.__9FlM0.push(a):this.__9FlM0=[a];
this.__Cx3si(a,b)},
_addAt:function(a,d,c){this.__9FlM0||(this.__9FlM0=[]);
a.getLayoutParent()==this&&qx.lang.Array.remove(this.__9FlM0,a);
var b=this.__9FlM0[d];
if(b===a)return a.setLayoutProperties(c);
b?qx.lang.Array.insertBefore(this.__9FlM0,a,b):this.__9FlM0.push(a);
this.__Cx3si(a,c)},
_addBefore:function(a,b,c){this.assertInArray(b,this._getChildren(),"The 'before' widget is not a child of this widget!");
if(a==b)return;
this.__9FlM0||(this.__9FlM0=[]);
a.getLayoutParent()==this&&qx.lang.Array.remove(this.__9FlM0,a);
qx.lang.Array.insertBefore(this.__9FlM0,a,b);
this.__Cx3si(a,c)},
_addAfter:function(a,b,c){this.assertInArray(b,this._getChildren(),"The 'after' widget is not a child of this widget!");
if(a==b)return;
this.__9FlM0||(this.__9FlM0=[]);
a.getLayoutParent()==this&&qx.lang.Array.remove(this.__9FlM0,a);
qx.lang.Array.insertAfter(this.__9FlM0,a,b);
this.__Cx3si(a,c)},
_remove:function(a){if(!this.__9FlM0)throw new Error("This widget has no children!");
qx.lang.Array.remove(this.__9FlM0,a);
this.__V9cFB(a)},
_removeAt:function(b){if(!this.__9FlM0)throw new Error("This widget has no children!");
var a=this.__9FlM0[b];
qx.lang.Array.removeAt(this.__9FlM0,b);
this.__V9cFB(a);
return a},
_removeAll:function(){if(!this.__9FlM0)return;
var b=this.__9FlM0.concat(),a;
this.__9FlM0.length=0;
for(a=b.length-1;
a>=0;
a--)this.__V9cFB(b[a]);
qx.ui.core.queue.Layout.add(this)},
_afterAddChild:null,
_afterRemoveChild:null,
__Cx3si:function(a,b){this.assertInstance(a,qx.ui.core.LayoutItem,"Invalid widget to add: "+a),this.assertNotIdentical(a,this,"Could not add widget to itself: "+a),b!=null&&this.assertType(b,"object","Invalid layout data: "+b);
var c=a.getLayoutParent();
c&&c!=this&&c._remove(a);
a.setLayoutParent(this);
b?a.setLayoutProperties(b):this.updateLayoutProperties();
this._afterAddChild&&this._afterAddChild(a)},
__V9cFB:function(a){this.assertNotUndefined(a);
if(a.getLayoutParent()!==this)throw new Error("Remove Error: "+a+" is not a child of this widget!");
a.setLayoutParent(null);
this.__3l3aK&&this.__3l3aK.invalidateChildrenCache();
qx.ui.core.queue.Layout.add(this);
this._afterRemoveChild&&this._afterRemoveChild(a)},
capture:function(a){this.getContainerElement().capture(a)},
releaseCapture:function(){this.getContainerElement().releaseCapture()},
_applyPadding:function(a,c,b){this._updateInsets=true;
qx.ui.core.queue.Layout.add(this)},
_createProtectorElement:function(){if(this.__brW6u7)return;
var b=this.__brW6u7=new qx.html.Element,a;
b.setAttribute("qxType","protector");
b.setStyles({position:"absolute",
top:0,
left:0,
zIndex:7});
a=this.getBounds();
a&&this.__brW6u7.setStyles({width:a.width+"px",
height:a.height+"px"});
this.getContainerElement().add(b)},
_applyDecorator:function(a,f){a&&typeof a==="object"&&qx.ui.core.Widget.DEBUG&&this.warn("Decorator instances may increase memory usage and processing time. Often it is better to lay them out to a theme file. Hash code of decorator object: "+a);
var e=qx.ui.core.Widget.__2MiOC,d=this.getContainerElement(),c,b;
!this.__brW6u7&&!qx.bom.client.Feature.CSS_POINTER_EVENTS&&this._createProtectorElement();
f&&(d.remove(this.__bpNsIW),e.poolDecorator(this.__bpNsIW));
if(a){c=this.__bpNsIW=e.getDecoratorElement(a);
c.setStyle("zIndex",5);
d.add(c)}else delete this.__bpNsIW;
this._applyBackgroundColor(this.getBackgroundColor());
this._applyOpacity(this.getOpacity());
if(this.__bPi96K(f,a))this._updateInsets=true,qx.ui.core.queue.Layout.add(this);
else if(a){b=this.getBounds();
b&&(c.resize(b.width,b.height),this.__brW6u7&&this.__brW6u7.setStyles({width:b.width+"px",
height:b.height+"px"}))}},
_applyShadow:function(f,h){var d=qx.ui.core.Widget.__JEQTr,e=this.getContainerElement(),b,a,c,g,i;
h&&(e.remove(this.__2svh5),d.poolDecorator(this.__2svh5));
if(f){b=this.__2svh5=d.getDecoratorElement(f);
e.add(b);
a=b.getInsets();
b.setStyles({left:-a.left+"px",
top:-a.top+"px"});
c=this.getBounds();
if(c){g=c.width+a.left+a.right,i=c.height+a.top+a.bottom;
b.resize(g,i)}b.tint(null)}else delete this.__2svh5},
_applyTransition:function(a,b){this.__dczHyW();
a&&(a=a.getStyle());
this.getContainerElement().setStyle("transition",a)},
_applyTransparentVisibility:function(a,b){this.__dczHyW()},
__dczHyW:function(){if(this.getTransparentVisibility()!="visible"){var a=this.getTransition();
if(a){this.addListener("transitionEnd",this.__2sMYu);
this.addListener("appear",this.__dRP8F1);
this.__cWPvUl=true;
return}}this.__cWPvUl&&(this.removeListener("transitionEnd",this.__2sMYu),this.removeListener("appear",this.__dRP8F1),this.__cWPvUl=false)},
__2sMYu:function(a){if(a.getProperty()!="opacity")return;
this.getOpacity()==0&&this.setVisibility(this.getTransparentVisibility())},
__dRP8F1:function(a){this.getOpacity()!=0&&this.getTransparentVisibility()!="visible"&&this._applyOpacity(this.getOpacity())},
_applyOpacity:function(a,b){if(b==0&&this.getTransparentVisibility()!="visible"&&!this.isVisible()){this.setVisibility("visible");
return}this.getContainerElement().setStyle("opacity",a==1?null:a);
if(false&&qx.bom.element.Decoration.isAlphaImageLoaderEnabled())if(!qx.Class.isSubClassOf(this.getContentElement().constructor,qx.html.Image)){var c=a==1||a==null?null:.99;
this.getContentElement().setStyle("opacity",c)}},
_applyTransform:function(a,b){this.getContainerElement().setStyle("transform",a==null?null:a.getStyle())},
_applyVisibility:function(a,c){var d=this.getContainerElement(),b;
a==="visible"?d.show():d.hide();
b=this.$$parent;
b&&(c==null||a==null||c==="excluded"||a==="excluded")&&b.invalidateLayoutChildren();
qx.ui.core.queue.Visibility.add(this)},
_applyToolTipText:function(a,b){},
_applyTextColor:function(a,b){},
_applyZIndex:function(a,b){this.getContainerElement().setStyle("zIndex",a==null?0:a)},
_applyCursor:function(a,b){a==null&&!this.isSelectable()&&(a="default");
this.getContainerElement().setStyle("cursor",a,qx.bom.client.Engine.OPERA)},
_applyBackgroundColor:function(d,e){var b=this.getBackgroundColor(),a=this.getContainerElement(),c;
if(this.__bpNsIW)this.__bpNsIW.tint(b),a.setStyle("backgroundColor",null);
else{c=qx.theme.manager.Color.getInstance().resolve(b);
a.setStyle("backgroundColor",c)}},
_applyFont:function(a,b){},
__qOZ43:null,
$$stateChanges:null,
_forwardStates:null,
hasState:function(b){var a=this.__qOZ43;
return!!a&&!!a[b]},
addState:function(b){var d=this.__qOZ43,e,a,f,c;
d||(d=this.__qOZ43={});
if(d[b])return;
this.__qOZ43[b]=true;
qx.ui.core.queue.Visibility.isVisible(this)?qx.ui.core.queue.Appearance.add(this):this.$$stateChanges=true;
e=this._forwardStates,a=this.__1S1Y3;
if(e&&e[b]&&a){for(c in a)f=a[c],f instanceof qx.ui.core.Widget&&a[c].addState(b)}},
removeState:function(a){var f=this.__qOZ43,d,b,c,e;
if(!f||!f[a])return;
delete this.__qOZ43[a];
qx.ui.core.queue.Visibility.isVisible(this)?qx.ui.core.queue.Appearance.add(this):this.$$stateChanges=true;
d=this._forwardStates,b=this.__1S1Y3;
if(d&&d[a]&&b)for(c in b){e=b[c];
e instanceof qx.ui.core.Widget&&e.removeState(a)}},
replaceState:function(d,b){var a=this.__qOZ43,f,c,e,g;
a||(a=this.__qOZ43={});
a[b]||(a[b]=true);
a[d]&&delete a[d];
qx.ui.core.queue.Visibility.isVisible(this)?qx.ui.core.queue.Appearance.add(this):this.$$stateChanges=true;
f=this._forwardStates,c=this.__1S1Y3;
if(f&&f[b]&&c)for(e in c){g=c[e];
g instanceof qx.ui.core.Widget&&g.replaceState(d,b)}},
__bG4wgK:null,
__baex3v:null,
__bCfB6b:null,
syncAppearance:function(){var u=qx.theme.manager.Appearance.getInstance(),n=this.__qOZ43,e=this.__bCfB6b,g,p,m,l,o,k,j,a,h,v,b,f,c,d,s,i,t,q,r;
if(!e){if(this.$$subparent){g=this,p=[];
do{p.push(g.$$subcontrol||g.getAppearance());
}while(g=g.$$subparent);
e=p.reverse().join("/").replace(/#[0-9]+/g,"")}else e=this.getAppearance()}m="";
if(n){l=qx.Bootstrap.getKeys(n),o=l.length;
o==1?m="."+l[0]:o>1&&(m="."+l.sort().join("."))}k=qx.ui.core.Widget.__JRMbw,j=e+m,a=k[j];
if(!a){a=k[j]=u.styleFrom(e,n,null,this.getAppearance());
v=qx.core.property.Group;
for(b in a){f=qx.core.property.Util.getPropertyDefinition(this.constructor,b);
if(!f)throw new Error(this+": Unknown property during syncAppearance(): "+b);
if(f.group){if(f.shorthand){c=a[b];
a[b]=c instanceof Array?c.length==4?c:v.expandShortHand(c):[c,c,c,c]}h=f.group;
for(d=0,s=h.length;
d<s;
d++){i=h[d],t=a[i];
(t===undefined||qx.lang.Object.findWinnerKey(a,b,i)===i)&&(a[h[d]]=a[b][d])}delete a[b]}}}q=this.__bG4wgK;
if(q)r=k[q];
this.__bG4wgK=j;
qx.core.property.Multi.importData(this,a,r,"theme")},
getThemedValue:function(b){var a=this.__bG4wgK;
return a?qx.ui.core.Widget.__JRMbw[a][b]:undefined},
getInheritedValue:function(a){var c=this.constructor,d=c.$$inheritables||qx.core.property.Multi.getInheritableProperties(c),b;
if(d[a]){b=this.$$parent;
return b&&b.get(a)}},
_applyAppearance:function(a,b){this.debug("Appearance changed: "+b+" => "+a);
this.updateAppearance()},
checkAppearanceNeeds:function(){this.__cIPWyW?this.$$stateChanges&&(qx.ui.core.queue.Appearance.add(this),delete this.$$stateChanges):(qx.ui.core.queue.Appearance.add(this),this.__cIPWyW=true)},
updateAppearance:function(){this.__baex3v=true;
qx.ui.core.queue.Appearance.add(this);
var a=this.__1S1Y3,b,c;
if(a){for(c in a)b=a[c],b instanceof qx.ui.core.Widget&&b.updateAppearance()}},
syncWidget:function(){},
getEventTarget:function(){var a=this;
while(a.getAnonymous()){a=a.getLayoutParent();
if(!a)return null}return a},
getFocusTarget:function(){var a=this;
if(!a.getEnabled())return null;
while(a.getAnonymous()||!a.getFocusable()){a=a.getLayoutParent();
if(!a||!a.getEnabled())return null}return a},
getFocusElement:function(){return this.getContainerElement()},
isTabable:function(){return!!this.getContainerElement().getDomElement()&&this.isFocusable()},
_applyFocusable:function(c,d){var a=this.getFocusElement(),b;
if(c){b=this.getTabIndex();
b==null&&(b=1);
a.setAttribute("tabIndex",b);
a.setStyle("outline","none")}else a.isNativelyFocusable()?a.setAttribute("tabIndex",-1):d&&a.setAttribute("tabIndex",null)},
_applyKeepFocus:function(a){var b=this.getFocusElement();
b.setAttribute("qxKeepFocus",a?"on":null)},
_applyKeepActive:function(a){var b=this.getContainerElement();
b.setAttribute("qxKeepActive",a?"on":null)},
_applyTabIndex:function(a){if(a==null)a=1;
else if(a<1||a>32000)throw new Error("TabIndex property must be between 1 and 32000");
this.getFocusable()&&a!=null&&this.getFocusElement().setAttribute("tabIndex",a)},
_applySelectable:function(a,b){b!==null&&this._applyCursor(this.getCursor());
this.getContainerElement().setSelectable(a);
this.getContentElement().setSelectable(a)},
_applyEnabled:function(a,b){a===false?(this.addState("disabled"),this.removeState("hovered"),this.isFocusable()&&(this.removeState("focused"),this._applyFocusable(false,true)),this.isDraggable()&&this._applyDraggable(false,true),this.isDroppable()&&this._applyDroppable(false,true)):(this.removeState("disabled"),this.isFocusable()&&this._applyFocusable(true,false),this.isDraggable()&&this._applyDraggable(true,false),this.isDroppable()&&this._applyDroppable(true,false))},
_applyNativeContextMenu:function(a,c,b){},
_applyContextMenu:function(b,a){a&&(a.removeState("contextmenu"),a.getOpener()==this&&a.resetOpener(),b||(this.removeListener("contextmenu",this._onContextMenuOpen),a.removeListener("changeVisibility",this._onBeforeContextMenuOpen,this)));
b&&(b.setOpener(this),b.addState("contextmenu"),a||(this.addListener("contextmenu",this._onContextMenuOpen),b.addListener("changeVisibility",this._onBeforeContextMenuOpen,this)))},
_onContextMenuOpen:function(a){this.getContextMenu().openAtMouse(a);
a.stop()},
_onBeforeContextMenuOpen:function(a){a.getData()=="visible"&&this.hasListener("beforeContextmenuOpen")&&this.fireDataEvent("beforeContextmenuOpen",a)},
_onStopEvent:function(a){a.stopPropagation()},
_applyDraggable:function(a,b){!this.isEnabled()&&a===true&&(a=false);
qx.ui.core.DragDropCursor.getInstance();
a?(this.addListener("dragstart",this._onDragStart),this.addListener("drag",this._onDrag),this.addListener("dragend",this._onDragEnd),this.addListener("dragchange",this._onDragChange)):(this.removeListener("dragstart",this._onDragStart),this.removeListener("drag",this._onDrag),this.removeListener("dragend",this._onDragEnd),this.removeListener("dragchange",this._onDragChange));
this.getContainerElement().setAttribute("qxDraggable",a?"on":null)},
_applyDroppable:function(a,b){!this.isEnabled()&&a===true&&(a=false);
this.getContainerElement().setAttribute("qxDroppable",a?"on":null)},
_onDragStart:function(a){qx.ui.core.DragDropCursor.getInstance().placeToMouse(a);
this.getApplicationRoot().setGlobalCursor("default")},
_onDrag:function(a){qx.ui.core.DragDropCursor.getInstance().placeToMouse(a)},
_onDragEnd:function(a){qx.ui.core.DragDropCursor.getInstance().moveTo(-1000,-1000);
this.getApplicationRoot().resetGlobalCursor()},
_onDragChange:function(c){var b=qx.ui.core.DragDropCursor.getInstance(),a=c.getCurrentAction();
a?b.setAction(a):b.resetAction()},
visualizeFocus:function(){this.addState("focused")},
visualizeBlur:function(){this.removeState("focused")},
scrollChildIntoView:function(a,c,d,b){this.scrollChildIntoViewX(a,c,b);
this.scrollChildIntoViewY(a,d,b)},
scrollChildIntoViewX:function(a,c,b){this.getContentElement().scrollChildIntoViewX(a.getContainerElement(),c,b)},
scrollChildIntoViewY:function(a,c,b){this.getContentElement().scrollChildIntoViewY(a.getContainerElement(),c,b)},
focus:function(){if(this.isFocusable())this.getFocusElement().focus();
else throw new Error("Widget is not focusable!")},
blur:function(){if(this.isFocusable())this.getFocusElement().blur();
else throw new Error("Widget is not focusable!")},
activate:function(){this.getContainerElement().activate()},
deactivate:function(){this.getContainerElement().deactivate()},
tabFocus:function(){this.getFocusElement().focus()},
hasChildControl:function(a){if(!this.__1S1Y3)return false;
return!!this.__1S1Y3[a]},
__1S1Y3:null,
_getCreatedChildControls:function(){return this.__1S1Y3},
getChildControl:function(a,b){if(!this.__1S1Y3){if(b)return null;
this.__1S1Y3={}}var c=this.__1S1Y3[a];
if(c)return c;
if(b===true)return null;
return this._createChildControl(a)},
_showChildControl:function(b){var a=this.getChildControl(b);
a.show();
return a},
_excludeChildControl:function(b){var a=this.getChildControl(b,true);
a&&a.exclude()},
_isChildControlVisible:function(b){var a=this.getChildControl(b,true);
if(a)return a.isVisible();
return false},
_createChildControl:function(a){if(!this.__1S1Y3)this.__1S1Y3={};
else if(this.__1S1Y3[a])throw new Error("Child control '"+a+"' already created!");
var d=a.indexOf("#"),b,f,e,c;
if(d==-1)b=this._createChildControlImpl(a);
else b=this._createChildControlImpl(a.substring(0,d));
if(!b)throw new Error("Unsupported control: "+a);
b.$$subcontrol=a;
b.$$subparent=this;
f=this.__qOZ43,e=this._forwardStates;
if(f&&e&&b instanceof qx.ui.core.Widget)for(c in f)e[c]&&b.addState(c);
this.fireDataEvent("createChildControl",b);
return this.__1S1Y3[a]=b},
_createChildControlImpl:function(a){return null},
_disposeChildControls:function(){var a=this.__1S1Y3,d,c,b;
if(!a)return;
d=qx.ui.core.Widget;
for(c in a){b=a[c];
d.contains(this,b)?b.dispose():b.destroy()}delete this.__1S1Y3},
_findTopControl:function(){var a=this;
while(a){if(!a.$$subparent)return a;
a=a.$$subparent}return null},
getContainerLocation:function(b){var a=this.getContainerElement().getDomElement();
return a?qx.bom.element.Location.get(a,b):null},
getContentLocation:function(b){var a=this.getContentElement().getDomElement();
return a?qx.bom.element.Location.get(a,b):null},
setDomLeft:function(b){var a=this.getContainerElement().getDomElement();
if(a)a.style.left=b+"px";
else throw new Error("DOM element is not yet created!")},
setDomTop:function(b){var a=this.getContainerElement().getDomElement();
if(a)a.style.top=b+"px";
else throw new Error("DOM element is not yet created!")},
setDomPosition:function(b,c){var a=this.getContainerElement().getDomElement();
if(a)a.style.left=b+"px",a.style.top=c+"px";
else throw new Error("DOM element is not yet created!")},
destroy:function(){if(this.$$disposed)return;
var a=this.$$parent;
a&&a._remove(this);
qx.ui.core.queue.Dispose.add(this)}},
destruct:function(){qx.core.ObjectRegistry.inShutDown||(this.getContainerElement().setAttribute("$$widget",null,true),this._disposeChildControls(),qx.ui.core.queue.Appearance.remove(this),qx.ui.core.queue.Layout.remove(this),qx.ui.core.queue.Visibility.remove(this),qx.ui.core.queue.Widget.remove(this));
if(!qx.core.ObjectRegistry.inShutDown){var a=qx.ui.core.Widget,b=this.getContainerElement();
this.__bpNsIW&&(b.remove(this.__bpNsIW),a.__2MiOC.poolDecorator(this.__bpNsIW));
this.__2svh5&&(b.remove(this.__2svh5),a.__JEQTr.poolDecorator(this.__2svh5));
this.clearSeparators();
this.__bpNsIW=this.__2svh5=this.__KgwBr=null}else this._disposeArray("__separators"),this._disposeObjects("__decoratorElement","__shadowElement");
this._disposeArray("__widgetChildren");
this.__qOZ43=this.__1S1Y3=null;
this._disposeObjects("__layoutManager","__containerElement","__contentElement","__protectorElement")}});


// qx.util.placement.AbstractAxis
//   - size: 418 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
qx.Class.define("qx.util.placement.AbstractAxis",{extend:qx.core.Object,
members:{computeStart:function(c,b,a,e,d){throw new Error("abstract method call!")},
_moveToEdgeAndAlign:function(c,b,a,d){switch(d){case"edge-start":return b.start-a.end-c;
case"edge-end":return b.end+a.start;
case"align-start":return b.start+a.start;
case"align-end":return b.end-a.end-c}},
_isInRange:function(a,b,c){return a>=0&&a+b<=c}}});


// qx.util.placement.BestFitAxis
//   - size: 275 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Math, 2x
//       qx, 2x
//   - packages:
//       Math.max, 1x
//       Math.min, 1x
//       qx.Class.define, 1x
//       qx.util.placement.AbstractAxis, 1x
qx.Class.define("qx.util.placement.BestFitAxis",{extend:qx.util.placement.AbstractAxis,
members:{computeStart:function(b,f,e,c,d){var a=this._moveToEdgeAndAlign(b,f,e,d);
if(this._isInRange(a,b,c))return a;
a<0&&(a=Math.min(0,c-b));
a+b>c&&(a=Math.max(0,c-b));
return a}}});


// qx.util.placement.KeepAlignAxis
//   - size: 342 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.util.placement.AbstractAxis, 1x
qx.Class.define("qx.util.placement.KeepAlignAxis",{extend:qx.util.placement.AbstractAxis,
members:{computeStart:function(f,c,b,h,g){var a=this._moveToEdgeAndAlign(f,c,b,g),e,d;
if(this._isInRange(a,f,h))return a;
g=="edge-start"||g=="edge-end"?(e=c.start-b.end,d=c.end+b.start):(e=c.end-b.end,d=c.start+b.start);
a=e>h-d?e-f:d;
return a}}});


// qx.util.placement.DirectAxis
//   - size: 175 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.util.placement.AbstractAxis, 1x
qx.Class.define("qx.util.placement.DirectAxis",{extend:qx.util.placement.AbstractAxis,
members:{computeStart:function(c,b,a,e,d){return this._moveToEdgeAndAlign(c,b,a,d)}}});


// qx.event.Idle
//   - size: 593 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.Timer, 1x
qx.Class.define("qx.event.Idle",{extend:qx.core.Object,
type:"singleton",
construct:function(){this.base(arguments);
var a=new qx.event.Timer(this.getTimeoutInterval());
a.addListener("interval",this._onInterval,this);
a.start();
this.__mXur6=a},
events:{interval:"qx.event.type.Event"},
properties:{timeoutInterval:{check:"Number",
init:100,
apply:"_applyTimeoutInterval"}},
members:{__mXur6:null,
_applyTimeoutInterval:function(a){this.__mXur6.setInterval(a)},
_onInterval:function(){this.fireEvent("interval")}},
destruct:function(){this.__mXur6&&this.__mXur6.stop();
this.__mXur6=null}});


// qx.util.placement.Placement
//   - size: 2509 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.util.placement.BestFitAxis, 1x
//       qx.util.placement.DirectAxis, 2x
//       qx.util.placement.KeepAlignAxis, 1x
//       qx.util.placement.Placement, 1x
qx.Class.define("qx.util.placement.Placement",{extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__OTBFZ=new qx.util.placement.DirectAxis()},
properties:{axisX:{check:"qx.util.placement.AbstractAxis"},
axisY:{check:"qx.util.placement.AbstractAxis"},
edge:{check:["top","right","bottom","left"],
init:"top"},
align:{check:["top","right","bottom","left"],
init:"right"}},
statics:{__zuRNg:null,
compute:function(j,g,h,d,f,c,b){this.__zuRNg=this.__zuRNg||new qx.util.placement.Placement();
var a=f.split("-"),i=a[0],e=a[1];
this.__zuRNg.set({axisX:this.__t0Zjk(c),
axisY:this.__t0Zjk(b),
edge:i,
align:e});
return this.__zuRNg.compute(j,g,h,d)},
__qgCXC:null,
__DbEu3:null,
__t462K:null,
__t0Zjk:function(a){switch(a){case"direct":this.__qgCXC=this.__qgCXC||new qx.util.placement.DirectAxis();
return this.__qgCXC;
case"keep-align":this.__DbEu3=this.__DbEu3||new qx.util.placement.KeepAlignAxis();
return this.__DbEu3;
case"best-fit":this.__t462K=this.__t462K||new qx.util.placement.BestFitAxis();
return this.__t462K;
default:throw new Error("Invalid 'mode' argument!'")}}},
members:{__OTBFZ:null,
compute:function(c,d,b,a){this.assertObject(c,"size"),this.assertNumber(c.width,"size.width"),this.assertNumber(c.height,"size.height"),this.assertObject(d,"area"),this.assertNumber(d.width,"area.width"),this.assertNumber(d.height,"area.height"),this.assertObject(b,"target"),this.assertNumber(b.top,"target.top"),this.assertNumber(b.right,"target.right"),this.assertNumber(b.bottom,"target.bottom"),this.assertNumber(b.left,"target.left"),this.assertObject(a,"offsets"),this.assertNumber(a.top,"offsets.top"),this.assertNumber(a.right,"offsets.right"),this.assertNumber(a.bottom,"offsets.bottom"),this.assertNumber(a.left,"offsets.left");
var g=this.getAxisX()||this.__OTBFZ,e=g.computeStart(c.width,{start:b.left,
end:b.right},{start:a.left,
end:a.right},d.width,this.__VVJg0()),f=this.getAxisY()||this.__OTBFZ,h=f.computeStart(c.height,{start:b.top,
end:b.bottom},{start:a.top,
end:a.bottom},d.height,this.__VV0j3());
return{left:e,
top:h}},
__VVJg0:function(){var a=this.getEdge(),b=this.getAlign();
if(a=="left")return"edge-start";
if(a=="right")return"edge-end";
if(b=="left")return"align-start";
if(b=="right")return"align-end"},
__VV0j3:function(){var a=this.getEdge(),b=this.getAlign();
if(a=="top")return"edge-start";
if(a=="bottom")return"edge-end";
if(b=="top")return"align-start";
if(b=="bottom")return"align-end"}},
destruct:function(){this._disposeObjects("__defaultAxis")}});


// qx.ui.core.MPlacement
//   - size: 3668 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Math, 1x
//       qx, 10x
//   - packages:
//       Math.max, 1x
//       qx.Mixin.define, 1x
//       qx.bom.element.Location.get, 1x
//       qx.event.Idle.getInstance, 4x
//       qx.lang.Function.bind, 2x
//       qx.ui.core.MPlacement.getVisibleElement, 1x
//       qx.util.placement.Placement.compute, 1x
qx.Mixin.define("qx.ui.core.MPlacement",{statics:{__uWJAv:null,
setVisibleElement:function(a){this.__uWJAv=a},
getVisibleElement:function(){return this.__uWJAv}},
properties:{position:{check:["top-left","top-right","bottom-left","bottom-right","left-top","left-bottom","right-top","right-bottom"],
init:"bottom-left",
themeable:true},
placeMethod:{check:["widget","mouse"],
init:"mouse",
themeable:true},
domMove:{check:"Boolean",
init:false},
placementModeX:{check:["direct","keep-align","best-fit"],
init:"keep-align",
themeable:true},
placementModeY:{check:["direct","keep-align","best-fit"],
init:"keep-align",
themeable:true},
offsetLeft:{check:"Integer",
init:0,
themeable:true},
offsetTop:{check:"Integer",
init:0,
themeable:true},
offsetRight:{check:"Integer",
init:0,
themeable:true},
offsetBottom:{check:"Integer",
init:0,
themeable:true},
offset:{group:["offsetTop","offsetRight","offsetBottom","offsetLeft"],
shorthand:true,
themeable:true}},
members:{__baqVfT:null,
__cKehVR:null,
__d2xWKS:null,
getLayoutLocation:function(a){var e,b,c,d,g,f;
b=a.getBounds();
c=b.left;
d=b.top;
g=b;
a=a.getLayoutParent();
while(a&&!a.isRootWidget())b=a.getBounds(),c+=b.left,d+=b.top,e=a.getInsets(),c+=e.left,d+=e.top,a=a.getLayoutParent();
if(a.isRootWidget()){f=a.getContainerLocation();
f&&(c+=f.left,d+=f.top)}return{left:c,
top:d,
right:c+g.width,
bottom:d+g.height}},
moveTo:function(b,d){var e=qx.ui.core.MPlacement.getVisibleElement(),c,a,f,i,h,g,j,k;
if(e){c=this.getBounds(),a=e.getBounds();
if(c&&a){f=a.left,i=a.left+a.width,h=a.top,g=a.top+a.height,j=d+c.height,k=b+c.width;
(k>f&&b<i)&&(j>h&&d<g)&&(b=Math.max(f-c.width,0))}}this.getDomMove()?this.setDomPosition(b,d):this.setLayoutProperties({left:b,
top:d})},
placeToWidget:function(a,c){c&&(this.__boPNF4(),this.__baqVfT=qx.lang.Function.bind(this.placeToWidget,this,a,false),qx.event.Idle.getInstance().addListener("interval",this.__baqVfT),this.__d2xWKS=function(){this.__boPNF4()},this.addListener("disappear",this.__d2xWKS,this));
var b=a.getContainerLocation()||this.getLayoutLocation(a);
this.__mGIsG(b)},
__boPNF4:function(){this.__baqVfT&&(qx.event.Idle.getInstance().removeListener("interval",this.__baqVfT),this.__baqVfT=null);
this.__d2xWKS&&(this.removeListener("disappear",this.__d2xWKS,this),this.__d2xWKS=null)},
placeToMouse:function(b){var a=b.getDocumentLeft(),c=b.getDocumentTop(),d={left:a,
top:c,
right:a,
bottom:c};
this.__mGIsG(d)},
placeToElement:function(b,d){var a=qx.bom.element.Location.get(b),c={left:a.left,
top:a.top,
right:a.left+b.offsetWidth,
bottom:a.top+b.offsetHeight};
d&&(this.__baqVfT=qx.lang.Function.bind(this.placeToElement,this,b,false),qx.event.Idle.getInstance().addListener("interval",this.__baqVfT),this.addListener("disappear",function(){this.__baqVfT&&(qx.event.Idle.getInstance().removeListener("interval",this.__baqVfT),this.__baqVfT=null)},this));
this.__mGIsG(c)},
placeToPoint:function(a){var b={left:a.left,
top:a.top,
right:a.left,
bottom:a.top};
this.__mGIsG(b)},
_getPlacementOffsets:function(){return{left:this.getOffsetLeft(),
top:this.getOffsetTop(),
right:this.getOffsetRight(),
bottom:this.getOffsetBottom()}},
__boDGW7:function(b){var a=null;
if(this._computePlacementSize)a=this._computePlacementSize();
else if(this.isVisible())a=this.getBounds();
a==null?this.addListenerOnce("appear",function(){this.__boDGW7(b)},this):b.call(this,a)},
__mGIsG:function(a){this.__boDGW7(function(c){var b=qx.util.placement.Placement.compute(c,this.getLayoutParent().getBounds(),a,this._getPlacementOffsets(),this.getPosition(),this.getPlacementModeX(),this.getPlacementModeY());
this.moveTo(b.left,b.top)})}},
destruct:function(){this.__boPNF4()}});


// qx.ui.basic.Image
//   - size: 3725 bytes
//   - modified: 2010-11-02T18:18:13
//   - names:
//       qx, 12x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Decoration.isAlphaImageLoaderEnabled, 1x
//       qx.html.Image, 1x
//       qx.io.ImageLoader, 2x
//       qx.io.ImageLoader.isLoaded, 1x
//       qx.lang.String.endsWith, 1x
//       qx.lang.String.startsWith, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.queue.Layout.add, 1x
//       qx.util.ResourceManager.getInstance, 2x
qx.Class.define("qx.ui.basic.Image",{extend:qx.ui.core.Widget,
construct:function(a){this.__big5KR={};
this.base(arguments);
a&&this.setSource(a)},
properties:{source:{check:"String",
init:null,
nullable:true,
event:"changeSource",
apply:"_applySource",
themeable:true},
scale:{check:"Boolean",
init:false,
themeable:true,
apply:"_applyScale"},
appearance:{refine:true,
init:"image"},
allowShrinkX:{refine:true,
init:false},
allowShrinkY:{refine:true,
init:false},
allowGrowX:{refine:true,
init:false},
allowGrowY:{refine:true,
init:false}},
events:{loadingFailed:"qx.event.type.Event",
loaded:"qx.event.type.Event"},
members:{__mZGQl:null,
__qcea4:null,
__jzo3s:null,
__big5KR:null,
getContentElement:function(){return this.__cViU4L()},
_createContentElement:function(){return this.__cViU4L()},
_getContentHint:function(){return{width:this.__mZGQl||0,
height:this.__qcea4||0}},
_applyEnabled:function(a,b){this.base(arguments,a,b);
this.getSource()&&this._styleSource()},
_applySource:function(a){this._styleSource()},
_applyScale:function(a){this._styleSource()},
__unggS:function(a){this.__jzo3s=a},
__tZ99Y:function(){if(this.__jzo3s==null){var a=this.getSource(),b=false;
a!=null&&(b=qx.lang.String.endsWith(a,".png"));
this.__jzo3s=this.getScale()&&b&&qx.bom.element.Decoration.isAlphaImageLoaderEnabled()?"alphaScaled":this.getScale()?"scaled":"nonScaled"}return this.__jzo3s},
__dyP67h:function(d){var b,a,c;
d=="alphaScaled"?(b=true,a="div"):d=="nonScaled"?(b=false,a="div"):(b=true,a="img");
c=new qx.html.Image(a);
c.setScale(b);
c.setStyles({overflowX:"hidden",
overflowY:"hidden"});
return c},
__cViU4L:function(){var a=this.__tZ99Y();
this.__big5KR[a]==null&&(this.__big5KR[a]=this.__dyP67h(a));
return this.__big5KR[a]},
_styleSource:function(){var a=this.getSource();
if(!a){this.getContentElement().resetSource();
return}this.__dvDzND(a);
qx.util.ResourceManager.getInstance().has(a)?this.__bfZtxL(this.getContentElement(),a):qx.io.ImageLoader.isLoaded(a)?this.__bxW9F4(this.getContentElement(),a):this.__bFLWVi(this.getContentElement(),a)},
__dvDzND:function(a){this.getScale()&&this.__tZ99Y()!="scaled"?this.__unggS("scaled"):!this.getScale()&&this.__tZ99Y("nonScaled")&&this.__unggS("nonScaled");
this.__eHB0ET(this.__cViU4L())},
__eHB0ET:function(c){var d=this.getContainerElement(),f=d.getChild(0),b,a,e,g;
if(f!=c){if(f!=null){b="px",a={},e=this.getInnerSize();
e!=null&&(a.width=e.width+b,a.height=e.height+b);
g=this.getInsets();
a.left=g.left+b;
a.top=g.top+b;
a.zIndex=10;
c.setStyles(a,true);
c.setSelectable(this.getSelectable())}d.removeAt(0);
d.addAt(c,0)}},
__bfZtxL:function(c,a){var b=qx.util.ResourceManager.getInstance(),d;
if(!this.getEnabled()){d=a.replace(/\.([a-z]+)$/,"-disabled.$1");
b.has(d)?(a=d,this.addState("replacement")):this.removeState("replacement")}if(c.getSource()===a)return;
c.setSource(a);
this.__byQqwm(b.getImageWidth(a),b.getImageHeight(a))},
__bxW9F4:function(e,a){var b=qx.io.ImageLoader,c,d;
e.setSource(a);
c=b.getWidth(a),d=b.getHeight(a);
this.__byQqwm(c,d)},
__bFLWVi:function(d,a){var c=qx.io.ImageLoader,b;
if(!qx.lang.String.startsWith(a.toLowerCase(),"http")){b=this.self(arguments);
b.__qE6jA||(b.__qE6jA={});
b.__qE6jA[a]||(this.debug("try to load an unmanaged relative image: "+a),b.__qE6jA[a]=true)}c.isFailed(a)?d!=null&&d.resetSource():c.load(a,this.__8vQ3X,this)},
__8vQ3X:function(b,a){if(this.$$disposed===true)return;
a.failed?(this.warn("Image could not be loaded: "+b),this.fireEvent("loadingFailed")):this.fireEvent("loaded");
this._styleSource()},
__byQqwm:function(b,a){(b!==this.__mZGQl||a!==this.__qcea4)&&(this.__mZGQl=b,this.__qcea4=a,qx.ui.core.queue.Layout.add(this))}},
destruct:function(){this._disposeMap("__contentElements")}});


// qx.ui.core.DragDropCursor
//   - size: 503 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Image, 1x
//       qx.ui.core.MPlacement, 1x
qx.Class.define("qx.ui.core.DragDropCursor",{extend:qx.ui.basic.Image,
include:qx.ui.core.MPlacement,
type:"singleton",
construct:function(){this.base(arguments);
this.setZIndex(1e8);
this.setDomMove(true);
var a=this.getApplicationRoot();
a.add(this,{left:-1000,
top:-1000})},
properties:{appearance:{refine:true,
init:"dragdrop-cursor"},
action:{check:["alias","copy","move"],
apply:"_applyAction",
nullable:true}},
members:{_applyAction:function(a,b){b&&this.removeState(b);
a&&this.addState(a)}}});


// qx.bom.client.System
//   - size: 1982 bytes
//   - modified: 2010-11-02T15:54:59
//   - names:
//       RegExp, 3x
//       navigator, 2x
//       qx, 7x
//   - packages:
//       RegExp.$1, 1x
//       navigator.userAgent, 2x
//       qx.Bootstrap.define, 1x
//       qx.bom.client.Engine.MSHTML, 1x
//       qx.bom.client.Engine.WEBKIT, 1x
//       qx.bom.client.Platform.MAC, 1x
//       qx.bom.client.Platform.UNIX, 1x
//       qx.bom.client.Platform.UNKNOWN_PLATFORM, 1x
//       qx.bom.client.Platform.WIN, 1x
qx.Bootstrap.define("qx.bom.client.System",{statics:{NAME:"",
SP1:false,
SP2:false,
WIN95:false,
WIN98:false,
WINME:false,
WINNT4:false,
WIN2000:false,
WINXP:false,
WIN2003:false,
WINVISTA:false,
WIN7:false,
WINCE:false,
LINUX:false,
SUNOS:false,
FREEBSD:false,
NETBSD:false,
OPENBSD:false,
OSX:false,
OS9:false,
SYMBIAN:false,
NINTENDODS:false,
PSP:false,
IPHONE:false,
UNKNOWN_SYSTEM:false,
__gLTat:{"Windows NT 6.1":"win7",
"Windows NT 6.0":"winvista",
"Windows NT 5.2":"win2003",
"Windows NT 5.1":"winxp",
"Windows NT 5.0":"win2000",
"Windows 2000":"win2000",
"Windows NT 4.0":"winnt4",
"Win 9x 4.90":"winme",
"Windows CE":"wince",
"Windows 98":"win98",
Win98:"win98",
"Windows 95":"win95",
Win95:"win95",
Linux:"linux",
FreeBSD:"freebsd",
NetBSD:"netbsd",
OpenBSD:"openbsd",
SunOS:"sunos",
"Symbian System":"symbian",
Nitro:"nintendods",
PSP:"sonypsp",
"Mac OS X 10_5":"osx5",
"Mac OS X 10.5":"osx5",
"Mac OS X 10_4":"osx4",
"Mac OS X 10.4":"osx4",
"Mac OS X 10_3":"osx3",
"Mac OS X 10.3":"osx3",
"Mac OS X 10_2":"osx2",
"Mac OS X 10.2":"osx2",
"Mac OS X 10_1":"osx1",
"Mac OS X 10.1":"osx1",
"Mac OS X 10_0":"osx0",
"Mac OS X 10.0":"osx0",
"Mac OS X":"osx",
"Mac OS 9":"os9"},
__jA3lT:function(){var a=navigator.userAgent,c=[],b,d;
for(b in this.__gLTat)c.push(b);
d=new RegExp("("+c.join("|").replace(/\./g,"\\.")+")","g");
if(!d.test(a)){this.UNKNOWN_SYSTEM=true;
qx.bom.client.Platform.UNKNOWN_PLATFORM?(this.NAME="winxp",this.WINXP=true):qx.bom.client.Platform.UNIX?(this.NAME="linux",this.LINUX=true):qx.bom.client.Platform.MAC?(this.NAME="osx5",this.OSX=true):(this.NAME="winxp",this.WINXP=true);
return}qx.bom.client.Engine.WEBKIT&&RegExp(" Mobile/").test(navigator.userAgent)?(this.IPHONE=true,this.NAME="iphone"):(this.NAME=this.__gLTat[RegExp.$1],this[this.NAME.toUpperCase()]=true,qx.bom.client.Platform.WIN&&(a.indexOf("Windows NT 5.01")!==-1?this.SP1=true:qx.bom.client.Engine.MSHTML&&a.indexOf("SV1")!==-1&&(this.SP2=true)))}},
defer:function(a){a.__jA3lT()}});


// qx.event.type.Transition
//   - size: 302 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Dom, 1x
qx.Class.define("qx.event.type.Transition",{extend:qx.event.type.Dom,
members:{init:function(b,a,c){this.base(arguments,b,a,null,true,true);
this.__Xu4AP=c;
return this},
clone:function(b){var a=this.base(arguments,b);
a.__Xu4AP=this.__Xu4AP;
return a},
getProperty:function(){return this.__Xu4AP}}});


// qx.event.type.Mouse
//   - size: 1221 bytes
//   - modified: 2010-09-17T21:15:51
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Dom, 1x
qx.Class.define("qx.event.type.Mouse",{extend:qx.event.type.Dom,
members:{_cloneNativeEvent:function(b,a){var a=this.base(arguments,b,a);
a.button=b.button;
a.clientX=b.clientX;
a.clientY=b.clientY;
a.pageX=b.pageX;
a.pageY=b.pageY;
a.screenX=b.screenX;
a.screenY=b.screenY;
a.wheelDelta=b.wheelDelta;
a.detail=b.detail;
a.srcElement=b.srcElement;
return a},
__u7bsg:{0:"left",
2:"right",
1:"middle"},
stop:function(){this.stopPropagation()},
getButton:function(){switch(this._type){case"contextmenu":return"right";
case"click":if(this.__bpk8Fs)return this.__bpk8Fs();
default:return this.__u7bsg[this._native.button]||"none"}},
__bpk8Fs:null,
isLeftPressed:function(){return this.getButton()==="left"},
isMiddlePressed:function(){return this.getButton()==="middle"},
isRightPressed:function(){return this.getButton()==="right"},
getRelatedTarget:function(){return this._relatedTarget},
getViewportLeft:function(){return this._native.clientX},
getViewportTop:function(){return this._native.clientY},
getDocumentLeft:function(){return this._native.pageX},
getDocumentTop:function(){return this._native.pageY},
getScreenLeft:function(){return this._native.screenX},
getScreenTop:function(){return this._native.screenY}}});


// qx.event.type.MouseWheel
//   - size: 589 bytes
//   - modified: 2010-10-13T17:38:57
//   - names:
//       Math, 2x
//       qx, 7x
//   - packages:
//       Math.abs, 1x
//       Math.log, 1x
//       qx.Class.define, 1x
//       qx.event.type.Mouse, 1x
//       qx.event.type.MouseWheel.MAXSCROLL, 5x
qx.Class.define("qx.event.type.MouseWheel",{extend:qx.event.type.Mouse,
statics:{MAXSCROLL:1},
members:{stop:function(){this.stopPropagation();
this.preventDefault()},
__EO7y0:function(b){var a=Math.abs(b),c;
qx.event.type.MouseWheel.MAXSCROLL<a&&(qx.event.type.MouseWheel.MAXSCROLL=a);
if(qx.event.type.MouseWheel.MAXSCROLL===a)return 2*(b/a);
c=(b/qx.event.type.MouseWheel.MAXSCROLL)*Math.log(qx.event.type.MouseWheel.MAXSCROLL)/1.75;
return c},
getWheelDelta:function(){if(this._native.detail)return this.__EO7y0(this._native.detail);
return this.__EO7y0(-this._native.wheelDelta)}}});


// qx.event.handler.Transition
//   - size: 1121 bytes
//   - modified: 2010-09-07T21:24:54
//   - names:
//       qx, 12x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Event.addNativeListener, 1x
//       qx.bom.Event.removeNativeListener, 1x
//       qx.core.Object, 1x
//       qx.event.GlobalError.observeMethod, 1x
//       qx.event.IEventHandler, 1x
//       qx.event.IEventHandler.TARGET_DOMNODE, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addHandler, 1x
//       qx.event.Registration.fireEvent, 1x
//       qx.event.type.Transition, 1x
//       qx.lang.Function.listener, 1x
qx.Class.define("qx.event.handler.Transition",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(a){this.base(arguments);
this.__qOaV1=a.getWindow();
this.__jO4QN=this.__qOaV1.document.documentElement;
this.__9H6hD=qx.lang.Function.listener(this.__ucgjO,this)},
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,
SUPPORTED_TYPES:{transitionEnd:1},
TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,
IGNORE_CAN_HANDLE:true},
members:{__9H6hD:null,
__qOaV1:null,
__jO4QN:null,
__P2hfP:{transitionEnd:"transitionend"},
__PW3j5:{transitionend:"transitionEnd"},
canHandleEvent:function(a,b){},
registerEvent:function(a,b,c){qx.bom.Event.addNativeListener(a,this.__P2hfP[b],this.__9H6hD)},
unregisterEvent:function(a,b,c){qx.bom.Event.removeNativeListener(a,this.__P2hfP[b],this.__9H6hD)},
__ucgjO:qx.event.GlobalError.observeMethod(function(b){var a=b.propertyName,c;
a.charAt(0)=="-"&&(a=a.substring(a.indexOf("-",1)+1));
c=[b,b.target,a];
qx.event.Registration.fireEvent(b.target,this.__PW3j5[b.type],qx.event.type.Transition,c)})},
defer:function(a){qx.event.Registration.addHandler(a)}});


// qx.event.handler.Mouse
//   - size: 3854 bytes
//   - modified: 2010-11-02T15:57:59
//   - names:
//       qx, 29x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Event, 6x
//       qx.bom.client.System.IPHONE, 2x
//       qx.core.Object, 1x
//       qx.dom.Hierarchy.getCommonParent, 1x
//       qx.event.GlobalError.observeMethod, 3x
//       qx.event.IEventHandler, 1x
//       qx.event.IEventHandler.TARGET_DOMNODE, 1x
//       qx.event.Registration.PRIORITY_NORMAL, 1x
//       qx.event.Registration.addHandler, 1x
//       qx.event.Registration.fireEvent, 2x
//       qx.event.type.Data, 1x
//       qx.event.type.Mouse, 1x
//       qx.event.type.MouseWheel, 1x
//       qx.lang.Function.listener, 3x
//       qx.lang.Function.returnNull, 3x
qx.Class.define("qx.event.handler.Mouse",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(a){this.base(arguments);
this.__ugn3e=a;
this.__qOaV1=a.getWindow();
this.__jO4QN=this.__qOaV1.document;
this._initButtonObserver();
this._initMoveObserver();
this._initWheelObserver()},
statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,
SUPPORTED_TYPES:{mousemove:1,
mouseover:1,
mouseout:1,
mousedown:1,
mouseup:1,
click:1,
dblclick:1,
contextmenu:1,
mousewheel:1},
TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,
IGNORE_CAN_HANDLE:true},
members:{__b1WRxn:null,
__bG1dGs:null,
__bP0kNk:null,
__2Ia43:null,
__bRmtLj:null,
__ugn3e:null,
__qOaV1:null,
__jO4QN:null,
canHandleEvent:function(a,b){},
registerEvent:qx.bom.client.System.IPHONE?function(a,b,c){a["on"+b]=qx.lang.Function.returnNull}:qx.lang.Function.returnNull,
unregisterEvent:qx.bom.client.System.IPHONE?function(a,b,c){a["on"+b]=undefined}:qx.lang.Function.returnNull,
__DxEp1:function(b,c,a){a||(a=b.target||b.srcElement);
a&&a.nodeType&&qx.event.Registration.fireEvent(a,c||b.type,c=="mousewheel"?qx.event.type.MouseWheel:qx.event.type.Mouse,[b,a,null,true,true]);
qx.event.Registration.fireEvent(this.__qOaV1,"useraction",qx.event.type.Data,[c||b.type])},
_initButtonObserver:function(){this.__b1WRxn=qx.lang.Function.listener(this._onButtonEvent,this);
var a=qx.bom.Event;
a.addNativeListener(this.__jO4QN,"mousedown",this.__b1WRxn);
a.addNativeListener(this.__jO4QN,"mouseup",this.__b1WRxn);
a.addNativeListener(this.__jO4QN,"click",this.__b1WRxn);
a.addNativeListener(this.__jO4QN,"dblclick",this.__b1WRxn);
a.addNativeListener(this.__jO4QN,"contextmenu",this.__b1WRxn)},
_initMoveObserver:function(){this.__bG1dGs=qx.lang.Function.listener(this._onMoveEvent,this);
var a=qx.bom.Event;
a.addNativeListener(this.__jO4QN,"mousemove",this.__bG1dGs);
a.addNativeListener(this.__jO4QN,"mouseover",this.__bG1dGs);
a.addNativeListener(this.__jO4QN,"mouseout",this.__bG1dGs)},
_initWheelObserver:function(){this.__bP0kNk=qx.lang.Function.listener(this._onWheelEvent,this);
var b=qx.bom.Event,c="DOMMouseScroll",a=this.__qOaV1;
b.addNativeListener(a,c,this.__bP0kNk)},
_stopButtonObserver:function(){var a=qx.bom.Event;
a.removeNativeListener(this.__jO4QN,"mousedown",this.__b1WRxn);
a.removeNativeListener(this.__jO4QN,"mouseup",this.__b1WRxn);
a.removeNativeListener(this.__jO4QN,"click",this.__b1WRxn);
a.removeNativeListener(this.__jO4QN,"dblclick",this.__b1WRxn);
a.removeNativeListener(this.__jO4QN,"contextmenu",this.__b1WRxn)},
_stopMoveObserver:function(){var a=qx.bom.Event;
a.removeNativeListener(this.__jO4QN,"mousemove",this.__bG1dGs);
a.removeNativeListener(this.__jO4QN,"mouseover",this.__bG1dGs);
a.removeNativeListener(this.__jO4QN,"mouseout",this.__bG1dGs)},
_stopWheelObserver:function(){var b=qx.bom.Event,c="DOMMouseScroll",a=this.__qOaV1;
b.removeNativeListener(a,c,this.__bP0kNk)},
_onMoveEvent:qx.event.GlobalError.observeMethod(function(a){this.__DxEp1(a)}),
_onButtonEvent:qx.event.GlobalError.observeMethod(function(b){var c=b.type,a=b.target||b.srcElement;
a&&a.nodeType==3&&(a=a.parentNode);
this.__boyJ3Z&&this.__boyJ3Z(b,c,a);
this.__bwEAlm&&this.__bwEAlm(b,c,a);
this.__DxEp1(b,c,a);
this.__bxbjaK&&this.__bxbjaK(b,c,a);
this.__dj853k&&this.__dj853k(b,c,a);
this.__2Ia43=c}),
_onWheelEvent:qx.event.GlobalError.observeMethod(function(a){this.__DxEp1(a,"mousewheel")}),
__boyJ3Z:null,
__bxbjaK:null,
__bwEAlm:null,
__dj853k:function(d,c,a){switch(c){case"mousedown":this.__bRmtLj=a;
break;
case"mouseup":if(a!==this.__bRmtLj){var b=qx.dom.Hierarchy.getCommonParent(a,this.__bRmtLj);
this.__DxEp1(d,"click",b)}}}},
destruct:function(){this._stopButtonObserver();
this._stopMoveObserver();
this._stopWheelObserver();
this.__ugn3e=this.__qOaV1=this.__jO4QN=this.__bRmtLj=null},
defer:function(a){qx.event.Registration.addHandler(a)}});


// qx.ui.core.EventHandler
//   - size: 2895 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       qx, 14x
//       window, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.IEventHandler, 1x
//       qx.event.Pool.getInstance, 2x
//       qx.event.Registration.PRIORITY_FIRST, 1x
//       qx.event.Registration.addHandler, 1x
//       qx.event.Registration.getManager, 1x
//       qx.event.type.Event.CAPTURING_PHASE, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.Widget.getWidgetByElement, 4x
qx.Class.define("qx.ui.core.EventHandler",{extend:qx.core.Object,
implement:qx.event.IEventHandler,
construct:function(){this.base(arguments);
this.__ugn3e=qx.event.Registration.getManager(window)},
statics:{PRIORITY:qx.event.Registration.PRIORITY_FIRST,
SUPPORTED_TYPES:{mousemove:1,
mouseover:1,
mouseout:1,
mousedown:1,
mouseup:1,
click:1,
dblclick:1,
contextmenu:1,
mousewheel:1,
keyup:1,
keydown:1,
keypress:1,
keyinput:1,
capture:1,
losecapture:1,
focusin:1,
focusout:1,
focus:1,
blur:1,
activate:1,
deactivate:1,
appear:1,
disappear:1,
dragstart:1,
dragend:1,
dragover:1,
dragleave:1,
drop:1,
drag:1,
dragchange:1,
droprequest:1,
transitionEnd:1,
animationEnd:1,
animationStart:1,
animationIteration:1,
touchstart:1,
touchend:1,
touchmove:1,
touchcancel:1,
tap:1,
swipe:1},
IGNORE_CAN_HANDLE:false},
members:{__ugn3e:null,
__PzGam:{focusin:1,
focusout:1,
focus:1,
blur:1},
__9vI4B:{mouseover:1,
mouseout:1,
appear:1,
disappear:1},
canHandleEvent:function(a,b){return a instanceof qx.ui.core.Widget},
_dispatchEvent:function(a){var j=a.getTarget(),b=qx.ui.core.Widget.getWidgetByElement(j),n=false,q,d,m,e,i,p,f,c,k,g,h,o,l;
while(b&&b.isAnonymous()){n=true;
b=b.getLayoutParent()}b&&n&&a.getType()=="activate"&&b.getContainerElement().activate();
if(this.__PzGam[a.getType()]){b=b&&b.getFocusTarget();
if(!b)return}if(a.getRelatedTarget){q=a.getRelatedTarget(),d=qx.ui.core.Widget.getWidgetByElement(q);
while(d&&d.isAnonymous())d=d.getLayoutParent();
if(d){this.__PzGam[a.getType()]&&(d=d.getFocusTarget());
if(d===b)return}}m=a.getCurrentTarget(),e=qx.ui.core.Widget.getWidgetByElement(m);
if(!e||e.isAnonymous())return;
this.__PzGam[a.getType()]&&(e=e.getFocusTarget());
i=a.getType();
if(!e||!(e.isEnabled()||this.__9vI4B[i]))return;
p=a.getEventPhase()==qx.event.type.Event.CAPTURING_PHASE,f=this.__ugn3e.getListeners(e,i,p);
if(!f||f.length===0)return;
c=qx.event.Pool.getInstance().getObject(a.constructor);
a.clone(c);
c.setTarget(b);
c.setRelatedTarget(d||null);
c.setCurrentTarget(e);
k=a.getOriginalTarget();
if(k){g=qx.ui.core.Widget.getWidgetByElement(k);
while(g&&g.isAnonymous())g=g.getLayoutParent();
c.setOriginalTarget(g)}else c.setOriginalTarget(j);
for(h=0,o=f.length;
h<o;
h++){l=f[h].context||e;
f[h].handler.call(l,c)}c.getPropagationStopped()&&a.stopPropagation();
c.getDefaultPrevented()&&a.preventDefault();
qx.event.Pool.getInstance().poolObject(c)},
registerEvent:function(c,b,d){var a;
a=b==="focus"||b==="blur"?c.getFocusElement():b==="load"||b==="input"?c.getContentElement():c.getContainerElement();
a&&a.addListener(b,this._dispatchEvent,this,d)},
unregisterEvent:function(c,b,d){var a;
a=b==="focus"||b==="blur"?c.getFocusElement():b==="load"||b==="input"?c.getContentElement():c.getContainerElement();
a&&a.removeListener(b,this._dispatchEvent,this,d)}},
destruct:function(){this.__ugn3e=null},
defer:function(a){qx.event.Registration.addHandler(a)}});


// qx.ui.core.MResizable
//   - size: 4741 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       Math, 8x
//       qx, 7x
//       window, 1x
//   - packages:
//       Math.abs, 4x
//       Math.max, 2x
//       Math.min, 2x
//       qx.Mixin.define, 1x
//       qx.core.Init.getApplication, 1x
//       qx.core.ObjectRegistry.inShutDown, 1x
//       qx.event.Registration.getManager, 1x
//       qx.event.handler.DragDrop, 1x
//       qx.lang.Object.clone, 1x
//       qx.ui.core.Widget, 1x
qx.Mixin.define("qx.ui.core.MResizable",{construct:function(){this.addListener("mousedown",this.__byyPoh,this,true);
this.addListener("mouseup",this.__bhKU1E,this);
this.addListener("mousemove",this.__byFHB4,this);
this.addListener("mouseout",this.__bp1udD,this);
this.addListener("losecapture",this.__bQCyAP,this);
var a=this.getContainerElement().getDomElement();
a==null&&(a=window);
this.__bfA0ce=qx.event.Registration.getManager(a).getHandler(qx.event.handler.DragDrop)},
properties:{resizableTop:{check:"Boolean",
init:true},
resizableRight:{check:"Boolean",
init:true},
resizableBottom:{check:"Boolean",
init:true},
resizableLeft:{check:"Boolean",
init:true},
resizable:{group:["resizableTop","resizableRight","resizableBottom","resizableLeft"],
shorthand:true},
resizeSensitivity:{check:"Integer",
init:5},
useResizeFrame:{check:"Boolean",
init:true}},
members:{__bfA0ce:null,
__PRPn6:null,
__Wd9yb:null,
__JVTVo:null,
__EEFHA:null,
__QiMbP:null,
__PW3jK:null,
RESIZE_TOP:1,
RESIZE_BOTTOM:2,
RESIZE_LEFT:4,
RESIZE_RIGHT:8,
__9eW5E:function(){var a=this.__PRPn6;
a||(a=this.__PRPn6=new qx.ui.core.Widget(),a.setAppearance("resize-frame"),a.exclude(),qx.core.Init.getApplication().getRoot().add(a));
return a},
__bixjDl:function(){var a=this.__QiMbP,b=this.__9eW5E();
b.setUserBounds(a.left,a.top,a.width,a.height);
b.show();
b.setZIndex(this.getZIndex()+1)},
__bTfCBR:function(j){var d=this.__Wd9yb,e=this.getSizeHint(),g=this.__PW3jK,a=this.__QiMbP,b=a.width,c=a.height,h=a.left,i=a.top,f;
(d&this.RESIZE_TOP||d&this.RESIZE_BOTTOM)&&(f=Math.max(g.top,Math.min(g.bottom,j.getDocumentTop()))-this.__EEFHA,d&this.RESIZE_TOP?c-=f:c+=f,c<e.minHeight?c=e.minHeight:c>e.maxHeight&&(c=e.maxHeight),d&this.RESIZE_TOP&&(i+=a.height-c));
(d&this.RESIZE_LEFT||d&this.RESIZE_RIGHT)&&(f=Math.max(g.left,Math.min(g.right,j.getDocumentLeft()))-this.__JVTVo,d&this.RESIZE_LEFT?b-=f:b+=f,b<e.minWidth?b=e.minWidth:b>e.maxWidth&&(b=e.maxWidth),d&this.RESIZE_LEFT&&(h+=a.width-b));
return{viewportLeft:h,
viewportTop:i,
parentLeft:a.bounds.left+h-a.left,
parentTop:a.bounds.top+i-a.top,
width:b,
height:c}},
__3SuXe:{1:"n-resize",
2:"s-resize",
4:"w-resize",
8:"e-resize",
5:"nw-resize",
6:"sw-resize",
9:"ne-resize",
10:"se-resize"},
__bzT9c7:function(f){var b=this.getContentLocation(),c=this.getResizeSensitivity(),d=f.getDocumentLeft(),e=f.getDocumentTop(),a=0;
this.getResizableTop()&&Math.abs(b.top-e)<c?a+=this.RESIZE_TOP:this.getResizableBottom()&&Math.abs(b.bottom-e)<c&&(a+=this.RESIZE_BOTTOM);
this.getResizableLeft()&&Math.abs(b.left-d)<c?a+=this.RESIZE_LEFT:this.getResizableRight()&&Math.abs(b.right-d)<c&&(a+=this.RESIZE_RIGHT);
this.__Wd9yb=a},
__byyPoh:function(c){if(!this.__Wd9yb)return;
this.addState("resize");
this.__JVTVo=c.getDocumentLeft();
this.__EEFHA=c.getDocumentTop();
var f=this.getContainerLocation(),b=this.getBounds(),e,a,d;
this.__QiMbP={top:f.top,
left:f.left,
width:b.width,
height:b.height,
bounds:qx.lang.Object.clone(b)};
e=this.getLayoutParent(),a=e.getContentLocation(),d=e.getBounds();
this.__PW3jK={left:a.left,
top:a.top,
right:a.left+d.width,
bottom:a.top+d.height};
this.getUseResizeFrame()&&this.__bixjDl();
this.capture();
c.stop()},
__bhKU1E:function(b){if(!this.hasState("resize"))return;
this.getUseResizeFrame()&&this.__9eW5E().exclude();
var a=this.__bTfCBR(b);
this.setWidth(a.width);
this.setHeight(a.height);
(this.getResizableLeft()||this.getResizableTop())&&this.setLayoutProperties({left:a.parentLeft,
top:a.parentTop});
this.__Wd9yb=0;
this.removeState("resize");
this.resetCursor();
this.getApplicationRoot().resetGlobalCursor();
this.releaseCapture();
b.stopPropagation()},
__bQCyAP:function(a){if(!this.__Wd9yb)return;
this.resetCursor();
this.getApplicationRoot().resetGlobalCursor();
this.removeState("move");
this.getUseResizeFrame()&&this.__9eW5E().exclude()},
__byFHB4:function(b){if(this.hasState("resize")){var a=this.__bTfCBR(b),f,c,d,e;
if(this.getUseResizeFrame()){f=this.__9eW5E();
f.setUserBounds(a.viewportLeft,a.viewportTop,a.width,a.height)}else this.setWidth(a.width),this.setHeight(a.height),(this.getResizableLeft()||this.getResizableTop())&&this.setLayoutProperties({left:a.parentLeft,
top:a.parentTop});
b.stopPropagation()}else if(!this.hasState("maximized")&&!this.__bfA0ce.isSessionActive()){this.__bzT9c7(b);
c=this.__Wd9yb,d=this.getApplicationRoot();
if(c){e=this.__3SuXe[c];
this.setCursor(e);
d.setGlobalCursor(e)}else this.getCursor()&&(this.resetCursor(),d.resetGlobalCursor())}},
__bp1udD:function(a){this.getCursor()&&!this.hasState("resize")&&(this.resetCursor(),this.getApplicationRoot().resetGlobalCursor())}},
destruct:function(){this.__PRPn6!=null&&!qx.core.ObjectRegistry.inShutDown&&(this.__PRPn6.destroy(),this.__PRPn6=null);
this.__bfA0ce=null}});


// qx.ui.core.MMovable
//   - size: 2977 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       Math, 4x
//       qx, 7x
//   - packages:
//       Math.max, 2x
//       Math.min, 2x
//       qx.Class.implementsInterface, 2x
//       qx.Mixin.define, 1x
//       qx.core.Init.getApplication, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.window.IDesktop, 2x
qx.Mixin.define("qx.ui.core.MMovable",{properties:{movable:{check:"Boolean",
init:true},
useMoveFrame:{check:"Boolean",
init:false}},
members:{__Jfyn0:null,
__DYSf7:null,
__DdiNa:null,
__yhfkG:null,
__t462K:null,
__Jxqzo:null,
__EioJQ:null,
__UOqVX:false,
__bf0iHr:null,
__bwH9Zt:0,
_activateMoveHandle:function(a){if(this.__Jfyn0)throw new Error("The move handle could not be redefined!");
this.__Jfyn0=a;
a.addListener("mousedown",this._onMoveMouseDown,this);
a.addListener("mouseup",this._onMoveMouseUp,this);
a.addListener("mousemove",this._onMoveMouseMove,this);
a.addListener("losecapture",this.__bxekIg,this)},
__UNBM5:function(){var a=this.__DYSf7;
a||(a=this.__DYSf7=new qx.ui.core.Widget(),a.setAppearance("move-frame"),a.exclude(),qx.core.Init.getApplication().getRoot().add(a));
return a},
__2W1Is:function(){var c=this.getContainerLocation(),b=this.getBounds(),a=this.__UNBM5();
a.setUserBounds(c.left,c.top,b.width,b.height);
a.show();
a.setZIndex(this.getZIndex()+1)},
__coiL5m:function(d){var a=this.__DdiNa,e=Math.max(a.left,Math.min(a.right,d.getDocumentLeft())),f=Math.max(a.top,Math.min(a.bottom,d.getDocumentTop())),c=this.__yhfkG+e,b=this.__t462K+f;
return{viewportLeft:c,
viewportTop:b,
parentLeft:c-this.__Jxqzo,
parentTop:b-this.__EioJQ}},
_onMoveMouseDown:function(c){if(!this.getMovable()||this.hasState("maximized"))return;
var a=this.getLayoutParent(),b=a.getContentLocation(),e=a.getBounds(),d;
qx.Class.implementsInterface(a,qx.ui.window.IDesktop)&&(a.isContentBlocked()||(this.__UOqVX=true,this.__bf0iHr=a.getBlockerColor(),this.__bwH9Zt=a.getBlockerOpacity(),a.setBlockerColor(null),a.setBlockerOpacity(1),a.blockContent(this.getZIndex()-1)));
this.__DdiNa={left:b.left,
top:b.top,
right:b.left+e.width,
bottom:b.top+e.height};
d=this.getContainerLocation();
this.__Jxqzo=b.left;
this.__EioJQ=b.top;
this.__yhfkG=d.left-c.getDocumentLeft();
this.__t462K=d.top-c.getDocumentTop();
this.addState("move");
this.__Jfyn0.capture();
this.getUseMoveFrame()&&this.__2W1Is();
c.stop()},
_onMoveMouseMove:function(b){if(!this.hasState("move"))return;
var a=this.__coiL5m(b);
this.getUseMoveFrame()?this.__UNBM5().setDomPosition(a.viewportLeft,a.viewportTop):this.setDomPosition(a.parentLeft,a.parentTop);
b.stopPropagation()},
_onMoveMouseUp:function(b){if(!this.hasState("move"))return;
this.removeState("move");
var a=this.getLayoutParent(),c;
qx.Class.implementsInterface(a,qx.ui.window.IDesktop)&&this.__UOqVX&&(a.unblockContent(),a.setBlockerColor(this.__bf0iHr),a.setBlockerOpacity(this.__bwH9Zt),this.__bf0iHr=null,this.__bwH9Zt=0);
this.__Jfyn0.releaseCapture();
c=this.__coiL5m(b);
this.setLayoutProperties({left:c.parentLeft,
top:c.parentTop});
this.getUseMoveFrame()&&this.__UNBM5().exclude();
b.stopPropagation()},
__bxekIg:function(a){if(!this.hasState("move"))return;
this.removeState("move");
this.getUseMoveFrame()&&this.__UNBM5().exclude()}},
destruct:function(){this._disposeObjects("__moveFrame","__moveHandle");
this.__DdiNa=null}});


// qx.ui.container.Composite
//   - size: 605 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 8x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Data, 2x
//       qx.ui.core.MChildrenHandling, 1x
//       qx.ui.core.MChildrenHandling.remap, 1x
//       qx.ui.core.MLayoutHandling, 1x
//       qx.ui.core.MLayoutHandling.remap, 1x
//       qx.ui.core.Widget, 1x
qx.Class.define("qx.ui.container.Composite",{extend:qx.ui.core.Widget,
include:[qx.ui.core.MChildrenHandling,qx.ui.core.MLayoutHandling],
construct:function(a){this.base(arguments);
a!=null&&this._setLayout(a)},
events:{addChildWidget:"qx.event.type.Data",
removeChildWidget:"qx.event.type.Data"},
members:{_afterAddChild:function(a){this.fireNonBubblingEvent("addChildWidget",qx.event.type.Data,[a])},
_afterRemoveChild:function(a){this.fireNonBubblingEvent("removeChildWidget",qx.event.type.Data,[a])}},
defer:function(b,a){qx.ui.core.MChildrenHandling.remap(a);
qx.ui.core.MLayoutHandling.remap(a)}});


// qx.ui.core.FocusHandler
//   - size: 3809 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Location, 1x
//       qx.core.Object, 1x
//       qx.ui.core.Widget, 4x
qx.Class.define("qx.ui.core.FocusHandler",{extend:qx.core.Object,
type:"singleton",
construct:function(){this.base(arguments);
this.__nbvW6={}},
members:{__nbvW6:null,
__OIkFf:null,
__VvSFs:null,
__Qq1EU:null,
connectTo:function(a){a.addListener("keypress",this.__IUnCM,this);
a.addListener("focusin",this._onFocusIn,this,true);
a.addListener("focusout",this._onFocusOut,this,true);
a.addListener("activate",this._onActivate,this,true);
a.addListener("deactivate",this._onDeactivate,this,true)},
addRoot:function(a){this.__nbvW6[a.$$hash]=a},
removeRoot:function(a){delete this.__nbvW6[a.$$hash]},
getActiveWidget:function(){return this.__OIkFf},
isActive:function(a){return this.__OIkFf==a},
getFocusedWidget:function(){return this.__VvSFs},
isFocused:function(a){return this.__VvSFs==a},
isFocusRoot:function(a){return!!this.__nbvW6[a.$$hash]},
_onActivate:function(c){var a=c.getTarget(),b;
this.__OIkFf=a;
b=this.__1Cw2O(a);
b!=this.__Qq1EU&&(this.__Qq1EU=b)},
_onDeactivate:function(b){var a=b.getTarget();
this.__OIkFf==a&&(this.__OIkFf=null)},
_onFocusIn:function(b){var a=b.getTarget();
a!=this.__VvSFs&&(this.__VvSFs=a,a.visualizeFocus())},
_onFocusOut:function(b){var a=b.getTarget();
a==this.__VvSFs&&(this.__VvSFs=null,a.visualizeBlur())},
__IUnCM:function(a){if(a.getKeyIdentifier()!="Tab")return;
if(!this.__Qq1EU)return;
a.stopPropagation();
a.preventDefault();
var b=this.__VvSFs,c;
if(!a.isShiftPressed())c=b?this.__8EEDh(b):this.__9bVyx();
else c=b?this.__bgbiEA(b):this.__1xRc3();
c&&c.tabFocus()},
__1Cw2O:function(a){var b=this.__nbvW6;
while(a){if(b[a.$$hash])return a;
a=a.getLayoutParent()}return null},
__bgNfo5:function(a,b){if(a===b)return 0;
var h=a.getTabIndex()||0,i=b.getTabIndex()||0,j,k,g,c,d,f,e;
if(h!=i)return h-i;
j=a.getContainerElement().getDomElement(),k=b.getContainerElement().getDomElement(),g=qx.bom.element.Location,c=g.get(j),d=g.get(k);
if(c.top!=d.top)return c.top-d.top;
if(c.left!=d.left)return c.left-d.left;
f=a.getZIndex(),e=b.getZIndex();
if(f!=e)return f-e;
return 0},
__9bVyx:function(){return this.__yyzqd(this.__Qq1EU,null)},
__1xRc3:function(){return this.__tZS7b(this.__Qq1EU,null)},
__8EEDh:function(a){var c=this.__Qq1EU,b,d;
if(c==a)return this.__9bVyx();
while(a&&a.getAnonymous())a=a.getLayoutParent();
if(a==null)return[];
b=[];
this.__bgg4Ga(c,a,b);
b.sort(this.__bgNfo5);
d=b.length;
return d>0?b[0]:this.__9bVyx()},
__bgbiEA:function(a){var d=this.__Qq1EU,b,c;
if(d==a)return this.__1xRc3();
while(a&&a.getAnonymous())a=a.getLayoutParent();
if(a==null)return[];
b=[];
this.__bocJ9p(d,a,b);
b.sort(this.__bgNfo5);
c=b.length;
return c>0?b[c-1]:this.__1xRc3()},
__bgg4Ga:function(g,e,d){for(var c=g.getLayoutChildren(),a,b=0,f=c.length;
b<f;
b++){a=c[b];
if(!(a instanceof qx.ui.core.Widget))continue;
!this.isFocusRoot(a)&&a.isEnabled()&&a.isVisible()&&(a.isTabable()&&this.__bgNfo5(e,a)<0&&d.push(a),this.__bgg4Ga(a,e,d))}},
__bocJ9p:function(g,e,d){for(var c=g.getLayoutChildren(),a,b=0,f=c.length;
b<f;
b++){a=c[b];
if(!(a instanceof qx.ui.core.Widget))continue;
!this.isFocusRoot(a)&&a.isEnabled()&&a.isVisible()&&(a.isTabable()&&this.__bgNfo5(e,a)>0&&d.push(a),this.__bocJ9p(a,e,d))}},
__yyzqd:function(f,b){for(var d=f.getLayoutChildren(),a,c=0,e=d.length;
c<e;
c++){a=d[c];
if(!(a instanceof qx.ui.core.Widget))continue;
!this.isFocusRoot(a)&&a.isEnabled()&&a.isVisible()&&(a.isTabable()&&(b==null||this.__bgNfo5(a,b)<0)&&(b=a),b=this.__yyzqd(a,b))}return b},
__tZS7b:function(f,b){for(var d=f.getLayoutChildren(),a,c=0,e=d.length;
c<e;
c++){a=d[c];
if(!(a instanceof qx.ui.core.Widget))continue;
!this.isFocusRoot(a)&&a.isEnabled()&&a.isVisible()&&(a.isTabable()&&(b==null||this.__bgNfo5(a,b)>0)&&(b=a),b=this.__tZS7b(a,b))}return b}},
destruct:function(){this._disposeMap("__roots");
this.__VvSFs=this.__OIkFf=this.__Qq1EU=null}});


// qx.ui.basic.Label
//   - size: 3211 bytes
//   - modified: 2010-09-23T21:51:03
//   - names:
//       qx, 14x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Font.getDefaultStyles, 2x
//       qx.bom.Label, 1x
//       qx.bom.client.Feature.CSS_TEXT_OVERFLOW, 1x
//       qx.bom.client.Feature.XUL, 1x
//       qx.html.Label, 1x
//       qx.theme.manager.Color.getInstance, 1x
//       qx.theme.manager.Font.getInstance, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.queue.Layout.add, 3x
//       qx.ui.form.IStringForm, 1x
qx.Class.define("qx.ui.basic.Label",{extend:qx.ui.core.Widget,
implement:[qx.ui.form.IStringForm],
construct:function(a){this.base(arguments);
a!=null&&this.setValue(a)},
properties:{rich:{check:"Boolean",
init:false,
event:"changeRich",
apply:"_applyRich"},
wrap:{check:"Boolean",
init:true,
apply:"_applyWrap"},
value:{check:"String",
apply:"_applyValue",
event:"changeValue",
nullable:true},
buddy:{check:"qx.ui.core.Widget",
apply:"_applyBuddy",
nullable:true,
init:null},
textAlign:{check:["left","center","right"],
nullable:true,
themeable:true,
apply:"_applyTextAlign",
event:"changeTextAlign"},
appearance:{refine:true,
init:"label"},
selectable:{refine:true,
init:false},
allowGrowX:{refine:true,
init:false},
allowGrowY:{refine:true,
init:false},
allowShrinkY:{refine:true,
init:false}},
members:{__jBkoY:null,
__bH0gxI:null,
__bODULx:null,
__bgKuUK:null,
_getContentHint:function(){this.__bH0gxI&&(this.__P26oP=this.__bJcMNO(),delete this.__bH0gxI);
return{width:this.__P26oP.width,
height:this.__P26oP.height}},
_hasHeightForWidth:function(){return this.getRich()&&this.getWrap()},
_applySelectable:function(a){if(!qx.bom.client.Feature.CSS_TEXT_OVERFLOW&&qx.bom.client.Feature.XUL)if(a&&!this.isRich()){this.warn("Only rich labels are selectable in browsers with Gecko engine!");
return}this.base(arguments,a)},
_getContentHeightForWidth:function(a){if(!this.getRich()&&!this.getWrap())return null;
return this.__bJcMNO(a).height},
_createContentElement:function(){return new qx.html.Label},
_applyTextAlign:function(a,b){this.getContentElement().setStyle("textAlign",a)},
_applyTextColor:function(a,b){a?this.getContentElement().setStyle("color",qx.theme.manager.Color.getInstance().resolve(a)):this.getContentElement().removeStyle("color")},
__P26oP:{width:0,
height:0},
_applyFont:function(b,c){var a;
b?(this.__jBkoY=qx.theme.manager.Font.getInstance().resolve(b),a=this.__jBkoY.getStyles()):(this.__jBkoY=null,a=qx.bom.Font.getDefaultStyles());
this.getContentElement().setStyles(a);
this.__bH0gxI=true;
qx.ui.core.queue.Layout.add(this)},
__bJcMNO:function(f){var a=qx.bom.Label,e=this.getFont(),c=e?this.__jBkoY.getStyles():qx.bom.Font.getDefaultStyles(),b=this.getValue()||"A",d=this.getRich();
return d?a.getHtmlSize(b,c,f):a.getTextSize(b,c)},
_applyBuddy:function(a,b){b!=null&&(b.removeBinding(this.__bODULx),this.__bODULx=null,this.removeListenerById(this.__bgKuUK),this.__bgKuUK=null);
a!=null&&(this.__bODULx=a.bind("enabled",this,"enabled"),this.__bgKuUK=this.addListener("click",function(){a.isFocusable()&&a.focus.apply(a)},this))},
_applyRich:function(a){this.getContentElement().setRich(a);
this.__bH0gxI=true;
qx.ui.core.queue.Layout.add(this)},
_applyWrap:function(a,c){a&&!this.isRich()&&this.warn("Only rich labels support wrap.");
if(this.isRich()){var b=a?"normal":"nowrap";
this.getContentElement().setStyle("whiteSpace",b)}},
_onChangeLocale:null,
_applyValue:function(a,b){this.getContentElement().setValue(a);
this.__bH0gxI=true;
qx.ui.core.queue.Layout.add(this);
this.fireDataEvent("changeContent",a,b)}},
destruct:function(){if(this.__bODULx!=null){var a=this.getBuddy();
a!=null&&!a.isDisposed()&&a.removeBinding(this.__bODULx)}this.__jBkoY=this.__bODULx=null}});


// qx.ui.layout.Atom
//   - size: 2164 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Math, 12x
//       qx, 4x
//   - packages:
//       Math.max, 7x
//       Math.min, 3x
//       Math.round, 2x
//       qx.Class.define, 1x
//       qx.ui.basic.Label, 1x
//       qx.ui.layout.Abstract, 1x
//       qx.ui.layout.Util, 1x
qx.Class.define("qx.ui.layout.Atom",{extend:qx.ui.layout.Abstract,
properties:{gap:{check:"Integer",
init:4,
apply:"_applyLayoutChange"},
iconPosition:{check:["left","top","right","bottom"],
init:"left",
apply:"_applyLayoutChange"},
center:{check:"Boolean",
init:false,
apply:"_applyLayoutChange"}},
members:{verifyLayoutProperty:function(c,a,b){this.assert(false,"The property '"+a+"' is not supported by the Atom layout!")},
renderLayout:function(s,p){var u=qx.ui.layout.Util,o=this.getIconPosition(),j=this._getLayoutChildren(),t=j.length,f,g,b,e,d,c,m=this.getGap(),v=this.getCenter(),i,l,n,r,a,h,k,q,x,w;
if(o==="bottom"||o==="right"){i=t-1,l=-1,n=-1}else{i=0,l=t,n=1}if(o=="top"||o=="bottom"){if(v){r=0,a=i;
for(;
a!=l;
a+=n)e=j[a].getSizeHint().height,e>0&&(r+=e,a!=i&&(r+=m));
g=Math.round((p-r)/2)}else g=0;
for(a=i;
a!=l;
a+=n)d=j[a],c=d.getSizeHint(),b=Math.min(c.maxWidth,Math.max(s,c.minWidth)),e=c.height,f=u.computeHorizontalAlignOffset("center",b,s),d.renderLayout(f,g,b,e),e>0&&(g+=e+m)}else{h=s,k=null,q=0,a=i;
for(;
a!=l;
a+=n)d=j[a],b=d.getSizeHint().width,b>0&&(!k&&d instanceof qx.ui.basic.Label?k=d:h-=b,q++);
if(q>1){x=(q-1)*m;
h-=x}if(k){c=k.getSizeHint(),w=Math.max(c.minWidth,Math.min(h,c.maxWidth));
h-=w}f=v&&h>0?Math.round(h/2):0;
for(a=i;
a!=l;
a+=n)d=j[a],c=d.getSizeHint(),e=Math.min(c.maxHeight,Math.max(p,c.minHeight)),b=d===k?w:c.width,g=u.computeVerticalAlignOffset("middle",c.height,p),d.renderLayout(f,g,b,e),b>0&&(f+=b+m)}},
_computeSizeHint:function(){var h=this._getLayoutChildren(),k=h.length,a,j,e,d,g,f,l,m,c,b,i;
if(k===1){a=h[0].getSizeHint();
j={width:a.width,
height:a.height,
minWidth:a.minWidth,
minHeight:a.minHeight}}else{e=0,d=0,g=0,f=0,l=this.getIconPosition(),m=this.getGap();
if(l==="top"||l==="bottom"){c=0,b=0;
for(;
b<k;
b++)a=h[b].getSizeHint(),d=Math.max(d,a.width),e=Math.max(e,a.minWidth),a.height>0&&(f+=a.height,g+=a.minHeight,c++);
if(c>1){i=(c-1)*m;
f+=i;
g+=i}}else{c=0,b=0;
for(;
b<k;
b++)a=h[b].getSizeHint(),f=Math.max(f,a.height),g=Math.max(g,a.minHeight),a.width>0&&(d+=a.width,e+=a.minWidth,c++);
if(c>1){i=(c-1)*m;
d+=i;
e+=i}}j={minWidth:e,
width:d,
minHeight:g,
height:f}}return j}}});


// qx.ui.basic.Atom
//   - size: 2264 bytes
//   - modified: 2010-11-02T18:18:05
//   - names:
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Image, 1x
//       qx.ui.basic.Label, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.layout.Atom, 1x
qx.Class.define("qx.ui.basic.Atom",{extend:qx.ui.core.Widget,
construct:function(b,a){this.assertArgumentsCount(arguments,0,2);
this.base(arguments);
this._setLayout(new qx.ui.layout.Atom());
b!=null&&this.setLabel(b);
a!=null&&this.setIcon(a)},
properties:{appearance:{refine:true,
init:"atom"},
label:{apply:"_applyLabel",
nullable:true,
check:"String",
event:"changeLabel"},
rich:{check:"Boolean",
init:false,
apply:"_applyRich"},
icon:{check:"String",
apply:"_applyIcon",
nullable:true,
themeable:true,
event:"changeIcon"},
gap:{check:"Integer",
nullable:false,
event:"changeGap",
apply:"_applyGap",
themeable:true,
init:4},
show:{init:"both",
check:["both","label","icon"],
themeable:true,
inheritable:true,
apply:"_applyShow",
event:"changeShow"},
iconPosition:{init:"left",
check:["top","right","bottom","left"],
themeable:true,
apply:"_applyIconPosition"},
center:{init:false,
check:"Boolean",
themeable:true,
apply:"_applyCenter"}},
members:{_createChildControlImpl:function(b){var a;
switch(b){case"label":a=new qx.ui.basic.Label(this.getLabel());
a.setAnonymous(true);
a.setRich(this.getRich());
this._add(a);
(this.getLabel()==null||this.getShow()==="icon")&&a.exclude();
break;
case"icon":a=new qx.ui.basic.Image(this.getIcon());
a.setAnonymous(true);
this._addAt(a,0);
(this.getIcon()==null||this.getShow()==="label")&&a.exclude();
break}return a||this.base(arguments,b)},
_forwardStates:{focused:true,
hovered:true},
_handleLabel:function(){this.getLabel()==null||this.getShow()==="icon"?this._excludeChildControl("label"):this._showChildControl("label")},
_handleIcon:function(){this.getIcon()==null||this.getShow()==="label"?this._excludeChildControl("icon"):this._showChildControl("icon")},
_applyLabel:function(b,c){var a=this.getChildControl("label",true);
a&&a.setValue(b);
this._handleLabel()},
_applyRich:function(b,c){var a=this.getChildControl("label",true);
a&&a.setRich(b)},
_applyIcon:function(b,c){var a=this.getChildControl("icon",true);
a&&a.setSource(b);
this._handleIcon()},
_applyGap:function(a,b){this._getLayout().setGap(a)},
_applyShow:function(a,b){this._handleLabel();
this._handleIcon()},
_applyIconPosition:function(a,b){this._getLayout().setIconPosition(a)},
_applyCenter:function(a,b){this._getLayout().setCenter(a)}}});


// qx.ui.form.Button
//   - size: 2100 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Atom, 1x
//       qx.ui.core.MExecutable, 1x
//       qx.ui.form.IExecutable, 1x
qx.Class.define("qx.ui.form.Button",{extend:qx.ui.basic.Atom,
include:[qx.ui.core.MExecutable],
implement:[qx.ui.form.IExecutable],
construct:function(c,b,a){this.base(arguments,c,b);
a!=null&&this.setCommand(a);
this.addListener("mouseover",this._onMouseOver);
this.addListener("mouseout",this._onMouseOut);
this.addListener("mousedown",this._onMouseDown);
this.addListener("mouseup",this._onMouseUp);
this.addListener("keydown",this._onKeyDown);
this.addListener("keyup",this._onKeyUp);
this.addListener("dblclick",this._onStopEvent)},
properties:{appearance:{refine:true,
init:"button"},
focusable:{refine:true,
init:true}},
members:{_forwardStates:{focused:true,
hovered:true,
pressed:true,
disabled:true},
press:function(){if(this.hasState("abandoned"))return;
this.addState("pressed")},
release:function(){this.hasState("pressed")&&this.removeState("pressed")},
reset___:function(){this.removeState("pressed");
this.removeState("abandoned");
this.removeState("hovered")},
_onMouseOver:function(a){if(!this.isEnabled()||a.getTarget()!==this)return;
this.hasState("abandoned")&&(this.removeState("abandoned"),this.addState("pressed"));
this.addState("hovered")},
_onMouseOut:function(a){if(!this.isEnabled()||a.getTarget()!==this)return;
this.removeState("hovered");
this.hasState("pressed")&&(this.removeState("pressed"),this.addState("abandoned"))},
_onMouseDown:function(a){if(!a.isLeftPressed())return;
a.stopPropagation();
this.capture();
this.removeState("abandoned");
this.addState("pressed")},
_onMouseUp:function(b){this.releaseCapture();
var a=this.hasState("pressed"),c=this.hasState("abandoned");
a&&this.removeState("pressed");
c?this.removeState("abandoned"):(this.addState("hovered"),a&&this.execute());
b.stopPropagation()},
_onKeyDown:function(a){switch(a.getKeyIdentifier()){case"Enter":case"Space":this.removeState("abandoned"),this.addState("pressed"),a.stopPropagation()}},
_onKeyUp:function(a){switch(a.getKeyIdentifier()){case"Enter":case"Space":this.hasState("pressed")&&(this.removeState("abandoned"),this.removeState("pressed"),this.execute(),a.stopPropagation())}}}});


// qx.ui.window.Window
//   - size: 8544 bytes
//   - modified: 2010-09-07T21:24:54
//   - names:
//       Math, 2x
//       qx, 29x
//       undefined, 4x
//   - packages:
//       Math.round, 2x
//       qx.Class.define, 1x
//       qx.core.Init.getApplication, 1x
//       qx.event.type.Event, 4x
//       qx.ui.basic.Image, 1x
//       qx.ui.basic.Label, 2x
//       qx.ui.container.Composite, 3x
//       qx.ui.core.FocusHandler.getInstance, 1x
//       qx.ui.core.MContentPadding, 1x
//       qx.ui.core.MMovable, 1x
//       qx.ui.core.MRemoteChildrenHandling, 1x
//       qx.ui.core.MRemoteLayoutHandling, 1x
//       qx.ui.core.MResizable, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.Widget.contains, 1x
//       qx.ui.form.Button, 4x
//       qx.ui.layout.Grid, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.layout.VBox, 1x
//       qx.ui.window.IDesktop, 1x
//       qx.ui.window.Manager, 1x
qx.Class.define("qx.ui.window.Window",{extend:qx.ui.core.Widget,
include:[qx.ui.core.MRemoteChildrenHandling,qx.ui.core.MRemoteLayoutHandling,qx.ui.core.MResizable,qx.ui.core.MMovable,qx.ui.core.MContentPadding],
construct:function(b,a){this.base(arguments);
this._setLayout(new qx.ui.layout.VBox());
this._createChildControl("captionbar");
this._createChildControl("pane");
a!=null&&this.setIcon(a);
b!=null&&this.setCaption(b);
this._updateCaptionBar();
this.addListener("mousedown",this._onWindowMouseDown,this,true);
this.addListener("focusout",this._onWindowFocusOut,this);
qx.core.Init.getApplication().getRoot().add(this);
this.initVisibility();
qx.ui.core.FocusHandler.getInstance().addRoot(this)},
statics:{DEFAULT_MANAGER_CLASS:qx.ui.window.Manager},
events:{beforeClose:"qx.event.type.Event",
close:"qx.event.type.Event",
beforeMinimize:"qx.event.type.Event",
minimize:"qx.event.type.Event",
beforeMaximize:"qx.event.type.Event",
maximize:"qx.event.type.Event",
beforeRestore:"qx.event.type.Event",
restore:"qx.event.type.Event"},
properties:{appearance:{refine:true,
init:"window"},
visibility:{refine:true,
init:"excluded"},
focusable:{refine:true,
init:true},
active:{check:"Boolean",
init:false,
apply:"_applyActive",
event:"changeActive"},
alwaysOnTop:{check:"Boolean",
init:false,
event:"changeAlwaysOnTop"},
modal:{check:"Boolean",
init:false,
event:"changeModal"},
caption:{apply:"_applyCaptionBarChange",
event:"changeCaption",
nullable:true},
icon:{check:"String",
nullable:true,
apply:"_applyCaptionBarChange",
event:"changeIcon",
themeable:true},
status:{check:"String",
nullable:true,
apply:"_applyStatus",
event:"changeStatus"},
showClose:{check:"Boolean",
init:true,
apply:"_applyCaptionBarChange",
themeable:true},
showMaximize:{check:"Boolean",
init:true,
apply:"_applyCaptionBarChange",
themeable:true},
showMinimize:{check:"Boolean",
init:true,
apply:"_applyCaptionBarChange",
themeable:true},
allowClose:{check:"Boolean",
init:true,
apply:"_applyCaptionBarChange"},
allowMaximize:{check:"Boolean",
init:true,
apply:"_applyCaptionBarChange"},
allowMinimize:{check:"Boolean",
init:true,
apply:"_applyCaptionBarChange"},
showStatusbar:{check:"Boolean",
init:false,
apply:"_applyShowStatusbar"}},
members:{__QAVpS:null,
__WOZ6A:null,
getChildrenContainer:function(){return this.getChildControl("pane")},
_forwardStates:{active:true,
maximized:true},
setLayoutParent:function(a){a&&this.assertInterface(a,qx.ui.window.IDesktop,"Windows can only be added to widgets, which implement the interface qx.ui.window.IDesktop. All root widgets implement this interface.");
this.base(arguments,a)},
_createChildControlImpl:function(c){var a,b,d;
switch(c){case"statusbar":a=new qx.ui.container.Composite(new qx.ui.layout.HBox());
this._add(a);
a.add(this.getChildControl("statusbar-text"));
break;
case"statusbar-text":a=new qx.ui.basic.Label();
a.setValue(this.getStatus());
break;
case"pane":a=new qx.ui.container.Composite();
this._add(a,{flex:1});
break;
case"captionbar":b=new qx.ui.layout.Grid();
b.setRowFlex(0,1);
b.setColumnFlex(1,1);
a=new qx.ui.container.Composite(b);
this._add(a);
a.addListener("dblclick",this._onCaptionMouseDblClick,this);
this._activateMoveHandle(a);
break;
case"icon":a=new qx.ui.basic.Image(this.getIcon());
this.getChildControl("captionbar").add(a,{row:0,
column:0});
break;
case"title":a=new qx.ui.basic.Label(this.getCaption());
a.setWidth(0);
a.setAllowGrowX(true);
d=this.getChildControl("captionbar");
d.add(a,{row:0,
column:1});
break;
case"minimize-button":a=new qx.ui.form.Button();
a.setFocusable(false);
a.addListener("execute",this._onMinimizeButtonClick,this);
this.getChildControl("captionbar").add(a,{row:0,
column:2});
break;
case"restore-button":a=new qx.ui.form.Button();
a.setFocusable(false);
a.addListener("execute",this._onRestoreButtonClick,this);
this.getChildControl("captionbar").add(a,{row:0,
column:3});
break;
case"maximize-button":a=new qx.ui.form.Button();
a.setFocusable(false);
a.addListener("execute",this._onMaximizeButtonClick,this);
this.getChildControl("captionbar").add(a,{row:0,
column:4});
break;
case"close-button":a=new qx.ui.form.Button();
a.setFocusable(false);
a.addListener("execute",this._onCloseButtonClick,this);
this.getChildControl("captionbar").add(a,{row:0,
column:6});
break}return a||this.base(arguments,c)},
_updateCaptionBar:function(){var a,b=this.getIcon(),c;
b?(this.getChildControl("icon").setSource(b),this._showChildControl("icon")):this._excludeChildControl("icon");
c=this.getCaption();
c?(this.getChildControl("title").setValue(c),this._showChildControl("title")):this._excludeChildControl("title");
this.getShowMinimize()?(this._showChildControl("minimize-button"),a=this.getChildControl("minimize-button"),this.getAllowMinimize()?a.resetEnabled():a.setEnabled(false)):this._excludeChildControl("minimize-button");
this.getShowMaximize()?(this.isMaximized()?(this._showChildControl("restore-button"),this._excludeChildControl("maximize-button")):(this._showChildControl("maximize-button"),this._excludeChildControl("restore-button")),a=this.getChildControl("maximize-button"),this.getAllowMaximize()?a.resetEnabled():a.setEnabled(false)):(this._excludeChildControl("maximize-button"),this._excludeChildControl("restore-button"));
this.getShowClose()?(this._showChildControl("close-button"),a=this.getChildControl("close-button"),this.getAllowClose()?a.resetEnabled():a.setEnabled(false)):this._excludeChildControl("close-button")},
close:function(){if(!this.isVisible())return;
this.fireNonBubblingEvent("beforeClose",qx.event.type.Event,[false,true])&&(this.hide(),this.fireEvent("close"))},
open:function(){this.show();
this.setActive(true);
this.focus()},
center:function(){var c=this.getLayoutParent(),a,d,e,b;
if(c){a=c.getBounds();
if(a){d=this.getSizeHint(),e=Math.round((a.width-d.width)/2),b=Math.round((a.height-d.height)/2);
b<0&&(b=0);
this.moveTo(e,b);
return}}this.warn("Centering depends on parent bounds!")},
maximize:function(){if(this.isMaximized())return;
var b=this.getLayoutParent(),a;
if(b!=null&&b.supportsMaximize())if(this.fireNonBubblingEvent("beforeMaximize",qx.event.type.Event,[false,true])){this.isVisible()||this.open();
a=this.getLayoutProperties();
this.__WOZ6A=a.left===undefined?0:a.left;
this.__QAVpS=a.top===undefined?0:a.top;
this.setLayoutProperties({left:null,
top:null,
edge:0});
this.addState("maximized");
this._updateCaptionBar();
this.fireEvent("maximize")}},
minimize:function(){if(!this.isVisible())return;
if(this.fireNonBubblingEvent("beforeMinimize",qx.event.type.Event,[false,true])){var a=this.getLayoutProperties();
this.__WOZ6A=a.left===undefined?0:a.left;
this.__QAVpS=a.top===undefined?0:a.top;
this.removeState("maximized");
this.hide();
this.fireEvent("minimize")}},
restore:function(){if(this.getMode()==="normal")return;
if(this.fireNonBubblingEvent("beforeRestore",qx.event.type.Event,[false,true])){this.isVisible()||this.open();
var a=this.__WOZ6A,b=this.__QAVpS;
this.setLayoutProperties({edge:null,
left:a,
top:b});
this.removeState("maximized");
this._updateCaptionBar();
this.fireEvent("restore")}},
moveTo:function(a,b){if(this.isMaximized())return;
this.setLayoutProperties({left:a,
top:b})},
isMaximized:function(){return this.hasState("maximized")},
getMode:function(){return this.isVisible()?this.isMaximized()?"maximized":"normal":"minimized"},
_applyActive:function(b,a){a?this.removeState("active"):this.addState("active")},
_getContentPaddingTarget:function(){return this.getChildControl("pane")},
_applyShowStatusbar:function(a,b){a?this._showChildControl("statusbar"):this._excludeChildControl("statusbar")},
_applyCaptionBarChange:function(a,b){this._updateCaptionBar()},
_applyStatus:function(b,c){var a=this.getChildControl("statusbar-text",true);
a&&a.setValue(b)},
_onWindowEventStop:function(a){a.stopPropagation()},
_onWindowMouseDown:function(a){this.setActive(true)},
_onWindowFocusOut:function(b){if(this.getModal())return;
var a=b.getRelatedTarget();
a!=null&&!qx.ui.core.Widget.contains(this,a)&&this.setActive(false)},
_onCaptionMouseDblClick:function(a){this.getAllowMaximize()&&(this.isMaximized()?this.restore():this.maximize())},
_onMinimizeButtonClick:function(a){this.minimize();
this.getChildControl("minimize-button").reset()},
_onRestoreButtonClick:function(a){this.restore();
this.getChildControl("restore-button").reset()},
_onMaximizeButtonClick:function(a){this.maximize();
this.getChildControl("maximize-button").reset()},
_onCloseButtonClick:function(a){this.close();
this.getChildControl("close-button").reset()}}});


// qx.bom.Stylesheet
//   - size: 1069 bytes
//   - modified: 2010-11-02T15:55:58
//   - names:
//       document, 4x
//       qx, 2x
//   - packages:
//       document.createElement, 1x
//       document.createTextNode, 1x
//       document.getElementsByTagName, 1x
//       qx.Class.define, 1x
//       qx.util.ResourceManager.getInstance, 1x
qx.Class.define("qx.bom.Stylesheet",{statics:{includeFile:function(c,b){b||(b=document);
var a=b.createElement("link"),d;
a.type="text/css";
a.rel="stylesheet";
a.href=qx.util.ResourceManager.getInstance().toUri(c);
d=b.getElementsByTagName("head")[0];
d.appendChild(a)},
createElement:function(b){var a=document.createElement("style");
a.type="text/css";
b&&a.appendChild(document.createTextNode(b));
document.getElementsByTagName("head")[0].appendChild(a);
return a.sheet},
addRule:function(a,b,c){a.insertRule(b+"{"+c+"}",a.cssRules.length)},
removeRule:function(b,d){for(var c=b.cssRules,e=c.length,a=e-1;
a>=0;
--a)c[a].selectorText==d&&b.deleteRule(a)},
removeAllRules:function(b){for(var d=b.cssRules,c=d.length,a=c-1;
a>=0;
a--)b.deleteRule(a)},
addImport:function(a,b){a.insertRule("@import \""+b+"\";",a.cssRules.length)},
removeImport:function(b,e){for(var c=b.cssRules,d=c.length,a=d-1;
a>=0;
a--)c[a].href==e&&b.deleteRule(a)},
removeAllImports:function(c){for(var b=c.cssRules,d=b.length,a=d-1;
a>=0;
a--)b[a].type==b[a].IMPORT_RULE&&c.deleteRule(a)}}});


// qx.html.Root
//   - size: 255 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.html.Element, 1x
//       qx.html.Element._modified, 1x
qx.Class.define("qx.html.Root",{extend:qx.html.Element,
construct:function(a){this.base(arguments);
a!=null&&this.useElement(a)},
members:{useElement:function(a){this.base(arguments,a);
this.setRoot(true);
qx.html.Element._modified[this.$$hash]=this}}});


// qx.html.Blocker
//   - size: 1055 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.html.Element, 1x
//       qx.theme.manager.Color.getInstance, 1x
qx.Class.define("qx.html.Blocker",{extend:qx.html.Element,
construct:function(a,c){var a=a?qx.theme.manager.Color.getInstance().resolve(a):null,b={position:"absolute",
width:"100%",
height:"100%",
opacity:c||0,
backgroundColor:a};
this.base(arguments,"div",b);
this.addListener("mousedown",this._stopPropagation,this);
this.addListener("mouseup",this._stopPropagation,this);
this.addListener("click",this._stopPropagation,this);
this.addListener("dblclick",this._stopPropagation,this);
this.addListener("mousemove",this._stopPropagation,this);
this.addListener("mouseover",this._stopPropagation,this);
this.addListener("mouseout",this._stopPropagation,this);
this.addListener("mousewheel",this._stopPropagation,this);
this.addListener("contextmenu",this._stopPropagation,this);
this.addListener("appear",this.__3bSmS,this);
this.addListener("disappear",this.__3bSmS,this)},
members:{_stopPropagation:function(a){a.stopPropagation()},
__3bSmS:function(){var a=this.getStyle("cursor");
this.setStyle("cursor",null,true);
this.setStyle("cursor",a,true)}}});


// qx.ui.layout.Basic
//   - size: 813 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.layout.Abstract, 1x
qx.Class.define("qx.ui.layout.Basic",{extend:qx.ui.layout.Abstract,
members:{verifyLayoutProperty:function(c,a,b){this.assert(a=="left"||a=="top","The property '"+a+"' is not supported by the Basic layout!");
this.assertInteger(b)},
renderLayout:function(i,j){for(var f=this._getLayoutChildren(),a,b,c,e,g,d=0,h=f.length;
d<h;
d++)a=f[d],b=a.getSizeHint(),c=a.getLayoutProperties(),e=(c.left||0)+a.getMarginLeft(),g=(c.top||0)+a.getMarginTop(),a.renderLayout(e,g,b.width,b.height)},
_computeSizeHint:function(){for(var i=this._getLayoutChildren(),a,b,e,c=0,d=0,h,g,f=0,j=i.length;
f<j;
f++)a=i[f],b=a.getSizeHint(),e=a.getLayoutProperties(),h=b.width+(e.left||0)+a.getMarginLeft()+a.getMarginRight(),g=b.height+(e.top||0)+a.getMarginTop()+a.getMarginBottom(),h>c&&(c=h),g>d&&(d=g);
return{width:c,
height:d}}}});


// qx.ui.layout.Canvas
//   - size: 2451 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Math, 10x
//       parseFloat, 6x
//       qx, 9x
//   - packages:
//       Math.max, 4x
//       Math.round, 6x
//       qx.Class.define, 1x
//       qx.lang.Type.isString, 5x
//       qx.ui.layout.Abstract, 1x
//       qx.ui.layout.Util.PERCENT_VALUE, 2x
qx.Class.define("qx.ui.layout.Canvas",{extend:qx.ui.layout.Abstract,
members:{verifyLayoutProperty:function(d,b,a){var c={top:1,
left:1,
bottom:1,
right:1,
width:1,
height:1,
edge:1};
this.assert(c[b]==1,"The property '"+b+"' is not supported by the Canvas layout!");
b=="width"||b=="height"?this.assertMatch(a,qx.ui.layout.Util.PERCENT_VALUE):typeof a==="number"?this.assertInteger(a):qx.lang.Type.isString(a)?this.assertMatch(a,qx.ui.layout.Util.PERCENT_VALUE):this.fail("Bad format of layout property '"+b+"': "+a+". The value must be either an integer or an percent string.")},
renderLayout:function(m,l){for(var q=this._getLayoutChildren(),h,a,d,e,f,i,g,b,c,j,o,p,k,n=0,r=q.length;
n<r;
n++)h=q[n],a=h.getSizeHint(),d=h.getLayoutProperties(),j=h.getMarginTop(),o=h.getMarginRight(),p=h.getMarginBottom(),k=h.getMarginLeft(),e=d.left!=null?d.left:d.edge,qx.lang.Type.isString(e)&&(e=Math.round(parseFloat(e)*m/100)),i=d.right!=null?d.right:d.edge,qx.lang.Type.isString(i)&&(i=Math.round(parseFloat(i)*m/100)),f=d.top!=null?d.top:d.edge,qx.lang.Type.isString(f)&&(f=Math.round(parseFloat(f)*l/100)),g=d.bottom!=null?d.bottom:d.edge,qx.lang.Type.isString(g)&&(g=Math.round(parseFloat(g)*l/100)),e!=null&&i!=null?(b=m-e-i-k-o,b<a.minWidth?b=a.minWidth:b>a.maxWidth&&(b=a.maxWidth),e+=k):(b=d.width,b==null?b=a.width:(b=Math.round(parseFloat(b)*m/100),b<a.minWidth?b=a.minWidth:b>a.maxWidth&&(b=a.maxWidth)),i!=null?e=m-b-i-o-k:e==null?e=k:e+=k),f!=null&&g!=null?(c=l-f-g-j-p,c<a.minHeight?c=a.minHeight:c>a.maxHeight&&(c=a.maxHeight),f+=j):(c=d.height,c==null?c=a.height:(c=Math.round(parseFloat(c)*l/100),c<a.minHeight?c=a.minHeight:c>a.maxHeight&&(c=a.maxHeight)),g!=null?f=l-c-g-p-j:f==null?f=j:f+=j),h.renderLayout(e,f,b,c)},
_computeSizeHint:function(){for(var o=0,m=0,p=0,l=0,h,i,j,k,r=this._getLayoutChildren(),b,a,f,c,e,g,d,n=0,t=r.length,s,q;
n<t;
n++){b=r[n];
a=b.getLayoutProperties();
f=b.getSizeHint();
s=b.getMarginLeft()+b.getMarginRight(),q=b.getMarginTop()+b.getMarginBottom();
h=f.width+s;
i=f.minWidth+s;
c=a.left!=null?a.left:a.edge;
c&&typeof c==="number"&&(h+=c,i+=c);
g=a.right!=null?a.right:a.edge;
g&&typeof g==="number"&&(h+=g,i+=g);
o=Math.max(o,h);
m=Math.max(m,i);
j=f.height+q;
k=f.minHeight+q;
e=a.top!=null?a.top:a.edge;
e&&typeof e==="number"&&(j+=e,k+=e);
d=a.bottom!=null?a.bottom:a.edge;
d&&typeof d==="number"&&(j+=d,k+=d);
p=Math.max(p,j);
l=Math.max(l,k)}return{width:o,
minWidth:m,
height:p,
minHeight:l}}}});


// qx.ui.window.MDesktop
//   - size: 1953 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       qx, 8x
//   - packages:
//       qx.Class.isDefined, 2x
//       qx.Mixin.define, 1x
//       qx.lang.Array.contains, 1x
//       qx.lang.Array.remove, 1x
//       qx.ui.window.Window, 2x
//       qx.ui.window.Window.DEFAULT_MANAGER_CLASS, 1x
qx.Mixin.define("qx.ui.window.MDesktop",{properties:{activeWindow:{check:"qx.ui.window.Window",
apply:"_applyActiveWindow",
init:null,
nullable:true}},
members:{__u6Upa:null,
__ugn3e:null,
getWindowManager:function(){this.__ugn3e||this.setWindowManager(new qx.ui.window.Window.DEFAULT_MANAGER_CLASS());
return this.__ugn3e},
supportsMaximize:function(){return true},
setWindowManager:function(a){this.__ugn3e&&this.__ugn3e.setDesktop(null);
a.setDesktop(this);
this.__ugn3e=a},
_onChangeActive:function(a){a.getData()?this.setActiveWindow(a.getTarget()):this.getActiveWindow()==a.getTarget()&&this.setActiveWindow(null)},
_applyActiveWindow:function(a,b){this.getWindowManager().changeActiveWindow(a,b);
this.getWindowManager().updateStack()},
_onChangeModal:function(a){this.getWindowManager().updateStack()},
_onChangeVisibility:function(){this.getWindowManager().updateStack()},
_afterAddChild:function(a){qx.Class.isDefined("qx.ui.window.Window")&&a instanceof qx.ui.window.Window&&this._addWindow(a)},
_addWindow:function(a){qx.lang.Array.contains(this.getWindows(),a)||(this.getWindows().push(a),a.addListener("changeActive",this._onChangeActive,this),a.addListener("changeModal",this._onChangeModal,this),a.addListener("changeVisibility",this._onChangeVisibility,this));
a.getActive()&&this.setActiveWindow(a);
this.getWindowManager().updateStack()},
_afterRemoveChild:function(a){qx.Class.isDefined("qx.ui.window.Window")&&a instanceof qx.ui.window.Window&&this._removeWindow(a)},
_removeWindow:function(a){qx.lang.Array.remove(this.getWindows(),a);
a.removeListener("changeActive",this._onChangeActive,this);
a.removeListener("changeModal",this._onChangeModal,this);
a.removeListener("changeVisibility",this._onChangeVisibility,this);
this.getWindowManager().updateStack()},
getWindows:function(){this.__u6Upa||(this.__u6Upa=[]);
return this.__u6Upa}},
destruct:function(){this._disposeArray("__windows");
this._disposeObjects("__manager")}});


// qx.ui.root.Abstract
//   - size: 1413 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       qx, 10x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Stylesheet, 1x
//       qx.bom.element.Cursor.compile, 1x
//       qx.ui.core.FocusHandler.getInstance, 1x
//       qx.ui.core.MBlocker, 1x
//       qx.ui.core.MChildrenHandling, 1x
//       qx.ui.core.MChildrenHandling.remap, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.queue.Visibility.add, 1x
//       qx.ui.window.MDesktop, 1x
qx.Class.define("qx.ui.root.Abstract",{type:"abstract",
extend:qx.ui.core.Widget,
include:[qx.ui.core.MChildrenHandling,qx.ui.core.MBlocker,qx.ui.window.MDesktop],
construct:function(){this.base(arguments);
qx.ui.core.FocusHandler.getInstance().addRoot(this);
qx.ui.core.queue.Visibility.add(this);
this.initNativeHelp();
this.setEnabled(true)},
properties:{appearance:{refine:true,
init:"root"},
focusable:{refine:true,
init:true},
globalCursor:{check:"String",
nullable:true,
themeable:true,
apply:"_applyGlobalCursor",
event:"changeGlobalCursor"},
nativeContextMenu:{refine:true,
init:false},
nativeHelp:{check:"Boolean",
init:false,
apply:"_applyNativeHelp"}},
members:{__cmYysm:null,
isRootWidget:function(){return true},
getLayout:function(){return this._getLayout()},
_applyGlobalCursor:function(c,d){var b=qx.bom.Stylesheet,a=this.__cmYysm;
a||(this.__cmYysm=a=b.createElement());
b.removeAllRules(a);
c&&b.addRule(a,"*",qx.bom.element.Cursor.compile(c).replace(";","")+" !important")},
_applyNativeContextMenu:function(a,b){a?this.removeListener("contextmenu",this._onNativeContextMenu,this,true):this.addListener("contextmenu",this._onNativeContextMenu,this,true)},
_onNativeContextMenu:function(a){if(a.getTarget().getNativeContextMenu())return;
a.preventDefault()},
_applyNativeHelp:function(){}},
destruct:function(){this.__cmYysm=null},
defer:function(b,a){qx.ui.core.MChildrenHandling.remap(a)}});


// qx.ui.root.Application
//   - size: 1564 bytes
//   - modified: 2010-11-02T16:06:56
//   - names:
//       Error, 2x
//       qx, 11x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Viewport.getHeight, 1x
//       qx.bom.Viewport.getWidth, 1x
//       qx.dom.Node.getWindow, 1x
//       qx.event.Registration.addListener, 1x
//       qx.html.Root, 1x
//       qx.ui.core.FocusHandler.getInstance, 1x
//       qx.ui.core.queue.Layout.add, 2x
//       qx.ui.layout.Canvas, 1x
//       qx.ui.root.Abstract, 1x
qx.Class.define("qx.ui.root.Application",{extend:qx.ui.root.Abstract,
construct:function(a){this.__qOaV1=qx.dom.Node.getWindow(a);
this.__gJpI1=a;
this.base(arguments);
qx.event.Registration.addListener(this.__qOaV1,"resize",this._onResize,this);
this._setLayout(new qx.ui.layout.Canvas());
qx.ui.core.queue.Layout.add(this);
qx.ui.core.FocusHandler.getInstance().connectTo(this);
this.getContentElement().disableScrolling()},
members:{__qOaV1:null,
__gJpI1:null,
_createContainerElement:function(){var c=this.__gJpI1,b=c.documentElement.style,a=c.body.style,e,d;
b.overflow=a.overflow="hidden";
b.padding=b.margin=a.padding=a.margin="0px";
b.width=b.height=a.width=a.height="100%";
e=c.createElement("div");
c.body.appendChild(e);
d=new qx.html.Root(e);
d.setStyle("position","absolute");
d.setAttribute("$$widget",this.toHashCode());
return d},
_onResize:function(a){qx.ui.core.queue.Layout.add(this)},
_computeSizeHint:function(){var b=qx.bom.Viewport.getWidth(this.__qOaV1),a=qx.bom.Viewport.getHeight(this.__qOaV1);
return{minWidth:b,
width:b,
maxWidth:b,
minHeight:a,
height:a,
maxHeight:a}},
_applyPadding:function(b,c,a){if(b&&(a=="paddingTop"||a=="paddingLeft"))throw new Error("The root widget does not support 'left', or 'top' paddings!");
this.base(arguments,b,c,a)},
_applyDecorator:function(a,c){this.base(arguments,a,c);
if(!a)return;
var b=this.getDecoratorElement().getInsets();
if(b.left||b.top)throw new Error("The root widget does not support decorators with 'left', or 'top' insets!")}},
destruct:function(){this.__qOaV1=this.__gJpI1=null}});


// qx.ui.root.Page
//   - size: 1538 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 2x
//       qx, 9x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Document.getHeight, 1x
//       qx.bom.Document.getWidth, 1x
//       qx.html.Element, 1x
//       qx.html.Root, 1x
//       qx.ui.core.FocusHandler.getInstance, 1x
//       qx.ui.core.queue.Layout.add, 1x
//       qx.ui.layout.Basic, 1x
//       qx.ui.root.Abstract, 1x
qx.Class.define("qx.ui.root.Page",{extend:qx.ui.root.Abstract,
construct:function(a){this.__gJpI1=a;
this.base(arguments);
this._setLayout(new qx.ui.layout.Basic());
this.setZIndex(10000);
qx.ui.core.queue.Layout.add(this);
this.addListener("resize",this.__yXjPe,this);
qx.ui.core.FocusHandler.getInstance().connectTo(this)},
members:{__mXur6:null,
__gJpI1:null,
_createContainerElement:function(){var b=this.__gJpI1.createElement("div"),a;
this.__gJpI1.body.appendChild(b);
a=new qx.html.Root(b);
a.setStyles({position:"absolute",
textAlign:"left"});
a.setAttribute("$$widget",this.toHashCode());
a.setAttribute("qxIsRootPage",1);
return a},
_createContentElement:function(){return new qx.html.Element("div")},
_computeSizeHint:function(){var b=qx.bom.Document.getWidth(this._window),a=qx.bom.Document.getHeight(this._window);
return{minWidth:b,
width:b,
maxWidth:b,
minHeight:a,
height:a,
maxHeight:a}},
__yXjPe:function(a){this.getContainerElement().setStyles({width:0,
height:0});
this.getContentElement().setStyles({width:0,
height:0})},
supportsMaximize:function(){return false},
_applyPadding:function(b,c,a){if(b&&(a=="paddingTop"||a=="paddingLeft"))throw new Error("The root widget does not support 'left', or 'top' paddings!");
this.base(arguments,b,c,a)},
_applyDecorator:function(a,c){this.base(arguments,a,c);
if(!a)return;
var b=this.getDecoratorElement().getInsets();
if(b.left||b.top)throw new Error("The root widget does not support decorators with 'left', or 'top' insets!")}},
destruct:function(){this.__gJpI1=null}});


// qx.ui.core.Blocker
//   - size: 4702 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 14x
//       window, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.Class.isDefined, 2x
//       qx.bom.Element.activate, 1x
//       qx.bom.Element.focus, 1x
//       qx.core.Object, 1x
//       qx.dom.Node.getDocument, 1x
//       qx.event.Registration.getManager, 1x
//       qx.event.Timer, 1x
//       qx.event.handler.Focus, 1x
//       qx.html.Blocker, 1x
//       qx.theme.manager.Color.getInstance, 1x
//       qx.ui.root.Application, 1x
//       qx.ui.root.Page, 1x
qx.Class.define("qx.ui.core.Blocker",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
this._widget=a;
this._isPageRoot=qx.Class.isDefined("qx.ui.root.Page")&&a instanceof qx.ui.root.Page;
this._isPageRoot&&a.addListener("resize",this.__yXjPe,this);
qx.Class.isDefined("qx.ui.root.Application")&&a instanceof qx.ui.root.Application&&this.setKeepBlockerActive(true);
this.__9hYDs=[];
this.__2x0gW=[];
this.__bRCHEn=[]},
properties:{color:{check:"Color",
init:null,
nullable:true,
apply:"_applyColor",
themeable:true},
opacity:{check:"Number",
init:1,
apply:"_applyOpacity",
themeable:true},
keepBlockerActive:{check:"Boolean",
init:false}},
members:{__ukeJN:null,
__VqEKk:0,
__bajdSW:null,
__bRCHEn:null,
__9hYDs:null,
__2x0gW:null,
__VI41X:null,
__mXur6:null,
_isPageRoot:false,
_widget:null,
__yXjPe:function(b){var a=b.getData();
this.isContentBlocked()&&this.getContentBlockerElement().setStyles({width:a.width,
height:a.height});
this.isBlocked()&&this.getBlockerElement().setStyles({width:a.width,
height:a.height})},
_applyColor:function(a,c){var b=qx.theme.manager.Color.getInstance().resolve(a);
this.__bpNJL3("backgroundColor",b)},
_applyOpacity:function(a,b){this.__bpNJL3("opacity",a)},
__bpNJL3:function(d,c){var a=[],b;
this.__ukeJN&&a.push(this.__ukeJN);
this.__bajdSW&&a.push(this.__bajdSW);
for(b=0;
b<a.length;
b++)a[b].setStyle(d,c)},
_backupActiveWidget:function(){var a=qx.event.Registration.getManager(window).getHandler(qx.event.handler.Focus);
this.__9hYDs.push(a.getActive());
this.__2x0gW.push(a.getFocus());
this._widget.isFocusable()&&this._widget.focus()},
_restoreActiveWidget:function(){var c=this.__9hYDs.length,a,b;
if(c>0){a=this.__9hYDs[c-1];
a&&qx.bom.Element.activate(a);
this.__9hYDs.pop()}b=this.__2x0gW.length;
if(b>0){a=this.__2x0gW[b-1];
a&&qx.bom.Element.focus(this.__2x0gW[b-1]);
this.__2x0gW.pop()}},
__bY0g2Z:function(){return new qx.html.Blocker(this.getColor(),this.getOpacity())},
getBlockerElement:function(){this.__ukeJN||(this.__ukeJN=this.__bY0g2Z(),this.__ukeJN.setStyle("zIndex",15),this._widget.getContainerElement().add(this.__ukeJN),this.__ukeJN.exclude());
return this.__ukeJN},
block:function(){this.__VqEKk++;
if(this.__VqEKk<2){this._backupActiveWidget();
var a=this.getBlockerElement();
a.include();
a.activate();
a.addListener("deactivate",this.__cluq36,this);
a.addListener("keypress",this.__VPGb4,this);
a.addListener("keydown",this.__VPGb4,this);
a.addListener("keyup",this.__VPGb4,this)}},
isBlocked:function(){return this.__VqEKk>0},
unblock:function(){if(!this.isBlocked())return;
this.__VqEKk--;
this.__VqEKk<1&&(this.__uQpsL(),this.__VqEKk=0)},
forceUnblock:function(){if(!this.isBlocked())return;
this.__VqEKk=0;
this.__uQpsL()},
__uQpsL:function(){this._restoreActiveWidget();
var a=this.getBlockerElement();
a.removeListener("deactivate",this.__cluq36,this);
a.removeListener("keypress",this.__VPGb4,this);
a.removeListener("keydown",this.__VPGb4,this);
a.removeListener("keyup",this.__VPGb4,this);
a.exclude()},
getContentBlockerElement:function(){this.__bajdSW||(this.__bajdSW=this.__bY0g2Z(),this._widget.getContentElement().add(this.__bajdSW),this.__bajdSW.exclude());
return this.__bajdSW},
blockContent:function(b){var a=this.getContentBlockerElement();
a.setStyle("zIndex",b);
this.__bRCHEn.push(b);
this.__bRCHEn.length<2&&(a.include(),this._isPageRoot&&(this.__mXur6||(this.__mXur6=new qx.event.Timer(300),this.__mXur6.addListener("interval",this.__PBksc,this)),this.__mXur6.start(),this.__PBksc()))},
isContentBlocked:function(){return this.__bRCHEn.length>0},
unblockContent:function(){if(!this.isContentBlocked())return;
this.__bRCHEn.pop();
var b=this.__bRCHEn[this.__bRCHEn.length-1],a=this.getContentBlockerElement();
a.setStyle("zIndex",b);
this.__bRCHEn.length<1&&(this.__baqm9Y(),this.__bRCHEn=[])},
forceUnblockContent:function(){if(!this.isContentBlocked())return;
this.__bRCHEn=[];
var a=this.getContentBlockerElement();
a.setStyle("zIndex",null);
this.__baqm9Y()},
__baqm9Y:function(){this.getContentBlockerElement().exclude();
this._isPageRoot&&this.__mXur6.stop()},
__PBksc:function(){var b=this._widget.getContainerElement().getDomElement(),a=qx.dom.Node.getDocument(b);
this.getContentBlockerElement().setStyles({height:a.documentElement.scrollHeight+"px",
width:a.documentElement.scrollWidth+"px"})},
__VPGb4:function(a){a.getKeyIdentifier()=="Tab"&&a.stop()},
__cluq36:function(){this.getKeepBlockerActive()&&this.getBlockerElement().activate()}},
destruct:function(){this._isPageRoot&&this._widget.removeListener("resize",this.__yXjPe,this);
this._disposeObjects("__contentBlocker","__blocker","__timer");
this.__VI41X=this.__9hYDs=this.__2x0gW=this._widget=this.__bRCHEn=null}});


// qx.ui.core.MNativeOverflow
//   - size: 465 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Mixin.define, 1x
qx.Mixin.define("qx.ui.core.MNativeOverflow",{properties:{overflowX:{check:["hidden","visible","scroll","auto"],
nullable:true,
apply:"_applyOverflowX"},
overflowY:{check:["hidden","visible","scroll","auto"],
nullable:true,
apply:"_applyOverflowY"},
overflow:{group:["overflowX","overflowY"]}},
members:{_applyOverflowX:function(a){this.getContentElement().setStyle("overflowX",a)},
_applyOverflowY:function(a){this.getContentElement().setStyle("overflowY",a)}}});


// qx.ui.form.MForm
//   - size: 505 bytes
//   - modified: 2010-09-30T14:20:20
//   - names:
//       qx, 1x
//   - packages:
//       qx.Mixin.define, 1x
qx.Mixin.define("qx.ui.form.MForm",{construct:function(){},
properties:{valid:{check:"Boolean",
init:true,
apply:"_applyValid",
event:"changeValid"},
required:{check:"Boolean",
init:false,
event:"changeRequired"},
invalidMessage:{check:"String",
init:"",
event:"changeInvalidMessage"},
requiredInvalidMessage:{check:"String",
nullable:true,
event:"changeInvalidMessage"}},
members:{_applyValid:function(a,b){a?this.removeState("invalid"):this.addState("invalid")},
__7AESY:null},
destruct:function(){}});


// qx.theme.Appearance
//   - size: 27352 bytes
//   - modified: 2010-11-02T19:08:00
//   - names:
//       qx, 1x
//       undefined, 50x
//   - packages:
//       qx.Theme.define, 1x
qx.Theme.define("qx.theme.Appearance",{appearances:{widget:{},
root:{style:function(a){return{backgroundColor:"background-application",
textColor:"text-label",
font:"default"}}},
label:{style:function(a){return{textColor:a.disabled?"text-disabled":undefined}}},
"move-frame":{style:function(a){return{decorator:"main"}}},
"resize-frame":"move-frame",
"dragdrop-cursor":{style:function(b){var a="nodrop";
b.copy?a="copy":b.move?a="move":b.alias&&(a="alias");
return{source:"qx/decoration/cursors/"+a+".gif",
position:"right-top",
offset:[2,16,2,6]}}},
image:{style:function(a){return{opacity:!a.replacement&&a.disabled?.3:1}}},
atom:{},
"atom/label":"label",
"atom/icon":"image",
popup:{style:function(a){return{decorator:"main",
backgroundColor:"background-light",
shadow:"shadow-popup"}}},
"button-frame":{alias:"atom",
style:function(a){var b,c;
a.checked&&a.focused&&!a.inner?(b="button-checked-focused",c=undefined):a.disabled?(b="button-disabled",c=undefined):a.pressed?(b="button-pressed",c="text-hovered"):a.checked?(b="button-checked",c=undefined):a.hovered?(b="button-hovered",c="text-hovered"):a.preselected&&a.focused&&!a.inner?(b="button-preselected-focused",c="text-hovered"):a.preselected?(b="button-preselected",c="text-hovered"):a.focused&&!a.inner?(b="button-focused",c=undefined):(b="button",c=undefined);
return{decorator:b,
textColor:c,
shadow:a.invalid&&!a.disabled?"button-invalid-shadow":undefined}}},
"button-frame/image":{style:function(a){return{opacity:!a.replacement&&a.disabled?.5:1}}},
button:{alias:"button-frame",
include:"button-frame",
style:function(a){return{padding:[2,8],
center:true}}},
"hover-button":{alias:"atom",
include:"atom",
style:function(a){return{decorator:a.hovered?"selected":undefined,
textColor:a.hovered?"text-selected":undefined}}},
splitbutton:{},
"splitbutton/button":"button",
"splitbutton/arrow":{alias:"button",
include:"button",
style:function(a){return{icon:"qx/decoration/arrows/down.png",
padding:2,
marginLeft:1}}},
checkbox:{alias:"atom",
style:function(a){var b,c;
b=a.checked&&a.focused?"checkbox-checked-focused":a.checked&&a.disabled?"checkbox-checked-disabled":a.checked&&a.pressed?"checkbox-checked-pressed":a.checked&&a.hovered?"checkbox-checked-hovered":a.checked?"checkbox-checked":a.focused?"checkbox-focused":a.pressed?"checkbox-pressed":a.hovered?"checkbox-hovered":"checkbox";
c=a.invalid&&!a.disabled?"-invalid":"";
return{icon:"qx/decoration/form/"+b+c+".png",
gap:6}}},
radiobutton:{alias:"atom",
style:function(a){var b,c;
b=a.checked&&a.focused?"radiobutton-checked-focused":a.checked&&a.disabled?"radiobutton-checked-disabled":a.checked&&a.pressed?"radiobutton-checked-pressed":a.checked&&a.hovered?"radiobutton-checked-hovered":a.checked?"radiobutton-checked":a.focused?"radiobutton-focused":a.pressed?"radiobutton-pressed":a.hovered?"radiobutton-hovered":"radiobutton";
c=a.invalid&&!a.disabled?"-invalid":"";
return{icon:"qx/decoration/form/"+b+c+".png",
gap:6}}},
textfield:{style:function(b){var a,f=!!b.focused,e=!!b.invalid,d=!!b.disabled,c;
a=f&&e&&!d?"input-focused-invalid":f&&!e&&!d?"input-focused":d?"input-disabled":!f&&e&&!d?"border-invalid":"input";
c=b.disabled?"text-disabled":b.showingPlaceholder?"text-placeholder":"text-input";
return{decorator:a,
padding:[2,4,1],
textColor:c}}},
textarea:{include:"textfield",
style:function(a){return{padding:4}}},
spinner:{style:function(e){var a,d=!!e.focused,c=!!e.invalid,b=!!e.disabled;
a=d&&c&&!b?"input-focused-invalid":d&&!c&&!b?"input-focused":b?"input-disabled":!d&&c&&!b?"border-invalid":"input";
return{decorator:a}}},
"spinner/textfield":{style:function(a){return{marginRight:2,
padding:[2,4,1],
textColor:a.disabled?"text-disabled":"text-input"}}},
"spinner/upbutton":{alias:"button-frame",
include:"button-frame",
style:function(a){return{icon:"qx/decoration/arrows/up-small.png",
padding:a.pressed?[2,2,0,4]:[1,3,1,3],
shadow:undefined}}},
"spinner/downbutton":{alias:"button-frame",
include:"button-frame",
style:function(a){return{icon:"qx/decoration/arrows/down-small.png",
padding:a.pressed?[2,2,0,4]:[1,3,1,3],
shadow:undefined}}},
datefield:"combobox",
"datefield/button":{alias:"combobox/button",
include:"combobox/button",
style:function(a){return{icon:"qx/icon/16/apps/office-calendar.png",
padding:[0,3],
decorator:undefined}}},
"datefield/textfield":"combobox/textfield",
"datefield/list":{alias:"datechooser",
include:"datechooser",
style:function(a){return{decorator:undefined}}},
groupbox:{style:function(a){return{legendPosition:"top"}}},
"groupbox/legend":{alias:"atom",
style:function(a){return{padding:[1,0,1,4],
textColor:a.invalid?"invalid":"text-title",
font:"bold"}}},
"groupbox/frame":{style:function(a){return{padding:12,
decorator:"group"}}},
"check-groupbox":"groupbox",
"check-groupbox/legend":{alias:"checkbox",
include:"checkbox",
style:function(a){return{padding:[1,0,1,4],
textColor:a.invalid?"invalid":"text-title",
font:"bold"}}},
"radio-groupbox":"groupbox",
"radio-groupbox/legend":{alias:"radiobutton",
include:"radiobutton",
style:function(a){return{padding:[1,0,1,4],
textColor:a.invalid?"invalid":"text-title",
font:"bold"}}},
scrollarea:{style:function(a){return{minWidth:50,
minHeight:50}}},
"scrollarea/corner":{style:function(a){return{backgroundColor:"background-application"}}},
"scrollarea/pane":"widget",
"scrollarea/scrollbar-x":"scrollbar",
"scrollarea/scrollbar-y":"scrollbar",
scrollbar:{style:function(a){if(a["native"])return{};
return{width:a.horizontal?undefined:16,
height:a.horizontal?16:undefined,
decorator:a.horizontal?"scrollbar-horizontal":"scrollbar-vertical",
padding:1}}},
"scrollbar/slider":{alias:"slider",
style:function(a){return{padding:a.horizontal?[0,1,0,1]:[1,0,1,0]}}},
"scrollbar/slider/knob":{include:"button-frame",
style:function(a){var b=a.horizontal?"scrollbar-slider-horizontal":"scrollbar-slider-vertical";
a.disabled&&(b+="-disabled");
return{decorator:b,
minHeight:a.horizontal?undefined:9,
minWidth:a.horizontal?9:undefined}}},
"scrollbar/button":{alias:"button-frame",
include:"button-frame",
style:function(b){var a="qx/decoration/scrollbar/scrollbar-";
a+=b.left?"left.png":b.right?"right.png":b.up?"up.png":"down.png";
return b.left||b.right?{padding:[0,0,0,b.left?3:4],
icon:a,
width:15,
height:14}:{padding:[0,0,0,2],
icon:a,
width:14,
height:15}}},
"scrollbar/button-begin":"scrollbar/button",
"scrollbar/button-end":"scrollbar/button",
slider:{style:function(e){var a,d=!!e.focused,c=!!e.invalid,b=!!e.disabled;
a=d&&c&&!b?"input-focused-invalid":d&&!c&&!b?"input-focused":b?"input-disabled":!d&&c&&!b?"border-invalid":"input";
return{decorator:a}}},
"slider/knob":{include:"button-frame",
style:function(a){return{decorator:a.disabled?"scrollbar-slider-horizontal-disabled":"scrollbar-slider-horizontal",
shadow:undefined,
height:14,
width:14}}},
list:{alias:"scrollarea",
style:function(e){var a,d=!!e.focused,c=!!e.invalid,b=!!e.disabled;
a=d&&c&&!b?"input-focused-invalid":d&&!c&&!b?"input-focused":b?"input-disabled":!d&&c&&!b?"border-invalid":"input";
return{backgroundColor:"background-light",
decorator:a}}},
"list/pane":"widget",
listitem:{alias:"atom",
style:function(a){var b;
b=a.dragover?a.selected?"selected-dragover":"dragover":a.selected?"selected":undefined;
return{padding:a.dragover?[4,4,2,4]:4,
textColor:a.selected?"text-selected":undefined,
decorator:b}}},
slidebar:{},
"slidebar/scrollpane":{},
"slidebar/content":{},
"slidebar/button-forward":{alias:"button-frame",
include:"button-frame",
style:function(a){return{padding:5,
center:true,
icon:a.vertical?"qx/decoration/arrows/down.png":"qx/decoration/arrows/right.png"}}},
"slidebar/button-backward":{alias:"button-frame",
include:"button-frame",
style:function(a){return{padding:5,
center:true,
icon:a.vertical?"qx/decoration/arrows/up.png":"qx/decoration/arrows/left.png"}}},
tabview:{style:function(a){return{contentPadding:16}}},
"tabview/bar":{alias:"slidebar",
style:function(a){var b={marginBottom:a.barTop?-1:0,
marginTop:a.barBottom?-4:0,
marginLeft:a.barRight?-3:0,
marginRight:a.barLeft?-1:0,
paddingTop:0,
paddingRight:0,
paddingBottom:0,
paddingLeft:0};
a.barTop||a.barBottom?(b.paddingLeft=5,b.paddingRight=7):(b.paddingTop=5,b.paddingBottom=7);
return b}},
"tabview/bar/button-forward":{include:"slidebar/button-forward",
alias:"slidebar/button-forward",
style:function(a){return a.barTop||a.barBottom?{marginTop:2,
marginBottom:2,
marginLeft:0,
marginRight:0}:{marginLeft:2,
marginRight:2,
marginTop:0,
marginBottom:0}}},
"tabview/bar/button-backward":{include:"slidebar/button-backward",
alias:"slidebar/button-backward",
style:function(a){return a.barTop||a.barBottom?{marginTop:2,
marginBottom:2,
marginLeft:0,
marginRight:0}:{marginLeft:2,
marginRight:2,
marginTop:0,
marginBottom:0}}},
"tabview/bar/scrollpane":{},
"tabview/pane":{style:function(a){return{decorator:"tabview-pane",
minHeight:100,
marginBottom:a.barBottom?-1:0,
marginTop:a.barTop?-1:0,
marginLeft:a.barLeft?-1:0,
marginRight:a.barRight?-1:0}}},
"tabview-page":"widget",
"tabview-page/button":{alias:"atom",
style:function(a){var b,c=0,g=0,f=0,e=0,d=0;
a.checked?a.barTop?(b="tabview-page-button-top-active",c=[6,14],e=a.firstTab?0:-5,d=a.lastTab?0:-5):a.barBottom?(b="tabview-page-button-bottom-active",c=[6,14],e=a.firstTab?0:-5,d=a.lastTab?0:-5):a.barRight?(b="tabview-page-button-right-active",c=[6,13],g=a.firstTab?0:-5,f=a.lastTab?0:-5):(b="tabview-page-button-left-active",c=[6,13],g=a.firstTab?0:-5,f=a.lastTab?0:-5):a.barTop?(b="tabview-page-button-top-inactive",c=[4,10],g=4,e=a.firstTab?5:1,d=1):a.barBottom?(b="tabview-page-button-bottom-inactive",c=[4,10],f=4,e=a.firstTab?5:1,d=1):a.barRight?(b="tabview-page-button-right-inactive",c=[4,10],d=5,g=a.firstTab?5:1,f=1,e=1):(b="tabview-page-button-left-inactive",c=[4,10],e=5,g=a.firstTab?5:1,f=1,d=1);
return{zIndex:a.checked?10:5,
decorator:b,
padding:c,
marginTop:g,
marginBottom:f,
marginLeft:e,
marginRight:d,
textColor:a.checked?"text-active":"text-inactive"}}},
"tabview-page/button/label":{alias:"label",
style:function(a){return{padding:[0,1,0,1]}}},
"tabview-page/button/close-button":{alias:"atom",
style:function(a){return{icon:"qx/icon/16/actions/window-close.png"}}},
toolbar:{style:function(a){return{decorator:"toolbar",
spacing:2}}},
"toolbar/part":{style:function(a){return{decorator:"toolbar-part",
spacing:2}}},
"toolbar/part/container":{style:function(a){return{paddingLeft:2,
paddingRight:2}}},
"toolbar/part/handle":{style:function(a){return{source:"qx/decoration/toolbar/toolbar-handle-knob.gif",
marginLeft:3,
marginRight:3}}},
"toolbar-button":{alias:"atom",
style:function(a){return{marginTop:2,
marginBottom:2,
padding:(a.pressed||a.checked||a.hovered)&&!a.disabled||a.disabled&&a.checked?3:5,
decorator:a.pressed||a.checked&&!a.hovered||a.checked&&a.disabled?"toolbar-button-checked":a.hovered&&!a.disabled?"toolbar-button-hovered":undefined}}},
"toolbar-menubutton":{alias:"toolbar-button",
include:"toolbar-button",
style:function(a){return{showArrow:true}}},
"toolbar-menubutton/arrow":{alias:"image",
include:"image",
style:function(a){return{source:"qx/decoration/arrows/down-small.png"}}},
"toolbar-splitbutton":{style:function(a){return{marginTop:2,
marginBottom:2}}},
"toolbar-splitbutton/button":{alias:"toolbar-button",
include:"toolbar-button",
style:function(a){return{icon:"qx/decoration/arrows/down.png",
marginTop:undefined,
marginBottom:undefined}}},
"toolbar-splitbutton/arrow":{alias:"toolbar-button",
include:"toolbar-button",
style:function(a){if(a.pressed||a.checked||a.hovered&&!a.disabled)var b=1;
else b=3;
return{padding:b,
icon:"qx/decoration/arrows/down.png",
marginTop:undefined,
marginBottom:undefined}}},
"toolbar-separator":{style:function(a){return{decorator:"toolbar-separator",
margin:7}}},
tree:"list",
"tree-item":{style:function(a){return{padding:[2,6],
textColor:a.selected?"text-selected":undefined,
decorator:a.selected?"selected":undefined}}},
"tree-item/icon":{include:"image",
style:function(a){return{paddingRight:5}}},
"tree-item/label":"label",
"tree-item/open":{include:"image",
style:function(b){var a;
a=b.selected&&b.opened?"qx/decoration/tree/open-selected.png":b.selected&&!b.opened?"qx/decoration/tree/closed-selected.png":b.opened?"qx/decoration/tree/open.png":"qx/decoration/tree/closed.png";
return{padding:[0,5,0,2],
source:a}}},
"tree-folder":{include:"tree-item",
alias:"tree-item",
style:function(a){var b;
b=a.small?a.opened?"qx/icon/16/places/folder-open.png":"qx/icon/16/places/folder.png":a.large?a.opened?"qx/icon/32/places/folder-open.png":"qx/icon/32/places/folder.png":a.opened?"qx/icon/22/places/folder-open.png":"qx/icon/22/places/folder.png";
return{icon:b}}},
"tree-file":{include:"tree-item",
alias:"tree-item",
style:function(a){return{icon:a.small?"qx/icon/16/mimetypes/office-document.png":a.large?"qx/icon/32/mimetypes/office-document.png":"qx/icon/22/mimetypes/office-document.png"}}},
treevirtual:"table",
"treevirtual-folder":{style:function(a){return{icon:a.opened?"qx/icon/16/places/folder-open.png":"qx/icon/16/places/folder.png"}}},
"treevirtual-file":{include:"treevirtual-folder",
alias:"treevirtual-folder",
style:function(a){return{icon:"qx/icon/16/mimetypes/office-document.png"}}},
"treevirtual-line":{style:function(a){return{icon:"qx/static/blank.gif"}}},
"treevirtual-contract":{style:function(a){return{icon:"qx/decoration/tree/open.png",
paddingLeft:5,
paddingTop:2}}},
"treevirtual-expand":{style:function(a){return{icon:"qx/decoration/tree/closed.png",
paddingLeft:5,
paddingTop:2}}},
"treevirtual-only-contract":"treevirtual-contract",
"treevirtual-only-expand":"treevirtual-expand",
"treevirtual-start-contract":"treevirtual-contract",
"treevirtual-start-expand":"treevirtual-expand",
"treevirtual-end-contract":"treevirtual-contract",
"treevirtual-end-expand":"treevirtual-expand",
"treevirtual-cross-contract":"treevirtual-contract",
"treevirtual-cross-expand":"treevirtual-expand",
"treevirtual-end":{style:function(a){return{icon:"qx/static/blank.gif"}}},
"treevirtual-cross":{style:function(a){return{icon:"qx/static/blank.gif"}}},
tooltip:{include:"popup",
style:function(a){return{backgroundColor:"background-tip",
padding:[1,3,2,3],
offset:[15,5,5,5]}}},
"tooltip/atom":"atom",
"tooltip-error":{include:"tooltip",
style:function(a){return{textColor:"text-selected",
placeMethod:"widget",
offset:[0,0,0,14],
marginTop:-2,
position:"right-top",
showTimeout:100,
hideTimeout:10000,
decorator:"tooltip-error",
shadow:"tooltip-error-arrow",
font:"bold"}}},
"tooltip-error/atom":"atom",
window:{style:function(a){return{shadow:"shadow-window",
contentPadding:[10,10,10,10]}}},
"window/pane":{style:function(a){return{decorator:"window"}}},
"window/captionbar":{style:function(a){return{decorator:a.active?"window-captionbar-active":"window-captionbar-inactive",
textColor:a.active?"white":"text-gray",
minHeight:26,
paddingRight:2}}},
"window/icon":{style:function(a){return{margin:[5,0,3,6]}}},
"window/title":{style:function(a){return{alignY:"middle",
font:"bold",
marginLeft:6,
marginRight:12}}},
"window/minimize-button":{alias:"atom",
style:function(a){return{icon:a.active?a.hovered?"qx/decoration/window/minimize-active-hovered.png":"qx/decoration/window/minimize-active.png":"qx/decoration/window/minimize-inactive.png",
margin:[4,8,2,0]}}},
"window/restore-button":{alias:"atom",
style:function(a){return{icon:a.active?a.hovered?"qx/decoration/window/restore-active-hovered.png":"qx/decoration/window/restore-active.png":"qx/decoration/window/restore-inactive.png",
margin:[5,8,2,0]}}},
"window/maximize-button":{alias:"atom",
style:function(a){return{icon:a.active?a.hovered?"qx/decoration/window/maximize-active-hovered.png":"qx/decoration/window/maximize-active.png":"qx/decoration/window/maximize-inactive.png",
margin:[4,8,2,0]}}},
"window/close-button":{alias:"atom",
style:function(a){return{icon:a.active?a.hovered?"qx/decoration/window/close-active-hovered.png":"qx/decoration/window/close-active.png":"qx/decoration/window/close-inactive.png",
margin:[4,8,2,0]}}},
"window/statusbar":{style:function(a){return{padding:[2,6],
decorator:"window-statusbar",
minHeight:18}}},
"window/statusbar-text":{style:function(a){return{font:"small"}}},
iframe:{style:function(a){return{decorator:"main"}}},
resizer:{style:function(a){return{decorator:"pane"}}},
splitpane:{style:function(a){return{decorator:"splitpane"}}},
"splitpane/splitter":{style:function(a){return{width:a.horizontal?3:undefined,
height:a.vertical?3:undefined,
backgroundColor:"background-splitpane"}}},
"splitpane/splitter/knob":{style:function(a){return{source:a.horizontal?"qx/decoration/splitpane/knob-horizontal.png":"qx/decoration/splitpane/knob-vertical.png"}}},
"splitpane/slider":{style:function(a){return{width:a.horizontal?3:undefined,
height:a.vertical?3:undefined,
backgroundColor:"background-splitpane"}}},
selectbox:{alias:"button-frame",
include:"button-frame",
style:function(a){return{padding:[2,8]}}},
"selectbox/atom":"atom",
"selectbox/popup":"popup",
"selectbox/list":{alias:"list"},
"selectbox/arrow":{include:"image",
style:function(a){return{source:"qx/decoration/arrows/down.png",
paddingLeft:5}}},
datechooser:{style:function(e){var a,d=!!e.focused,c=!!e.invalid,b=!!e.disabled;
a=d&&c&&!b?"input-focused-invalid":d&&!c&&!b?"input-focused":b?"input-disabled":!d&&c&&!b?"border-invalid":"input";
return{padding:2,
decorator:a,
backgroundColor:"background-light"}}},
"datechooser/navigation-bar":{},
"datechooser/nav-button":{include:"button-frame",
alias:"button-frame",
style:function(b){var a={padding:[2,4],
shadow:undefined};
b.lastYear?(a.icon="qx/decoration/arrows/rewind.png",a.marginRight=1):b.lastMonth?a.icon="qx/decoration/arrows/left.png":b.nextYear?(a.icon="qx/decoration/arrows/forward.png",a.marginLeft=1):b.nextMonth&&(a.icon="qx/decoration/arrows/right.png");
return a}},
"datechooser/last-year-button-tooltip":"tooltip",
"datechooser/last-month-button-tooltip":"tooltip",
"datechooser/next-year-button-tooltip":"tooltip",
"datechooser/next-month-button-tooltip":"tooltip",
"datechooser/last-year-button":"datechooser/nav-button",
"datechooser/last-month-button":"datechooser/nav-button",
"datechooser/next-month-button":"datechooser/nav-button",
"datechooser/next-year-button":"datechooser/nav-button",
"datechooser/month-year-label":{style:function(a){return{font:"bold",
textAlign:"center",
textColor:a.disabled?"text-disabled":undefined}}},
"datechooser/date-pane":{style:function(a){return{textColor:a.disabled?"text-disabled":undefined,
marginTop:2}}},
"datechooser/weekday":{style:function(a){return{textColor:a.disabled?"text-disabled":a.weekend?"text-light":undefined,
textAlign:"center",
paddingTop:2,
backgroundColor:"background-medium"}}},
"datechooser/week":{style:function(a){return{textAlign:"center",
padding:[2,4],
backgroundColor:"background-medium"}}},
"datechooser/day":{style:function(a){return{textAlign:"center",
decorator:a.disabled?undefined:a.selected?"selected":undefined,
textColor:a.disabled?"text-disabled":a.selected?"text-selected":a.otherMonth?"text-light":undefined,
font:a.today?"bold":undefined,
padding:[2,4]}}},
combobox:{style:function(e){var a,d=!!e.focused,c=!!e.invalid,b=!!e.disabled;
a=d&&c&&!b?"input-focused-invalid":d&&!c&&!b?"input-focused":b?"input-disabled":!d&&c&&!b?"border-invalid":"input";
return{decorator:a}}},
"combobox/popup":"popup",
"combobox/list":{alias:"list"},
"combobox/button":{include:"button-frame",
alias:"button-frame",
style:function(b){var a={icon:"qx/decoration/arrows/down.png",
padding:2};
b.selected&&(a.decorator="button-focused");
return a}},
"combobox/textfield":{include:"textfield",
style:function(a){return{decorator:undefined}}},
menu:{style:function(b){var a={decorator:"menu",
shadow:"shadow-popup",
spacingX:6,
spacingY:1,
iconColumnWidth:16,
arrowColumnWidth:4,
placementModeY:b.submenu||b.contextmenu?"best-fit":"keep-align"};
b.submenu&&(a.position="right-top",a.offset=[-2,-3]);
return a}},
"menu/slidebar":"menu-slidebar",
"menu-slidebar":"widget",
"menu-slidebar-button":{style:function(a){return{decorator:a.hovered?"selected":undefined,
padding:7,
center:true}}},
"menu-slidebar/button-backward":{include:"menu-slidebar-button",
style:function(a){return{icon:a.hovered?"qx/decoration/arrows/up-invert.png":"qx/decoration/arrows/up.png"}}},
"menu-slidebar/button-forward":{include:"menu-slidebar-button",
style:function(a){return{icon:a.hovered?"qx/decoration/arrows/down-invert.png":"qx/decoration/arrows/down.png"}}},
"menu-separator":{style:function(a){return{height:0,
decorator:"menu-separator",
margin:[4,2]}}},
"menu-button":{alias:"atom",
style:function(a){return{decorator:a.selected?"selected":undefined,
textColor:a.selected?"text-selected":undefined,
padding:[4,6]}}},
"menu-button/icon":{include:"image",
style:function(a){return{alignY:"middle"}}},
"menu-button/label":{include:"label",
style:function(a){return{alignY:"middle",
padding:1}}},
"menu-button/shortcut":{include:"label",
style:function(a){return{alignY:"middle",
marginLeft:14,
padding:1}}},
"menu-button/arrow":{include:"image",
style:function(a){return{source:a.selected?"qx/decoration/arrows/right-invert.png":"qx/decoration/arrows/right.png",
alignY:"middle"}}},
"menu-checkbox":{alias:"menu-button",
include:"menu-button",
style:function(a){return{icon:a.checked?a.selected?"qx/decoration/menu/checkbox-invert.gif":"qx/decoration/menu/checkbox.gif":undefined}}},
"menu-radiobutton":{alias:"menu-button",
include:"menu-button",
style:function(a){return{icon:a.checked?a.selected?"qx/decoration/menu/radiobutton-invert.gif":"qx/decoration/menu/radiobutton.gif":undefined}}},
menubar:{style:function(a){return{decorator:"menubar"}}},
"menubar-button":{alias:"atom",
style:function(a){return{decorator:(a.pressed||a.hovered)&&!a.disabled?"selected":undefined,
textColor:a.pressed||a.hovered?"text-selected":undefined,
padding:[3,8]}}},
colorselector:"widget",
"colorselector/control-bar":"widget",
"colorselector/control-pane":"widget",
"colorselector/visual-pane":"groupbox",
"colorselector/preset-grid":"widget",
"colorselector/colorbucket":{style:function(a){return{decorator:"main",
width:16,
height:16}}},
"colorselector/preset-field-set":"groupbox",
"colorselector/input-field-set":"groupbox",
"colorselector/preview-field-set":"groupbox",
"colorselector/hex-field-composite":"widget",
"colorselector/hex-field":"textfield",
"colorselector/rgb-spinner-composite":"widget",
"colorselector/rgb-spinner-red":"spinner",
"colorselector/rgb-spinner-green":"spinner",
"colorselector/rgb-spinner-blue":"spinner",
"colorselector/hsb-spinner-composite":"widget",
"colorselector/hsb-spinner-hue":"spinner",
"colorselector/hsb-spinner-saturation":"spinner",
"colorselector/hsb-spinner-brightness":"spinner",
"colorselector/preview-content-old":{style:function(a){return{decorator:"main",
width:50,
height:10}}},
"colorselector/preview-content-new":{style:function(a){return{decorator:"main",
backgroundColor:"background-light",
width:50,
height:10}}},
"colorselector/hue-saturation-field":{style:function(a){return{decorator:"main",
margin:5}}},
"colorselector/brightness-field":{style:function(a){return{decorator:"main",
margin:[5,7]}}},
"colorselector/hue-saturation-pane":"widget",
"colorselector/hue-saturation-handle":"widget",
"colorselector/brightness-pane":"widget",
"colorselector/brightness-handle":"widget",
colorpopup:{alias:"popup",
include:"popup",
style:function(a){return{padding:5,
backgroundColor:"background-application"}}},
"colorpopup/field":{style:function(a){return{decorator:"main",
margin:2,
width:14,
height:14,
backgroundColor:"background-light"}}},
"colorpopup/selector-button":"button",
"colorpopup/auto-button":"button",
"colorpopup/preview-pane":"groupbox",
"colorpopup/current-preview":{style:function(a){return{height:20,
padding:4,
marginLeft:4,
decorator:"main",
allowGrowX:true}}},
"colorpopup/selected-preview":{style:function(a){return{height:20,
padding:4,
marginRight:4,
decorator:"main",
allowGrowX:true}}},
"colorpopup/colorselector-okbutton":{alias:"button",
include:"button",
style:function(a){return{icon:"qx/icon/16/actions/dialog-ok.png"}}},
"colorpopup/colorselector-cancelbutton":{alias:"button",
include:"button",
style:function(a){return{icon:"qx/icon/16/actions/dialog-cancel.png"}}},
table:{alias:"widget",
style:function(a){return{decorator:"table"}}},
"table-header":{},
"table/statusbar":{style:function(a){return{decorator:"table-statusbar",
padding:[0,2]}}},
"table/column-button":{alias:"button-frame",
style:function(a){return{decorator:"table-column-button",
padding:3,
icon:"qx/decoration/table/select-column-order.png"}}},
"table-column-reset-button":{include:"menu-button",
alias:"menu-button",
style:function(){return{icon:"qx/icon/16/actions/view-refresh.png"}}},
"table-scroller":"widget",
"table-scroller/scrollbar-x":"scrollbar",
"table-scroller/scrollbar-y":"scrollbar",
"table-scroller/header":{style:function(a){return{decorator:"table-scroller-header"}}},
"table-scroller/pane":{style:function(a){return{backgroundColor:"table-pane"}}},
"table-scroller/focus-indicator":{style:function(a){return{decorator:"table-scroller-focus-indicator"}}},
"table-scroller/resize-line":{style:function(a){return{backgroundColor:"border-separator",
width:2}}},
"table-header-cell":{alias:"atom",
style:function(a){return{minWidth:13,
minHeight:20,
padding:a.hovered?[3,4,2,4]:[3,4],
decorator:a.hovered?"table-header-cell-hovered":"table-header-cell",
sortIcon:a.sorted?a.sortedAscending?"qx/decoration/table/ascending.png":"qx/decoration/table/descending.png":undefined}}},
"table-header-cell/label":{style:function(a){return{minWidth:0,
alignY:"middle",
paddingRight:5}}},
"table-header-cell/sort-icon":{style:function(a){return{alignY:"middle",
alignX:"right"}}},
"table-header-cell/icon":{style:function(a){return{minWidth:0,
alignY:"middle",
paddingRight:5}}},
"table-editor-textfield":{include:"textfield",
style:function(a){return{decorator:undefined,
padding:[2,2],
backgroundColor:"background-light"}}},
"table-editor-selectbox":{include:"selectbox",
alias:"selectbox",
style:function(a){return{padding:[0,2],
backgroundColor:"background-light"}}},
"table-editor-combobox":{include:"combobox",
alias:"combobox",
style:function(a){return{decorator:undefined,
backgroundColor:"background-light"}}},
"progressive-table-header":{alias:"widget",
style:function(a){return{decorator:"progressive-table-header"}}},
"progressive-table-header-cell":{alias:"atom",
style:function(a){return{minWidth:40,
minHeight:25,
paddingLeft:6,
decorator:"progressive-table-header-cell"}}},
"app-header":{style:function(a){return{font:"bold",
textColor:"text-selected",
padding:[8,12],
decorator:"app-header"}}},
"virtual-list":"list",
"virtual-list/row-layer":"row-layer",
"row-layer":{style:function(a){return{colorEven:"white",
colorOdd:"white"}}},
"column-layer":"widget",
cell:{style:function(a){return{textColor:a.selected?"text-selected":"text-label",
padding:[3,6],
font:"default"}}},
"cell-string":"cell",
"cell-number":{include:"cell",
style:function(a){return{textAlign:"right"}}},
"cell-image":"cell",
"cell-boolean":{include:"cell",
style:function(a){return{iconTrue:"qx/decoration/table/boolean-true.png",
iconFalse:"qx/decoration/table/boolean-false.png"}}},
"cell-atom":"cell",
"cell-date":"cell",
"cell-html":"cell",
htmlarea:{include:"widget",
style:function(a){return{backgroundColor:"white"}}}}});


// apiviewer.MWidgetRegistry
//   - size: 662 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 2x
//       apiviewer, 2x
//       qx, 1x
//   - packages:
//       apiviewer.MWidgetRegistry, 1x
//       apiviewer.MWidgetRegistry.getWidgetById, 1x
//       qx.Mixin.define, 1x
qx.Mixin.define("apiviewer.MWidgetRegistry",{properties:{id:{check:"String",
apply:"_applyId",
nullable:true,
init:null}},
members:{_applyId:function(b,a){var c=apiviewer.MWidgetRegistry;
a&&c.unregister(this,a);
b&&c.register(this,b)},
getWidgetById:function(a){return apiviewer.MWidgetRegistry.getWidgetById(a)}},
statics:{__yALNM:{},
getWidgetById:function(a){return this.__yALNM[a]},
register:function(b,a){if(this.__yALNM[a])throw new Error("An object with the id '"+a+"' already exists.");
this.__yALNM[a]=b},
unregister:function(b,a){if(this.__yALNM[a]!==b)throw new Error("The object is not registered with the id '"+a+"'.");
delete this.__yALNM[a]}}});


// qx.util.format.IFormat
//   - size: 101 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.util.format.IFormat",{members:{format:function(a){},
parse:function(a){}}});


// qx.ui.table.ICellEditorFactory
//   - size: 154 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.table.ICellEditorFactory",{members:{createCellEditor:function(a){return true},
getCellEditorValue:function(a){return true}}});


// qx.ui.table.IColumnMenuButton
//   - size: 154 bytes
//   - modified: 2010-10-13T17:38:57
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.table.IColumnMenuButton",{properties:{menu:{}},
members:{factory:function(b,a){return true},
empty:function(){return true}}});


// qx.ui.table.ICellRenderer
//   - size: 108 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.table.ICellRenderer",{members:{createDataCellHtml:function(b,a){return true}}});


// qx.ui.table.IHeaderRenderer
//   - size: 151 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.table.IHeaderRenderer",{members:{createHeaderCell:function(a){return true},
updateHeaderCell:function(b,a){return true}}});


// qx.ui.table.IColumnMenuItem
//   - size: 123 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.table.IColumnMenuItem",{properties:{visible:{}},
events:{changeVisible:"qx.event.type.Data"}});


// qx.ui.table.IRowRenderer
//   - size: 188 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.table.IRowRenderer",{members:{updateDataRowElement:function(a,b){},
getRowHeightStyle:function(a){},
createRowStyle:function(a){},
getRowClass:function(a){}}});


// qx.ui.table.ITableModel
//   - size: 644 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.table.ITableModel",{events:{dataChanged:"qx.event.type.Data",
metaDataChanged:"qx.event.type.Event",
sorted:"qx.event.type.Data"},
members:{getRowCount:function(){},
getRowData:function(a){},
getColumnCount:function(){},
getColumnId:function(a){},
getColumnIndexById:function(a){},
getColumnName:function(a){},
isColumnEditable:function(a){},
isColumnSortable:function(a){},
sortByColumn:function(b,a){},
getSortColumnIndex:function(){},
isSortAscending:function(){},
prefetchRows:function(a,b){},
getValue:function(a,b){},
getValueById:function(a,b){},
setValue:function(b,c,a){},
setValueById:function(b,c,a){}}});


// qx.ui.form.IBooleanForm
//   - size: 200 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.form.IBooleanForm",{events:{changeValue:"qx.event.type.Data"},
members:{setValue:function(a){return arguments.length==1},
resetValue:function(){},
getValue:function(){}}});


// qx.ui.form.IModel
//   - size: 168 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.form.IModel",{events:{changeModel:"qx.event.type.Data"},
members:{setModel:function(a){},
getModel:function(){},
resetModel:function(){}}});


// qx.ui.form.IForm
//   - size: 638 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.form.IForm",{events:{changeEnabled:"qx.event.type.Data",
changeValid:"qx.event.type.Data",
changeInvalidMessage:"qx.event.type.Data",
changeRequired:"qx.event.type.Data"},
members:{setEnabled:function(a){return arguments.length==1},
getEnabled:function(){},
setRequired:function(a){return arguments.length==1},
getRequired:function(){},
setValid:function(a){return arguments.length==1},
getValid:function(){},
setInvalidMessage:function(a){return arguments.length==1},
getInvalidMessage:function(){},
setRequiredInvalidMessage:function(a){return arguments.length==1},
getRequiredInvalidMessage:function(){}}});


// qx.ui.form.INumberForm
//   - size: 199 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.form.INumberForm",{events:{changeValue:"qx.event.type.Data"},
members:{setValue:function(a){return arguments.length==1},
resetValue:function(){},
getValue:function(){}}});


// qx.ui.form.IModelSelection
//   - size: 127 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.form.IModelSelection",{members:{setModelSelection:function(a){},
getModelSelection:function(){}}});


// qx.ui.form.IRange
//   - size: 369 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.form.IRange",{members:{setMinimum:function(a){return arguments.length==1},
getMinimum:function(){},
setMaximum:function(a){return arguments.length==1},
getMaximum:function(){},
setSingleStep:function(a){return arguments.length==1},
getSingleStep:function(){},
setPageStep:function(a){return arguments.length==1},
getPageStep:function(){}}});


// qx.ui.core.ISingleSelection
//   - size: 392 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.core.ISingleSelection",{events:{changeSelection:"qx.event.type.Data"},
members:{getSelection:function(){return true},
setSelection:function(a){return arguments.length==1},
resetSelection:function(){return true},
isSelected:function(a){return arguments.length==1},
isSelectionEmpty:function(){return true},
getSelectables:function(a){return arguments.length==1}}});


// qx.ui.core.scroll.IScrollBar
//   - size: 308 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.core.scroll.IScrollBar",{events:{scroll:"qx.event.type.Data"},
properties:{orientation:{},
maximum:{},
position:{},
knobFactor:{}},
members:{scrollTo:function(a){this.assertNumber(a)},
scrollBy:function(a){this.assertNumber(a)},
scrollBySteps:function(a){this.assertNumber(a)}}});


// apiviewer.Appearance
//   - size: 763 bytes
//   - modified: 2010-11-02T19:09:38
//   - names:
//       qx, 2x
//   - packages:
//       qx.Theme.define, 1x
//       qx.theme.Appearance, 1x
qx.Theme.define("apiviewer.Appearance",{title:"Theme for API Viewer",
extend:qx.theme.Appearance,
appearances:{toggleview:{style:function(a){return{width:240,
decorator:"main"}}},
detailviewer:{style:function(a){return{backgroundColor:"white",
decorator:"main"}}},
legend:{include:"scrollarea",
alias:"scrollarea",
style:function(a){return{contentPadding:[10,10,10,10]}}},
"legendview-label-important":{style:function(a){return{textColor:"#134275",
font:"bold"}}},
"legendview-label":{style:function(a){return{textColor:"#134275"}}},
tabview:{style:function(a){return{contentPadding:0}}},
"tabview/pane":{style:function(a){return{minHeight:100,
marginBottom:a.barBottom?-1:0,
marginTop:a.barTop?-1:0,
marginLeft:a.barLeft?-1:0,
marginRight:a.barRight?-1:0}}}}});


// qx.application.IApplication
//   - size: 149 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.application.IApplication",{members:{main:function(){},
finalize:function(){},
close:function(){},
terminate:function(){}}});


// qx.ui.core.ISingleSelectionProvider
//   - size: 126 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Interface.define, 1x
qx.Interface.define("qx.ui.core.ISingleSelectionProvider",{members:{getItems:function(){},
isItemSelectable:function(a){}}});


// qx.ui.core.IMultiSelection
//   - size: 250 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Interface.define, 1x
//       qx.ui.core.ISingleSelection, 1x
qx.Interface.define("qx.ui.core.IMultiSelection",{extend:qx.ui.core.ISingleSelection,
members:{selectAll:function(){return true},
addToSelection:function(a){return arguments.length==1},
removeFromSelection:function(a){return arguments.length==1}}});


// qx.util.StringEscape
//   - size: 576 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       String, 3x
//       parseInt, 2x
//       qx, 1x
//   - packages:
//       String.fromCharCode, 3x
//       qx.Class.define, 1x
qx.Class.define("qx.util.StringEscape",{statics:{escape:function(d,g){for(var b,e="",c=0,h=d.length,f,a;
c<h;
c++){f=d.charAt(c),a=f.charCodeAt(0);
b=g[a]?"&"+g[a]+";":a>0x7F?"&#"+a+";":f;
e+=b}return e},
unescape:function(b,a){return b.replace(/&[#\w]+;/gi,function(b){var d=b,b=b.substring(1,b.length-1),c=a[b];
c?d=String.fromCharCode(c):b.charAt(0)=="#"&&(b.charAt(1).toUpperCase()=="X"?(c=b.substring(2),c.match(/^[0-9A-Fa-f]+$/gi)&&(d=String.fromCharCode(parseInt(c,16)))):(c=b.substring(1),c.match(/^\d+$/gi)&&(d=String.fromCharCode(parseInt(c,10)))));
return d})}}});


// qx.log.appender.Util
//   - size: 2116 bytes
//   - modified: 2010-09-13T20:08:24
//   - names:
//       Array, 2x
//       String, 1x
//       document, 1x
//       qx, 1x
//   - packages:
//       document.createElement, 1x
//       qx.Class.define, 1x
qx.Class.define("qx.log.appender.Util",{statics:{toHtml:function(c){var a=[],e,d,b,f,g,k,j,l,i,m,h;
a.push("<span class='offset'>",this.formatOffset(c.offset,6),"</span> ");
if(c.object){g=c.win.qx.core.ObjectRegistry.fromHashCode(c.object);
g&&a.push("<span class='object' title='Object instance with hash code: "+g.$$hash+"'>",g.classname,"[",g.$$hash,"]</span>: ")}else c.clazz&&a.push("<span class='object'>"+c.clazz.classname,"</span>: ");
k=c.items,j=0,l=k.length;
for(;
j<l;
j++){e=k[j];
d=e.text;
if(d instanceof Array){f=[],i=0,m=d.length;
for(;
i<m;
i++)b=d[i],typeof b==="string"?f.push("<span>"+this.escapeHTML(b)+"</span>"):b.key?f.push("<span class='type-key'>"+b.key+"</span>:<span class='type-"+b.type+"'>"+this.escapeHTML(b.text)+"</span>"):f.push("<span class='type-"+b.type+"'>"+this.escapeHTML(b.text)+"</span>");
a.push("<span class='type-"+e.type+"'>");
e.type==="map"?a.push("{",f.join(", "),"}"):a.push("[",f.join(", "),"]");
a.push("</span>")}else a.push("<span class='type-"+e.type+"'>"+this.escapeHTML(d)+"</span> ")}h=document.createElement("DIV");
h.innerHTML=a.join("");
h.className="level-"+c.level;
return h},
formatOffset:function(e,f){for(var b=e.toString(),d=(f||6)-b.length,c="",a=0;
a<d;
a++)c+="0";
return c+b},
FORMAT_STACK:null,
escapeHTML:function(a){return String(a).replace(/[<>&"']/g,this.__btjwuP)},
__btjwuP:function(a){var b={"<":"&lt;",
">":"&gt;",
"&":"&amp;",
"'":"&#39;",
"\"":"&quot;"};
return b[a]||"?"},
toText:function(a){return this.toTextArray(a).join(" ")},
toTextArray:function(a){var c=[],h,i,d,b,g,j,e,f,k;
c.push(this.formatOffset(a.offset,6));
if(a.object){h=a.win.qx.core.ObjectRegistry.fromHashCode(a.object);
h&&c.push(h.classname+"["+h.$$hash+"]:")}else a.clazz&&c.push(a.clazz.classname+":");
i=a.items,g=0,j=i.length;
for(;
g<j;
g++){d=i[g];
b=d.text;
d.trace&&d.trace.length>0&&(b+=typeof this.FORMAT_STACK=="function"?"\n"+this.FORMAT_STACK(d.trace):"\n"+d.trace);
if(b instanceof Array){e=[],f=0,k=b.length;
for(;
f<k;
f++)e.push(b[f].text);
d.type==="map"?c.push("{",e.join(", "),"}"):c.push("[",e.join(", "),"]")}else c.push(b)}return c}}});


// qx.lang.Number
//   - size: 204 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 1x
//   - packages:
//       qx.Class.define, 1x
qx.Class.define("qx.lang.Number",{statics:{isInRange:function(a,b,c){return a>=b&&a<=c},
isBetweenRange:function(a,b,c){return a>b&&a<c},
limit:function(b,a,c){return c!=null&&b>c?c:a!=null&&b<a?a:b}}});


// qx.type.BaseArray
//   - size: 1951 bytes
//   - modified: 2010-11-02T16:04:16
//   - names:
//       Array, 6x
//       qx, 9x
//   - packages:
//       Array.prototype.slice, 1x
//       Array.prototype.slice.apply, 1x
//       Array.prototype.slice.call, 1x
//       Array.prototype.splice.apply, 1x
//       qx.Class.define, 1x
//       qx.lang.Core.arrayEvery, 1x
//       qx.lang.Core.arrayFilter, 1x
//       qx.lang.Core.arrayForEach, 1x
//       qx.lang.Core.arrayIndexOf, 1x
//       qx.lang.Core.arrayLastIndexOf, 1x
//       qx.lang.Core.arrayMap, 1x
//       qx.lang.Core.arraySome, 1x
//       qx.type.BaseArray, 1x
qx.Class.define("qx.type.BaseArray",{extend:Array,
construct:function(a){},
members:{toArray:null,
valueOf:null,
pop:null,
push:null,
reverse:null,
shift:null,
sort:null,
splice:null,
unshift:null,
concat:null,
join:null,
slice:null,
toString:null,
indexOf:null,
lastIndexOf:null,
forEach:null,
filter:null,
map:null,
some:null,
every:null}});
(function(){function c(e){var b=Array.prototype.slice,d,c;
a.prototype.concat=function(){for(var e=this.slice(0),c=0,f=arguments.length,d;
c<f;
c++){d=arguments[c] instanceof a?b.call(arguments[c],0):arguments[c] instanceof Array?arguments[c]:[arguments[c]];
e.push.apply(e,d)}return e};
a.prototype.toString=function(){return b.call(this,0).toString()};
a.prototype.toLocaleString=function(){return b.call(this,0).toLocaleString()};
a.prototype.constructor=a;
a.prototype.indexOf=qx.lang.Core.arrayIndexOf;
a.prototype.lastIndexOf=qx.lang.Core.arrayLastIndexOf;
a.prototype.forEach=qx.lang.Core.arrayForEach;
a.prototype.some=qx.lang.Core.arraySome;
a.prototype.every=qx.lang.Core.arrayEvery;
d=qx.lang.Core.arrayFilter,c=qx.lang.Core.arrayMap;
a.prototype.filter=function(){var a=new this.constructor;
a.push.apply(a,d.apply(this,arguments));
return a};
a.prototype.map=function(){var a=new this.constructor;
a.push.apply(a,c.apply(this,arguments));
return a};
a.prototype.slice=function(){var a=new this.constructor;
a.push.apply(a,Array.prototype.slice.apply(this,arguments));
return a};
a.prototype.splice=function(){var a=new this.constructor;
a.push.apply(a,Array.prototype.splice.apply(this,arguments));
return a};
a.prototype.toArray=function(){return Array.prototype.slice.call(this,0)};
a.prototype.valueOf=function(){return this.length};
return a}function a(a){arguments.length===1&&typeof a==="number"?this.length=-1<a&&a===a>>.5?a:this.push(a):arguments.length&&this.push.apply(this,arguments)}function b(){}b.prototype=[];
a.prototype=new b;
a.prototype.length=0;
qx.type.BaseArray=c(a)})();


// qx.bom.client.Transport
//   - size: 357 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//       window, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.client.Engine, 1x
//       window.maxConnectionsPerServer, 2x
qx.Class.define("qx.bom.client.Transport",{statics:{getMaxConcurrentRequestCount:function(){var b,d=qx.bom.client.Engine,a=d.FULLVERSION.split("."),c=0,e=0,f=0;
a[0]&&(c=a[0]);
a[1]&&(e=a[1]);
a[2]&&(f=a[2]);
b=window.maxConnectionsPerServer?window.maxConnectionsPerServer:d.OPERA?8:d.WEBKIT?4:d.GECKO&&(c>1||c==1&&e>9||c==1&&e==9&&f>=1)?6:2;
return b}}});


// apiviewer.ObjectRegistry
//   - size: 212 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.ObjectRegistry.toHashCode, 1x
qx.Class.define("apiviewer.ObjectRegistry",{statics:{__yALNM:{},
register:function(a){var b=qx.core.ObjectRegistry.toHashCode(a);
this.__yALNM[b]=a},
getObjectFromHashCode:function(a){return this.__yALNM[a]}}});


// qx.util.StringBuilder
//   - size: 320 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.type.BaseArray, 1x
qx.Class.define("qx.util.StringBuilder",{extend:qx.type.BaseArray,
members:{clear:function(){this.length=0},
get:function(){return this.join("")},
add:null,
isEmpty:function(){return this.length===0},
size:function(){return this.join("").length}},
defer:function(b,a){a.add=a.push;
a.toString=a.get;
a.valueOf=a.get}});


// qx.theme.Font
//   - size: 1113 bytes
//   - modified: 2010-11-02T19:07:52
//   - names:
//       qx, 19x
//   - packages:
//       qx.Theme.define, 1x
//       qx.bom.client.Platform.MAC, 4x
//       qx.bom.client.System.WIN7, 7x
//       qx.bom.client.System.WINVISTA, 7x
qx.Theme.define("qx.theme.Font",{fonts:{"default":{size:qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7?12:11,
lineHeight:1.4,
family:qx.bom.client.Platform.MAC?["Lucida Grande"]:qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7?["Segoe UI","Candara"]:["Tahoma","Liberation Sans","Arial","sans-serif"]},
bold:{size:qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7?12:11,
lineHeight:1.4,
family:qx.bom.client.Platform.MAC?["Lucida Grande"]:qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7?["Segoe UI","Candara"]:["Tahoma","Liberation Sans","Arial","sans-serif"],
bold:true},
small:{size:qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7?11:10,
lineHeight:1.4,
family:qx.bom.client.Platform.MAC?["Lucida Grande"]:qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7?["Segoe UI","Candara"]:["Tahoma","Liberation Sans","Arial","sans-serif"]},
monospace:{size:11,
lineHeight:1.4,
family:qx.bom.client.Platform.MAC?["Lucida Console","Monaco"]:qx.bom.client.System.WINVISTA||qx.bom.client.System.WIN7?["Consolas"]:["Consolas","DejaVu Sans Mono","Courier New","monospace"]}}});


// qx.bom.String
//   - size: 3392 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 8x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.String.FROM_CHARCODE, 1x
//       qx.bom.String.TO_CHARCODE, 1x
//       qx.bom.String.escape, 1x
//       qx.bom.String.unescape, 1x
//       qx.lang.Object.invert, 1x
//       qx.util.StringEscape.escape, 1x
//       qx.util.StringEscape.unescape, 1x
qx.Class.define("qx.bom.String",{statics:{TO_CHARCODE:{quot:34,
amp:38,
lt:60,
gt:62,
nbsp:160,
iexcl:161,
cent:162,
pound:163,
curren:164,
yen:165,
brvbar:166,
sect:167,
uml:168,
copy:169,
ordf:170,
laquo:171,
not:172,
shy:173,
reg:174,
macr:175,
deg:176,
plusmn:177,
sup2:178,
sup3:179,
acute:180,
micro:181,
para:182,
middot:183,
cedil:184,
sup1:185,
ordm:186,
raquo:187,
frac14:188,
frac12:189,
frac34:190,
iquest:191,
Agrave:192,
Aacute:193,
Acirc:194,
Atilde:195,
Auml:196,
Aring:197,
AElig:198,
Ccedil:199,
Egrave:200,
Eacute:201,
Ecirc:202,
Euml:203,
Igrave:204,
Iacute:205,
Icirc:206,
Iuml:207,
ETH:208,
Ntilde:209,
Ograve:210,
Oacute:211,
Ocirc:212,
Otilde:213,
Ouml:214,
times:215,
Oslash:216,
Ugrave:217,
Uacute:218,
Ucirc:219,
Uuml:220,
Yacute:221,
THORN:222,
szlig:223,
agrave:224,
aacute:225,
acirc:226,
atilde:227,
auml:228,
aring:229,
aelig:230,
ccedil:231,
egrave:232,
eacute:233,
ecirc:234,
euml:235,
igrave:236,
iacute:237,
icirc:238,
iuml:239,
eth:240,
ntilde:241,
ograve:242,
oacute:243,
ocirc:244,
otilde:245,
ouml:246,
divide:247,
oslash:248,
ugrave:249,
uacute:250,
ucirc:251,
uuml:252,
yacute:253,
thorn:254,
yuml:255,
fnof:402,
Alpha:913,
Beta:914,
Gamma:915,
Delta:916,
Epsilon:917,
Zeta:918,
Eta:919,
Theta:920,
Iota:921,
Kappa:922,
Lambda:923,
Mu:924,
Nu:925,
Xi:926,
Omicron:927,
Pi:928,
Rho:929,
Sigma:931,
Tau:932,
Upsilon:933,
Phi:934,
Chi:935,
Psi:936,
Omega:937,
alpha:945,
beta:946,
gamma:947,
delta:948,
epsilon:949,
zeta:950,
eta:951,
theta:952,
iota:953,
kappa:954,
lambda:955,
mu:956,
nu:957,
xi:958,
omicron:959,
pi:960,
rho:961,
sigmaf:962,
sigma:963,
tau:964,
upsilon:965,
phi:966,
chi:967,
psi:968,
omega:969,
thetasym:977,
upsih:978,
piv:982,
bull:8226,
hellip:8230,
prime:8242,
Prime:8243,
oline:8254,
frasl:8260,
weierp:8472,
image:8465,
real:8476,
trade:8482,
alefsym:8501,
larr:8592,
uarr:8593,
rarr:8594,
darr:8595,
harr:8596,
crarr:8629,
lArr:8656,
uArr:8657,
rArr:8658,
dArr:8659,
hArr:8660,
forall:8704,
part:8706,
exist:8707,
empty:8709,
nabla:8711,
isin:8712,
notin:8713,
ni:8715,
prod:8719,
sum:8721,
minus:8722,
lowast:8727,
radic:8730,
prop:8733,
infin:8734,
ang:8736,
and:8743,
or:8744,
cap:8745,
cup:8746,
"int":8747,
there4:8756,
sim:8764,
cong:8773,
asymp:8776,
ne:8800,
equiv:8801,
le:8804,
ge:8805,
sub:8834,
sup:8835,
sube:8838,
supe:8839,
oplus:8853,
otimes:8855,
perp:8869,
sdot:8901,
lceil:8968,
rceil:8969,
lfloor:8970,
rfloor:8971,
lang:9001,
rang:9002,
loz:9674,
spades:9824,
clubs:9827,
hearts:9829,
diams:9830,
OElig:338,
oelig:339,
Scaron:352,
scaron:353,
Yuml:376,
circ:710,
tilde:732,
ensp:8194,
emsp:8195,
thinsp:8201,
zwnj:8204,
zwj:8205,
lrm:8206,
rlm:8207,
ndash:8211,
mdash:8212,
lsquo:8216,
rsquo:8217,
sbquo:8218,
ldquo:8220,
rdquo:8221,
bdquo:8222,
dagger:8224,
Dagger:8225,
permil:8240,
lsaquo:8249,
rsaquo:8250,
euro:8364},
escape:function(a){return qx.util.StringEscape.escape(a,qx.bom.String.FROM_CHARCODE)},
unescape:function(a){return qx.util.StringEscape.unescape(a,qx.bom.String.TO_CHARCODE)},
fromText:function(a){return qx.bom.String.escape(a).replace(/(  |\n)/g,function(a){var b={"  ":" &nbsp;",
"\n":"<br>"};
return b[a]||a})},
toText:function(a){return qx.bom.String.unescape(a.replace(/\s+|<([^>])+>/gi,function(a){return a.indexOf("<br")===0?"\n":a.length>0&&a.replace(/^\s*/,"").replace(/\s*$/,"")==""?" ":""}))}},
defer:function(a){a.FROM_CHARCODE=qx.lang.Object.invert(a.TO_CHARCODE)}});


// qx.ui.table.selection.Model
//   - size: 4227 bytes
//   - modified: 2010-09-30T14:20:20
//   - names:
//       Error, 1x
//       Math, 5x
//       qx, 3x
//   - packages:
//       Math.max, 3x
//       Math.min, 2x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.ui.table.selection.Model, 1x
qx.Class.define("qx.ui.table.selection.Model",{extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__bo6y46=[];
this.__b0yNdI=-1;
this.__bFyKAh=-1;
this.hasBatchModeRefCount=0;
this.__cNnwDS=false},
events:{changeSelection:"qx.event.type.Event"},
statics:{NO_SELECTION:1,
SINGLE_SELECTION:2,
SINGLE_INTERVAL_SELECTION:3,
MULTIPLE_INTERVAL_SELECTION:4,
MULTIPLE_INTERVAL_SELECTION_TOGGLE:5},
properties:{selectionMode:{init:2,
check:[1,2,3,4,5],
apply:"_applySelectionMode"}},
members:{__cNnwDS:null,
__b0yNdI:null,
__bFyKAh:null,
__bo6y46:null,
_applySelectionMode:function(a){this.resetSelection()},
setBatchMode:function(a){if(a)this.hasBatchModeRefCount+=1;
else{if(this.hasBatchModeRefCount==0)throw new Error("Try to turn off batch mode althoug it was not turned on.");
this.hasBatchModeRefCount-=1;
this.__cNnwDS&&(this.__cNnwDS=false,this._fireChangeSelection())}return this.hasBatchMode()},
hasBatchMode:function(){return this.hasBatchModeRefCount>0},
getAnchorSelectionIndex:function(){return this.__b0yNdI},
_setAnchorSelectionIndex:function(a){this.__b0yNdI=a},
getLeadSelectionIndex:function(){return this.__bFyKAh},
_setLeadSelectionIndex:function(a){this.__bFyKAh=a},
_getSelectedRangeArr:function(){return this.__bo6y46},
resetSelection:function(){this.isSelectionEmpty()||(this._resetSelection(),this._fireChangeSelection())},
isSelectionEmpty:function(){return this.__bo6y46.length==0},
getSelectedCount:function(){for(var b=0,a=0,c;
a<this.__bo6y46.length;
a++){c=this.__bo6y46[a];
b+=c.maxIndex-c.minIndex+1}return b},
isSelectedIndex:function(c){for(var a=0,b;
a<this.__bo6y46.length;
a++){b=this.__bo6y46[a];
if(c>=b.minIndex&&c<=b.maxIndex)return true}return false},
getSelectedRanges:function(){for(var b=[],a=0;
a<this.__bo6y46.length;
a++)b.push({minIndex:this.__bo6y46[a].minIndex,
maxIndex:this.__bo6y46[a].maxIndex});
return b},
iterateSelection:function(c,d){for(var a=0,b;
a<this.__bo6y46.length;
a++)for(b=this.__bo6y46[a].minIndex;
b<=this.__bo6y46[a].maxIndex;
b++)c.call(d,b)},
setSelectionInterval:function(c,b){var d=this.self(arguments),a;
switch(this.getSelectionMode()){case d.NO_SELECTION:return;
case d.SINGLE_SELECTION:if(this.isSelectedIndex(b))return;
c=b;
break;
case d.MULTIPLE_INTERVAL_SELECTION_TOGGLE:this.setBatchMode(true);
try{for(a=c;
a<=b;
a++)this.isSelectedIndex(a)?this.removeSelectionInterval(a,a):this._addSelectionInterval(a,a)}catch(e){throw e}finally{this.setBatchMode(false)};
this._fireChangeSelection();
return}this._resetSelection();
this._addSelectionInterval(c,b);
this._fireChangeSelection()},
addSelectionInterval:function(b,c){var a=qx.ui.table.selection.Model;
switch(this.getSelectionMode()){case a.NO_SELECTION:return;
case a.MULTIPLE_INTERVAL_SELECTION:case a.MULTIPLE_INTERVAL_SELECTION_TOGGLE:this._addSelectionInterval(b,c);
this._fireChangeSelection();
break;
default:this.setSelectionInterval(b,c);
break}},
removeSelectionInterval:function(e,f){this.__b0yNdI=e;
this.__bFyKAh=f;
for(var d=Math.min(e,f),c=Math.max(e,f),b=0,a,g,h,i;
b<this.__bo6y46.length;
b++){a=this.__bo6y46[b];
if(a.minIndex>c)break;
else if(a.maxIndex>=d){g=a.minIndex>=d&&a.minIndex<=c,h=a.maxIndex>=d&&a.maxIndex<=c;
if(g&&h)this.__bo6y46.splice(b,1),b--;
else if(g)a.minIndex=c+1;
else if(h)a.maxIndex=d-1;
else{i={minIndex:c+1,
maxIndex:a.maxIndex};
this.__bo6y46.splice(b+1,0,i);
a.maxIndex=d-1;
break}}}this._fireChangeSelection()},
_resetSelection:function(){this.__bo6y46=[];
this.__b0yNdI=-1;
this.__bFyKAh=-1},
_addSelectionInterval:function(e,f){this.__b0yNdI=e;
this.__bFyKAh=f;
for(var g=Math.min(e,f),h=Math.max(e,f),d=0,c,b,a;
d<this.__bo6y46.length;
d++){c=this.__bo6y46[d];
if(c.minIndex>g)break}this.__bo6y46.splice(d,0,{minIndex:g,
maxIndex:h});
b=this.__bo6y46[0],a=1;
for(;
a<this.__bo6y46.length;
a++){c=this.__bo6y46[a];
b.maxIndex+1>=c.minIndex?(b.maxIndex=Math.max(b.maxIndex,c.maxIndex),this.__bo6y46.splice(a,1),a--):b=c}},
_dumpRanges:function(){for(var c="Ranges:",a=0,b;
a<this.__bo6y46.length;
a++){b=this.__bo6y46[a];
c+=" ["+b.minIndex+".."+b.maxIndex+"]"}this.debug(c)},
_fireChangeSelection:function(){this.hasBatchMode()?this.__cNnwDS=true:this.fireEvent("changeSelection")}},
destruct:function(){this.__bo6y46=null}});


// qx.io.remote.transport.Abstract
//   - size: 2778 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 9x
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.core.Setting.get, 4x
qx.Class.define("qx.io.remote.transport.Abstract",{type:"abstract",
extend:qx.core.Object,
construct:function(){this.base(arguments);
this.setRequestHeaders({});
this.setParameters({});
this.setFormFields({})},
events:{created:"qx.event.type.Event",
configured:"qx.event.type.Event",
sending:"qx.event.type.Event",
receiving:"qx.event.type.Event",
completed:"qx.event.type.Event",
aborted:"qx.event.type.Event",
failed:"qx.event.type.Event",
timeout:"qx.event.type.Event"},
properties:{url:{check:"String",
nullable:true},
method:{check:"String",
nullable:true,
init:"GET"},
asynchronous:{check:"Boolean",
nullable:true,
init:true},
data:{check:"String",
nullable:true},
username:{check:"String",
nullable:true},
password:{check:"String",
nullable:true},
state:{check:["created","configured","sending","receiving","completed","aborted","timeout","failed"],
init:"created",
event:"changeState",
apply:"_applyState"},
requestHeaders:{check:"Object",
nullable:true},
parameters:{check:"Object",
nullable:true},
formFields:{check:"Object",
nullable:true},
responseType:{check:"String",
nullable:true},
useBasicHttpAuth:{check:"Boolean",
nullable:true}},
members:{send:function(){throw new Error("send is abstract")},
abort:function(){qx.core.Setting.get("qx.ioRemoteDebug")&&this.warn("Aborting...");
this.setState("aborted")},
timeout:function(){qx.core.Setting.get("qx.ioRemoteDebug")&&this.warn("Timeout...");
this.setState("timeout")},
failed:function(){qx.core.Setting.get("qx.ioRemoteDebug")&&this.warn("Failed...");
this.setState("failed")},
setRequestHeader:function(b,a){throw new Error("setRequestHeader is abstract")},
getResponseHeader:function(a){throw new Error("getResponseHeader is abstract")},
getResponseHeaders:function(){throw new Error("getResponseHeaders is abstract")},
getStatusCode:function(){throw new Error("getStatusCode is abstract")},
getStatusText:function(){throw new Error("getStatusText is abstract")},
getResponseText:function(){throw new Error("getResponseText is abstract")},
getResponseXml:function(){throw new Error("getResponseXml is abstract")},
getFetchedLength:function(){throw new Error("getFetchedLength is abstract")},
_applyState:function(a,b){qx.core.Setting.get("qx.ioRemoteDebug")&&this.debug("State: "+a);
switch(a){case"created":this.fireEvent("created");
break;
case"configured":this.fireEvent("configured");
break;
case"sending":this.fireEvent("sending");
break;
case"receiving":this.fireEvent("receiving");
break;
case"completed":this.fireEvent("completed");
break;
case"aborted":this.fireEvent("aborted");
break;
case"failed":this.fireEvent("failed");
break;
case"timeout":this.fireEvent("timeout");
break}return true}},
destruct:function(){this.setRequestHeaders(null);
this.setParameters(null);
this.setFormFields(null)}});


// apiviewer.TreeUtil
//   - size: 5310 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 3x
//       apiviewer, 5x
//       qx, 2x
//   - packages:
//       apiviewer.TreeUtil, 3x
//       apiviewer.TreeUtil.iconNameToIconPath, 1x
//       apiviewer.dao, 1x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
qx.Class.define("apiviewer.TreeUtil",{extend:qx.core.Object,
construct:function(){this.base(arguments)},
statics:{getChild:function(a,c){if(a!=null&&a.children!=null)for(var b=0;
b<a.children.length;
b++)if(a.children[b].type==c)return a.children[b];
return null},
getChildByAttribute:function(b,e,d){if(b.children!=null)for(var c=0,a;
c<b.children.length;
c++){a=b.children[c];
if(a.attributes&&a.attributes[e]==d)return a}return null},
getIconUrl:function(a,d){var b,c=apiviewer.dao;
if(a instanceof c.Package)b="ICON_PACKAGE";
else if(a instanceof c.Class)switch(a.getType()){case"mixin":b="ICON_MIXIN";
break;
case"interface":b="ICON_INTERFACE";
break;
default:b="ICON_CLASS",a.isStatic()?b+="_STATIC":a.isAbstract()?b+="_ABSTRACT":a.isSingleton()&&(b+="_SINGLETON")}else if(a instanceof c.Property)b="ICON_PROPERTY",a.isPublic()?b+="_PUB":a.isProtected()?b+="_PROT":(a.isPrivate()||a.isInternal())&&(b+="_PRIV"),a.isThemeable()&&(b+="_THEMEABLE");
else if(a instanceof c.Event)b="ICON_EVENT";
else if(a instanceof c.Method){if(a.isConstructor())b="ICON_CTOR";
else b="ICON_METHOD",a.isPublic()?b+="_PUB":a.isProtected()?b+="_PROT":(a.isPrivate()||a.isInternal())&&(b+="_PRIV");
a.isStatic()?b+="_STATIC":a.isAbstract()&&(b+="_ABSTRACT");
a.getClass().getType()=="mixin"&&(b+="_MIXIN")}else if(a instanceof c.Constant)b="ICON_CONSTANT";
else if(a instanceof c.Appearance)b="ICON_APPEARANCE";
else if(a instanceof c.ChildControl)b="ICON_CHILDCONTROL";
else throw new Error("Unknown node type: "+a.type);
a instanceof c.ClassItem&&(d?b+="_INHERITED":a.getOverriddenFrom&&a.getOverriddenFrom()&&(b+="_OVERRIDDEN"),a.getErrors().length>0&&(b+="_ERROR"));
a.hasWarning()&&(b+="_WARN");
return apiviewer.TreeUtil.iconNameToIconPath(b)},
iconNameToIconPath:function(f){var b=apiviewer.TreeUtil[f],a,d,e,c,g;
if(!b){a=f.split("_"),d=a[0]+"_"+a[1];
if(a[2]=="PUB"||a[2]=="PROT"||a[2]=="PRIV"){d+="_"+a[2];
e=3}else e=2;
b=[apiviewer.TreeUtil[d]];
if(b[0]==null)throw new Error("Unknown img constant: "+d);
for(c=e;
c<a.length;
c++){g=apiviewer.TreeUtil["OVERLAY_"+a[c]];
if(g==null)throw new Error("Unknown img constant: OVERLAY_"+a[c]);
b.push(g)}}return b},
ICON_BLANK:"apiviewer/image/blank.gif",
OVERLAY_ABSTRACT:"apiviewer/image/overlay_abstract18.gif",
OVERLAY_ERROR:"apiviewer/image/overlay_error18.gif",
OVERLAY_INHERITED:"apiviewer/image/overlay_inherited18.gif",
OVERLAY_OVERRIDDEN:"apiviewer/image/overlay_overridden18.gif",
OVERLAY_THEMEABLE:"apiviewer/image/overlay_themeable18.gif",
OVERLAY_STATIC:"apiviewer/image/overlay_static18.gif",
OVERLAY_WARN:"apiviewer/image/overlay_warning18.gif",
OVERLAY_MIXIN:"apiviewer/image/overlay_mixin18.gif",
ICON_PACKAGE:"apiviewer/image/package18.gif",
ICON_PACKAGE_WARN:"apiviewer/image/package_warning18.gif",
ICON_CLASS:"apiviewer/image/class18.gif",
ICON_CLASS_WARN:"apiviewer/image/class_warning18.gif",
ICON_CLASS_ERROR:"apiviewer/image/class_warning18.gif",
ICON_CLASS_STATIC:"apiviewer/image/class_static18.gif",
ICON_CLASS_STATIC_WARN:"apiviewer/image/class_static_warning18.gif",
ICON_CLASS_STATIC_ERROR:"apiviewer/image/class_static_warning18.gif",
ICON_CLASS_ABSTRACT:"apiviewer/image/class_abstract18.gif",
ICON_CLASS_ABSTRACT_WARN:"apiviewer/image/class_abstract_warning18.gif",
ICON_CLASS_ABSTRACT_ERROR:"apiviewer/image/class_abstract_warning18.gif",
ICON_CLASS_SINGLETON:"apiviewer/image/class_singleton18.gif",
ICON_CLASS_SINGLETON_WARN:"apiviewer/image/class_singleton_warning18.gif",
ICON_CLASS_SINGLETON_ERROR:"apiviewer/image/class_singleton_warning18.gif",
ICON_PROPERTY_PUB:"apiviewer/image/property18.gif",
ICON_PROPERTY_PROT:"apiviewer/image/property_protected18.gif",
ICON_PROPERTY_PRIV:"apiviewer/image/property_private18.gif",
ICON_PROPERTY_PUB_THEMEABLE:"apiviewer/image/property_themeable18.gif",
ICON_EVENT:"apiviewer/image/event18.gif",
ICON_INTERFACE:"apiviewer/image/interface18.gif",
ICON_INTERFACE_WARN:"apiviewer/image/interface_warning18.gif",
ICON_MIXIN:"apiviewer/image/mixin18.gif",
ICON_MIXIN_WARN:"apiviewer/image/mixin_warning18.gif",
ICON_METHOD_PUB:"apiviewer/image/method_public18.gif",
ICON_METHOD_PUB_INHERITED:"apiviewer/image/method_public_inherited18.gif",
ICON_CTOR:"apiviewer/image/constructor18.gif",
ICON_METHOD_PROT:"apiviewer/image/method_protected18.gif",
ICON_METHOD_PRIV:"apiviewer/image/method_private18.gif",
ICON_CONSTANT:"apiviewer/image/constant18.gif",
ICON_APPEARANCE:"apiviewer/image/constant18.gif",
ICON_CHILDCONTROL:"apiviewer/image/childcontrol18.gif"},
defer:function(a,b,c){a.PRELOAD_IMAGES=[a.ICON_INFO,a.ICON_SEARCH,a.OVERLAY_ABSTRACT,a.OVERLAY_ERROR,a.OVERLAY_INHERITED,a.OVERLAY_OVERRIDDEN,a.OVERLAY_STATIC,a.OVERLAY_WARN,a.OVERLAY_MIXIN,a.OVERLAY_THEMEABLE,a.ICON_PACKAGE,a.ICON_PACKAGE_WARN,a.ICON_CLASS,a.ICON_CLASS_WARN,a.ICON_CLASS_ERROR,a.ICON_CLASS_STATIC,a.ICON_CLASS_STATIC_WARN,a.ICON_CLASS_STATIC_ERROR,a.ICON_CLASS_ABSTRACT,a.ICON_CLASS_ABSTRACT_WARN,a.ICON_CLASS_ABSTRACT_ERROR,a.ICON_CLASS_SINGLETON,a.ICON_CLASS_SINGLETON_WARN,a.ICON_CLASS_SINGLETON_ERROR,a.ICON_PROPERTY_PUB,a.ICON_PROPERTY_PROT,a.ICON_PROPERTY_PRIV,a.ICON_PROPERTY_PUB_THEMEABLE,a.ICON_EVENT,a.ICON_INTERFACE,a.ICON_INTERFACE_WARN,a.ICON_MIXIN,a.ICON_MIXIN_WARN,a.ICON_METHOD_PUB,a.ICON_METHOD_PUB_INHERITED,a.ICON_CTOR,a.ICON_METHOD_PROT,a.ICON_METHOD_PRIV,a.ICON_CONSTANT,a.ICON_CHILDCONTROL]}});


// qx.ui.table.columnmodel.resizebehavior.Abstract
//   - size: 880 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 6x
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
qx.Class.define("qx.ui.table.columnmodel.resizebehavior.Abstract",{type:"abstract",
extend:qx.core.Object,
members:{_setNumColumns:function(a){throw new Error("_setNumColumns is abstract")},
onAppear:function(b,a){throw new Error("onAppear is abstract")},
onTableWidthChanged:function(a){throw new Error("onTableWidthChanged is abstract")},
onVerticalScrollBarChanged:function(a){throw new Error("onVerticalScrollBarChanged is abstract")},
onColumnWidthChanged:function(a){throw new Error("onColumnWidthChanged is abstract")},
onVisibilityChanged:function(a){throw new Error("onVisibilityChanged is abstract")},
_getAvailableWidth:function(){var e=this.getTableColumnModel(),c=e.getTable(),a=c._getPaneScrollerArr(),b,d;
if(!a[0]||!a[0].getLayoutParent().getBounds())return null;
b=a[0].getLayoutParent().getBounds().width,d=a[a.length-1];
b-=d.getPaneInsetRight();
return b}}});


// qx.ui.table.pane.Model
//   - size: 1717 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.ui.table.pane.Model.EVENT_TYPE_MODEL_CHANGED, 3x
qx.Class.define("qx.ui.table.pane.Model",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
a.addListener("visibilityChangedPre",this._onColVisibilityChanged,this);
this.__boH5Jq=a},
events:{modelChanged:"qx.event.type.Event"},
statics:{EVENT_TYPE_MODEL_CHANGED:"modelChanged"},
properties:{firstColumnX:{check:"Integer",
init:0,
apply:"_applyFirstColumnX"},
maxColumnCount:{check:"Number",
init:-1,
apply:"_applyMaxColumnCount"}},
members:{__PMBsU:null,
__boH5Jq:null,
_applyFirstColumnX:function(a,b){this.__PMBsU=null;
this.fireEvent(qx.ui.table.pane.Model.EVENT_TYPE_MODEL_CHANGED)},
_applyMaxColumnCount:function(a,b){this.__PMBsU=null;
this.fireEvent(qx.ui.table.pane.Model.EVENT_TYPE_MODEL_CHANGED)},
setTableColumnModel:function(a){this.__boH5Jq=a;
this.__PMBsU=null},
_onColVisibilityChanged:function(a){this.__PMBsU=null;
this.fireEvent(qx.ui.table.pane.Model.EVENT_TYPE_MODEL_CHANGED)},
getColumnCount:function(){if(this.__PMBsU==null){var c=this.getFirstColumnX(),a=this.getMaxColumnCount(),b=this.__boH5Jq.getVisibleColumnCount();
this.__PMBsU=a==-1||c+a>b?b-c:a}return this.__PMBsU},
getColumnAtX:function(a){var b=this.getFirstColumnX();
return this.__boH5Jq.getVisibleColumnAtX(b+a)},
getX:function(c){var d=this.getFirstColumnX(),b=this.getMaxColumnCount(),a=this.__boH5Jq.getVisibleX(c)-d;
return a>=0&&(b==-1||a<b)?a:-1},
getColumnLeft:function(d){for(var c=0,e=this.getColumnCount(),a=0,b;
a<e;
a++){b=this.getColumnAtX(a);
if(b==d)return c;
c+=this.__boH5Jq.getColumnWidth(b)}return-1},
getTotalWidth:function(){for(var b=0,d=this.getColumnCount(),a=0,c;
a<d;
a++){c=this.getColumnAtX(a);
b+=this.__boH5Jq.getColumnWidth(c)}return b}},
destruct:function(){this.__boH5Jq=null}});


// qx.ui.table.celleditor.AbstractField
//   - size: 696 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       parseFloat, 1x
//       qx, 3x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.ui.table.ICellEditorFactory, 1x
qx.Class.define("qx.ui.table.celleditor.AbstractField",{extend:qx.core.Object,
implement:qx.ui.table.ICellEditorFactory,
type:"abstract",
properties:{validationFunction:{check:"Function",
nullable:true,
init:null}},
members:{_createEditor:function(){throw new Error("Abstract method call!")},
createCellEditor:function(b){var a=this._createEditor();
a.originalValue=b.value;
(b.value===null||b.value===undefined)&&(b.value="");
a.setValue(""+b.value);
a.addListener("appear",function(){a.selectAllText()});
return a},
getCellEditorValue:function(b){var a=b.getValue(),c=this.getValidationFunction();
c&&(a=c(a,b.originalValue));
typeof b.originalValue=="number"&&(a=parseFloat(a));
return a}}});


// qx.ui.decoration.Abstract
//   - size: 1258 bytes
//   - modified: 2010-06-18T23:08:09
//   - names:
//       Error, 3x
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.ui.decoration.IDecorator, 1x
qx.Class.define("qx.ui.decoration.Abstract",{extend:qx.core.Object,
implement:[qx.ui.decoration.IDecorator],
type:"abstract",
properties:{insetLeft:{check:"Number",
nullable:true,
apply:"_applyInsets"},
insetRight:{check:"Number",
nullable:true,
apply:"_applyInsets"},
insetBottom:{check:"Number",
nullable:true,
apply:"_applyInsets"},
insetTop:{check:"Number",
nullable:true,
apply:"_applyInsets"},
insets:{group:["insetTop","insetRight","insetBottom","insetLeft"],
shorthand:true}},
members:{__qFVs1:null,
_getDefaultInsets:function(){throw new Error("Abstract method called.")},
_isInitialized:function(){throw new Error("Abstract method called.")},
_resetInsets:function(){this.__qFVs1=null},
getInsets:function(){if(this.__qFVs1)return this.__qFVs1;
var a=this._getDefaultInsets();
return this.__qFVs1={left:this.getInsetLeft()==null?a.left:this.getInsetLeft(),
right:this.getInsetRight()==null?a.right:this.getInsetRight(),
bottom:this.getInsetBottom()==null?a.bottom:this.getInsetBottom(),
top:this.getInsetTop()==null?a.top:this.getInsetTop()}},
_applyInsets:function(){if(this._isInitialized())throw new Error("This decorator is already in-use. Modification is not possible anymore!");
this.__qFVs1=null}},
destruct:function(){this.__qFVs1=null}});


// qx.ui.core.SingleSelectionManager
//   - size: 1644 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       Error, 2x
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Assert.assertInterface, 1x
//       qx.core.Object, 1x
//       qx.ui.core.ISingleSelectionProvider, 1x
qx.Class.define("qx.ui.core.SingleSelectionManager",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
qx.core.Assert.assertInterface(a,qx.ui.core.ISingleSelectionProvider,"Invalid selectionProvider!");
this.__bzZEce=a},
events:{changeSelected:"qx.event.type.Data"},
properties:{allowEmptySelection:{check:"Boolean",
init:true,
apply:"_applyAllowEmptySelection"}},
members:{__zbljM:null,
__bzZEce:null,
getSelected:function(){return this.__zbljM},
setSelected:function(a){if(!this.__7CRhB(a))throw new Error("Could not select "+a+", because it is not a child element!");
this.__PjbdU(a)},
resetSelected:function(){this.__PjbdU(null)},
isSelected:function(a){if(!this.__7CRhB(a))throw new Error("Could not check if "+a+" is selected,"+" because it is not a child element!");
return this.__zbljM===a},
isSelectionEmpty:function(){return this.__zbljM==null},
getSelectables:function(d){for(var c=this.__bzZEce.getItems(),b=[],a=0;
a<c.length;
a++)this.__bzZEce.isItemSelectable(c[a])&&b.push(c[a]);
if(!d)for(a=b.length-1;
a>=0;
a--)b[a].getEnabled()||b.splice(a,1);
return b},
_applyAllowEmptySelection:function(a,b){a||this.__PjbdU(this.__zbljM)},
__PjbdU:function(d){var b=this.__zbljM,a=d,c;
if(a!=null&&b===a)return;
if(!this.isAllowEmptySelection()&&a==null){c=this.getSelectables(true)[0];
c&&(a=c)}this.__zbljM=a;
this.fireDataEvent("changeSelected",a,b)},
__7CRhB:function(c){for(var b=this.__bzZEce.getItems(),a=0;
a<b.length;
a++)if(b[a]===c)return true;
return false}},
destruct:function(){this.__bzZEce.toHashCode?this._disposeObjects("__selectionProvider"):this.__bzZEce=null;
this._disposeObjects("__selected")}});


// qx.ui.table.model.Abstract
//   - size: 2225 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       Array, 2x
//       Error, 5x
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.ui.table.ITableModel, 1x
qx.Class.define("qx.ui.table.model.Abstract",{type:"abstract",
extend:qx.core.Object,
implement:qx.ui.table.ITableModel,
events:{dataChanged:"qx.event.type.Data",
metaDataChanged:"qx.event.type.Event",
sorted:"qx.event.type.Data"},
construct:function(){this.base(arguments);
this.__O3vqJ=[];
this.__2m0iZ=[];
this.__9WoOR={}},
members:{__O3vqJ:null,
__2m0iZ:null,
__9WoOR:null,
__98uYg:null,
init:function(a){},
getRowCount:function(){throw new Error("getRowCount is abstract")},
getRowData:function(a){return null},
isColumnEditable:function(a){return false},
isColumnSortable:function(a){return false},
sortByColumn:function(b,a){},
getSortColumnIndex:function(){return-1},
isSortAscending:function(){return true},
prefetchRows:function(a,b){},
getValue:function(a,b){throw new Error("getValue is abstract")},
getValueById:function(a,b){return this.getValue(this.getColumnIndexById(a),b)},
setValue:function(b,c,a){throw new Error("setValue is abstract")},
setValueById:function(b,c,a){this.setValue(this.getColumnIndexById(b),c,a)},
getColumnCount:function(){return this.__O3vqJ.length},
getColumnIndexById:function(a){return this.__9WoOR[a]},
getColumnId:function(a){return this.__O3vqJ[a]},
getColumnName:function(a){return this.__2m0iZ[a]},
setColumnIds:function(a){this.__O3vqJ=a;
this.__9WoOR={};
for(var b=0;
b<a.length;
b++)this.__9WoOR[a[b]]=b;
this.__2m0iZ=new Array(a.length);
this.__98uYg||this.fireEvent("metaDataChanged")},
setColumnNamesByIndex:function(a){if(this.__O3vqJ.length!=a.length)throw new Error("this.__columnIdArr and columnNameArr have different length: "+this.__O3vqJ.length+" != "+a.length);
this.__2m0iZ=a;
this.fireEvent("metaDataChanged")},
setColumnNamesById:function(b){this.__2m0iZ=new Array(this.__O3vqJ.length);
for(var a=0;
a<this.__O3vqJ.length;
++a)this.__2m0iZ[a]=b[this.__O3vqJ[a]]},
setColumns:function(b,a){var c=this.__O3vqJ.length==0||a;
a==null&&(a=this.__O3vqJ.length==0?b:this.__O3vqJ);
if(a.length!=b.length)throw new Error("columnIdArr and columnNameArr have different length: "+a.length+" != "+b.length);
c&&(this.__98uYg=true,this.setColumnIds(a),this.__98uYg=false);
this.setColumnNamesByIndex(b)}},
destruct:function(){this.__O3vqJ=this.__2m0iZ=this.__9WoOR=null}});


// qx.ui.core.MSingleSelectionHandling
//   - size: 1318 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 1x
//       qx, 2x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.ui.core.SingleSelectionManager, 1x
qx.Mixin.define("qx.ui.core.MSingleSelectionHandling",{events:{changeSelection:"qx.event.type.Data"},
members:{__ugn3e:null,
getSelection:function(){var a=this.__IwJpC().getSelected();
return a?[a]:[]},
setSelection:function(a){switch(a.length){case 0:this.resetSelection();
break;
case 1:this.__IwJpC().setSelected(a[0]);
break;
default:throw new Error("Could only select one item, but the selection  array contains "+a.length+" items!")}},
resetSelection:function(){this.__IwJpC().resetSelected()},
isSelected:function(a){return this.__IwJpC().isSelected(a)},
isSelectionEmpty:function(){return this.__IwJpC().isSelectionEmpty()},
getSelectables:function(a){return this.__IwJpC().getSelectables(a)},
_onChangeSelected:function(c){var a=c.getData(),b=c.getOldData();
a==null?a=[]:a=[a];
b==null?b=[]:b=[b];
this.fireDataEvent("changeSelection",a,b)},
__IwJpC:function(){if(this.__ugn3e==null){var a=this;
this.__ugn3e=new qx.ui.core.SingleSelectionManager({getItems:function(){return a._getItems()},
isItemSelectable:function(b){return a._isItemSelectable?a._isItemSelectable(b):b.isVisible()}});
this.__ugn3e.addListener("changeSelected",this._onChangeSelected,this)}this.__ugn3e.setAllowEmptySelection(this._isAllowEmptySelection());
return this.__ugn3e}},
destruct:function(){this._disposeObjects("__manager")}});


// qx.ui.table.model.Simple
//   - size: 5999 bytes
//   - modified: 2010-10-13T17:38:57
//   - names:
//       Array, 3x
//       Error, 1x
//       isNaN, 12x
//       qx, 15x
//       undefined, 1x
//   - packages:
//       Array.prototype.splice.apply, 2x
//       qx.Class.define, 1x
//       qx.lang.Type.isFunction, 1x
//       qx.lang.Type.isNumber, 8x
//       qx.ui.table.model.Abstract, 1x
//       qx.ui.table.model.Simple._defaultSortComparatorAscending, 1x
//       qx.ui.table.model.Simple._defaultSortComparatorDescending, 1x
//       qx.ui.table.model.Simple._defaultSortComparatorInsensitiveAscending, 1x
//       qx.ui.table.model.Simple._defaultSortComparatorInsensitiveDescending, 1x
qx.Class.define("qx.ui.table.model.Simple",{extend:qx.ui.table.model.Abstract,
construct:function(){this.base(arguments);
this.__qvtBo=[];
this.__biI8JZ=-1;
this.__Qj9qV=[];
this.__8iVLk=null},
properties:{caseSensitiveSorting:{check:"Boolean",
init:true}},
statics:{_defaultSortComparatorAscending:function(e,d){var b=e[arguments.callee.columnIndex],a=d[arguments.callee.columnIndex],c;
if(qx.lang.Type.isNumber(b)&&qx.lang.Type.isNumber(a)){c=isNaN(b)?isNaN(a)?0:1:isNaN(a)?-1:null;
if(c!=null)return c}return b>a?1:b==a?0:-1},
_defaultSortComparatorInsensitiveAscending:function(d,c){var b=(d[arguments.callee.columnIndex].toLowerCase?d[arguments.callee.columnIndex].toLowerCase():d[arguments.callee.columnIndex]),a=(c[arguments.callee.columnIndex].toLowerCase?c[arguments.callee.columnIndex].toLowerCase():c[arguments.callee.columnIndex]),e;
if(qx.lang.Type.isNumber(b)&&qx.lang.Type.isNumber(a)){e=isNaN(b)?isNaN(a)?0:1:isNaN(a)?-1:null;
if(e!=null)return e}return b>a?1:b==a?0:-1},
_defaultSortComparatorDescending:function(e,d){var b=e[arguments.callee.columnIndex],a=d[arguments.callee.columnIndex],c;
if(qx.lang.Type.isNumber(b)&&qx.lang.Type.isNumber(a)){c=isNaN(b)?isNaN(a)?0:1:isNaN(a)?-1:null;
if(c!=null)return c}return b<a?1:b==a?0:-1},
_defaultSortComparatorInsensitiveDescending:function(d,c){var b=(d[arguments.callee.columnIndex].toLowerCase?d[arguments.callee.columnIndex].toLowerCase():d[arguments.callee.columnIndex]),a=(c[arguments.callee.columnIndex].toLowerCase?c[arguments.callee.columnIndex].toLowerCase():c[arguments.callee.columnIndex]),e;
if(qx.lang.Type.isNumber(b)&&qx.lang.Type.isNumber(a)){e=isNaN(b)?isNaN(a)?0:1:isNaN(a)?-1:null;
if(e!=null)return e}return b<a?1:b==a?0:-1}},
members:{__qvtBo:null,
__8iVLk:null,
__bahQDi:null,
__Qj9qV:null,
__biI8JZ:null,
__3aMal:null,
getRowData:function(b){var a=this.__qvtBo[b];
return a==null||a.originalData==null?a:a.originalData},
getRowDataAsMap:function(e){var a=this.__qvtBo[e],d,c,b;
if(a!=null){d={},c=0;
for(;
c<this.getColumnCount();
c++)d[this.getColumnId(c)]=a[c];
if(a.originalData!=null)for(b in a.originalData)d[b]==undefined&&(d[b]=a.originalData[b]);
return d}return a&&a.originalData?a.originalData:null},
getDataAsMapArray:function(){for(var c=this.getRowCount(),b=[],a=0;
a<c;
a++)b.push(this.getRowDataAsMap(a));
return b},
setEditable:function(b){this.__8iVLk=[];
for(var a=0;
a<this.getColumnCount();
a++)this.__8iVLk[a]=b;
this.fireEvent("metaDataChanged")},
setColumnEditable:function(b,a){a!=this.isColumnEditable(b)&&(this.__8iVLk==null&&(this.__8iVLk=[]),this.__8iVLk[b]=a,this.fireEvent("metaDataChanged"))},
isColumnEditable:function(a){return this.__8iVLk?this.__8iVLk[a]==true:false},
setColumnSortable:function(b,a){a!=this.isColumnSortable(b)&&(this.__bahQDi==null&&(this.__bahQDi=[]),this.__bahQDi[b]=a,this.fireEvent("metaDataChanged"))},
isColumnSortable:function(a){return this.__bahQDi?this.__bahQDi[a]!==false:true},
sortByColumn:function(c,a){var b,d=this.__Qj9qV[c],e;
b=d?a?d.ascending:d.descending:this.getCaseSensitiveSorting()?a?qx.ui.table.model.Simple._defaultSortComparatorAscending:qx.ui.table.model.Simple._defaultSortComparatorDescending:a?qx.ui.table.model.Simple._defaultSortComparatorInsensitiveAscending:qx.ui.table.model.Simple._defaultSortComparatorInsensitiveDescending;
b.columnIndex=c;
this.__qvtBo.sort(b);
this.__biI8JZ=c;
this.__3aMal=a;
e={columnIndex:c,
ascending:a};
this.fireDataEvent("sorted",e);
this.fireEvent("metaDataChanged")},
setSortMethods:function(c,a){var b;
b=qx.lang.Type.isFunction(a)?{ascending:a,
descending:function(c,b){return a(b,c)}}:a;
this.__Qj9qV[c]=b},
getSortMethods:function(a){return this.__Qj9qV[a]},
clearSorting:function(){this.__biI8JZ!=-1&&(this.__biI8JZ=-1,this.__3aMal=true,this.fireEvent("metaDataChanged"))},
getSortColumnIndex:function(){return this.__biI8JZ},
isSortAscending:function(){return this.__3aMal},
getRowCount:function(){return this.__qvtBo.length},
getValue:function(b,a){if(a<0||a>=this.__qvtBo.length)throw new Error("this.__rowArr out of bounds: "+a+" (0.."+this.__qvtBo.length+")");
return this.__qvtBo[a][b]},
setValue:function(a,b,c){if(this.__qvtBo[b][a]!=c){this.__qvtBo[b][a]=c;
if(this.hasListener("dataChanged")){var d={firstRow:b,
lastRow:b,
firstColumn:a,
lastColumn:a};
this.fireDataEvent("dataChanged",d)}a==this.__biI8JZ&&this.clearSorting()}},
setData:function(a,c){this.__qvtBo=a;
if(this.hasListener("dataChanged")){var b={firstRow:0,
lastRow:a.length-1,
firstColumn:0,
lastColumn:this.getColumnCount()-1};
this.fireDataEvent("dataChanged",b)}c!==false&&this.clearSorting()},
getData:function(){return this.__qvtBo},
setDataAsMapArray:function(b,c,a){this.setData(this._mapArray2RowArr(b,c),a)},
addRows:function(b,a,d){a==null&&(a=this.__qvtBo.length);
b.splice(0,0,a,0);
Array.prototype.splice.apply(this.__qvtBo,b);
var c={firstRow:a,
lastRow:this.__qvtBo.length-1,
firstColumn:0,
lastColumn:this.getColumnCount()-1};
this.fireDataEvent("dataChanged",c);
d!==false&&this.clearSorting()},
addRowsAsMapArray:function(c,b,d,a){this.addRows(this._mapArray2RowArr(c,d),b,a)},
setRows:function(b,a,d){a==null&&(a=0);
b.splice(0,0,a,b.length);
Array.prototype.splice.apply(this.__qvtBo,b);
var c={firstRow:a,
lastRow:this.__qvtBo.length-1,
firstColumn:0,
lastColumn:this.getColumnCount()-1};
this.fireDataEvent("dataChanged",c);
d!==false&&this.clearSorting()},
setRowsAsMapArray:function(c,b,d,a){this.setRows(this._mapArray2RowArr(c,d),b,a)},
removeRows:function(a,b,d){this.__qvtBo.splice(a,b);
var c={firstRow:a,
lastRow:this.__qvtBo.length-1,
firstColumn:0,
lastColumn:this.getColumnCount()-1,
removeStart:a,
removeCount:b};
this.fireDataEvent("dataChanged",c);
d!==false&&this.clearSorting()},
_mapArray2RowArr:function(d,g){for(var e=d.length,h=this.getColumnCount(),f=new Array(e),c,a=0,b;
a<e;
++a){c=[];
g&&(c.originalData=d[a]);
for(b=0;
b<h;
++b)c[b]=d[a][this.getColumnId(b)];
f[a]=c}return f}},
destruct:function(){this.__qvtBo=this.__8iVLk=this.__Qj9qV=this.__bahQDi=null}});


// qx.event.AcceleratingTimer
//   - size: 946 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Math, 1x
//       qx, 3x
//   - packages:
//       Math.max, 1x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.Timer, 1x
qx.Class.define("qx.event.AcceleratingTimer",{extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__mXur6=new qx.event.Timer(this.getInterval());
this.__mXur6.addListener("interval",this._onInterval,this)},
events:{interval:"qx.event.type.Event"},
properties:{interval:{check:"Integer",
init:100},
firstInterval:{check:"Integer",
init:500},
minimum:{check:"Integer",
init:20},
decrease:{check:"Integer",
init:2}},
members:{__mXur6:null,
__bjkOrP:null,
start:function(){this.__mXur6.setInterval(this.getFirstInterval());
this.__mXur6.start()},
stop:function(){this.__mXur6.stop();
this.__bjkOrP=null},
_onInterval:function(){this.__mXur6.stop();
this.__bjkOrP==null&&(this.__bjkOrP=this.getInterval());
this.__bjkOrP=Math.max(this.getMinimum(),this.__bjkOrP-this.getDecrease());
this.__mXur6.setInterval(this.__bjkOrP);
this.__mXur6.start();
this.fireEvent("interval")}},
destruct:function(){this._disposeObjects("__timer")}});


// qx.io.remote.Response
//   - size: 590 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Event, 1x
qx.Class.define("qx.io.remote.Response",{extend:qx.event.type.Event,
properties:{state:{check:"Integer",
nullable:true},
statusCode:{check:"Integer",
nullable:true},
content:{nullable:true},
responseHeaders:{check:"Object",
nullable:true}},
members:{clone:function(b){var a=this.base(arguments,b);
a.setType(this.getType());
a.setState(this.getState());
a.setStatusCode(this.getStatusCode());
a.setContent(this.getContent());
a.setResponseHeaders(this.getResponseHeaders());
return a},
getResponseHeader:function(b){var a=this.getResponseHeaders();
if(a)return a[b]||null;
return null}}});


// qx.data.marshal.MEventBubbling
//   - size: 1214 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 7x
//   - packages:
//       qx.Class.hasInterface, 1x
//       qx.Class.hasMixin, 1x
//       qx.Mixin.define, 1x
//       qx.core.Object, 1x
//       qx.data.IListData, 1x
//       qx.data.marshal.MEventBubbling, 1x
//       qx.lang.Function.bind, 1x
qx.Mixin.define("qx.data.marshal.MEventBubbling",{events:{changeBubble:"qx.event.type.Data"},
members:{_applyEventPropagation:function(a,c,b){this.fireDataEvent("changeBubble",{value:a,
name:b,
old:c});
this._registerEventChaining(a,c,b)},
_registerEventChaining:function(b,a,d){if(b instanceof qx.core.Object&&qx.Class.hasMixin(b.constructor,qx.data.marshal.MEventBubbling)){var e=qx.lang.Function.bind(this.__cmTSDc,this,d),c=b.addListener("changeBubble",e,this);
b.setUserData("idBubble",c)}a!=null&&a.getUserData&&a.getUserData("idBubble")!=null&&a.removeListenerById(a.getUserData("idBubble"))},
__cmTSDc:function(c,f){var a=f.getData(),i=a.value,h=a.old,d,e,g,b,j;
if(qx.Class.hasInterface(f.getTarget().constructor,qx.data.IListData)){if(a.name.indexOf){d=a.name.indexOf(".")!=-1?a.name.indexOf("."):a.name.length,e=a.name.indexOf("[")!=-1?a.name.indexOf("["):a.name.length;
if(d<e){g=a.name.substring(0,d),b=a.name.substring(d+1,a.name.length);
b[0]!="["&&(b="."+b);
j=c+"["+g+"]"+b}else if(e<d){g=a.name.substring(0,e),b=a.name.substring(e,a.name.length),j=c+"["+g+"]"+b}else j=c+"["+a.name+"]"}else j=c+"["+a.name+"]"}else j=c+"."+a.name;
this.fireDataEvent("changeBubble",{value:i,
name:j,
old:h})}}});


// qx.bom.History
//   - size: 1952 bytes
//   - modified: 2010-11-02T16:51:48
//   - names:
//       Error, 2x
//       decodeURIComponent, 1x
//       document, 3x
//       encodeURIComponent, 1x
//       history, 2x
//       qx, 12x
//       window, 4x
//   - packages:
//       document.documentMode, 2x
//       document.title, 1x
//       history.back, 1x
//       history.forward, 1x
//       qx.Class.define, 1x
//       qx.bom.NativeHistory, 2x
//       qx.bom.client.Engine.MSHTML, 2x
//       qx.core.Object, 1x
//       qx.event.Timer.once, 2x
//       qx.lang.Type.isString, 4x
//       window.location, 1x
//       window.location.href, 1x
//       window.location.href.split, 1x
qx.Class.define("qx.bom.History",{extend:qx.core.Object,
type:"abstract",
construct:function(){this.base(arguments);
this._baseUrl=window.location.href.split("#")[0]+"#";
this.__qPPea={};
this._setInitialState()},
events:{request:"qx.event.type.Data"},
statics:{SUPPORTS_HASH_CHANGE_EVENT:qx.bom.client.Engine.MSHTML&&document.documentMode>=8||!qx.bom.client.Engine.MSHTML&&document.documentMode&&"onhashchange"in window,
getInstance:function(){this.$$instance||(this.$$instance=this.SUPPORTS_HASH_CHANGE_EVENT?new qx.bom.NativeHistory():new qx.bom.NativeHistory());
return this.$$instance}},
properties:{title:{check:"String",
event:"changeTitle",
nullable:true,
apply:"_applyTitle"},
state:{check:"String",
event:"changeState",
nullable:true,
apply:"_applyState"}},
members:{__qPPea:null,
_applyState:function(a,b){this._writeState(a)},
_setInitialState:function(){this.setState(this._readState())},
_encode:function(a){if(qx.lang.Type.isString(a))return encodeURIComponent(a);
return""},
_decode:function(a){if(qx.lang.Type.isString(a))return decodeURIComponent(a);
return""},
_applyTitle:function(a){a!=null&&(document.title=a||"")},
addToHistory:function(a,b){qx.lang.Type.isString(a)||(a=a+"");
qx.lang.Type.isString(b)&&(this.setTitle(b),this.__qPPea[a]=b);
this.getState()!==a&&this._writeState(a)},
navigateBack:function(){qx.event.Timer.once(function(){history.back()},0)},
navigateForward:function(){qx.event.Timer.once(function(){history.forward()},0)},
_onHistoryLoad:function(a){this.setState(a);
this.fireDataEvent("request",a);
this.__qPPea[a]!=null&&this.setTitle(this.__qPPea[a])},
_readState:function(){throw new Error("Abstract method call")},
_writeState:function(){throw new Error("Abstract method call")},
_setHash:function(c){var b=this._baseUrl+(c||""),a=window.location;
b!=a.href&&(a.href=b)},
_getHash:function(){var a=/#(.*)$/.exec(window.location.href);
return a&&a[1]?a[1]:""}},
destruct:function(){this.__qPPea=null}});


// qx.bom.NativeHistory
//   - size: 885 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 10x
//       window, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Event.addNativeListener, 1x
//       qx.bom.Event.removeNativeListener, 1x
//       qx.bom.History, 1x
//       qx.bom.History.SUPPORTS_HASH_CHANGE_EVENT, 2x
//       qx.event.Idle.getInstance, 2x
//       qx.lang.Function.bind, 1x
//       qx.lang.Type.isString, 1x
qx.Class.define("qx.bom.NativeHistory",{extend:qx.bom.History,
construct:function(){this.base(arguments);
this.__bhy5Vx()},
members:{__buizmy:null,
__bhy5Vx:function(){qx.bom.History.SUPPORTS_HASH_CHANGE_EVENT?(this.__buizmy=qx.lang.Function.bind(this.__TSXH0,this),qx.bom.Event.addNativeListener(window,"hashchange",this.__buizmy)):qx.event.Idle.getInstance().addListener("interval",this.__TSXH0,this)},
__bpGRyj:function(){qx.bom.History.SUPPORTS_HASH_CHANGE_EVENT?qx.bom.Event.removeNativeListener(window,"hashchange",this.__buizmy):qx.event.Idle.getInstance().removeListener("interval",this.__TSXH0,this)},
__TSXH0:function(){var a=this._readState();
qx.lang.Type.isString(a)&&a!=this.getState()&&this._onHistoryLoad(a)},
_readState:function(){return this._decode(this._getHash())},
_writeState:function(a){this._setHash(this._encode(a))}},
destruct:function(){this.__bpGRyj()}});


// qx.data.Array
//   - size: 5372 bytes
//   - modified: 2010-09-30T14:20:20
//   - names:
//       Array, 3x
//       Error, 1x
//       qx, 10x
//       undefined, 3x
//   - packages:
//       Array.prototype.push.apply, 1x
//       qx.Class.define, 1x
//       qx.core.Assert.assertArray, 1x
//       qx.core.Object, 1x
//       qx.data.Array, 4x
//       qx.data.IListData, 1x
//       qx.data.marshal.MEventBubbling, 1x
//       qx.lang.Array.clone, 1x
qx.Class.define("qx.data.Array",{extend:qx.core.Object,
include:qx.data.marshal.MEventBubbling,
implement:[qx.data.IListData],
construct:function(b){this.base(arguments);
if(b==undefined)this.__mK7fC=[];
else if(arguments.length>1){this.__mK7fC=[];
for(var a=0;
a<arguments.length;
a++)this.__mK7fC.push(arguments[a])}else if(typeof b=="number")this.__mK7fC=new Array(b);
else if(b instanceof Array)this.__mK7fC=qx.lang.Array.clone(b);
else{this.__mK7fC=[];
throw new Error("Type of the parameter not supported!")}for(a=0;
a<this.__mK7fC.length;
a++)this._applyEventPropagation(this.__mK7fC[a],null,a);
this.__VVsdQ()},
events:{change:"qx.event.type.Data",
changeLength:"qx.event.type.Data"},
members:{__mK7fC:null,
concat:function(a){if(a)var b=this.__mK7fC.concat(a);
else b=this.__mK7fC.concat();
return new qx.data.Array(b)},
join:function(a){return this.__mK7fC.join(a)},
pop:function(){var a=this.__mK7fC.pop();
this.__VVsdQ();
this._applyEventPropagation(null,a,this.length-1);
this.fireDataEvent("change",{start:this.length-1,
end:this.length-1,
type:"remove",
items:[a]},null);
return a},
push:function(b){for(var a=0;
a<arguments.length;
a++)this.__mK7fC.push(arguments[a]),this.__VVsdQ(),this._applyEventPropagation(arguments[a],null,this.length-1),this.fireDataEvent("change",{start:this.length-1,
end:this.length-1,
type:"add",
items:[arguments[a]]},null);
return this.length},
reverse:function(){this.__mK7fC.reverse();
this.fireDataEvent("change",{start:0,
end:this.length-1,
type:"order",
items:null},null)},
shift:function(){var a=this.__mK7fC.shift();
this.__VVsdQ();
this._applyEventPropagation(null,a,this.length-1);
this.fireDataEvent("change",{start:0,
end:this.length-1,
type:"remove",
items:[a]},null);
return a},
slice:function(a,b){return new qx.data.Array(this.__mK7fC.slice(a,b))},
splice:function(d,h,j){var c=this.__mK7fC.length,b=this.__mK7fC.splice.apply(this.__mK7fC,arguments),g,i,e,f,a;
this.__mK7fC.length!=c&&this.__VVsdQ();
g=h>0,i=arguments.length>2,e=null;
if(g||i){if(this.__mK7fC.length>c)f="add";
else if(this.__mK7fC.length<c){f="remove";
e=b}else f="order";
this.fireDataEvent("change",{start:d,
end:this.length-1,
type:f,
items:e},null)}for(a=2;
a<arguments.length;
a++)this._registerEventChaining(arguments[a],null,d+a);
this.fireDataEvent("changeBubble",{value:this,
name:"?",
old:b});
for(a=0;
a<b.length;
a++)this._applyEventPropagation(null,b[a],a);
return new qx.data.Array(b)},
sort:function(a){this.__mK7fC.sort.apply(this.__mK7fC,arguments);
this.fireDataEvent("change",{start:0,
end:this.length-1,
type:"order",
items:null},null)},
unshift:function(b){for(var a=arguments.length-1;
a>=0;
a--)this.__mK7fC.unshift(arguments[a]),this.__VVsdQ(),this._applyEventPropagation(arguments[a],null,0),this.fireDataEvent("change",{start:0,
end:this.length-1,
type:"add",
items:[arguments[a]]},null);
return this.length},
toArray:function(){return this.__mK7fC},
getItem:function(a){return this.__mK7fC[a]},
setItem:function(a,b){var c=this.__mK7fC[a];
if(c===b)return;
this.__mK7fC[a]=b;
this._applyEventPropagation(b,c,a);
this.length!=this.__mK7fC.length&&this.__VVsdQ();
this.fireDataEvent("change",{start:a,
end:a,
type:"add",
items:[b]},null)},
getLength:function(){return this.length},
indexOf:function(a){return this.__mK7fC.indexOf(a)},
toString:function(){if(this.__mK7fC!=null)return this.__mK7fC.toString();
return""},
contains:function(a){return this.__mK7fC.indexOf(a)!==-1},
copy:function(){return this.concat()},
insertAt:function(b,a){this.splice(b,0,a)},
insertBefore:function(c,b){var a=this.indexOf(c);
a==-1?this.push(b):this.splice(a,0,b)},
insertAfter:function(c,b){var a=this.indexOf(c);
a==-1||a==this.length-1?this.push(b):this.splice(a+1,0,b)},
removeAt:function(a){return this.splice(a,1).getItem(0)},
removeAll:function(){for(var a=0,b,c;
a<this.__mK7fC.length;
a++)this._applyEventPropagation(null,this.__mK7fC[a],a);
b=this.getLength(),c=this.__mK7fC.concat();
this.__mK7fC.length=0;
this.__VVsdQ();
this.fireDataEvent("change",{start:0,
end:b-1,
type:"remove",
items:c},null)},
append:function(a){a instanceof qx.data.Array&&(a=a.toArray());
qx.core.Assert.assertArray(a,"The parameter must be an array.");
for(var b=0,c;
b<a.length;
b++)this._applyEventPropagation(a[b],null,this.__mK7fC.length+b);
Array.prototype.push.apply(this.__mK7fC,a);
c=this.length;
this.__VVsdQ();
this.fireDataEvent("change",{start:c,
end:this.length-1,
type:"add",
items:a},null)},
remove:function(b){var a=this.indexOf(b);
if(a!=-1){this.splice(a,1);
return b}},
equals:function(b){if(this.length!==b.length)return false;
for(var a=0;
a<this.length;
a++)if(this.getItem(a)!==b.getItem(a))return false;
return true},
sum:function(){for(var b=0,a=0;
a<this.length;
a++)b+=this.getItem(a);
return b},
max:function(){for(var a=this.getItem(0),b=1;
b<this.length;
b++)this.getItem(b)>a&&(a=this.getItem(b));
return a===undefined?null:a},
min:function(){for(var a=this.getItem(0),b=1;
b<this.length;
b++)this.getItem(b)<a&&(a=this.getItem(b));
return a===undefined?null:a},
forEach:function(c,b){for(var a=0;
a<this.__mK7fC.length;
a++)c.call(b,this.__mK7fC[a])},
__VVsdQ:function(){var a=this.length;
this.length=this.__mK7fC.length;
this.fireDataEvent("changeLength",this.length,a)}},
destruct:function(){for(var a=0;
a<this.__mK7fC.length;
a++)this._applyEventPropagation(null,this.__mK7fC[a],a);
this.__mK7fC=null}});


// qx.ui.form.MModelSelection
//   - size: 1228 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 3x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.data.Array, 1x
//       qx.lang.Array.equals, 1x
qx.Mixin.define("qx.ui.form.MModelSelection",{construct:function(){this.__9y1Fq=new qx.data.Array();
this.__9y1Fq.addListener("change",this.__diZBky,this);
this.addListener("changeSelection",this.__cj87eL,this)},
events:{changeModelSelection:"qx.event.type.Data"},
members:{__9y1Fq:null,
__bw6Un0:false,
__cj87eL:function(){if(this.__bw6Un0)return;
for(var a=this.getSelection(),b=[],c=0,d,e;
c<a.length;
c++){d=a[c],e=d.getModel?d.getModel():null;
e!==null&&b.push(e)}b.length===a.length&&this.setModelSelection(b)},
__diZBky:function(){this.__bw6Un0=true;
for(var e=this.getSelectables(true),b=[],f=this.__9y1Fq.toArray(),d=0,g,c,a,i,h;
d<f.length;
d++){g=f[d],c=0;
for(;
c<e.length;
c++){a=e[c],i=a.getModel?a.getModel():null;
if(g===i){b.push(a);
break}}}this.setSelection(b);
this.__bw6Un0=false;
h=this.getSelection();
qx.lang.Array.equals(h,b)||this.__cj87eL()},
getModelSelection:function(){return this.__9y1Fq},
setModelSelection:function(a){if(!a){this.__9y1Fq.removeAll();
return}this.assertArray(a,"Please use an array as parameter.");
a.unshift(this.__9y1Fq.getLength());
a.unshift(0);
var b=this.__9y1Fq.splice.apply(this.__9y1Fq,a);
b.dispose()}},
destruct:function(){this._disposeObjects("__modelSelection")}});


// qx.locale.Date
//   - size: 3412 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 1x
//       qx, 22x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Assert.assertInArray, 10x
//       qx.core.Assert.assertInRange, 1x
//       qx.core.Assert.assertInteger, 1x
//       qx.locale.Date._getTerritory, 3x
//       qx.locale.Date.getDateTimeFormat, 3x
//       qx.locale.Date.getWeekendEnd, 1x
//       qx.locale.Date.getWeekendStart, 1x
//       qx.locale.Manager.getInstance, 1x
qx.Class.define("qx.locale.Date",{statics:{__gQyZ7:qx.locale.Manager.getInstance(),
getAmMarker:function(a){return this.__gQyZ7.localize("cldr_am",[],a)},
getPmMarker:function(a){return this.__gQyZ7.localize("cldr_pm",[],a)},
getDayNames:function(d,f,a){var a=a?a:"format",e,c,b,g;
qx.core.Assert.assertInArray(d,["abbreviated","narrow","wide"]),qx.core.Assert.assertInArray(a,["format","stand-alone"]);
e=["sun","mon","tue","wed","thu","fri","sat"],c=[],b=0;
for(;
b<e.length;
b++){g="cldr_day_"+a+"_"+d+"_"+e[b];
c.push(this.__gQyZ7.localize(g,[],f))}return c},
getDayName:function(c,b,e,a){var a=a?a:"format",d,f;
qx.core.Assert.assertInArray(c,["abbreviated","narrow","wide"]),qx.core.Assert.assertInteger(b),qx.core.Assert.assertInRange(b,0,6),qx.core.Assert.assertInArray(a,["format","stand-alone"]);
d=["sun","mon","tue","wed","thu","fri","sat"],f="cldr_day_"+a+"_"+c+"_"+d[b];
return this.__gQyZ7.localize(f,[],e)},
getMonthNames:function(d,e,a){var a=a?a:"format",c,b,f;
qx.core.Assert.assertInArray(d,["abbreviated","narrow","wide"]),qx.core.Assert.assertInArray(a,["format","stand-alone"]);
c=[],b=0;
for(;
b<12;
b++){f="cldr_month_"+a+"_"+d+"_"+(b+1);
c.push(this.__gQyZ7.localize(f,[],e))}return c},
getMonthName:function(b,c,d,a){var a=a?a:"format",e;
qx.core.Assert.assertInArray(b,["abbreviated","narrow","wide"]),qx.core.Assert.assertInArray(a,["format","stand-alone"]);
e="cldr_month_"+a+"_"+b+"_"+(c+1);
return this.__gQyZ7.localize(e,[],d)},
getDateFormat:function(a,c){qx.core.Assert.assertInArray(a,["short","medium","long","full"]);
var b="cldr_date_format_"+a;
return this.__gQyZ7.localize(b,[],c)},
getDateTimeFormat:function(c,d,e){var b="cldr_date_time_format_"+c,a=this.__gQyZ7.localize(b,[],e);
a==b&&(a=d);
return a},
getTimeFormat:function(a,d){qx.core.Assert.assertInArray(a,["short","medium","long","full"]);
var b="cldr_time_format_"+a,c=this.__gQyZ7.localize(b,[],d);
if(c!=b)return c;
switch(a){case"short":case"medium":return qx.locale.Date.getDateTimeFormat("HHmm","HH:mm");
case"long":return qx.locale.Date.getDateTimeFormat("HHmmss","HH:mm:ss");
case"full":return qx.locale.Date.getDateTimeFormat("HHmmsszz","HH:mm:ss zz");
default:throw new Error("This case should never happen.")}},
getWeekStart:function(c){var b={MV:5,
AE:6,
AF:6,
BH:6,
DJ:6,
DZ:6,
EG:6,
ER:6,
ET:6,
IQ:6,
IR:6,
JO:6,
KE:6,
KW:6,
LB:6,
LY:6,
MA:6,
OM:6,
QA:6,
SA:6,
SD:6,
SO:6,
TN:6,
YE:6,
AS:0,
AU:0,
AZ:0,
BW:0,
CA:0,
CN:0,
FO:0,
GE:0,
GL:0,
GU:0,
HK:0,
IE:0,
IL:0,
IS:0,
JM:0,
JP:0,
KG:0,
KR:0,
LA:0,
MH:0,
MN:0,
MO:0,
MP:0,
MT:0,
NZ:0,
PH:0,
PK:0,
SG:0,
TH:0,
TT:0,
TW:0,
UM:0,
US:0,
UZ:0,
VI:0,
ZA:0,
ZW:0,
MW:0,
NG:0,
TJ:0},a=qx.locale.Date._getTerritory(c);
return b[a]!=null?b[a]:1},
getWeekendStart:function(c){var a={EG:5,
IL:5,
SY:5,
IN:0,
AE:4,
BH:4,
DZ:4,
IQ:4,
JO:4,
KW:4,
LB:4,
LY:4,
MA:4,
OM:4,
QA:4,
SA:4,
SD:4,
TN:4,
YE:4},b=qx.locale.Date._getTerritory(c);
return a[b]!=null?a[b]:6},
getWeekendEnd:function(c){var b={AE:5,
BH:5,
DZ:5,
IQ:5,
JO:5,
KW:5,
LB:5,
LY:5,
MA:5,
OM:5,
QA:5,
SA:5,
SD:5,
TN:5,
YE:5,
AF:5,
IR:5,
EG:6,
IL:6,
SY:6},a=qx.locale.Date._getTerritory(c);
return b[a]!=null?b[a]:0},
isWeekend:function(a,d){var b=qx.locale.Date.getWeekendStart(d),c=qx.locale.Date.getWeekendEnd(d);
return c>b?a>=b&&a<=c:a>=b||a<=c},
_getTerritory:function(a){if(a)var b=a.split("_")[1]||a;
else b=this.__gQyZ7.getTerritory()||this.__gQyZ7.getLanguage();
return b.toUpperCase()}}});


// qx.locale.Number
//   - size: 398 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.locale.Manager.getInstance, 3x
qx.Class.define("qx.locale.Number",{statics:{getDecimalSeparator:function(a){return qx.locale.Manager.getInstance().localize("cldr_number_decimal_separator",[],a)},
getGroupSeparator:function(a){return qx.locale.Manager.getInstance().localize("cldr_number_group_separator",[],a)},
getPercentFormat:function(a){return qx.locale.Manager.getInstance().localize("cldr_number_percent_format",[],a)}}});


// qx.ui.core.selection.Abstract
//   - size: 14110 bytes
//   - modified: 2010-09-13T20:08:24
//   - names:
//       Error, 23x
//       Math, 4x
//       qx, 10x
//       undefined, 1x
//   - packages:
//       Math.max, 2x
//       Math.min, 2x
//       qx.Class.define, 1x
//       qx.bom.client.Platform.MAC, 3x
//       qx.core.Object, 1x
//       qx.event.Timer, 1x
//       qx.lang.Object.getValues, 2x
//       qx.lang.Object.hasMinLength, 1x
//       qx.lang.Object.isEmpty, 1x
qx.Class.define("qx.ui.core.selection.Abstract",{type:"abstract",
extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__EoIRJ={}},
events:{changeSelection:"qx.event.type.Data"},
properties:{mode:{check:["single","multi","additive","one"],
init:"single",
apply:"_applyMode"},
drag:{check:"Boolean",
init:false},
quick:{check:"Boolean",
init:false}},
members:{__P57VS:0,
__P6oYV:0,
__P26oJ:null,
__O0cQL:null,
__yPTuQ:null,
__yQaxT:null,
__1QPAt:null,
__IYeiZ:null,
__IYvl2:null,
__DncyQ:null,
__qLYxo:null,
__qMfAr:null,
__9Ykah:null,
__9YBdk:null,
__bzad2w:null,
__bqLXuw:null,
__ycir2:null,
__EoIRJ:null,
__I2C5B:null,
__bRkypK:null,
_userInteraction:false,
getSelectionContext:function(){return this.__bqLXuw},
selectAll:function(){var a=this.getMode();
if(a=="single"||a=="one")throw new Error("Can not select all items in selection mode: "+a);
this._selectAllItems();
this._fireChange()},
selectItem:function(a){this._setSelectedItem(a);
var b=this.getMode();
b!=="single"&&b!=="one"&&(this._setLeadItem(a),this._setAnchorItem(a));
this._scrollItemIntoView(a);
this._fireChange()},
addItem:function(a){var b=this.getMode();
b==="single"||b==="one"?this._setSelectedItem(a):(this._getAnchorItem()||this._setAnchorItem(a),this._setLeadItem(a),this._addToSelection(a));
this._scrollItemIntoView(a);
this._fireChange()},
removeItem:function(a){this._removeFromSelection(a);
if(this.getMode()==="one"&&this.isSelectionEmpty()){var b=this._getFirstSelectable();
b&&this.addItem(b);
if(b==a)return}this.getLeadItem()==a&&this._setLeadItem(null);
this._getAnchorItem()==a&&this._setAnchorItem(null);
this._fireChange()},
selectItemRange:function(c,b){var a=this.getMode();
if(a=="single"||a=="one")throw new Error("Can not select multiple items in selection mode: "+a);
this._selectItemRange(c,b);
this._setAnchorItem(c);
this._setLeadItem(b);
this._scrollItemIntoView(b);
this._fireChange()},
clearSelection:function(){if(this.getMode()=="one")return;
this._clearSelection();
this._setLeadItem(null);
this._setAnchorItem(null);
this._fireChange()},
replaceSelection:function(a){var b=this.getMode();
if(b=="one"||b==="single"){if(a.length>1)throw new Error("Could not select more than one items in mode: "+b+"!");
a.length==1?this.selectItem(a[0]):this.clearSelection();
return}this._replaceMultiSelection(a)},
getSelectedItem:function(){var a=this.getMode();
if(a==="single"||a==="one")return this._getSelectedItem()||null;
throw new Error("The method getSelectedItem() is only supported in 'single' and 'one' selection mode!")},
getSelection:function(){return qx.lang.Object.getValues(this.__EoIRJ)},
getSortedSelection:function(){var a=this.getSelectables(),b=qx.lang.Object.getValues(this.__EoIRJ);
b.sort(function(c,b){return a.indexOf(c)-a.indexOf(b)});
return b},
isItemSelected:function(b){var a=this._selectableToHashCode(b);
return this.__EoIRJ[a]!==undefined},
isSelectionEmpty:function(){return qx.lang.Object.isEmpty(this.__EoIRJ)},
invertSelection:function(){var b=this.getMode(),c,a;
if(b==="single"||b==="one")throw new Error("The method invertSelection() is only supported in 'multi' and 'additive' selection mode!");
c=this.getSelectables(),a=0;
for(;
a<c.length;
a++)this._toggleInSelection(c[a]);
this._fireChange()},
_setLeadItem:function(a){var b=this.__ycir2;
b!==null&&this._styleSelectable(b,"lead",false);
a!==null&&this._styleSelectable(a,"lead",true);
this.__ycir2=a},
getLeadItem:function(){return this.__ycir2!==null?this.__ycir2:null},
_setAnchorItem:function(a){var b=this.__I2C5B;
b&&this._styleSelectable(b,"anchor",false);
a&&this._styleSelectable(a,"anchor",true);
this.__I2C5B=a},
_getAnchorItem:function(){return this.__I2C5B!==null?this.__I2C5B:null},
_isSelectable:function(a){throw new Error("Abstract method call: _isSelectable()")},
_getSelectableFromMouseEvent:function(b){var a=b.getTarget();
return this._isSelectable(a)?a:null},
_selectableToHashCode:function(a){throw new Error("Abstract method call: _selectableToHashCode()")},
_styleSelectable:function(c,b,a){throw new Error("Abstract method call: _styleSelectable()")},
_capture:function(){throw new Error("Abstract method call: _capture()")},
_releaseCapture:function(){throw new Error("Abstract method call: _releaseCapture()")},
_getLocation:function(){throw new Error("Abstract method call: _getLocation()")},
_getDimension:function(){throw new Error("Abstract method call: _getDimension()")},
_getSelectableLocationX:function(a){throw new Error("Abstract method call: _getSelectableLocationX()")},
_getSelectableLocationY:function(a){throw new Error("Abstract method call: _getSelectableLocationY()")},
_getScroll:function(){throw new Error("Abstract method call: _getScroll()")},
_scrollBy:function(b,a){throw new Error("Abstract method call: _scrollBy()")},
_scrollItemIntoView:function(a){throw new Error("Abstract method call: _scrollItemIntoView()")},
getSelectables:function(a){throw new Error("Abstract method call: getSelectables()")},
_getSelectableRange:function(a,b){throw new Error("Abstract method call: _getSelectableRange()")},
_getFirstSelectable:function(){throw new Error("Abstract method call: _getFirstSelectable()")},
_getLastSelectable:function(){throw new Error("Abstract method call: _getLastSelectable()")},
_getRelatedSelectable:function(b,a){throw new Error("Abstract method call: _getRelatedSelectable()")},
_getPage:function(a,b){throw new Error("Abstract method call: _getPage()")},
_applyMode:function(b,c){this._setLeadItem(null);
this._setAnchorItem(null);
this._clearSelection();
if(b==="one"){var a=this._getFirstSelectable();
a&&(this._setSelectedItem(a),this._scrollItemIntoView(a))}this._fireChange()},
handleMouseOver:function(c){this._userInteraction=true;
if(!this.getQuick()){this._userInteraction=false;
return}var a=this.getMode(),b;
if(a!=="one"&&a!=="single"){this._userInteraction=false;
return}b=this._getSelectableFromMouseEvent(c);
if(b===null){this._userInteraction=false;
return}this._setSelectedItem(b);
this._fireChange("quick");
this._userInteraction=false},
handleMouseDown:function(b){this._userInteraction=true;
var a=this._getSelectableFromMouseEvent(b),d,e,c,f;
if(a===null){this._userInteraction=false;
return}d=b.isCtrlPressed()||qx.bom.client.Platform.MAC&&b.isMetaPressed(),e=b.isShiftPressed();
if(this.isItemSelected(a)&&!e&&!d&&!this.getDrag()){this.__bRkypK=a;
this._userInteraction=false;
return}this.__bRkypK=null;
this._scrollItemIntoView(a);
switch(this.getMode()){case"single":case"one":this._setSelectedItem(a);
break;
case"additive":this._setLeadItem(a);
this._setAnchorItem(a);
this._toggleInSelection(a);
break;
case"multi":this._setLeadItem(a);
if(e){c=this._getAnchorItem();
c===null&&(c=this._getFirstSelectable(),this._setAnchorItem(c));
this._selectItemRange(c,a,d)}else d?(this._setAnchorItem(a),this._toggleInSelection(a)):(this._setAnchorItem(a),this._setSelectedItem(a));
break}f=this.getMode();
this.getDrag()&&f!=="single"&&f!=="one"&&!e&&!d&&(this.__1QPAt=this._getLocation(),this.__O0cQL=this._getScroll(),this.__IYeiZ=b.getDocumentLeft()+this.__O0cQL.left,this.__IYvl2=b.getDocumentTop()+this.__O0cQL.top,this.__DncyQ=true,this._capture());
this._fireChange("click");
this._userInteraction=false},
handleMouseUp:function(b){this._userInteraction=true;
var d=b.isCtrlPressed()||qx.bom.client.Platform.MAC&&b.isMetaPressed(),e=b.isShiftPressed(),a,c;
if(!d&&!e&&this.__bRkypK){a=this._getSelectableFromMouseEvent(b);
if(a===null||!this.isItemSelected(a)){this._userInteraction=false;
return}c=this.getMode();
c==="additive"?this._removeFromSelection(a):(this._setSelectedItem(a),this.getMode()==="multi"&&(this._setLeadItem(a),this._setAnchorItem(a)));
this._userInteraction=false}this._cleanup()},
handleLoseCapture:function(a){this._cleanup()},
handleMouseMove:function(b){if(!this.__DncyQ)return;
this.__qLYxo=b.getDocumentLeft();
this.__qMfAr=b.getDocumentTop();
this._userInteraction=true;
var d=this.__qLYxo+this.__O0cQL.left,c,a;
this.__9Ykah=d>this.__IYeiZ?1:d<this.__IYeiZ?-1:0;
c=this.__qMfAr+this.__O0cQL.top;
this.__9YBdk=c>this.__IYvl2?1:c<this.__IYvl2?-1:0;
a=this.__1QPAt;
this.__P57VS=this.__qLYxo<a.left?this.__qLYxo-a.left:this.__qLYxo>a.right?this.__qLYxo-a.right:0;
this.__P6oYV=this.__qMfAr<a.top?this.__qMfAr-a.top:this.__qMfAr>a.bottom?this.__qMfAr-a.bottom:0;
this.__P26oJ||(this.__P26oJ=new qx.event.Timer(100),this.__P26oJ.addListener("interval",this._onInterval,this));
this.__P26oJ.start();
this._autoSelect();
b.stopPropagation();
this._userInteraction=false},
handleAddItem:function(a){var b=a.getData();
this.getMode()==="one"&&this.isSelectionEmpty()&&this.addItem(b)},
handleRemoveItem:function(a){this.removeItem(a.getData())},
_cleanup:function(){if(!this.getDrag()&&this.__DncyQ)return;
this.__bzad2w&&this._fireChange("click");
delete this.__DncyQ;
delete this.__yPTuQ;
delete this.__yQaxT;
this._releaseCapture();
this.__P26oJ&&this.__P26oJ.stop()},
_onInterval:function(a){this._scrollBy(this.__P57VS,this.__P6oYV);
this.__O0cQL=this._getScroll();
this._autoSelect()},
_autoSelect:function(){var l=this._getDimension(),g=Math.max(0,Math.min(this.__qLYxo-this.__1QPAt.left,l.width))+this.__O0cQL.left,h=Math.max(0,Math.min(this.__qMfAr-this.__1QPAt.top,l.height))+this.__O0cQL.top,b,a,f,d,j,e,c,i,k;
if(this.__yPTuQ===g&&this.__yQaxT===h)return;
this.__yPTuQ=g;
this.__yQaxT=h;
b=this._getAnchorItem(),a=b,f=this.__9Ykah;
while(f!==0){d=f>0?this._getRelatedSelectable(a,"right"):this._getRelatedSelectable(a,"left");
if(d!==null){j=this._getSelectableLocationX(d);
if(f>0&&j.left<=g||f<0&&j.right>=g){a=d;
continue}}break}e=this.__9YBdk;
while(e!==0){c=e>0?this._getRelatedSelectable(a,"under"):this._getRelatedSelectable(a,"above");
if(c!==null){i=this._getSelectableLocationY(c);
if(e>0&&i.top<=h||e<0&&i.bottom>=h){a=c;
continue}}break}k=this.getMode();
k==="multi"?this._selectItemRange(b,a):k==="additive"&&(this.isItemSelected(b)?this._selectItemRange(b,a,true):this._deselectItemRange(b,a),this._setAnchorItem(a));
this._fireChange("drag")},
__baAxYd:{Home:1,
Down:1,
Right:1,
PageDown:1,
End:1,
Up:1,
Left:1,
PageUp:1},
handleKeyPress:function(e){this._userInteraction=true;
var b,a,d=e.getKeyIdentifier(),c=this.getMode(),g=e.isCtrlPressed()||qx.bom.client.Platform.MAC&&e.isMetaPressed(),j=e.isShiftPressed(),f=false,i,h;
if(d==="A"&&g)c!=="single"&&c!=="one"&&(this._selectAllItems(),f=true);
else if(d==="Escape")c!=="single"&&c!=="one"&&(this._clearSelection(),f=true);
else if(d==="Space"){i=this.getLeadItem();
i&&!j&&(g||c==="additive"?this._toggleInSelection(i):this._setSelectedItem(i),f=true)}else if(this.__baAxYd[d]){f=true;
b=c==="single"||c=="one"?this._getSelectedItem():this.getLeadItem();
if(b!==null)switch(d){case"Home":a=this._getFirstSelectable();
break;
case"End":a=this._getLastSelectable();
break;
case"Up":a=this._getRelatedSelectable(b,"above");
break;
case"Down":a=this._getRelatedSelectable(b,"under");
break;
case"Left":a=this._getRelatedSelectable(b,"left");
break;
case"Right":a=this._getRelatedSelectable(b,"right");
break;
case"PageUp":a=this._getPage(b,true);
break;
case"PageDown":a=this._getPage(b,false);
break}else switch(d){case"Home":case"Down":case"Right":case"PageDown":a=this._getFirstSelectable();
break;
case"End":case"Up":case"Left":case"PageUp":a=this._getLastSelectable();
break}if(a!==null){switch(c){case"single":case"one":this._setSelectedItem(a);
break;
case"additive":this._setLeadItem(a);
break;
case"multi":if(j){h=this._getAnchorItem();
h===null&&this._setAnchorItem(h=this._getFirstSelectable());
this._setLeadItem(a);
this._selectItemRange(h,a,g)}else this._setAnchorItem(a),this._setLeadItem(a),g||this._setSelectedItem(a);
break}this._scrollItemIntoView(a)}}f&&(e.stop(),this._fireChange("key"));
this._userInteraction=false},
_selectAllItems:function(){for(var b=this.getSelectables(),a=0,c=b.length;
a<c;
a++)this._addToSelection(b[a])},
_clearSelection:function(){var b=this.__EoIRJ,a;
for(a in b)this._removeFromSelection(b[a]);
this.__EoIRJ={}},
_selectItemRange:function(g,h,i){var a=this._getSelectableRange(g,h),d,e,c,b,f;
if(!i){d=this.__EoIRJ,e=this.__IPYPF(a);
for(c in d)e[c]||this._removeFromSelection(d[c])}for(b=0,f=a.length;
b<f;
b++)this._addToSelection(a[b])},
_deselectItemRange:function(d,e){for(var b=this._getSelectableRange(d,e),a=0,c=b.length;
a<c;
a++)this._removeFromSelection(b[a])},
__IPYPF:function(d){for(var c={},a,b=0,e=d.length;
b<e;
b++)a=d[b],c[this._selectableToHashCode(a)]=a;
return c},
_getSelectedItem:function(){for(var a in this.__EoIRJ)return this.__EoIRJ[a];
return null},
_setSelectedItem:function(a){if(this._isSelectable(a)){var b=this.__EoIRJ,c=this._selectableToHashCode(a);
(!b[c]||qx.lang.Object.hasMinLength(b,2))&&(this._clearSelection(),this._addToSelection(a))}},
_addToSelection:function(a){var b=this._selectableToHashCode(a);
!this.__EoIRJ[b]&&this._isSelectable(a)&&(this.__EoIRJ[b]=a,this._styleSelectable(a,"selected",true),this.__bzad2w=true)},
_toggleInSelection:function(a){var b=this._selectableToHashCode(a);
this.__EoIRJ[b]?(delete this.__EoIRJ[b],this._styleSelectable(a,"selected",false)):(this.__EoIRJ[b]=a,this._styleSelectable(a,"selected",true));
this.__bzad2w=true},
_removeFromSelection:function(b){var a=this._selectableToHashCode(b);
this.__EoIRJ[a]!=null&&(delete this.__EoIRJ[a],this._styleSelectable(b,"selected",false),this.__bzad2w=true)},
_replaceMultiSelection:function(f){for(var e=false,b,a,c={},g=0,j=f.length,h,i,d;
g<j;
g++)b=f[g],this._isSelectable(b)&&(a=this._selectableToHashCode(b),c[a]=b);
h=f[0],i=b,d=this.__EoIRJ;
for(a in d)c[a]?delete c[a]:(b=d[a],delete d[a],this._styleSelectable(b,"selected",false),e=true);
for(a in c)b=d[a]=c[a],this._styleSelectable(b,"selected",true),e=true;
if(!e)return false;
this._scrollItemIntoView(i);
this._setLeadItem(h);
this._setAnchorItem(h);
this.__bzad2w=true;
this._fireChange()},
_fireChange:function(a){this.__bzad2w&&(this.__bqLXuw=a||null,this.fireDataEvent("changeSelection",this.getSelection()),delete this.__bzad2w)}},
destruct:function(){this._disposeObjects("__scrollTimer");
this.__EoIRJ=this.__bRkypK=this.__I2C5B=null;
this.__ycir2=null}});


// qx.util.format.DateFormat
//   - size: 9565 bytes
//   - modified: 2010-09-13T20:08:24
//   - names:
//       Date, 4x
//       Error, 4x
//       Math, 6x
//       RegExp, 1x
//       parseInt, 5x
//       qx, 35x
//   - packages:
//       Math.abs, 4x
//       Math.floor, 2x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.lang.String, 1x
//       qx.lang.String.escapeRegexpChars, 1x
//       qx.locale.Date.getAmMarker, 2x
//       qx.locale.Date.getDateFormat, 3x
//       qx.locale.Date.getDateTimeFormat, 2x
//       qx.locale.Date.getDayName, 6x
//       qx.locale.Date.getDayNames, 3x
//       qx.locale.Date.getMonthName, 4x
//       qx.locale.Date.getMonthNames, 2x
//       qx.locale.Date.getPmMarker, 3x
//       qx.locale.Manager.getInstance, 1x
//       qx.util.format.DateFormat, 4x
//       qx.util.format.IFormat, 1x
qx.Class.define("qx.util.format.DateFormat",{extend:qx.core.Object,
implement:qx.util.format.IFormat,
construct:function(a,b){this.base(arguments);
this.__qi6oJ=b?b:qx.locale.Manager.getInstance().getLocale();
this.__qxFZQ=a!=null?a.toString():qx.locale.Date.getDateFormat("long",this.__qi6oJ)+" "+qx.locale.Date.getDateTimeFormat("HHmmss","HH:mm:ss",this.__qi6oJ)},
statics:{getDateTimeInstance:function(){var a=qx.util.format.DateFormat,b=qx.locale.Date.getDateFormat("long")+" "+qx.locale.Date.getDateTimeFormat("HHmmss","HH:mm:ss");
(a._dateInstance==null||a._dateInstance.__qxFZQ!=b)&&(a._dateTimeInstance=new a());
return a._dateTimeInstance},
getDateInstance:function(){var a=qx.util.format.DateFormat,b=qx.locale.Date.getDateFormat("short")+"";
(a._dateInstance==null||a._dateInstance.__qxFZQ!=b)&&(a._dateInstance=new a(b));
return a._dateInstance},
ASSUME_YEAR_2000_THRESHOLD:30,
LOGGING_DATE_TIME__format:"yyyy-MM-dd HH:mm:ss",
AM_MARKER:"am",
PM_MARKER:"pm",
MEDIUM_TIMEZONE_NAMES:["GMT"],
FULL_TIMEZONE_NAMES:["Greenwich Mean Time"]},
members:{__qi6oJ:null,
__qxFZQ:null,
__DJKy2:null,
__JMPjt:null,
__JNnpk:null,
__I7iVf:function(b,c){var a=""+b;
while(a.length<c)a="0"+a;
return a},
__TJS5V:function(c){var a=new Date(c.getTime()),b=a.getDate();
while(a.getMonth()!=0)a.setDate(-1),b+=a.getDate()+1;
return b},
__bIzJQk:function(a){return new Date(a.getTime()+(3-(a.getDay()+6)%7)*86400000)},
__0S9XH:function(d){var a=this.__bIzJQk(d),b=a.getFullYear(),c=this.__bIzJQk(new Date(b,0,4));
return Math.floor(1.5+(a.getTime()-c.getTime())/86400000/7)},
format:function(c){if(c==null)return null;
var p=qx.util.format.DateFormat,d=this.__qi6oJ,n=c.getFullYear(),f=c.getMonth(),t=c.getDate(),g=c.getDay(),e=c.getHours(),q=c.getMinutes(),s=c.getSeconds(),r=c.getMilliseconds(),k=c.getTimezoneOffset(),o=k>0?1:-1,j=Math.floor(Math.abs(k)/60),m=Math.abs(k)%60,l,h,i,u,b,a;
this.__9Sg5w();
l="",h=0;
for(;
h<this.__JNnpk.length;
h++){i=this.__JNnpk[h];
if(i.type=="literal")l+=i.text;
else{u=i.character,b=i.size,a="?";
switch(u){case"y":case"Y":if(b==2)a=this.__I7iVf(n%100,2);
else{a=n+"";
if(b>a.length)for(h=a.length;
h<b;
h++)a="0"+a};
break;
case"D":a=this.__I7iVf(this.__TJS5V(c),b);
break;
case"d":a=this.__I7iVf(t,b);
break;
case"w":a=this.__I7iVf(this.__0S9XH(c),b);
break;
case"E":b==2?a=qx.locale.Date.getDayName("narrow",g,d,"format"):b==3?a=qx.locale.Date.getDayName("abbreviated",g,d,"format"):b==4&&(a=qx.locale.Date.getDayName("wide",g,d,"format"));
break;
case"c":b==2?a=qx.locale.Date.getDayName("narrow",g,d,"stand-alone"):b==3?a=qx.locale.Date.getDayName("abbreviated",g,d,"stand-alone"):b==4&&(a=qx.locale.Date.getDayName("wide",g,d,"stand-alone"));
break;
case"M":b==1||b==2?a=this.__I7iVf(f+1,b):b==3?a=qx.locale.Date.getMonthName("abbreviated",f,d,"format"):b==4&&(a=qx.locale.Date.getMonthName("wide",f,d,"format"));
break;
case"L":b==1||b==2?a=this.__I7iVf(f+1,b):b==3?a=qx.locale.Date.getMonthName("abbreviated",f,d,"stand-alone"):b==4&&(a=qx.locale.Date.getMonthName("wide",f,d,"stand-alone"));
break;
case"a":a=e<12?qx.locale.Date.getAmMarker(d):qx.locale.Date.getPmMarker(d);
break;
case"H":a=this.__I7iVf(e,b);
break;
case"k":a=this.__I7iVf(e==0?24:e,b);
break;
case"K":a=this.__I7iVf(e%12,b);
break;
case"h":a=this.__I7iVf(e%12==0?12:e%12,b);
break;
case"m":a=this.__I7iVf(q,b);
break;
case"s":a=this.__I7iVf(s,b);
break;
case"S":a=this.__I7iVf(r,b);
break;
case"z":b==1?a="GMT"+(o>0?"-":"+")+this.__I7iVf(Math.abs(j))+":"+this.__I7iVf(m,2):b==2?a=p.MEDIUM_TIMEZONE_NAMES[j]:b==3&&(a=p.FULL_TIMEZONE_NAMES[j]);
break;
case"Z":a=(o>0?"-":"+")+this.__I7iVf(Math.abs(j),2)+this.__I7iVf(m,2);
break}l+=a}}return l},
parse:function(d){this.__11yuc();
var f=this.__DJKy2.regex.exec(d),a,h,e,b,g,c;
if(f==null)throw new Error("Date string '"+d+"' does not match the date format: "+this.__qxFZQ);
a={year:1970,
month:0,
day:1,
hour:0,
ispm:false,
min:0,
sec:0,
ms:0},h=1,e=0;
for(;
e<this.__DJKy2.usedRules.length;
e++){b=this.__DJKy2.usedRules[e],g=f[h];
b.field!=null?a[b.field]=parseInt(g,10):b.manipulator(a,g);
h+=b.groups==null?1:b.groups}c=new Date(a.year,a.month,a.day,a.ispm?a.hour+12:a.hour,a.min,a.sec,a.ms);
if(a.month!=c.getMonth()||a.year!=c.getFullYear())throw new Error("Error parsing date '"+d+"': the value for day or month is too large");
return c},
__9Sg5w:function(){if(this.__JNnpk!=null)return;
this.__JNnpk=[];
var e,g=0,c="",f=this.__qxFZQ,d="default",a=0,b,h;
while(a<f.length){b=f.charAt(a);
switch(d){case"quoted_literal":if(b=="'"){if(a+1>=f.length){a++;
break}h=f.charAt(a+1);
h=="'"?(c+=b,a++):(a++,d="unkown")}else c+=b,a++;
break;
case"wildcard":b==e?(g++,a++):(this.__JNnpk.push({type:"wildcard",
character:e,
size:g}),e=null,g=0,d="default");
break;
default:if(b>="a"&&b<="z"||b>="A"&&b<="Z")e=b,d="wildcard";
else if(b=="'"){if(a+1>=f.length){c+=b;
a++;
break}h=f.charAt(a+1);
h=="'"&&(c+=b,a++);
a++;
d="quoted_literal"}else d="default";
d!="default"?c.length>0&&(this.__JNnpk.push({type:"literal",
text:c}),c=""):(c+=b,a++);
break}}e!=null?this.__JNnpk.push({type:"wildcard",
character:e,
size:g}):c.length>0&&this.__JNnpk.push({type:"literal",
text:c})},
__11yuc:function(){if(this.__DJKy2!=null)return;
var k=this.__qxFZQ,g,a,f,b,l,j,c,d,e,h,i,m;
this.__9RIZF();
this.__9Sg5w();
g=[],a="^",f=0;
for(;
f<this.__JNnpk.length;
f++){b=this.__JNnpk[f];
if(b.type=="literal")a+=qx.lang.String.escapeRegexpChars(b.text);
else{l=b.character,j=b.size,d=0;
for(;
d<this.__JMPjt.length;
d++){e=this.__JMPjt[d];
if(l==e.pattern.charAt(0)&&j==e.pattern.length){c=e;
break}}if(c==null){h="",i=0;
for(;
i<j;
i++)h+=l;
throw new Error("Malformed date format: "+k+". Wildcard "+h+" is not supported")}g.push(c),a+=c.regex}}a+="$";
try{m=new RegExp(a)}catch(n){throw new Error("Malformed date format: "+k)}this.__DJKy2={regex:m,
usedRules:g,
pattern:a}},
__9RIZF:function(){var j=qx.util.format.DateFormat,c=qx.lang.String,a,u,p,d,k,s,l,n,m,e,b,r,i,t,h,o,f,q,g,v;
if(this.__JMPjt!=null)return;
a=this.__JMPjt=[],u=qx.locale.Date.getAmMarker(this.__qi6oJ).toString()||j.AM_MARKER,p=qx.locale.Date.getPmMarker(this.__qi6oJ).toString()||j.PM_MARKER,d=function(b,a){a=parseInt(a,10);
a<j.ASSUME_YEAR_2000_THRESHOLD?a+=2000:a<100&&(a+=1900);
b.year=a},k=function(b,a){b.month=parseInt(a,10)-1},s=function(c,b){var a=qx.locale.Date.getPmMarker(this.__qi6oJ).toString()||j.PM_MARKER;
c.ispm=b==a},l=function(b,a){b.hour=parseInt(a,10)%24},n=function(b,a){b.hour=parseInt(a,10)%12},m=function(b,a){return},e=qx.locale.Date.getMonthNames("abbreviated",this.__qi6oJ,"format"),b=0;
for(;
b<e.length;
b++)e[b]=c.escapeRegexpChars(e[b].toString());
r=function(b,a){a=c.escapeRegexpChars(a);
b.month=e.indexOf(a)},i=qx.locale.Date.getMonthNames("wide",this.__qi6oJ,"format"),b=0;
for(;
b<i.length;
b++)i[b]=c.escapeRegexpChars(i[b].toString());
t=function(b,a){a=c.escapeRegexpChars(a);
b.month=i.indexOf(a)},h=qx.locale.Date.getDayNames("narrow",this.__qi6oJ,"format"),b=0;
for(;
b<h.length;
b++)h[b]=c.escapeRegexpChars(h[b].toString());
o=function(b,a){a=c.escapeRegexpChars(a);
b.month=h.indexOf(a)},f=qx.locale.Date.getDayNames("abbreviated",this.__qi6oJ,"format"),b=0;
for(;
b<f.length;
b++)f[b]=c.escapeRegexpChars(f[b].toString());
q=function(b,a){a=c.escapeRegexpChars(a);
b.month=f.indexOf(a)},g=qx.locale.Date.getDayNames("wide",this.__qi6oJ,"format"),b=0;
for(;
b<g.length;
b++)g[b]=c.escapeRegexpChars(g[b].toString());
v=function(b,a){a=c.escapeRegexpChars(a);
b.month=g.indexOf(a)};
a.push({pattern:"YYYY",
regex:"(\\d\\d\\d\\d)",
manipulator:d});
a.push({pattern:"y",
regex:"(\\d+)",
manipulator:d});
a.push({pattern:"yy",
regex:"(\\d\\d+)",
manipulator:d});
a.push({pattern:"yyy",
regex:"(\\d\\d\\d+)",
manipulator:d});
a.push({pattern:"yyyy",
regex:"(\\d\\d\\d\\d+)",
manipulator:d});
a.push({pattern:"yyyyy",
regex:"(\\d\\d\\d\\d\\d+)",
manipulator:d});
a.push({pattern:"yyyyyy",
regex:"(\\d\\d\\d\\d\\d\\d+)",
manipulator:d});
a.push({pattern:"M",
regex:"(\\d\\d?)",
manipulator:k});
a.push({pattern:"MM",
regex:"(\\d\\d?)",
manipulator:k});
a.push({pattern:"MMM",
regex:"("+e.join("|")+")",
manipulator:r});
a.push({pattern:"MMMM",
regex:"("+i.join("|")+")",
manipulator:t});
a.push({pattern:"dd",
regex:"(\\d\\d?)",
field:"day"});
a.push({pattern:"d",
regex:"(\\d\\d?)",
field:"day"});
a.push({pattern:"EE",
regex:"("+h.join("|")+")",
manipulator:o});
a.push({pattern:"EEE",
regex:"("+f.join("|")+")",
manipulator:q});
a.push({pattern:"EEEE",
regex:"("+g.join("|")+")",
manipulator:v});
a.push({pattern:"a",
regex:"("+u+"|"+p+")",
manipulator:s});
a.push({pattern:"HH",
regex:"(\\d\\d?)",
field:"hour"});
a.push({pattern:"H",
regex:"(\\d\\d?)",
field:"hour"});
a.push({pattern:"kk",
regex:"(\\d\\d?)",
manipulator:l});
a.push({pattern:"k",
regex:"(\\d\\d?)",
manipulator:l});
a.push({pattern:"KK",
regex:"(\\d\\d?)",
field:"hour"});
a.push({pattern:"K",
regex:"(\\d\\d?)",
field:"hour"});
a.push({pattern:"hh",
regex:"(\\d\\d?)",
manipulator:n});
a.push({pattern:"h",
regex:"(\\d\\d?)",
manipulator:n});
a.push({pattern:"mm",
regex:"(\\d\\d?)",
field:"min"});
a.push({pattern:"m",
regex:"(\\d\\d?)",
field:"min"});
a.push({pattern:"ss",
regex:"(\\d\\d?)",
field:"sec"});
a.push({pattern:"s",
regex:"(\\d\\d?)",
field:"sec"});
a.push({pattern:"SSS",
regex:"(\\d\\d?\\d?)",
field:"ms"});
a.push({pattern:"SS",
regex:"(\\d\\d?\\d?)",
field:"ms"});
a.push({pattern:"S",
regex:"(\\d\\d?\\d?)",
field:"ms"});
a.push({pattern:"Z",
regex:"([\\+\\-]\\d\\d:?\\d\\d)",
manipulator:m});
a.push({pattern:"z",
regex:"([a-zA-Z]+)",
manipulator:m})}},
destruct:function(){this.__JNnpk=this.__DJKy2=this.__JMPjt=null}});


// qx.util.format.NumberFormat
//   - size: 2623 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       Infinity, 2x
//       Math, 3x
//       NaN, 1x
//       RegExp, 3x
//       String, 1x
//       parseFloat, 1x
//       qx, 12x
//   - packages:
//       Math.floor, 1x
//       Math.pow, 1x
//       Math.round, 1x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.lang.String.escapeRegexpChars, 4x
//       qx.locale.Number.getDecimalSeparator, 2x
//       qx.locale.Number.getGroupSeparator, 2x
//       qx.util.format.IFormat, 1x
//       qx.util.format.NumberFormat, 1x
qx.Class.define("qx.util.format.NumberFormat",{extend:qx.core.Object,
implement:qx.util.format.IFormat,
construct:function(a){this.base(arguments);
this.__qi6oJ=a},
statics:{getIntegerInstance:function(){var a=qx.util.format.NumberFormat;
a._integerInstance==null&&(a._integerInstance=new a(),a._integerInstance.setMaximumFractionDigits(0));
return a._integerInstance},
getInstance:function(){this._instance||(this._instance=new this);
return this._instance}},
properties:{minimumIntegerDigits:{check:"Number",
init:0},
maximumIntegerDigits:{check:"Number",
nullable:true},
minimumFractionDigits:{check:"Number",
init:0},
maximumFractionDigits:{check:"Number",
nullable:true},
groupingUsed:{check:"Boolean",
init:true},
prefix:{check:"String",
init:"",
event:"changeNumberFormat"},
postfix:{check:"String",
init:"",
event:"changeNumberFormat"}},
members:{__qi6oJ:null,
format:function(b){switch(b){case Infinity:return"Infinity";
case -Infinity:return"-Infinity";
case NaN:return"NaN"}var i=(b<0),g,h,j,a,c,f,d,k,l,e;
i&&(b=-b);
if(this.getMaximumFractionDigits()!=null){g=Math.pow(10,this.getMaximumFractionDigits());
b=Math.round(b*g)/g}h=String(Math.floor(b)).length,j=""+b,a=j.substring(0,h);
while(a.length<this.getMinimumIntegerDigits())a="0"+a;
this.getMaximumIntegerDigits()!=null&&a.length>this.getMaximumIntegerDigits()&&(a=a.substring(a.length-this.getMaximumIntegerDigits()));
c=j.substring(h+1);
while(c.length<this.getMinimumFractionDigits())c+="0";
this.getMaximumFractionDigits()!=null&&c.length>this.getMaximumFractionDigits()&&(c=c.substring(0,this.getMaximumFractionDigits()));
if(this.getGroupingUsed()){f=a;
a="";
for(d=f.length;
d>3;
d-=3)a=""+qx.locale.Number.getGroupSeparator(this.__qi6oJ)+f.substring(d-3,d)+a;
a=f.substring(0,d)+a}k=this.getPrefix()?this.getPrefix():"",l=this.getPostfix()?this.getPostfix():"",e=k+(i?"-":"")+a;
c.length>0&&(e+=""+qx.locale.Number.getDecimalSeparator(this.__qi6oJ)+c);
e+=l;
return e},
parse:function(d){var e=qx.lang.String.escapeRegexpChars(qx.locale.Number.getGroupSeparator(this.__qi6oJ)+""),f=qx.lang.String.escapeRegexpChars(qx.locale.Number.getDecimalSeparator(this.__qi6oJ)+""),i=new RegExp("^"+qx.lang.String.escapeRegexpChars(this.getPrefix())+"([-+]){0,1}"+"([0-9]{1,3}(?:"+e+"{0,1}[0-9]{3}){0,})"+"("+f+"\\d+){0,1}"+qx.lang.String.escapeRegexpChars(this.getPostfix())+"$"),b=i.exec(d),h,c,a,g;
if(b==null)throw new Error("Number string '"+d+"' does not match the number format");
h=(b[1]=="-"),c=b[2],a=b[3];
c=c.replace(new RegExp(e,"g"),"");
g=(h?"-":"")+c;
a!=null&&a.length!=0&&(a=a.replace(new RegExp(f),""),g+="."+a);
return parseFloat(g)}}});


// qx.log.appender.Native
//   - size: 279 bytes
//   - modified: 2010-11-02T16:00:49
//   - names:
//       qx, 3x
//       window, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.log.Logger.register, 1x
//       qx.log.appender.Util.toText, 1x
//       window.air, 1x
//       window.air.Introspector.Console, 1x
//       window.console, 1x
//       window.debug, 1x
qx.Class.define("qx.log.appender.Native",{statics:{process:function(c){var b=window.debug||window.console||window.air&&window.air.Introspector.Console,a;
if(b){a=c.level;
a in b||(a="log");
b[a](qx.log.appender.Util.toText(c))}}},
defer:function(a){qx.log.Logger.register(a)}});


// qx.dev.Tokenizer
//   - size: 2776 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       RegExp, 2x
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.String.escape, 1x
//       qx.bom.client.Engine.MSHTML, 2x
//       qx.core.Object, 1x
//       qx.dev.Tokenizer.tokenizeJavaScript, 1x
//       qx.util.StringBuilder, 1x
qx.Class.define("qx.dev.Tokenizer",{extend:qx.core.Object,
statics:{tokenizeJavaScript:function(D){for(var r={"break":1,
"case":1,
"catch":1,
"continue":1,
"default":1,
"delete":1,
"do":1,
"else":1,
"finally":1,
"for":1,
"function":1,
"if":1,
"in":1,
"instanceof":1,
"new":1,
"return":1,
"switch":1,
"throw":1,
"try":1,
"typeof":1,
"var":1,
"while":1,
"with":1},w={"void":1,
"null":1,
"true":1,
"false":1,
NaN:1,
Infinity:1,
"this":1},y={statics:1,
members:1,
construct:1,
destruct:1,
events:1,
properties:1,
extend:1,
implement:1},c=function(a){return new RegExp("^"+a+"$")},g="\\/\\/.*?[\\n\\r$]",m="\\/\\*(?:.|[\\n\\r])*?\\*\\/",o="[a-zA-Z_][a-zA-Z0-9_]*\\b",k="[+-]?\\d+",q="[+-]?\\d+(([.]\\d+)*([eE][+-]?\\d+))?",j="[\"][^\"]*[\"]",f="['][^']*[']",p="\\t",n="\\r\\n|\\r|\\n",i="\\s",d="(?:\\/(?!\\*)[^\\t\\n\\r\\f\\v\\/]+?\\/[mgi]*)",l=["\\.(?:match|search|split)\\s*\\(\\s*\\(*\\s*"+d+"\\s*\\)*\\s*\\)","\\.(?:replace)\\s*\\(\\s*\\(*\\s*"+d+"\\s*\\)*\\s*?,?","\\s*\\(*\\s*"+d+"\\)*\\.(?:test|exec)\\s*\\(\\s*","(?::|=|\\?)\\s*\\(*\\s*"+d+"\\s*\\)*","[\\(,]\\s*"+d+"\\s*[,\\)]"].join("|"),t=c(g),B=c(m),v=c(o),E=c(k),s=c(q),F=c(j),G=c(f),u=c(p),A=c(n),z=c(i),C=c(l),x=new RegExp([g,m,o,k,q,j,f,f,p,n,i,l,"."].join("|"),"g"),b=[],h=D.match(x),e=0,a;
e<h.length;
e++){a=h[e];
a.match(t)?b.push({type:"linecomment",
value:a}):a.match(B)?b.push({type:"fullcomment",
value:a}):a.match(C)?b.push({type:"regexp",
value:a}):a.match(G)?b.push({type:"qstr",
value:a}):a.match(F)?b.push({type:"qqstr",
value:a}):r[a]?b.push({type:"keyword",
value:a}):w[a]?b.push({type:"atom",
value:a}):y[a]?b.push({type:"qxkey",
value:a}):a.match(v)?b.push({type:"ident",
value:a}):a.match(s)?b.push({type:"real",
value:a}):a.match(E)?b.push({type:"int",
value:a}):a.match(A)?b.push({type:"nl",
value:a}):a.match(c(z))?b.push({type:"ws",
value:a}):a.match(u)?b.push({type:"tab",
value:a}):a==">"?b.push({type:"sym",
value:">"}):a=="<"?b.push({type:"sym",
value:"<"}):a=="&"?b.push({type:"sym",
value:"&"}):b.push({type:"sym",
value:a})}return b},
javaScriptToHtml:function(g){for(var e=qx.dev.Tokenizer.tokenizeJavaScript(g),a=new qx.util.StringBuilder(),d=0,c,b,h,f;
d<e.length;
d++){c=e[d],b=qx.bom.String.escape(c.value);
switch(c.type){case"regexp":a.add("<span class='regexp'>",b,"</span>");
break;
case"ident":a.add("<span class='ident'>",b,"</span>");
break;
case"linecomment":case"fullcomment":a.add("<span class='comment'>",b,"</span>");
break;
case"qstr":case"qqstr":a.add("<span class='string'>",b,"</span>");
break;
case"keyword":case"atom":case"qxkey":a.add("<span class='",c.type,"'>",b,"</span>");
break;
case"nl":h=qx.bom.client.Engine.MSHTML?"<br>":"\n";
a.add(h);
break;
case"ws":f=qx.bom.client.Engine.MSHTML?"&nbsp;":" ";
a.add(f);
break;
default:a.add(b)}}return a.get()}}});


// qx.ui.table.selection.Manager
//   - size: 1381 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.type.Dom.SHIFT_MASK, 1x
qx.Class.define("qx.ui.table.selection.Manager",{extend:qx.core.Object,
construct:function(){this.base(arguments)},
properties:{selectionModel:{check:"qx.ui.table.selection.Model"}},
members:{__b0SAJI:null,
handleMouseDown:function(a,b){if(b.isLeftPressed()){var c=this.getSelectionModel();
c.isSelectedIndex(a)?this.__b0SAJI=false:(this._handleSelectEvent(a,b),this.__b0SAJI=true)}else if(b.isRightPressed()&&b.getModifiers()==0){c=this.getSelectionModel();
c.isSelectedIndex(a)||c.setSelectionInterval(a,a)}},
handleMouseUp:function(b,a){a.isLeftPressed()&&!this.__b0SAJI&&this._handleSelectEvent(b,a)},
handleClick:function(b,a){},
handleSelectKeyDown:function(b,a){this._handleSelectEvent(b,a)},
handleMoveKeyDown:function(a,d){var b=this.getSelectionModel(),c;
switch(d.getModifiers()){case 0:b.setSelectionInterval(a,a);
break;
case qx.event.type.Dom.SHIFT_MASK:c=b.getAnchorSelectionIndex();
c==-1?b.setSelectionInterval(a,a):b.setSelectionInterval(c,a);
break}},
_handleSelectEvent:function(a,d){var b=this.getSelectionModel(),e=b.getLeadSelectionIndex(),c=b.getAnchorSelectionIndex();
d.isShiftPressed()?(a!=e||b.isSelectionEmpty())&&(c==-1&&(c=a),d.isCtrlOrCommandPressed()?b.addSelectionInterval(c,a):b.setSelectionInterval(c,a)):d.isCtrlOrCommandPressed()?b.isSelectedIndex(a)?b.removeSelectionInterval(a,a):b.addSelectionInterval(a,a):b.setSelectionInterval(a,a)}}});


// qx.ui.table.pane.CellEvent
//   - size: 544 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Mouse, 1x
qx.Class.define("qx.ui.table.pane.CellEvent",{extend:qx.event.type.Mouse,
properties:{row:{check:"Integer",
nullable:true},
column:{check:"Integer",
nullable:true}},
members:{init:function(b,d,a,c){d.clone(this);
this.setBubbles(false);
a!=null?this.setRow(a):this.setRow(b._getRowForPagePos(this.getDocumentLeft(),this.getDocumentTop()));
c!=null?this.setColumn(c):this.setColumn(b._getColumnForPageX(this.getDocumentLeft()))},
clone:function(b){var a=this.base(arguments,b);
a.set({row:this.getRow(),
column:this.getColumn()});
return a}}});


// qx.ui.form.RadioGroup
//   - size: 2998 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Math, 2x
//       qx, 10x
//   - packages:
//       Math.max, 1x
//       Math.min, 1x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.lang.Array.contains, 2x
//       qx.lang.Array.remove, 1x
//       qx.ui.core.ISingleSelection, 1x
//       qx.ui.core.MSingleSelectionHandling, 1x
//       qx.ui.form.IForm, 1x
//       qx.ui.form.IModelSelection, 1x
//       qx.ui.form.MModelSelection, 1x
qx.Class.define("qx.ui.form.RadioGroup",{extend:qx.core.Object,
implement:[qx.ui.core.ISingleSelection,qx.ui.form.IForm,qx.ui.form.IModelSelection],
include:[qx.ui.core.MSingleSelectionHandling,qx.ui.form.MModelSelection],
construct:function(a){this.base(arguments);
this.__mSxzx=[];
this.addListener("changeSelection",this.__bvWjtA,this);
a!=null&&this.add.apply(this,arguments)},
properties:{enabled:{check:"Boolean",
apply:"_applyEnabled",
event:"changeEnabled",
init:true},
wrap:{check:"Boolean",
init:true},
allowEmptySelection:{check:"Boolean",
init:false,
apply:"_applyAllowEmptySelection"},
valid:{check:"Boolean",
init:true,
apply:"_applyValid",
event:"changeValid"},
required:{check:"Boolean",
init:false,
event:"changeRequired"},
invalidMessage:{check:"String",
init:"",
event:"changeInvalidMessage",
apply:"_applyInvalidMessage"},
requiredInvalidMessage:{check:"String",
nullable:true,
event:"changeInvalidMessage"}},
members:{__mSxzx:null,
getItems:function(){return this.__mSxzx},
add:function(e){for(var b=this.__mSxzx,a,c=0,d=arguments.length;
c<d;
c++){a=arguments[c];
if(qx.lang.Array.contains(b,a))continue;
a.addListener("changeValue",this._onItemChangeChecked,this);
b.push(a);
a.setGroup(this);
a.getValue()&&this.setSelection([a])}!this.isAllowEmptySelection()&&b.length>0&&!this.getSelection()[0]&&this.setSelection([b[0]])},
remove:function(a){var b=this.__mSxzx;
qx.lang.Array.contains(b,a)&&(qx.lang.Array.remove(b,a),a.getGroup()===this&&a.resetGroup(),a.removeListener("changeValue",this._onItemChangeChecked,this),a.getValue()&&this.resetSelection())},
getChildren:function(){return this.__mSxzx},
_onItemChangeChecked:function(b){var a=b.getTarget();
a.getValue()?this.setSelection([a]):this.getSelection()[0]==a&&this.resetSelection()},
_applyInvalidMessage:function(b,c){for(var a=0;
a<this.__mSxzx.length;
a++)this.__mSxzx[a].setInvalidMessage(b)},
_applyValid:function(b,c){for(var a=0;
a<this.__mSxzx.length;
a++)this.__mSxzx[a].setValid(b)},
_applyEnabled:function(c,e){var b=this.__mSxzx,a,d;
if(c==null)for(a=0,d=b.length;
a<d;
a++)b[a].resetEnabled();
else for(a=0,d=b.length;
a<d;
a++)b[a].setEnabled(c)},
_applyAllowEmptySelection:function(a,b){!a&&this.isSelectionEmpty()&&this.resetSelection()},
selectNext:function(){var e=this.getSelection()[0],b=this.__mSxzx,a=b.indexOf(e),d,c;
if(a==-1)return;
d=0,c=b.length;
a=this.getWrap()?(a+1)%c:Math.min(a+1,c-1);
while(d<c&&!b[a].getEnabled())a=(a+1)%c,d++;
this.setSelection([b[a]])},
selectPrevious:function(){var e=this.getSelection()[0],c=this.__mSxzx,a=c.indexOf(e),d,b;
if(a==-1)return;
d=0,b=c.length;
a=this.getWrap()?(a-1+b)%b:Math.max(a-1,0);
while(d<b&&!c[a].getEnabled())a=(a-1+b)%b,d++;
this.setSelection([c[a]])},
_getItems:function(){return this.getItems()},
_isAllowEmptySelection:function(){return this.isAllowEmptySelection()},
__bvWjtA:function(b){var a=b.getData()[0],c=b.getOldData()[0];
c&&c.setValue(false);
a&&a.setValue(true)}},
destruct:function(){this._disposeArray("__items")}});


// qx.util.Json
//   - size: 3800 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       Date, 1x
//       Error, 2x
//       Math, 1x
//       String, 3x
//       eval, 1x
//       isFinite, 1x
//       qx, 37x
//       undefined, 1x
//   - packages:
//       Date.prototype.toJSON, 1x
//       Math.floor, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Engine.OPERA, 1x
//       qx.core.Setting.define, 2x
//       qx.core.Setting.get, 3x
//       qx.lang.Type.isArray, 1x
//       qx.lang.Type.isDate, 1x
//       qx.lang.Type.isFunction, 1x
//       qx.lang.Type.isObject, 1x
//       qx.log.Logger.debug, 2x
//       qx.util.Json.BEAUTIFYING_INDENT, 2x
//       qx.util.Json.BEAUTIFYING_INDENT.length, 2x
//       qx.util.Json.CONVERT_DATES, 1x
//       qx.util.Json.__beautify, 2x
//       qx.util.Json.__convertStringEscape, 1x
//       qx.util.Json.__convertStringHelper, 1x
//       qx.util.Json.__indent, 10x
//       qx.util.Json.__indent.length, 2x
//       qx.util.Json.__indent.substring, 2x
//       qx.util.format.NumberFormat.getInstance, 1x
qx.Class.define("qx.util.Json",{statics:{__bn0U1J:null,
BEAUTIFYING_INDENT:"  ",
BEAUTIFYING_LINE_END:"\n",
CONVERT_DATES:null,
__gMIjx:{"function":"__convertFunction",
"boolean":"__convertBoolean",
number:"__convertNumber",
string:"__convertString",
object:"__convertObject",
undefined:"__convertUndefined"},
__bi1y1y:function(a,b){return String(a)},
__baFLTE:function(a,b){return String(a)},
__3Etsb:function(a,b){return isFinite(a)?String(a):"null"},
__3Yx1L:function(b,c){var a;
a=/["\\\x00-\x1f]/.test(b)?b.replace(/([\x00-\x1f\\"])/g,qx.util.Json.__bThgTH):b;
return"\""+a+"\""},
__bTbLUO:{"\b":"\\b",
"\t":"\\t",
"\n":"\\n",
"\f":"\\f",
"\r":"\\r",
"\"":"\\\"",
"\\":"\\\\"},
__bThgTH:function(c,b){var a=qx.util.Json.__bTbLUO[b];
if(a)return a;
a=b.charCodeAt();
return"\\u00"+Math.floor(a/16).toString(16)+(a%16).toString(16)},
__WsI9b:function(g,i){var a=[],f=true,e,b,d=qx.util.Json.__yTKbY,c,h;
a.push("[");
d&&(qx.util.Json.__qmoZp+=qx.util.Json.BEAUTIFYING_INDENT,a.push(qx.util.Json.__qmoZp));
for(c=0,h=g.length;
c<h;
c++)b=g[c],e=this.__gMIjx[typeof b],e&&(b=this[e](b,c+""),typeof b=="string"&&(f||(a.push(","),d&&a.push(qx.util.Json.__qmoZp)),a.push(b),f=false));
d&&(qx.util.Json.__qmoZp=qx.util.Json.__qmoZp.substring(0,qx.util.Json.__qmoZp.length-qx.util.Json.BEAUTIFYING_INDENT.length),a.push(qx.util.Json.__qmoZp));
a.push("]");
return a.join("")},
__PNHEE:function(a,e){if(!qx.util.Json.CONVERT_DATES){if(a.toJSON&&!qx.bom.client.Engine.OPERA)return a.toJSON();
var b=qx.util.format.NumberFormat.getInstance(),c,d;
b.setMinimumIntegerDigits(2);
c=a.getUTCFullYear()+"-"+b.format(a.getUTCMonth()+1)+"-"+b.format(a.getUTCDate())+"T"+b.format(a.getUTCHours())+":"+b.format(a.getUTCMinutes())+":"+b.format(a.getUTCSeconds())+".";
b.setMinimumIntegerDigits(3);
return c+b.format(a.getUTCMilliseconds())+"Z"}d=a.getUTCFullYear()+","+a.getUTCMonth()+","+a.getUTCDate()+","+a.getUTCHours()+","+a.getUTCMinutes()+","+a.getUTCSeconds()+","+a.getUTCMilliseconds();
return"new Date(Date.UTC("+d+"))"},
__JWZ7y:function(g,c){var a=[],f=true,e,b,d=qx.util.Json.__yTKbY,c;
a.push("{");
d&&(qx.util.Json.__qmoZp+=qx.util.Json.BEAUTIFYING_INDENT,a.push(qx.util.Json.__qmoZp));
for(c in g)b=g[c],e=this.__gMIjx[typeof b],e&&(b=this[e](b,c),typeof b=="string"&&(f||(a.push(","),d&&a.push(qx.util.Json.__qmoZp)),a.push(this.__3Yx1L(c),":",b),f=false));
d&&(qx.util.Json.__qmoZp=qx.util.Json.__qmoZp.substring(0,qx.util.Json.__qmoZp.length-qx.util.Json.BEAUTIFYING_INDENT.length),a.push(qx.util.Json.__qmoZp));
a.push("}");
return a.join("")},
__3eCQR:function(a,b){if(a){if(qx.lang.Type.isFunction(a.toJSON)&&a.toJSON!==this.__bn0U1J)return this.__uNnVI(a.toJSON(b),b);
if(qx.lang.Type.isDate(a))return this.__PNHEE(a,b);
if(qx.lang.Type.isArray(a))return this.__WsI9b(a,b);
if(qx.lang.Type.isObject(a))return this.__JWZ7y(a,b);
return""}return"null"},
__bq8erK:function(b,a){if(qx.core.Setting.get("qx.jsonEncodeUndefined"))return"null"},
__uNnVI:function(a,b){return this[this.__gMIjx[typeof a]](a,b)},
stringify:function(b,c){this.__yTKbY=c;
this.__qmoZp=this.BEAUTIFYING_LINE_END;
var a=this.__uNnVI(b,"");
typeof a!="string"&&(a=null);
qx.core.Setting.get("qx.jsonDebugging")&&qx.log.Logger.debug(this,"JSON request: "+a);
return a},
parse:function(a,b){b===undefined&&(b=true);
qx.core.Setting.get("qx.jsonDebugging")&&qx.log.Logger.debug(this,"JSON response: "+a);
if(b)if(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(a.replace(/"(\\.|[^"\\])*"/g,"")))throw new Error("Could not parse JSON string!");
try{var d=a&&a.length>0?eval("("+a+")"):null;
return d}catch(c){throw new Error("Could not evaluate JSON string: "+c.message)}}},
defer:function(a){qx.core.Setting.define("qx.jsonEncodeUndefined",true);
qx.core.Setting.define("qx.jsonDebugging",false);
a.__bn0U1J=Date.prototype.toJSON}});


// qx.ui.form.IRadioItem
//   - size: 238 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Interface.define, 1x
//       qx.ui.form.RadioGroup, 1x
qx.Interface.define("qx.ui.form.IRadioItem",{events:{changeValue:"qx.event.type.Data"},
members:{setValue:function(a){},
getValue:function(){},
setGroup:function(a){this.assertInstance(a,qx.ui.form.RadioGroup)},
getGroup:function(){}}});


// apiviewer.UiModel
//   - size: 419 bytes
//   - modified: 2010-05-05T20:54:13
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.data.MBinding, 1x
qx.Class.define("apiviewer.UiModel",{extend:qx.core.Object,
type:"singleton",
include:[qx.data.MBinding],
properties:{showInherited:{check:"Boolean",
init:false,
event:"changeShowInherited"},
expandProperties:{check:"Boolean",
init:false,
event:"changeExpandProperties"},
showProtected:{check:"Boolean",
init:false,
event:"changeShowProtected"},
showPrivate:{check:"Boolean",
init:false,
event:"changeShowPrivate"}}});


// qx.theme.manager.Meta
//   - size: 799 bytes
//   - modified: 2010-11-02T19:11:11
//   - names:
//       Error, 1x
//       qx, 8x
//   - packages:
//       qx.Class.define, 1x
//       qx.Theme.getByName, 1x
//       qx.core.Object, 1x
//       qx.core.Setting.define, 1x
//       qx.theme.manager.Appearance.getInstance, 1x
//       qx.theme.manager.Color.getInstance, 1x
//       qx.theme.manager.Decoration.getInstance, 1x
//       qx.theme.manager.Font.getInstance, 1x
qx.Class.define("qx.theme.manager.Meta",{type:"singleton",
extend:qx.core.Object,
properties:{theme:{check:"Theme",
nullable:true,
apply:"_applyTheme"}},
members:{_applyTheme:function(a,j){var d=null,e=null,b=null,c=null,i,f,h,g;
a&&(d=a.meta.color||null,e=a.meta.decoration||null,b=a.meta.font||null,c=a.meta.appearance||null);
i=qx.theme.manager.Color.getInstance(),f=qx.theme.manager.Decoration.getInstance(),h=qx.theme.manager.Font.getInstance(),g=qx.theme.manager.Appearance.getInstance();
i.setTheme(d);
f.setTheme(e);
h.setTheme(b);
g.setTheme(c)},
initialize:function(){var a,b;
a="apiviewer.Theme";
if(a){b=qx.Theme.getByName(a);
if(!b)throw new Error("The theme to use is not available: "+a);
this.setTheme(b)}}},
defer:function(a){qx.core.Setting.define("qx.theme","qx.theme.Modern")}});


// apiviewer.dao.Node
//   - size: 1615 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.util.Json.stringify, 1x
qx.Class.define("apiviewer.dao.Node",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
this._docNode=a;
a.children=a.children||[];
a.attributes=a.attributes||{};
a.cls=this;
this._initializeFields();
for(var c=0,b;
c<a.children.length;
c++){b=a.children[c];
if(!this._addChildNode(b))throw new Error("Unknown child type: "+b.type+" node: "+qx.util.Json.stringify(b))}},
members:{getNode:function(){return this._docNode},
getNodeType:function(){return this._docNode.type},
getErrors:function(){return this._errors},
getDeprecationText:function(){return this._deprecated||""},
isDeprecated:function(){return typeof this._deprecated=="string"?true:false},
isInternal:function(){return this._docNode.attributes.access=="internal"},
isPrivate:function(){return this._docNode.attributes.access=="private"},
isProtected:function(){return this._docNode.attributes.access=="protected"},
isPropertyGenerated:function(){return this._docNode.attributes.fromProperty!=null},
isPublic:function(){return!this.isPrivate()&&!this.isProtected()&&!this.isInternal()},
hasWarning:function(){return this._docNode.attributes.hasWarning||false},
_createNodeList:function(b,c,e,f){if(c){for(var d=[],a=0;
a<b.children.length;
a++)d.push(new c(b.children[a],e,f));
return d}return b.children},
_initializeFields:function(){this._errors=[]},
_addChildNode:function(a){switch(a.type){case"deprecated":this._deprecated=a.children?a.children[0].attributes.text||"":"";
break;
case"errors":this._errors=this._createNodeList(a);
break;
default:return false}return true}},
destruct:function(){this._docNode=this._errors=null}});


// qx.ui.decoration.css3.BorderImage
//   - size: 1916 bytes
//   - modified: 2010-11-02T17:49:06
//   - names:
//       Error, 1x
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Style.compile, 1x
//       qx.bom.element.Style.isPropertySupported, 1x
//       qx.ui.decoration.Abstract, 1x
//       qx.util.ResourceManager.getInstance, 1x
qx.Class.define("qx.ui.decoration.css3.BorderImage",{extend:qx.ui.decoration.Abstract,
construct:function(b,a){this.base(arguments);
b!=null&&this.setBorderImage(b);
a!=null&&this.setSlice(a)},
statics:{IS_SUPPORTED:qx.bom.element.Style.isPropertySupported("borderImage")},
properties:{borderImage:{check:"String",
nullable:true,
apply:"_applyStyle"},
sliceTop:{check:"Integer",
init:0,
apply:"_applyStyle"},
sliceRight:{check:"Integer",
init:0,
apply:"_applyStyle"},
sliceBottom:{check:"Integer",
init:0,
apply:"_applyStyle"},
sliceLeft:{check:"Integer",
init:0,
apply:"_applyStyle"},
slice:{group:["sliceTop","sliceRight","sliceBottom","sliceLeft"],
shorthand:true},
repeatX:{check:["stretch","repeat","round"],
init:"stretch",
apply:"_applyStyle"},
repeatY:{check:["stretch","repeat","round"],
init:"stretch",
apply:"_applyStyle"},
repeat:{group:["repeatX","repeatY"],
shorthand:true}},
members:{__qyd51:null,
_getDefaultInsets:function(){return{top:0,
right:0,
bottom:0,
left:0}},
_isInitialized:function(){return!!this.__qyd51},
getMarkup:function(){if(this.__qyd51)return this.__qyd51;
var c=this._resolveImageUrl(this.getBorderImage()),a=[this.getSliceTop(),this.getSliceRight(),this.getSliceBottom(),this.getSliceLeft()],b=[this.getRepeatX(),this.getRepeatY()].join(" ");
this.__qyd51=["<div style='",qx.bom.element.Style.compile({borderImage:"url(\""+c+"\") "+a.join(" ")+" "+b,
position:"absolute",
lineHeight:0,
fontSize:0,
overflow:"hidden",
boxSizing:"border-box",
borderWidth:a.join("px ")+"px"}),";'></div>"].join("");
return this.__qyd51},
resize:function(a,c,b){a.style.width=c+"px";
a.style.height=b+"px"},
tint:function(a,b){},
_applyStyle:function(){if(this._isInitialized())throw new Error("This decorator is already in-use. Modification is not possible anymore!")},
_resolveImageUrl:function(a){return qx.util.ResourceManager.getInstance().toUri(a)}},
destruct:function(){this.__qyd51=null}});


// apiviewer.dao.ClassItem
//   - size: 1943 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       apiviewer, 5x
//       qx, 1x
//   - packages:
//       apiviewer.TreeUtil.getChild, 1x
//       apiviewer.TreeUtil.getChildByAttribute, 1x
//       apiviewer.dao.Class.getClassByName, 2x
//       apiviewer.dao.Node, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.ClassItem",{extend:apiviewer.dao.Node,
construct:function(b,a,c){this._class=a;
this._listName=c;
this.base(arguments,b)},
members:{getClass:function(){return this._class},
getName:function(){return this._docNode.attributes.name},
getListName:function(){return this._listName},
getDescription:function(){return this.getDocNode()._desc||""},
getTypes:function(){for(var c=[],a=0,b;
a<this._types.length;
a++){b={};
this._types[a].attributes.dimensions&&(b.dimensions=this._types[a].attributes.dimensions);
b.type=this._types[a].attributes.type;
c.push(b)}return c},
getSee:function(){return this._see},
getOverriddenFrom:function(){return apiviewer.dao.Class.getClassByName(this._docNode.attributes.overriddenFrom)},
getDocNode:function(){if(this._itemDocNode)return this._itemDocNode;
this._itemDocNode=this;
var c=apiviewer.dao.Class.getClassByName(this._docNode.attributes.docFrom),b,a;
if(c){b=c.getItemList(this._listName),a=0;
for(;
a<b.length;
a++)if(b[a].getName()==this.getName()){this._itemDocNode=b[a];
break}}return this._itemDocNode},
isRequiredByInterface:function(b){var a=apiviewer.TreeUtil.getChild(b.getNode(),this._listName),c;
if(a){c=apiviewer.TreeUtil.getChildByAttribute(a,"name",this.getName());
return c?true:false}return false},
getRequiredBy:function(){if(this._requiredBy)return this._requiredBy;
for(var c=[],b=this.getClass().getAllInterfaces(true),a=0;
a<b.length;
a++)this.isRequiredByInterface(b[a])&&c.push(b[a]);
this._requiredBy=c;
return c},
_initializeFields:function(){this.base(arguments);
this._see=[];
this._types=[]},
_addChildNode:function(a){switch(a.type){case"desc":this._desc=a.attributes.text||"";
break;
case"see":this._see.push(a.attributes.name);
break;
case"types":this._types=this._createNodeList(a);
break;
default:return this.base(arguments,a)}return true}},
destruct:function(){this._class=this._itemDocNode=this._requiredBy=this._see=this._types=null}});


// apiviewer.dao.ChildControl
//   - size: 410 bytes
//   - modified: 2010-05-05T19:22:41
//   - names:
//       apiviewer, 1x
//       qx, 1x
//   - packages:
//       apiviewer.dao.ClassItem, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.ChildControl",{extend:apiviewer.dao.ClassItem,
construct:function(b,a,c){this.base(arguments,b,a);
this._listName=c},
members:{getTypes:function(){var a=this.base(arguments),b=this._docNode.attributes;
b.type&&a.push({type:b.type});
return a},
getType:function(){return this._docNode.attributes.type},
getDefaultValue:function(){return this._docNode.attributes.defaultValue}}});


// apiviewer.dao.ThrowsEntry
//   - size: 313 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 1x
//       qx, 1x
//   - packages:
//       apiviewer.dao.ClassItem, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.ThrowsEntry",{extend:apiviewer.dao.ClassItem,
construct:function(b,a,c){this.base(arguments,b,a)},
members:{getType:function(){return this._docNode.attributes.type||null},
getDefaultType:function(){return"Error"},
getDescription:function(){return this._docNode.attributes.text}}});


// apiviewer.dao.Param
//   - size: 782 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 1x
//       qx, 1x
//   - packages:
//       apiviewer.dao.ClassItem, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.Param",{extend:apiviewer.dao.ClassItem,
construct:function(c,b,a){this.base(arguments,c,b);
this._method=a},
members:{getTypes:function(){var a=this.getMethod().getFromProperty(),c,d,b;
if(a){if(a.isPropertyGroup()){c=this.getClass().getItemByListAndName("properties",this.getName());
if(c)return c.getTypes()}else return a.getTypes()}d=this.base(arguments),b=this._docNode.attributes;
b.type&&d.push({type:b.type,
dimensions:b.dimensions});
return d},
getMethod:function(){return this._method},
getArrayDimensions:function(){return this._docNode.attributes.arrayDimensions},
getType:function(){return this._docNode.attributes.type},
getDefaultValue:function(){return this._docNode.attributes.defaultValue}},
destruct:function(){this._method=null}});


// apiviewer.dao.Constant
//   - size: 201 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 1x
//       qx, 1x
//   - packages:
//       apiviewer.dao.ClassItem, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.Constant",{extend:apiviewer.dao.ClassItem,
construct:function(b,a,c){this.base(arguments,b,a,c)},
members:{getValue:function(){return this._docNode.attributes.value}}});


// apiviewer.dao.Method
//   - size: 1649 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 7x
//       qx, 1x
//   - packages:
//       apiviewer.TreeUtil.getChild, 3x
//       apiviewer.dao.ClassItem, 1x
//       apiviewer.dao.Param, 2x
//       apiviewer.dao.ThrowsEntry, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.Method",{extend:apiviewer.dao.ClassItem,
construct:function(b,a,c){this.base(arguments,b,a,c)},
members:{getName:function(){return this.isConstructor()?"construct":this._docNode.attributes.name},
isStatic:function(){return this._docNode.attributes.isStatic||false},
isAbstract:function(){return this._docNode.attributes.isAbstract||false},
isConstructor:function(){return this._docNode.attributes.isCtor||false},
isFromProperty:function(){return!!this._docNode.attributes.fromProperty},
getParams:function(){if(this._params!=null)return this._params;
var a=apiviewer.TreeUtil.getChild(this.getDocNode().getNode(),"params");
this._params=a?this._createNodeList(a,apiviewer.dao.Param,this.getClass(),this):[];
return this._params},
getReturn:function(){if(this._return!=null)return this._return;
var a=apiviewer.TreeUtil.getChild(this.getDocNode().getNode(),"return");
this._return=a?new apiviewer.dao.Param(a,this.getClass(),this):"";
return this._return},
getThrows:function(){if(this._throws!=null)return this._throws;
var a=apiviewer.TreeUtil.getChild(this.getDocNode().getNode(),"throws");
this._throws=a?this._createNodeList(a,apiviewer.dao.ThrowsEntry,this.getClass(),this):[];
return this._throws},
getApply:function(){return this._docNode.attributes.apply},
getFromProperty:function(){return this.getClass().getItemByListAndName("properties",this._docNode.attributes.fromProperty)},
_addChildNode:function(a){switch(a.type){case"params":case"return":case"throws":break;
default:return this.base(arguments,a)}return true}},
destruct:function(){this._params=this._throws=null;
this._disposeObjects("_return")}});


// apiviewer.dao.Class
//   - size: 7799 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       apiviewer, 27x
//       qx, 1x
//   - packages:
//       apiviewer.TreeUtil.getChild, 7x
//       apiviewer.dao.Appearance, 1x
//       apiviewer.dao.ChildControl, 1x
//       apiviewer.dao.Class.getClassByName, 8x
//       apiviewer.dao.ClassItem, 2x
//       apiviewer.dao.Constant, 1x
//       apiviewer.dao.Event, 1x
//       apiviewer.dao.Method, 4x
//       apiviewer.dao.Node, 1x
//       apiviewer.dao.Property, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.Class",{extend:apiviewer.dao.Node,
construct:function(b,a){this.base(arguments,b);
this.self(arguments).registerClass(this);
this._package=a},
statics:{_class_registry:{},
_top_level_classes:[],
registerClass:function(a){if(!a.getFullName())return;
this._class_registry[a.getFullName()]=a;
a._docNode.attributes.superClass||this._top_level_classes.push(a)},
getClassByName:function(a){return this._class_registry[a]},
getAllTopLevelClasses:function(){return this._top_level_classes}},
members:{getName:function(){return this._docNode.attributes.name},
getClass:function(){return this},
getPackage:function(){return this._package},
isLoaded:function(){return this._docNode.attributes.externalRef!=true},
getFullName:function(){return this._docNode.attributes.fullName||""},
getPackageName:function(){return this._docNode.attributes.packageName||""},
getDescription:function(){return this._desc||""},
getType:function(){return this._docNode.attributes.type||"class"},
isAbstract:function(){return this._docNode.attributes.isAbstract||false},
isStatic:function(){return this._docNode.attributes.isStatic||false},
isSingleton:function(){return this._docNode.attributes.isSingleton||false},
getSee:function(){return this._see},
getSuperClass:function(){return this.self(arguments).getClassByName(this._docNode.attributes.superClass)},
getChildClasses:function(){return this._docNode.attributes.childClasses?this._docNode.attributes.childClasses.split(","):[]},
getInterfaces:function(){return this._docNode.attributes.interfaces?this._docNode.attributes.interfaces.split(","):[]},
getMixins:function(){return this._docNode.attributes.mixins?this._docNode.attributes.mixins.split(","):[]},
getImplementations:function(){return this._docNode.attributes.implementations?this._docNode.attributes.implementations.split(","):[]},
getIncluder:function(){return this._docNode.attributes.includer?this._docNode.attributes.includer.split(","):[]},
getConstructor:function(){if(this._constructor!=null)return this._constructor;
var b=apiviewer.TreeUtil.getChild(this.getNode(),"constructor"),a,c;
if(b)this._constructor=new apiviewer.dao.Method(b.children[0],this,b.type);
else{this._constructor="";
a=this.getSuperClass();
while(a){c=a.getConstructor();
if(c){b=c.getNode();
this._constructor=new apiviewer.dao.Method(b,this,"constructor");
break}a=a.getSuperClass()}}return this._constructor},
getMembers:function(){if(this._members!=null)return this._members;
var a=apiviewer.TreeUtil.getChild(this.getNode(),"methods");
this._members=a?this._createNodeList(a,apiviewer.dao.Method,this,a.type):[];
return this._members},
getStatics:function(){if(this._statics!=null)return this._statics;
var a=apiviewer.TreeUtil.getChild(this.getNode(),"methods-static");
this._statics=a?this._createNodeList(a,apiviewer.dao.Method,this,a.type):[];
return this._statics},
getEvents:function(){if(this._events!=null)return this._events;
var a=apiviewer.TreeUtil.getChild(this.getNode(),"events");
this._events=a?this._createNodeList(a,apiviewer.dao.Event,this,a.type):[];
return this._events},
getProperties:function(){if(this._properties!=null)return this._properties;
var a=apiviewer.TreeUtil.getChild(this.getNode(),"properties");
this._properties=a?this._createNodeList(a,apiviewer.dao.Property,this,a.type):[];
return this._properties},
getConstants:function(){if(this._constants!=null)return this._constants;
var a=apiviewer.TreeUtil.getChild(this.getNode(),"constants");
this._constants=a?this._createNodeList(a,apiviewer.dao.Constant,this,a.type):[];
return this._constants},
getAppearances:function(){if(this._appearances!=null)return this._appearances;
var a=apiviewer.TreeUtil.getChild(this.getNode(),"appearances");
this._appearances=a?this._createNodeList(a,apiviewer.dao.Appearance,this,a.type):[];
return this._appearances},
getSuperInterfaces:function(){return this._superInterfaces},
getSuperMixins:function(){return this._superMixins},
getChildControls:function(){return this._childControls},
getClassHierarchy:function(){var b=[],a=this;
while(a)b.push(a),a=a.getSuperClass();
return b},
getInterfaceHierarchy:function(){var c=this,d=[c],a=c.getSuperInterfaces(),b,f,e;
while(a&&a.length>0)for(b=0,f=a.length;
b<f;
b++){e=apiviewer.dao.Class.getClassByName(a[b].getName());
d.push(e);
a=e.getSuperInterfaces()}return d},
getItem:function(e){for(var d=["getMembers","getStatics","getEvents","getProperties","getConstants","getAppearances","getChildControls"],c=0,b,a;
c<d.length;
c++){b=this[d[c]](),a=0;
for(;
a<b.length;
a++)if(e==b[a].getName())return b[a]}},
getItemList:function(a){var b={events:"getEvents",
constructor:"getConstructor",
properties:"getProperties",
methods:"getMembers",
"methods-static":"getStatics",
constants:"getConstants",
appearances:"getAppearances",
superInterfaces:"getSuperInterfaces",
superMixins:"getSuperMixins",
childControls:"getChildControls"};
return a=="constructor"?this.getConstructor()?[this.getConstructor()]:[]:this[b[a]]()},
getItemByListAndName:function(d,c){for(var b=this.getItemList(d),a=0;
a<b.length;
a++)if(c==b[a].getName())return b[a]},
getClassAppearance:function(){for(var b=this.getAppearances(),a=0;
a<b.length;
a++)if(b[a].getType()==this)return b[a];
return null},
getAllInterfaces:function(h){if(h)var b=this.getClassHierarchy(),d,a,g,f,e,c;
else b=[this];
d=[],a=0;
for(;
a<b.length;
a++){g=b[a],f=function(e){var c=apiviewer.dao.Class.getClassByName(e),b,a;
d.push(c);
b=c.getSuperInterfaces(),a=0;
for(;
a<b.length;
a++)f(b[a].getName())},e=g.getInterfaces(),c=0;
for(;
c<e.length;
c++)f(e[c])}return d},
getNodesOfTypeFromMixins:function(e){for(var d=this.getMixins(),b=[],a=0,c,f;
a<d.length;
a++){c=function(f){for(var g=f.getItemList(e),a=0,d;
a<g.length;
a++)b.push(g[a]);
d=f.getSuperMixins(),a=0;
for(;
a<d.length;
a++)c(apiviewer.dao.Class.getClassByName(d[a].getName()))},f=apiviewer.dao.Class.getClassByName(d[a]);
c(f)}return b},
getDependendClasses:function(){return this._findClasses(this,[])},
getDocNode:function(){return this},
_findClasses:function(c,b){b.push(c);
var h=c.getSuperClass(),f,a,j,e,i,g,k,d,l;
h&&this._findClasses(h,b);
f=c.getMixins(),a=0;
for(;
a<f.length;
a++){j=apiviewer.dao.Class.getClassByName(f[a]);
j?this._findClasses(j,b):this.warn("Missing mixin: "+f[a])}e=c.getSuperMixins(),a=0;
for(;
a<e.length;
a++){i=apiviewer.dao.Class.getClassByName(e[a]);
i?this._findClasses(i,b):this.warn("Missing super mixin: "+e[a])}g=c.getInterfaces(),a=0;
for(;
a<g.length;
a++){k=apiviewer.dao.Class.getClassByName(g[a]);
k?this._findClasses(k,b):this.warn("Missing interface: "+g[a])}d=c.getSuperInterfaces(),a=0;
for(;
a<d.length;
a++){l=apiviewer.dao.Class.getClassByName(d[a]);
l?this._findClasses(l,b):this.warn("Missing super interface: "+d[a])}return b},
_initializeFields:function(){this.base(arguments);
this._desc="";
this._see=[];
this._superInterfaces=[];
this._superMixins=[];
this._childControls=[]},
_addChildNode:function(a){switch(a.type){case"constructor":case"methods":case"methods-static":case"events":case"properties":case"constants":case"appearances":break;
case"superInterfaces":this._superInterfaces=this._createNodeList(a,apiviewer.dao.ClassItem,this,a.type);
break;
case"superMixins":this._superMixins=this._createNodeList(a,apiviewer.dao.ClassItem,this,a.type);
break;
case"childControls":this._childControls=this._createNodeList(a,apiviewer.dao.ChildControl,this,a.type);
break;
case"desc":this._desc=a.attributes.text||"";
break;
case"see":this._see.push(a.attributes.name);
break;
default:return this.base(arguments,a)}return true}},
destruct:function(){this._see=this._superInterfaces=this._superMixins=this._events=this._statics=this._properties=this._constants=this._appearances=this._members=this._package=null;
this._disposeObjects("_constructor")}});


// qx.ui.embed.Html
//   - size: 1070 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Font.getDefaultStyles, 1x
//       qx.theme.manager.Color.getInstance, 1x
//       qx.theme.manager.Font.getInstance, 1x
//       qx.ui.core.MNativeOverflow, 1x
//       qx.ui.core.Widget, 1x
qx.Class.define("qx.ui.embed.Html",{extend:qx.ui.core.Widget,
include:[qx.ui.core.MNativeOverflow],
construct:function(a){this.base(arguments);
a!=null&&this.setHtml(a)},
properties:{html:{check:"String",
apply:"_applyHtml",
event:"changeHtml",
nullable:true},
cssClass:{check:"String",
init:"",
apply:"_applyCssClass"},
selectable:{refine:true,
init:true},
focusable:{refine:true,
init:true}},
members:{getFocusElement:function(){return this.getContentElement()},
_applyHtml:function(b,c){var a=this.getContentElement();
a.setAttribute("html",b||"");
a.setStyles({padding:"0px",
border:"none"})},
_applyCssClass:function(a,b){this.getContentElement().setAttribute("class",a)},
_applySelectable:function(a){this.base(arguments,a)},
_applyFont:function(a,c){var b=a?qx.theme.manager.Font.getInstance().resolve(a).getStyles():qx.bom.Font.getDefaultStyles();
this.getContentElement().setStyles(b)},
_applyTextColor:function(a,b){a?this.getContentElement().setStyle("color",qx.theme.manager.Color.getInstance().resolve(a)):this.getContentElement().removeStyle("color")}}});


// apiviewer.ui.AbstractViewer
//   - size: 3113 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       Error, 2x
//       apiviewer, 4x
//       qx, 5x
//   - packages:
//       apiviewer.ObjectRegistry.register, 1x
//       apiviewer.ui.AbstractViewer.fixLinks, 2x
//       apiviewer.ui.AbstractViewer.highlightCode, 1x
//       qx.Class.define, 1x
//       qx.dev.Tokenizer.javaScriptToHtml, 1x
//       qx.ui.embed.Html, 1x
//       qx.util.ResourceManager.getInstance, 1x
//       qx.util.StringBuilder, 1x
qx.Class.define("apiviewer.ui.AbstractViewer",{type:"abstract",
extend:qx.ui.embed.Html,
construct:function(){this.base(arguments);
this._infoPanelHash={};
this._infoPanels=[];
this.setOverflowX("auto");
this.setOverflowY("auto");
this.setAppearance("detailviewer");
this._infoPanelHash={};
this._infoPanels=[];
apiviewer.ObjectRegistry.register(this)},
properties:{docNode:{check:"apiviewer.dao.Node",
init:null,
nullable:true,
apply:"_applyDocNode"},
showInherited:{check:"Boolean",
init:false,
apply:"_updatePanels"},
expandProperties:{check:"Boolean",
init:false,
apply:"_updatePanels"},
showProtected:{check:"Boolean",
init:false,
apply:"_updatePanels"},
showPrivate:{check:"Boolean",
init:false,
apply:"_updatePanels"}},
statics:{fixLinks:function(c){for(var b=c.getElementsByTagName("a"),a=0;
a<b.length;
a++)typeof b[a].href=="string"&&b[a].href.indexOf("http://")==0&&(b[a].target="_blank")},
highlightCode:function(d){for(var c=d.getElementsByTagName("pre"),b=0,a;
b<c.length;
b++){a=c[b];
if(a.className!=="javascript")continue;
a.innerHTML=qx.dev.Tokenizer.javaScriptToHtml(a.innerHTML)}}},
members:{_infoPanelHash:null,
_infoPanels:null,
__DE4JH:null,
_init:function(a){this.__yZfam();
this.setDocNode(a);
this.addListenerOnce("appear",function(){this._syncHtml();
this._applyDocNode(this.__DE4JH)},this)},
__yZfam:function(){var a=new qx.util.StringBuilder(),c,b,d;
a.add("<div style=\"padding:24px;\">");
a.add("<h1></h1>");
a.add("<div>","</div>");
c=this.getPanels(),b=0;
for(;
b<c.length;
b++){d=c[b];
a.add(d.getPanelHtml(this))}a.add("</div>");
this.setHtml(a.get())},
_getTitleHtml:function(a){throw new Error("Abstract method called!")},
_getDescriptionHtml:function(a){throw new Error("Abstract method called!")},
_syncHtml:function(){var d=this.getContentElement().getDomElement().firstChild,b=d.childNodes,c=this.getPanels(),a,e;
apiviewer.ui.AbstractViewer.fixLinks(d);
this._titleElem=b[0];
this._classDescElem=b[1];
for(a=0;
a<c.length;
a++){e=c[a];
e.setElement(b[a+2])}},
addInfoPanel:function(a){this._infoPanelHash[a.toHashCode()]=a;
this._infoPanels.push(a)},
getPanels:function(){return this._infoPanels},
getPanelFromHashCode:function(a){return this._infoPanelHash[a]},
_updatePanels:function(){for(var b=this.getPanels(),a=0,c;
a<b.length;
a++){c=b[a];
c.update(this,this.__DE4JH)}},
_applyDocNode:function(a){this.__DE4JH=a;
if(!this._titleElem)return;
this._titleElem.innerHTML=this._getTitleHtml(a);
this._classDescElem.innerHTML=this._getDescriptionHtml(a);
apiviewer.ui.AbstractViewer.fixLinks(this._classDescElem);
apiviewer.ui.AbstractViewer.highlightCode(this._classDescElem);
this._updatePanels()},
togglePanelVisibility:function(a){try{a.setIsOpen(!a.getIsOpen());
var c=a.getTitleElement().getElementsByTagName("img")[0];
c.src=qx.util.ResourceManager.getInstance().toUri(a.getIsOpen()?"apiviewer/image/close.gif":"apiviewer/image/open.gif");
a.update(this,this.getDocNode())}catch(b){this.error("Toggling info body failed",b)}}},
destruct:function(){this._classDescElem=this._titleElem=this._infoPanelHash=this.__DE4JH=null;
this._disposeArray("_infoPanels",1)}});


// apiviewer.ui.ClassViewer
//   - size: 7095 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       apiviewer, 24x
//       qx, 15x
//   - packages:
//       apiviewer.TreeUtil.getIconUrl, 2x
//       apiviewer.UiModel.getInstance, 1x
//       apiviewer.dao.Class, 1x
//       apiviewer.dao.Class.getClassByName, 1x
//       apiviewer.ui.AbstractViewer, 1x
//       apiviewer.ui.ClassViewer, 2x
//       apiviewer.ui.ClassViewer.createOverlayImageHtml, 1x
//       apiviewer.ui.panels.AppearancePanel, 1x
//       apiviewer.ui.panels.ChildControlsPanel, 1x
//       apiviewer.ui.panels.ConstantPanel, 1x
//       apiviewer.ui.panels.EventPanel, 1x
//       apiviewer.ui.panels.InfoPanel.createErrorHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createItemLinkHtml, 3x
//       apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml, 1x
//       apiviewer.ui.panels.InfoPanel.resolveLinkAttributes, 1x
//       apiviewer.ui.panels.InfoPanel.setTitleClass, 1x
//       apiviewer.ui.panels.MethodPanel, 3x
//       apiviewer.ui.panels.PropertyPanel, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Engine.OPERA, 1x
//       qx.bom.client.Engine.WEBKIT, 2x
//       qx.bom.element.Scroll.intoView, 1x
//       qx.event.Timer.once, 1x
//       qx.lang.Array.clone, 1x
//       qx.util.ResourceManager.getInstance, 2x
//       qx.util.StringBuilder, 6x
qx.Class.define("apiviewer.ui.ClassViewer",{extend:apiviewer.ui.AbstractViewer,
construct:function(){this.base(arguments);
this.addInfoPanel(new apiviewer.ui.panels.MethodPanel("constructor","constructor"));
this.addInfoPanel(new apiviewer.ui.panels.EventPanel("events","events",true,true));
this.addInfoPanel(new apiviewer.ui.panels.PropertyPanel("properties","properties",true,true));
this.addInfoPanel(new apiviewer.ui.panels.MethodPanel("methods","methods"));
this.addInfoPanel(new apiviewer.ui.panels.MethodPanel("methods-static","static methods"));
this.addInfoPanel(new apiviewer.ui.panels.ConstantPanel("constants","constants",false,true));
this.addInfoPanel(new apiviewer.ui.panels.AppearancePanel("appearances","appearances",false,true));
this.addInfoPanel(new apiviewer.ui.panels.ChildControlsPanel("childControls","child controls"));
this.getContentElement().setAttribute("class","ClassViewer");
this._init(new apiviewer.dao.Class({}))},
statics:{PRIMITIVES:{"var":true,
"void":true,
undefined:true,
arguments:true,
"null":true,
varargs:true,
Boolean:true,
String:true,
Number:true,
Integer:true,
PositiveNumber:true,
PositiveInteger:true,
Float:true,
Double:true,
Error:true,
RegExp:true,
Object:true,
Array:true,
Map:true,
Function:true,
Date:true,
Node:true,
Element:true,
Document:true,
Window:true,
Event:true,
Class:true,
Bootstrap:true,
List:true,
Mixin:true,
Interface:true,
Theme:true,
Color:true,
Decorator:true,
Font:true},
createImageHtml:function(b,c,a){if(typeof b=="string")return"<img src=\""+qx.util.ResourceManager.getInstance().toUri(b)+"\" class=\"img\""+(a?" style=\""+a+"\"":"")+"/>";
a?a+=";vertical-align:top":a="vertical-align:top";
return apiviewer.ui.ClassViewer.createOverlayImageHtml(18,18,b,c,a)},
createOverlayImageHtml:function(e,f,h,g,b){var a="",c,d;
a=qx.bom.client.Engine.WEBKIT?"<span style=\"display:inline;position:relative;top:-2px;width:"+e+"px;height:"+f+"px"+(b==null?"":";"+b)+"\">":"<span style=\"display:inline-block;display:inline;padding-right:18px;position:relative;top:-2px;left:0;width:"+e+"px;height:"+f+"px"+(b==null?"":";"+b)+"\">";
c=qx.bom.client.Engine.WEBKIT?"position:absolute;top:0px;left:0px;padding-right:18px;":qx.bom.client.Engine.OPERA?"margin-right:-18px;":"position:absolute;top:0px;left:0px";
for(d=0;
d<h.length;
d++)a+="<img",g!=null&&(a+=" title=\""+g+"\""),a+=" style=\""+c+"\" src=\""+qx.util.ResourceManager.getInstance().toUri(h[d])+"\"/>";
a+="</span>";
return a}},
members:{_getTitleHtml:function(b){switch(b.getType()){case"mixin":var c="Mixin",a;
break;
case"interface":c="Interface";
break;
default:c="Class";
break}a=new qx.util.StringBuilder();
a.add("<small>",b.getPackageName(),"</small>");
a.add("<span class=\"type\">");
b.isAbstract()?a.add("Abstract "):b.isStatic()?a.add("Static "):b.isSingleton()&&a.add("Singleton ");
a.add(c," </span>");
a.add(apiviewer.ui.panels.InfoPanel.setTitleClass(b,b.getName()));
return a.get()},
_getDescriptionHtml:function(a){switch(a.getType()){case"mixin":var e="sub mixins",b,c,d;
break;
case"interface":e="sub interfaces";
break;
default:e="sub classes";
break}b=new qx.util.StringBuilder(),c=a.getDescription();
c!=""&&b.add("<div class=\"class-description\">",apiviewer.ui.panels.InfoPanel.resolveLinkAttributes(c,a),"</div>");
a.getErrors().length>0&&b.add("<div class=\"class-description\">",apiviewer.ui.panels.InfoPanel.createErrorHtml(a,a),"</div>");
switch(a.getType()){case"mixin":case"interface":b.add(this.__bZBWKt(a));
break;
default:b.add(this.__b89qYv(a));
break}b.add(this.__cvwaFx(a.getChildClasses(),"Direct "+e+":"));
b.add(this.__cvwaFx(a.getInterfaces(),"Implemented interfaces:"));
b.add(this.__cvwaFx(a.getMixins(),"Included mixins:"));
b.add(this.__cvwaFx(a.getImplementations(),"Implementations of this interface:"));
b.add(this.__cvwaFx(a.getIncluder(),"Classes including this mixin:"));
d=a.getConstructor();
d&&b.add(apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml(d));
if(a.isDeprecated()){b.add("<h2 class=\"warning\">","Deprecated:","</h2>");
b.add("<p>");
c=a.getDeprecationText();
c?b.add(c):b.add("This ",a.getType()," is deprecated!");
b.add("</p>")}a.isInternal()&&(b.add("<h2 class=\"warning\">","Internal:","</h2>"),b.add("<p>"),b.add("This ",a.getType()," is internal!"),b.add("</p>"));
return b.get()},
__cvwaFx:function(c,d){if(c.length>0){for(var a=new qx.util.StringBuilder("<h2>",d,"</h2>"),b=0;
b<c.length;
b++)b!=0&&a.add(", "),a.add(apiviewer.ui.panels.InfoPanel.createItemLinkHtml(c[b],null,true,false));
a=a.get()}else a="";
return a},
__b89qYv:function(f){var d=apiviewer.ui.ClassViewer,a=new qx.util.StringBuilder("<h2>","Inheritance hierarchy:","</h2>"),c=f.getClassHierarchy(),e,b;
a.add(d.createImageHtml("apiviewer/image/class18.gif"),"Object<br/>");
e=0,b=c.length-1;
for(;
b>=0;
b--)a.add("<div>"),a.add(d.createImageHtml("apiviewer/image/nextlevel.gif",null,"margin-left:"+e+"px"),d.createImageHtml(apiviewer.TreeUtil.getIconUrl(c[b]))),b!=0?a.add(apiviewer.ui.panels.InfoPanel.createItemLinkHtml(c[b].getFullName(),null,false)):a.add(c[b].getFullName()),e+=18,a.add("</div>");
return a.get()},
__bZBWKt:function(d){if(d.getType()=="mixin")var b="superMixins",a,f,e,c;
else b="superInterfaces";
a=apiviewer.ui.ClassViewer,f=a.createImageHtml("apiviewer/image/blank.gif",null,"width:18px"),e=function(l,j){for(var g=[],i=0,c,m,d,n,k,h;
i<l.length;
i++){c=new qx.util.StringBuilder(),m=l[i];
j?j||c.add(f):i==l.length-1?c.add(a.createImageHtml("apiviewer/image/nextlevel.gif")):c.add(a.createImageHtml("apiviewer/image/cross.gif"));
c.add(a.createImageHtml(apiviewer.TreeUtil.getIconUrl(m)));
j?c.add(m.getFullName()):c.add(apiviewer.ui.panels.InfoPanel.createItemLinkHtml(m.getFullName(),null,false));
g.push(c.get());
d=qx.lang.Array.clone(m.getItemList(b)),n=0;
for(;
n<d.length;
n++)d[n]=apiviewer.dao.Class.getClassByName(d[n].getName());
if(d.length>0){k=e(d),h=0;
for(;
h<k.length;
h++)i==l.length-1?j?g.push(k[h]):g.push(f+k[h]):g.push(a.createImageHtml("apiviewer/image/vline.gif")+k[h])}}return g},c=new qx.util.StringBuilder();
d.getItemList(b).length>0&&(c.add("<h2>","Inheritance hierarchy:","</h2>"),c.add(e([d],true).join("<br />\n")));
return c.get()},
showItem:function(c){var a,e,d,b;
a=c=="construct"?this.getDocNode().getConstructor():this.getDocNode().getItem(c);
if(!a)return false;
this.__1uhzH(a,c);
e=this._getPanelForItemNode(a),d=e.getItemElement(a.getName());
if(!d)return false;
b=d.parentNode.parentNode;
this._markedElement&&(this._markedElement.className="");
b.className="marked";
this._markedElement=b;
qx.event.Timer.once(function(a){qx.bom.element.Scroll.intoView(b,null,"left","top")},this,0);
return true},
__1uhzH:function(a,c){var b=apiviewer.UiModel.getInstance();
a.isFromProperty&&a.isFromProperty()?b.setExpandProperties(true):a.getListName()=="methods"&&(c.indexOf("__")===0?b.setShowPrivate(true):c.indexOf("_")===0&&b.setShowProtected(true))},
_getPanelForItemNode:function(d){for(var c=this.getPanels(),a=0,b;
a<c.length;
a++){b=c[a];
if(b.canDisplayItem(d))return b}}},
destruct:function(){this._titleElem=this._classDescElem=this._markedElement=null}});


// apiviewer.dao.Package
//   - size: 1706 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 5x
//       qx, 1x
//   - packages:
//       apiviewer.dao.Class, 1x
//       apiviewer.dao.Class.registerClass, 1x
//       apiviewer.dao.Method, 1x
//       apiviewer.dao.Node, 1x
//       apiviewer.dao.Package, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.Package",{extend:apiviewer.dao.Node,
construct:function(b,a){this.base(arguments,b);
this._package=a;
apiviewer.dao.Class.registerClass(this)},
members:{getName:function(){return this._docNode.attributes.name},
getFullName:function(){return this._docNode.attributes.fullName||""},
getDescription:function(){return this._desc||""},
getClasses:function(){return this._classes},
getFunctions:function(){return this._functions},
getPackages:function(){return this._packages},
getPackage:function(){return this._package},
addClass:function(c){for(var d=c.getFullName(),a=this.getClasses(),b=0;
b<a.length;
b++)if(a[b].getFullName()==d){a[b]=c;
return}a.push(c)},
getItem:function(e){for(var d=["getClasses","getPackages"],c=0,b,a;
c<d.length;
c++){b=this[d[c]](),a=0;
for(;
a<b.length;
a++)if(e==b[a].getName())return b[a]}},
getItemList:function(b){var a={classes:"getClasses",
packages:"getPackages",
functions:"getFunctions"};
return this[a[b]]()},
getItemByListAndName:function(d,c){for(var b=this.getItemList(d),a=0;
a<b.length;
a++)if(c==b[a].getName())return b[a]},
_initializeFields:function(){this.base(arguments);
this._classes=[];
this._packages=[];
this._functions=[]},
_addChildNode:function(a){switch(a.type){case"classes":this._classes=this._createNodeList(a,apiviewer.dao.Class,this);
break;
case"functions":this._functions=this._createNodeList(a,apiviewer.dao.Method,this);
break;
case"packages":this._packages=this._createNodeList(a,apiviewer.dao.Package,this);
break;
case"desc":this._desc=a.attributes.text||"";
break;
default:return this.base(arguments,a)}return true}},
destruct:function(){this._package=this._classes=this._functions=this._packages=null}});


// apiviewer.ui.panels.InfoPanel
//   - size: 11864 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 4x
//       Object, 1x
//       apiviewer, 21x
//       location, 3x
//       parseInt, 1x
//       qx, 29x
//       window, 3x
//   - packages:
//       Object.prototype.hasOwnProperty.call, 1x
//       apiviewer.ObjectRegistry.register, 1x
//       apiviewer.TreeUtil.getIconUrl, 2x
//       apiviewer.dao.Class, 1x
//       apiviewer.dao.Class.getClassByName, 2x
//       apiviewer.dao.Package, 2x
//       apiviewer.ui.AbstractViewer.fixLinks, 2x
//       apiviewer.ui.AbstractViewer.highlightCode, 2x
//       apiviewer.ui.ClassViewer.PRIMITIVES, 1x
//       apiviewer.ui.ClassViewer.createImageHtml, 2x
//       apiviewer.ui.panels.InfoPanel.createItemLinkHtml, 5x
//       apiviewer.ui.panels.InfoPanel.getItemCssClasses, 1x
//       location.host, 1x
//       location.pathname, 1x
//       location.protocol, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Engine.OPERA, 1x
//       qx.bom.client.Engine.VERSION, 1x
//       qx.core.Object, 1x
//       qx.lang.Array.append, 1x
//       qx.lang.Array.removeAt, 4x
//       qx.lang.Function.returnTrue, 1x
//       qx.lang.String.trim, 2x
//       qx.util.ResourceManager.getInstance, 3x
//       qx.util.StringBuilder, 14x
//       window.location.host, 1x
//       window.location.pathname, 1x
//       window.location.protocol, 1x
qx.Class.define("apiviewer.ui.panels.InfoPanel",{type:"abstract",
extend:qx.core.Object,
construct:function(b,a){this.base(arguments);
this.setListName(b);
this._labelText=a;
apiviewer.ObjectRegistry.register(this)},
properties:{element:{check:"Element",
init:null,
nullable:true,
apply:"_applyElement"},
listName:{check:"String"},
isOpen:{check:"Boolean",
init:true},
docNode:{check:"apiviewer.dao.Node",
nullable:true}},
statics:{ITEM_SPEC_REGEX:/^(([\w\.]+)?(#\w+(\([^\)]*\))?)?)(\s+(.*))?$/,
SENTENCE_END_REGEX:/[^\.].\.(\s|<)/,
resolveLinkAttributes:function(b,e){var f=/\{@link([^\}]*)\}/mg,d=new qx.util.StringBuilder(),a,c=0;
while((a=f.exec(b))!=null)d.add(b.substring(c,a.index)+this.createItemLinkHtml(a[1],e)),c=a.index+a[0].length;
d.add(b.substring(c,b.length));
return d.get()},
createItemLinkHtml:function(b,c,n,w){n==null&&(n=true);
b=qx.lang.String.trim(b);
if(b.charAt(0)=="\""||b.charAt(0)=="<")return b;
var d=this.ITEM_SPEC_REGEX.exec(b),a,f,g,t,s,r,q,i,e,h,o,u,p,k,l,m,j,v;
if(d==null)return b;
a=d[2],f=d[3],g=d[6],t="";
if(a==null||a.length==0)a=c.getFullName();
else if(c&&a.indexOf(".")==-1){s=c.getName();
if(c instanceof apiviewer.dao.Package)r=c.getFullName();
else{q=c.getFullName(),r=q.substring(0,q.length-s.length-1)}a=r+"."+a}(g==null||g.length==0)&&(g=d[1]);
if(n){i=apiviewer.dao.Class.getClassByName(a);
if(i){if(f){h=f.substring(1),o=h.indexOf("(");
o!=-1&&(h=qx.lang.String.trim(h.substring(0,o)));
e=i.getItem(h)}else e=i;
if(e){u=apiviewer.TreeUtil.getIconUrl(e),p=apiviewer.ui.ClassViewer.createImageHtml(u)}}}k=a+(f?f:"");
qx.bom.client.Engine.OPERA&&qx.bom.client.Engine.VERSION>9?(l=location.protocol,m=location.host,j=location.pathname):(l=window.location.protocol,m=window.location.host,j=window.location.pathname);
v=["<span style=\"white-space: nowrap;\">",(typeof p!="undefined"?p:""),"<a style=\""+t+"\" href=\""+l,"//",m,j,"#",k,"\" onclick=\"return false;\"","\" onmouseup=\"apiviewer.TabViewController.instance.onSelectItem('",k,"'); return false;\""," title=\"",k,"\">",g,"</a></span>"];
return v.join("")},
createSeeAlsoHtml:function(e){var b=e.getSee(),a,c,d;
if(b.length>0){a=new qx.util.StringBuilder(),c=0;
for(;
c<b.length;
c++)a.length!=0&&a.add(", "),a.add(this.createItemLinkHtml(b[c],e.getClass()));
if(!a.isEmpty()){d=new qx.util.StringBuilder();
d.add("<div class=\"item-detail-headline\">","See also:","</div>","<div class=\"item-detail-text\">",a,"</div>");
return d.get()}}return""},
createInheritedFromHtml:function(a,c){if(a.getClass().getType()!="mixin"&&a.getClass()!=c){var b=new qx.util.StringBuilder("<div class=\"item-detail-headline\">","Inherited from:","</div>","<div class=\"item-detail-text\">",apiviewer.ui.panels.InfoPanel.createItemLinkHtml(a.getClass().getFullName()+"#"+a.getName()),"</div>");
return b.get()}return""},
createOverwriddenFromHtml:function(a){if(a.getOverriddenFrom()){var b=new qx.util.StringBuilder("<div class=\"item-detail-headline\">","Overrides:","</div>","<div class=\"item-detail-text\">",apiviewer.ui.panels.InfoPanel.createItemLinkHtml(a.getOverriddenFrom().getFullName()+"#"+a.getName()),"</div>");
return b.get()}return""},
createIncludedFromHtml:function(a,c){if(a.getClass()!=c){if(a.getClass().getType()=="mixin"){var b=new qx.util.StringBuilder("<div class=\"item-detail-headline\">","Included from mixin:","</div>","<div class=\"item-detail-text\">",apiviewer.ui.panels.InfoPanel.createItemLinkHtml(a.getClass().getFullName()+"#"+a.getName()),"</div>");
return b.get()}}else return""},
createDescriptionHtml:function(d,b,c){var a=d.getDescription();
if(a){c||(a=this.__b23BLn(a));
return"<div class=\"item-desc\">"+this.resolveLinkAttributes(a,b)+"</div>"}return""},
__b23BLn:function(d){var a=d,c=a.indexOf("</p>"),b;
if(c!=-1){a=a.substr(0,c+4);
b=this.SENTENCE_END_REGEX.exec(a);
b!=null&&(a=d.substring(0,b.index+b[0].length-1)+"</p>")}return a},
descriptionHasDetails:function(b){var a=b.getDescription();
return a?this.__b23BLn(a)!=a:false},
createTypeHtml:function(g,k,e){e==null&&(e=true);
var b=[],h,c,f,a,d,i,j;
g&&(b=g.getTypes());
a=new qx.util.StringBuilder();
if(b.length==0)a.add(k);
else{b.length>1&&a.add("(");
for(d=0;
d<b.length;
d++){d>0&&a.add(" | ");
c=b[d].type;
h=b[d].dimensions;
if(apiviewer.ui.ClassViewer.PRIMITIVES[c])a.add(c);
else{f=c;
if(e){i=c.lastIndexOf(".");
i!=-1&&(f+=" "+c.substring(i+1))}a.add(apiviewer.ui.panels.InfoPanel.createItemLinkHtml(f,g.getClass(),false,true))}if(h)for(j=0;
j<parseInt(h);
j++)a.add("[]")}b.length>1&&a.add(")")}return a.get()},
createErrorHtml:function(d,e){var f=d.getDocNode(),c=f.getErrors(),a,b;
if(c.length>0){a=new qx.util.StringBuilder("<div class=\"item-detail-error\">","Documentation errors:","</div>"),b=0;
for(;
b<c.length;
b++)a.add("<div class=\"item-detail-text\">",c[b].attributes.msg," <br/>"),a.add("("),d.getClass()!=e&&a.add(d.getClass().getFullName(),"; "),a.add("Line: ",c[b].attributes.line,", Column:",c[b].attributes.column+")","</div>");
return a.get()}return""},
createDeprecationHtml:function(c,d){if(!c.isDeprecated())return"";
var a=new qx.util.StringBuilder(),b;
a.add("<div class=\"item-detail-error\">","Deprecated:","</div>");
a.add("<div class=\"item-detail-text\">");
b=c.getDeprecationText();
b?a.add(b):a.add("This ",d," is deprecated!");
a.add("</div>");
return a.get()},
createAccessHtml:function(c){if(c.isPublic())return"";
var a=new qx.util.StringBuilder(),b;
a.add("<div class=\"item-detail-headline\">","Access:","</div>");
a.add("<div class=\"item-detail-text\">");
b=[];
c.isPrivate()&&b.push("private");
c.isInternal()&&b.push("internal");
c.isProtected()&&b.push("protected");
a.add(b.join(" "));
a.add("</div>");
return a.get()},
createInfoRequiredByHtml:function(d){var a=new qx.util.StringBuilder(),b=d.getRequiredBy(),c;
if(b.length>0){a.add("<div class=\"item-detail-headline\">","Required by:","</div>");
for(c=0;
c<b.length;
c++)a.add("<div class=\"item-detail-text\">",apiviewer.ui.panels.InfoPanel.createItemLinkHtml(b[c].getFullName()+"#"+d.getName()),"</div>")}return a.get()},
setTitleClass:function(c,b){var a=["<span class='","","'>",b,"</span>"];
a[1]=this.getItemCssClasses(c);
return a.join("")},
getItemCssClasses:function(b){var a=[];
b.isDeprecated()&&a.push("item-deprecated");
b.isPrivate()&&a.push("item-private");
b.isInternal()&&a.push("item-internal");
b.isProtected()&&a.push("item-protected");
return a.join(" ")}},
members:{canDisplayItem:function(a){return a.getListName()==this.getListName()},
getItemTypeHtml:function(b,a){throw new Error("Abstract method called!")},
getItemTitleHtml:function(b,a){throw new Error("Abstract method called!")},
getItemTextHtml:function(c,a,b){throw new Error("Abstract method called!")},
getItemTooltip:function(b,a){return""},
getItemHtml:function(b,c,j){if(b instanceof apiviewer.dao.Class||b instanceof apiviewer.dao.Package)var d=b.getPackage(),a,h,i,e,g,f;
else d=b.getClass();
a=new qx.util.StringBuilder(),h=d!=c&&d.getType()=="class",i=apiviewer.TreeUtil.getIconUrl(b,h);
a.add("<tr class=\"",apiviewer.ui.panels.InfoPanel.getItemCssClasses(b),"\">");
e=this.getItemTooltip(b,c),g=e?"title=\""+e+"\" alt=\""+e+"\"":"";
a.add("<td class=\"icon\" ",g,">",apiviewer.ui.ClassViewer.createImageHtml(i),"</td>");
f=this.getItemTypeHtml(b,c);
a.add("<td class=\"type\">",(f?f+"&nbsp;":"&nbsp;"),"</td>");
a.add("<td class=\"toggle\">");
this.itemHasDetails(b,c)?a.add("<img src=\"",qx.util.ResourceManager.getInstance().toUri("apiviewer/image/open.gif"),"\" onclick=\"",this.__UJ19I(this),".toggleShowItemDetails('",b.getName(),"'",(d!=c?",'"+d.getFullName()+"'":""),")\"/>"):a.add("&#160;");
a.add("</td>");
a.add("<td class=\"text\">");
a.add("<h3");
this.itemHasDetails(b,c)?a.add(" onclick=\"",this.__UJ19I(this),".toggleShowItemDetails('",b.getName(),"'",(d!=c?",'"+d.getFullName()+"'":""),")\">"):a.add(">");
a.add(this.getItemTitleHtml(b,c));
a.add("</h3>");
a.add("<div _itemName=\"",b.getName(),"\">");
a.add(this.getItemTextHtml(b,c,j));
a.add("</div>");
a.add("</td>");
a.add("</tr>");
return a.get()},
itemHasDetails:qx.lang.Function.returnTrue,
__UJ19I:function(a){return"apiviewer.ObjectRegistry.getObjectFromHashCode('"+a.toHashCode()+"')"},
getPanelHtml:function(b){var c=this._labelText.charAt(0).toUpperCase()+this._labelText.substring(1),a=new qx.util.StringBuilder("<div class=\"info-panel\"><h2>");
a.add("<img class=\"openclose\" src=\"",qx.util.ResourceManager.getInstance().toUri("apiviewer/image/"+(this.getIsOpen()?"close.gif":"open.gif")),"\" onclick=\"",this.__UJ19I(b),".togglePanelVisibility("+this.__UJ19I(this),")\"/> ","<span onclick=\"",this.__UJ19I(b),".togglePanelVisibility(",this.__UJ19I(this),")\">",c,"</span>");
a.add("</h2><div></div></div>");
return a.get()},
_getPanelItems:function(k,b){if(!b)return[];
var a=this.getListName(),i=[],h={},g,e,f,d,c,j;
if(k&&(a=="events"||a=="properties"||a=="methods")){if(b.getType()=="interface")g=b.getInterfaceHierarchy();
else g=b.getClassHierarchy()}else g=[b];
for(e=0;
e<g.length;
e++){f=g[e],d=f.getItemList(a);
(a=="events"||a=="properties"||a=="methods")&&qx.lang.Array.append(d,f.getNodesOfTypeFromMixins(this.getListName()));
for(c=0;
c<d.length;
c++){j=d[c].getName();
Object.prototype.hasOwnProperty.call(h,j)||(h[j]=f,i.push(d[c]))}}return i},
__PtT8t:function(d,e,h,f,g){for(var b=d.concat(),a=d.length-1,c;
a>=0;
a--){c=d[a];
c.isPropertyGenerated()&&!e?qx.lang.Array.removeAt(b,a):c.isPrivate()&&!f?qx.lang.Array.removeAt(b,a):c.isProtected()&&!h?qx.lang.Array.removeAt(b,a):c.isInternal()&&!g&&qx.lang.Array.removeAt(b,a)}return b},
_sortItems:function(a){a.sort(function(d,c){var a=0,b,e,f;
d.isInternal()&&(a+=4);
d.isPrivate()&&(a+=2);
d.isProtected()&&(a+=1);
b=0;
c.isInternal()&&(b+=4);
c.isPrivate()&&(b+=2);
c.isProtected()&&(b+=1);
if(a==b){e=d.getName(),f=c.getName();
return e.toLowerCase()<f.toLowerCase()?-1:1}return a-b})},
_displayNodes:function(a,d){if(a&&a.length>0){for(var b=new qx.util.StringBuilder("<table cellspacing=\"0\" cellpadding=\"0\" class=\"info\" width=\"100%\">"),c=0;
c<a.length;
c++)b.add(this.getItemHtml(a[c],d,false));
b.add("</table>");
this.getBodyElement().innerHTML=b.get();
apiviewer.ui.AbstractViewer.fixLinks(this.getBodyElement());
apiviewer.ui.AbstractViewer.highlightCode(this.getBodyElement());
this.getBodyElement().style.display=this.getIsOpen()?"":"none";
this.getElement().style.display=""}else this.getElement().style.display="none"},
update:function(b,c){if(!this.getElement())return;
this.setDocNode(c);
var h=b.getShowInherited(),a=this._getPanelItems(h,c),e,g,d,f;
if(a&&a.length>0){e=b.getExpandProperties(),g=b.getShowProtected(),d=b.getShowPrivate(),f=d;
a=this.__PtT8t(a,e,g,d,f);
this._sortItems(a)}this._displayNodes(a,c)},
_applyElement:function(a){this._titleElement=a.firstChild;
this._bodyElement=a.lastChild},
getTitleElement:function(){return this._titleElement},
getBodyElement:function(){return this._bodyElement},
getItemElement:function(c){for(var b=this.getBodyElement().getElementsByTagName("TBODY")[0].childNodes,a=0;
a<b.length;
a++)if(b[a].childNodes[3].childNodes[1].getAttribute("_itemName")==c)return b[a].childNodes[3].childNodes[1]},
toggleShowItemDetails:function(b,d){try{var a=this.getItemElement(b),c,e,h,f;
if(!a)throw Error("Element for name '"+b+"' not found!");
c=a._showDetails?!a._showDetails:true;
a._showDetails=c;
if(d)e=apiviewer.dao.Class.getClassByName(d);
else e=this.getDocNode();
h=e.getItemByListAndName(this.getListName(),b),f=a.parentNode.previousSibling.firstChild;
f.src=qx.util.ResourceManager.getInstance().toUri(c?"apiviewer/image/close.gif":"apiviewer/image/open.gif");
a.innerHTML=this.getItemTextHtml(h,this.getDocNode(),c);
apiviewer.ui.AbstractViewer.fixLinks(a);
apiviewer.ui.AbstractViewer.highlightCode(a)}catch(g){this.error("Toggling item details failed");
this.error(g)}}},
destruct:function(){this._titleElement=this._bodyElement=null}});


// apiviewer.ui.panels.MethodPanel
//   - size: 3549 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 19x
//       qx, 4x
//   - packages:
//       apiviewer.ui.panels.InfoPanel, 1x
//       apiviewer.ui.panels.InfoPanel.createAccessHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createDeprecationHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createDescriptionHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createErrorHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createIncludedFromHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createInfoRequiredByHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createInheritedFromHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createItemLinkHtml, 2x
//       apiviewer.ui.panels.InfoPanel.createOverwriddenFromHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createTypeHtml, 2x
//       apiviewer.ui.panels.InfoPanel.descriptionHasDetails, 1x
//       apiviewer.ui.panels.InfoPanel.resolveLinkAttributes, 3x
//       apiviewer.ui.panels.InfoPanel.setTitleClass, 1x
//       qx.Class.define, 1x
//       qx.util.StringBuilder, 3x
qx.Class.define("apiviewer.ui.panels.MethodPanel",{extend:apiviewer.ui.panels.InfoPanel,
members:{getItemTitleHtml:function(b){if(b.isConstructor())var e=b.getClass().getName(),a,f,c,d;
else e=b.getName();
a=new qx.util.StringBuilder(apiviewer.ui.panels.InfoPanel.setTitleClass(b,e));
a.add("<span class=\"method-signature\"><span class=\"parenthesis\">(</span>");
f=b.getParams(),c=0;
for(;
c<f.length;
c++){d=f[c];
c!=0&&a.add("<span class=\"separator\">,</span> ");
a.add("<span class=\"parameter-type\">",apiviewer.ui.panels.InfoPanel.createTypeHtml(d,"var"),"</span> <code>",d.getName(),"</code>");
d.getDefaultValue()&&a.add("?")}a.add("<span class=\"parenthesis\">)</span></span>");
return a.get()},
getItemTypeHtml:function(b){var a=new qx.util.StringBuilder();
b.isAbstract()&&a.add("abstract ");
b.isConstructor()||a.add(apiviewer.ui.panels.InfoPanel.createTypeHtml(b.getDocNode().getReturn(),"void"));
return a.get()},
getItemTextHtml:function(b,h,m){var f=b.getClass(),a=new qx.util.StringBuilder(),i,c,d,p,n,k,e,l,j,g,o;
b.isConstructor()&&!b.getDescription()?a.add("Creates a new instance of ",f.getName(),"."):a.add(apiviewer.ui.panels.InfoPanel.createDescriptionHtml(b,f,m));
if(m){i=b.getDocNode().getParams();
if(i.length>0){a.add("<div class=\"item-detail-headline\">","Parameters:","</div>");
for(c=0;
c<i.length;
c++){d=i[c],p=d.getType()?d.getType():"var",n=d.getArrayDimensions();
if(n)for(c=0;
c<n;
c++)p+="[]";
k=d.getDefaultValue();
a.add("<div class=\"item-detail-text\">");
k&&a.add("<span class=\"item-detail-optional\">");
a.add("<code>",d.getName(),"</code>");
k&&a.add(" (default: ",k,") ","</span>");
e=d.getDescription();
e&&a.add(" ",apiviewer.ui.panels.InfoPanel.resolveLinkAttributes(e,f));
a.add("</div>")}}l=b.getDocNode().getReturn();
if(l){e=l.getDescription();
e&&a.add("<div class=\"item-detail-headline\">","Returns:","</div>","<div class=\"item-detail-text\">",apiviewer.ui.panels.InfoPanel.resolveLinkAttributes(e,f),"</div>")}b.getApply()&&a.add("<div class=\"item-detail-headline\">","Apply method of property:","</div>","<div class=\"item-detail-text\">",apiviewer.ui.panels.InfoPanel.createItemLinkHtml(b.getApply(),b.getClass(),true,true),"</div>");
j=b.getDocNode().getThrows();
if(j.length>0){a.add("<div class=\"item-detail-headline\">","Throws:","</div>");
for(c=0;
c<j.length;
c++){g=j[c],o=g.getType()?g.getType():g.getDefaultType();
a.add("<div class=\"item-detail-text\">");
a.add("<span class=\"parameter-type\">",apiviewer.ui.panels.InfoPanel.createItemLinkHtml(o),"</span>");
e=g.getDescription();
e&&a.add(" ",apiviewer.ui.panels.InfoPanel.resolveLinkAttributes(e,f));
a.add("</div>")}}a.add(apiviewer.ui.panels.InfoPanel.createAccessHtml(b));
a.add(apiviewer.ui.panels.InfoPanel.createIncludedFromHtml(b,h));
a.add(apiviewer.ui.panels.InfoPanel.createOverwriddenFromHtml(b));
a.add(apiviewer.ui.panels.InfoPanel.createInheritedFromHtml(b,h));
a.add(apiviewer.ui.panels.InfoPanel.createInfoRequiredByHtml(b));
a.add(apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml(b));
a.add(apiviewer.ui.panels.InfoPanel.createErrorHtml(b,h));
a.add(apiviewer.ui.panels.InfoPanel.createDeprecationHtml(b,"function"))}return a.get()},
itemHasDetails:function(a,d){var b=a.getDocNode(),c=b.getReturn()&&b.getReturn().getDescription();
return a.getClass()!=d||a.getOverriddenFrom()!=null||a.getRequiredBy().length>0||b.getParams().length>0||b.getThrows().length>0||c||a.getSee().length>0||a.getErrors().length>0||a.isDeprecated()||a.getApply()||apiviewer.ui.panels.InfoPanel.descriptionHasDetails(a)}}});


// apiviewer.ui.panels.ConstantPanel
//   - size: 1087 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 8x
//       qx, 4x
//   - packages:
//       apiviewer.ui.panels.InfoPanel, 1x
//       apiviewer.ui.panels.InfoPanel.createDeprecationHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createDescriptionHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createErrorHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createTypeHtml, 1x
//       apiviewer.ui.panels.InfoPanel.descriptionHasDetails, 1x
//       apiviewer.ui.panels.InfoPanel.setTitleClass, 1x
//       qx.Class.define, 1x
//       qx.bom.String.escape, 1x
//       qx.util.Json.stringify, 1x
//       qx.util.StringBuilder, 1x
qx.Class.define("apiviewer.ui.panels.ConstantPanel",{extend:apiviewer.ui.panels.InfoPanel,
members:{itemHasDetails:function(a,b){return a.getSee().length>0||a.getErrors().length>0||apiviewer.ui.panels.InfoPanel.descriptionHasDetails(a)||this.__b0ywaF(a)},
getItemTypeHtml:function(a){return apiviewer.ui.panels.InfoPanel.createTypeHtml(a,"var")},
getItemTitleHtml:function(a){return apiviewer.ui.panels.InfoPanel.setTitleClass(a,a.getName())},
getItemTextHtml:function(a,d,c){var b=apiviewer.ui.panels.InfoPanel.createDescriptionHtml(a,a.getClass(),c);
c&&(b+=this.__cxAAvX(a),b+=apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml(a),b+=apiviewer.ui.panels.InfoPanel.createErrorHtml(a,d),b+=apiviewer.ui.panels.InfoPanel.createDeprecationHtml(a,"constant"));
return b},
__b0ywaF:function(a){return a.getValue()?true:false},
__cxAAvX:function(a){if(this.__b0ywaF(a)){var b=new qx.util.StringBuilder("<div class=\"item-detail-headline\">","Value: ","</div>","<div class=\"item-detail-text\">",qx.bom.String.escape(qx.util.Json.stringify(a.getValue())),"</div>");
return b.get()}return""}}});


// apiviewer.ui.panels.EventPanel
//   - size: 854 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 9x
//       qx, 2x
//   - packages:
//       apiviewer.ui.panels.InfoPanel, 1x
//       apiviewer.ui.panels.InfoPanel.createDeprecationHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createDescriptionHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createErrorHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createInheritedFromHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createTypeHtml, 1x
//       apiviewer.ui.panels.InfoPanel.descriptionHasDetails, 1x
//       apiviewer.ui.panels.InfoPanel.setTitleClass, 1x
//       qx.Class.define, 1x
//       qx.util.StringBuilder, 1x
qx.Class.define("apiviewer.ui.panels.EventPanel",{extend:apiviewer.ui.panels.InfoPanel,
members:{itemHasDetails:function(a,b){return a.getClass()!=b||a.getSee().length>0||a.getErrors().length>0||apiviewer.ui.panels.InfoPanel.descriptionHasDetails(a)},
getItemTypeHtml:function(a){return apiviewer.ui.panels.InfoPanel.createTypeHtml(a,"var")},
getItemTitleHtml:function(a){return apiviewer.ui.panels.InfoPanel.setTitleClass(a,a.getName())},
getItemTextHtml:function(a,c,d){var b=new qx.util.StringBuilder(apiviewer.ui.panels.InfoPanel.createDescriptionHtml(a,a.getClass(),d));
d&&(b.add(apiviewer.ui.panels.InfoPanel.createInheritedFromHtml(a,c)),b.add(apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml(a)),b.add(apiviewer.ui.panels.InfoPanel.createErrorHtml(a,c)),b.add(apiviewer.ui.panels.InfoPanel.createDeprecationHtml(a,"event")));
return b.get()}}});


// apiviewer.ui.panels.PropertyPanel
//   - size: 4369 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 14x
//       qx, 8x
//   - packages:
//       apiviewer.ui.panels.InfoPanel, 1x
//       apiviewer.ui.panels.InfoPanel.createDeprecationHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createDescriptionHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createErrorHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createIncludedFromHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createInfoRequiredByHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createInheritedFromHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createItemLinkHtml, 3x
//       apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createTypeHtml, 1x
//       apiviewer.ui.panels.InfoPanel.resolveLinkAttributes, 1x
//       apiviewer.ui.panels.InfoPanel.setTitleClass, 1x
//       qx.Class.define, 1x
//       qx.dev.Tokenizer.javaScriptToHtml, 1x
//       qx.lang.Array.clone, 1x
//       qx.lang.String.firstUp, 1x
//       qx.util.StringBuilder, 4x
qx.Class.define("apiviewer.ui.panels.PropertyPanel",{extend:apiviewer.ui.panels.InfoPanel,
members:{__c6s3cd:function(c,f){if(c.isRefined())return"";
if(c.isPrivate()){var b="__",a=c.getName().substring(2),d,e}else c.isProtected()?(b="_",a=c.getName().substring(1)):(b="",a=c.getName());
a=qx.lang.String.firstUp(a);
d=[];
c.getPropertyType()=="fast"?d.push("{@link #"+b+"get"+a+"}</td><td> Get the property value."):(d.push("{@link #"+b+"set"+a+"}</td><td> Set the property value."),c.isPropertyGroup()||(d.push("{@link #"+b+"get"+a+"}</td><td> Get the property value."),d.push("{@link #"+b+"init"+a+"}</td><td> Call apply method with the init value.")),d.push("{@link #"+b+"reset"+a+"}</td><td> Reset the property value."),c.getType()=="Boolean"&&(d.push("{@link #"+b+"toggle"+a+"}</td><td> Toggle the property value."),d.push("{@link #"+b+"is"+a+"}</td><td> Check whether the property equals <code>true</code>.")));
e=new qx.util.StringBuilder();
e.add("<div class=\"item-detail-headline\">","Generated methods:","</div>","<div class=\"item-detail-text\">");
e.add("<table><tr><td>");
e.add(d.join("</td></tr><tr><td>"));
e.add("</td></tr></table>");
e.add("</div>");
return apiviewer.ui.panels.InfoPanel.resolveLinkAttributes(e.get(),f)},
__b1nFg3:function(c){var a=[],b;
c.isNullable()&&a.push("This property allows 'null' values");
c.isInheritable()&&a.push("The property value can be inherited from a parent object.");
c.isThemeable()&&a.push("The property value can be set using appearance themes.");
c.isPropertyGroup()&&a.push("The property is a property group.");
c.isRefined()&&a.push("The property refines the init value of an existing property.");
if(a.length>0){b=new qx.util.StringBuilder();
b.add("<div class=\"item-detail-headline\">","Property attributes:","</div>","<div class=\"item-detail-text\">");
b.add("<ul><li>");
b.add(a.join("</li><li>"));
b.add("</li></ul>");
b.add("</div>");
return b.get()}return""},
__b9qcXd:function(a){if(a.isRefined()){var b=new qx.util.StringBuilder("<div class=\"item-detail-headline\">","Refined property:","</div>","<div class=\"item-detail-text\">",apiviewer.ui.panels.InfoPanel.createItemLinkHtml(a.getOverriddenFrom().getFullName()+"#"+a.getName()),"</div>");
return b.get()}return""},
getItemTypeHtml:function(a){return apiviewer.ui.panels.InfoPanel.createTypeHtml(a,"var")},
getItemTitleHtml:function(a){return apiviewer.ui.panels.InfoPanel.setTitleClass(a,a.getName())},
getItemTextHtml:function(a,d,g){var f=a.getDocNode(),b=new qx.util.StringBuilder(apiviewer.ui.panels.InfoPanel.createDescriptionHtml(a,a.getClass(),g)),c,e;
if(g){c=null,e=qx.lang.Array.clone(a.getPossibleValues());
e.length>0?(a.isNullable()&&e.push("null"),c="<code>"+e.join("</code>, <code>")+"</code>"):a.getClassname()?c="instances of "+a.getClassname():a.getInstance()?c="instances of "+a.getInstance()+" or sub classes":a.getType()&&(c="any "+a.getType());
c&&(b.add("<div class=\"item-detail-headline\">","Allowed values:","</div>","<div class=\"item-detail-text\">"),b.add(c,"</div>"));
a.getCheck()&&b.add("<div class=\"item-detail-headline\">","Check:","</div>","<div class=\"javascript\">",qx.dev.Tokenizer.javaScriptToHtml(a.getCheck()),"</div>");
a.isPropertyGroup()||b.add("<div class=\"item-detail-headline\">","Init value:","</div>","<div class=\"item-detail-text\">","<code>",(a.getDefaultValue()?a.getDefaultValue():"null"),"</code>","</div>");
a.getEvent()&&!a.isRefined()&&b.add("<div class=\"item-detail-headline\">","Change event:","</div>","<div class=\"item-detail-text\">",apiviewer.ui.panels.InfoPanel.createItemLinkHtml("#"+a.getEvent(),a.getClass(),true,true),"</div>");
a.getApplyMethod()&&!a.isRefined()&&b.add("<div class=\"item-detail-headline\">","Apply method:","</div>","<div class=\"item-detail-text\">",apiviewer.ui.panels.InfoPanel.createItemLinkHtml("#"+a.getApplyMethod(),a.getClass(),true,true),"</div>");
b.add(this.__b1nFg3(a));
b.add(this.__c6s3cd(a,d));
b.add(apiviewer.ui.panels.InfoPanel.createIncludedFromHtml(a,d));
b.add(this.__b9qcXd(a));
b.add(apiviewer.ui.panels.InfoPanel.createInheritedFromHtml(a,d));
b.add(apiviewer.ui.panels.InfoPanel.createInfoRequiredByHtml(a));
b.add(apiviewer.ui.panels.InfoPanel.createSeeAlsoHtml(f));
b.add(apiviewer.ui.panels.InfoPanel.createErrorHtml(a,d));
b.add(apiviewer.ui.panels.InfoPanel.createDeprecationHtml(f,"property"))}return b.get()}}});


// apiviewer.ui.panels.AppearancePanel
//   - size: 1692 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 5x
//       qx, 4x
//   - packages:
//       apiviewer.ui.panels.InfoPanel, 1x
//       apiviewer.ui.panels.InfoPanel.createDescriptionHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createItemLinkHtml, 1x
//       apiviewer.ui.panels.InfoPanel.resolveLinkAttributes, 1x
//       apiviewer.ui.panels.InfoPanel.setTitleClass, 1x
//       qx.Class.define, 1x
//       qx.lang.Array.append, 1x
//       qx.lang.Array.clone, 1x
//       qx.util.StringBuilder, 1x
qx.Class.define("apiviewer.ui.panels.AppearancePanel",{extend:apiviewer.ui.panels.InfoPanel,
members:{__cip9dg:function(b){var f=b.getStates(),c,h,a,e,g,d,j,i;
if(f.length>0)c=qx.lang.Array.clone(f);
else c=[];
h=b.getType(),a=b.getClass(),e=1;
h!=a&&(a=h,e=0);
g=a.getClassHierarchy(),d=e;
for(;
d<g.length;
d++){a=g[d];
j=a.getClassAppearance();
if(j){i=j.getStates();
i&&qx.lang.Array.append(c,i)}}return c},
_getPanelItems:function(f,a){var d=this.base(arguments,f,a),e,b,g,c;
if(!f)return d;
e=a.getClassHierarchy(),b=0;
for(;
b<e.length;
b++){g=e[b],c=g.getClassAppearance();
if(c){c.getType()!=a&&d.push(c);
return d}}},
getItemTypeHtml:function(a){var b=a.getName(),c;
if(a.getType()==a.getClass())c=b+" (default appearance of the class)";
else c=b;
return c},
getItemTitleHtml:function(a){return apiviewer.ui.panels.InfoPanel.setTitleClass(a,a.getName())},
getItemTextHtml:function(c,i,h){var a=new qx.util.StringBuilder(),d,e,b,g,f;
a.add("<div class=\"item-desc\">",apiviewer.ui.panels.InfoPanel.createDescriptionHtml(c,c.getClass(),true),"</div>");
if(h){d=this.__cip9dg(c);
if(d.length>0){a.add("<div class=\"item-detail-headline\">","States:","</div>");
for(e=0;
e<d.length;
e++){b=d[e];
a.add("<div class='item-detail-text'><code>",b.getName(),"</code><p>");
g=b.getAppearance();
g.getType()!=c.getClass()&&a.add(" <span class='item-detail-define'>defined by ",apiviewer.ui.panels.InfoPanel.createItemLinkHtml(g.getType().getFullName()),"</span>: ");
f=b.getDescription();
f&&a.add(" ",apiviewer.ui.panels.InfoPanel.resolveLinkAttributes(f,b.getClass()));
a.add("</p></div>")}a.add("</div>")}}return a.get()},
itemHasDetails:function(a,b){return this.__cip9dg(a).length>0}}});


// apiviewer.ui.panels.ChildControlsPanel
//   - size: 595 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       apiviewer, 3x
//       qx, 2x
//   - packages:
//       apiviewer.ui.panels.InfoPanel, 1x
//       apiviewer.ui.panels.InfoPanel.createTypeHtml, 1x
//       apiviewer.ui.panels.InfoPanel.setTitleClass, 1x
//       qx.Class.define, 1x
//       qx.util.StringBuilder, 1x
qx.Class.define("apiviewer.ui.panels.ChildControlsPanel",{extend:apiviewer.ui.panels.InfoPanel,
members:{getItemTypeHtml:function(a,b){return apiviewer.ui.panels.InfoPanel.createTypeHtml(a,"var",true)},
getItemTitleHtml:function(a,b){return apiviewer.ui.panels.InfoPanel.setTitleClass(a,a.getName())},
getItemTextHtml:function(a,d,c){var b=new qx.util.StringBuilder(a.getDescription());
c&&b.add("<div class=\"item-detail-headline\">","Default value:","</div>","<div class=\"item-detail-text\">","<code>",(a.getDefaultValue()?a.getDefaultValue():"null"),"</code>","</div>");
return b.get()}}});


// apiviewer.dao.Property
//   - size: 1751 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 5x
//       qx, 1x
//   - packages:
//       apiviewer.dao.Class.getClassByName, 2x
//       apiviewer.dao.ClassItem, 1x
//       apiviewer.ui.ClassViewer.PRIMITIVES, 2x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.Property",{extend:apiviewer.dao.ClassItem,
members:{getTypes:function(){var a=this.base(arguments),c=this.getDocNode(),b=c.getType();
b&&a.push({type:b,
dimensions:c.getNode().attributes.dimensions});
return a},
getCheck:function(){var a=this.getDocNode()._docNode.attributes;
if(a.check)if(!apiviewer.dao.Class.getClassByName(a.check)&&!apiviewer.ui.ClassViewer.PRIMITIVES[a.check])return a.check;
return null},
getClassname:function(){return this._docNode.attributes.classname},
getInstance:function(){return this._docNode.attributes.instance},
getPossibleValues:function(){var a=this._docNode.attributes.possibleValues;
if(a){a=a.split(",");
return a}return[]},
getGroup:function(){var a=this.getDocNode()._docNode.attributes.group;
if(a)return a.split(",");
return[]},
isPropertyGroup:function(){return!!this.getDocNode()._docNode.attributes.group},
getType:function(){var a=this._docNode.attributes;
if(a.type)return a.type;
if(a.check)if(apiviewer.dao.Class.getClassByName(a.check)||apiviewer.ui.ClassViewer.PRIMITIVES[a.check])return a.check;
return null},
getPropertyType:function(){return this.getDocNode()._docNode.attributes.propertyType||"new"},
getEvent:function(){return this.getDocNode()._docNode.attributes.event},
getApplyMethod:function(){return this.getDocNode()._docNode.attributes.apply},
isNullable:function(){return this.getDocNode()._docNode.attributes.allowNull||false},
getDefaultValue:function(){return this._docNode.attributes.defaultValue},
isInheritable:function(){return this.getDocNode()._docNode.attributes.inheritable||false},
isThemeable:function(){return this.getDocNode()._docNode.attributes.themeable||false},
isRefined:function(){return this._docNode.attributes.refine||false}}});


// apiviewer.dao.State
//   - size: 232 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 1x
//       qx, 1x
//   - packages:
//       apiviewer.dao.ClassItem, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.State",{extend:apiviewer.dao.ClassItem,
construct:function(b,a){this.base(arguments,b,a)},
members:{getClass:function(){return this._class.getClass()},
getAppearance:function(){return this._class}}});


// apiviewer.dao.Appearance
//   - size: 577 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 3x
//       qx, 1x
//   - packages:
//       apiviewer.dao.Class.getClassByName, 1x
//       apiviewer.dao.ClassItem, 1x
//       apiviewer.dao.State, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.Appearance",{extend:apiviewer.dao.ClassItem,
construct:function(b,a,c){this.base(arguments,b,a,c)},
members:{getType:function(){return apiviewer.dao.Class.getClassByName(this._docNode.attributes.type)},
getTypes:function(){return[{type:this._docNode.attributes.type}]},
getAppearance:function(){return this.getClass()},
getStates:function(){return this._states||[]},
_addChildNode:function(a){switch(a.type){case"states":this._states=this._createNodeList(a,apiviewer.dao.State,this);
break;
default:return this.base(arguments,a)}return true}}});


// apiviewer.dao.Event
//   - size: 432 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 2x
//       qx, 1x
//   - packages:
//       apiviewer.dao.Class.getClassByName, 1x
//       apiviewer.dao.ClassItem, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.dao.Event",{extend:apiviewer.dao.ClassItem,
construct:function(b,a,c){this.base(arguments,b,a,c)},
members:{getType:function(){return apiviewer.dao.Class.getClassByName(this._type)},
getTypes:function(){return this._type?[{type:this._type}]:null},
_addChildNode:function(a){switch(a.type){case"types":this._type=a.children[0].attributes.type;
break;
default:return this.base(arguments,a)}return true}}});


// qx.ui.table.cellrenderer.Abstract
//   - size: 1628 bytes
//   - modified: 2010-11-02T16:08:00
//   - names:
//       Math, 2x
//       qx, 9x
//   - packages:
//       Math.max, 2x
//       qx.Class.define, 1x
//       qx.bom.Stylesheet.createElement, 1x
//       qx.bom.client.Feature.CONTENT_BOX, 1x
//       qx.bom.element.BoxSizing.compile, 1x
//       qx.bom.element.Style.compile, 1x
//       qx.core.Object, 1x
//       qx.theme.manager.Color.getInstance, 1x
//       qx.ui.table.ICellRenderer, 1x
//       qx.ui.table.cellrenderer.Abstract, 1x
qx.Class.define("qx.ui.table.cellrenderer.Abstract",{type:"abstract",
implement:qx.ui.table.ICellRenderer,
extend:qx.core.Object,
construct:function(){this.base(arguments);
var a=qx.ui.table.cellrenderer.Abstract,c,b;
if(!a.__mHgzf){c=qx.theme.manager.Color.getInstance();
a.__mHgzf=this.self(arguments);
b=".qooxdoo-table-cell {"+qx.bom.element.Style.compile({position:"absolute",
top:"0px",
overflow:"hidden",
whiteSpace:"nowrap",
borderRight:"1px solid "+c.resolve("table-row-line"),
padding:"0px 6px",
cursor:"default",
textOverflow:"ellipsis",
userSelect:"none"})+"} "+".qooxdoo-table-cell-right { text-align:right } "+".qooxdoo-table-cell-italic { font-style:italic} "+".qooxdoo-table-cell-bold { font-weight:bold } ";
b+=".qooxdoo-table-cell {"+qx.bom.element.BoxSizing.compile("content-box")+"}";
a.__mHgzf.stylesheet=qx.bom.Stylesheet.createElement(b)}},
properties:{defaultCellStyle:{init:null,
check:"String",
nullable:true}},
members:{_insetX:13,
_insetY:0,
_getCellClass:function(a){return"qooxdoo-table-cell"},
_getCellStyle:function(a){return a.style||""},
_getCellAttributes:function(a){return""},
_getContentHtml:function(a){return a.value||""},
_getCellSizeStyle:function(c,b,d,e){var a="";
qx.bom.client.Feature.CONTENT_BOX&&(c-=d,b-=e);
a+="width:"+Math.max(c,0)+"px;";
a+="height:"+Math.max(b,0)+"px;";
return a},
createDataCellHtml:function(a,b){b.push("<div class=\"",this._getCellClass(a),"\" style=\"","left:",a.styleLeft,"px;",this._getCellSizeStyle(a.styleWidth,a.styleHeight,this._insetX,this._insetY),this._getCellStyle(a),"\" ",this._getCellAttributes(a),">"+this._getContentHtml(a),"</div>")}}});


// qx.ui.table.rowrenderer.Default
//   - size: 2379 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       qx, 9x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Font.getDefaultStyles, 1x
//       qx.bom.client.Feature.CONTENT_BOX, 1x
//       qx.bom.element.Style.compile, 1x
//       qx.bom.element.Style.setStyles, 1x
//       qx.core.Object, 1x
//       qx.theme.manager.Color.getInstance, 1x
//       qx.theme.manager.Font.getInstance, 1x
//       qx.ui.table.IRowRenderer, 1x
qx.Class.define("qx.ui.table.rowrenderer.Default",{extend:qx.core.Object,
implement:qx.ui.table.IRowRenderer,
construct:function(){this.base(arguments);
this.__biXIkY="";
this.__biXIkY={};
this.__qwQQT={};
this._renderFont(qx.theme.manager.Font.getInstance().resolve("default"));
var a=qx.theme.manager.Color.getInstance();
this.__qwQQT.bgcolFocusedSelected=a.resolve("table-row-background-focused-selected");
this.__qwQQT.bgcolFocused=a.resolve("table-row-background-focused");
this.__qwQQT.bgcolSelected=a.resolve("table-row-background-selected");
this.__qwQQT.bgcolEven=a.resolve("table-row-background-even");
this.__qwQQT.bgcolOdd=a.resolve("table-row-background-odd");
this.__qwQQT.colSelected=a.resolve("table-row-selected");
this.__qwQQT.colNormal=a.resolve("table-row");
this.__qwQQT.horLine=a.resolve("table-row-line")},
properties:{highlightFocusRow:{check:"Boolean",
init:true}},
members:{__qwQQT:null,
__EudQp:null,
__biXIkY:null,
_insetY:1,
_renderFont:function(a){a?(this.__EudQp=a.getStyles(),this.__biXIkY=qx.bom.element.Style.compile(this.__EudQp),this.__biXIkY=this.__biXIkY.replace(/"/g,"'")):(this.__biXIkY="",this.__EudQp=qx.bom.Font.getDefaultStyles())},
updateDataRowElement:function(a,c){var d=this.__EudQp,b=c.style;
qx.bom.element.Style.setStyles(c,d);
b.backgroundColor=a.focusedRow&&this.getHighlightFocusRow()?a.selected?this.__qwQQT.bgcolFocusedSelected:this.__qwQQT.bgcolFocused:a.selected?this.__qwQQT.bgcolSelected:a.row%2==0?this.__qwQQT.bgcolEven:this.__qwQQT.bgcolOdd;
b.color=a.selected?this.__qwQQT.colSelected:this.__qwQQT.colNormal;
b.borderBottom="1px solid "+this.__qwQQT.horLine},
getRowHeightStyle:function(a){qx.bom.client.Feature.CONTENT_BOX&&(a-=this._insetY);
return"height:"+a+"px;"},
createRowStyle:function(b){var a=[];
a.push(";");
a.push(this.__biXIkY);
a.push("background-color:");
b.focusedRow&&this.getHighlightFocusRow()?a.push(b.selected?this.__qwQQT.bgcolFocusedSelected:this.__qwQQT.bgcolFocused):b.selected?a.push(this.__qwQQT.bgcolSelected):a.push(b.row%2==0?this.__qwQQT.bgcolEven:this.__qwQQT.bgcolOdd);
a.push(";color:");
a.push(b.selected?this.__qwQQT.colSelected:this.__qwQQT.colNormal);
a.push(";border-bottom: 1px solid ",this.__qwQQT.horLine);
return a.join("")},
getRowClass:function(a){return""},
getRowAttributes:function(a){return""}},
destruct:function(){this.__qwQQT=this.__EudQp=this.__biXIkY=null}});


// qx.ui.core.selection.Widget
//   - size: 2472 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Location.get, 1x
//       qx.ui.core.selection.Abstract, 1x
qx.Class.define("qx.ui.core.selection.Widget",{extend:qx.ui.core.selection.Abstract,
construct:function(a){this.base(arguments);
this.__qzkhX=a},
members:{__qzkhX:null,
_isSelectable:function(a){return this._isItemSelectable(a)&&a.getLayoutParent()===this.__qzkhX},
_selectableToHashCode:function(a){return a.$$hash},
_styleSelectable:function(b,a,c){c?b.addState(a):b.removeState(a)},
_capture:function(){this.__qzkhX.capture()},
_releaseCapture:function(){this.__qzkhX.releaseCapture()},
_isItemSelectable:function(a){return this._userInteraction?a.isVisible()&&a.isEnabled():a.isVisible()},
_getWidget:function(){return this.__qzkhX},
_getLocation:function(){var a=this.__qzkhX.getContentElement().getDomElement();
return a?qx.bom.element.Location.get(a):null},
_getDimension:function(){return this.__qzkhX.getInnerSize()},
_getSelectableLocationX:function(b){var a=b.getBounds();
if(a)return{left:a.left,
right:a.left+a.width}},
_getSelectableLocationY:function(b){var a=b.getBounds();
if(a)return{top:a.top,
bottom:a.top+a.height}},
_getScroll:function(){return{left:0,
top:0}},
_scrollBy:function(b,a){},
_scrollItemIntoView:function(a){this.__qzkhX.scrollChildIntoView(a)},
getSelectables:function(g){var e=false,c,d,b,a,f;
g||(e=this._userInteraction,this._userInteraction=true);
c=this.__qzkhX.getChildren(),d=[],a=0,f=c.length;
for(;
a<f;
a++)b=c[a],this._isItemSelectable(b)&&d.push(b);
this._userInteraction=e;
return d},
_getSelectableRange:function(e,g){if(e===g)return[e];
for(var f=this.__qzkhX.getChildren(),c=[],b=false,a,d=0,h=f.length;
d<h;
d++){a=f[d];
if(a===e||a===g){if(b){c.push(a);
break}else b=true}b&&this._isItemSelectable(a)&&c.push(a)}return c},
_getFirstSelectable:function(){for(var b=this.__qzkhX.getChildren(),a=0,c=b.length;
a<c;
a++)if(this._isItemSelectable(b[a]))return b[a];
return null},
_getLastSelectable:function(){for(var b=this.__qzkhX.getChildren(),a=b.length-1;
a>0;
a--)if(this._isItemSelectable(b[a]))return b[a];
return null},
_getRelatedSelectable:function(g,e){var d=this.__qzkhX.getOrientation()==="vertical",c=this.__qzkhX.getChildren(),f=c.indexOf(g),b,a;
if(d&&e==="above"||!d&&e==="left")for(a=f-1;
a>=0;
a--){b=c[a];
if(this._isItemSelectable(b))return b}else if(d&&e==="under"||!d&&e==="right")for(a=f+1;
a<c.length;
a++){b=c[a];
if(this._isItemSelectable(b))return b}return null},
_getPage:function(b,a){return a?this._getFirstSelectable():this._getLastSelectable()}},
destruct:function(){this.__qzkhX=null}});


// qx.ui.core.selection.ScrollArea
//   - size: 1109 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 1x
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.selection.Widget, 1x
qx.Class.define("qx.ui.core.selection.ScrollArea",{extend:qx.ui.core.selection.Widget,
members:{_isSelectable:function(a){return this._isItemSelectable(a)&&a.getLayoutParent()===this._getWidget().getChildrenContainer()},
_getDimension:function(){return this._getWidget().getPaneSize()},
_getScroll:function(){var a=this._getWidget();
return{left:a.getScrollX(),
top:a.getScrollY()}},
_scrollBy:function(c,b){var a=this._getWidget();
a.scrollByX(c);
a.scrollByY(b)},
_getPage:function(c,p){var d=this.getSelectables(),o=d.length,f=d.indexOf(c),e,g,i,k,l,a,j,b,h,n,m;
if(f===-1)throw new Error("Invalid lead item: "+c);
e=this._getWidget(),g=e.getScrollY(),i=e.getInnerSize().height;
if(p){j=g,b=f;
while(1){for(;
b>=0;
b--){k=e.getItemTop(d[b]);
if(k<j){a=b+1;
break}}if(a==null){h=this._getFirstSelectable();
return h==c?null:h}if(a>=f){j-=i+g-e.getItemBottom(c);
a=null;
continue}return d[a]}}else{n=i+g,b=f;
while(1){for(;
b<o;
b++){l=e.getItemBottom(d[b]);
if(l>n){a=b-1;
break}}if(a==null){m=this._getLastSelectable();
return m==c?null:m}if(a<=f){n+=e.getItemTop(c)-g;
a=null;
continue}return d[a]}}}}});


// qx.ui.decoration.MBackgroundImage
//   - size: 976 bytes
//   - modified: 2010-11-02T17:50:00
//   - names:
//       Error, 1x
//       qx, 3x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.bom.element.Decoration.create, 1x
//       qx.bom.element.Style.compile, 1x
qx.Mixin.define("qx.ui.decoration.MBackgroundImage",{properties:{backgroundImage:{check:"String",
nullable:true,
apply:"_applyBackground"},
backgroundRepeat:{check:["repeat","repeat-x","repeat-y","no-repeat","scale"],
init:"repeat",
apply:"_applyBackground"},
backgroundPositionX:{nullable:true,
apply:"_applyBackground"},
backgroundPositionY:{nullable:true,
apply:"_applyBackground"},
backgroundPosition:{group:["backgroundPositionY","backgroundPositionX"]}},
members:{_generateBackgroundMarkup:function(a){var c="",e=this.getBackgroundImage(),f=this.getBackgroundRepeat(),d=this.getBackgroundPositionY(),b;
d==null&&(d=0);
b=this.getBackgroundPositionX();
b==null&&(b=0);
a.backgroundPosition=b+" "+d;
e?c=qx.bom.element.Decoration.create(e,f,a):a&&(c="<div style=\""+qx.bom.element.Style.compile(a)+"\"></div>");
return c},
_applyBackground:function(){if(this._isInitialized())throw new Error("This decorator is already in-use. Modification is not possible anymore!")}}});


// qx.io.remote.Exchange
//   - size: 8658 bytes
//   - modified: 2010-11-02T16:12:47
//   - names:
//       Array, 1x
//       Error, 1x
//       encodeURIComponent, 4x
//       qx, 35x
//       window, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.core.Setting.define, 2x
//       qx.core.Setting.get, 9x
//       qx.event.Registration.createEvent, 1x
//       qx.io.remote.Exchange.canHandle, 1x
//       qx.io.remote.Exchange.initTypes, 1x
//       qx.io.remote.Exchange.typesAvailable, 3x
//       qx.io.remote.Exchange.typesOrder, 1x
//       qx.io.remote.Exchange.typesReady, 2x
//       qx.io.remote.Exchange.typesSupported, 3x
//       qx.io.remote.Response, 1x
//       qx.io.remote.transport.XmlHttp, 1x
//       qx.lang.Array.contains, 1x
//       qx.lang.Object.isEmpty, 1x
//       qx.lang.String.startsWith, 1x
//       qx.log.Logger.debug, 5x
//       window.location.href, 1x
qx.Class.define("qx.io.remote.Exchange",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
this.setRequest(a);
a.setTransport(this)},
events:{sending:"qx.event.type.Event",
receiving:"qx.event.type.Event",
completed:"qx.io.remote.Response",
aborted:"qx.event.type.Event",
failed:"qx.io.remote.Response",
timeout:"qx.io.remote.Response"},
statics:{typesOrder:["qx.io.remote.transport.XmlHttp","qx.io.remote.transport.Iframe","qx.io.remote.transport.Script"],
typesReady:false,
typesAvailable:{},
typesSupported:{},
registerType:function(b,a){qx.io.remote.Exchange.typesAvailable[a]=b},
initTypes:function(){if(qx.io.remote.Exchange.typesReady)return;
for(a in qx.io.remote.Exchange.typesAvailable){var b=qx.io.remote.Exchange.typesAvailable[a],a;
b.isSupported()&&(qx.io.remote.Exchange.typesSupported[a]=b)}qx.io.remote.Exchange.typesReady=true;
if(qx.lang.Object.isEmpty(qx.io.remote.Exchange.typesSupported))throw new Error("No supported transport types were found!")},
canHandle:function(a,c,d){if(!qx.lang.Array.contains(a.handles.responseTypes,d))return false;
for(var b in c)if(!a.handles[b])return false;
return true},
_nativeMap:{0:"created",
1:"configured",
2:"sending",
3:"receiving",
4:"completed"},
wasSuccessful:function(a,b,c){if(c)switch(a){case null:case 0:return true;
case -1:return b<4;
default:return typeof a==="undefined"}else switch(a){case -1:qx.core.Setting.get("qx.ioRemoteDebug")&&b>3&&qx.log.Logger.debug(this,"Failed with statuscode: -1 at readyState "+b);
return b<4;
case 200:case 304:return true;
case 201:case 202:case 203:case 204:case 205:return true;
case 206:qx.core.Setting.get("qx.ioRemoteDebug")&&b===4&&qx.log.Logger.debug(this,"Failed with statuscode: 206 (Partial content while being complete!)");
return b!==4;
case 300:case 301:case 302:case 303:case 305:case 400:case 401:case 402:case 403:case 404:case 405:case 406:case 407:case 408:case 409:case 410:case 411:case 412:case 413:case 414:case 415:case 500:case 501:case 502:case 503:case 504:case 505:qx.core.Setting.get("qx.ioRemoteDebug")&&qx.log.Logger.debug(this,"Failed with typical HTTP statuscode: "+a);
return false;
case 12002:case 12007:case 12029:case 12030:case 12031:case 12152:case 13030:qx.core.Setting.get("qx.ioRemoteDebug")&&qx.log.Logger.debug(this,"Failed with MSHTML specific HTTP statuscode: "+a);
return false;
default:if(a>206&&a<300)return true;
qx.log.Logger.debug(this,"Unknown status code: "+a+" ("+b+")");
return false}},
statusCodeToString:function(b){switch(b){case -1:return"Not available";
case 0:var a=window.location.href;
return qx.lang.String.startsWith(a.toLowerCase(),"file:")?"Unknown status code. Possibly due to application URL using 'file:' protocol?":"Unknown status code. Possibly due to a cross-domain request?";
break;
case 200:return"Ok";
case 304:return"Not modified";
case 206:return"Partial content";
case 204:return"No content";
case 300:return"Multiple choices";
case 301:return"Moved permanently";
case 302:return"Moved temporarily";
case 303:return"See other";
case 305:return"Use proxy";
case 400:return"Bad request";
case 401:return"Unauthorized";
case 402:return"Payment required";
case 403:return"Forbidden";
case 404:return"Not found";
case 405:return"Method not allowed";
case 406:return"Not acceptable";
case 407:return"Proxy authentication required";
case 408:return"Request time-out";
case 409:return"Conflict";
case 410:return"Gone";
case 411:return"Length required";
case 412:return"Precondition failed";
case 413:return"Request entity too large";
case 414:return"Request-URL too large";
case 415:return"Unsupported media type";
case 500:return"Server error";
case 501:return"Not implemented";
case 502:return"Bad gateway";
case 503:return"Out of resources";
case 504:return"Gateway time-out";
case 505:return"HTTP version not supported";
case 12002:return"Server timeout";
case 12029:return"Connection dropped";
case 12030:return"Connection dropped";
case 12031:return"Connection dropped";
case 12152:return"Connection closed by server";
case 13030:return"MSHTML-specific HTTP status code";
default:return"Unknown status code"}}},
properties:{request:{check:"qx.io.remote.Request",
nullable:true},
implementation:{check:"qx.io.remote.transport.Abstract",
nullable:true,
apply:"_applyImplementation"},
state:{check:["configured","sending","receiving","completed","aborted","timeout","failed"],
init:"configured",
event:"changeState",
apply:"_applyState"}},
members:{send:function(){var a=this.getRequest(),f,k,h,b,i,c,d,e,j;
if(!a)return this.error("Please attach a request object first");
qx.io.remote.Exchange.initTypes();
f=qx.io.remote.Exchange.typesOrder,k=qx.io.remote.Exchange.typesSupported,h=a.getResponseType(),b={};
a.getAsynchronous()?b.asynchronous=true:b.synchronous=true;
a.getCrossDomain()&&(b.crossDomain=true);
a.getFileUpload()&&(b.fileUpload=true);
for(i in a.getFormFields()){b.programaticFormFields=true;
break}e=0,j=f.length;
for(;
e<j;
e++){c=k[f[e]];
if(c){if(!qx.io.remote.Exchange.canHandle(c,b,h))continue;
try{qx.core.Setting.get("qx.ioRemoteDebug")&&this.debug("Using implementation: "+c.classname);
d=new c;
this.setImplementation(d);
d.setUseBasicHttpAuth(a.getUseBasicHttpAuth());
d.send();
return true}catch(g){this.error("Request handler throws error");
this.error(g);
return}}}this.error("There is no transport implementation available to handle this request: "+a)},
abort:function(){var a=this.getImplementation();
a?(qx.core.Setting.get("qx.ioRemoteDebug")&&this.debug("Abort: implementation "+a.toHashCode()),a.abort()):(qx.core.Setting.get("qx.ioRemoteDebug")&&this.debug("Abort: forcing state to be aborted"),this.setState("aborted"))},
timeout:function(){var a=this.getImplementation();
a?(this.warn("Timeout: implementation "+a.toHashCode()),a.timeout()):(this.warn("Timeout: forcing state to timeout"),this.setState("timeout"));
this.__cbwx9H()},
__cbwx9H:function(){var a=this.getRequest();
a&&a.setTimeout(0)},
_onsending:function(a){this.setState("sending")},
_onreceiving:function(a){this.setState("receiving")},
_oncompleted:function(a){this.setState("completed")},
_onabort:function(a){this.setState("aborted")},
_onfailed:function(a){this.setState("failed")},
_ontimeout:function(a){this.setState("timeout")},
_applyImplementation:function(a,c){c&&(c.removeListener("sending",this._onsending,this),c.removeListener("receiving",this._onreceiving,this),c.removeListener("completed",this._oncompleted,this),c.removeListener("aborted",this._onabort,this),c.removeListener("timeout",this._ontimeout,this),c.removeListener("failed",this._onfailed,this));
if(a){var b=this.getRequest(),i,h,d,f,e,g;
a.setUrl(b.getUrl());
a.setMethod(b.getMethod());
a.setAsynchronous(b.getAsynchronous());
a.setUsername(b.getUsername());
a.setPassword(b.getPassword());
a.setParameters(b.getParameters(false));
a.setFormFields(b.getFormFields());
a.setRequestHeaders(b.getRequestHeaders());
a instanceof qx.io.remote.transport.XmlHttp&&a.setParseJson(b.getParseJson());
i=b.getData();
if(i===null){h=b.getParameters(true),d=[];
for(f in h){e=h[f];
if(e instanceof Array)for(g=0;
g<e.length;
g++)d.push(encodeURIComponent(f)+"="+encodeURIComponent(e[g]));
else d.push(encodeURIComponent(f)+"="+encodeURIComponent(e))}d.length>0&&a.setData(d.join("&"))}else a.setData(i);
a.setResponseType(b.getResponseType());
a.addListener("sending",this._onsending,this);
a.addListener("receiving",this._onreceiving,this);
a.addListener("completed",this._oncompleted,this);
a.addListener("aborted",this._onabort,this);
a.addListener("timeout",this._ontimeout,this);
a.addListener("failed",this._onfailed,this)}},
_applyState:function(a,e){qx.core.Setting.get("qx.ioRemoteDebug")&&this.debug("State: "+e+" => "+a);
switch(a){case"sending":this.fireEvent("sending");
break;
case"receiving":this.fireEvent("receiving");
break;
case"completed":case"aborted":case"timeout":case"failed":var b=this.getImplementation(),c,d;
if(!b)break;
this.__cbwx9H();
if(this.hasListener(a)){c=qx.event.Registration.createEvent(a,qx.io.remote.Response);
if(a=="completed"){d=b.getResponseContent();
c.setContent(d);
d===null&&(qx.core.Setting.get("qx.ioRemoteDebug")&&this.debug("Altered State: "+a+" => failed"),a="failed")}else a=="failed"&&c.setContent(b.getResponseContent());
c.setStatusCode(b.getStatusCode());
c.setResponseHeaders(b.getResponseHeaders());
this.dispatchEvent(c)};
this.setImplementation(null);
b.dispose();
break}}},
defer:function(){qx.core.Setting.define("qx.ioRemoteDebug",false);
qx.core.Setting.define("qx.ioRemoteDebugData",false)},
destruct:function(){var a=this.getImplementation();
a&&(this.setImplementation(null),a.dispose());
this.setRequest(null)}});


// qx.io.remote.transport.XmlHttp
//   - size: 7052 bytes
//   - modified: 2010-10-25T16:53:25
//   - names:
//       Array, 2x
//       Error, 3x
//       String, 1x
//       XMLHttpRequest, 1x
//       encodeURIComponent, 8x
//       isNaN, 2x
//       qx, 22x
//       window, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Setting.get, 10x
//       qx.event.GlobalError.observeMethod, 1x
//       qx.io.remote.Exchange._nativeMap, 1x
//       qx.io.remote.Exchange.registerType, 1x
//       qx.io.remote.Exchange.wasSuccessful, 2x
//       qx.io.remote.transport.Abstract, 1x
//       qx.io.remote.transport.XmlHttp, 1x
//       qx.io.remote.transport.XmlHttp.createRequestObject, 1x
//       qx.lang.Function.bind, 1x
//       qx.lang.Function.empty, 1x
//       qx.util.Json.parse, 1x
//       window.eval, 1x
//       window.location.href, 1x
//       window.location.protocol, 1x
qx.Class.define("qx.io.remote.transport.XmlHttp",{extend:qx.io.remote.transport.Abstract,
statics:{handles:{synchronous:true,
asynchronous:true,
crossDomain:false,
fileUpload:false,
programaticFormFields:false,
responseTypes:["text/plain","text/javascript","application/json","application/xml","text/html"]},
requestObjects:[],
requestObjectCount:0,
createRequestObject:function(){return new XMLHttpRequest},
isSupported:function(){return!!this.createRequestObject()}},
properties:{parseJson:{check:"Boolean",
init:true}},
members:{__Vyl7n:false,
__9twGz:0,
__u3kLI:null,
getRequest:function(){this.__u3kLI===null&&(this.__u3kLI=qx.io.remote.transport.XmlHttp.createRequestObject(),this.__u3kLI.onreadystatechange=qx.lang.Function.bind(this._onreadystatechange,this));
return this.__u3kLI},
send:function(){this.__9twGz=0;
var d=this.getRequest(),i=this.getMethod(),h=this.getAsynchronous(),e=this.getUrl(),l=(window.location.protocol==="file:"&&!/^http(s){0,1}\:/.test(e)),g,b,a,c,f,m,k;
this.__Vyl7n=l;
g=this.getParameters(),b=[];
for(a in g){c=g[a];
if(c instanceof Array)for(f=0;
f<c.length;
f++)b.push(encodeURIComponent(a)+"="+encodeURIComponent(c[f]));
else b.push(encodeURIComponent(a)+"="+encodeURIComponent(c))}b.length>0&&(e+=(e.indexOf("?")>=0?"&":"?")+b.join("&"));
if(this.getData()===null){g=this.getParameters(),b=[];
for(a in g){c=g[a];
if(c instanceof Array)for(f=0;
f<c.length;
f++)b.push(encodeURIComponent(a)+"="+encodeURIComponent(c[f]));
else b.push(encodeURIComponent(a)+"="+encodeURIComponent(c))}b.length>0&&this.setData(b.join("&"))}m=function(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",k="",h,e,f,j,i,g,c,d=0;
do{h=a.charCodeAt(d++),e=a.charCodeAt(d++),f=a.charCodeAt(d++),j=h>>2,i=(h&3)<<4|e>>4,g=(e&15)<<2|f>>6,c=f&63,isNaN(e)?g=c=64:isNaN(f)&&(c=64),k+=b.charAt(j)+b.charAt(i)+b.charAt(g)+b.charAt(c);
}while(d<a.length);
return k};
try{this.getUsername()?this.getUseBasicHttpAuth()?(d.open(i,e,h),d.setRequestHeader("Authorization","Basic "+m(this.getUsername()+":"+this.getPassword()))):d.open(i,e,h,this.getUsername(),this.getPassword()):d.open(i,e,h)}catch(j){this.error("Failed with exception: "+j);
this.failed();
return}d.setRequestHeader("Referer",window.location.href);
k=this.getRequestHeaders();
for(a in k)d.setRequestHeader(a,k[a]);
try{qx.core.Setting.get("qx.ioRemoteDebugData")&&this.debug("Request: "+this.getData());
d.send(this.getData())}catch(j){l?this.failedLocally():(this.error("Failed to send data: "+j,"send"),this.failed());
return}h||this._onreadystatechange()},
failedLocally:function(){if(this.getState()==="failed")return;
this.warn("Could not load from file: "+this.getUrl());
this.failed()},
_onreadystatechange:qx.event.GlobalError.observeMethod(function(b){switch(this.getState()){case"completed":case"aborted":case"failed":case"timeout":qx.core.Setting.get("qx.ioRemoteDebug")&&this.warn("Ignore Ready State Change");
return}var a=this.getReadyState();
if(a==4)if(!qx.io.remote.Exchange.wasSuccessful(this.getStatusCode(),a,this.__Vyl7n)){this.getState()==="configured"&&this.setState("sending");
this.failed();
return}while(this.__9twGz<a)this.setState(qx.io.remote.Exchange._nativeMap[++this.__9twGz])}),
getReadyState:function(){var a=null;
try{a=this.getRequest().readyState}catch(b){}return a},
setRequestHeader:function(b,a){this.getRequestHeaders()[b]=a},
getResponseHeader:function(b){var a=null;
try{a=this.getRequest().getResponseHeader(b)||null}catch(c){}return a},
getStringResponseHeaders:function(){var a=null,b;
try{b=this.getRequest().getAllResponseHeaders();
b&&(a=b)}catch(c){}return a},
getResponseHeaders:function(){var e=this.getStringResponseHeaders(),d={},c,a,f,b;
if(e){c=e.split(/[\r\n]+/g),a=0,f=c.length;
for(;
a<f;
a++){b=c[a].match(/^([^:]+)\s*:\s*(.+)$/i);
b&&(d[b[1]]=b[2])}}return d},
getStatusCode:function(){var a=-1;
try{a=this.getRequest().status}catch(b){}return a},
getStatusText:function(){var a="";
try{a=this.getRequest().statusText}catch(b){}return a},
getResponseText:function(){var a=null;
try{a=this.getRequest().responseText}catch(b){a=null}return a},
getResponseXml:function(){var a=null,c=this.getStatusCode(),b=this.getReadyState(),d;
if(qx.io.remote.Exchange.wasSuccessful(c,b,this.__Vyl7n))try{a=this.getRequest().responseXML}catch(e){}if(typeof a=="object"&&a!=null){if(!a.documentElement){d=String(this.getRequest().responseText).replace(/<\?xml[^\?]*\?>/,"");
a.loadXML(d)}if(!a.documentElement)throw new Error("Missing Document Element!");
if(a.documentElement.tagName=="parseerror")throw new Error("XML-File is not well-formed!")}else throw new Error("Response was not a valid xml document ["+this.getRequest().responseText+"]");
return a},
getFetchedLength:function(){var a=this.getResponseText();
return typeof a=="string"?a.length:0},
getResponseContent:function(){var c=this.getState(),a,b;
if(c!=="completed"&&c!="failed"){qx.core.Setting.get("qx.ioRemoteDebug")&&this.warn("Transfer not complete or failed, ignoring content!");
return null}qx.core.Setting.get("qx.ioRemoteDebug")&&this.debug("Returning content for responseType: "+this.getResponseType());
a=this.getResponseText();
if(c=="failed"){qx.core.Setting.get("qx.ioRemoteDebugData")&&this.debug("Failed: "+a);
return a}switch(this.getResponseType()){case"text/plain":case"text/html":qx.core.Setting.get("qx.ioRemoteDebugData")&&this.debug("Response: "+a);
return a;
case"application/json":qx.core.Setting.get("qx.ioRemoteDebugData")&&this.debug("Response: "+a);
try{if(a&&a.length>0){this.getParseJson()?(b=qx.util.Json.parse(a,false),b=b===0?0:b||null):b=a;
return b}return null}catch(d){this.error("Could not execute json: ["+a+"]",d);
return"<pre>Could not execute json: \n"+a+"\n</pre>"};
case"text/javascript":qx.core.Setting.get("qx.ioRemoteDebugData")&&this.debug("Response: "+a);
try{if(a&&a.length>0){b=window.eval(a);
return b===0?0:b||null}return null}catch(d){this.error("Could not execute javascript: ["+a+"]",d);
return null};
case"application/xml":a=this.getResponseXml();
qx.core.Setting.get("qx.ioRemoteDebugData")&&this.debug("Response: "+a);
return a===0?0:a||null;
default:this.warn("No valid responseType specified ("+this.getResponseType()+")!");
return null}},
_applyState:function(a,b){qx.core.Setting.get("qx.ioRemoteDebug")&&this.debug("State: "+a);
switch(a){case"created":this.fireEvent("created");
break;
case"configured":this.fireEvent("configured");
break;
case"sending":this.fireEvent("sending");
break;
case"receiving":this.fireEvent("receiving");
break;
case"completed":this.fireEvent("completed");
break;
case"failed":this.fireEvent("failed");
break;
case"aborted":this.getRequest().abort();
this.fireEvent("aborted");
break;
case"timeout":this.getRequest().abort();
this.fireEvent("timeout");
break}}},
defer:function(){qx.io.remote.Exchange.registerType(qx.io.remote.transport.XmlHttp,"qx.io.remote.transport.XmlHttp")},
destruct:function(){var a=this.getRequest();
if(a){a.onreadystatechange=qx.lang.Function.empty;
switch(a.readyState){case 1:case 2:case 3:a.abort()}}this.__u3kLI=null}});


// qx.ui.decoration.GridDiv
//   - size: 2324 bytes
//   - modified: 2010-11-02T17:50:56
//   - names:
//       Error, 1x
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Decoration, 1x
//       qx.ui.decoration.Abstract, 1x
//       qx.util.ResourceManager.getInstance, 1x
qx.Class.define("qx.ui.decoration.GridDiv",{extend:qx.ui.decoration.Abstract,
construct:function(a,b){this.base(arguments);
a!=null&&this.setBaseImage(a);
b!=null&&this.setInsets(b)},
properties:{baseImage:{check:"String",
nullable:true,
apply:"_applyBaseImage"}},
members:{__qyd51:null,
__qd9wf:null,
__msGX5:null,
_getDefaultInsets:function(){return{top:0,
right:0,
bottom:0,
left:0}},
_isInitialized:function(){return!!this.__qyd51},
getMarkup:function(){if(this.__qyd51)return this.__qyd51;
var c=qx.bom.element.Decoration,b=this.__qd9wf,d=this.__msGX5,a=[];
a.push("<div style=\"position:absolute;top:0;left:0;overflow:hidden;font-size:0;line-height:0;\">");
a.push(c.create(b.tl,"no-repeat",{top:0,
left:0}));
a.push(c.create(b.t,"scale-x",{top:0,
left:d.left+"px"}));
a.push(c.create(b.tr,"no-repeat",{top:0,
right:0}));
a.push(c.create(b.bl,"no-repeat",{bottom:0,
left:0}));
a.push(c.create(b.b,"scale-x",{bottom:0,
left:d.left+"px"}));
a.push(c.create(b.br,"no-repeat",{bottom:0,
right:0}));
a.push(c.create(b.l,"scale-y",{top:d.top+"px",
left:0}));
a.push(c.create(b.c,"scale",{top:d.top+"px",
left:d.left+"px"}));
a.push(c.create(b.r,"scale-y",{top:d.top+"px",
right:0}));
a.push("</div>");
return this.__qyd51=a.join("")},
resize:function(a,f,e){var d=this.__msGX5,b=f-d.left-d.right,c=e-d.top-d.bottom;
b<0&&(b=0);
c<0&&(c=0);
a.style.width=f+"px";
a.style.height=e+"px";
a.childNodes[1].style.width=b+"px";
a.childNodes[4].style.width=b+"px";
a.childNodes[7].style.width=b+"px";
a.childNodes[6].style.height=c+"px";
a.childNodes[7].style.height=c+"px";
a.childNodes[8].style.height=c+"px"},
tint:function(a,b){},
_applyBaseImage:function(c,g){if(this.__qyd51)throw new Error("This decorator is already in-use. Modification is not possible anymore!");
if(c){var f=this._resolveImageUrl(c),d=/(.*)(\.[a-z]+)$/.exec(f),a=d[1],b=d[2],e=this.__qd9wf={tl:a+"-tl"+b,
t:a+"-t"+b,
tr:a+"-tr"+b,
bl:a+"-bl"+b,
b:a+"-b"+b,
br:a+"-br"+b,
l:a+"-l"+b,
c:a+"-c"+b,
r:a+"-r"+b};
this.__msGX5=this._computeEdgeSizes(e)}},
_resolveImageUrl:function(a){return a},
_computeEdgeSizes:function(b){var a=qx.util.ResourceManager.getInstance();
return{top:a.getImageHeight(b.t),
bottom:a.getImageHeight(b.b),
left:a.getImageWidth(b.l),
right:a.getImageWidth(b.r)}}},
destruct:function(){this.__qyd51=this.__qd9wf=this.__msGX5=null}});


// qx.ui.decoration.Grid
//   - size: 1763 bytes
//   - modified: 2010-11-02T17:49:25
//   - names:
//       qx, 11x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Assert.assertNotNull, 2x
//       qx.core.Object, 1x
//       qx.lang.String.firstUp, 1x
//       qx.ui.decoration.GridDiv, 2x
//       qx.ui.decoration.IDecorator, 1x
//       qx.ui.decoration.css3.BorderImage, 1x
//       qx.ui.decoration.css3.BorderImage.IS_SUPPORTED, 1x
//       qx.util.ResourceManager.getInstance, 1x
qx.Class.define("qx.ui.decoration.Grid",{extend:qx.core.Object,
implement:[qx.ui.decoration.IDecorator],
construct:function(a,b){this.base(arguments);
false&&qx.ui.decoration.css3.BorderImage.IS_SUPPORTED?(this.__jBSuX=new qx.ui.decoration.css3.BorderImage(),a&&this.__827Y0(a)):this.__jBSuX=new qx.ui.decoration.GridDiv(a);
b!=null&&this.__jBSuX.setInsets(b)},
properties:{baseImage:{check:"String",
nullable:true,
apply:"_applyBaseImage"},
insetLeft:{check:"Number",
nullable:true,
apply:"_applyInsets"},
insetRight:{check:"Number",
nullable:true,
apply:"_applyInsets"},
insetBottom:{check:"Number",
nullable:true,
apply:"_applyInsets"},
insetTop:{check:"Number",
nullable:true,
apply:"_applyInsets"},
insets:{group:["insetTop","insetRight","insetBottom","insetLeft"],
shorthand:true}},
members:{__jBSuX:null,
getMarkup:function(){return this.__jBSuX.getMarkup()},
resize:function(b,c,a){this.__jBSuX.resize(b,c,a)},
tint:function(a,b){},
getInsets:function(){return this.__jBSuX.getInsets()},
_applyInsets:function(b,d,c){var a="set"+qx.lang.String.firstUp(c);
this.__jBSuX[a](b)},
_applyBaseImage:function(a,b){this.__jBSuX instanceof qx.ui.decoration.GridDiv?this.__jBSuX.setBaseImage(a):this.__827Y0(a)},
__827Y0:function(e){this.__jBSuX.setBorderImage(e);
var h=e,f=/(.*)(\.[a-z]+)$/.exec(h),a=f[1],b=f[2],g=qx.util.ResourceManager.getInstance(),d=g.getImageHeight(a+"-t"+b),c=g.getImageWidth(a+"-l"+b),j,i;
{j="The value of the property 'topSlice' is null! Please verify the image '"+a+"-t"+b+"' is present.",i="The value of the property 'leftSlice' is null! Please verify the image '"+a+"-l"+b+"' is present.";
qx.core.Assert.assertNotNull(d,j);
qx.core.Assert.assertNotNull(c,i)}this.__jBSuX.setSlice([d,c])}},
destruct:function(){this.__jBSuX=null}});


// qx.bom.Input
//   - size: 1444 bytes
//   - modified: 2010-11-02T15:55:40
//   - names:
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Element.create, 1x
//       qx.bom.Input, 1x
//       qx.core.Assert.assertKeyInMap, 1x
//       qx.lang.Array, 1x
//       qx.lang.Object.clone, 1x
//       qx.lang.Type, 1x
qx.Class.define("qx.bom.Input",{statics:{__nhP4O:{text:1,
textarea:1,
select:1,
checkbox:1,
radio:1,
password:1,
hidden:1,
submit:1,
image:1,
file:1,
search:1,
reset:1,
button:1},
create:function(a,b,d){qx.core.Assert.assertKeyInMap(a,this.__nhP4O,"Unsupported input type.");
var b=b?qx.lang.Object.clone(b):{},c;
a==="textarea"||a==="select"?c=a:(c="input",b.type=a);
return qx.bom.Element.create(c,b,d)},
setValue:function(a,b){var l=a.nodeName.toLowerCase(),e=a.type,h=qx.lang.Array,i=qx.lang.Type,j,g,d,c,f,k;
typeof b==="number"&&(b+="");
if(e==="checkbox"||e==="radio")a.checked=i.isArray(b)?h.contains(b,a.value):a.value==b;
else if(l==="select"){j=i.isArray(b),g=a.options,f=0,k=g.length;
for(;
f<k;
f++)d=g[f],c=d.getAttribute("value"),c==null&&(c=d.text),d.selected=j?h.contains(b,c):b==c;
j&&b.length==0&&(a.selectedIndex=-1)}else e==="text"&&false?(a.$$inValueSet=true,a.value=b,a.$$inValueSet=null):a.value=b},
getValue:function(a){var h=a.nodeName.toLowerCase(),d,g,f,e,j,b,c,k,i;
if(h==="option")return(a.attributes.value||{}).specified?a.value:a.text;
if(h==="select"){d=a.selectedIndex;
if(d<0)return null;
g=[],f=a.options,e=a.type=="select-one",j=qx.bom.Input,c=e?d:0,k=e?d+1:f.length;
for(;
c<k;
c++){i=f[c];
if(i.selected){b=j.getValue(i);
if(e)return b;
g.push(b)}}return g}return(a.value||"").replace(/\r/g,"")},
setWrap:function(a,b){var c=b?"soft":"off",d=b?"":"auto";
a.setAttribute("wrap",c);
a.style.overflow=d}}});


// qx.io.remote.RequestQueue
//   - size: 3439 bytes
//   - modified: 2010-10-13T17:38:57
//   - names:
//       Date, 2x
//       qx, 13x
//       window, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.client.Transport.getMaxConcurrentRequestCount, 1x
//       qx.core.Object, 1x
//       qx.core.Setting.get, 3x
//       qx.event.Registration.createEvent, 1x
//       qx.event.Timer, 1x
//       qx.event.type.Event, 1x
//       qx.io.remote.Exchange, 1x
//       qx.lang.Array.contains, 1x
//       qx.lang.Array.remove, 2x
//       window.status, 1x
qx.Class.define("qx.io.remote.RequestQueue",{type:"singleton",
extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__m5bO4=[];
this.__qffIt=[];
this.__3PcmN=0;
this.__mXur6=new qx.event.Timer(500);
this.__mXur6.addListener("interval",this._oninterval,this)},
properties:{enabled:{init:true,
check:"Boolean",
apply:"_applyEnabled"},
maxTotalRequests:{check:"Integer",
nullable:true},
maxConcurrentRequests:{check:"Integer",
init:qx.bom.client.Transport.getMaxConcurrentRequestCount()},
defaultTimeout:{check:"Integer",
init:5000}},
members:{__m5bO4:null,
__qffIt:null,
__3PcmN:null,
__mXur6:null,
getRequestQueue:function(){return this.__m5bO4},
getActiveQueue:function(){return this.__qffIt},
_debug:function(){if(qx.core.Setting.get("qx.ioRemoteDebug")){var a=this.__qffIt.length+"/"+(this.__m5bO4.length+this.__qffIt.length);
this.debug("Progress: "+a);
window.status="Request-Queue Progress: "+a}},
_check:function(){this._debug();
this.__qffIt.length==0&&this.__m5bO4.length==0&&this.__mXur6.stop();
if(!this.getEnabled())return;
if(this.__m5bO4.length==0||this.__m5bO4[0].isAsynchronous()&&this.__qffIt.length>=this.getMaxConcurrentRequests())return;
if(this.getMaxTotalRequests()!=null&&this.__3PcmN>=this.getMaxTotalRequests())return;
var b=this.__m5bO4.shift(),a=new qx.io.remote.Exchange(b);
this.__3PcmN++;
this.__qffIt.push(a);
this._debug();
a.addListener("sending",this._onsending,this);
a.addListener("receiving",this._onreceiving,this);
a.addListener("completed",this._oncompleted,this);
a.addListener("aborted",this._oncompleted,this);
a.addListener("timeout",this._oncompleted,this);
a.addListener("failed",this._oncompleted,this);
a._start=(new Date).valueOf();
a.send();
this.__m5bO4.length>0&&this._check()},
_remove:function(a){qx.lang.Array.remove(this.__qffIt,a);
a.dispose();
this._check()},
__O5qMy:0,
_onsending:function(a){qx.core.Setting.get("qx.ioRemoteDebug")&&(this.__O5qMy++,a.getTarget()._counted=true,this.debug("ActiveCount: "+this.__O5qMy));
a.getTarget().getRequest()._onsending(a)},
_onreceiving:function(a){a.getTarget().getRequest()._onreceiving(a)},
_oncompleted:function(a){qx.core.Setting.get("qx.ioRemoteDebug")&&a.getTarget()._counted&&(this.__O5qMy--,this.debug("ActiveCount: "+this.__O5qMy));
var b=a.getTarget().getRequest(),c="_on"+a.getType(),d;
try{b[c]&&b[c](a)}catch(e){this.error("Request "+b+" handler "+c+" threw an error: ",e);
try{if(b["_onaborted"]){d=qx.event.Registration.createEvent("aborted",qx.event.type.Event);
b["_onaborted"](d)}}catch(e){}}finally{this._remove(a.getTarget())}},
_oninterval:function(i){var c=this.__qffIt,h,b,e,g,a,d,f;
if(c.length==0){this.__mXur6.stop();
return}h=(new Date).valueOf(),g=this.getDefaultTimeout(),f=c.length-1;
for(;
f>=0;
f--){b=c[f];
e=b.getRequest();
if(e.isAsynchronous()){a=e.getTimeout();
if(a==0)continue;
a==null&&(a=g);
d=h-b._start;
d>a&&(this.warn("Timeout: transport "+b.toHashCode()),this.warn(d+"ms > "+a+"ms"),b.timeout())}}},
_applyEnabled:function(a,b){a&&this._check();
this.__mXur6.setEnabled(a)},
add:function(a){a.setState("queued");
a.isAsynchronous()?this.__m5bO4.push(a):this.__m5bO4.unshift(a);
this._check();
this.getEnabled()&&this.__mXur6.start()},
abort:function(a){var b=a.getTransport();
b?b.abort():qx.lang.Array.contains(this.__m5bO4,a)&&qx.lang.Array.remove(this.__m5bO4,a)}},
destruct:function(){this._disposeArray("__active");
this._disposeObjects("__timer");
this.__m5bO4=null}});


// qx.io.remote.Request
//   - size: 4910 bytes
//   - modified: 2010-10-25T16:21:13
//   - names:
//       Date, 1x
//       qx, 7x
//       undefined, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.core.Setting.get, 1x
//       qx.io.remote.Request.__seqNum, 1x
//       qx.io.remote.Request.methodAllowsRequestBody, 1x
//       qx.io.remote.RequestQueue.getInstance, 2x
qx.Class.define("qx.io.remote.Request",{extend:qx.core.Object,
construct:function(b,c,a){this.base(arguments);
this.__baOQvM={};
this.__24r2U={};
this.__8xMpR={};
this.__I6KO6={};
b!==undefined&&this.setUrl(b);
c!==undefined&&this.setMethod(c);
a!==undefined&&this.setResponseType(a);
this.setProhibitCaching(true);
this.__qnMeq=++qx.io.remote.Request.__qnMeq},
events:{created:"qx.event.type.Event",
configured:"qx.event.type.Event",
sending:"qx.event.type.Event",
receiving:"qx.event.type.Event",
completed:"qx.io.remote.Response",
aborted:"qx.event.type.Event",
failed:"qx.io.remote.Response",
timeout:"qx.io.remote.Response"},
statics:{__qnMeq:0,
methodAllowsRequestBody:function(a){return a=="POST"||a=="PUT"}},
properties:{url:{check:"String",
init:""},
method:{check:["GET","POST","PUT","HEAD","DELETE"],
apply:"_applyMethod",
init:"GET"},
asynchronous:{check:"Boolean",
init:true},
data:{check:"String",
nullable:true},
username:{check:"String",
nullable:true},
password:{check:"String",
nullable:true},
state:{check:["configured","queued","sending","receiving","completed","aborted","timeout","failed"],
init:"configured",
apply:"_applyState",
event:"changeState"},
responseType:{check:["text/plain","text/javascript","application/json","application/xml","text/html"],
init:"text/plain",
apply:"_applyResponseType"},
timeout:{check:"Integer",
nullable:true},
prohibitCaching:{check:function(a){return typeof a=="boolean"||a==="no-url-params-on-post"},
init:true,
apply:"_applyProhibitCaching"},
crossDomain:{check:"Boolean",
init:false},
fileUpload:{check:"Boolean",
init:false},
transport:{check:"qx.io.remote.Exchange",
nullable:true},
useBasicHttpAuth:{check:"Boolean",
init:false},
parseJson:{check:"Boolean",
init:true}},
members:{__baOQvM:null,
__24r2U:null,
__8xMpR:null,
__I6KO6:null,
__qnMeq:null,
send:function(){qx.io.remote.RequestQueue.getInstance().add(this)},
abort:function(){qx.io.remote.RequestQueue.getInstance().abort(this)},
reset:function(){switch(this.getState()){case"sending":case"receiving":this.error("Aborting already sent request!");
case"queued":this.abort();
break}},
isConfigured:function(){return this.getState()==="configured"},
isQueued:function(){return this.getState()==="queued"},
isSending:function(){return this.getState()==="sending"},
isReceiving:function(){return this.getState()==="receiving"},
isCompleted:function(){return this.getState()==="completed"},
isAborted:function(){return this.getState()==="aborted"},
isTimeout:function(){return this.getState()==="timeout"},
isFailed:function(){return this.getState()==="failed"},
__WlQVe:function(b){var a=b.clone();
a.setTarget(this);
this.dispatchEvent(a)},
_onqueued:function(a){this.setState("queued");
this.__WlQVe(a)},
_onsending:function(a){this.setState("sending");
this.__WlQVe(a)},
_onreceiving:function(a){this.setState("receiving");
this.__WlQVe(a)},
_oncompleted:function(a){this.setState("completed");
this.__WlQVe(a);
this.dispose()},
_onaborted:function(a){this.setState("aborted");
this.__WlQVe(a);
this.dispose()},
_ontimeout:function(a){this.setState("timeout");
this.__WlQVe(a);
this.dispose()},
_onfailed:function(a){this.setState("failed");
this.__WlQVe(a);
this.dispose()},
_applyState:function(a,b){qx.core.Setting.get("qx.ioRemoteDebug")&&this.debug("State: "+a)},
_applyProhibitCaching:function(a,b){if(!a){this.removeParameter("nocache");
this.removeRequestHeader("Pragma");
this.removeRequestHeader("Cache-Control");
return}a!=="no-url-params-on-post"||this.getMethod()!="POST"?this.setParameter("nocache",new Date().valueOf()):this.removeParameter("nocache");
this.setRequestHeader("Pragma","no-cache");
this.setRequestHeader("Cache-Control","no-cache")},
_applyMethod:function(b,c){qx.io.remote.Request.methodAllowsRequestBody(b)?this.setRequestHeader("Content-Type","application/x-www-form-urlencoded"):this.removeRequestHeader("Content-Type");
var a=this.getProhibitCaching();
this._applyProhibitCaching(a,a)},
_applyResponseType:function(a,b){this.setRequestHeader("X-Qooxdoo-Response-Type",a)},
setRequestHeader:function(b,a){this.__baOQvM[b]=a},
removeRequestHeader:function(a){delete this.__baOQvM[a]},
getRequestHeader:function(a){return this.__baOQvM[a]||null},
getRequestHeaders:function(){return this.__baOQvM},
setParameter:function(b,a,c){c?this.__8xMpR[b]=a:this.__24r2U[b]=a},
removeParameter:function(a,b){b?delete this.__8xMpR[a]:delete this.__24r2U[a]},
getParameter:function(a,b){return b?this.__8xMpR[a]||null:this.__24r2U[a]||null},
getParameters:function(a){return a?this.__8xMpR:this.__24r2U},
setFormField:function(b,a){this.__I6KO6[b]=a},
removeFormField:function(a){delete this.__I6KO6[a]},
getFormField:function(a){return this.__I6KO6[a]||null},
getFormFields:function(){return this.__I6KO6},
getSequenceNumber:function(){return this.__qnMeq}},
destruct:function(){this.setTransport(null);
this.__baOQvM=this.__24r2U=this.__8xMpR=this.__I6KO6=null}});


// qx.ui.decoration.Beveled
//   - size: 2531 bytes
//   - modified: 2010-09-17T21:15:51
//   - names:
//       Error, 1x
//       qx, 10x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.client.Feature.CONTENT_BOX, 1x
//       qx.bom.element.Opacity.compile, 4x
//       qx.theme.manager.Color.getInstance, 2x
//       qx.ui.decoration.Abstract, 1x
//       qx.ui.decoration.MBackgroundImage, 1x
qx.Class.define("qx.ui.decoration.Beveled",{extend:qx.ui.decoration.Abstract,
include:[qx.ui.decoration.MBackgroundImage],
construct:function(b,a,c){this.base(arguments);
b!=null&&this.setOuterColor(b);
a!=null&&this.setInnerColor(a);
c!=null&&this.setInnerOpacity(c)},
properties:{innerColor:{check:"Color",
nullable:true,
apply:"_applyStyle"},
innerOpacity:{check:"Number",
init:1,
apply:"_applyStyle"},
outerColor:{check:"Color",
nullable:true,
apply:"_applyStyle"},
backgroundColor:{check:"Color",
nullable:true,
apply:"_applyStyle"}},
members:{__qyd51:null,
_getDefaultInsets:function(){return{top:2,
right:2,
bottom:2,
left:2}},
_isInitialized:function(){return!!this.__qyd51},
_applyStyle:function(){if(this.__qyd51)throw new Error("This decorator is already in-use. Modification is not possible anymore!")},
getMarkup:function(){if(this.__qyd51)return this.__qyd51;
var c=qx.theme.manager.Color.getInstance(),a=[],b="1px solid "+c.resolve(this.getOuterColor())+";",d="1px solid "+c.resolve(this.getInnerColor())+";",e;
a.push("<div style=\"overflow:hidden;font-size:0;line-height:0;\">");
a.push("<div style=\"");
a.push("border:",b);
a.push(qx.bom.element.Opacity.compile(.35));
a.push("\"></div>");
a.push("<div style=\"position:absolute;top:1px;left:0px;");
a.push("border-left:",b);
a.push("border-right:",b);
a.push(qx.bom.element.Opacity.compile(1));
a.push("\"></div>");
a.push("<div style=\"");
a.push("position:absolute;top:0px;left:1px;");
a.push("border-top:",b);
a.push("border-bottom:",b);
a.push(qx.bom.element.Opacity.compile(1));
a.push("\"></div>");
e={position:"absolute",
top:"1px",
left:"1px",
opacity:1};
a.push(this._generateBackgroundMarkup(e));
a.push("<div style=\"position:absolute;top:1px;left:1px;");
a.push("border:",d);
a.push(qx.bom.element.Opacity.compile(this.getInnerOpacity()));
a.push("\"></div>");
a.push("</div>");
return this.__qyd51=a.join("")},
resize:function(d,c,b){c<4&&(c=4);
b<4&&(b=4);
if(qx.bom.client.Feature.CONTENT_BOX){var g=c-2,h=b-2,e=g,f=h,o=c-4,n=b-4,a,j,k,l,m,i}else{g=c,h=b,e=c-2,f=b-2,o=e,n=f}a="px",j=d.childNodes[0].style;
j.width=g+a;
j.height=h+a;
k=d.childNodes[1].style;
k.width=g+a;
k.height=f+a;
l=d.childNodes[2].style;
l.width=e+a;
l.height=h+a;
m=d.childNodes[3].style;
m.width=e+a;
m.height=f+a;
i=d.childNodes[4].style;
i.width=o+a;
i.height=n+a},
tint:function(b,a){var c=qx.theme.manager.Color.getInstance();
a==null&&(a=this.getBackgroundColor());
b.childNodes[3].style.backgroundColor=c.resolve(a)||""}},
destruct:function(){this.__qyd51=null}});


// qx.ui.decoration.Single
//   - size: 3504 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 3x
//       parseInt, 2x
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.theme.manager.Color.getInstance, 2x
//       qx.ui.decoration.Abstract, 1x
//       qx.ui.decoration.MBackgroundImage, 1x
qx.Class.define("qx.ui.decoration.Single",{extend:qx.ui.decoration.Abstract,
include:[qx.ui.decoration.MBackgroundImage],
construct:function(b,a,c){this.base(arguments);
b!=null&&this.setWidth(b);
a!=null&&this.setStyle(a);
c!=null&&this.setColor(c)},
properties:{widthTop:{check:"Number",
init:0,
apply:"_applyWidth"},
widthRight:{check:"Number",
init:0,
apply:"_applyWidth"},
widthBottom:{check:"Number",
init:0,
apply:"_applyWidth"},
widthLeft:{check:"Number",
init:0,
apply:"_applyWidth"},
styleTop:{nullable:true,
check:["solid","dotted","dashed","double"],
init:"solid",
apply:"_applyStyle"},
styleRight:{nullable:true,
check:["solid","dotted","dashed","double"],
init:"solid",
apply:"_applyStyle"},
styleBottom:{nullable:true,
check:["solid","dotted","dashed","double"],
init:"solid",
apply:"_applyStyle"},
styleLeft:{nullable:true,
check:["solid","dotted","dashed","double"],
init:"solid",
apply:"_applyStyle"},
colorTop:{nullable:true,
check:"Color",
apply:"_applyStyle"},
colorRight:{nullable:true,
check:"Color",
apply:"_applyStyle"},
colorBottom:{nullable:true,
check:"Color",
apply:"_applyStyle"},
colorLeft:{nullable:true,
check:"Color",
apply:"_applyStyle"},
backgroundColor:{check:"Color",
nullable:true,
apply:"_applyStyle"},
left:{group:["widthLeft","styleLeft","colorLeft"]},
right:{group:["widthRight","styleRight","colorRight"]},
top:{group:["widthTop","styleTop","colorTop"]},
bottom:{group:["widthBottom","styleBottom","colorBottom"]},
width:{group:["widthTop","widthRight","widthBottom","widthLeft"],
shorthand:true},
style:{group:["styleTop","styleRight","styleBottom","styleLeft"],
shorthand:true},
color:{group:["colorTop","colorRight","colorBottom","colorLeft"],
shorthand:true}},
members:{__qyd51:null,
_getDefaultInsets:function(){return{top:this.getWidthTop(),
right:this.getWidthRight(),
bottom:this.getWidthBottom(),
left:this.getWidthLeft()}},
_isInitialized:function(){return!!this.__qyd51},
getMarkup:function(e){if(this.__qyd51)return this.__qyd51;
var c=qx.theme.manager.Color.getInstance(),a={},b=this.getWidthTop(),d;
b>0&&(a["border-top"]=b+"px "+this.getStyleTop()+" "+(c.resolve(this.getColorTop())||""));
b=this.getWidthRight();
b>0&&(a["border-right"]=b+"px "+this.getStyleRight()+" "+(c.resolve(this.getColorRight())||""));
b=this.getWidthBottom();
b>0&&(a["border-bottom"]=b+"px "+this.getStyleBottom()+" "+(c.resolve(this.getColorBottom())||""));
b=this.getWidthLeft();
b>0&&(a["border-left"]=b+"px "+this.getStyleLeft()+" "+(c.resolve(this.getColorLeft())||""));
if(a.length===0)throw new Error("Invalid Single decorator (zero border width). Use qx.ui.decorator.Background instead!");
a.position="absolute";
a.top=0;
a.left=0;
d=this._generateBackgroundMarkup(a);
return this.__qyd51=d},
resize:function(a,d,c){var b=this.getInsets();
d-=b.left+b.right;
c-=b.top+b.bottom;
d<0&&(d=0);
c<0&&(c=0);
a.style.width=d+"px";
a.style.height=c+"px";
a.style.left=(parseInt(a.style.left)+b.left-this.getWidthLeft())+"px";
a.style.top=(parseInt(a.style.top)+b.top-this.getWidthTop())+"px"},
tint:function(b,a){var c=qx.theme.manager.Color.getInstance();
a==null&&(a=this.getBackgroundColor());
b.style.backgroundColor=c.resolve(a)||""},
_applyWidth:function(){if(this.__qyd51)throw new Error("This decorator is already in-use. Modification is not possible anymore!");
this._resetInsets()},
_applyStyle:function(){if(this.__qyd51)throw new Error("This decorator is already in-use. Modification is not possible anymore!")}},
destruct:function(){this.__qyd51=null}});


// qx.ui.decoration.Uniform
//   - size: 1849 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 3x
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.client.Feature.CONTENT_BOX, 1x
//       qx.theme.manager.Color.getInstance, 2x
//       qx.ui.decoration.Abstract, 1x
//       qx.ui.decoration.MBackgroundImage, 1x
qx.Class.define("qx.ui.decoration.Uniform",{extend:qx.ui.decoration.Abstract,
include:[qx.ui.decoration.MBackgroundImage],
construct:function(b,a,c){this.base(arguments);
b!=null&&this.setWidth(b);
a!=null&&this.setStyle(a);
c!=null&&this.setColor(c)},
properties:{width:{check:"PositiveInteger",
init:0,
apply:"_applyWidth"},
style:{nullable:true,
check:["solid","dotted","dashed","double"],
init:"solid",
apply:"_applyStyle"},
color:{nullable:true,
check:"Color",
apply:"_applyStyle"},
backgroundColor:{check:"Color",
nullable:true,
apply:"_applyStyle"}},
members:{__qyd51:null,
_getDefaultInsets:function(){var a=this.getWidth();
return{top:a,
right:a,
bottom:a,
left:a}},
_isInitialized:function(){return!!this.__qyd51},
getMarkup:function(){if(this.__qyd51)return this.__qyd51;
var b={position:"absolute",
top:0,
left:0},a=this.getWidth(),c,d;
if(a===0)throw new Error("Invalid Uniform decorator (zero border width). Use qx.ui.decorator.Background instead!");
c=qx.theme.manager.Color.getInstance();
b.border=a+"px "+this.getStyle()+" "+(c.resolve(this.getColor())||"");
d=this._generateBackgroundMarkup(b);
return this.__qyd51=d},
resize:function(c,b,a){var e=this.getBackgroundImage()&&this.getBackgroundRepeat()=="scale",d;
if(e||qx.bom.client.Feature.CONTENT_BOX){d=this.getWidth()*2;
b-=d;
a-=d;
b<0&&(b=0);
a<0&&(a=0)}c.style.width=b+"px";
c.style.height=a+"px"},
tint:function(b,a){var c=qx.theme.manager.Color.getInstance();
a==null&&(a=this.getBackgroundColor());
b.style.backgroundColor=c.resolve(a)||""},
_applyWidth:function(){if(this.__qyd51)throw new Error("This decorator is already in-use. Modification is not possible anymore!");
this._resetInsets()},
_applyStyle:function(){if(this.__qyd51)throw new Error("This decorator is already in-use. Modification is not possible anymore!")}},
destruct:function(){this.__qyd51=null}});


// qx.ui.decoration.Background
//   - size: 1105 bytes
//   - modified: 2010-09-30T14:20:20
//   - names:
//       Error, 1x
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.theme.manager.Color.getInstance, 1x
//       qx.ui.decoration.Abstract, 1x
//       qx.ui.decoration.MBackgroundImage, 1x
qx.Class.define("qx.ui.decoration.Background",{extend:qx.ui.decoration.Abstract,
include:[qx.ui.decoration.MBackgroundImage],
construct:function(a){this.base(arguments);
a!=null&&this.setBackgroundColor(a)},
properties:{backgroundColor:{check:"Color",
nullable:true,
apply:"_applyStyle"}},
members:{__qyd51:null,
_getDefaultInsets:function(){return{top:0,
right:0,
bottom:0,
left:0}},
_isInitialized:function(){return!!this.__qyd51},
getMarkup:function(){if(this.__qyd51)return this.__qyd51;
var b={position:"absolute",
top:0,
left:0},a=this._generateBackgroundMarkup(b);
return this.__qyd51=a},
resize:function(b,d,c){var a=this.getInsets();
b.style.width=(d-a.left-a.right)+"px";
b.style.height=(c-a.top-a.bottom)+"px";
b.style.left=-a.left+"px";
b.style.top=-a.top+"px"},
tint:function(b,a){var c=qx.theme.manager.Color.getInstance();
a==null&&(a=this.getBackgroundColor());
b.style.backgroundColor=c.resolve(a)||""},
_applyStyle:function(){if(this._isInitialized())throw new Error("This decorator is already in-use. Modification is not possible anymore!")}},
destruct:function(){this.__qyd51=null}});


// qx.ui.table.cellrenderer.AbstractImage
//   - size: 1635 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       Error, 1x
//       qx, 8x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Stylesheet.createElement, 1x
//       qx.bom.client.Engine.GECKO, 1x
//       qx.bom.client.Engine.VERSION, 1x
//       qx.bom.element.Decoration.create, 1x
//       qx.io.ImageLoader, 1x
//       qx.ui.table.cellrenderer.Abstract, 1x
//       qx.util.ResourceManager.getInstance, 1x
qx.Class.define("qx.ui.table.cellrenderer.AbstractImage",{extend:qx.ui.table.cellrenderer.Abstract,
type:"abstract",
construct:function(){this.base(arguments);
var a=this.self(arguments);
a.stylesheet||(a.stylesheet=qx.bom.Stylesheet.createElement(".qooxdoo-table-cell-icon {  text-align:center;  padding-top:1px;}"))},
members:{__Vr1Zo:16,
__1NwZZ:16,
__C4eaS:null,
_insetY:2,
_identifyImage:function(a){throw new Error("_identifyImage is abstract")},
_getImageInfos:function(b){var a=this._identifyImage(b),c;
(a==null||typeof b=="string")&&(a={url:a,
tooltip:null});
c=null;
c=b.width&&b.height?{width:b.imageWidth,
height:b.imageHeight}:this.__UksBB(a.url);
a.width=c.width;
a.height=c.height;
return a},
__UksBB:function(a){var d=qx.util.ResourceManager.getInstance(),e=qx.io.ImageLoader,b,c;
d.has(a)?(b=d.getImageWidth(a),c=d.getImageHeight(a)):e.isLoaded(a)?(b=e.getWidth(a),c=e.getHeight(a)):(b=this.__Vr1Zo,c=this.__1NwZZ);
return{width:b,
height:c}},
createDataCellHtml:function(a,b){this.__C4eaS=this._getImageInfos(a);
return this.base(arguments,a,b)},
_getCellClass:function(a){return this.base(arguments)+" qooxdoo-table-cell-icon"},
_getContentHtml:function(b){var a="<div></div>";
this.__C4eaS.url&&(a=qx.bom.element.Decoration.create(this.__C4eaS.url,"no-repeat",{width:this.__C4eaS.width+"px",
height:this.__C4eaS.height+"px",
display:qx.bom.client.Engine.GECKO&&qx.bom.client.Engine.VERSION<1.9?"-moz-inline-box":"inline-block",
verticalAlign:"top",
position:"static"}));
return a},
_getCellAttributes:function(b){var a=this.__C4eaS.tooltip;
return a?"title='"+a+"'":""}},
destruct:function(){this.__C4eaS=null}});


// qx.ui.table.cellrenderer.Image
//   - size: 417 bytes
//   - modified: 2010-11-02T17:55:29
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.table.cellrenderer.AbstractImage, 1x
//       qx.util.ResourceManager.getInstance, 1x
qx.Class.define("qx.ui.table.cellrenderer.Image",{extend:qx.ui.table.cellrenderer.AbstractImage,
construct:function(b,a){this.base(arguments);
b&&(this.__IQ418=b);
a&&(this.__OcqZr=a)},
members:{__OcqZr:16,
__IQ418:16,
_identifyImage:function(b){var a={imageWidth:this.__IQ418,
imageHeight:this.__OcqZr};
a.url=b.value==""?null:qx.util.ResourceManager.getInstance().toUri(b.value);
a.tooltip=b.tooltip;
return a}}});


// qx.ui.table.cellrenderer.Default
//   - size: 1342 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Date, 1x
//       qx, 13x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.String.escape, 1x
//       qx.ui.table.cellrenderer.Abstract, 1x
//       qx.ui.table.cellrenderer.Default.STYLEFLAG_ALIGN_RIGHT, 2x
//       qx.ui.table.cellrenderer.Default.STYLEFLAG_BOLD, 1x
//       qx.ui.table.cellrenderer.Default.STYLEFLAG_ITALIC, 1x
//       qx.ui.table.cellrenderer.Default._numberFormat, 2x
//       qx.ui.table.cellrenderer.Default._numberFormat.format, 1x
//       qx.ui.table.cellrenderer.Default._numberFormat.setMaximumFractionDigits, 1x
//       qx.util.format.DateFormat.getDateInstance, 1x
//       qx.util.format.NumberFormat, 1x
qx.Class.define("qx.ui.table.cellrenderer.Default",{extend:qx.ui.table.cellrenderer.Abstract,
statics:{STYLEFLAG_ALIGN_RIGHT:1,
STYLEFLAG_BOLD:2,
STYLEFLAG_ITALIC:4,
_numberFormat:null},
properties:{useAutoAlign:{check:"Boolean",
init:true}},
members:{_getStyleFlags:function(a){if(this.getUseAutoAlign())if(typeof a.value=="number")return qx.ui.table.cellrenderer.Default.STYLEFLAG_ALIGN_RIGHT;
return 0},
_getCellClass:function(c){var a=this.base(arguments,c),b;
if(!a)return"";
b=this._getStyleFlags(c);
b&qx.ui.table.cellrenderer.Default.STYLEFLAG_ALIGN_RIGHT&&(a+=" qooxdoo-table-cell-right");
b&qx.ui.table.cellrenderer.Default.STYLEFLAG_BOLD&&(a+=" qooxdoo-table-cell-bold");
b&qx.ui.table.cellrenderer.Default.STYLEFLAG_ITALIC&&(a+=" qooxdoo-table-cell-italic");
return a},
_getContentHtml:function(a){return qx.bom.String.escape(this._formatValue(a))},
_formatValue:function(c){var a=c.value,b;
if(a==null)return"";
if(typeof a=="string")return a;
if(typeof a=="number"){qx.ui.table.cellrenderer.Default._numberFormat||(qx.ui.table.cellrenderer.Default._numberFormat=new qx.util.format.NumberFormat(),qx.ui.table.cellrenderer.Default._numberFormat.setMaximumFractionDigits(2));
b=qx.ui.table.cellrenderer.Default._numberFormat.format(a)}else b=a instanceof Date?qx.util.format.DateFormat.getDateInstance().format(a):a;
return b}}});


// qx.theme.Decoration
//   - size: 10101 bytes
//   - modified: 2010-11-02T19:07:47
//   - names:
//       qx, 66x
//   - packages:
//       qx.Theme.define, 1x
//       qx.ui.decoration.Background, 7x
//       qx.ui.decoration.Beveled, 13x
//       qx.ui.decoration.Grid, 24x
//       qx.ui.decoration.Single, 19x
//       qx.ui.decoration.Uniform, 2x
qx.Theme.define("qx.theme.Decoration",{decorations:{main:{decorator:qx.ui.decoration.Uniform,
style:{width:1,
color:"border-main"}},
selected:{decorator:qx.ui.decoration.Background,
style:{backgroundImage:"qx/decoration/selection.png",
backgroundRepeat:"scale"}},
"selected-dragover":{decorator:qx.ui.decoration.Single,
style:{backgroundImage:"qx/decoration/selection.png",
backgroundRepeat:"scale",
bottom:[2,"solid","#33508D"]}},
dragover:{decorator:qx.ui.decoration.Single,
style:{bottom:[2,"solid","#33508D"]}},
pane:{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/pane/pane.png",
insets:[0,2,3,0]}},
group:{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/groupbox/groupbox.png"}},
"border-invalid":{decorator:qx.ui.decoration.Beveled,
style:{outerColor:"invalid",
innerColor:"white",
innerOpacity:.5,
backgroundImage:"qx/decoration/form/input.png",
backgroundRepeat:"repeat-x",
backgroundColor:"background-light"}},
"keyboard-focus":{decorator:qx.ui.decoration.Single,
style:{width:1,
color:"black",
style:"dotted"}},
"separator-horizontal":{decorator:qx.ui.decoration.Single,
style:{widthLeft:1,
colorLeft:"border-separator"}},
"separator-vertical":{decorator:qx.ui.decoration.Single,
style:{widthTop:1,
colorTop:"border-separator"}},
"tooltip-error":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/form/tooltip-error.png",
insets:[2,5,5,2]}},
"tooltip-error-arrow":{decorator:qx.ui.decoration.Background,
style:{backgroundImage:"qx/decoration/form/tooltip-error-arrow.png",
backgroundPositionY:"center",
backgroundRepeat:"no-repeat",
insets:[0,0,0,10]}},
"shadow-window":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/shadow/shadow.png",
insets:[4,8,8,4]}},
"shadow-popup":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/shadow/shadow-small.png",
insets:[0,3,3,0]}},
"scrollbar-horizontal":{decorator:qx.ui.decoration.Background,
style:{backgroundImage:"qx/decoration/scrollbar/scrollbar-bg-horizontal.png",
backgroundRepeat:"repeat-x"}},
"scrollbar-vertical":{decorator:qx.ui.decoration.Background,
style:{backgroundImage:"qx/decoration/scrollbar/scrollbar-bg-vertical.png",
backgroundRepeat:"repeat-y"}},
"scrollbar-slider-horizontal":{decorator:qx.ui.decoration.Beveled,
style:{backgroundImage:"qx/decoration/scrollbar/scrollbar-button-bg-horizontal.png",
backgroundRepeat:"scale",
outerColor:"border-main",
innerColor:"white",
innerOpacity:.5}},
"scrollbar-slider-horizontal-disabled":{decorator:qx.ui.decoration.Beveled,
style:{backgroundImage:"qx/decoration/scrollbar/scrollbar-button-bg-horizontal.png",
backgroundRepeat:"scale",
outerColor:"border-disabled",
innerColor:"white",
innerOpacity:.3}},
"scrollbar-slider-vertical":{decorator:qx.ui.decoration.Beveled,
style:{backgroundImage:"qx/decoration/scrollbar/scrollbar-button-bg-vertical.png",
backgroundRepeat:"scale",
outerColor:"border-main",
innerColor:"white",
innerOpacity:.5}},
"scrollbar-slider-vertical-disabled":{decorator:qx.ui.decoration.Beveled,
style:{backgroundImage:"qx/decoration/scrollbar/scrollbar-button-bg-vertical.png",
backgroundRepeat:"scale",
outerColor:"border-disabled",
innerColor:"white",
innerOpacity:.3}},
button:{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/form/button.png",
insets:2}},
"button-disabled":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/form/button-disabled.png",
insets:2}},
"button-focused":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/form/button-focused.png",
insets:2}},
"button-hovered":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/form/button-hovered.png",
insets:2}},
"button-pressed":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/form/button-pressed.png",
insets:2}},
"button-checked":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/form/button-checked.png",
insets:2}},
"button-checked-focused":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/form/button-checked-focused.png",
insets:2}},
"button-invalid-shadow":{decorator:qx.ui.decoration.Beveled,
style:{outerColor:"invalid",
innerColor:"border-focused-invalid",
insets:[1]}},
"checkbox-invalid-shadow":{decorator:qx.ui.decoration.Beveled,
style:{outerColor:"invalid",
innerColor:"border-focused-invalid",
insets:[0]}},
input:{decorator:qx.ui.decoration.Beveled,
style:{outerColor:"border-input",
innerColor:"white",
innerOpacity:.5,
backgroundImage:"qx/decoration/form/input.png",
backgroundRepeat:"repeat-x",
backgroundColor:"background-light"}},
"input-focused":{decorator:qx.ui.decoration.Beveled,
style:{outerColor:"border-input",
innerColor:"border-focused",
backgroundImage:"qx/decoration/form/input-focused.png",
backgroundRepeat:"repeat-x",
backgroundColor:"background-light"}},
"input-focused-invalid":{decorator:qx.ui.decoration.Beveled,
style:{outerColor:"invalid",
innerColor:"border-focused-invalid",
backgroundImage:"qx/decoration/form/input-focused.png",
backgroundRepeat:"repeat-x",
backgroundColor:"background-light",
insets:[2]}},
"input-disabled":{decorator:qx.ui.decoration.Beveled,
style:{outerColor:"border-disabled",
innerColor:"white",
innerOpacity:.5,
backgroundImage:"qx/decoration/form/input.png",
backgroundRepeat:"repeat-x",
backgroundColor:"background-light"}},
toolbar:{decorator:qx.ui.decoration.Background,
style:{backgroundImage:"qx/decoration/toolbar/toolbar-gradient.png",
backgroundRepeat:"scale"}},
"toolbar-button-hovered":{decorator:qx.ui.decoration.Beveled,
style:{outerColor:"#b6b6b6",
innerColor:"#f8f8f8",
backgroundImage:"qx/decoration/form/button-c.png",
backgroundRepeat:"scale"}},
"toolbar-button-checked":{decorator:qx.ui.decoration.Beveled,
style:{outerColor:"#b6b6b6",
innerColor:"#f8f8f8",
backgroundImage:"qx/decoration/form/button-checked-c.png",
backgroundRepeat:"scale"}},
"toolbar-separator":{decorator:qx.ui.decoration.Single,
style:{widthLeft:1,
widthRight:1,
colorLeft:"#b8b8b8",
colorRight:"#f4f4f4",
styleLeft:"solid",
styleRight:"solid"}},
"toolbar-part":{decorator:qx.ui.decoration.Background,
style:{backgroundImage:"qx/decoration/toolbar/toolbar-part.gif",
backgroundRepeat:"repeat-y"}},
"tabview-pane":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/tabview/tabview-pane.png",
insets:[4,6,7,4]}},
"tabview-page-button-top-active":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/tabview/tab-button-top-active.png"}},
"tabview-page-button-top-inactive":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/tabview/tab-button-top-inactive.png"}},
"tabview-page-button-bottom-active":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/tabview/tab-button-bottom-active.png"}},
"tabview-page-button-bottom-inactive":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/tabview/tab-button-bottom-inactive.png"}},
"tabview-page-button-left-active":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/tabview/tab-button-left-active.png"}},
"tabview-page-button-left-inactive":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/tabview/tab-button-left-inactive.png"}},
"tabview-page-button-right-active":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/tabview/tab-button-right-active.png"}},
"tabview-page-button-right-inactive":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/tabview/tab-button-right-inactive.png"}},
splitpane:{decorator:qx.ui.decoration.Uniform,
style:{backgroundColor:"background-pane",
width:3,
color:"background-splitpane",
style:"solid"}},
window:{decorator:qx.ui.decoration.Single,
style:{backgroundColor:"background-pane",
width:1,
color:"border-main",
widthTop:0}},
"window-captionbar-active":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/window/captionbar-active.png"}},
"window-captionbar-inactive":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/window/captionbar-inactive.png"}},
"window-statusbar":{decorator:qx.ui.decoration.Grid,
style:{baseImage:"qx/decoration/window/statusbar.png"}},
table:{decorator:qx.ui.decoration.Single,
style:{width:1,
color:"border-main",
style:"solid"}},
"table-statusbar":{decorator:qx.ui.decoration.Single,
style:{widthTop:1,
colorTop:"border-main",
style:"solid"}},
"table-scroller-header":{decorator:qx.ui.decoration.Single,
style:{backgroundImage:"qx/decoration/table/header-cell.png",
backgroundRepeat:"scale",
widthBottom:1,
colorBottom:"border-main",
style:"solid"}},
"table-header-cell":{decorator:qx.ui.decoration.Single,
style:{widthRight:1,
colorRight:"border-separator",
styleRight:"solid"}},
"table-header-cell-hovered":{decorator:qx.ui.decoration.Single,
style:{widthRight:1,
colorRight:"border-separator",
styleRight:"solid",
widthBottom:1,
colorBottom:"white",
styleBottom:"solid"}},
"table-column-button":{decorator:qx.ui.decoration.Single,
style:{backgroundImage:"qx/decoration/table/header-cell.png",
backgroundRepeat:"scale",
widthBottom:1,
colorBottom:"border-main",
style:"solid"}},
"table-scroller-focus-indicator":{decorator:qx.ui.decoration.Single,
style:{width:2,
color:"table-focus-indicator",
style:"solid"}},
"progressive-table-header":{decorator:qx.ui.decoration.Single,
style:{width:1,
color:"border-main",
style:"solid"}},
"progressive-table-header-cell":{decorator:qx.ui.decoration.Single,
style:{backgroundImage:"qx/decoration/table/header-cell.png",
backgroundRepeat:"scale",
widthRight:1,
colorRight:"#F2F2F2",
style:"solid"}},
menu:{decorator:qx.ui.decoration.Single,
style:{backgroundImage:"qx/decoration/menu/background.png",
backgroundRepeat:"scale",
width:1,
color:"border-main",
style:"solid"}},
"menu-separator":{decorator:qx.ui.decoration.Single,
style:{widthTop:1,
colorTop:"#C5C5C5",
widthBottom:1,
colorBottom:"#FAFAFA"}},
menubar:{decorator:qx.ui.decoration.Single,
style:{backgroundImage:"qx/decoration/menu/bar-background.png",
backgroundRepeat:"scale",
width:1,
color:"border-separator",
style:"solid"}},
"app-header":{decorator:qx.ui.decoration.Background,
style:{backgroundImage:"qx/decoration/app-header.png",
backgroundRepeat:"scale"}}}});


// qx.log.appender.Console
//   - size: 4337 bytes
//   - modified: 2010-11-02T16:01:18
//   - names:
//       Math, 2x
//       document, 5x
//       qx, 12x
//       undefined, 1x
//       window, 1x
//   - packages:
//       Math.max, 1x
//       Math.min, 1x
//       document.body.appendChild, 1x
//       document.createElement, 2x
//       document.documentElement, 2x
//       qx.Class.define, 1x
//       qx.bom.Stylesheet.createElement, 1x
//       qx.core.ObjectRegistry.register, 1x
//       qx.dom.Hierarchy.contains, 1x
//       qx.event.Registration.addListener, 1x
//       qx.event.Registration.removeListener, 1x
//       qx.log.Logger.debug, 1x
//       qx.log.Logger.error, 1x
//       qx.log.Logger.register, 1x
//       qx.log.Logger.unregister, 1x
//       qx.log.appender.Util.escapeHTML, 1x
//       qx.log.appender.Util.toHtml, 1x
//       window.eval, 1x
qx.Class.define("qx.log.appender.Console",{statics:{init:function(){var d=[".qxconsole{z-index:10000;width:600px;height:300px;top:0px;right:0px;position:absolute;border-left:1px solid black;color:black;border-bottom:1px solid black;color:black;font-family:Consolas,Monaco,monospace;font-size:11px;line-height:1.2;}",".qxconsole .control{background:#cdcdcd;border-bottom:1px solid black;padding:4px 8px;}",".qxconsole .control a{text-decoration:none;color:black;}",".qxconsole .messages{background:white;height:100%;width:100%;overflow:auto;}",".qxconsole .messages div{padding:0px 4px;}",".qxconsole .messages .user-command{color:blue}",".qxconsole .messages .user-result{background:white}",".qxconsole .messages .user-error{background:#FFE2D5}",".qxconsole .messages .level-debug{background:white}",".qxconsole .messages .level-info{background:#DEEDFA}",".qxconsole .messages .level-warn{background:#FFF7D5}",".qxconsole .messages .level-error{background:#FFE2D5}",".qxconsole .messages .level-user{background:#E3EFE9}",".qxconsole .messages .type-string{color:black;font-weight:normal;}",".qxconsole .messages .type-number{color:#155791;font-weight:normal;}",".qxconsole .messages .type-boolean{color:#15BC91;font-weight:normal;}",".qxconsole .messages .type-array{color:#CC3E8A;font-weight:bold;}",".qxconsole .messages .type-map{color:#CC3E8A;font-weight:bold;}",".qxconsole .messages .type-key{color:#565656;font-style:italic}",".qxconsole .messages .type-class{color:#5F3E8A;font-weight:bold}",".qxconsole .messages .type-instance{color:#565656;font-weight:bold}",".qxconsole .messages .type-stringify{color:#565656;font-weight:bold}",".qxconsole .command{background:white;padding:2px 4px;border-top:1px solid black;}",".qxconsole .command input{width:100%;border:0 none;font-family:Consolas,Monaco,monospace;font-size:11px;line-height:1.2;}",".qxconsole .command input:focus{outline:none;}"],c,a,b;
qx.bom.Stylesheet.createElement(d.join(""));
c=["<div class=\"qxconsole\">","<div class=\"control\"><a href=\"javascript:qx.log.appender.Console.clear()\">Clear</a> | <a href=\"javascript:qx.log.appender.Console.toggle()\">Hide</a></div>","<div class=\"messages\">","</div>","<div class=\"command\">","<input type=\"text\"/>","</div>","</div>"],a=document.createElement("DIV");
a.innerHTML=c.join("");
b=a.firstChild;
document.body.appendChild(a.firstChild);
this.__js4VI=b;
this.__gQ657=b.childNodes[1];
this.__gHLqN=b.childNodes[2].firstChild;
this.__yXjPe();
qx.log.Logger.register(this);
qx.core.ObjectRegistry.register(this)},
dispose:function(){qx.event.Registration.removeListener(document.documentElement,"keypress",this.__IUnCM,this);
qx.log.Logger.unregister(this)},
clear:function(){this.__gQ657.innerHTML=""},
process:function(a){this.__gQ657.appendChild(qx.log.appender.Util.toHtml(a));
this.__JWI4E()},
__JWI4E:function(){this.__gQ657.scrollTop=this.__gQ657.scrollHeight},
__uWJAv:true,
toggle:function(){this.__js4VI?this.__js4VI.style.display=="none"?this.show():this.__js4VI.style.display="none":this.init()},
show:function(){this.__js4VI?(this.__js4VI.style.display="block",this.__gQ657.scrollTop=this.__gQ657.scrollHeight):this.init()},
__u1pqD:[],
execute:function(){var a=this.__gHLqN.value,b,c;
if(a=="")return;
if(a=="clear")return this.clear();
b=document.createElement("div");
b.innerHTML=qx.log.appender.Util.escapeHTML(">>> "+a);
b.className="user-command";
this.__u1pqD.push(a);
this.__O7Udy=this.__u1pqD.length;
this.__gQ657.appendChild(b);
this.__JWI4E();
try{c=window.eval(a)}catch(d){qx.log.Logger.error(d)}c!==undefined&&qx.log.Logger.debug(c)},
__yXjPe:function(a){this.__gQ657.style.height=(this.__js4VI.clientHeight-this.__js4VI.firstChild.offsetHeight-this.__js4VI.lastChild.offsetHeight)+"px"},
__IUnCM:function(b){var a=b.getKeyIdentifier(),c;
(a=="F7"||a=="D"&&b.isCtrlPressed())&&(this.toggle(),b.preventDefault());
if(!this.__js4VI)return;
if(!qx.dom.Hierarchy.contains(this.__js4VI,b.getTarget()))return;
a=="Enter"&&this.__gHLqN.value!=""&&(this.execute(),this.__gHLqN.value="");
if(a=="Up"||a=="Down"){this.__O7Udy+=a=="Up"?-1:1;
this.__O7Udy=Math.min(Math.max(0,this.__O7Udy),this.__u1pqD.length);
c=this.__u1pqD[this.__O7Udy];
this.__gHLqN.value=c||"";
this.__gHLqN.select()}}},
defer:function(a){qx.event.Registration.addListener(document.documentElement,"keypress",a.__IUnCM,a)}});


// apiviewer.Theme
//   - size: 176 bytes
//   - modified: 2010-11-02T19:09:18
//   - names:
//       apiviewer, 1x
//       qx, 4x
//   - packages:
//       apiviewer.Appearance, 1x
//       qx.Theme.define, 1x
//       qx.theme.Color, 1x
//       qx.theme.Decoration, 1x
//       qx.theme.Font, 1x
qx.Theme.define("apiviewer.Theme",{title:"APIViewer theme",
meta:{color:qx.theme.Color,
decoration:qx.theme.Decoration,
font:qx.theme.Font,
appearance:apiviewer.Appearance}});


// apiviewer.ClassLoader
//   - size: 1167 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       alert, 1x
//       apiviewer, 3x
//       eval, 1x
//       qx, 3x
//   - packages:
//       apiviewer.dao.Class, 1x
//       apiviewer.dao.Class.getClassByName, 2x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.io.remote.Request, 1x
qx.Class.define("apiviewer.ClassLoader",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
this._baseUri=a},
members:{load:function(c,f,g,e){var d=this._baseUri+"/"+c+".json",a=new qx.io.remote.Request(d),b=null;
a.setAsynchronous(f);
a.setTimeout(30000);
a.setProhibitCaching(false);
a.addListener("completed",function(d){var h=eval("("+d.getContent()+")"),f=c.substring(0,c.lastIndexOf(".")),a=apiviewer.dao.Class.getClassByName(f);
b=new apiviewer.dao.Class(h,a);
a.addClass(b);
this.__OV46T(b,g,e)},this);
a.addListener("failed",function(a){alert("Couldn't load file: "+d)},this);
a.send();
return b},
__OV46T:function(b,a,c){a&&(c?a.call(c,b):a(b))},
__09VW9:function(c,g,e){var b=[],f=0,d,a;
for(a=0;
a<c.length;
a++)d=c[a],d.isLoaded()||b.push(d);
for(a=0;
a<b.length;
a++)this.load(b[a].getFullName(),true,function(a){f+=1;
f==b.length&&this.__OV46T(apiviewer.dao.Class.getClassByName(c[0].getFullName()),g,e)},this);
b.length==0&&this.__OV46T(c[0],g,e)},
classLoadDependendClasses:function(a,d,c){var b=a.getDependendClasses();
this.__09VW9(b,d,c)},
packageLoadDependendClasses:function(a,d,c){var b=a.getClasses();
this.__09VW9(b,d,c)}}});


// qx.ui.splitpane.Blocker
//   - size: 833 bytes
//   - modified: 2010-10-13T17:38:57
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.html.Element, 1x
qx.Class.define("qx.ui.splitpane.Blocker",{extend:qx.html.Element,
construct:function(a){var b={position:"absolute",
zIndex:11};
this.base(arguments,"div",b);
a?this.setOrientation(a):this.initOrientation()},
properties:{orientation:{init:"horizontal",
check:["horizontal","vertical"],
apply:"_applyOrientation"}},
members:{_applyOrientation:function(a,b){a=="horizontal"?(this.setStyle("height","100%"),this.setStyle("cursor","col-resize"),this.setStyle("top",null)):(this.setStyle("width","100%"),this.setStyle("left",null),this.setStyle("cursor","row-resize"))},
setWidth:function(a,c){var b=c+2*a;
this.setStyle("width",b+"px")},
setHeight:function(a,c){var b=c+2*a;
this.setStyle("height",b+"px")},
setLeft:function(a,c){var b=c-a;
this.setStyle("left",b+"px")},
setTop:function(a,b){var c=b-a;
this.setStyle("top",c+"px")}}});


// qx.html.Input
//   - size: 1181 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 2x
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Input.create, 1x
//       qx.bom.Input.getValue, 1x
//       qx.bom.Input.setValue, 2x
//       qx.bom.Input.setWrap, 1x
//       qx.html.Element, 1x
qx.Class.define("qx.html.Input",{extend:qx.html.Element,
construct:function(a,d,c){if(a==="select"||a==="textarea")var b=a;
else b="input";
this.base(arguments,b,d,c);
this.__jVW4z=a},
members:{__jVW4z:null,
__JD1J9:null,
__t5WbK:null,
_createDomElement:function(){return qx.bom.Input.create(this.__jVW4z)},
_applyProperty:function(b,a){this.base(arguments,b,a);
var c=this.getDomElement();
b==="value"?qx.bom.Input.setValue(c,a):b==="wrap"&&qx.bom.Input.setWrap(c,a)},
setEnabled:function(a){this.setAttribute("disabled",a===false)},
setSelectable:function(a){this.setAttribute("qxSelectable",a?"on":"off")},
setValue:function(b){var a=this.getDomElement();
a?a.value!=b&&qx.bom.Input.setValue(a,b):this._setProperty("value",b);
return this},
getValue:function(){var a=this.getDomElement();
if(a)return qx.bom.Input.getValue(a);
return this._getProperty("value")||""},
setWrap:function(a){if(this.__jVW4z==="textarea")this._setProperty("wrap",a);
else throw new Error("Text wrapping is only support by textareas!");
return this},
getWrap:function(){if(this.__jVW4z==="textarea")return this._getProperty("wrap");
throw new Error("Text wrapping is only support by textareas!")}}});


// qx.ui.core.ColumnData
//   - size: 668 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       parseFloat, 1x
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Setting.define, 1x
//       qx.ui.core.LayoutItem, 1x
qx.Class.define("qx.ui.core.ColumnData",{extend:qx.ui.core.LayoutItem,
construct:function(){this.base(arguments);
this.setColumnWidth("auto")},
members:{__3xShg:null,
renderLayout:function(c,d,a,b){this.__3xShg=a},
getComputedWidth:function(){return this.__3xShg},
getFlex:function(){return this.getLayoutProperties().flex||0},
setColumnWidth:function(a,b){var b=b||0,d=null,c;
if(typeof a=="number")this.setWidth(a);
else if(typeof a=="string"){if(a=="auto")b=1;
else{c=a.match(/^[0-9]+(?:\.[0-9]+)?([%\*])$/);
c&&(c[1]=="*"?b=parseFloat(a):d=a)}}this.setLayoutProperties({flex:b,
width:d})}},
defer:function(){qx.core.Setting.define("qx.tableResizeDebug",false)}});


// qx.ui.layout.Grow
//   - size: 848 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Infinity, 2x
//       Math, 6x
//       qx, 2x
//   - packages:
//       Math.max, 4x
//       Math.min, 2x
//       qx.Class.define, 1x
//       qx.ui.layout.Abstract, 1x
qx.Class.define("qx.ui.layout.Grow",{extend:qx.ui.layout.Abstract,
members:{verifyLayoutProperty:function(c,a,b){this.assert(false,"The property '"+a+"' is not supported by the Grow layout!")},
renderLayout:function(g,i){for(var f=this._getLayoutChildren(),d,a,c,b,e=0,h=f.length;
e<h;
e++)d=f[e],a=d.getSizeHint(),c=g,c<a.minWidth?c=a.minWidth:c>a.maxWidth&&(c=a.maxWidth),b=i,b<a.minHeight?b=a.minHeight:b>a.maxHeight&&(b=a.maxHeight),d.renderLayout(0,0,c,b)},
_computeSizeHint:function(){for(var i=this._getLayoutChildren(),j,a,b=0,c=0,d=0,f=0,h=Infinity,e=Infinity,g=0,k=i.length;
g<k;
g++)j=i[g],a=j.getSizeHint(),b=Math.max(b,a.width),c=Math.max(c,a.height),d=Math.max(d,a.minWidth),f=Math.max(f,a.minHeight),h=Math.min(h,a.maxWidth),e=Math.min(e,a.maxHeight);
return{width:b,
height:c,
minWidth:d,
minHeight:f,
maxWidth:h,
maxHeight:e}}}});


// qx.ui.core.Spacer
//   - size: 376 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.LayoutItem, 1x
//       qx.ui.core.queue.Dispose.add, 1x
qx.Class.define("qx.ui.core.Spacer",{extend:qx.ui.core.LayoutItem,
construct:function(b,a){this.base(arguments);
this.setWidth(b!=null?b:0);
this.setHeight(a!=null?a:0)},
members:{checkAppearanceNeeds:function(){},
addChildrenToQueue:function(a){},
destroy:function(){if(this.$$disposed)return;
var a=this.$$parent;
a&&a._remove(this);
qx.ui.core.queue.Dispose.add(this)}}});


// qx.ui.splitpane.HLayout
//   - size: 1564 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Math, 1x
//       qx, 3x
//   - packages:
//       Math.round, 1x
//       qx.Class.define, 1x
//       qx.ui.layout.Abstract, 1x
//       qx.ui.layout.Util.arrangeIdeals, 1x
qx.Class.define("qx.ui.splitpane.HLayout",{extend:qx.ui.layout.Abstract,
members:{verifyLayoutProperty:function(c,a,b){this.assert(a==="type"||a==="flex","The property '"+a+"' is not supported by the split layout!");
a=="flex"&&this.assertNumber(b);
a=="type"&&this.assertString(b)},
renderLayout:function(l,i){for(var p=this._getLayoutChildren(),s=p.length,h,n,c,m,t,e,o=0,g,j,f,u,d,a,k,b,v,r,q;
o<s;
o++)h=p[o],n=h.getLayoutProperties().type,n==="splitter"?m=h:n==="slider"?t=h:c?e=h:c=h;
if(c&&e){g=c.getLayoutProperties().flex,j=e.getLayoutProperties().flex;
g==null&&(g=1);
j==null&&(j=1);
f=c.getSizeHint(),u=m.getSizeHint(),d=e.getSizeHint(),a=f.width,k=u.width,b=d.width;
if(g>0&&j>0){v=g+j,r=l-k,a=Math.round((r/v)*g),b=r-a,q=qx.ui.layout.Util.arrangeIdeals(f.minWidth,a,f.maxWidth,d.minWidth,b,d.maxWidth);
a=q.begin;
b=q.end}else g>0?(a=l-k-b,a<f.minWidth&&(a=f.minWidth),a>f.maxWidth&&(a=f.maxWidth)):j>0&&(b=l-a-k,b<d.minWidth&&(b=d.minWidth),b>d.maxWidth&&(b=d.maxWidth));
c.renderLayout(0,0,a,i);
m.renderLayout(a,0,k,i);
e.renderLayout(a+k,0,b,i)}else m.renderLayout(0,0,0,0),c?c.renderLayout(0,0,l,i):e&&e.renderLayout(0,0,l,i)},
_computeSizeHint:function(){for(var g=this._getLayoutChildren(),l=g.length,b,a,j,i=0,h=0,k=0,e=0,c=0,d=0,f=0;
f<l;
f++){b=g[f];
j=b.getLayoutProperties();
if(j.type==="slider")continue;
a=b.getSizeHint();
i+=a.minWidth;
h+=a.width;
k+=a.maxWidth;
a.minHeight>e&&(e=a.minHeight);
a.height>c&&(c=a.height);
a.maxHeight>d&&(d=a.maxHeight)}return{minWidth:i,
width:h,
maxWidth:k,
minHeight:e,
height:c,
maxHeight:d}}}});


// qx.ui.splitpane.VLayout
//   - size: 1576 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Math, 1x
//       qx, 3x
//   - packages:
//       Math.round, 1x
//       qx.Class.define, 1x
//       qx.ui.layout.Abstract, 1x
//       qx.ui.layout.Util.arrangeIdeals, 1x
qx.Class.define("qx.ui.splitpane.VLayout",{extend:qx.ui.layout.Abstract,
members:{verifyLayoutProperty:function(c,a,b){this.assert(a==="type"||a==="flex","The property '"+a+"' is not supported by the split layout!");
a=="flex"&&this.assertNumber(b);
a=="type"&&this.assertString(b)},
renderLayout:function(l,i){for(var p=this._getLayoutChildren(),s=p.length,h,n,c,m,u,e,o=0,g,j,f,t,d,a,k,b,v,r,q;
o<s;
o++)h=p[o],n=h.getLayoutProperties().type,n==="splitter"?m=h:n==="slider"?u=h:c?e=h:c=h;
if(c&&e){g=c.getLayoutProperties().flex,j=e.getLayoutProperties().flex;
g==null&&(g=1);
j==null&&(j=1);
f=c.getSizeHint(),t=m.getSizeHint(),d=e.getSizeHint(),a=f.height,k=t.height,b=d.height;
if(g>0&&j>0){v=g+j,r=i-k,a=Math.round((r/v)*g),b=r-a,q=qx.ui.layout.Util.arrangeIdeals(f.minHeight,a,f.maxHeight,d.minHeight,b,d.maxHeight);
a=q.begin;
b=q.end}else g>0?(a=i-k-b,a<f.minHeight&&(a=f.minHeight),a>f.maxHeight&&(a=f.maxHeight)):j>0&&(b=i-a-k,b<d.minHeight&&(b=d.minHeight),b>d.maxHeight&&(b=d.maxHeight));
c.renderLayout(0,0,l,a);
m.renderLayout(0,a,l,k);
e.renderLayout(0,a+k,l,b)}else m.renderLayout(0,0,0,0),c?c.renderLayout(0,0,l,i):e&&e.renderLayout(0,0,l,i)},
_computeSizeHint:function(){for(var g=this._getLayoutChildren(),l=g.length,b,a,k,j=0,h=0,i=0,d=0,c=0,f=0,e=0;
e<l;
e++){b=g[e];
k=b.getLayoutProperties();
if(k.type==="slider")continue;
a=b.getSizeHint();
j+=a.minHeight;
h+=a.height;
i+=a.maxHeight;
a.minWidth>d&&(d=a.minWidth);
a.width>c&&(c=a.width);
a.maxWidth>f&&(f=a.maxWidth)}return{minHeight:j,
height:h,
maxHeight:i,
minWidth:d,
width:c,
maxWidth:f}}}});


// qx.ui.menu.Layout
//   - size: 1153 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Math, 3x
//       qx, 3x
//   - packages:
//       Math.max, 3x
//       qx.Class.define, 1x
//       qx.lang.Array.sum, 1x
//       qx.ui.layout.VBox, 1x
qx.Class.define("qx.ui.menu.Layout",{extend:qx.ui.layout.VBox,
properties:{columnSpacing:{check:"Integer",
init:0,
apply:"_applyLayoutChange"},
spanColumn:{check:"Integer",
init:1,
nullable:true,
apply:"_applyLayoutChange"},
iconColumnWidth:{check:"Integer",
init:0,
themeable:true,
apply:"_applyLayoutChange"},
arrowColumnWidth:{check:"Integer",
init:0,
themeable:true,
apply:"_applyLayoutChange"}},
members:{__P0T0F:null,
_computeSizeHint:function(){for(var h=this._getLayoutChildren(),i,e,j,b=this.getSpanColumn(),a=this.__P0T0F=[0,0,0,0],g=this.getColumnSpacing(),d=0,k=0,f=0,n=h.length,c,m,l;
f<n;
f++){i=h[f];
if(i.isAnonymous())continue;
e=i.getChildrenSizes();
for(c=0;
c<e.length;
c++)b!=null&&c==b&&e[b+1]==0?d=Math.max(d,e[c]):a[c]=Math.max(a[c],e[c]);
m=h[f].getInsets();
k=Math.max(k,m.left+m.right)}b!=null&&a[b]+g+a[b+1]<d&&(a[b]=d-a[b+1]-g);
j=d==0?g*2:g*3;
a[0]==0&&(a[0]=this.getIconColumnWidth());
a[3]==0&&(a[3]=this.getArrowColumnWidth());
l=this.base(arguments).height;
return{minHeight:l,
height:l,
width:qx.lang.Array.sum(a)+k+j}},
getColumnSizes:function(){return this.__P0T0F||null}},
destruct:function(){this.__P0T0F=null}});


// qx.ui.table.columnmodel.resizebehavior.Default
//   - size: 3524 bytes
//   - modified: 2010-11-02T16:08:30
//   - names:
//       Error, 4x
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.ColumnData, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.table.columnmodel.resizebehavior.Abstract, 1x
//       qx.util.DeferredCall, 1x
qx.Class.define("qx.ui.table.columnmodel.resizebehavior.Default",{extend:qx.ui.table.columnmodel.resizebehavior.Abstract,
construct:function(){this.base(arguments);
this.__bqzRkj=[];
this.__qIFXt=new qx.ui.layout.HBox();
this.__qIFXt.connectToWidget(this);
this.__eg6rij=new qx.util.DeferredCall(this._computeColumnsFlexWidth,this)},
properties:{newResizeBehaviorColumnData:{check:"Function",
init:function(a){return new qx.ui.core.ColumnData()}},
initializeWidthsOnEveryAppear:{check:"Boolean",
init:false},
tableColumnModel:{check:"qx.ui.table.columnmodel.Resize"}},
members:{__qIFXt:null,
__baJTDe:null,
__bqzRkj:null,
__eg6rij:null,
__bz2FJs:false,
setWidth:function(a,c,b){if(a>=this.__bqzRkj.length)throw new Error("Column number out of range");
this.__bqzRkj[a].setColumnWidth(c,b);
this.__eg6rij.schedule()},
setMinWidth:function(a,b){if(a>=this.__bqzRkj.length)throw new Error("Column number out of range");
this.__bqzRkj[a].setMinWidth(b);
this.__eg6rij.schedule()},
setMaxWidth:function(a,b){if(a>=this.__bqzRkj.length)throw new Error("Column number out of range");
this.__bqzRkj[a].setMaxWidth(b);
this.__eg6rij.schedule()},
set:function(c,b){for(var a in b)switch(a){case"width":this.setWidth(c,b[a]);
break;
case"minWidth":this.setMinWidth(c,b[a]);
break;
case"maxWidth":this.setMaxWidth(c,b[a]);
break;
default:throw new Error("Unknown property: "+a)}},
onAppear:function(b,a){(a===true||!this.__bz2FJs||this.getInitializeWidthsOnEveryAppear())&&(this._computeColumnsFlexWidth(),this.__bz2FJs=true)},
onTableWidthChanged:function(a){this._computeColumnsFlexWidth()},
onVerticalScrollBarChanged:function(a){this._computeColumnsFlexWidth()},
onColumnWidthChanged:function(a){this._extendNextColumn(a)},
onVisibilityChanged:function(a){var b=a.getData();
if(b.visible){this._computeColumnsFlexWidth();
return}this._extendLastColumn(a)},
_setNumColumns:function(c){var a=this.__bqzRkj,b;
if(c<=a.length){a.splice(c,a.length);
return}for(b=a.length;
b<c;
b++)a[b]=this.getNewResizeBehaviorColumnData()(),a[b].columnNumber=b},
getLayoutChildren:function(){return this.__baJTDe},
_computeColumnsFlexWidth:function(){this.__eg6rij.cancel();
var g=this._getAvailableWidth(),e,c,f,i,a,d,b,h;
if(g===null)return;
e=this.getTableColumnModel(),c=e.getVisibleColumns(),f=c.length,i=this.__bqzRkj;
if(f===0)return;
b=[];
for(a=0;
a<f;
a++)b.push(i[c[a]]);
this.__baJTDe=b;
this.__bw5w8Z();
this.__qIFXt.renderLayout(g,100);
for(a=0,d=b.length;
a<d;
a++){h=b[a].getComputedWidth();
e.setColumnWidth(c[a],h)}},
__bw5w8Z:function(){this.__qIFXt.invalidateChildrenCache();
for(var b=this.__baJTDe,a=0,c=b.length;
a<c;
a++)b[a].invalidateLayoutCache()},
_extendNextColumn:function(h){var d=this.getTableColumnModel(),e=h.getData(),b=d.getVisibleColumns(),g=this._getAvailableWidth(),j=b.length,a,c,f,i;
if(e.newWidth>e.oldWidth)return;
f=0;
for(a=0;
a<j;
a++)f+=d.getColumnWidth(b[a]);
if(f<g){for(a=0;
a<b.length;
a++)if(b[a]==e.col){c=b[a+1];
break}if(c){i=(g-(f-d.getColumnWidth(c)));
d.setColumnWidth(c,i)}}},
_extendLastColumn:function(g){var b=this.getTableColumnModel(),h=g.getData(),a,f,j,c,e,d,i;
if(h.visible)return;
a=b.getVisibleColumns();
if(a.length==0)return;
f=this._getAvailableWidth(b),j=a.length,d=0;
for(c=0;
c<j;
c++)d+=b.getColumnWidth(a[c]);
if(d<f){e=a[a.length-1];
i=(f-(d-b.getColumnWidth(e)));
b.setColumnWidth(e,i)}},
_getResizeColumnData:function(){return this.__bqzRkj}},
destruct:function(){this.__bqzRkj=this.__baJTDe=null;
this._disposeObjects("__layout","__deferredComputeColumnsFlexWidth")}});


// qx.ui.menu.Separator
//   - size: 166 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.Widget, 1x
qx.Class.define("qx.ui.menu.Separator",{extend:qx.ui.core.Widget,
properties:{appearance:{refine:true,
init:"menu-separator"},
anonymous:{refine:true,
init:true}}});


// qx.ui.popup.Manager
//   - size: 1197 bytes
//   - modified: 2010-05-06T22:42:38
//   - names:
//       Error, 2x
//       document, 2x
//       qx, 9x
//       window, 2x
//   - packages:
//       document.documentElement, 2x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.Registration, 1x
//       qx.event.Registration.addListener, 2x
//       qx.ui.core.Widget.contains, 1x
//       qx.ui.core.Widget.getWidgetByElement, 1x
//       qx.ui.popup.Popup, 2x
qx.Class.define("qx.ui.popup.Manager",{type:"singleton",
extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__up0LB={};
qx.event.Registration.addListener(document.documentElement,"mousedown",this.__PdGfp,this,true);
qx.event.Registration.addListener(window,"blur",this.hideAll,this)},
members:{__up0LB:null,
add:function(a){if(!(a instanceof qx.ui.popup.Popup))throw new Error("Object is no popup: "+a);
this.__up0LB[a.$$hash]=a;
this.__2KVzi()},
remove:function(a){if(!(a instanceof qx.ui.popup.Popup))throw new Error("Object is no popup: "+a);
var b=this.__up0LB;
b&&(delete b[a.$$hash],this.__2KVzi())},
hideAll:function(){var a=this.__up0LB,b;
if(a)for(b in a)a[b].exclude()},
__2KVzi:function(){var c=1e7,a=this.__up0LB,b;
for(b in a)a[b].setZIndex(c++)},
__PdGfp:function(e){var d=qx.ui.core.Widget.getWidgetByElement(e.getTarget()),b=this.__up0LB,c,a;
for(c in b){a=b[c];
if(!a.getAutoHide()||d==a||qx.ui.core.Widget.contains(a,d))continue;
a.exclude()}}},
destruct:function(){var a=qx.event.Registration;
a.removeListener(document.documentElement,"mousedown",this.__PdGfp,this,true);
a.removeListener(window,"blur",this.hideAll,this);
this._disposeMap("__objects")}});


// qx.ui.popup.Popup
//   - size: 580 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Init.getApplication, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.core.MPlacement, 1x
//       qx.ui.popup.Manager.getInstance, 2x
qx.Class.define("qx.ui.popup.Popup",{extend:qx.ui.container.Composite,
include:qx.ui.core.MPlacement,
construct:function(a){this.base(arguments,a);
qx.core.Init.getApplication().getRoot().add(this);
this.initVisibility()},
properties:{appearance:{refine:true,
init:"popup"},
visibility:{refine:true,
init:"excluded"},
autoHide:{check:"Boolean",
init:true}},
members:{_applyVisibility:function(a,c){this.base(arguments,a,c);
var b=qx.ui.popup.Manager.getInstance();
a==="visible"?b.add(this):b.remove(this)}},
destruct:function(){qx.ui.popup.Manager.getInstance().remove(this)}});


// qx.ui.splitpane.Slider
//   - size: 163 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.Widget, 1x
qx.Class.define("qx.ui.splitpane.Slider",{extend:qx.ui.core.Widget,
properties:{allowShrinkX:{refine:true,
init:false},
allowShrinkY:{refine:true,
init:false}}});


// qx.ui.toolbar.Separator
//   - size: 231 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.Widget, 1x
qx.Class.define("qx.ui.toolbar.Separator",{extend:qx.ui.core.Widget,
properties:{appearance:{refine:true,
init:"toolbar-separator"},
anonymous:{refine:true,
init:true},
width:{refine:true,
init:0},
height:{refine:true,
init:0}}});


// qx.ui.core.MMultiSelectionHandling
//   - size: 2904 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 4x
//       qx, 6x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.lang.Array.equals, 1x
//       qx.ui.core.Widget.contains, 4x
qx.Mixin.define("qx.ui.core.MMultiSelectionHandling",{construct:function(){var b=this.SELECTION_MANAGER,a=this.__ugn3e=new b(this);
this.addListener("mousedown",a.handleMouseDown,a);
this.addListener("mouseup",a.handleMouseUp,a);
this.addListener("mouseover",a.handleMouseOver,a);
this.addListener("mousemove",a.handleMouseMove,a);
this.addListener("losecapture",a.handleLoseCapture,a);
this.addListener("keypress",a.handleKeyPress,a);
this.addListener("addItem",a.handleAddItem,a);
this.addListener("removeItem",a.handleRemoveItem,a);
a.addListener("changeSelection",this._onSelectionChange,this)},
events:{changeSelection:"qx.event.type.Data"},
properties:{selectionMode:{check:["single","multi","additive","one"],
init:"single",
apply:"_applySelectionMode"},
dragSelection:{check:"Boolean",
init:false,
apply:"_applyDragSelection"},
quickSelection:{check:"Boolean",
init:false,
apply:"_applyQuickSelection"}},
members:{__ugn3e:null,
selectAll:function(){this.__ugn3e.selectAll()},
isSelected:function(a){if(!qx.ui.core.Widget.contains(this,a))throw new Error("Could not test if "+a+" is selected, because it is not a child element!");
return this.__ugn3e.isItemSelected(a)},
addToSelection:function(a){if(!qx.ui.core.Widget.contains(this,a))throw new Error("Could not add + "+a+" to selection, because it is not a child element!");
this.__ugn3e.addItem(a)},
removeFromSelection:function(a){if(!qx.ui.core.Widget.contains(this,a))throw new Error("Could not remove "+a+" from selection, because it is not a child element!");
this.__ugn3e.removeItem(a)},
selectRange:function(b,a){this.__ugn3e.selectItemRange(b,a)},
resetSelection:function(){this.__ugn3e.clearSelection()},
setSelection:function(a){for(var b=0,c;
b<a.length;
b++)if(!qx.ui.core.Widget.contains(this,a[b]))throw new Error("Could not select "+a[b]+", because it is not a child element!");
if(a.length===0)this.resetSelection();
else{c=this.getSelection();
qx.lang.Array.equals(c,a)||this.__ugn3e.replaceSelection(a)}},
getSelection:function(){return this.__ugn3e.getSelection()},
getSortedSelection:function(){return this.__ugn3e.getSortedSelection()},
isSelectionEmpty:function(){return this.__ugn3e.isSelectionEmpty()},
getSelectionContext:function(){return this.__ugn3e.getSelectionContext()},
_getManager:function(){return this.__ugn3e},
getSelectables:function(a){return this.__ugn3e.getSelectables(a)},
invertSelection:function(){this.__ugn3e.invertSelection()},
_getLeadItem:function(){var a=this.__ugn3e.getMode();
return a==="single"||a==="one"?this.__ugn3e.getSelectedItem():this.__ugn3e.getLeadItem()},
_applySelectionMode:function(a,b){this.__ugn3e.setMode(a)},
_applyDragSelection:function(a,b){this.__ugn3e.setDrag(a)},
_applyQuickSelection:function(a,b){this.__ugn3e.setQuick(a)},
_onSelectionChange:function(a){this.fireDataEvent("changeSelection",a.getData())}},
destruct:function(){this._disposeObjects("__manager")}});


// qx.ui.table.pane.Pane
//   - size: 5808 bytes
//   - modified: 2010-09-13T20:08:24
//   - names:
//       Math, 5x
//       document, 1x
//       qx, 2x
//   - packages:
//       Math.abs, 3x
//       Math.max, 1x
//       Math.min, 1x
//       document.createElement, 1x
//       qx.Class.define, 1x
//       qx.ui.core.Widget, 1x
qx.Class.define("qx.ui.table.pane.Pane",{extend:qx.ui.core.Widget,
construct:function(a){this.base(arguments);
this.__VtpeD=a;
this.__U0N82=0;
this.__VPXfs=0;
this.__yLuIh=[]},
events:{paneReloadsData:"qx.event.type.Data",
paneUpdated:"qx.event.type.Event"},
properties:{firstVisibleRow:{check:"Number",
init:0,
apply:"_applyFirstVisibleRow"},
visibleRowCount:{check:"Number",
init:0,
apply:"_applyVisibleRowCount"},
maxCacheLines:{check:"Number",
init:1000,
apply:"_applyMaxCacheLines"},
allowShrinkX:{refine:true,
init:false}},
members:{__VPXfs:null,
__U0N82:null,
__VtpeD:null,
__827Zu:null,
__JGvbE:null,
__Jq6rq:null,
__yLuIh:null,
__1vEOK:0,
_applyFirstVisibleRow:function(a,b){this.updateContent(false,a-b)},
_applyVisibleRowCount:function(a,b){this.updateContent(true)},
_getContentHint:function(){return{width:this.getPaneScroller().getTablePaneModel().getTotalWidth(),
height:400}},
getPaneScroller:function(){return this.__VtpeD},
getTable:function(){return this.__VtpeD.getTable()},
setFocusedCell:function(c,a,d){if(c!=this.__Jq6rq||a!=this.__JGvbE){var b=this.__JGvbE;
this.__Jq6rq=c;
this.__JGvbE=a;
a!=b&&!d&&(b!==null&&this.updateContent(false,null,b,true),a!==null&&this.updateContent(false,null,a,true))}},
onSelectionChanged:function(){this.updateContent(false,null,null,true)},
onFocusChanged:function(){this.updateContent(false,null,null,true)},
setColumnWidth:function(a,b){this.updateContent(true)},
onColOrderChanged:function(){this.updateContent(true)},
onPaneModelChanged:function(){this.updateContent(true)},
onTableModelDataChanged:function(c,b,e,f){this.__07svm();
var a=this.getFirstVisibleRow(),d=this.getVisibleRowCount();
(b==-1||b>=a&&c<a+d)&&this.updateContent()},
onTableModelMetaDataChanged:function(){this.updateContent(true)},
_applyMaxCacheLines:function(a,b){this.__1vEOK>=a&&a!==-1&&this.__07svm()},
__07svm:function(){this.__yLuIh=[];
this.__1vEOK=0},
__OsVU7:function(a,c,b){return!c&&!b&&this.__yLuIh[a]?this.__yLuIh[a]:null},
__OCPGt:function(a,c,e,d){var b=this.getMaxCacheLines();
!e&&!d&&!this.__yLuIh[a]&&b>0&&(this._applyMaxCacheLines(b),this.__yLuIh[a]=c,this.__1vEOK+=1)},
updateContent:function(d,a,b,c){d&&this.__07svm();
a&&Math.abs(a)<=Math.min(10,this.getVisibleRowCount())?this._scrollContent(a):c&&!this.getTable().getAlwaysUpdateCells()?this._updateRowStyles(b):this._updateAllRows()},
_updateRowStyles:function(g){var f=this.getContentElement().getDomElement(),c,l,k,j,i,b,a,d,h,e;
if(!f||!f.firstChild){this._updateAllRows();
return}c=this.getTable(),l=c.getSelectionModel(),k=c.getTableModel(),j=c.getDataRowRenderer(),i=f.firstChild.childNodes,b={table:c},a=this.getFirstVisibleRow(),d=0,h=i.length;
if(g!=null){e=g-a;
if(e>=0&&e<h)a=g,d=e,h=e+1;
else return}for(;
d<h;
d++,a++)b.row=a,b.selected=l.isSelectedIndex(a),b.focusedRow=this.__JGvbE==a,b.rowData=k.getRowData(a),j.updateDataRowElement(b,i[d])},
_getRowsHtml:function(h,y){var f=this.getTable(),E=f.getSelectionModel(),i=f.getTableModel(),x=f.getTableColumnModel(),p=this.getPaneScroller().getTablePaneModel(),g=f.getDataRowRenderer(),u,r,o,A,c,e,v,j,D,b,n,k,t,d,a,B,C,m,w,s,l,q,z;
i.prefetchRows(h,h+y-1);
u=f.getRowHeight(),r=p.getColumnCount(),o=0,A=[],c=0;
for(;
c<r;
c++){e=p.getColumnAtX(c),v=x.getColumnWidth(e);
A.push({col:e,
xPos:c,
editable:i.isColumnEditable(e),
focusedCol:this.__Jq6rq==e,
styleLeft:o,
styleWidth:v});
o+=v}j=[],D=false,b=h;
for(;
b<h+y;
b++){n=E.isSelectedIndex(b),k=(this.__JGvbE==b),t=this.__OsVU7(b,n,k);
if(t){j.push(t);
continue}d=[],a={table:f};
a.styleHeight=u;
a.row=b;
a.selected=n;
a.focusedRow=k;
a.rowData=i.getRowData(b);
a.rowData||(D=true);
d.push("<div ");
B=g.getRowAttributes(a);
B&&d.push(B);
C=g.getRowClass(a);
C&&d.push("class=\"",C,"\" ");
m=g.createRowStyle(a);
m+=";position:relative;"+g.getRowHeightStyle(u)+"width:100%;";
m&&d.push("style=\"",m,"\" ");
d.push(">");
w=false;
for(c=0;
c<r&&!w;
c++){s=A[c];
for(l in s)a[l]=s[l];
e=a.col;
a.value=i.getValue(e,b);
q=x.getDataCellRenderer(e);
a.style=q.getDefaultCellStyle();
w=q.createDataCellHtml(a,d)||false}d.push("</div>");
z=d.join("");
this.__OCPGt(b,z,n,k);
j.push(z)}this.fireDataEvent("paneReloadsData",D);
return j.join("")},
_scrollContent:function(a){var h=this.getContentElement().getDomElement(),c,n,g,j,l,i,k,m,f,e,d,b;
if(!(h&&h.firstChild)){this._updateAllRows();
return}c=h.firstChild,n=c.childNodes,g=this.getVisibleRowCount(),j=this.getFirstVisibleRow(),l=this.getTable().getTableModel(),i=0;
i=l.getRowCount();
if(j+g>i){this._updateAllRows();
return}k=a<0?g+a:0,m=a<0?0:g-a;
for(b=Math.abs(a)-1;
b>=0;
b--){f=n[k];
try{c.removeChild(f)}catch(o){break}}this.__827Zu||(this.__827Zu=document.createElement("div"));
e="<div>";
e+=this._getRowsHtml(j+m,Math.abs(a));
e+="</div>";
this.__827Zu.innerHTML=e;
d=this.__827Zu.firstChild.childNodes;
if(a>0)for(b=d.length-1;
b>=0;
b--){f=d[0];
c.appendChild(f)}else for(b=d.length-1;
b>=0;
b--){f=d[d.length-1];
c.insertBefore(f,c.firstChild)}this.__JGvbE!==null&&(this._updateRowStyles(this.__JGvbE-a),this._updateRowStyles(this.__JGvbE));
this.fireEvent("paneUpdated")},
_updateAllRows:function(){var g=this.getContentElement().getDomElement(),b,k,f,i,l,d,a,e,j,c,h;
if(!g){this.addListenerOnce("appear",arguments.callee,this);
return}b=this.getTable(),k=b.getTableModel(),f=this.getPaneScroller().getTablePaneModel(),i=f.getColumnCount(),l=b.getRowHeight(),d=this.getFirstVisibleRow(),a=this.getVisibleRowCount(),e=k.getRowCount();
d+a>e&&(a=Math.max(0,e-d));
j=f.getTotalWidth();
c=a>0?["<div style='","width: 100%;",(b.getForceLineHeight()?"line-height: "+l+"px;":""),"overflow: hidden;","'>",this._getRowsHtml(d,a),"</div>"]:[];
h=c.join("");
g.innerHTML=h;
this.setWidth(j);
this.__U0N82=i;
this.__VPXfs=a;
this.fireEvent("paneUpdated")}},
destruct:function(){this.__827Zu=this.__VtpeD=this.__yLuIh=null}});


// qx.ui.core.scroll.ScrollPane
//   - size: 2548 bytes
//   - modified: 2010-11-02T16:15:01
//   - names:
//       Math, 2x
//       qx, 5x
//   - packages:
//       Math.max, 2x
//       qx.Class.define, 1x
//       qx.core.Type.check, 2x
//       qx.ui.core.Widget, 1x
//       qx.ui.layout.Grow, 1x
qx.Class.define("qx.ui.core.scroll.ScrollPane",{extend:qx.ui.core.Widget,
construct:function(){this.base(arguments);
this.set({minWidth:0,
minHeight:0});
this._setLayout(new qx.ui.layout.Grow());
this.addListener("resize",this._onUpdate);
var a=this.getContentElement();
a.addListener("scroll",this._onScroll,this);
a.addListener("appear",this._onAppear,this)},
events:{update:"qx.event.type.Event"},
properties:{scrollX:{check:function(a){qx.core.Type.check(a,"Integer");
return a<=this.getScrollMaxX()},
apply:"_applyScrollX",
event:"scrollX",
init:0},
scrollY:{check:function(a){qx.core.Type.check(a,"Integer");
return a<=this.getScrollMaxY()},
apply:"_applyScrollY",
event:"scrollY",
init:0}},
members:{add:function(b){var a=this._getChildren()[0];
a&&(this._remove(a),a.removeListener("resize",this._onUpdate,this));
b&&(this._add(b),b.addListener("resize",this._onUpdate,this))},
remove:function(a){a&&(this._remove(a),a.removeListener("resize",this._onUpdate,this))},
getChildren:function(){return this._getChildren()},
_onUpdate:function(a){this.fireEvent("update")},
_onScroll:function(b){var a=this.getContentElement();
this.setScrollX(a.getScrollX());
this.setScrollY(a.getScrollY())},
_onAppear:function(f){var a=this.getContentElement(),c=this.getScrollX(),e=a.getScrollX(),b,d;
c!=e&&a.scrollToX(c);
b=this.getScrollY(),d=a.getScrollY();
b!=d&&a.scrollToY(b)},
getItemTop:function(a){var b=0;
do{b+=a.getBounds().top,a=a.getLayoutParent();
}while(a&&a!==this);
return b},
getItemBottom:function(a){return this.getItemTop(a)+a.getBounds().height},
getItemLeft:function(a){var c=0,b;
do{c+=a.getBounds().left,b=a.getLayoutParent(),b&&(c+=b.getInsets().left),a=b;
}while(a&&a!==this);
return c},
getItemRight:function(a){return this.getItemLeft(a)+a.getBounds().width},
getScrollSize:function(){return this.getChildren()[0].getBounds()},
getScrollMaxX:function(){var a=this.getInnerSize(),b=this.getScrollSize();
if(a&&b)return Math.max(0,b.width-a.width);
return 0},
getScrollMaxY:function(){var a=this.getInnerSize(),b=this.getScrollSize();
if(a&&b)return Math.max(0,b.height-a.height);
return 0},
scrollToX:function(a){var b=this.getScrollMaxX();
a<0?a=0:a>b&&(a=b);
this.setScrollX(a)},
scrollToY:function(a){var b=this.getScrollMaxY();
a<0?a=0:a>b&&(a=b);
this.setScrollY(a)},
scrollByX:function(a){this.scrollToX(this.getScrollX()+a)},
scrollByY:function(a){this.scrollToY(this.getScrollY()+a)},
_applyScrollX:function(a){this.getContentElement().scrollToX(a)},
_applyScrollY:function(a){this.getContentElement().scrollToY(a)}}});


// qx.ui.core.scroll.NativeScrollBar
//   - size: 2854 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Math, 2x
//       qx, 6x
//   - packages:
//       Math.max, 1x
//       Math.min, 1x
//       qx.Class.define, 1x
//       qx.bom.element.Overflow.getScrollbarWidth, 1x
//       qx.html.Element, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.queue.Layout.add, 1x
//       qx.ui.core.scroll.IScrollBar, 1x
qx.Class.define("qx.ui.core.scroll.NativeScrollBar",{extend:qx.ui.core.Widget,
implement:qx.ui.core.scroll.IScrollBar,
construct:function(a){this.base(arguments);
this.addState("native");
this.getContentElement().addListener("scroll",this._onScroll,this);
this.addListener("mousedown",this._stopPropagation,this);
this.addListener("mouseup",this._stopPropagation,this);
this.addListener("mousemove",this._stopPropagation,this);
this.getContentElement().add(this._getScrollPaneElement());
a!=null?this.setOrientation(a):this.initOrientation()},
properties:{appearance:{refine:true,
init:"scrollbar"},
orientation:{check:["horizontal","vertical"],
init:"horizontal",
apply:"_applyOrientation"},
maximum:{check:"PositiveInteger",
apply:"_applyMaximum",
init:100},
position:{check:"Number",
init:0,
apply:"_applyPosition",
event:"scroll"},
singleStep:{check:"Integer",
init:20},
knobFactor:{check:"PositiveNumber",
nullable:true}},
members:{__WgT2T:null,
__bybJhg:null,
_getScrollPaneElement:function(){this.__bybJhg||(this.__bybJhg=new qx.html.Element());
return this.__bybJhg},
renderLayout:function(c,d,e,a){var b=this.base(arguments,c,d,e,a);
this._updateScrollBar();
return b},
_getContentHint:function(){var a=qx.bom.element.Overflow.getScrollbarWidth();
return{width:this.__WgT2T?100:a,
maxWidth:this.__WgT2T?null:a,
minWidth:this.__WgT2T?null:a,
height:this.__WgT2T?a:100,
maxHeight:this.__WgT2T?a:null,
minHeight:this.__WgT2T?a:null}},
_applyEnabled:function(a,b){this.base(arguments,a,b);
this._updateScrollBar()},
_applyMaximum:function(a){this._updateScrollBar()},
_applyPosition:function(a){var b=this.getContentElement();
this.__WgT2T?b.scrollToX(a):b.scrollToY(a)},
_applyOrientation:function(b,c){var a=this.__WgT2T=b==="horizontal";
this.set({allowGrowX:a,
allowShrinkX:a,
allowGrowY:!a,
allowShrinkY:!a});
a?this.replaceState("vertical","horizontal"):this.replaceState("horizontal","vertical");
this.getContentElement().setStyles({overflowX:a?"scroll":"hidden",
overflowY:a?"hidden":"scroll"});
qx.ui.core.queue.Layout.add(this)},
_updateScrollBar:function(){var b=this.__WgT2T,a=this.getBounds(),d,c;
if(!a)return;
if(this.isEnabled()){d=b?a.width:a.height,c=this.getMaximum()+d}else c=0;
this._getScrollPaneElement().setStyles({left:0,
top:0,
width:(b?c:1)+"px",
height:(b?1:c)+"px"});
this.scrollTo(this.getPosition())},
scrollTo:function(a){this.setPosition(Math.max(0,Math.min(this.getMaximum(),a)))},
scrollBy:function(a){this.scrollTo(this.getPosition()+a)},
scrollBySteps:function(b){var a=this.getSingleStep();
this.scrollBy(b*a)},
_onScroll:function(c){var a=this.getContentElement(),b=this.__WgT2T?a.getScrollX():a.getScrollY();
this.setPosition(b)},
_onAppear:function(a){this.scrollTo(this.getPosition())},
_stopPropagation:function(a){a.stopPropagation()}},
destruct:function(){this._disposeObjects("__scrollPaneElement")}});


// qx.ui.tree.FolderOpenButton
//   - size: 631 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Image, 1x
//       qx.ui.core.MExecutable, 1x
qx.Class.define("qx.ui.tree.FolderOpenButton",{extend:qx.ui.basic.Image,
include:qx.ui.core.MExecutable,
construct:function(){this.base(arguments);
this.initOpen();
this.addListener("click",this._onClick);
this.addListener("mousedown",this._stopPropagation,this);
this.addListener("mouseup",this._stopPropagation,this)},
properties:{open:{check:"Boolean",
init:false,
event:"changeOpen",
apply:"_applyOpen"}},
members:{_applyOpen:function(a,b){a?this.addState("opened"):this.removeState("opened");
this.execute()},
_stopPropagation:function(a){a.stopPropagation()},
_onClick:function(a){this.toggleOpen();
a.stopPropagation()}}});


// qx.ui.splitpane.Splitter
//   - size: 612 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Image, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.layout.VBox, 1x
qx.Class.define("qx.ui.splitpane.Splitter",{extend:qx.ui.core.Widget,
construct:function(a){this.base(arguments);
a.getOrientation()=="vertical"?(this._setLayout(new qx.ui.layout.HBox(0,"center")),this._getLayout().setAlignY("middle")):(this._setLayout(new qx.ui.layout.VBox(0,"middle")),this._getLayout().setAlignX("center"));
this._createChildControl("knob")},
properties:{allowShrinkX:{refine:true,
init:false},
allowShrinkY:{refine:true,
init:false}},
members:{_createChildControlImpl:function(b){var a;
switch(b){case"knob":a=new qx.ui.basic.Image;
this._add(a);
break}return a||this.base(arguments,b)}}});


// qx.ui.table.pane.FocusIndicator
//   - size: 1030 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.container.Composite, 1x
qx.Class.define("qx.ui.table.pane.FocusIndicator",{extend:qx.ui.container.Composite,
construct:function(a){this.base(arguments);
this.__zCh7p=a;
this.setKeepActive(true);
this.addListener("keypress",this._onKeyPress,this)},
properties:{visibility:{refine:true,
init:"excluded"},
row:{check:"Integer",
nullable:true},
column:{check:"Integer",
nullable:true}},
members:{__zCh7p:null,
_onKeyPress:function(a){var b=a.getKeyIdentifier();
b!=="Escape"&&b!=="Enter"&&a.stopPropagation()},
moveToCell:function(a,b){if(a==null)this.hide(),this.setRow(null),this.setColumn(null);
else{var h=this.__zCh7p.getTablePaneModel().getX(a),c,f,e,g,d;
if(h==-1)this.hide(),this.setRow(null),this.setColumn(null);
else{c=this.__zCh7p.getTable(),f=c.getTableColumnModel(),e=this.__zCh7p.getTablePaneModel(),g=this.__zCh7p.getTablePane().getFirstVisibleRow(),d=c.getRowHeight();
this.setUserBounds(e.getColumnLeft(a)-2,(b-g)*d-2,f.getColumnWidth(a)+3,d+3);
this.show();
this.setRow(b);
this.setColumn(a)}}}},
destruct:function(){this.__zCh7p=null}});


// qx.ui.container.Stack
//   - size: 1449 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.ISingleSelection, 1x
//       qx.ui.core.MSingleSelectionHandling, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.layout.Grow, 1x
qx.Class.define("qx.ui.container.Stack",{extend:qx.ui.core.Widget,
implement:qx.ui.core.ISingleSelection,
include:qx.ui.core.MSingleSelectionHandling,
construct:function(){this.base(arguments);
this._setLayout(new qx.ui.layout.Grow);
this.addListener("changeSelection",this.__bvWjtA,this)},
properties:{dynamic:{check:"Boolean",
init:false,
apply:"_applyDynamic"}},
members:{_applyDynamic:function(d){for(var b=this._getChildren(),f=this.getSelection()[0],c,a=0,e=b.length;
a<e;
a++)c=b[a],c!=f&&(d?b[a].exclude():b[a].hide())},
_getItems:function(){return this.getChildren()},
_isAllowEmptySelection:function(){return true},
_isItemSelectable:function(a){return true},
__bvWjtA:function(c){var a=c.getOldData()[0],b=c.getData()[0];
a&&(this.isDynamic()?a.exclude():a.hide());
b&&b.show()},
add:function(a){this._add(a);
var b=this.getSelection()[0];
b?b!==a&&(this.isDynamic()?a.exclude():a.hide()):this.setSelection([a])},
remove:function(b){this._remove(b);
if(this.getSelection()[0]===b){var a=this._getChildren()[0];
a?this.setSelection([a]):this.resetSelection()}},
indexOf:function(a){return this._indexOf(a)},
getChildren:function(){return this._getChildren()},
previous:function(){var c=this.getSelection()[0],a=this._indexOf(c)-1,b=this._getChildren(),d;
a<0&&(a=b.length-1);
d=b[a];
this.setSelection([d])},
next:function(){var c=this.getSelection()[0],d=this._indexOf(c)+1,a=this._getChildren(),b=a[d]||a[0];
this.setSelection([b])}}});


// qx.ui.table.pane.Clipper
//   - size: 314 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.layout.Grow, 1x
qx.Class.define("qx.ui.table.pane.Clipper",{extend:qx.ui.container.Composite,
construct:function(){this.base(arguments,new qx.ui.layout.Grow());
this.setMinWidth(0)},
members:{scrollToX:function(a){this.getContentElement().scrollToX(a,false)},
scrollToY:function(a){this.getContentElement().scrollToY(a,true)}}});


// qx.ui.toolbar.PartContainer
//   - size: 326 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.layout.HBox, 1x
qx.Class.define("qx.ui.toolbar.PartContainer",{extend:qx.ui.container.Composite,
construct:function(){this.base(arguments);
this._setLayout(new qx.ui.layout.HBox)},
properties:{appearance:{refine:true,
init:"toolbar/part/container"},
show:{init:"both",
check:["both","label","icon"],
inheritable:true,
event:"changeShow"}}});


// qx.ui.form.Slider
//   - size: 8255 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Math, 6x
//       qx, 17x
//   - packages:
//       Math.round, 5x
//       qx.Class.define, 1x
//       qx.bom.element.Location.get, 4x
//       qx.core.Type.check, 1x
//       qx.event.Timer, 2x
//       qx.event.type.Data, 2x
//       qx.ui.core.Widget, 2x
//       qx.ui.form.IForm, 1x
//       qx.ui.form.INumberForm, 1x
//       qx.ui.form.IRange, 1x
//       qx.ui.form.MForm, 1x
//       qx.ui.layout.Canvas, 1x
qx.Class.define("qx.ui.form.Slider",{extend:qx.ui.core.Widget,
implement:[qx.ui.form.IForm,qx.ui.form.INumberForm,qx.ui.form.IRange],
include:[qx.ui.form.MForm],
construct:function(a){this.base(arguments);
this._setLayout(new qx.ui.layout.Canvas());
this.addListener("keypress",this._onKeyPress);
this.addListener("mousewheel",this._onMouseWheel);
this.addListener("mousedown",this._onMouseDown);
this.addListener("mouseup",this._onMouseUp);
this.addListener("losecapture",this._onMouseUp);
this.addListener("resize",this._onUpdate);
this.addListener("contextmenu",this._onStopEvent);
this.addListener("click",this._onStopEvent);
this.addListener("dblclick",this._onStopEvent);
a!=null?this.setOrientation(a):this.initOrientation()},
events:{changeValue:"qx.event.type.Data"},
properties:{appearance:{refine:true,
init:"slider"},
focusable:{refine:true,
init:true},
orientation:{check:["horizontal","vertical"],
init:"horizontal",
apply:"_applyOrientation"},
value:{check:function(a){qx.core.Type.check(a,"Number");
return a>=this.getMinimum()&&a<=this.getMaximum()},
init:0,
apply:"_applyValue",
nullable:true},
minimum:{check:"Integer",
init:0,
apply:"_applyMinimum",
event:"changeMinimum"},
maximum:{check:"Integer",
init:100,
apply:"_applyMaximum",
event:"changeMaximum"},
singleStep:{check:"Integer",
init:1},
pageStep:{check:"Integer",
init:10},
knobFactor:{check:"Number",
apply:"_applyKnobFactor",
nullable:true}},
members:{__904EN:null,
__VlYUE:null,
__yW2L2:null,
__ylm34:null,
__ID9JE:null,
__V2krr:null,
__byKVxL:null,
__PzF9F:null,
__mXur6:null,
__Dqu82:null,
__9FCP8:null,
__DoQQM:null,
_forwardStates:{invalid:true},
_createChildControlImpl:function(b){var a;
switch(b){case"knob":a=new qx.ui.core.Widget();
a.addListener("resize",this._onUpdate,this);
a.addListener("mouseover",this._onMouseOver);
a.addListener("mouseout",this._onMouseOut);
this._add(a);
break}return a||this.base(arguments,b)},
_onMouseOver:function(a){this.addState("hovered")},
_onMouseOut:function(a){this.removeState("hovered")},
_onMouseWheel:function(a){var b=a.getWheelDelta()>0?1:-1;
this.slideBy(b*this.getSingleStep());
a.stop()},
_onKeyPress:function(a){var b=this.getOrientation()==="horizontal",c=b?"Left":"Up",d=b?"Right":"Down";
switch(a.getKeyIdentifier()){case d:this.slideForward();
break;
case c:this.slideBack();
break;
case"PageDown":this.slidePageForward();
break;
case"PageUp":this.slidePageBack();
break;
case"Home":this.slideToBegin();
break;
case"End":this.slideToEnd();
break;
default:return}a.stop()},
_onMouseDown:function(a){if(this.__ylm34)return;
var d=this.__WgT2T,b=this.getChildControl("knob"),f=d?"left":"top",c=d?a.getDocumentLeft():a.getDocumentTop(),g=this.__904EN=qx.bom.element.Location.get(this.getContentElement().getDomElement())[f],e=this.__VlYUE=qx.bom.element.Location.get(b.getContainerElement().getDomElement())[f];
a.getTarget()===b?(this.__ylm34=true,this.__Dqu82||(this.__Dqu82=new qx.event.Timer(100),this.__Dqu82.addListener("interval",this._fireValue,this)),this.__Dqu82.start(),this.__ID9JE=c+g-e,b.addState("pressed")):(this.__V2krr=true,this.__byKVxL=c<=e?-1:1,this.__bIJmyE(a),this._onInterval(),this.__mXur6||(this.__mXur6=new qx.event.Timer(100),this.__mXur6.addListener("interval",this._onInterval,this)),this.__mXur6.start());
this.addListener("mousemove",this._onMouseMove);
this.capture();
a.stopPropagation()},
_onMouseUp:function(a){if(this.__ylm34){this.releaseCapture();
delete this.__ylm34;
this.__Dqu82.stop();
this._fireValue();
delete this.__ID9JE;
this.getChildControl("knob").removeState("pressed");
if(a.getType()==="mouseup"){var c,b,d;
this.__WgT2T?(c=a.getDocumentLeft()-(this._valueToPosition(this.getValue())+this.__904EN),d=qx.bom.element.Location.get(this.getContentElement().getDomElement())["top"],b=a.getDocumentTop()-(d+this.getChildControl("knob").getBounds().top)):(c=a.getDocumentTop()-(this._valueToPosition(this.getValue())+this.__904EN),d=qx.bom.element.Location.get(this.getContentElement().getDomElement())["left"],b=a.getDocumentLeft()-(d+this.getChildControl("knob").getBounds().left));
(b<0||b>this.__yW2L2||c<0||c>this.__yW2L2)&&this.getChildControl("knob").removeState("hovered")}}else this.__V2krr&&(this.__mXur6.stop(),this.releaseCapture(),delete this.__V2krr,delete this.__byKVxL,delete this.__PzF9F);
this.removeListener("mousemove",this._onMouseMove);
a.getType()==="mouseup"&&a.stopPropagation()},
_onMouseMove:function(a){if(this.__ylm34){var b=this.__WgT2T?a.getDocumentLeft():a.getDocumentTop(),c=b-this.__ID9JE;
this.slideTo(this._positionToValue(c))}else this.__V2krr&&this.__bIJmyE(a);
a.stopPropagation()},
_onInterval:function(c){var a=this.getValue()+this.__byKVxL*this.getPageStep(),b;
a<this.getMinimum()?a=this.getMinimum():a>this.getMaximum()&&(a=this.getMaximum());
b=this.__byKVxL==-1;
(b&&a<=this.__PzF9F||!b&&a>=this.__PzF9F)&&(a=this.__PzF9F);
this.slideTo(a)},
_onUpdate:function(d){var c=this.getInnerSize(),b=this.getChildControl("knob").getBounds(),a=this.__WgT2T?"width":"height";
this._updateKnobSize();
this.__VXVET=c[a]-b[a];
this.__yW2L2=b[a];
this._updateKnobPosition()},
__WgT2T:false,
__VXVET:0,
__bIJmyE:function(h){var l=this.__WgT2T,d=l?h.getDocumentLeft():h.getDocumentTop(),i=this.__904EN,m=this.__VlYUE,k=this.__yW2L2,c=d-i,a,g,f,b,e,j;
d>=m&&(c-=k);
a=this._positionToValue(c),g=this.getMinimum(),f=this.getMaximum();
if(a<g)a=g;
else if(a>f)a=f;
else{b=this.getValue(),e=this.getPageStep(),j=this.__byKVxL<0?"floor":"ceil";
a=b+Math[j]((a-b)/e)*e}(this.__PzF9F==null||this.__byKVxL==-1&&a<=this.__PzF9F||this.__byKVxL==1&&a>=this.__PzF9F)&&(this.__PzF9F=a)},
_positionToValue:function(d){var b=this.__VXVET,a,c;
if(b==null||b==0)return 0;
a=d/b;
a<0?a=0:a>1&&(a=1);
c=this.getMaximum()-this.getMinimum();
return this.getMinimum()+Math.round(c*a)},
_valueToPosition:function(b){var d=this.__VXVET,c,b,a;
if(d==null)return 0;
c=this.getMaximum()-this.getMinimum();
if(c==0)return 0;
b=b-this.getMinimum(),a=b/c;
a<0?a=0:a>1&&(a=1);
return Math.round(d*a)},
_updateKnobPosition:function(){this._setKnobPosition(this._valueToPosition(this.getValue()))},
_setKnobPosition:function(b){var a=this.getChildControl("knob").getContainerElement();
this.__WgT2T?a.setStyle("left",b+"px",true):a.setStyle("top",b+"px",true)},
_updateKnobSize:function(){var a=this.getKnobFactor(),b;
if(a==null)return;
b=this.getInnerSize();
if(b==null)return;
this.__WgT2T?this.getChildControl("knob").setWidth(Math.round(a*b.width)):this.getChildControl("knob").setHeight(Math.round(a*b.height))},
slideToBegin:function(){this.slideTo(this.getMinimum())},
slideToEnd:function(){this.slideTo(this.getMaximum())},
slideForward:function(){this.slideBy(this.getSingleStep())},
slideBack:function(){this.slideBy(-this.getSingleStep())},
slidePageForward:function(){this.slideBy(this.getPageStep())},
slidePageBack:function(){this.slideBy(-this.getPageStep())},
slideBy:function(a){this.slideTo(this.getValue()+a)},
slideTo:function(a){a=a<this.getMinimum()?this.getMinimum():a>this.getMaximum()?this.getMaximum():this.getMinimum()+Math.round((a-this.getMinimum())/this.getSingleStep())*this.getSingleStep();
this.setValue(a)},
_applyOrientation:function(b,c){var a=this.getChildControl("knob");
this.__WgT2T=b==="horizontal";
this.__WgT2T?(this.removeState("vertical"),a.removeState("vertical"),this.addState("horizontal"),a.addState("horizontal"),a.setLayoutProperties({top:0,
right:null,
bottom:0})):(this.removeState("horizontal"),a.removeState("horizontal"),this.addState("vertical"),a.addState("vertical"),a.setLayoutProperties({right:0,
bottom:null,
left:0}));
this._updateKnobPosition()},
_applyKnobFactor:function(a,b){a!=null?this._updateKnobSize():this.__WgT2T?this.getChildControl("knob").resetWidth():this.getChildControl("knob").resetHeight()},
_applyValue:function(a,b){a!=null?(this._updateKnobPosition(),this.__ylm34?this.__DoQQM=[a,b]:this.fireEvent("changeValue",qx.event.type.Data,[a,b])):this.resetValue()},
_fireValue:function(){if(!this.__DoQQM)return;
var a=this.__DoQQM;
this.__DoQQM=null;
this.fireEvent("changeValue",qx.event.type.Data,a)},
_applyMinimum:function(a,b){this.getValue()<a&&this.setValue(a);
this._updateKnobPosition()},
_applyMaximum:function(a,b){this.getValue()>a&&this.setValue(a);
this._updateKnobPosition()}}});


// qx.ui.splitpane.Pane
//   - size: 4645 bytes
//   - modified: 2010-10-13T17:38:57
//   - names:
//       qx, 11x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.element.Location.getPosition, 2x
//       qx.lang.Array.remove, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.queue.Manager.flush, 1x
//       qx.ui.splitpane.Blocker, 1x
//       qx.ui.splitpane.HLayout, 1x
//       qx.ui.splitpane.Slider, 1x
//       qx.ui.splitpane.Splitter, 1x
//       qx.ui.splitpane.VLayout, 1x
qx.Class.define("qx.ui.splitpane.Pane",{extend:qx.ui.core.Widget,
construct:function(a){this.base(arguments);
this.__yONi8=[];
a?this.setOrientation(a):this.initOrientation();
this.__ukeJN.addListener("mousedown",this._onMouseDown,this);
this.__ukeJN.addListener("mouseup",this._onMouseUp,this);
this.__ukeJN.addListener("mousemove",this._onMouseMove,this);
this.__ukeJN.addListener("mouseout",this._onMouseOut,this);
this.__ukeJN.addListener("losecapture",this._onMouseUp,this)},
properties:{appearance:{refine:true,
init:"splitpane"},
offset:{check:"Integer",
init:6,
apply:"_applyOffset"},
orientation:{init:"horizontal",
check:["horizontal","vertical"],
apply:"_applyOrientation"}},
members:{__bbMe49:null,
__bxdvzd:false,
__JEzQe:null,
__JEQTh:null,
__WgT2T:null,
__Dn1HL:null,
__t2UEv:null,
__yONi8:null,
__ukeJN:null,
_createChildControlImpl:function(b){var a;
switch(b){case"slider":a=new qx.ui.splitpane.Slider(this);
a.exclude();
this._add(a,{type:b});
break;
case"splitter":a=new qx.ui.splitpane.Splitter(this);
this._add(a,{type:b});
break}return a||this.base(arguments,b)},
__1DmbF:function(b){this.__ukeJN=new qx.ui.splitpane.Blocker(b);
this.getContentElement().add(this.__ukeJN);
var a=this.getChildControl("splitter"),c=a.getWidth();
c||a.addListenerOnce("appear",function(){this.__bHks6U()},this);
a.addListener("resize",function(b){var a=b.getData();
a.hight==0||a.width==0?this.__ukeJN.hide():this.__ukeJN.show()},this)},
_applyOrientation:function(a,c){var e=this.getChildControl("slider"),b=this.getChildControl("splitter"),d,f;
this.__WgT2T=a==="horizontal";
this.__ukeJN||this.__1DmbF(a);
this.__ukeJN.setOrientation(a);
d=this._getLayout();
d&&d.dispose();
f=a==="vertical"?new qx.ui.splitpane.VLayout:new qx.ui.splitpane.HLayout;
this._setLayout(f);
b.removeState(c);
b.addState(a);
b.getChildControl("knob").removeState(c);
b.getChildControl("knob").addState(a);
e.removeState(c);
e.addState(a);
qx.ui.core.queue.Manager.flush();
this.__bHks6U()},
_applyOffset:function(a,b){this.__bHks6U()},
__bHks6U:function(){var d=this.getChildControl("splitter"),b=this.getOffset(),a=d.getBounds(),c=d.getContainerElement().getDomElement(),e,f;
if(this.__WgT2T){if(a&&a.width){e=qx.bom.element.Location.getPosition(c).left;
this.__ukeJN.setWidth(b,a.width);
this.__ukeJN.setLeft(b,e)}}else if(a&&a.height){f=qx.bom.element.Location.getPosition(c).top;
this.__ukeJN.setHeight(b,a.height);
this.__ukeJN.setTop(b,f)}},
add:function(a,b){b==null?this._add(a):this._add(a,{flex:b});
this.__yONi8.push(a)},
remove:function(a){this._remove(a);
qx.lang.Array.remove(this.__yONi8,a)},
getChildren:function(){return this.__yONi8},
_onMouseDown:function(b){if(!b.isLeftPressed())return;
var d=this.getChildControl("splitter"),e=d.getContainerLocation(),f=this.getContentLocation(),c,a;
this.__bbMe49=this.__WgT2T?b.getDocumentLeft()-e.left+f.left:b.getDocumentTop()-e.top+f.top;
c=this.getChildControl("slider"),a=d.getBounds();
c.setUserBounds(a.left,a.top,a.width,a.height);
c.setZIndex(d.getZIndex()+1);
c.show();
this.__bxdvzd=true;
this.__ukeJN.capture();
b.stop()},
_onMouseMove:function(b){this._setLastMousePosition(b.getDocumentLeft(),b.getDocumentTop());
if(this.__bxdvzd){this.__WLqty();
var c=this.getChildControl("slider"),a=this.__Dn1HL;
this.__WgT2T?(c.setDomLeft(a),this.__ukeJN.setStyle("left",(a-this.getOffset())+"px")):(c.setDomTop(a),this.__ukeJN.setStyle("top",(a-this.getOffset())+"px"));
b.stop()}},
_onMouseOut:function(a){this._setLastMousePosition(a.getDocumentLeft(),a.getDocumentTop())},
_onMouseUp:function(a){if(!this.__bxdvzd)return;
this._finalizeSizes();
var b=this.getChildControl("slider");
b.exclude();
this.__bxdvzd=false;
this.releaseCapture();
a.stop()},
_finalizeSizes:function(){var b=this.__Dn1HL,d=this.__t2UEv,e,a,c,g,f;
if(b==null)return;
e=this._getChildren(),a=e[2],c=e[3],g=a.getLayoutProperties().flex,f=c.getLayoutProperties().flex;
g!=0&&f!=0?(a.setLayoutProperties({flex:b}),c.setLayoutProperties({flex:d})):this.__WgT2T?(a.setWidth(b),c.setWidth(d)):(a.setHeight(b),c.setHeight(d))},
__WLqty:function(){if(this.__WgT2T)var e="minWidth",h="width",d="maxWidth",i=this.__JEzQe,g,f,c,j,a,b;
else e="minHeight",h="height",d="maxHeight",i=this.__JEQTh;
g=this._getChildren(),f=g[2].getSizeHint(),c=g[3].getSizeHint(),j=g[2].getBounds()[h]+g[3].getBounds()[h],a=i-this.__bbMe49,b=j-a;
a<f[e]?(b-=f[e]-a,a=f[e]):b<c[e]&&(a-=c[e]-b,b=c[e]);
a>f[d]?(b+=a-f[d],a=f[d]):b>c[d]&&(a+=b-c[d],b=c[d]);
this.__Dn1HL=a;
this.__t2UEv=b},
_isActiveDragSession:function(){return this.__bxdvzd},
_setLastMousePosition:function(a,b){this.__JEzQe=a;
this.__JEQTh=b}},
destruct:function(){this.__yONi8=null}});


// qx.ui.core.scroll.ScrollSlider
//   - size: 361 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.form.Slider, 1x
qx.Class.define("qx.ui.core.scroll.ScrollSlider",{extend:qx.ui.form.Slider,
construct:function(a){this.base(arguments,a);
this.removeListener("keypress",this._onKeyPress);
this.removeListener("mousewheel",this._onMouseWheel)},
members:{getSizeHint:function(b){var a=this.base(arguments);
this.getOrientation()==="horizontal"?a.width=0:a.height=0;
return a}}});


// qx.ui.menu.AbstractButton
//   - size: 2465 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 10x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.ObjectRegistry.inShutDown, 1x
//       qx.ui.basic.Image, 2x
//       qx.ui.basic.Label, 2x
//       qx.ui.core.MExecutable, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.form.IExecutable, 1x
//       qx.ui.menu.ButtonLayout, 1x
qx.Class.define("qx.ui.menu.AbstractButton",{extend:qx.ui.core.Widget,
include:[qx.ui.core.MExecutable],
implement:[qx.ui.form.IExecutable],
type:"abstract",
construct:function(){this.base(arguments);
this._setLayout(new qx.ui.menu.ButtonLayout);
this.addListener("mouseup",this._onMouseUp);
this.addListener("keypress",this._onKeyPress);
this.addListener("changeCommand",this._onChangeCommand,this)},
properties:{blockToolTip:{refine:true,
init:true},
label:{check:"String",
apply:"_applyLabel",
nullable:true},
menu:{check:"qx.ui.menu.Menu",
apply:"_applyMenu",
nullable:true},
icon:{check:"String",
apply:"_applyIcon",
themeable:true,
nullable:true}},
members:{_createChildControlImpl:function(b){var a;
switch(b){case"icon":a=new qx.ui.basic.Image;
a.setAnonymous(true);
this._add(a,{column:0});
break;
case"label":a=new qx.ui.basic.Label;
a.setAnonymous(true);
this._add(a,{column:1});
break;
case"shortcut":a=new qx.ui.basic.Label;
a.setAnonymous(true);
this._add(a,{column:2});
break;
case"arrow":a=new qx.ui.basic.Image;
a.setAnonymous(true);
this._add(a,{column:3});
break}return a||this.base(arguments,b)},
_forwardStates:{selected:1},
getChildrenSizes:function(){var h=0,g=0,f=0,e=0,a,c,d,b;
if(this._isChildControlVisible("icon")){a=this.getChildControl("icon");
h=a.getMarginLeft()+a.getSizeHint().width+a.getMarginRight()}if(this._isChildControlVisible("label")){c=this.getChildControl("label");
g=c.getMarginLeft()+c.getSizeHint().width+c.getMarginRight()}if(this._isChildControlVisible("shortcut")){d=this.getChildControl("shortcut");
f=d.getMarginLeft()+d.getSizeHint().width+d.getMarginRight()}if(this._isChildControlVisible("arrow")){b=this.getChildControl("arrow");
e=b.getMarginLeft()+b.getSizeHint().width+b.getMarginRight()}return[h,g,f,e]},
_onMouseUp:function(a){},
_onKeyPress:function(a){},
_onChangeCommand:function(b){var a=b.getData(),c=a!=null?a.toString():"";
this.getChildControl("shortcut").setValue(c)},
_onChangeLocale:null,
_applyIcon:function(a,b){a?this._showChildControl("icon").setSource(a):this._excludeChildControl("icon")},
_applyLabel:function(a,b){a?this._showChildControl("label").setValue(a):this._excludeChildControl("label")},
_applyMenu:function(a,b){b&&(b.resetOpener(),b.removeState("submenu"));
a?(this._showChildControl("arrow"),a.setOpener(this),a.addState("submenu")):this._excludeChildControl("arrow")}},
destruct:function(){this.getMenu()&&(qx.core.ObjectRegistry.inShutDown||this.getMenu().destroy())}});


// qx.ui.form.HoverButton
//   - size: 1163 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.AcceleratingTimer, 1x
//       qx.ui.basic.Atom, 1x
//       qx.ui.core.MExecutable, 1x
//       qx.ui.form.IExecutable, 1x
qx.Class.define("qx.ui.form.HoverButton",{extend:qx.ui.basic.Atom,
include:[qx.ui.core.MExecutable],
implement:[qx.ui.form.IExecutable],
construct:function(b,a){this.base(arguments,b,a);
this.addListener("mouseover",this._onMouseOver,this);
this.addListener("mouseout",this._onMouseOut,this);
this.__mXur6=new qx.event.AcceleratingTimer();
this.__mXur6.addListener("interval",this._onInterval,this)},
properties:{appearance:{refine:true,
init:"hover-button"},
interval:{check:"Integer",
init:80},
firstInterval:{check:"Integer",
init:200},
minTimer:{check:"Integer",
init:20},
timerDecrease:{check:"Integer",
init:2}},
members:{__mXur6:null,
_onMouseOver:function(a){if(!this.isEnabled()||a.getTarget()!==this)return;
this.__mXur6.set({interval:this.getInterval(),
firstInterval:this.getFirstInterval(),
minimum:this.getMinTimer(),
decrease:this.getTimerDecrease()}).start();
this.addState("hovered")},
_onMouseOut:function(a){this.__mXur6.stop();
this.removeState("hovered");
if(!this.isEnabled()||a.getTarget()!==this)return},
_onInterval:function(){this.isEnabled()?this.execute():this.__mXur6.stop()}},
destruct:function(){this._disposeObjects("__timer")}});


// qx.ui.form.RepeatButton
//   - size: 2654 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.AcceleratingTimer, 1x
//       qx.ui.form.Button, 1x
qx.Class.define("qx.ui.form.RepeatButton",{extend:qx.ui.form.Button,
construct:function(b,a){this.base(arguments,b,a);
this.__mXur6=new qx.event.AcceleratingTimer();
this.__mXur6.addListener("interval",this._onInterval,this)},
events:{execute:"qx.event.type.Event",
press:"qx.event.type.Event",
release:"qx.event.type.Event"},
properties:{interval:{check:"Integer",
init:100},
firstInterval:{check:"Integer",
init:500},
minTimer:{check:"Integer",
init:20},
timerDecrease:{check:"Integer",
init:2}},
members:{__zmCkk:null,
__mXur6:null,
press:function(){this.isEnabled()&&(this.hasState("pressed")||this.__bJoSW7(),this.removeState("abandoned"),this.addState("pressed"))},
release:function(a){if(!this.isEnabled())return;
this.hasState("pressed")&&(this.__zmCkk||this.execute());
this.removeState("pressed");
this.removeState("abandoned");
this.__bAcirv()},
_applyEnabled:function(a,b){this.base(arguments,a,b);
a||(this.removeState("pressed"),this.removeState("abandoned"),this.__bAcirv())},
_onMouseOver:function(a){if(!this.isEnabled()||a.getTarget()!==this)return;
this.hasState("abandoned")&&(this.removeState("abandoned"),this.addState("pressed"),this.__mXur6.start());
this.addState("hovered")},
_onMouseOut:function(a){if(!this.isEnabled()||a.getTarget()!==this)return;
this.removeState("hovered");
this.hasState("pressed")&&(this.removeState("pressed"),this.addState("abandoned"),this.__mXur6.stop())},
_onMouseDown:function(a){if(!a.isLeftPressed())return;
this.capture();
this.__bJoSW7();
a.stopPropagation()},
_onMouseUp:function(a){this.releaseCapture();
this.hasState("abandoned")||(this.addState("hovered"),this.hasState("pressed")&&!this.__zmCkk&&this.execute());
this.__bAcirv();
a.stopPropagation()},
_onKeyUp:function(a){switch(a.getKeyIdentifier()){case"Enter":case"Space":this.hasState("pressed")&&(this.__zmCkk||this.execute(),this.removeState("pressed"),this.removeState("abandoned"),a.stopPropagation(),this.__bAcirv())}},
_onKeyDown:function(a){switch(a.getKeyIdentifier()){case"Enter":case"Space":this.removeState("abandoned"),this.addState("pressed"),a.stopPropagation(),this.__bJoSW7()}},
_onInterval:function(a){this.__zmCkk=true;
this.fireEvent("execute")},
__bJoSW7:function(){this.fireEvent("press");
this.__zmCkk=false;
this.__mXur6.set({interval:this.getInterval(),
firstInterval:this.getFirstInterval(),
minimum:this.getMinTimer(),
decrease:this.getTimerDecrease()}).start();
this.removeState("abandoned");
this.addState("pressed")},
__bAcirv:function(){this.fireEvent("release");
this.__mXur6.stop();
this.removeState("abandoned");
this.removeState("pressed")}},
destruct:function(){this._disposeObjects("__timer")}});


// qx.ui.container.SlideBar
//   - size: 3659 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 14x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.client.Engine.GECKO, 1x
//       qx.event.Timer.once, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.core.MRemoteChildrenHandling, 1x
//       qx.ui.core.MRemoteLayoutHandling, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.scroll.ScrollPane, 1x
//       qx.ui.form.RepeatButton, 2x
//       qx.ui.layout.HBox, 2x
//       qx.ui.layout.VBox, 2x
qx.Class.define("qx.ui.container.SlideBar",{extend:qx.ui.core.Widget,
include:[qx.ui.core.MRemoteChildrenHandling,qx.ui.core.MRemoteLayoutHandling],
construct:function(a){this.base(arguments);
var b=this.getChildControl("scrollpane");
this._add(b,{flex:1});
a!=null?this.setOrientation(a):this.initOrientation();
this.addListener("mousewheel",this._onMouseWheel,this)},
properties:{appearance:{refine:true,
init:"slidebar"},
orientation:{check:["horizontal","vertical"],
init:"horizontal",
apply:"_applyOrientation"},
scrollStep:{check:"Integer",
init:15,
themeable:true}},
members:{getChildrenContainer:function(){return this.getChildControl("content")},
_createChildControlImpl:function(b){var a;
switch(b){case"button-forward":a=new qx.ui.form.RepeatButton;
a.addListener("execute",this._onExecuteForward,this);
a.setFocusable(false);
this._addAt(a,2);
break;
case"button-backward":a=new qx.ui.form.RepeatButton;
a.addListener("execute",this._onExecuteBackward,this);
a.setFocusable(false);
this._addAt(a,0);
break;
case"content":a=new qx.ui.container.Composite();
qx.bom.client.Engine.GECKO&&a.addListener("removeChildWidget",this._onRemoveChild,this);
this.getChildControl("scrollpane").add(a);
break;
case"scrollpane":a=new qx.ui.core.scroll.ScrollPane();
a.addListener("update",this._onResize,this);
a.addListener("scrollX",this._onScroll,this);
a.addListener("scrollY",this._onScroll,this);
break}return a||this.base(arguments,b)},
_forwardStates:{barLeft:true,
barTop:true,
barRight:true,
barBottom:true},
scrollBy:function(a){var b=this.getChildControl("scrollpane");
this.getOrientation()==="horizontal"?b.scrollByX(a):b.scrollByY(a)},
scrollTo:function(a){var b=this.getChildControl("scrollpane");
this.getOrientation()==="horizontal"?b.scrollToX(a):b.scrollToY(a)},
_applyOrientation:function(e,d){var b=[this.getLayout(),this._getLayout()],a=this.getChildControl("button-forward"),c=this.getChildControl("button-backward");
d=="vertical"?(a.removeState("vertical"),c.removeState("vertical"),a.addState("horizontal"),c.addState("horizontal")):d=="horizontal"&&(a.removeState("horizontal"),c.removeState("horizontal"),a.addState("vertical"),c.addState("vertical"));
e=="horizontal"?(this._setLayout(new qx.ui.layout.HBox()),this.setLayout(new qx.ui.layout.HBox())):(this._setLayout(new qx.ui.layout.VBox()),this.setLayout(new qx.ui.layout.VBox()));
b[0]&&b[0].dispose();
b[1]&&b[1].dispose()},
_onMouseWheel:function(a){this.scrollBy(a.getWheelDelta()*this.getScrollStep());
a.stop()},
_onScroll:function(){this._updateArrowsEnabled()},
_onResize:function(e){var c=this.getChildControl("scrollpane").getChildren()[0],b,a,d;
if(!c)return;
b=this.getInnerSize(),a=c.getBounds(),d=this.getOrientation()==="horizontal"?a.width>b.width:a.height>b.height;
d?(this._showArrows(),this._updateArrowsEnabled()):this._hideArrows()},
_onExecuteBackward:function(){this.scrollBy(-this.getScrollStep())},
_onExecuteForward:function(){this.scrollBy(this.getScrollStep())},
_onRemoveChild:function(){qx.event.Timer.once(function(){this.scrollBy(this.getChildControl("scrollpane").getScrollX())},this,50)},
_updateArrowsEnabled:function(){var a=this.getChildControl("scrollpane"),b,c;
if(this.getOrientation()==="horizontal"){b=a.getScrollX(),c=a.getScrollMaxX()}else{b=a.getScrollY(),c=a.getScrollMaxY()}this.getChildControl("button-backward").setEnabled(b>0);
this.getChildControl("button-forward").setEnabled(b<c)},
_showArrows:function(){this._showChildControl("button-forward");
this._showChildControl("button-backward")},
_hideArrows:function(){this._excludeChildControl("button-forward");
this._excludeChildControl("button-backward");
this.scrollTo(0)}}});


// qx.ui.menu.MenuSlideBar
//   - size: 557 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.container.SlideBar, 1x
//       qx.ui.form.HoverButton, 2x
qx.Class.define("qx.ui.menu.MenuSlideBar",{extend:qx.ui.container.SlideBar,
construct:function(){this.base(arguments,"vertical")},
properties:{appearance:{refine:true,
init:"menu-slidebar"}},
members:{_createChildControlImpl:function(b){var a;
switch(b){case"button-forward":a=new qx.ui.form.HoverButton();
a.addListener("execute",this._onExecuteForward,this);
this._addAt(a,2);
break;
case"button-backward":a=new qx.ui.form.HoverButton();
a.addListener("execute",this._onExecuteBackward,this);
this._addAt(a,0);
break}return a||this.base(arguments,b)}}});


// qx.ui.menu.Menu
//   - size: 6769 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       qx, 21x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.ObjectRegistry.inShutDown, 1x
//       qx.lang.Array.clone, 1x
//       qx.ui.core.Blocker, 1x
//       qx.ui.core.MPlacement, 1x
//       qx.ui.core.MRemoteChildrenHandling, 1x
//       qx.ui.core.Widget, 2x
//       qx.ui.core.Widget.contains, 1x
//       qx.ui.core.queue.Widget.add, 1x
//       qx.ui.layout.Grow, 1x
//       qx.ui.menu.AbstractButton, 2x
//       qx.ui.menu.Layout, 1x
//       qx.ui.menu.Manager.getInstance, 4x
//       qx.ui.menu.Menu, 1x
//       qx.ui.menu.MenuSlideBar, 1x
//       qx.ui.menu.Separator, 1x
qx.Class.define("qx.ui.menu.Menu",{extend:qx.ui.core.Widget,
include:[qx.ui.core.MPlacement,qx.ui.core.MRemoteChildrenHandling],
construct:function(){this.base(arguments);
this._setLayout(new qx.ui.menu.Layout);
var a=this.getApplicationRoot();
a.add(this);
this.addListener("mouseover",this._onMouseOver);
this.addListener("mouseout",this._onMouseOut);
this.addListener("resize",this._onResize,this);
a.addListener("resize",this._onResize,this);
this._blocker=new qx.ui.core.Blocker(a);
this.initVisibility();
this.initKeepFocus();
this.initKeepActive()},
properties:{appearance:{refine:true,
init:"menu"},
allowGrowX:{refine:true,
init:false},
allowGrowY:{refine:true,
init:false},
visibility:{refine:true,
init:"excluded"},
keepFocus:{refine:true,
init:true},
keepActive:{refine:true,
init:true},
spacingX:{check:"Integer",
apply:"_applySpacingX",
init:0,
themeable:true},
spacingY:{check:"Integer",
apply:"_applySpacingY",
init:0,
themeable:true},
iconColumnWidth:{check:"Integer",
init:0,
themeable:true,
apply:"_applyIconColumnWidth"},
arrowColumnWidth:{check:"Integer",
init:0,
themeable:true,
apply:"_applyArrowColumnWidth"},
blockerColor:{check:"Color",
init:null,
nullable:true,
apply:"_applyBlockerColor",
themeable:true},
blockerOpacity:{check:"Number",
init:1,
apply:"_applyBlockerOpacity",
themeable:true},
selectedButton:{check:"qx.ui.core.Widget",
nullable:true,
apply:"_applySelectedButton"},
openedButton:{check:"qx.ui.core.Widget",
nullable:true,
apply:"_applyOpenedButton"},
opener:{check:"qx.ui.core.Widget",
nullable:true},
openInterval:{check:"Integer",
themeable:true,
init:250,
apply:"_applyOpenInterval"},
closeInterval:{check:"Integer",
themeable:true,
init:250,
apply:"_applyCloseInterval"},
blockBackground:{check:"Boolean",
themeable:true,
init:false}},
members:{__2zVBK:null,
__bEaGfN:null,
_blocker:null,
open:function(){this.getOpener()!=null?(this.placeToWidget(this.getOpener()),this.__9AWZU(),this.show(),this._placementTarget=this.getOpener()):this.warn("The menu instance needs a configured 'opener' widget!")},
openAtMouse:function(a){this.placeToMouse(a);
this.__9AWZU();
this.show();
this._placementTarget={left:a.getDocumentLeft(),
top:a.getDocumentTop()}},
openAtPoint:function(a){this.placeToPoint(a);
this.__9AWZU();
this.show();
this._placementTarget=a},
addSeparator:function(){this.add(new qx.ui.menu.Separator)},
getColumnSizes:function(){return this._getMenuLayout().getColumnSizes()},
getSelectables:function(){for(var c=[],b=this.getChildren(),a=0;
a<b.length;
a++)b[a].isEnabled()&&c.push(b[a]);
return c},
_applyIconColumnWidth:function(a,b){this._getMenuLayout().setIconColumnWidth(a)},
_applyArrowColumnWidth:function(a,b){this._getMenuLayout().setArrowColumnWidth(a)},
_applySpacingX:function(a,b){this._getMenuLayout().setColumnSpacing(a)},
_applySpacingY:function(a,b){this._getMenuLayout().setSpacing(a)},
_applyVisibility:function(b,c){this.base(arguments,b,c);
var d=qx.ui.menu.Manager.getInstance(),a;
if(b==="visible"){d.add(this);
a=this.getParentMenu();
a&&a.setOpenedButton(this.getOpener())}else if(c==="visible"){d.remove(this);
a=this.getParentMenu();
a&&a.getOpenedButton()==this.getOpener()&&a.resetOpenedButton();
this.resetOpenedButton();
this.resetSelectedButton()}this.__cxYMPg()},
__cxYMPg:function(){if(this.isVisible()){if(this.getBlockBackground()){var a=this.getZIndex();
this._blocker.blockContent(a-1)}}else this._blocker.isContentBlocked()&&this._blocker.unblockContent()},
getParentMenu:function(){var a=this.getOpener();
if(!a||!(a instanceof qx.ui.menu.AbstractButton))return null;
while(a&&!(a instanceof qx.ui.menu.Menu))a=a.getLayoutParent();
return a},
_applySelectedButton:function(a,b){b&&b.removeState("selected");
a&&a.addState("selected")},
_applyOpenedButton:function(a,b){b&&b.getMenu().exclude();
a&&a.getMenu().open()},
_applyBlockerColor:function(a,b){this._blocker.setColor(a)},
_applyBlockerOpacity:function(a,b){this._blocker.setOpacity(a)},
getChildrenContainer:function(){return this.getChildControl("slidebar",true)||this},
_createChildControlImpl:function(d){var a,e,f,c,b;
switch(d){case"slidebar":a=new qx.ui.menu.MenuSlideBar(),e=this._getLayout();
this._setLayout(new qx.ui.layout.Grow());
f=a.getLayout();
a.setLayout(e);
f.dispose();
c=qx.lang.Array.clone(this.getChildren()),b=0;
for(;
b<c.length;
b++)a.add(c[b]);
this.removeListener("resize",this._onResize,this);
a.getChildrenContainer().addListener("resize",this._onResize,this);
this._add(a);
break}return a||this.base(arguments,d)},
_getMenuLayout:function(){return this.hasChildControl("slidebar")?this.getChildControl("slidebar").getChildrenContainer().getLayout():this._getLayout()},
_getMenuBounds:function(){return this.hasChildControl("slidebar")?this.getChildControl("slidebar").getChildrenContainer().getBounds():this.getBounds()},
_computePlacementSize:function(){return this._getMenuBounds()},
__9AWZU:function(){var b=this._getMenuBounds(),c,a,d;
if(!b){this.addListenerOnce("resize",this.__9AWZU,this);
return}c=this.getLayoutParent().getBounds().height,a=this.getLayoutProperties().top,d=this.getLayoutProperties().left;
a<0?this._assertSlideBar(function(){this.setHeight(b.height+a);
this.moveTo(d,0)}):a+b.height>c?this._assertSlideBar(function(){this.setHeight(c-a)}):this.setHeight(null)},
_assertSlideBar:function(a){if(this.hasChildControl("slidebar"))return a.call(this);
this.__bEaGfN=a;
qx.ui.core.queue.Widget.add(this)},
syncWidget:function(){this.getChildControl("slidebar");
this.__bEaGfN&&(this.__bEaGfN.call(this),delete this.__bEaGfN)},
_onResize:function(){if(this.isVisible()){var a=this._placementTarget;
if(!a)return;
if(a instanceof qx.ui.core.Widget)this.placeToWidget(a);
else if(a.top!==undefined)this.placeToPoint(a);
else throw new Error("Unknown target: "+a);
this.__9AWZU()}},
_onMouseOver:function(e){var b=qx.ui.menu.Manager.getInstance(),a,c,d;
b.cancelClose(this);
a=e.getTarget();
if(a.isEnabled()&&a instanceof qx.ui.menu.AbstractButton){this.setSelectedButton(a);
c=a.getMenu&&a.getMenu();
if(c)c.setOpener(a),b.scheduleOpen(c),this.__2zVBK=c;
else{d=this.getOpenedButton();
d&&b.scheduleClose(d.getMenu());
this.__2zVBK&&(b.cancelOpen(this.__2zVBK),this.__2zVBK=null)}}else this.getOpenedButton()||this.resetSelectedButton()},
_onMouseOut:function(c){var b=qx.ui.menu.Manager.getInstance(),a;
if(!qx.ui.core.Widget.contains(this,c.getRelatedTarget())){a=this.getOpenedButton();
a?this.setSelectedButton(a):this.resetSelectedButton();
a&&b.cancelClose(a.getMenu());
this.__2zVBK&&b.cancelOpen(this.__2zVBK)}}},
destruct:function(){qx.core.ObjectRegistry.inShutDown||qx.ui.menu.Manager.getInstance().remove(this);
this.getApplicationRoot().removeListener("resize",this._onResize,this);
this._placementTarget=null;
this._disposeObjects("_blocker")}});


// qx.ui.menu.Button
//   - size: 473 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.menu.AbstractButton, 1x
//       qx.ui.menu.Manager.getInstance, 1x
qx.Class.define("qx.ui.menu.Button",{extend:qx.ui.menu.AbstractButton,
construct:function(c,a,b,d){this.base(arguments);
c!=null&&this.setLabel(c);
a!=null&&this.setIcon(a);
b!=null&&this.setCommand(b);
d!=null&&this.setMenu(d)},
properties:{appearance:{refine:true,
init:"menu-button"}},
members:{_onMouseUp:function(a){if(a.isLeftPressed()){this.execute();
if(this.getMenu())return}qx.ui.menu.Manager.getInstance().hideAll()},
_onKeyPress:function(a){this.execute()}}});


// qx.ui.menu.Manager
//   - size: 5830 bytes
//   - modified: 2010-11-02T15:46:11
//   - names:
//       Error, 2x
//       document, 2x
//       qx, 20x
//       window, 4x
//   - packages:
//       document.body, 2x
//       qx.Class.define, 1x
//       qx.bom.client.Feature.TOUCH, 1x
//       qx.core.Object, 1x
//       qx.event.Registration, 2x
//       qx.event.Registration.addListener, 1x
//       qx.event.Timer, 2x
//       qx.lang.Array.remove, 1x
//       qx.ui.core.Widget.getWidgetByElement, 1x
//       qx.ui.menu.AbstractButton, 2x
//       qx.ui.menu.Button, 1x
//       qx.ui.menu.Menu, 4x
//       qx.ui.menubar.Button, 3x
//       window.document.documentElement, 2x
qx.Class.define("qx.ui.menu.Manager",{type:"singleton",
extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__up0LB=[];
var b=document.body,a=qx.event.Registration;
a.addListener(window.document.documentElement,"mousedown",this._onMouseDown,this,true);
a.addListener(b,"keydown",this._onKeyUpDown,this,true);
a.addListener(b,"keyup",this._onKeyUpDown,this,true);
a.addListener(b,"keypress",this._onKeyPress,this,true);
qx.bom.client.Feature.TOUCH||qx.event.Registration.addListener(window,"blur",this.hideAll,this);
this.__D6zDi=new qx.event.Timer;
this.__D6zDi.addListener("interval",this._onOpenInterval,this);
this.__JnNRi=new qx.event.Timer;
this.__JnNRi.addListener("interval",this._onCloseInterval,this)},
members:{__VLysA:null,
__2qQZG:null,
__D6zDi:null,
__JnNRi:null,
__up0LB:null,
_getChild:function(h,e,f,g){for(var c=h.getChildren(),d=c.length,b,a=e;
a<d&&a>=0;
a+=f){b=c[a];
if(b.isEnabled()&&!b.isAnonymous())return b}if(g){a=a==d?0:d-1;
for(;
a!=e;
a+=f){b=c[a];
if(b.isEnabled()&&!b.isAnonymous())return b}}return null},
_isInMenu:function(a){while(a){if(a instanceof qx.ui.menu.Menu)return true;
a=a.getLayoutParent()}return false},
_getMenuButton:function(a){while(a){if(a instanceof qx.ui.menu.AbstractButton)return a;
a=a.getLayoutParent()}return null},
add:function(a){if(!(a instanceof qx.ui.menu.Menu))throw new Error("Object is no menu: "+a);
var b=this.__up0LB;
b.push(a);
a.setZIndex(1e6+b.length)},
remove:function(a){if(!(a instanceof qx.ui.menu.Menu))throw new Error("Object is no menu: "+a);
var b=this.__up0LB;
b&&qx.lang.Array.remove(b,a)},
hideAll:function(){var a=this.__up0LB,b;
if(a)for(b=a.length-1;
b>=0;
b--)a[b].exclude()},
getActiveMenu:function(){var a=this.__up0LB;
return a.length>0?a[a.length-1]:null},
scheduleOpen:function(a){this.cancelClose(a);
a.isVisible()?this.__VLysA&&this.cancelOpen(this.__VLysA):this.__VLysA!=a&&(this.__VLysA=a,this.__D6zDi.restartWith(a.getOpenInterval()))},
scheduleClose:function(a){this.cancelOpen(a);
a.isVisible()?this.__2qQZG!=a&&(this.__2qQZG=a,this.__JnNRi.restartWith(a.getCloseInterval())):this.__2qQZG&&this.cancelClose(this.__2qQZG)},
cancelOpen:function(a){this.__VLysA==a&&(this.__D6zDi.stop(),this.__VLysA=null)},
cancelClose:function(a){this.__2qQZG==a&&(this.__JnNRi.stop(),this.__2qQZG=null)},
_onOpenInterval:function(a){this.__D6zDi.stop();
this.__VLysA.open();
this.__VLysA=null},
_onCloseInterval:function(a){this.__JnNRi.stop();
this.__2qQZG.exclude();
this.__2qQZG=null},
_onMouseDown:function(b){var a=b.getTarget();
a=qx.ui.core.Widget.getWidgetByElement(a,true);
if(a==null){this.hideAll();
return}if(a.getMenu&&a.getMenu()&&a.getMenu().isVisible())return;
this.__up0LB.length>0&&!this._isInMenu(a)&&this.hideAll()},
__3bkgD:{Enter:1,
Space:1},
__baAxYd:{Escape:1,
Up:1,
Down:1,
Left:1,
Right:1},
_onKeyUpDown:function(a){var c=this.getActiveMenu(),b;
if(!c)return;
b=a.getKeyIdentifier();
(this.__baAxYd[b]||this.__3bkgD[b]&&c.getSelectedButton())&&a.stopPropagation()},
_onKeyPress:function(b){var a=this.getActiveMenu(),c,e,f,d;
if(!a)return;
c=b.getKeyIdentifier(),e=this.__baAxYd[c],f=this.__3bkgD[c];
if(e){switch(c){case"Up":this._onKeyPressUp(a);
break;
case"Down":this._onKeyPressDown(a);
break;
case"Left":this._onKeyPressLeft(a);
break;
case"Right":this._onKeyPressRight(a);
break;
case"Escape":this.hideAll();
break}b.stopPropagation();
b.preventDefault()}else if(f){d=a.getSelectedButton();
if(d){switch(c){case"Enter":this._onKeyPressEnter(a,d,b);
break;
case"Space":this._onKeyPressSpace(a,d,b);
break}b.stopPropagation();
b.preventDefault()}}},
_onKeyPressUp:function(a){var b=a.getSelectedButton(),d=a.getChildren(),e=b?a.indexOf(b)-1:d.length-1,c=this._getChild(a,e,-1,true);
c?a.setSelectedButton(c):a.resetSelectedButton()},
_onKeyPressDown:function(a){var b=a.getSelectedButton(),d=b?a.indexOf(b)+1:0,c=this._getChild(a,d,1,true);
c?a.setSelectedButton(c):a.resetSelectedButton()},
_onKeyPressLeft:function(i){var a=i.getOpener(),g,d,h,b,c,e,f;
if(!a)return;
if(a instanceof qx.ui.menu.AbstractButton){g=a.getLayoutParent();
g.resetOpenedButton();
g.setSelectedButton(a)}else if(a instanceof qx.ui.menubar.Button){d=a.getMenuBar().getMenuButtons(),h=d.indexOf(a);
if(h===-1)return;
b=null,c=d.length,e=1;
for(;
e<=c;
e++){f=d[(h-e+c)%c];
if(f.isEnabled()){b=f;
break}}b&&b!=a&&b.open(true)}},
_onKeyPressRight:function(b){var e=b.getSelectedButton(),h,c,a,f,k,d,i,g,j;
if(e){h=e.getMenu();
if(h){b.setOpenedButton(e);
c=this._getChild(h,0,1);
c&&h.setSelectedButton(c);
return}}else if(!b.getOpenedButton()){c=this._getChild(b,0,1);
if(c){b.setSelectedButton(c);
c.getMenu()&&b.setOpenedButton(c);
return}}a=b.getOpener();
if(a instanceof qx.ui.menu.Button&&e){while(a){a=a.getLayoutParent();
if(a instanceof qx.ui.menu.Menu){a=a.getOpener();
if(a instanceof qx.ui.menubar.Button)break}else break}if(!a)return}if(a instanceof qx.ui.menubar.Button){f=a.getMenuBar().getMenuButtons(),k=f.indexOf(a);
if(k===-1)return;
d=null,i=f.length,g=1;
for(;
g<=i;
g++){j=f[(k+g)%i];
if(j.isEnabled()){d=j;
break}}d&&d!=a&&d.open(true)}},
_onKeyPressEnter:function(d,b,c){if(b.hasListener("keypress")){var a=c.clone();
a.setBubbles(false);
a.setTarget(b);
b.dispatchEvent(a)}this.hideAll()},
_onKeyPressSpace:function(d,b,c){if(b.hasListener("keypress")){var a=c.clone();
a.setBubbles(false);
a.setTarget(b);
b.dispatchEvent(a)}}},
destruct:function(){var a=qx.event.Registration,b=document.body;
a.removeListener(window,"blur",this.hideAll,this);
a.removeListener(window.document.documentElement,"mousedown",this._onMouseDown,this,true);
a.removeListener(b,"keydown",this._onKeyUpDown,this,true);
a.removeListener(b,"keyup",this._onKeyUpDown,this,true);
a.removeListener(b,"keypress",this._onKeyPress,this,true);
this._disposeObjects("__openTimer","__closeTimer");
this._disposeArray("__objects")}});


// qx.ui.form.MenuButton
//   - size: 1422 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.ObjectRegistry.inShutDown, 1x
//       qx.ui.form.Button, 1x
//       qx.ui.menu.Manager.getInstance, 1x
qx.Class.define("qx.ui.form.MenuButton",{extend:qx.ui.form.Button,
construct:function(c,b,a){this.base(arguments,c,b);
a!=null&&this.setMenu(a)},
properties:{menu:{check:"qx.ui.menu.Menu",
nullable:true,
apply:"_applyMenu",
event:"changeMenu"}},
members:{_applyMenu:function(a,b){b&&(b.removeListener("changeVisibility",this._onMenuChange,this),b.resetOpener());
a&&(a.addListener("changeVisibility",this._onMenuChange,this),a.setOpener(this),a.removeState("submenu"),a.removeState("contextmenu"))},
open:function(c){var a=this.getMenu(),b;
if(a){qx.ui.menu.Manager.getInstance().hideAll();
a.setOpener(this);
a.open();
if(c){b=a.getSelectables()[0];
b&&a.setSelectedButton(b)}}},
_onMenuChange:function(b){var a=this.getMenu();
a.isVisible()?this.addState("pressed"):this.removeState("pressed")},
_onMouseDown:function(b){var a=this.getMenu();
a&&(a.isVisible()?a.exclude():this.open(),b.stopPropagation())},
_onMouseUp:function(a){this.base(arguments,a);
a.stopPropagation()},
_onMouseOver:function(a){this.addState("hovered")},
_onMouseOut:function(a){this.removeState("hovered")},
_onKeyDown:function(b){switch(b.getKeyIdentifier()){case"Enter":this.removeState("abandoned");
this.addState("pressed");
var a=this.getMenu();
a&&(a.isVisible()?a.exclude():this.open());
b.stopPropagation()}},
_onKeyUp:function(a){}},
destruct:function(){this.getMenu()&&(qx.core.ObjectRegistry.inShutDown||this.getMenu().destroy())}});


// qx.ui.menubar.Button
//   - size: 1162 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.form.MenuButton, 1x
//       qx.ui.menu.Manager.getInstance, 1x
//       qx.ui.toolbar.ToolBar, 1x
qx.Class.define("qx.ui.menubar.Button",{extend:qx.ui.form.MenuButton,
construct:function(b,a,c){this.base(arguments,b,a,c);
this.removeListener("keydown",this._onKeyDown);
this.removeListener("keyup",this._onKeyUp)},
properties:{appearance:{refine:true,
init:"menubar-button"},
focusable:{refine:true,
init:false}},
members:{getMenuBar:function(){var a=this;
while(a){if(a instanceof qx.ui.toolbar.ToolBar)return a;
a=a.getLayoutParent()}return null},
open:function(b){this.base(arguments,b);
var a=this.getMenuBar();
a._setAllowMenuOpenHover(true)},
_onMenuChange:function(c){var b=this.getMenu(),a=this.getMenuBar();
b.isVisible()?(this.addState("pressed"),a&&a.setOpenMenu(b)):(this.removeState("pressed"),a&&a.getOpenMenu()==b&&(a.resetOpenMenu(),a._setAllowMenuOpenHover(false)))},
_onMouseUp:function(b){this.base(arguments,b);
var a=this.getMenu();
a&&a.isVisible()&&!this.hasState("pressed")&&this.addState("pressed")},
_onMouseOver:function(b){this.addState("hovered");
if(this.getMenu()){var a=this.getMenuBar();
a._isAllowMenuOpenHover()&&(qx.ui.menu.Manager.getInstance().hideAll(),a._setAllowMenuOpenHover(true),this.isEnabled()&&this.open())}}}});


// qx.ui.toolbar.Part
//   - size: 1129 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 8x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Image, 1x
//       qx.ui.core.MRemoteChildrenHandling, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.menubar.Button, 1x
//       qx.ui.toolbar.PartContainer, 1x
//       qx.ui.toolbar.Separator, 1x
qx.Class.define("qx.ui.toolbar.Part",{extend:qx.ui.core.Widget,
include:[qx.ui.core.MRemoteChildrenHandling],
construct:function(){this.base(arguments);
this._setLayout(new qx.ui.layout.HBox);
this._createChildControl("handle")},
properties:{appearance:{refine:true,
init:"toolbar/part"},
show:{init:"both",
check:["both","label","icon"],
inheritable:true,
event:"changeShow"},
spacing:{nullable:true,
check:"Integer",
themeable:true,
apply:"_applySpacing"}},
members:{_createChildControlImpl:function(b){var a;
switch(b){case"handle":a=new qx.ui.basic.Image();
a.setAlignY("middle");
this._add(a);
break;
case"container":a=new qx.ui.toolbar.PartContainer;
this._add(a);
break}return a||this.base(arguments,b)},
getChildrenContainer:function(){return this.getChildControl("container")},
_applySpacing:function(a,c){var b=this.getChildControl("container").getLayout();
a==null?b.resetSpacing():b.setSpacing(a)},
addSeparator:function(){this.add(new qx.ui.toolbar.Separator)},
getMenuButtons:function(){for(var c=this.getChildren(),d=[],a,b=0,e=c.length;
b<e;
b++)a=c[b],a instanceof qx.ui.menubar.Button&&d.push(a);
return d}}});


// qx.ui.toolbar.ToolBar
//   - size: 3805 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       Error, 2x
//       qx, 8x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.MChildrenHandling, 1x
//       qx.ui.core.Spacer, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.menubar.Button, 1x
//       qx.ui.toolbar.Part, 1x
//       qx.ui.toolbar.Separator, 1x
qx.Class.define("qx.ui.toolbar.ToolBar",{extend:qx.ui.core.Widget,
include:qx.ui.core.MChildrenHandling,
construct:function(){this.base(arguments);
this._setLayout(new qx.ui.layout.HBox());
this.__WliO7=[];
this.__bbixNX=[]},
properties:{appearance:{refine:true,
init:"toolbar"},
openMenu:{check:"qx.ui.menu.Menu",
event:"changeOpenMenu",
nullable:true},
show:{init:"both",
check:["both","label","icon"],
inheritable:true,
event:"changeShow"},
spacing:{nullable:true,
check:"Integer",
themeable:true,
apply:"_applySpacing"},
overflowIndicator:{check:"qx.ui.core.Widget",
nullable:true,
apply:"_applyOverflowIndicator"},
overflowHandling:{init:false,
check:"Boolean",
apply:"_applyOverflowHandling"}},
events:{hideItem:"qx.event.type.Data",
showItem:"qx.event.type.Data"},
members:{__WliO7:null,
__bbixNX:null,
_computeSizeHint:function(){var a=this.base(arguments),c,b;
if(true&&this.getOverflowHandling()){c=0,b=this.getOverflowIndicator();
b&&(c=b.getSizeHint().width+this.getSpacing());
a.minWidth=c}return a},
_onResize:function(a){this._recalculateOverflow(a.getData().width)},
_recalculateOverflow:function(c){if(!this.getOverflowHandling())return;
var a=this.getSizeHint().width,b=this.getOverflowIndicator(),g=0,e,h,i,d,f;
b&&(g=b.getSizeHint().width);
if(c<a)do{e=this._getNextToHide();
if(!e)return;
h=e.getMarginLeft()+e.getMarginRight(),i=e.getSizeHint().width+h;
this.__CRiSn(e);
a-=i;
b&&b.getVisibility()!="visible"&&(b.setVisibility("visible"),a+=g)}while(a>c);
else do{d=this.__WliO7[0];
if(d){h=d.getMarginLeft()+d.getMarginRight(),f=d.getSizeHint().width+h;
if(c>a+f+this.getSpacing()||this.__WliO7.length==1&&c>a+f-g+this.getSpacing())this.__D5cnU(d),c+=f,b&&this.__WliO7.length==0&&b.setVisibility("excluded");
else return}}while(c>=a&&this.__WliO7.length>0)},
__D5cnU:function(a){a.setVisibility("visible");
this.__WliO7.shift();
this.fireDataEvent("showItem",a)},
__CRiSn:function(a){if(!a)return;
this.__WliO7.unshift(a);
a.setVisibility("excluded");
this.fireDataEvent("hideItem",a)},
_getNextToHide:function(){for(var a=this.__bbixNX.length-1,c,d,b;
a>=0;
a--){c=this.__bbixNX[a];
if(c&&c.getVisibility&&c.getVisibility()=="visible")return c}d=this._getChildren(),a=d.length-1;
for(;
a>=0;
a--){b=d[a];
if(b==this.getOverflowIndicator())continue;
if(b.getVisibility&&b.getVisibility()=="visible")return b}},
setRemovePriority:function(c,a,b){if(!b&&this.__bbixNX[a]!=undefined)throw new Error("Priority already in use!");
this.__bbixNX[a]=c},
_applyOverflowHandling:function(e,f){this.invalidateLayoutCache();
var c=this.getLayoutParent(),a,d,b;
c&&c.invalidateLayoutCache();
a=this.getBounds();
a&&a.width&&this._recalculateOverflow(a.width);
if(e)this.addListener("resize",this._onResize,this);
else{this.removeListener("resize",this._onResize,this);
d=this.getOverflowIndicator();
d&&d.setVisibility("excluded");
for(b=0;
b<this.__WliO7.length;
b++)this.__WliO7[b].setVisibility("visible");
this.__WliO7=[]}},
_applyOverflowIndicator:function(a,b){b&&this._remove(b);
if(a){if(this._indexOf(a)==-1)throw new Error("Widget must be child of the toolbar.");
a.setVisibility("excluded")}},
__bG6IET:false,
_setAllowMenuOpenHover:function(a){this.__bG6IET=a},
_isAllowMenuOpenHover:function(){return this.__bG6IET},
_applySpacing:function(a,c){var b=this._getLayout();
a==null?b.resetSpacing():b.setSpacing(a)},
addSpacer:function(){var a=new qx.ui.core.Spacer;
this._add(a,{flex:1});
return a},
addSeparator:function(){this.add(new qx.ui.toolbar.Separator)},
getMenuButtons:function(){for(var d=this.getChildren(),b=[],a,c=0,e=d.length;
c<e;
c++)a=d[c],a instanceof qx.ui.menubar.Button?b.push(a):a instanceof qx.ui.toolbar.Part&&b.push.apply(b,a.getMenuButtons());
return b}},
destruct:function(){this.hasListener("resize")&&this.removeListener("resize",this._onResize,this)}});


// qx.ui.menu.ButtonLayout
//   - size: 1094 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Math, 1x
//       qx, 5x
//   - packages:
//       Math.max, 1x
//       qx.Class.define, 1x
//       qx.lang.Array.sum, 1x
//       qx.ui.layout.Abstract, 1x
//       qx.ui.layout.Util, 1x
//       qx.ui.menu.Menu, 1x
qx.Class.define("qx.ui.menu.ButtonLayout",{extend:qx.ui.layout.Abstract,
members:{verifyLayoutProperty:function(c,a,b){this.assert(a=="column","The property '"+a+"' is not supported by the MenuButton layout!")},
renderLayout:function(l,p){for(var e=this._getLayoutChildren(),a,j,n=[],b=0,h=e.length,i,c,m,k,f,q,g,d,o;
b<h;
b++)a=e[b],j=a.getLayoutProperties().column,n[j]=a;
i=this.__t1Osq(e[0]),c=i.getColumnSizes(),m=i.getSpacingX(),k=qx.lang.Array.sum(c)+m*(c.length-1);
k<l&&(c[1]+=l-k);
f=0,q=0,g=qx.ui.layout.Util,b=0,h=c.length;
for(;
b<h;
b++){a=n[b];
if(a){d=a.getSizeHint(),q=g.computeVerticalAlignOffset(a.getAlignY()||"middle",d.height,p,0,0),o=g.computeHorizontalAlignOffset(a.getAlignX()||"left",d.width,c[b],a.getMarginLeft(),a.getMarginRight());
a.renderLayout(f+o,q,d.width,d.height)}f+=c[b]+m}},
__t1Osq:function(a){while(!(a instanceof qx.ui.menu.Menu))a=a.getLayoutParent();
return a},
_computeSizeHint:function(){for(var c=this._getLayoutChildren(),a=0,d=0,b=0,f=c.length,e;
b<f;
b++){e=c[b].getSizeHint();
d+=e.width;
a=Math.max(a,e.height)}return{width:d,
height:a}}}});


// qx.ui.form.AbstractField
//   - size: 6498 bytes
//   - modified: 2010-09-30T14:22:22
//   - names:
//       Error, 1x
//       Infinity, 1x
//       qx, 15x
//   - packages:
//       qx.Class.define, 1x
//       qx.bom.Font.getDefaultStyles, 1x
//       qx.bom.Label.getTextSize, 1x
//       qx.bom.client.Feature.PLACEHOLDER, 1x
//       qx.event.type.Data, 1x
//       qx.html.Input, 1x
//       qx.html.Label, 1x
//       qx.lang.Type.isString, 1x
//       qx.theme.manager.Color.getInstance, 1x
//       qx.theme.manager.Font.getInstance, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.queue.Layout.add, 1x
//       qx.ui.form.IForm, 1x
//       qx.ui.form.IStringForm, 1x
//       qx.ui.form.MForm, 1x
qx.Class.define("qx.ui.form.AbstractField",{extend:qx.ui.core.Widget,
implement:[qx.ui.form.IStringForm,qx.ui.form.IForm],
include:[qx.ui.form.MForm],
type:"abstract",
construct:function(a){this.base(arguments);
this.__bpmvVs=!qx.bom.client.Feature.PLACEHOLDER;
a!=null&&this.setValue(a);
this.getContentElement().addListener("change",this._onChangeContent,this)},
events:{input:"qx.event.type.Data",
changeValue:"qx.event.type.Data"},
properties:{textAlign:{check:["left","center","right"],
nullable:true,
themeable:true,
apply:"_applyTextAlign"},
readOnly:{check:"Boolean",
apply:"_applyReadOnly",
init:false},
selectable:{refine:true,
init:true},
focusable:{refine:true,
init:true},
maxLength:{check:"PositiveInteger",
init:Infinity},
liveUpdate:{check:"Boolean",
init:false},
placeholder:{check:"String",
nullable:true,
apply:"_applyPlaceholder"},
filter:{check:"RegExp",
nullable:true,
init:null}},
members:{__EnCFn:true,
__PpeiQ:null,
__yItbb:null,
__2lC4d:null,
__bpmvVs:true,
getFocusElement:function(){var a=this.getContentElement();
if(a)return a},
_createInputElement:function(){return new qx.html.Input("text")},
renderLayout:function(k,l,i,j){var f=this._updateInsets,e=this.base(arguments,k,l,i,j),h,c,b,d,a,g;
if(!e)return;
h=e.size||f,c="px";
if(h||e.local||e.margin){b=this.getInsets(),d=i-b.left-b.right,a=j-b.top-b.bottom;
d=d<0?0:d;
a=a<0?0:a}g=this.getContentElement();
f&&this.__bpmvVs&&this.__b9w5bk().setStyles({left:b.left+c,
top:b.top+c});
h&&(this.__bpmvVs&&this.__b9w5bk().setStyles({width:d+c,
height:a+c}),g.setStyles({width:d+c,
height:a+c}),this._renderContentElement(a,g))},
_renderContentElement:function(b,a){},
_createContentElement:function(){var a=this._createInputElement();
a.setStyles({border:"none",
padding:0,
margin:0,
display:"block",
background:"transparent",
outline:"none",
appearance:"none",
position:"absolute",
autoComplete:"off"});
a.setSelectable(this.getSelectable());
a.setEnabled(this.getEnabled());
a.addListener("input",this._onHtmlInput,this);
a.setAttribute("spellcheck","false");
return a},
_applyEnabled:function(a,b){this.base(arguments,a,b);
this.getContentElement().setEnabled(a);
if(this.__bpmvVs)a?this._showPlaceholder():this._removePlaceholder();
else{var c=this.getContentElement();
c.setAttribute("placeholder",a?this.getPlaceholder():"")}},
__zC7gp:{width:16,
height:16},
_getContentHint:function(){return{width:this.__zC7gp.width*10,
height:this.__zC7gp.height||16}},
_applyFont:function(b,d){var a,c;
if(b){c=qx.theme.manager.Font.getInstance().resolve(b);
a=c.getStyles()}else a=qx.bom.Font.getDefaultStyles();
this.getContentElement().setStyles(a);
this.__bpmvVs&&this.__b9w5bk().setStyles(a);
b?this.__zC7gp=qx.bom.Label.getTextSize("A",a):delete this.__zC7gp;
qx.ui.core.queue.Layout.add(this)},
_applyTextColor:function(a,b){a?this.getContentElement().setStyle("color",qx.theme.manager.Color.getInstance().resolve(a)):this.getContentElement().removeStyle("color")},
tabFocus:function(){this.base(arguments);
this.selectAllText()},
_getTextSize:function(){return this.__zC7gp},
_onHtmlInput:function(f){var a=f.getData(),e=true,c,d,b;
this.__EnCFn=false;
if(this.getFilter()!=null){c="",d=a.search(this.getFilter()),b=a;
while(d>=0)c=c+b.charAt(d),b=b.substring(d+1,b.length),d=b.search(this.getFilter());
c!=a&&(e=false,a=c,this.getContentElement().setValue(a))}if(a.length>this.getMaxLength()){e=false;
this.getContentElement().setValue(a.substr(0,this.getMaxLength()))}e&&(this.fireDataEvent("input",a,this.__2lC4d),this.__2lC4d=a,this.getLiveUpdate()&&this.__bXJC3q(a))},
__bXJC3q:function(a){this.__yItbb!=a&&(this.fireNonBubblingEvent("changeValue",qx.event.type.Data,[a,this.__yItbb]),this.__yItbb=a)},
setValue:function(a){if(a===null){if(this.__EnCFn)return a;
a="";
this.__EnCFn=true}else this.__EnCFn=false,this.__bpmvVs&&this._removePlaceholder();
if(qx.lang.Type.isString(a)){var b=this.getContentElement(),d,c;
a.length>this.getMaxLength()&&(a=a.substr(0,this.getMaxLength()));
if(b.getValue()!=a){d=b.getValue();
b.setValue(a);
c=this.__EnCFn?null:a;
this.__yItbb=d;
this.__bXJC3q(c)}this.__bpmvVs&&this._showPlaceholder();
return a}throw new Error("Invalid value type: "+a)},
getValue:function(){var a=this.getContentElement().getValue();
return this.__EnCFn?null:a},
resetValue:function(){this.setValue(null)},
_onChangeContent:function(a){this.__EnCFn=a.getData()===null;
this.__bXJC3q(a.getData())},
getTextSelection:function(){return this.getContentElement().getTextSelection()},
getTextSelectionLength:function(){return this.getContentElement().getTextSelectionLength()},
getTextSelectionStart:function(){return this.getContentElement().getTextSelectionStart()},
getTextSelectionEnd:function(){return this.getContentElement().getTextSelectionEnd()},
setTextSelection:function(b,a){this.getContentElement().setTextSelection(b,a)},
clearTextSelection:function(){this.getContentElement().clearTextSelection()},
selectAllText:function(){this.setTextSelection(0)},
_showPlaceholder:function(){var a=this.getValue()||"",b=this.getPlaceholder();
b!=null&&a==""&&!this.hasState("focused")&&!this.hasState("disabled")&&(this.hasState("showingPlaceholder")?this._syncPlaceholder():this.addState("showingPlaceholder"))},
_removePlaceholder:function(){this.hasState("showingPlaceholder")&&(this.__b9w5bk().setStyle("visibility","hidden"),this.removeState("showingPlaceholder"))},
_syncPlaceholder:function(){this.hasState("showingPlaceholder")&&this.__b9w5bk().setStyle("visibility","visible")},
__b9w5bk:function(){this.__PpeiQ==null&&(this.__PpeiQ=new qx.html.Label(),this.__PpeiQ.setStyles({visibility:"hidden",
zIndex:6,
position:"absolute"}),this.getContainerElement().add(this.__PpeiQ));
return this.__PpeiQ},
_onChangeLocale:null,
_applyPlaceholder:function(a,b){this.__bpmvVs?(this.__b9w5bk().setValue(a),a!=null?(this.addListener("focusin",this._removePlaceholder,this),this.addListener("focusout",this._showPlaceholder,this),this._showPlaceholder()):(this.removeListener("focusin",this._removePlaceholder,this),this.removeListener("focusout",this._showPlaceholder,this),this._removePlaceholder())):this.getEnabled()&&this.getContentElement().setAttribute("placeholder",a)},
_applyTextAlign:function(a,b){this.getContentElement().setStyle("textAlign",a)},
_applyReadOnly:function(a,c){var b=this.getContentElement();
b.setAttribute("readOnly",a);
a?(this.addState("readonly"),this.setFocusable(false)):(this.removeState("readonly"),this.setFocusable(true))}},
destruct:function(){this.__PpeiQ=null}});


// qx.ui.form.TextField
//   - size: 259 bytes
//   - modified: 2010-09-30T14:20:20
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.form.AbstractField, 1x
qx.Class.define("qx.ui.form.TextField",{extend:qx.ui.form.AbstractField,
properties:{appearance:{refine:true,
init:"textfield"},
allowGrowY:{refine:true,
init:false},
allowShrinkY:{refine:true,
init:false}},
members:{_renderContentElement:function(b,a){}}});


// qx.ui.form.ToggleButton
//   - size: 1926 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Atom, 1x
//       qx.ui.core.MExecutable, 1x
//       qx.ui.form.IBooleanForm, 1x
//       qx.ui.form.IExecutable, 1x
qx.Class.define("qx.ui.form.ToggleButton",{extend:qx.ui.basic.Atom,
include:[qx.ui.core.MExecutable],
implement:[qx.ui.form.IBooleanForm,qx.ui.form.IExecutable],
construct:function(b,a){this.base(arguments,b,a);
this.addListener("mouseover",this._onMouseOver);
this.addListener("mouseout",this._onMouseOut);
this.addListener("mousedown",this._onMouseDown);
this.addListener("mouseup",this._onMouseUp);
this.addListener("keydown",this._onKeyDown);
this.addListener("keyup",this._onKeyUp);
this.addListener("execute",this._onExecute,this)},
properties:{appearance:{refine:true,
init:"button"},
focusable:{refine:true,
init:true},
value:{check:"Boolean",
nullable:true,
event:"changeValue",
apply:"_applyValue",
init:false}},
members:{_applyValue:function(a,b){a?this.addState("checked"):this.removeState("checked")},
_onExecute:function(a){this.toggleValue()},
_onMouseOver:function(a){if(a.getTarget()!==this)return;
this.addState("hovered");
this.hasState("abandoned")&&(this.removeState("abandoned"),this.addState("pressed"))},
_onMouseOut:function(a){if(a.getTarget()!==this)return;
this.removeState("hovered");
this.hasState("pressed")&&(this.getValue()||this.removeState("pressed"),this.addState("abandoned"))},
_onMouseDown:function(a){if(!a.isLeftPressed())return;
this.capture();
this.removeState("abandoned");
this.addState("pressed");
a.stopPropagation()},
_onMouseUp:function(a){this.releaseCapture();
this.hasState("abandoned")?this.removeState("abandoned"):this.hasState("pressed")&&this.execute();
this.removeState("pressed");
a.stopPropagation()},
_onKeyDown:function(a){switch(a.getKeyIdentifier()){case"Enter":case"Space":this.removeState("abandoned"),this.addState("pressed"),a.stopPropagation()}},
_onKeyUp:function(a){if(!this.hasState("pressed"))return;
switch(a.getKeyIdentifier()){case"Enter":case"Space":this.removeState("abandoned"),this.execute(),this.removeState("pressed"),a.stopPropagation()}}}});


// qx.ui.table.headerrenderer.HeaderCell
//   - size: 1370 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 6x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Image, 2x
//       qx.ui.basic.Label, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.layout.Grid, 1x
qx.Class.define("qx.ui.table.headerrenderer.HeaderCell",{extend:qx.ui.container.Composite,
construct:function(){this.base(arguments);
var a=new qx.ui.layout.Grid();
a.setRowFlex(0,1);
a.setColumnFlex(1,1);
a.setColumnFlex(2,1);
this.setLayout(a)},
properties:{appearance:{refine:true,
init:"table-header-cell"},
label:{check:"String",
init:null,
nullable:true,
apply:"_applyLabel"},
sortIcon:{check:"String",
init:null,
nullable:true,
apply:"_applySortIcon",
themeable:true},
icon:{check:"String",
init:null,
nullable:true,
apply:"_applyIcon"}},
members:{_applyLabel:function(a,b){a?this._showChildControl("label").setValue(a):this._excludeChildControl("label")},
_applySortIcon:function(a,b){a?this._showChildControl("sort-icon").setSource(a):this._excludeChildControl("sort-icon")},
_applyIcon:function(a,b){a?this._showChildControl("icon").setSource(a):this._excludeChildControl("icon")},
_createChildControlImpl:function(b){var a;
switch(b){case"label":a=new qx.ui.basic.Label(this.getLabel()).set({anonymous:true,
allowShrinkX:true});
this._add(a,{row:0,
column:1});
break;
case"sort-icon":a=new qx.ui.basic.Image(this.getSortIcon());
a.setAnonymous(true);
this._add(a,{row:0,
column:2});
break;
case"icon":a=new qx.ui.basic.Image(this.getIcon()).set({anonymous:true,
allowShrinkX:true});
this._add(a,{row:0,
column:0});
break}return a||this.base(arguments,b)}}});


// qx.ui.table.celleditor.TextField
//   - size: 406 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       parseFloat, 1x
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.form.TextField, 1x
//       qx.ui.table.celleditor.AbstractField, 1x
qx.Class.define("qx.ui.table.celleditor.TextField",{extend:qx.ui.table.celleditor.AbstractField,
members:{getCellEditorValue:function(b){var a=b.getValue(),c=this.getValidationFunction();
c&&(a=c(a,b.originalValue));
typeof b.originalValue=="number"&&a!=null&&(a=parseFloat(a));
return a},
_createEditor:function(){var a=new qx.ui.form.TextField();
a.setAppearance("table-editor-textfield");
return a}}});


// qx.ui.toolbar.CheckBox
//   - size: 318 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.form.ToggleButton, 1x
qx.Class.define("qx.ui.toolbar.CheckBox",{extend:qx.ui.form.ToggleButton,
construct:function(b,a){this.base(arguments,b,a);
this.removeListener("keydown",this._onKeyDown);
this.removeListener("keyup",this._onKeyUp)},
properties:{appearance:{refine:true,
init:"toolbar-button"},
focusable:{refine:true,
init:false}}});


// qx.ui.tree.AbstractTreeItem
//   - size: 6971 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       Error, 1x
//       qx, 20x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Data, 2x
//       qx.lang.Array.insertAt, 1x
//       qx.lang.Array.remove, 1x
//       qx.ui.basic.Image, 1x
//       qx.ui.basic.Label, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.core.Spacer, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.queue.Widget.add, 4x
//       qx.ui.core.scroll.ScrollPane, 1x
//       qx.ui.form.IModel, 1x
//       qx.ui.form.MModelProperty, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.layout.VBox, 1x
//       qx.ui.tree.FolderOpenButton, 1x
qx.Class.define("qx.ui.tree.AbstractTreeItem",{extend:qx.ui.core.Widget,
type:"abstract",
include:[qx.ui.form.MModelProperty],
implement:[qx.ui.form.IModel],
construct:function(){this.base(arguments);
this.__yONi8=[];
this._setLayout(new qx.ui.layout.HBox());
this._addWidgets();
this.initOpen()},
properties:{open:{check:"Boolean",
init:false,
event:"changeOpen",
apply:"_applyOpen"},
openSymbolMode:{check:["always","never","auto"],
init:"auto",
event:"changeOpenSymbolMode",
apply:"_applyOpenSymbolMode"},
indent:{check:"Integer",
init:19,
apply:"_applyIndent",
themeable:true},
parent:{check:"qx.ui.tree.AbstractTreeItem",
nullable:true},
icon:{check:"String",
apply:"_applyIcon",
nullable:true,
themeable:true},
label:{check:"String",
apply:"_applyLabel",
init:""}},
members:{__yONi8:null,
__bx0shb:null,
__HWqWH:null,
__C1tGw:null,
__qvcyn:null,
_addWidgets:function(){throw new Error("Abstract method call.")},
_createChildControlImpl:function(b){var a;
switch(b){case"label":a=new qx.ui.basic.Label().set({alignY:"middle",
value:this.getLabel()});
break;
case"icon":a=new qx.ui.basic.Image().set({alignY:"middle",
source:this.getIcon()});
break;
case"open":a=new qx.ui.tree.FolderOpenButton().set({alignY:"middle"});
a.addListener("changeOpen",this._onChangeOpen,this);
a.addListener("resize",this._updateIndent,this);
break}return a||this.base(arguments,b)},
getTree:function(){var a=this,b;
while(a.getParent())a=a.getParent();
b=a.getLayoutParent()?a.getLayoutParent().getLayoutParent():0;
if(b&&b instanceof qx.ui.core.scroll.ScrollPane)return b.getLayoutParent();
return null},
addWidget:function(b,a){this._add(b,a)},
addSpacer:function(){this.__qvcyn?this._remove(this.__qvcyn):this.__qvcyn=new qx.ui.core.Spacer();
this._add(this.__qvcyn)},
addOpenButton:function(){this._add(this.getChildControl("open"))},
_onChangeOpen:function(a){this.isOpenable()&&this.setOpen(a.getData())},
addIcon:function(){var a=this.getChildControl("icon");
this.__C1tGw&&this._remove(a);
this._add(a);
this.__C1tGw=true},
addLabel:function(b){var a=this.getChildControl("label");
this.__HWqWH&&this._remove(a);
b?this.setLabel(b):a.setValue(this.getLabel());
this._add(a);
this.__HWqWH=true},
addState:function(c){this.base(arguments,c);
for(var b=this._getChildren(),a=0,e=b.length,d;
a<e;
a++){d=b[a];
d.addState&&b[a].addState(c)}},
removeState:function(c){this.base(arguments,c);
for(var b=this._getChildren(),a=0,e=b.length,d;
a<e;
a++){d=b[a];
d.addState&&b[a].removeState(c)}},
_applyIcon:function(b,c){var a=this.getChildControl("icon",true);
a&&a.setSource(b)},
_applyLabel:function(b,c){var a=this.getChildControl("label",true);
a&&a.setValue(b)},
_applyOpen:function(a,c){this.hasChildren()&&this.getChildrenContainer().setVisibility(a?"visible":"excluded");
var b=this.getChildControl("open",true);
b&&b.setOpen(a);
a?this.addState("opened"):this.removeState("opened")},
isOpenable:function(){var a=this.getOpenSymbolMode();
return a==="always"||a==="auto"&&this.hasChildren()},
_shouldShowOpenSymbol:function(){var b=this.getChildControl("open",true),a;
if(!b)return false;
a=this.getTree();
if(!a.getRootOpenClose()){if(a.getHideRoot()){if(a.getRoot()==this.getParent())return false}else if(a.getRoot()==this)return false}return this.isOpenable()},
_applyOpenSymbolMode:function(a,b){this._updateIndent()},
_updateIndent:function(){if(!this.getTree())return;
var b=0,a=this.getChildControl("open",true),c;
if(a){if(this._shouldShowOpenSymbol()){a.show();
c=a.getBounds();
if(c)b=c.width;
else return}else a.exclude()}this.__qvcyn&&this.__qvcyn.setWidth((this.getLevel()+1)*this.getIndent()-b)},
_applyIndent:function(a,b){this._updateIndent()},
getLevel:function(){var c=this.getTree(),b,a;
if(!c)return;
b=this,a=-1;
while(b)b=b.getParent(),a+=1;
c.getHideRoot()&&(a-=1);
c.getRootOpenClose()||(a-=1);
return a},
syncWidget:function(){this._updateIndent()},
getChildrenContainer:function(){this.__bx0shb||(this.__bx0shb=new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({visibility:this.isOpen()?"visible":"excluded"}));
return this.__bx0shb},
hasChildrenContainer:function(){return this.__bx0shb},
getParentChildrenContainer:function(){return this.getParent()?this.getParent().getChildrenContainer():this.getLayoutParent()?this.getLayoutParent():null},
getChildren:function(){return this.__yONi8},
hasChildren:function(){return this.__yONi8?this.__yONi8.length>0:false},
getItems:function(e,d,g){if(g!==false)var a=[],f,b,c,h;
else a=[this];
f=this.hasChildren()&&(d!==false||this.isOpen());
if(f){b=this.getChildren();
if(e===false)a=a.concat(b);
else for(c=0,h=b.length;
c<h;
c++)a=a.concat(b[c].getItems(e,d,false))}return a},
recursiveAddToWidgetQueue:function(){for(var b=this.getItems(true,true,false),a=0,c=b.length;
a<c;
a++)qx.ui.core.queue.Widget.add(b[a])},
__bMXYhm:function(){this.getParentChildrenContainer()&&this.getParentChildrenContainer()._addAfter(this.getChildrenContainer(),this)},
add:function(h){for(var e=this.getChildrenContainer(),b=this.getTree(),c=0,f=arguments.length,a,d,g;
c<f;
c++){a=arguments[c],d=a.getParent();
d&&d.remove(a);
a.setParent(this);
g=this.hasChildren();
e.add(a);
a.hasChildren()&&e.add(a.getChildrenContainer());
this.__yONi8.push(a);
g||this.__bMXYhm();
b&&(a.recursiveAddToWidgetQueue(),b.fireNonBubblingEvent("addItem",qx.event.type.Data,[a]))}b&&qx.ui.core.queue.Widget.add(this)},
addAt:function(a,b){this.assert(b<=this.__yONi8.length&&b>=0,"Invalid child index: "+b);
if(b==this.__yONi8.length){this.add(a);
return}var c=a.getParent(),d,e,f;
c&&c.remove(a);
d=this.getChildrenContainer();
a.setParent(this);
e=this.hasChildren(),f=this.__yONi8[b];
d.addBefore(a,f);
a.hasChildren()&&d.addAfter(a.getChildrenContainer(),a);
qx.lang.Array.insertAt(this.__yONi8,a,b);
e||this.__bMXYhm();
this.getTree()&&(a.recursiveAddToWidgetQueue(),qx.ui.core.queue.Widget.add(this))},
addBefore:function(a,b){this.assert(this.__yONi8.indexOf(b)>=0);
var c=a.getParent();
c&&c.remove(a);
this.addAt(a,this.__yONi8.indexOf(b))},
addAfter:function(a,c){this.assert(this.__yONi8.indexOf(c)>=0);
var b=a.getParent();
b&&b.remove(a);
this.addAt(a,this.__yONi8.indexOf(c)+1)},
addAtBegin:function(a){this.addAt(a,0)},
remove:function(g){for(var b=0,f=arguments.length,a,c,e,d;
b<f;
b++){a=arguments[b];
if(this.__yONi8.indexOf(a)==-1){this.warn("Cannot remove treeitem '"+a+"'. It is not a child of this tree item.");
return}c=this.getChildrenContainer();
if(a.hasChildrenContainer()){e=a.getChildrenContainer();
c.getChildren().indexOf(e)>=0&&c.remove(e)}qx.lang.Array.remove(this.__yONi8,a);
a.setParent(null);
c.remove(a)}d=this.getTree();
d&&d.fireNonBubblingEvent("removeItem",qx.event.type.Data,[a]);
qx.ui.core.queue.Widget.add(this)},
removeAt:function(b){var a=this.__yONi8[b];
a&&this.remove(a)},
removeAll:function(){for(var a=this.__yONi8.length-1;
a>=0;
a--)this.remove(this.__yONi8[a])}},
destruct:function(){this._disposeArray("__children");
this._disposeObjects("__spacer","__childrenContainer")}});


// qx.ui.tree.TreeFolder
//   - size: 311 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 2x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.tree.AbstractTreeItem, 1x
qx.Class.define("qx.ui.tree.TreeFolder",{extend:qx.ui.tree.AbstractTreeItem,
construct:function(a){this.base(arguments);
a&&this.setLabel(a)},
properties:{appearance:{refine:true,
init:"tree-folder"}},
members:{_addWidgets:function(){this.addSpacer();
this.addOpenButton();
this.addIcon();
this.addLabel()}}});


// qx.ui.tooltip.ToolTip
//   - size: 1174 bytes
//   - modified: 2010-05-21T19:22:00
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Atom, 1x
//       qx.ui.layout.Grow, 1x
//       qx.ui.popup.Popup, 1x
qx.Class.define("qx.ui.tooltip.ToolTip",{extend:qx.ui.popup.Popup,
construct:function(b,a){this.base(arguments);
this.setLayout(new qx.ui.layout.Grow);
this._createChildControl("atom");
b!=null&&this.setLabel(b);
a!=null&&this.setIcon(a);
this.addListener("mouseover",this._onMouseOver,this)},
properties:{appearance:{refine:true,
init:"tooltip"},
showTimeout:{check:"Integer",
init:700,
themeable:true},
hideTimeout:{check:"Integer",
init:4000,
themeable:true},
label:{check:"String",
nullable:true,
apply:"_applyLabel"},
icon:{check:"String",
nullable:true,
apply:"_applyIcon",
themeable:true},
rich:{check:"Boolean",
init:false,
apply:"_applyRich"},
opener:{check:"qx.ui.core.Widget",
nullable:true}},
members:{_createChildControlImpl:function(b){var a;
switch(b){case"atom":a=new qx.ui.basic.Atom;
this._add(a);
break}return a||this.base(arguments,b)},
_onMouseOver:function(a){this.hide()},
_applyIcon:function(b,c){var a=this.getChildControl("atom");
b==null?a.resetIcon():a.setIcon(b)},
_applyLabel:function(b,c){var a=this.getChildControl("atom");
b==null?a.resetLabel():a.setLabel(b)},
_applyRich:function(b,c){var a=this.getChildControl("atom");
a.setRich(b)}}});


// qx.ui.tree.SelectionManager
//   - size: 1373 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.selection.ScrollArea, 1x
//       qx.ui.tree.AbstractTreeItem, 1x
qx.Class.define("qx.ui.tree.SelectionManager",{extend:qx.ui.core.selection.ScrollArea,
members:{_getSelectableLocationY:function(c){var a=c.getBounds(),b;
if(a){b=this._getWidget().getItemTop(c);
return{top:b,
bottom:b+a.height}}},
_isSelectable:function(a){return this._isItemSelectable(a)&&a instanceof qx.ui.tree.AbstractTreeItem},
_getSelectableFromMouseEvent:function(a){return this._getWidget().getTreeItem(a.getTarget())},
getSelectables:function(f){var e=false,b,d,c,a;
f||(e=this._userInteraction,this._userInteraction=true);
b=this._getWidget(),d=[];
if(b.getRoot()!=null){c=b.getRoot().getItems(true,!!f,b.getHideRoot()),a=0;
for(;
a<c.length;
a++)this._isSelectable(c[a])&&d.push(c[a])}this._userInteraction=e;
return d},
_getSelectableRange:function(d,e){if(d===e)return[d];
var c=this.getSelectables(),a=c.indexOf(d),b=c.indexOf(e);
if(a<0||b<0)return[];
return a<b?c.slice(a,b+1):c.slice(b,a+1)},
_getFirstSelectable:function(){return this.getSelectables()[0]||null},
_getLastSelectable:function(){var a=this.getSelectables();
return a.length>0?a[a.length-1]:null},
_getRelatedSelectable:function(d,b){var c=this._getWidget(),a=null;
switch(b){case"above":a=c.getPreviousNodeOf(d,false);
break;
case"under":a=c.getNextNodeOf(d,false);
break;
case"left":case"right":break}if(!a)return null;
return this._isSelectable(a)?a:this._getRelatedSelectable(a,b)}}});


// qx.ui.tooltip.Manager
//   - size: 3263 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       document, 3x
//       qx, 18x
//   - packages:
//       document.body, 3x
//       qx.Class.define, 1x
//       qx.Class.hasInterface, 1x
//       qx.core.Object, 1x
//       qx.event.Registration, 1x
//       qx.event.Registration.addListener, 1x
//       qx.event.Registration.removeListener, 1x
//       qx.event.Timer, 2x
//       qx.ui.core.Widget.contains, 3x
//       qx.ui.core.Widget.getWidgetByElement, 4x
//       qx.ui.form.IForm, 1x
//       qx.ui.tooltip.ToolTip, 2x
qx.Class.define("qx.ui.tooltip.Manager",{type:"singleton",
extend:qx.core.Object,
construct:function(){this.base(arguments);
qx.event.Registration.addListener(document.body,"mouseover",this.__bhERW5,this,true);
this.__EwYkD=new qx.event.Timer();
this.__EwYkD.addListener("interval",this.__9Xu1u,this);
this.__Di4O6=new qx.event.Timer();
this.__Di4O6.addListener("interval",this.__8dqNb,this);
this.__349cD={left:0,
top:0}},
properties:{current:{check:"qx.ui.tooltip.ToolTip",
nullable:true,
apply:"_applyCurrent"},
showInvalidToolTips:{check:"Boolean",
init:true},
showToolTips:{check:"Boolean",
init:true}},
members:{__349cD:null,
__Di4O6:null,
__EwYkD:null,
__2s3nV:null,
__bHsIzv:null,
__boOXXF:function(){this.__2s3nV||(this.__2s3nV=new qx.ui.tooltip.ToolTip().set({rich:true}));
return this.__2s3nV},
__cacBzH:function(){this.__bHsIzv||(this.__bHsIzv=new qx.ui.tooltip.ToolTip().set({appearance:"tooltip-error"}),this.__bHsIzv.syncAppearance());
return this.__bHsIzv},
_applyCurrent:function(d,c){if(c&&qx.ui.core.Widget.contains(c,d))return;
c&&(c.isDisposed()||c.exclude(),this.__EwYkD.stop(),this.__Di4O6.stop());
var a=qx.event.Registration,b=document.body;
d?(this.__EwYkD.startWith(d.getShowTimeout()),a.addListener(b,"mouseout",this.__9YBdB,this,true),a.addListener(b,"focusout",this.__9nKE8,this,true),a.addListener(b,"mousemove",this.__bhxaz6,this,true)):(a.removeListener(b,"mouseout",this.__9YBdB,this,true),a.removeListener(b,"focusout",this.__9nKE8,this,true),a.removeListener(b,"mousemove",this.__bhxaz6,this,true))},
__9Xu1u:function(b){var a=this.getCurrent();
a&&!a.isDisposed()&&(this.__Di4O6.startWith(a.getHideTimeout()),a.getPlaceMethod()=="widget"?a.placeToWidget(a.getOpener()):a.placeToPoint(this.__349cD),a.show());
this.__EwYkD.stop()},
__8dqNb:function(b){var a=this.getCurrent();
a&&!a.isDisposed()&&a.exclude();
this.__Di4O6.stop();
this.resetCurrent()},
__bhxaz6:function(b){var a=this.__349cD;
a.left=b.getDocumentLeft();
a.top=b.getDocumentTop()},
__bhERW5:function(f){var a=qx.ui.core.Widget.getWidgetByElement(f.getTarget()),b,d,e,c;
if(!a)return;
while(a!=null){b=a.getToolTip();
d=a.getToolTipText()||null;
e=a.getToolTipIcon()||null;
qx.Class.hasInterface(a.constructor,qx.ui.form.IForm)&&!a.isValid()&&(c=a.getInvalidMessage());
if(b||d||e||c)break;
a=a.getLayoutParent()}if(!a||!a.getEnabled()||a.isBlockToolTip()||!c&&!this.getShowToolTips()||c&&!this.getShowInvalidToolTips())return;
c&&(b=this.__cacBzH().set({label:c}));
b||(b=this.__boOXXF().set({label:d,
icon:e}));
this.setCurrent(b);
b.setOpener(a)},
__9YBdB:function(d){var c=qx.ui.core.Widget.getWidgetByElement(d.getTarget()),a,b;
if(!c)return;
a=qx.ui.core.Widget.getWidgetByElement(d.getRelatedTarget());
if(!a)return;
b=this.getCurrent();
if(b&&(a==b||qx.ui.core.Widget.contains(b,a)))return;
if(a&&c&&qx.ui.core.Widget.contains(c,a))return;
b&&!a?this.setCurrent(null):this.resetCurrent()},
__9nKE8:function(c){var b=qx.ui.core.Widget.getWidgetByElement(c.getTarget()),a;
if(!b)return;
a=this.getCurrent();
a&&a==b.getToolTip()&&this.setCurrent(null)}},
destruct:function(){qx.event.Registration.removeListener(document.body,"mouseover",this.__bhERW5,this,true);
this._disposeObjects("__showTimer","__hideTimer","__sharedToolTip");
this.__349cD=null}});


// qx.ui.core.scroll.ScrollBar
//   - size: 3229 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 9x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Type.check, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.core.scroll.IScrollBar, 1x
//       qx.ui.core.scroll.ScrollSlider, 1x
//       qx.ui.form.RepeatButton, 2x
//       qx.ui.layout.HBox, 1x
//       qx.ui.layout.VBox, 1x
qx.Class.define("qx.ui.core.scroll.ScrollBar",{extend:qx.ui.core.Widget,
implement:qx.ui.core.scroll.IScrollBar,
construct:function(a){this.base(arguments);
this._createChildControl("button-begin");
this._createChildControl("slider").addListener("resize",this._onResizeSlider,this);
this._createChildControl("button-end");
a!=null?this.setOrientation(a):this.initOrientation()},
properties:{appearance:{refine:true,
init:"scrollbar"},
orientation:{check:["horizontal","vertical"],
init:"horizontal",
apply:"_applyOrientation"},
maximum:{check:"PositiveInteger",
apply:"_applyMaximum",
init:100},
position:{check:function(a){qx.core.Type.check(a,"PositiveInteger");
return a<=this.getMaximum()},
init:0,
apply:"_applyPosition",
event:"scroll"},
singleStep:{check:"Integer",
init:20},
pageStep:{check:"Integer",
init:10,
apply:"_applyPageStep"},
knobFactor:{check:"PositiveNumber",
apply:"_applyKnobFactor",
nullable:true}},
members:{__qt6mo:2,
_createChildControlImpl:function(b){var a;
switch(b){case"slider":a=new qx.ui.core.scroll.ScrollSlider();
a.setPageStep(100);
a.setFocusable(false);
a.addListener("changeValue",this._onChangeSliderValue,this);
this._add(a,{flex:1});
break;
case"button-begin":a=new qx.ui.form.RepeatButton();
a.setFocusable(false);
a.addListener("execute",this._onExecuteBegin,this);
this._add(a);
break;
case"button-end":a=new qx.ui.form.RepeatButton();
a.setFocusable(false);
a.addListener("execute",this._onExecuteEnd,this);
this._add(a);
break}return a||this.base(arguments,b)},
_applyMaximum:function(a){this.getChildControl("slider").setMaximum(a)},
_applyPosition:function(a){this.getChildControl("slider").setValue(a)},
_applyKnobFactor:function(a){this.getChildControl("slider").setKnobFactor(a)},
_applyPageStep:function(a){this.getChildControl("slider").setPageStep(a)},
_applyOrientation:function(a,c){var b=this._getLayout();
b&&b.dispose();
a==="horizontal"?(this._setLayout(new qx.ui.layout.HBox()),this.setAllowStretchX(true),this.setAllowStretchY(false),this.replaceState("vertical","horizontal"),this.getChildControl("button-begin").replaceState("up","left"),this.getChildControl("button-end").replaceState("down","right")):(this._setLayout(new qx.ui.layout.VBox()),this.setAllowStretchX(false),this.setAllowStretchY(true),this.replaceState("horizontal","vertical"),this.getChildControl("button-begin").replaceState("left","up"),this.getChildControl("button-end").replaceState("right","down"));
this.getChildControl("slider").setOrientation(a)},
scrollTo:function(a){this.getChildControl("slider").slideTo(a)},
scrollBy:function(a){this.getChildControl("slider").slideBy(a)},
scrollBySteps:function(b){var a=this.getSingleStep();
this.getChildControl("slider").slideBy(b*a)},
_onExecuteBegin:function(a){this.scrollBy(-this.getSingleStep())},
_onExecuteEnd:function(a){this.scrollBy(this.getSingleStep())},
_onChangeSliderValue:function(a){this.setPosition(a.getData())},
_onResizeSlider:function(e){var b=this.getChildControl("slider").getChildControl("knob"),c=b.getSizeHint(),a=false,d=this.getChildControl("slider").getInnerSize();
this.getOrientation()=="vertical"?d.height<c.minHeight+this.__qt6mo&&(a=true):d.width<c.minWidth+this.__qt6mo&&(a=true);
a?b.exclude():b.show()}}});


// qx.ui.toolbar.RadioButton
//   - size: 438 bytes
//   - modified: 2010-10-13T17:38:57
//   - names:
//       qx, 5x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.form.IModel, 1x
//       qx.ui.form.IRadioItem, 1x
//       qx.ui.form.MModelProperty, 1x
//       qx.ui.toolbar.CheckBox, 1x
qx.Class.define("qx.ui.toolbar.RadioButton",{extend:qx.ui.toolbar.CheckBox,
include:[qx.ui.form.MModelProperty],
implement:[qx.ui.form.IModel,qx.ui.form.IRadioItem],
properties:{group:{check:"qx.ui.form.RadioGroup",
apply:"_applyGroup",
nullable:true}},
members:{_applyValue:function(a,c){this.base(arguments,a,c);
if(a){var b=this.getGroup();
b&&b.setSelection([this])}},
_applyGroup:function(a,b){b&&b.remove(this);
a&&a.add(this)}}});


// qx.ui.form.RadioButton
//   - size: 1088 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 8x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.form.Button, 1x
//       qx.ui.form.IBooleanForm, 1x
//       qx.ui.form.IForm, 1x
//       qx.ui.form.IModel, 1x
//       qx.ui.form.IRadioItem, 1x
//       qx.ui.form.MForm, 1x
//       qx.ui.form.MModelProperty, 1x
qx.Class.define("qx.ui.form.RadioButton",{extend:qx.ui.form.Button,
include:[qx.ui.form.MForm,qx.ui.form.MModelProperty],
implement:[qx.ui.form.IRadioItem,qx.ui.form.IForm,qx.ui.form.IBooleanForm,qx.ui.form.IModel],
construct:function(a){this.assertArgumentsCount(arguments,0,1);
this.base(arguments,a);
this.addListener("execute",this._onExecute);
this.addListener("keypress",this._onKeyPress)},
properties:{group:{check:"qx.ui.form.RadioGroup",
nullable:true,
apply:"_applyGroup"},
value:{check:"Boolean",
nullable:true,
event:"changeValue",
apply:"_applyValue",
init:false},
appearance:{refine:true,
init:"radiobutton"},
allowGrowX:{refine:true,
init:false}},
members:{_applyValue:function(a,b){a?this.addState("checked"):this.removeState("checked");
a&&this.getFocusable()&&this.focus()},
_applyGroup:function(a,b){b&&b.remove(this);
a&&a.add(this)},
_onExecute:function(a){this.setValue(true)},
_onKeyPress:function(b){var a=this.getGroup();
if(!a)return;
switch(b.getKeyIdentifier()){case"Left":case"Up":a.selectPrevious();
break;
case"Right":case"Down":a.selectNext();
break}}}});


// apiviewer.ui.panels.ClassPanel
//   - size: 1230 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 5x
//       qx, 1x
//   - packages:
//       apiviewer.ui.panels.InfoPanel, 1x
//       apiviewer.ui.panels.InfoPanel.createDescriptionHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createItemLinkHtml, 1x
//       apiviewer.ui.panels.InfoPanel.descriptionHasDetails, 1x
//       apiviewer.ui.panels.InfoPanel.resolveLinkAttributes, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.ui.panels.ClassPanel",{extend:apiviewer.ui.panels.InfoPanel,
construct:function(c,a,b){this.base(arguments,c,a);
this.setType(b)},
properties:{type:{check:["class","mixin","interface"]}},
members:{getItemTypeHtml:function(a){return apiviewer.ui.panels.InfoPanel.createItemLinkHtml(a.getName(),a,false,true)},
getItemTitleHtml:function(a){return a.getFullName()},
getItemTextHtml:function(a,c,b){return b?apiviewer.ui.panels.InfoPanel.resolveLinkAttributes(a.getDescription(),a):apiviewer.ui.panels.InfoPanel.createDescriptionHtml(a,a.getClass(),b)},
getItemTooltip:function(b,c){if(b.isAbstract())var a="Abstract ";
else if(b.isStatic())a="Static ";
else if(b.isSingleton())a="Singleton ";
else a="";
switch(b.getType()){case"mixin":a+="Mixin";
break;
case"interface":a+="Interface";
break;
default:a+="Class";
break}return a},
itemHasDetails:function(a,b){return apiviewer.ui.panels.InfoPanel.descriptionHasDetails(a)},
update:function(f,d){if(!this.getElement())return;
this.setDocNode(d);
for(var e=d.getClasses(),b=[],a,c=0;
c<e.length;
c++)a=e[c].getType(),(a==="bootstrap"||a==="list")&&(a="class"),a===this.getType()&&b.push(e[c]);
b&&b.length>0&&this._sortItems(b);
this._displayNodes(b,d)}}});


// apiviewer.ui.panels.PackagePanel
//   - size: 759 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 5x
//       qx, 1x
//   - packages:
//       apiviewer.ui.panels.InfoPanel, 1x
//       apiviewer.ui.panels.InfoPanel.createDescriptionHtml, 1x
//       apiviewer.ui.panels.InfoPanel.createItemLinkHtml, 1x
//       apiviewer.ui.panels.InfoPanel.descriptionHasDetails, 1x
//       apiviewer.ui.panels.InfoPanel.resolveLinkAttributes, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.ui.panels.PackagePanel",{extend:apiviewer.ui.panels.InfoPanel,
members:{getItemTypeHtml:function(a){return apiviewer.ui.panels.InfoPanel.createItemLinkHtml(a.getFullName(),null,false,true)},
getItemTitleHtml:function(a){return a.getFullName()},
getItemTextHtml:function(a,c,b){return b?apiviewer.ui.panels.InfoPanel.resolveLinkAttributes(a.getDescription(),a):apiviewer.ui.panels.InfoPanel.createDescriptionHtml(a,a.getPackage(),b)},
getItemTooltip:function(a,b){return"Package"},
itemHasDetails:function(a,b){return apiviewer.ui.panels.InfoPanel.descriptionHasDetails(a)},
update:function(c,b){if(!this.getElement())return;
this.setDocNode(b);
var a=b.getPackages();
a&&a.length>0&&this._sortItems(a);
this._displayNodes(a,b)}}});


// qx.ui.core.scroll.MScrollBarFactory
//   - size: 277 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 5x
//   - packages:
//       qx.Mixin.define, 1x
//       qx.core.Setting.define, 1x
//       qx.core.Setting.get, 1x
//       qx.ui.core.scroll.NativeScrollBar, 1x
//       qx.ui.core.scroll.ScrollBar, 1x
qx.core.Setting.define("qx.nativeScrollBars",false);
qx.Mixin.define("qx.ui.core.scroll.MScrollBarFactory",{members:{_createScrollBar:function(a){return qx.core.Setting.get("qx.nativeScrollBars")?new qx.ui.core.scroll.NativeScrollBar(a):new qx.ui.core.scroll.ScrollBar(a)}}});


// qx.ui.table.headerrenderer.Default
//   - size: 895 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.ui.table.IHeaderRenderer, 1x
//       qx.ui.table.headerrenderer.Default, 1x
//       qx.ui.table.headerrenderer.HeaderCell, 1x
//       qx.ui.tooltip.ToolTip, 1x
//       qx.util.DisposeUtil.disposeTriggeredBy, 1x
qx.Class.define("qx.ui.table.headerrenderer.Default",{extend:qx.core.Object,
implement:qx.ui.table.IHeaderRenderer,
statics:{STATE_SORTED:"sorted",
STATE_SORTED_ASCENDING:"sortedAscending"},
properties:{toolTip:{check:"String",
init:null,
nullable:true}},
members:{createHeaderCell:function(b){var a=new qx.ui.table.headerrenderer.HeaderCell();
this.updateHeaderCell(b,a);
return a},
updateHeaderCell:function(b,a){var d=qx.ui.table.headerrenderer.Default,c;
b.name&&b.name.translate?a.setLabel(b.name.translate()):a.setLabel(b.name);
c=a.getToolTip();
this.getToolTip()!=null&&(c==null?(c=new qx.ui.tooltip.ToolTip(this.getToolTip()),a.setToolTip(c),qx.util.DisposeUtil.disposeTriggeredBy(c,a)):c.setLabel(this.getToolTip()));
b.sorted?a.addState(d.STATE_SORTED):a.removeState(d.STATE_SORTED);
b.sortedAscending?a.addState(d.STATE_SORTED_ASCENDING):a.removeState(d.STATE_SORTED_ASCENDING)}}});


// qx.ui.tabview.TabButton
//   - size: 2248 bytes
//   - modified: 2010-09-17T21:15:51
//   - names:
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Image, 1x
//       qx.ui.basic.Label, 1x
//       qx.ui.form.Button, 1x
//       qx.ui.form.IRadioItem, 1x
//       qx.ui.form.RadioButton, 1x
//       qx.ui.layout.Grid, 1x
qx.Class.define("qx.ui.tabview.TabButton",{extend:qx.ui.form.RadioButton,
implement:qx.ui.form.IRadioItem,
construct:function(){this.base(arguments);
var a=new qx.ui.layout.Grid(2,0);
a.setRowAlign(0,"left","middle");
a.setColumnAlign(0,"right","middle");
this._getLayout().dispose();
this._setLayout(a);
this.initShowCloseButton()},
events:{close:"qx.event.type.Data"},
properties:{showCloseButton:{check:"Boolean",
init:false,
apply:"_applyShowCloseButton"}},
members:{_forwardStates:{focused:true,
checked:true},
_applyIconPosition:function(c,d){var a={icon:this.getChildControl("icon"),
label:this.getChildControl("label"),
closeButton:this.getShowCloseButton()?this.getChildControl("close-button"):null},b;
for(b in a)a[b]&&this._remove(a[b]);
switch(c){case"top":this._add(a.label,{row:3,
column:2});
this._add(a.icon,{row:1,
column:2});
a.closeButton&&this._add(a.closeButton,{row:0,
column:4});
break;
case"bottom":this._add(a.label,{row:1,
column:2});
this._add(a.icon,{row:3,
column:2});
a.closeButton&&this._add(a.closeButton,{row:0,
column:4});
break;
case"left":this._add(a.label,{row:0,
column:2});
this._add(a.icon,{row:0,
column:0});
a.closeButton&&this._add(a.closeButton,{row:0,
column:4});
break;
case"right":this._add(a.label,{row:0,
column:0});
this._add(a.icon,{row:0,
column:2});
a.closeButton&&this._add(a.closeButton,{row:0,
column:4});
break}},
_applyGap:function(a,b){},
_createChildControlImpl:function(b){var a;
switch(b){case"label":a=new qx.ui.basic.Label(this.getLabel());
a.setAnonymous(true);
this._add(a,{row:0,
column:2});
this._getLayout().setColumnFlex(2,1);
break;
case"icon":a=new qx.ui.basic.Image(this.getIcon());
a.setAnonymous(true);
this._add(a,{row:0,
column:0});
break;
case"close-button":a=new qx.ui.form.Button();
a.addListener("click",this._onCloseButtonClick,this);
this._add(a,{row:0,
column:4});
this.getShowCloseButton()||a.exclude();
break}return a||this.base(arguments,b)},
_onCloseButtonClick:function(){this.fireDataEvent("close",this)},
_applyShowCloseButton:function(a,b){a?this._showChildControl("close-button"):this._excludeChildControl("close-button")},
_applyCenter:function(b){var a=this._getLayout();
b?a.setColumnAlign(2,"center","middle"):a.setColumnAlign(2,"left","middle")}}});


// qx.application.AbstractGui
//   - size: 614 bytes
//   - modified: 2010-11-02T15:53:20
//   - names:
//       Error, 1x
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.application.IApplication, 1x
//       qx.core.Object, 1x
//       qx.locale.MTranslation, 1x
//       qx.theme.manager.Meta.getInstance, 1x
//       qx.ui.core.queue.Manager.flush, 1x
//       qx.ui.tooltip.Manager.getInstance, 1x
qx.Class.define("qx.application.AbstractGui",{type:"abstract",
extend:qx.core.Object,
implement:[qx.application.IApplication],
include:qx.locale.MTranslation,
members:{__jO4QN:null,
_createRootWidget:function(){throw new Error("Abstract method call")},
getRoot:function(){return this.__jO4QN},
main:function(){qx.theme.manager.Meta.getInstance().initialize();
qx.ui.tooltip.Manager.getInstance();
this.__jO4QN=this._createRootWidget()},
finalize:function(){this.render()},
render:function(){qx.ui.core.queue.Manager.flush()},
close:function(a){},
terminate:function(){}},
destruct:function(){this.__jO4QN=null}});


// apiviewer.ui.PackageViewer
//   - size: 980 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       apiviewer, 8x
//       qx, 2x
//   - packages:
//       apiviewer.dao.Package, 1x
//       apiviewer.ui.AbstractViewer, 1x
//       apiviewer.ui.panels.ClassPanel, 3x
//       apiviewer.ui.panels.InfoPanel.resolveLinkAttributes, 1x
//       apiviewer.ui.panels.MethodPanel, 1x
//       apiviewer.ui.panels.PackagePanel, 1x
//       qx.Class.define, 1x
//       qx.util.StringBuilder, 1x
qx.Class.define("apiviewer.ui.PackageViewer",{extend:apiviewer.ui.AbstractViewer,
construct:function(){this.base(arguments);
this.addInfoPanel(new apiviewer.ui.panels.MethodPanel("functions","functions"));
this.addInfoPanel(new apiviewer.ui.panels.ClassPanel("classes","classes","class"));
this.addInfoPanel(new apiviewer.ui.panels.ClassPanel("classes","interfaces","interface"));
this.addInfoPanel(new apiviewer.ui.panels.ClassPanel("classes","mixins","mixin"));
this.addInfoPanel(new apiviewer.ui.panels.PackagePanel("packages","packages"));
this.getContentElement().setAttribute("class","ClassViewer");
this._init(new apiviewer.dao.Package({}))},
members:{_getTitleHtml:function(b){var a="";
a+="<small>package</small>";
a+=b.getFullName();
return a},
_getDescriptionHtml:function(b){var c=new qx.util.StringBuilder(),a=b.getDescription();
a!=""&&c.add("<div class=\"class-description\">",apiviewer.ui.panels.InfoPanel.resolveLinkAttributes(a,b),"</div>");
return c.get()}}});


// qx.ui.core.scroll.AbstractScrollArea
//   - size: 5934 bytes
//   - modified: 2010-10-13T17:38:57
//   - names:
//       Math, 4x
//       clearTimeout, 1x
//       qx, 13x
//       setTimeout, 2x
//   - packages:
//       Math.max, 3x
//       Math.min, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Feature.TOUCH, 1x
//       qx.lang.Function.bind, 2x
//       qx.ui.core.Widget, 2x
//       qx.ui.core.queue.Manager.flush, 4x
//       qx.ui.core.scroll.MScrollBarFactory, 1x
//       qx.ui.core.scroll.ScrollPane, 1x
//       qx.ui.layout.Grid, 1x
qx.Class.define("qx.ui.core.scroll.AbstractScrollArea",{extend:qx.ui.core.Widget,
include:qx.ui.core.scroll.MScrollBarFactory,
type:"abstract",
construct:function(){this.base(arguments);
var a=new qx.ui.layout.Grid();
a.setColumnFlex(0,1);
a.setRowFlex(0,1);
this._setLayout(a);
this.addListener("mousewheel",this._onMouseWheel,this);
qx.bom.client.Feature.TOUCH&&(this.addListener("touchmove",this._onTouchMove,this),this.addListener("touchstart",function(){this.__gQ654={x:0,
y:0}},this),this.__gQ654={},this.__baW5Ym={})},
events:{scrollX:"qx.event.type.Data",
scrollY:"qx.event.type.Data"},
properties:{appearance:{refine:true,
init:"scrollarea"},
width:{refine:true,
init:100},
height:{refine:true,
init:200},
scrollbarX:{check:["auto","on","off"],
init:"auto",
themeable:true,
apply:"_computeScrollbars"},
scrollbarY:{check:["auto","on","off"],
init:"auto",
themeable:true,
apply:"_computeScrollbars"},
scrollbar:{group:["scrollbarX","scrollbarY"]}},
members:{__gQ654:null,
__baW5Ym:null,
_createChildControlImpl:function(b){var a;
switch(b){case"pane":a=new qx.ui.core.scroll.ScrollPane();
a.addListener("update",this._computeScrollbars,this);
a.addListener("scrollX",this._onScrollPaneX,this);
a.addListener("scrollY",this._onScrollPaneY,this);
this._add(a,{row:0,
column:0});
break;
case"scrollbar-x":a=this._createScrollBar("horizontal");
a.setMinWidth(0);
a.exclude();
a.addListener("scroll",this._onScrollBarX,this);
a.addListener("changeVisibility",this._onChangeScrollbarXVisibility,this);
this._add(a,{row:1,
column:0});
break;
case"scrollbar-y":a=this._createScrollBar("vertical");
a.setMinHeight(0);
a.exclude();
a.addListener("scroll",this._onScrollBarY,this);
a.addListener("changeVisibility",this._onChangeScrollbarYVisibility,this);
this._add(a,{row:0,
column:1});
break;
case"corner":a=new qx.ui.core.Widget();
a.setWidth(0);
a.setHeight(0);
a.exclude();
this._add(a,{row:1,
column:1});
break}return a||this.base(arguments,b)},
getPaneSize:function(){return this.getChildControl("pane").getInnerSize()},
getItemTop:function(a){return this.getChildControl("pane").getItemTop(a)},
getItemBottom:function(a){return this.getChildControl("pane").getItemBottom(a)},
getItemLeft:function(a){return this.getChildControl("pane").getItemLeft(a)},
getItemRight:function(a){return this.getChildControl("pane").getItemRight(a)},
scrollToX:function(a){qx.ui.core.queue.Manager.flush();
this.getChildControl("scrollbar-x").scrollTo(a)},
scrollByX:function(a){qx.ui.core.queue.Manager.flush();
this.getChildControl("scrollbar-x").scrollBy(a)},
getScrollX:function(){var a=this.getChildControl("scrollbar-x",true);
return a?a.getPosition():0},
scrollToY:function(a){qx.ui.core.queue.Manager.flush();
this.getChildControl("scrollbar-y").scrollTo(a)},
scrollByY:function(a){qx.ui.core.queue.Manager.flush();
this.getChildControl("scrollbar-y").scrollBy(a)},
getScrollY:function(){var a=this.getChildControl("scrollbar-y",true);
return a?a.getPosition():0},
_onScrollBarX:function(a){this.getChildControl("pane").scrollToX(a.getData())},
_onScrollBarY:function(a){this.getChildControl("pane").scrollToY(a.getData())},
_onScrollPaneX:function(b){var a=b.getData();
this.scrollToX(a);
this.fireDataEvent("scrollX",a)},
_onScrollPaneY:function(b){var a=b.getData();
this.scrollToY(a);
this.fireDataEvent("scrollY",a)},
_onMouseWheel:function(a){var d=this._isChildControlVisible("scrollbar-x"),c=this._isChildControlVisible("scrollbar-y"),b=c?this.getChildControl("scrollbar-y",true):d?this.getChildControl("scrollbar-x",true):null;
b&&(b.scrollBySteps(a.getWheelDelta()),a.stop())},
_onTouchMove:function(a){this._onTouchMoveDirectional("x",a);
this._onTouchMoveDirectional("y",a);
a.stop()},
_onTouchMoveDirectional:function(a,c){var e=(a=="x"?"Left":"Top"),d=this.getChildControl("scrollbar-"+a,true),f=this._isChildControlVisible("scrollbar-"+a),b;
if(f&&d){if(this.__gQ654[a]==0)b=0;
else b=-(c["getDocument"+e]()-this.__gQ654[a]);
this.__gQ654[a]=c["getDocument"+e]();
d.scrollBy(b);
this.__baW5Ym[a]&&(clearTimeout(this.__baW5Ym[a]),this.__baW5Ym[a]=null);
this.__baW5Ym[a]=setTimeout(qx.lang.Function.bind(function(b){this.__bQcqWP(b,a)},this,b),100)}},
__bQcqWP:function(a,b){this.__baW5Ym[b]=null;
var d=this._isChildControlVisible("scrollbar-"+b),c;
if(a==0||!d)return;
a=a>0?Math.max(0,a-3):Math.min(0,a+3);
this.__baW5Ym[b]=setTimeout(qx.lang.Function.bind(function(a,b){this.__bQcqWP(a,b)},this,a,b),20);
c=this.getChildControl("scrollbar-"+b,true);
c.scrollBy(a)},
_onChangeScrollbarXVisibility:function(c){var a=this._isChildControlVisible("scrollbar-x"),b=this._isChildControlVisible("scrollbar-y");
a||this.scrollToX(0);
a&&b?this._showChildControl("corner"):this._excludeChildControl("corner")},
_onChangeScrollbarYVisibility:function(c){var b=this._isChildControlVisible("scrollbar-x"),a=this._isChildControlVisible("scrollbar-y");
a||this.scrollToY(0);
b&&a?this._showChildControl("corner"):this._excludeChildControl("corner")},
_computeScrollbars:function(){var h=this.getChildControl("pane"),k=h.getChildren()[0],e,b,a,g,f,c,d,i,j;
if(!k){this._excludeChildControl("scrollbar-x");
this._excludeChildControl("scrollbar-y");
return}e=this.getInnerSize(),b=h.getInnerSize(),a=h.getScrollSize();
if(!b||!a)return;
g=this.getScrollbarX(),f=this.getScrollbarY();
if(g==="auto"&&f==="auto"){c=a.width>e.width,d=a.height>e.height;
(c||d)&&!(c&&d)&&(c?d=a.height>b.height:d&&(c=a.width>b.width))}else{c=g==="on",d=f==="on";
a.width>(c?b.width:e.width)&&g==="auto"&&(c=true);
a.height>(c?b.height:e.height)&&f==="auto"&&(d=true)}if(c){i=this.getChildControl("scrollbar-x");
i.show();
i.setMaximum(Math.max(0,a.width-b.width));
i.setKnobFactor(a.width===0?0:b.width/a.width)}else this._excludeChildControl("scrollbar-x");
if(d){j=this.getChildControl("scrollbar-y");
j.show();
j.setMaximum(Math.max(0,a.height-b.height));
j.setKnobFactor(a.height===0?0:b.height/a.height)}else this._excludeChildControl("scrollbar-y")}}});


// qx.ui.container.Scroll
//   - size: 461 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.MContentPadding, 1x
//       qx.ui.core.scroll.AbstractScrollArea, 1x
qx.Class.define("qx.ui.container.Scroll",{extend:qx.ui.core.scroll.AbstractScrollArea,
include:[qx.ui.core.MContentPadding],
construct:function(a){this.base(arguments);
a&&this.add(a)},
members:{add:function(a){this.getChildControl("pane").add(a)},
remove:function(a){this.getChildControl("pane").remove(a)},
getChildren:function(){return this.getChildControl("pane").getChildren()},
_getContentPaddingTarget:function(){return this.getChildControl("pane")}}});


// qx.ui.tabview.Page
//   - size: 1328 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.tabview.TabButton, 1x
qx.Class.define("qx.ui.tabview.Page",{extend:qx.ui.container.Composite,
construct:function(b,a){this.base(arguments);
this._createChildControl("button");
b!=null&&this.setLabel(b);
a!=null&&this.setIcon(a)},
events:{close:"qx.event.type.Event"},
properties:{appearance:{refine:true,
init:"tabview-page"},
label:{check:"String",
init:"",
apply:"_applyLabel"},
icon:{check:"String",
init:"",
apply:"_applyIcon"},
showCloseButton:{check:"Boolean",
init:false,
apply:"_applyShowCloseButton"}},
members:{_forwardStates:{barTop:1,
barRight:1,
barBottom:1,
barLeft:1,
firstTab:1,
lastTab:1},
_applyIcon:function(a,b){this.getChildControl("button").setIcon(a)},
_applyLabel:function(a,b){this.getChildControl("button").setLabel(a)},
_applyEnabled:function(a,c){this.base(arguments,a,c);
var b=this.getChildControl("button");
a==null?b.resetEnabled():b.setEnabled(a)},
_createChildControlImpl:function(b){var a;
switch(b){case"button":a=new qx.ui.tabview.TabButton;
a.setAllowGrowX(true);
a.setAllowGrowY(true);
a.setUserData("page",this);
a.addListener("close",this._onButtonClose,this);
break}return a||this.base(arguments,b)},
_applyShowCloseButton:function(a,b){this.getChildControl("button").setShowCloseButton(a)},
_onButtonClose:function(){this.fireEvent("close")},
getButton:function(){return this.getChildControl("button")}}});


// apiviewer.ui.LegendView
//   - size: 2085 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       apiviewer, 1x
//       qx, 6x
//   - packages:
//       apiviewer.TreeUtil.iconNameToIconPath, 1x
//       qx.Class.define, 1x
//       qx.ui.basic.Image, 1x
//       qx.ui.basic.Label, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.container.Scroll, 1x
//       qx.ui.layout.Grid, 1x
qx.Class.define("apiviewer.ui.LegendView",{extend:qx.ui.container.Scroll,
construct:function(){this.base(arguments);
this.setAppearance("legend");
var d=new qx.ui.layout.Grid(10,10),e,f,c,b,a;
d.setColumnWidth(1,150);
d.setColumnFlex(1,1);
e=new qx.ui.container.Composite(d);
this.__qdSs6=[{icon:"ICON_PACKAGE",
desc:"Package"},{icon:"ICON_CLASS",
desc:"Class"},{icon:"ICON_CLASS_STATIC",
desc:"Static Class"},{icon:"ICON_CLASS_ABSTRACT",
desc:"Abstract Class"},{icon:"ICON_CLASS_SINGLETON",
desc:"Singleton Class"},{icon:"ICON_INTERFACE",
desc:"Interface"},{icon:"ICON_MIXIN",
desc:"Mixin"},{icon:"ICON_CHILDCONTROL",
desc:"Child Control"},{icon:"ICON_METHOD_PUB",
desc:"Public Method"},{icon:"ICON_METHOD_PROT",
desc:"Protected Method"},{icon:"ICON_METHOD_PRIV",
desc:"Private Method"},{icon:"ICON_PROPERTY_PUB",
desc:"Public Property"},{icon:"ICON_PROPERTY_PROT",
desc:"Protected Property"},{icon:"ICON_PROPERTY_PRIV",
desc:"Private Property"},{icon:"ICON_PROPERTY_PUB_THEMEABLE",
desc:"Themeable Property"},{icon:"ICON_EVENT",
desc:"Event"},{icon:"ICON_CONSTANT",
desc:"Constant"},{icon:"ICON_BLANK",
desc:"<span style=\"text-decoration: line-through;color: #7193b9;\">deprecated</span>"},{icon:"OVERLAY_WARN",
desc:"Package/Class/Mixin/Interface is not fully documented"},{icon:"OVERLAY_ERROR",
desc:"Method/Property/Event is not fully documented"},{icon:"OVERLAY_MIXIN",
desc:"Method/Property is included from a mixin"},{icon:"OVERLAY_INHERITED",
desc:"Method/Property/Event is inherited from one of the super classes"},{icon:"OVERLAY_OVERRIDDEN",
desc:"Method/Property overrides the Method/Property of the super class"}];
f=this.__qdSs6.length,a=0;
for(;
a<f;
a++)c=this.__qdSs6[a],b=apiviewer.TreeUtil.iconNameToIconPath(c.icon),typeof b!="string"&&(b=b[0]),e.add(new qx.ui.basic.Image(b).set({alignX:"center",
alignY:"middle"}),{row:a,
column:0}),e.add(new qx.ui.basic.Label(c.desc).set({rich:true,
appearance:a<17?"legendview-label-important":"legendview-label"}),{row:a,
column:1});
this.add(e)},
members:{__qdSs6:null},
destruct:function(){this._disposeMap("__legend")}});


// apiviewer.ui.tabview.AbstractPage
//   - size: 1277 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Error, 1x
//       apiviewer, 3x
//       qx, 4x
//   - packages:
//       apiviewer.TreeUtil.getIconUrl, 1x
//       apiviewer.UiModel.getInstance, 2x
//       qx.Class.define, 1x
//       qx.event.Timer.once, 1x
//       qx.ui.layout.Canvas, 1x
//       qx.ui.tabview.Page, 1x
qx.Class.define("apiviewer.ui.tabview.AbstractPage",{extend:qx.ui.tabview.Page,
type:"abstract",
construct:function(a){this.base(arguments);
this.setLayout(new qx.ui.layout.Canvas());
this.setShowCloseButton(true);
this._bindings=[];
this._viewer=this._createViewer();
this.add(this._viewer,{edge:0});
this.__IQwWg(this._viewer);
this.setClassNode(a)},
properties:{classNode:{apply:"_applyClassNode"}},
members:{_viewer:null,
_bindings:null,
_createViewer:function(){throw new Error("Abstract method call!")},
_applyClassNode:function(a,b){this._viewer.setDocNode(a);
this.setLabel(a.getFullName());
this.setIcon(apiviewer.TreeUtil.getIconUrl(a));
this.setUserData("nodeName",a.getFullName());
qx.event.Timer.once(function(a){this._viewer.getContentElement().scrollToY(0)},this,0)},
__IQwWg:function(c){var b=apiviewer.UiModel.getInstance(),a=this._bindings;
a.push(b.bind("showInherited",c,"showInherited"));
a.push(b.bind("expandProperties",c,"expandProperties"));
a.push(b.bind("showProtected",c,"showProtected"));
a.push(b.bind("showPrivate",c,"showPrivate"))},
__2OMfA:function(){var c=apiviewer.UiModel.getInstance(),a=this._bindings,b;
while(a.length>0){b=a.pop();
c.removeBinding(b)}}},
destruct:function(){this.__2OMfA();
this._viewer.destroy();
this._viewer=null}});


// qx.ui.tabview.TabView
//   - size: 4184 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       Error, 1x
//       qx, 11x
//   - packages:
//       qx.Class.define, 1x
//       qx.event.type.Event, 1x
//       qx.ui.container.SlideBar, 1x
//       qx.ui.container.Stack, 1x
//       qx.ui.core.ISingleSelection, 1x
//       qx.ui.core.MContentPadding, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.form.RadioGroup, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.layout.VBox, 1x
//       qx.ui.tabview.Page, 1x
qx.Class.define("qx.ui.tabview.TabView",{extend:qx.ui.core.Widget,
implement:qx.ui.core.ISingleSelection,
include:[qx.ui.core.MContentPadding],
construct:function(a){this.base(arguments);
this.__bHdRVN={top:"barTop",
right:"barRight",
bottom:"barBottom",
left:"barLeft"};
this._createChildControl("bar");
this._createChildControl("pane");
var b=this.__JcNT5=new qx.ui.form.RadioGroup;
b.setWrap(false);
b.addListener("changeSelection",this._onChangeSelection,this);
a!=null?this.setBarPosition(a):this.initBarPosition()},
events:{changeSelection:"qx.event.type.Data"},
properties:{appearance:{refine:true,
init:"tabview"},
barPosition:{check:["left","right","top","bottom"],
init:"top",
apply:"_applyBarPosition"}},
members:{__JcNT5:null,
_createChildControlImpl:function(b){var a;
switch(b){case"bar":a=new qx.ui.container.SlideBar();
a.setZIndex(10);
this._add(a);
break;
case"pane":a=new qx.ui.container.Stack;
a.setZIndex(5);
this._add(a,{flex:1});
break}return a||this.base(arguments,b)},
_getContentPaddingTarget:function(){return this.getChildControl("pane")},
add:function(a){if(!(a instanceof qx.ui.tabview.Page))throw new Error("Incompatible child for TabView: "+a);
var c=a.getButton(),e=this.getChildControl("bar"),d=this.getChildControl("pane"),b;
a.exclude();
e.add(c);
d.add(a);
this.__JcNT5.add(c);
a.addState(this.__bHdRVN[this.getBarPosition()]);
a.addState("lastTab");
b=this.getChildren();
b[0]==a?a.addState("firstTab"):b[b.length-2].removeState("lastTab");
a.addListener("close",this._onPageClose,this)},
remove:function(a){var d=this.getChildControl("pane"),f=this.getChildControl("bar"),c=a.getButton(),b=d.getChildren(),e;
if(this.getSelection()[0]==a){e=b.indexOf(a);
e==0?b[1]?this.setSelection([b[1]]):this.resetSelection():this.setSelection([b[e-1]])}f.remove(c);
d.remove(a);
this.__JcNT5.remove(c);
a.removeState(this.__bHdRVN[this.getBarPosition()]);
a.hasState("firstTab")&&(a.removeState("firstTab"),b[0]&&b[0].addState("firstTab"));
a.hasState("lastTab")&&(a.removeState("lastTab"),b.length>0&&b[b.length-1].addState("lastTab"));
a.removeListener("close",this._onPageClose,this)},
getChildren:function(){return this.getChildControl("pane").getChildren()},
indexOf:function(a){return this.getChildControl("pane").indexOf(a)},
__bHdRVN:null,
_applyBarPosition:function(a,k){var e=this.getChildControl("bar"),f=a=="left"||a=="right",l=a=="right"||a=="bottom",g=f?qx.ui.layout.HBox:qx.ui.layout.VBox,c=this._getLayout(),d,i,b,h,j;
c&&c instanceof g||this._setLayout(c=new g);
c.setReversed(l);
e.setOrientation(f?"vertical":"horizontal");
d=this.getChildren();
if(k){i=this.__bHdRVN[k];
e.removeState(i);
for(b=0,h=d.length;
b<h;
b++)d[b].removeState(i)}if(a){j=this.__bHdRVN[a];
e.addState(j);
for(b=0,h=d.length;
b<h;
b++)d[b].addState(j)}},
getSelection:function(){for(var c=this.__JcNT5.getSelection(),b=[],a=0;
a<c.length;
a++)b.push(c[a].getUserData("page"));
return b},
setSelection:function(b){for(var c=[],a=0;
a<b.length;
a++)c.push(b[a].getChildControl("button"));
this.__JcNT5.setSelection(c)},
resetSelection:function(){this.__JcNT5.resetSelection()},
isSelected:function(b){var a=b.getChildControl("button");
return this.__JcNT5.isSelected(a)},
isSelectionEmpty:function(){return this.__JcNT5.isSelectionEmpty()},
getSelectables:function(d){for(var c=this.__JcNT5.getSelectables(d),b=[],a=0;
a<c.length;
a++)b.push(c[a].getUserData("page"));
return b},
_onChangeSelection:function(e){var d=this.getChildControl("pane"),a=e.getData()[0],f=e.getOldData()[0],b=[],c=[];
a?(b=[a.getUserData("page")],d.setSelection(b),a.focus(),this.scrollChildIntoView(a,null,null,false)):d.resetSelection();
f&&(c=[f.getUserData("page")]);
this.fireDataEvent("changeSelection",b,c)},
_onBeforeChangeSelection:function(a){this.fireNonBubblingEvent("beforeChangeSelection",qx.event.type.Event,[false,true])||a.preventDefault()},
_onRadioChangeSelection:function(b){var a=b.getData()[0];
a?this.setSelection([a.getUserData("page")]):this.resetSelection()},
_onPageClose:function(b){var a=b.getTarget(),c=a.getButton().getChildControl("close-button");
c.reset();
this.remove(a)}},
destruct:function(){this._disposeObjects("__radioGroup");
this.__bHdRVN=null}});


// qx.ui.table.pane.Header
//   - size: 2661 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       qx, 4x
//       undefined, 1x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.Blocker, 1x
//       qx.ui.core.Widget, 1x
//       qx.ui.layout.HBox, 1x
qx.Class.define("qx.ui.table.pane.Header",{extend:qx.ui.core.Widget,
construct:function(a){this.base(arguments);
this._setLayout(new qx.ui.layout.HBox());
this.__ukeJN=new qx.ui.core.Blocker(this);
this.__VtpeD=a},
members:{__VtpeD:null,
__UZqTn:null,
__bRA3mc:null,
__ukeJN:null,
getPaneScroller:function(){return this.__VtpeD},
getTable:function(){return this.__VtpeD.getTable()},
getBlocker:function(){return this.__ukeJN},
onColOrderChanged:function(){this._updateContent(true)},
onPaneModelChanged:function(){this._updateContent(true)},
onTableModelMetaDataChanged:function(){this._updateContent()},
setColumnWidth:function(b,c,d){var a=this.getHeaderWidgetAtColumn(b);
a!=null&&a.setWidth(c)},
setMouseOverColumn:function(a){if(a!=this.__bRA3mc){if(this.__bRA3mc!=null){var b=this.getHeaderWidgetAtColumn(this.__bRA3mc);
b!=null&&b.removeState("hovered")}a!=null&&this.getHeaderWidgetAtColumn(a).addState("hovered");
this.__bRA3mc=a}},
getHeaderWidgetAtColumn:function(a){var b=this.getPaneScroller().getTablePaneModel().getX(a);
return this._getChildren()[b]},
showColumnMoveFeedback:function(b,g){var e=this.getContainerLocation(),c,f,l,k,i,h,j,a,d;
if(this.__UZqTn==null){c=this.getTable(),f=this.getPaneScroller().getTablePaneModel().getX(b),l=this._getChildren()[f],k=c.getTableModel(),i=c.getTableColumnModel(),h={xPos:f,
col:b,
name:k.getColumnName(b),
table:c},j=i.getHeaderCellRenderer(b),a=j.createHeaderCell(h),d=l.getBounds();
a.setWidth(d.width);
a.setHeight(d.height);
a.setZIndex(1000000);
a.setOpacity(.8);
a.setLayoutProperties({top:e.top});
this.getApplicationRoot().add(a);
this.__UZqTn=a}this.__UZqTn.setLayoutProperties({left:e.left+g});
this.__UZqTn.show()},
hideColumnMoveFeedback:function(){this.__UZqTn!=null&&(this.__UZqTn.destroy(),this.__UZqTn=null)},
isShowingColumnMoveFeedback:function(){return this.__UZqTn!=null},
_updateContent:function(j){var f=this.getTable(),e=f.getTableModel(),g=f.getTableColumnModel(),i=this.getPaneScroller().getTablePaneModel(),n=this._getChildren(),m=i.getColumnCount(),l=e.getSortColumnIndex(),a,c,b,k,h,d;
j&&this._cleanUpCells();
a={};
a.sortedAscending=e.isSortAscending();
for(c=0;
c<m;
c++){b=i.getColumnAtX(c);
if(b===undefined)continue;
k=g.getColumnWidth(b),h=g.getHeaderCellRenderer(b);
a.xPos=c;
a.col=b;
a.name=e.getColumnName(b);
a.editable=e.isColumnEditable(b);
a.sorted=b==l;
a.table=f;
d=n[c];
d==null?(d=h.createHeaderCell(a),d.set({width:k}),this._add(d)):h.updateHeaderCell(a,d)}},
_cleanUpCells:function(){for(var b=this._getChildren(),a=b.length-1,c;
a>=0;
a--){c=b[a];
c.destroy()}}},
destruct:function(){this.__ukeJN.dispose();
this._disposeObjects("__paneScroller")}});


// qx.ui.table.columnmodel.Basic
//   - size: 6850 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       Array, 1x
//       Error, 2x
//       qx, 13x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.lang.Array.clone, 1x
//       qx.ui.table.ICellEditorFactory, 1x
//       qx.ui.table.ICellRenderer, 1x
//       qx.ui.table.IHeaderRenderer, 1x
//       qx.ui.table.celleditor.TextField, 1x
//       qx.ui.table.cellrenderer.Default, 1x
//       qx.ui.table.columnmodel.Basic.DEFAULT_DATA_RENDERER, 1x
//       qx.ui.table.columnmodel.Basic.DEFAULT_EDITOR_FACTORY, 1x
//       qx.ui.table.columnmodel.Basic.DEFAULT_HEADER_RENDERER, 1x
//       qx.ui.table.columnmodel.Basic.DEFAULT_WIDTH, 1x
//       qx.ui.table.headerrenderer.Default, 1x
qx.Class.define("qx.ui.table.columnmodel.Basic",{extend:qx.core.Object,
construct:function(){this.base(arguments);
this.__bqB3IN=[];
this.__bqk0GG=[]},
events:{widthChanged:"qx.event.type.Data",
visibilityChangedPre:"qx.event.type.Data",
visibilityChanged:"qx.event.type.Data",
orderChanged:"qx.event.type.Data"},
statics:{DEFAULT_WIDTH:100,
DEFAULT_HEADER_RENDERER:qx.ui.table.headerrenderer.Default,
DEFAULT_DATA_RENDERER:qx.ui.table.cellrenderer.Default,
DEFAULT_EDITOR_FACTORY:qx.ui.table.celleditor.TextField},
members:{__98uYg:null,
__T6ZcG:null,
__bqk0GG:null,
__bqB3IN:null,
__18YOe:null,
__8x3sF:null,
__UzAiG:null,
__2m0jG:null,
init:function(d,f){this.assertInteger(d,"Invalid argument 'colCount'.");
this.__18YOe=[];
var h=qx.ui.table.columnmodel.Basic.DEFAULT_WIDTH,g=this.__8x3sF||(this.__8x3sF=new qx.ui.table.columnmodel.Basic.DEFAULT_HEADER_RENDERER()),i=this.__UzAiG||(this.__UzAiG=new qx.ui.table.columnmodel.Basic.DEFAULT_DATA_RENDERER()),j=this.__2m0jG||(this.__2m0jG=new qx.ui.table.columnmodel.Basic.DEFAULT_EDITOR_FACTORY()),b,a,c,e;
this.__bqB3IN=[];
this.__bqk0GG=[];
f&&(b=f.getInitiallyHiddenColumns());
b=b||[];
for(a=0;
a<d;
a++)this.__18YOe[a]={width:h,
headerRenderer:g,
dataRenderer:i,
editorFactory:j},this.__bqB3IN[a]=a,this.__bqk0GG[a]=a;
this.__T6ZcG=null;
this.__98uYg=true;
for(c=0;
c<b.length;
c++)this.setColumnVisible(b[c],false);
this.__98uYg=false;
for(a=0;
a<d;
a++){e={col:a,
visible:this.isColumnVisible(a)};
this.fireDataEvent("visibilityChangedPre",e);
this.fireDataEvent("visibilityChanged",e)}},
getVisibleColumns:function(){return this.__bqk0GG!=null?this.__bqk0GG:[]},
setColumnWidth:function(a,b,d){this.assertInteger(a,"Invalid argument 'col'."),this.assertInteger(b,"Invalid argument 'width'."),this.assertNotUndefined(this.__18YOe[a],"Column not found in table model");
var c=this.__18YOe[a].width,e;
if(c!=b){this.__18YOe[a].width=b;
e={col:a,
newWidth:b,
oldWidth:c,
isMouseAction:d||false};
this.fireDataEvent("widthChanged",e)}},
getColumnWidth:function(a){this.assertInteger(a,"Invalid argument 'col'."),this.assertNotUndefined(this.__18YOe[a],"Column not found in table model");
return this.__18YOe[a].width},
setHeaderCellRenderer:function(a,b){this.assertInteger(a,"Invalid argument 'col'."),this.assertInterface(b,qx.ui.table.IHeaderRenderer,"Invalid argument 'renderer'."),this.assertNotUndefined(this.__18YOe[a],"Column not found in table model");
var c=this.__18YOe[a].headerRenderer;
c!==this.__8x3sF&&c.dispose();
this.__18YOe[a].headerRenderer=b},
getHeaderCellRenderer:function(a){this.assertInteger(a,"Invalid argument 'col'."),this.assertNotUndefined(this.__18YOe[a],"Column not found in table model");
return this.__18YOe[a].headerRenderer},
setDataCellRenderer:function(a,b){this.assertInteger(a,"Invalid argument 'col'."),this.assertInterface(b,qx.ui.table.ICellRenderer,"Invalid argument 'renderer'."),this.assertNotUndefined(this.__18YOe[a],"Column not found in table model");
var c=this.__18YOe[a].dataRenderer;
c!==this.__UzAiG&&c.dispose();
this.__18YOe[a].dataRenderer=b},
getDataCellRenderer:function(a){this.assertInteger(a,"Invalid argument 'col'."),this.assertNotUndefined(this.__18YOe[a],"Column not found in table model");
return this.__18YOe[a].dataRenderer},
setCellEditorFactory:function(a,b){this.assertInteger(a,"Invalid argument 'col'."),this.assertInterface(b,qx.ui.table.ICellEditorFactory,"Invalid argument 'factory'."),this.assertNotUndefined(this.__18YOe[a],"Column not found in table model");
var c=this.__18YOe[a].headerRenderer;
c!==this.__2m0jG&&c.dispose();
this.__18YOe[a].editorFactory=b},
getCellEditorFactory:function(a){this.assertInteger(a,"Invalid argument 'col'."),this.assertNotUndefined(this.__18YOe[a],"Column not found in table model");
return this.__18YOe[a].editorFactory},
_getColToXPosMap:function(){if(this.__T6ZcG==null){this.__T6ZcG={};
for(var a=0,c,b;
a<this.__bqB3IN.length;
a++){c=this.__bqB3IN[a];
this.__T6ZcG[c]={overX:a}}for(b=0;
b<this.__bqk0GG.length;
b++){c=this.__bqk0GG[b];
this.__T6ZcG[c].visX=b}}return this.__T6ZcG},
getVisibleColumnCount:function(){return this.__bqk0GG!=null?this.__bqk0GG.length:0},
getVisibleColumnAtX:function(a){this.assertInteger(a,"Invalid argument 'visXPos'.");
return this.__bqk0GG[a]},
getVisibleX:function(a){this.assertInteger(a,"Invalid argument 'col'.");
return this._getColToXPosMap()[a].visX},
getOverallColumnCount:function(){return this.__bqB3IN.length},
getOverallColumnAtX:function(a){this.assertInteger(a,"Invalid argument 'overXPos'.");
return this.__bqB3IN[a]},
getOverallX:function(a){this.assertInteger(a,"Invalid argument 'col'.");
return this._getColToXPosMap()[a].overX},
isColumnVisible:function(a){this.assertInteger(a,"Invalid argument 'col'.");
return this._getColToXPosMap()[a].visX!=null},
setColumnVisible:function(a,c){this.assertInteger(a,"Invalid argument 'col'."),this.assertBoolean(c,"Invalid argument 'visible'.");
if(c!=this.isColumnVisible(a)){if(c){var f=this._getColToXPosMap(),g=f[a].overX,b,d,i,h,j,e;
if(g==null)throw new Error("Showing column failed: "+a+". The column is not added to this TablePaneModel.");
d=g+1;
for(;
d<this.__bqB3IN.length;
d++){i=this.__bqB3IN[d],h=f[i].visX;
if(h!=null){b=h;
break}}b==null&&(b=this.__bqk0GG.length);
this.__bqk0GG.splice(b,0,a)}else{j=this.getVisibleX(a);
this.__bqk0GG.splice(j,1)}this.__T6ZcG=null;
if(!this.__98uYg){e={col:a,
visible:c};
this.fireDataEvent("visibilityChangedPre",e);
this.fireDataEvent("visibilityChanged",e)}}},
moveColumn:function(b,c){this.assertInteger(b,"Invalid argument 'fromOverXPos'."),this.assertInteger(c,"Invalid argument 'toOverXPos'.");
this.__98uYg=true;
var a=this.__bqB3IN[b],d=this.isColumnVisible(a),e;
d&&this.setColumnVisible(a,false);
this.__bqB3IN.splice(b,1);
this.__bqB3IN.splice(c,0,a);
this.__T6ZcG=null;
d&&this.setColumnVisible(a,true);
this.__98uYg=false;
e={col:a,
fromOverXPos:b,
toOverXPos:c};
this.fireDataEvent("orderChanged",e)},
setColumnsOrder:function(b){this.assertArray(b,"Invalid argument 'newPositions'.");
if(b.length==this.__bqB3IN.length){this.__98uYg=true;
for(var d=new Array(b.length),a=0,c;
a<this.__bqB3IN.length;
a++){c=this.isColumnVisible(a);
d[a]=c;
c&&this.setColumnVisible(a,false)}this.__bqB3IN=qx.lang.Array.clone(b);
this.__T6ZcG=null;
for(a=0;
a<this.__bqB3IN.length;
a++)d[a]&&this.setColumnVisible(a,true);
this.__98uYg=false;
this.fireDataEvent("orderChanged")}else throw new Error("setColumnsOrder: Invalid number of column positions given, expected "+this.__bqB3IN.length+", got "+b.length)}},
destruct:function(){for(var a=0;
a<this.__18YOe.length;
a++)this.__18YOe[a].headerRenderer.dispose(),this.__18YOe[a].dataRenderer.dispose(),this.__18YOe[a].editorFactory.dispose();
this.__bqB3IN=this.__bqk0GG=this.__18YOe=this.__T6ZcG=null;
this._disposeObjects("__headerRenderer","__dataRenderer","__editorFactory")}});


// qx.ui.tree.Tree
//   - size: 4027 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       qx, 13x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.core.IMultiSelection, 1x
//       qx.ui.core.MContentPadding, 1x
//       qx.ui.core.MMultiSelectionHandling, 1x
//       qx.ui.core.scroll.AbstractScrollArea, 1x
//       qx.ui.form.IForm, 1x
//       qx.ui.form.IModelSelection, 1x
//       qx.ui.form.MForm, 1x
//       qx.ui.form.MModelSelection, 1x
//       qx.ui.layout.VBox, 1x
//       qx.ui.tree.AbstractTreeItem, 1x
//       qx.ui.tree.SelectionManager, 1x
qx.Class.define("qx.ui.tree.Tree",{extend:qx.ui.core.scroll.AbstractScrollArea,
implement:[qx.ui.core.IMultiSelection,qx.ui.form.IModelSelection,qx.ui.form.IForm],
include:[qx.ui.core.MMultiSelectionHandling,qx.ui.core.MContentPadding,qx.ui.form.MModelSelection,qx.ui.form.MForm],
construct:function(){this.base(arguments);
this.__uIY86=new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({allowShrinkY:false,
allowGrowX:true});
this.getChildControl("pane").add(this.__uIY86);
this.initOpenMode();
this.initRootOpenClose();
this.addListener("changeSelection",this._onChangeSelection,this);
this.addListener("keypress",this._onKeyPress,this)},
events:{addItem:"qx.event.type.Data",
removeItem:"qx.event.type.Data"},
properties:{openMode:{check:["click","dblclick","none"],
init:"dblclick",
apply:"_applyOpenMode",
event:"changeOpenMode",
themeable:true},
root:{check:"qx.ui.tree.AbstractTreeItem",
init:null,
nullable:true,
event:"changeRoot",
apply:"_applyRoot"},
hideRoot:{check:"Boolean",
init:false,
apply:"_applyHideRoot"},
rootOpenClose:{check:"Boolean",
init:false,
apply:"_applyRootOpenClose"},
appearance:{refine:true,
init:"tree"},
focusable:{refine:true,
init:true}},
members:{__uIY86:null,
SELECTION_MANAGER:qx.ui.tree.SelectionManager,
getChildrenContainer:function(){return this.__uIY86},
_applyRoot:function(a,b){var c=this.getChildrenContainer();
b&&(c.remove(b),b.hasChildren()&&c.remove(b.getChildrenContainer()));
a&&(c.add(a),a.hasChildren()&&c.add(a.getChildrenContainer()),a.setVisibility(this.getHideRoot()?"excluded":"visible"),a.recursiveAddToWidgetQueue())},
_applyHideRoot:function(b,c){var a=this.getRoot();
if(!a)return;
a.setVisibility(b?"excluded":"visible");
a.recursiveAddToWidgetQueue()},
_applyRootOpenClose:function(b,c){var a=this.getRoot();
if(!a)return;
a.recursiveAddToWidgetQueue()},
_getContentPaddingTarget:function(){return this.__uIY86},
getNextNodeOf:function(a,e){if((e!==false||a.isOpen())&&a.hasChildren())return a.getChildren()[0];
while(a){var b=a.getParent(),c,d;
if(!b)return null;
c=b.getChildren(),d=c.indexOf(a);
if(d>-1&&d<c.length-1)return c[d+1];
a=b}return null},
getPreviousNodeOf:function(c,g){var b=c.getParent(),e,f,a,d;
if(!b)return null;
if(this.getHideRoot()){if(b==this.getRoot())if(b.getChildren()[0]==c)return null}else if(c==this.getRoot())return null;
e=b.getChildren(),f=e.indexOf(c);
if(f>0){a=e[f-1];
while((g!==false||a.isOpen())&&a.hasChildren()){d=a.getChildren();
a=d[d.length-1]}return a}return b},
getNextSiblingOf:function(a){if(a==this.getRoot())return null;
var d=a.getParent(),b=d.getChildren(),c=b.indexOf(a);
if(c<b.length-1)return b[c+1];
return null},
getPreviousSiblingOf:function(a){if(a==this.getRoot())return null;
var d=a.getParent(),c=d.getChildren(),b=c.indexOf(a);
if(b>0)return c[b-1];
return null},
getItems:function(a,b){return this.getRoot()!=null?this.getRoot().getItems(a,b,this.getHideRoot()):[]},
getChildren:function(){return this.getRoot()!=null?[this.getRoot()]:[]},
getTreeItem:function(a){while(a){if(a==this)return null;
if(a instanceof qx.ui.tree.AbstractTreeItem)return a;
a=a.getLayoutParent()}return null},
_applyOpenMode:function(a,b){b=="click"?this.removeListener("click",this._onOpen,this):b=="dblclick"&&this.removeListener("dblclick",this._onOpen,this);
a=="click"?this.addListener("click",this._onOpen,this):a=="dblclick"&&this.addListener("dblclick",this._onOpen,this)},
_onOpen:function(b){var a=this.getTreeItem(b.getTarget());
if(!a||!a.isOpenable())return;
a.setOpen(!a.isOpen());
b.stopPropagation()},
_onChangeSelection:function(d){for(var c=d.getData(),b=0,a;
b<c.length;
b++){a=c[b];
while(a.getParent()!=null)a=a.getParent(),a.setOpen(true)}},
_onKeyPress:function(b){var a=this._getLeadItem();
if(a!==null)switch(b.getKeyIdentifier()){case"Left":a.isOpenable()&&a.isOpen()&&a.setOpen(false);
break;
case"Right":a.isOpenable()&&!a.isOpen()&&a.setOpen(true);
break;
case"Enter":case"Space":a.isOpenable()&&a.toggleOpen();
break}}},
destruct:function(){this._disposeObjects("__content")}});


// qx.ui.table.columnmodel.Resize
//   - size: 2939 bytes
//   - modified: 2010-08-26T21:43:54
//   - names:
//       qx, 10x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Setting.get, 5x
//       qx.event.Timer.once, 1x
//       qx.locale.MTranslation, 1x
//       qx.ui.table.columnmodel.Basic, 1x
//       qx.ui.table.columnmodel.resizebehavior.Default, 1x
qx.Class.define("qx.ui.table.columnmodel.Resize",{extend:qx.ui.table.columnmodel.Basic,
include:qx.locale.MTranslation,
construct:function(){this.base(arguments);
this.__NFZdV=false;
this.__Cykvf=false},
properties:{behavior:{check:"qx.ui.table.columnmodel.resizebehavior.Abstract",
init:null,
nullable:true,
apply:"_applyBehavior",
event:"changeBehavior"}},
members:{__Cykvf:null,
__NFZdV:null,
__mFTjD:null,
_applyBehavior:function(b,a){a!=null&&(a.dispose(),a=null);
b._setNumColumns(this.getOverallColumnCount());
b.setTableColumnModel(this)},
init:function(b,a){this.base(arguments,b,a);
this.__mFTjD==null&&(this.__mFTjD=a,a.addListener("appear",this._onappear,this),a.addListener("tableWidthChanged",this._onTableWidthChanged,this),a.addListener("verticalScrollBarChanged",this._onverticalscrollbarchanged,this),a.addListener("columnVisibilityMenuCreateEnd",this._addResetColumnWidthButton,this),this.addListener("widthChanged",this._oncolumnwidthchanged,this),this.addListener("visibilityChanged",this._onvisibilitychanged,this));
this.getBehavior()==null&&this.setBehavior(new qx.ui.table.columnmodel.resizebehavior.Default());
this.getBehavior()._setNumColumns(b)},
getTable:function(){return this.__mFTjD},
_addResetColumnWidthButton:function(e){var b=e.getData(),c=b.columnButton,d=b.menu,a;
a=c.factory("separator");
d.add(a);
a=c.factory("user-button",{text:this.tr("Reset column widths")});
d.add(a);
a.addListener("execute",this._onappear,this)},
_onappear:function(a){if(this.__NFZdV)return;
this.__NFZdV=true;
qx.core.Setting.get("qx.tableResizeDebug")&&this.debug("onappear");
this.getBehavior().onAppear(a,a.getType()!=="appear");
this.__mFTjD._updateScrollerWidths();
this.__mFTjD._updateScrollBarVisibility();
this.__NFZdV=false;
this.__Cykvf=true},
_onTableWidthChanged:function(a){if(this.__NFZdV||!this.__Cykvf)return;
this.__NFZdV=true;
qx.core.Setting.get("qx.tableResizeDebug")&&this.debug("ontablewidthchanged");
this.getBehavior().onTableWidthChanged(a);
this.__NFZdV=false},
_onverticalscrollbarchanged:function(a){if(this.__NFZdV||!this.__Cykvf)return;
this.__NFZdV=true;
qx.core.Setting.get("qx.tableResizeDebug")&&this.debug("onverticalscrollbarchanged");
this.getBehavior().onVerticalScrollBarChanged(a);
qx.event.Timer.once(function(){this.__mFTjD&&!this.__mFTjD.isDisposed()&&(this.__mFTjD._updateScrollerWidths(),this.__mFTjD._updateScrollBarVisibility())},this,0);
this.__NFZdV=false},
_oncolumnwidthchanged:function(a){if(this.__NFZdV||!this.__Cykvf)return;
this.__NFZdV=true;
qx.core.Setting.get("qx.tableResizeDebug")&&this.debug("oncolumnwidthchanged");
this.getBehavior().onColumnWidthChanged(a);
this.__NFZdV=false},
_onvisibilitychanged:function(a){if(this.__NFZdV||!this.__Cykvf)return;
this.__NFZdV=true;
qx.core.Setting.get("qx.tableResizeDebug")&&this.debug("onvisibilitychanged");
this.getBehavior().onVisibilityChanged(a);
this.__NFZdV=false}},
destruct:function(){this.__mFTjD=null}});


// qx.ui.table.pane.Scroller
//   - size: 22647 bytes
//   - modified: 2010-09-30T14:20:20
//   - names:
//       Math, 16x
//       qx, 23x
//   - packages:
//       Math.ceil, 1x
//       Math.floor, 3x
//       Math.max, 6x
//       Math.min, 5x
//       Math.round, 1x
//       qx.Class.define, 1x
//       qx.bom.client.Engine.GECKO, 1x
//       qx.event.GlobalError.observeMethod, 1x
//       qx.event.Timer, 1x
//       qx.lang.Number.limit, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.core.Widget, 2x
//       qx.ui.core.scroll.MScrollBarFactory, 1x
//       qx.ui.layout.Grid, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.table.pane.CellEvent, 4x
//       qx.ui.table.pane.Clipper, 2x
//       qx.ui.table.pane.FocusIndicator, 1x
//       qx.ui.table.pane.Scroller.CLICK_TOLERANCE, 1x
//       qx.ui.table.pane.Scroller.HORIZONTAL_SCROLLBAR, 1x
//       qx.ui.table.pane.Scroller.RESIZE_REGION_RADIUS, 1x
//       qx.ui.table.pane.Scroller.VERTICAL_SCROLLBAR, 1x
//       qx.ui.window.Window, 1x
qx.Class.define("qx.ui.table.pane.Scroller",{extend:qx.ui.core.Widget,
include:qx.ui.core.scroll.MScrollBarFactory,
construct:function(b){this.base(arguments);
this.__mFTjD=b;
var a=new qx.ui.layout.Grid();
a.setColumnFlex(0,1);
a.setRowFlex(1,1);
this._setLayout(a);
this.__VtXke=this._showChildControl("scrollbar-x");
this.__VJUaa=this._showChildControl("scrollbar-y");
this.__pYKMe=this._showChildControl("header");
this.__Dqd5H=this._showChildControl("pane");
this.__g0bIs=new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({minWidth:0});
this._add(this.__g0bIs,{row:0,
column:0,
colSpan:2});
this.__1d3GJ=new qx.ui.table.pane.Clipper();
this.__1d3GJ.add(this.__pYKMe);
this.__1d3GJ.addListener("losecapture",this._onChangeCaptureHeader,this);
this.__1d3GJ.addListener("mousemove",this._onMousemoveHeader,this);
this.__1d3GJ.addListener("mousedown",this._onMousedownHeader,this);
this.__1d3GJ.addListener("mouseup",this._onMouseupHeader,this);
this.__1d3GJ.addListener("click",this._onClickHeader,this);
this.__g0bIs.add(this.__1d3GJ,{flex:1});
this.__OEK18=new qx.ui.table.pane.Clipper();
this.__OEK18.add(this.__Dqd5H);
this.__OEK18.addListener("mousewheel",this._onMousewheel,this);
this.__OEK18.addListener("mousemove",this._onMousemovePane,this);
this.__OEK18.addListener("mousedown",this._onMousedownPane,this);
this.__OEK18.addListener("mouseup",this._onMouseupPane,this);
this.__OEK18.addListener("click",this._onClickPane,this);
this.__OEK18.addListener("contextmenu",this._onContextMenu,this);
this.__OEK18.addListener("dblclick",this._onDblclickPane,this);
this.__OEK18.addListener("resize",this._onResizePane,this);
this._add(this.__OEK18,{row:1,
column:0});
this.__9LWX2=this.getChildControl("focus-indicator");
this.initShowCellFocusIndicator();
this.getChildControl("resize-line").hide();
this.addListener("mouseout",this._onMouseout,this);
this.addListener("appear",this._onAppear,this);
this.addListener("disappear",this._onDisappear,this);
this.__mXur6=new qx.event.Timer();
this.__mXur6.addListener("interval",this._oninterval,this);
this.initScrollTimeout()},
statics:{MIN_COLUMN_WIDTH:10,
RESIZE_REGION_RADIUS:5,
CLICK_TOLERANCE:5,
HORIZONTAL_SCROLLBAR:1,
VERTICAL_SCROLLBAR:2},
events:{changeScrollY:"qx.event.type.Data",
changeScrollX:"qx.event.type.Data",
cellClick:"qx.ui.table.pane.CellEvent",
cellDblclick:"qx.ui.table.pane.CellEvent",
cellContextmenu:"qx.ui.table.pane.CellEvent",
beforeSort:"qx.event.type.Data"},
properties:{horizontalScrollBarVisible:{check:"Boolean",
init:true,
apply:"_applyHorizontalScrollBarVisible",
event:"changeHorizontalScrollBarVisible"},
verticalScrollBarVisible:{check:"Boolean",
init:true,
apply:"_applyVerticalScrollBarVisible",
event:"changeVerticalScrollBarVisible"},
tablePaneModel:{check:"qx.ui.table.pane.Model",
apply:"_applyTablePaneModel",
event:"changeTablePaneModel"},
liveResize:{check:"Boolean",
init:false},
focusCellOnMouseMove:{check:"Boolean",
init:false},
selectBeforeFocus:{check:"Boolean",
init:false},
showCellFocusIndicator:{check:"Boolean",
init:true,
apply:"_applyShowCellFocusIndicator"},
resetSelectionOnHeaderClick:{check:"Boolean",
init:true},
scrollTimeout:{check:"Integer",
init:100,
apply:"_applyScrollTimeout"},
appearance:{refine:true,
init:"table-scroller"}},
members:{__VPXfs:null,
__mFTjD:null,
__bavR8B:null,
__b1LAwB:null,
__bA9G0Y:null,
__JFoZA:null,
__9gkkM:null,
__bhq7u1:null,
__cmvGjX:null,
__bHigHI:null,
__WwzPD:null,
__b1CvT5:null,
__bh2v9R:null,
__byk4We:null,
__bfE7VJ:false,
__O9yvB:null,
__9Mu3p:null,
__9ML6s:null,
__Jq6rq:null,
__JGvbE:null,
__IsSJm:null,
__bwq6Xy:null,
__97oMq:null,
__VtXke:null,
__VJUaa:null,
__pYKMe:null,
__1d3GJ:null,
__Dqd5H:null,
__OEK18:null,
__9LWX2:null,
__g0bIs:null,
__mXur6:null,
getPaneInsetRight:function(){var a=this.getTopRightWidget(),b=a&&a.isVisible()&&a.getBounds()?a.getBounds().width:0,c=this.getVerticalScrollBarVisible()?this.getVerticalScrollBarWidth():0;
return Math.max(b,c)},
setPaneWidth:function(a){this.isVerticalScrollBarVisible()&&(a+=this.getPaneInsetRight());
this.setWidth(a)},
_createChildControlImpl:function(b){var a;
switch(b){case"header":a=(this.getTable().getNewTablePaneHeader())(this);
break;
case"pane":a=(this.getTable().getNewTablePane())(this);
break;
case"focus-indicator":a=new qx.ui.table.pane.FocusIndicator(this);
a.setUserBounds(0,0,0,0);
a.setZIndex(1000);
a.addListener("mouseup",this._onMouseupFocusIndicator,this);
this.__OEK18.add(a);
a.show();
a.setDecorator(null);
break;
case"resize-line":a=new qx.ui.core.Widget();
a.setUserBounds(0,0,0,0);
a.setZIndex(1000);
this.__OEK18.add(a);
break;
case"scrollbar-x":a=this._createScrollBar("horizontal").set({minWidth:0,
alignY:"bottom"});
a.addListener("scroll",this._onScrollX,this);
this._add(a,{row:2,
column:0});
break;
case"scrollbar-y":a=this._createScrollBar("vertical");
a.addListener("scroll",this._onScrollY,this);
this._add(a,{row:1,
column:1});
break}return a||this.base(arguments,b)},
_applyHorizontalScrollBarVisible:function(a,b){this.__VtXke.setVisibility(a?"visible":"excluded")},
_applyVerticalScrollBarVisible:function(a,b){this.__VJUaa.setVisibility(a?"visible":"excluded")},
_applyTablePaneModel:function(b,a){a!=null&&a.removeListener("modelChanged",this._onPaneModelChanged,this);
b.addListener("modelChanged",this._onPaneModelChanged,this)},
_applyShowCellFocusIndicator:function(a,b){a?(this.__9LWX2.setDecorator("table-scroller-focus-indicator"),this._updateFocusIndicator()):this.__9LWX2&&this.__9LWX2.setDecorator(null)},
getScrollY:function(){return this.__VJUaa.getPosition()},
setScrollY:function(a,b){this.__VJUaa.scrollTo(a);
b&&this._updateContent()},
getScrollX:function(){return this.__VtXke.getPosition()},
setScrollX:function(a){this.__VtXke.scrollTo(a)},
getTable:function(){return this.__mFTjD},
onColVisibilityChanged:function(){this.updateHorScrollBarMaximum();
this._updateFocusIndicator()},
setColumnWidth:function(a,b){this.__pYKMe.setColumnWidth(a,b);
this.__Dqd5H.setColumnWidth(a,b);
var d=this.getTablePaneModel(),c=d.getX(a);
c!=-1&&(this.updateHorScrollBarMaximum(),this._updateFocusIndicator())},
onColOrderChanged:function(){this.__pYKMe.onColOrderChanged();
this.__Dqd5H.onColOrderChanged();
this.updateHorScrollBarMaximum()},
onTableModelDataChanged:function(c,e,b,d){this.__Dqd5H.onTableModelDataChanged(c,e,b,d);
var a=this.getTable().getTableModel().getRowCount();
a!=this.__VPXfs&&(this.updateVerScrollBarMaximum(),this.getFocusedRow()>=a&&(a==0?this.setFocusedCell(null,null):this.setFocusedCell(this.getFocusedColumn(),a-1)),this.__VPXfs=a)},
onSelectionChanged:function(){this.__Dqd5H.onSelectionChanged()},
onFocusChanged:function(){this.__Dqd5H.onFocusChanged()},
onTableModelMetaDataChanged:function(){this.__pYKMe.onTableModelMetaDataChanged();
this.__Dqd5H.onTableModelMetaDataChanged()},
_onPaneModelChanged:function(){this.__pYKMe.onPaneModelChanged();
this.__Dqd5H.onPaneModelChanged()},
_onResizePane:function(){this.updateHorScrollBarMaximum();
this.updateVerScrollBarMaximum();
this._updateContent();
this.__pYKMe._updateContent();
this.__mFTjD._updateScrollBarVisibility()},
updateHorScrollBarMaximum:function(){var b=this.__OEK18.getInnerSize(),c,a,d,e;
if(!b)return;
c=this.getTablePaneModel().getTotalWidth(),a=this.__VtXke;
if(b.width<c){d=Math.max(0,c-b.width);
a.setMaximum(d);
a.setKnobFactor(b.width/c);
e=a.getPosition();
a.setPosition(Math.min(e,d))}else a.setMaximum(0),a.setKnobFactor(1),a.setPosition(0)},
updateVerScrollBarMaximum:function(){var b=this.__OEK18.getInnerSize(),g,d,h,c,a,e,f;
if(!b)return;
g=this.getTable().getTableModel(),d=g.getRowCount();
this.getTable().getKeepFirstVisibleRowComplete()&&(d+=1);
h=this.getTable().getRowHeight(),c=d*h,a=this.__VJUaa;
if(b.height<c){e=Math.max(0,c-b.height);
a.setMaximum(e);
a.setKnobFactor(b.height/c);
f=a.getPosition();
a.setPosition(Math.min(f,e))}else a.setMaximum(0),a.setKnobFactor(1),a.setPosition(0)},
onKeepFirstVisibleRowCompleteChanged:function(){this.updateVerScrollBarMaximum();
this._updateContent()},
_onAppear:function(){this._startInterval(this.getScrollTimeout())},
_onDisappear:function(){this._stopInterval()},
_onScrollX:function(b){var a=b.getData();
this.fireDataEvent("changeScrollX",a,b.getOldData());
this.__1d3GJ.scrollToX(a);
this.__OEK18.scrollToX(a)},
_onScrollY:function(a){this.fireDataEvent("changeScrollY",a.getData(),a.getOldData());
this._postponedUpdateContent()},
_onMousewheel:function(a){var b=this.getTable(),c,d;
if(!b.getEnabled())return;
c=qx.bom.client.Engine.GECKO?1:3,d=this.__VJUaa.getPosition()+(a.getWheelDelta()*c)*b.getRowHeight();
this.__VJUaa.scrollTo(d);
this.__9Mu3p&&this.getFocusCellOnMouseMove()&&this._focusCellAtPagePos(this.__9Mu3p,this.__9ML6s);
a.stop()},
__bGvA3z:function(e){var c=this.getTable(),b=this.__pYKMe.getHeaderWidgetAtColumn(this.__WwzPD),g=b.getSizeHint().minWidth,a=Math.max(g,this.__bh2v9R+e-this.__b1CvT5),f,d;
if(this.getLiveResize()){f=c.getTableColumnModel();
f.setColumnWidth(this.__WwzPD,a,true)}else{this.__pYKMe.setColumnWidth(this.__WwzPD,a,true);
d=this.getTablePaneModel();
this._showResizeLine(d.getColumnLeft(this.__WwzPD)+a)}this.__b1CvT5+=a-this.__bh2v9R;
this.__bh2v9R=a},
__boq2HA:function(a){var c=qx.ui.table.pane.Scroller.CLICK_TOLERANCE,b;
if(this.__pYKMe.isShowingColumnMoveFeedback()||a>this.__bHigHI+c||a<this.__bHigHI-c){this.__9gkkM+=a-this.__bHigHI;
this.__pYKMe.showColumnMoveFeedback(this.__JFoZA,this.__9gkkM);
b=this.__mFTjD.getTablePaneScrollerAtPageX(a);
this.__cmvGjX&&this.__cmvGjX!=b&&this.__cmvGjX.hideColumnMoveFeedback();
this.__bhq7u1=b!=null?b.showColumnMoveFeedback(a):null;
this.__cmvGjX=b;
this.__bHigHI=a}},
_onMousemoveHeader:function(b){var e=this.getTable(),d,g,a,h,j,i,c,f;
if(!e.getEnabled())return;
d=false,g=null,a=b.getDocumentLeft(),h=b.getDocumentTop();
this.__9Mu3p=a;
this.__9ML6s=h;
if(this.__WwzPD!=null)this.__bGvA3z(a),d=true,b.stopPropagation();
else if(this.__JFoZA!=null)this.__boq2HA(a),b.stopPropagation();
else{j=this._getResizeColumnForPageX(a);
if(j!=-1)d=true;
else{i=e.getTableModel(),c=this._getColumnForPageX(a);
c!=null&&i.isColumnSortable(c)&&(g=c)}}f=d?"col-resize":null;
this.getApplicationRoot().setGlobalCursor(f);
this.setCursor(f);
this.__pYKMe.setMouseOverColumn(g)},
_onMousemovePane:function(c){var e=this.getTable(),a,b,d;
if(!e.getEnabled())return;
a=c.getDocumentLeft(),b=c.getDocumentTop();
this.__9Mu3p=a;
this.__9ML6s=b;
d=this._getRowForPagePos(a,b);
d!=null&&this._getColumnForPageX(a)!=null&&this.getFocusCellOnMouseMove()&&this._focusCellAtPagePos(a,b);
this.__pYKMe.setMouseOverColumn(null)},
_onMousedownHeader:function(b){if(!this.getTable().getEnabled())return;
var a=b.getDocumentLeft(),c=this._getResizeColumnForPageX(a),d;
if(c!=-1)this._startResizeHeader(c,a),b.stop();
else{d=this._getColumnForPageX(a);
d!=null&&(this._startMoveHeader(d,a),b.stop())}},
_startResizeHeader:function(a,b){var c=this.getTable().getTableColumnModel();
this.__WwzPD=a;
this.__b1CvT5=b;
this.__bh2v9R=c.getColumnWidth(this.__WwzPD);
this.__1d3GJ.capture()},
_startMoveHeader:function(a,b){this.__JFoZA=a;
this.__bHigHI=b;
this.__9gkkM=this.getTablePaneModel().getColumnLeft(a);
this.__1d3GJ.capture()},
_onMousedownPane:function(c){var a=this.getTable(),d,e,b,g,f;
if(!a.getEnabled())return;
a.isEditing()&&a.stopEditing();
d=c.getDocumentLeft(),e=c.getDocumentTop(),b=this._getRowForPagePos(d,e),g=this._getColumnForPageX(d);
if(b!==null){this.__byk4We={row:b,
col:g};
this.__bfE7VJ=false;
f=this.getSelectBeforeFocus();
f&&a.getSelectionManager().handleMouseDown(b,c);
this.getFocusCellOnMouseMove()||this._focusCellAtPagePos(d,e);
f||a.getSelectionManager().handleMouseDown(b,c)}},
_onMouseupFocusIndicator:function(a){this.__byk4We&&!this.__bfE7VJ&&!this.isEditing()&&this.__9LWX2.getRow()==this.__byk4We.row&&this.__9LWX2.getColumn()==this.__byk4We.col?(this.fireEvent("cellClick",qx.ui.table.pane.CellEvent,[this,a,this.__byk4We.row,this.__byk4We.col],true),this.__bfE7VJ=true):this.isEditing()||this._onMousedownPane(a)},
_onChangeCaptureHeader:function(a){this.__WwzPD!=null&&this._stopResizeHeader();
this.__JFoZA!=null&&this._stopMoveHeader()},
_stopResizeHeader:function(){var b=this.getTable().getTableColumnModel(),a;
this.getLiveResize()||(this._hideResizeLine(),b.setColumnWidth(this.__WwzPD,this.__bh2v9R,true));
this.__WwzPD=null;
this.__1d3GJ.releaseCapture();
this.getApplicationRoot().setGlobalCursor(null);
this.setCursor(null);
if(this.isEditing()){a=this.__IsSJm.getBounds().height;
this.__IsSJm.setUserBounds(0,0,this.__bh2v9R,a)}},
_stopMoveHeader:function(){var a=this.getTable().getTableColumnModel(),e=this.getTablePaneModel(),b,c,h,f,g,d;
this.__pYKMe.hideColumnMoveFeedback();
this.__cmvGjX&&this.__cmvGjX.hideColumnMoveFeedback();
if(this.__bhq7u1!=null){b=e.getFirstColumnX()+e.getX(this.__JFoZA),c=this.__bhq7u1;
if(c!=b&&c!=b+1){h=a.getVisibleColumnAtX(b),f=a.getVisibleColumnAtX(c),g=a.getOverallX(h),d=f!=null?a.getOverallX(f):a.getOverallColumnCount();
d>g&&d--;
a.moveColumn(g,d);
this._updateFocusIndicator()}}this.__JFoZA=null;
this.__bhq7u1=null;
this.__1d3GJ.releaseCapture()},
_onMouseupPane:function(a){var c=this.getTable(),b;
if(!c.getEnabled())return;
b=this._getRowForPagePos(a.getDocumentLeft(),a.getDocumentTop());
b!=-1&&b!=null&&this._getColumnForPageX(a.getDocumentLeft())!=null&&c.getSelectionManager().handleMouseUp(b,a)},
_onMouseupHeader:function(a){var b=this.getTable();
if(!b.getEnabled())return;
this.__WwzPD!=null?(this._stopResizeHeader(),this.__O9yvB=true,a.stop()):this.__JFoZA!=null&&(this._stopMoveHeader(),a.stop())},
_onClickHeader:function(d){if(this.__O9yvB){this.__O9yvB=false;
return}var c=this.getTable(),b,f,h,a,i,e,g;
if(!c.getEnabled())return;
b=c.getTableModel(),f=d.getDocumentLeft(),h=this._getResizeColumnForPageX(f);
if(h==-1){a=this._getColumnForPageX(f);
if(a!=null&&b.isColumnSortable(a)){i=b.getSortColumnIndex(),e=a!=i?true:!b.isSortAscending(),g={column:a,
ascending:e,
clickEvent:d};
this.fireDataEvent("beforeSort",g,null,true)&&(b.sortByColumn(a,e),this.getResetSelectionOnHeaderClick()&&c.getSelectionModel().resetSelection())}}d.stop()},
_onClickPane:function(b){var d=this.getTable(),e,f,a,c;
if(!d.getEnabled())return;
e=b.getDocumentLeft(),f=b.getDocumentTop(),a=this._getRowForPagePos(e,f),c=this._getColumnForPageX(e);
a!=null&&c!=null&&(d.getSelectionManager().handleClick(a,b),(this.__9LWX2.isHidden()||this.__byk4We&&!this.__bfE7VJ&&!this.isEditing()&&a==this.__byk4We.row&&c==this.__byk4We.col)&&(this.fireEvent("cellClick",qx.ui.table.pane.CellEvent,[this,b,a,c],true),this.__bfE7VJ=true))},
_onContextMenu:function(a){var e=a.getDocumentLeft(),f=a.getDocumentTop(),c=this._getRowForPagePos(e,f),d=this._getColumnForPageX(e),b;
if(this.__9LWX2.isHidden()||this.__byk4We&&c==this.__byk4We.row&&d==this.__byk4We.col){this.fireEvent("cellContextmenu",qx.ui.table.pane.CellEvent,[this,a,c,d],true);
b=this.getTable().getContextMenu();
b&&(b.getChildren().length>0?b.openAtMouse(a):b.exclude(),a.preventDefault())}},
_onContextMenuOpen:function(a){},
_onDblclickPane:function(b){var c=b.getDocumentLeft(),d=b.getDocumentTop(),a;
this._focusCellAtPagePos(c,d);
this.startEditing();
a=this._getRowForPagePos(c,d);
a!=-1&&a!=null&&this.fireEvent("cellDblclick",qx.ui.table.pane.CellEvent,[this,b,a],true)},
_onMouseout:function(b){var a=this.getTable();
if(!a.getEnabled())return;
this.__WwzPD==null&&(this.setCursor(null),this.getApplicationRoot().setGlobalCursor(null));
this.__pYKMe.setMouseOverColumn(null)},
_showResizeLine:function(d){var b=this._showChildControl("resize-line"),a=b.getWidth(),c=this.__OEK18.getBounds();
b.setUserBounds(d-Math.round(a/2),0,a,c.height)},
_hideResizeLine:function(){this._excludeChildControl("resize-line")},
showColumnMoveFeedback:function(j){for(var c=this.getTablePaneModel(),n=this.getTable().getTableColumnModel(),d=this.__Dqd5H.getContainerLocation().left,k=c.getColumnCount(),h=0,a=0,e=d,b=0,i,f,l,m,g;
b<k;
b++){i=c.getColumnAtX(b),f=n.getColumnWidth(i);
if(j<e+f/2)break;
e+=f;
h=b+1;
a=e-d}l=this.__OEK18.getContainerLocation().left,m=this.__OEK18.getBounds().width,g=l-d;
a=qx.lang.Number.limit(a,g+2,g+m-1);
this._showResizeLine(a);
return c.getFirstColumnX()+h},
hideColumnMoveFeedback:function(){this._hideResizeLine()},
_focusCellAtPagePos:function(b,c){var a=this._getRowForPagePos(b,c),d;
if(a!=-1&&a!=null){d=this._getColumnForPageX(b);
this.__mFTjD.setFocusedCell(d,a)}},
setFocusedCell:function(b,a){this.isEditing()||(this.__Dqd5H.setFocusedCell(b,a,this.__b1LAwB),this.__Jq6rq=b,this.__JGvbE=a,this._updateFocusIndicator())},
getFocusedColumn:function(){return this.__Jq6rq},
getFocusedRow:function(){return this.__JGvbE},
scrollCellVisible:function(a,l){var f=this.getTablePaneModel(),k=f.getX(a),b,p,c,n,d,e,h,m,o,i,g,j;
if(k!=-1){b=this.__OEK18.getInnerSize();
if(!b)return;
p=this.getTable().getTableColumnModel(),c=f.getColumnLeft(a),n=p.getColumnWidth(a),d=this.getTable().getRowHeight(),e=l*d,h=this.getScrollX(),m=this.getScrollY(),o=Math.min(c,c+n-b.width),i=c;
this.setScrollX(Math.max(o,Math.min(i,h)));
g=e+d-b.height;
this.getTable().getKeepFirstVisibleRowComplete()&&(g+=d);
j=e;
this.setScrollY(Math.max(g,Math.min(j,m)),true)}},
isEditing:function(){return this.__IsSJm!=null},
startEditing:function(){var b=this.getTable(),f=b.getTableModel(),a=this.__Jq6rq,d,i,h,e,g,c;
if(!this.isEditing()&&a!=null&&f.isColumnEditable(a)){d=this.__JGvbE,i=this.getTablePaneModel().getX(a),h=f.getValue(a,d);
this.__bwq6Xy=b.getTableColumnModel().getCellEditorFactory(a);
e={col:a,
row:d,
xPos:i,
value:h,
table:b};
this.__IsSJm=this.__bwq6Xy.createCellEditor(e);
if(this.__IsSJm===null)return false;
if(this.__IsSJm instanceof qx.ui.window.Window){this.__IsSJm.setModal(true);
this.__IsSJm.setShowClose(false);
this.__IsSJm.addListener("close",this._onCellEditorModalWindowClose,this);
g=b.getModalCellEditorPreOpenFunction();
g!=null&&g(this.__IsSJm,e);
this.__IsSJm.open()}else{c=this.__9LWX2.getInnerSize();
this.__IsSJm.setUserBounds(0,0,c.width,c.height);
this.__9LWX2.addListener("mousedown",function(a){this.__byk4We={row:this.__JGvbE,
col:this.__Jq6rq};
a.stopPropagation()},this);
this.__9LWX2.add(this.__IsSJm);
this.__9LWX2.addState("editing");
this.__9LWX2.setKeepActive(false);
this.__9LWX2.setDecorator("table-scroller-focus-indicator");
this.__IsSJm.focus();
this.__IsSJm.activate()}return true}return false},
stopEditing:function(){this.getShowCellFocusIndicator()||this.__9LWX2.setDecorator(null);
this.flushEditor();
this.cancelEditing()},
flushEditor:function(){if(this.isEditing()){var a=this.__bwq6Xy.getCellEditorValue(this.__IsSJm),b=this.getTable().getTableModel().getValue(this.__Jq6rq,this.__JGvbE);
this.getTable().getTableModel().setValue(this.__Jq6rq,this.__JGvbE,a);
this.__mFTjD.focus();
this.__mFTjD.fireDataEvent("dataEdited",{row:this.__JGvbE,
col:this.__Jq6rq,
oldValue:b,
value:a})}},
cancelEditing:function(){this.isEditing()&&!this.__IsSJm.pendingDispose&&(this._cellEditorIsModalWindow?(this.__IsSJm.destroy(),this.__IsSJm=null,this.__bwq6Xy=null,this.__IsSJm.pendingDispose=true):(this.__9LWX2.removeState("editing"),this.__9LWX2.setKeepActive(true),this.__IsSJm.destroy(),this.__IsSJm=null,this.__bwq6Xy=null))},
_onCellEditorModalWindowClose:function(a){this.stopEditing()},
_getColumnForPageX:function(f){for(var h=this.getTable().getTableColumnModel(),c=this.getTablePaneModel(),g=c.getColumnCount(),d=this.__pYKMe.getContainerLocation().left,a=0,b,e;
a<g;
a++){b=c.getColumnAtX(a),e=h.getColumnWidth(b);
d+=e;
if(f<d)return b}return null},
_getResizeColumnForPageX:function(e){for(var i=this.getTable().getTableColumnModel(),d=this.getTablePaneModel(),h=d.getColumnCount(),b=this.__pYKMe.getContainerLocation().left,f=qx.ui.table.pane.Scroller.RESIZE_REGION_RADIUS,a=0,c,g;
a<h;
a++){c=d.getColumnAtX(a),g=i.getColumnWidth(c);
b+=g;
if(e>=b-f&&e<=b+f)return c}return-1},
_getRowForPagePos:function(c,a){var b=this.__Dqd5H.getContentLocation(),f,d,i,g,j,h,e;
if(c<b.left||c>b.right)return null;
if(a>=b.top&&a<=b.bottom){f=this.getTable().getRowHeight(),d=this.__VJUaa.getPosition();
this.getTable().getKeepFirstVisibleRowComplete()&&(d=Math.floor(d/f)*f);
i=d+a-b.top,g=Math.floor(i/f),j=this.getTable().getTableModel(),h=j.getRowCount();
return g<h?g:null}e=this.__pYKMe.getContainerLocation();
if(a>=e.top&&a<=e.bottom&&c<=e.right)return-1;
return null},
setTopRightWidget:function(a){var b=this.__97oMq;
b!=null&&this.__g0bIs.remove(b);
a!=null&&this.__g0bIs.add(a);
this.__97oMq=a},
getTopRightWidget:function(){return this.__97oMq},
getHeader:function(){return this.__pYKMe},
getTablePane:function(){return this.__Dqd5H},
getVerticalScrollBarWidth:function(){var a=this.__VJUaa;
return a.isVisible()?a.getSizeHint().width||0:0},
getNeededScrollBars:function(n,i){var b=this.__VJUaa.getSizeHint().width,a=this.__OEK18.getInnerSize(),f=a?a.width:0,d,l,k,g,h,e,c,m,j;
this.getVerticalScrollBarVisible()&&(f+=b);
d=a?a.height:0;
this.getHorizontalScrollBarVisible()&&(d+=b);
l=this.getTable().getTableModel(),k=l.getRowCount(),g=this.getTablePaneModel().getTotalWidth(),h=this.getTable().getRowHeight()*k,e=false,c=false;
g>f?(e=true,h>d-b&&(c=true)):h>d&&(c=true,!i&&g>f-b&&(e=true));
m=qx.ui.table.pane.Scroller.HORIZONTAL_SCROLLBAR,j=qx.ui.table.pane.Scroller.VERTICAL_SCROLLBAR;
return(n||e?m:0)|(i||!c?0:j)},
getPaneClipper:function(){return this.__OEK18},
_applyScrollTimeout:function(a,b){this._startInterval(a)},
_startInterval:function(a){this.__mXur6.setInterval(a);
this.__mXur6.start()},
_stopInterval:function(){this.__mXur6.stop()},
_postponedUpdateContent:function(){this._updateContent()},
_oninterval:qx.event.GlobalError.observeMethod(function(){this.__b1LAwB&&!this.__Dqd5H._layoutPending&&(this.__b1LAwB=false,this._updateContent())}),
_updateContent:function(){var b=this.__OEK18.getInnerSize(),i,j,e,a,f,h,d,g,c;
if(!b)return;
i=b.height,j=this.__VtXke.getPosition(),e=this.__VJUaa.getPosition(),a=this.getTable().getRowHeight(),f=Math.floor(e/a),h=this.__Dqd5H.getFirstVisibleRow();
this.__Dqd5H.setFirstVisibleRow(f);
d=Math.ceil(i/a),g=0,c=this.getTable().getKeepFirstVisibleRowComplete();
c||(d++,g=e%a);
this.__Dqd5H.setVisibleRowCount(d);
f!=h&&this._updateFocusIndicator();
this.__OEK18.scrollToX(j);
c||this.__OEK18.scrollToY(g)},
_updateFocusIndicator:function(){var a=this.getTable();
if(!a.getEnabled())return;
this.__9LWX2.moveToCell(this.__Jq6rq,this.__JGvbE)}},
destruct:function(){this._stopInterval();
var a=this.getTablePaneModel();
a&&a.dispose();
this.__byk4We=this.__97oMq=this.__mFTjD=null;
this._disposeObjects("__horScrollBar","__verScrollBar","__headerClipper","__paneClipper","__focusIndicator","__header","__tablePane","__top","__timer")}});


// apiviewer.ui.PackageTree
//   - size: 1838 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       apiviewer, 3x
//       qx, 6x
//   - packages:
//       apiviewer.TreeUtil.getIconUrl, 2x
//       apiviewer.ui.PackageTree, 1x
//       qx.Class.define, 1x
//       qx.core.Setting.get, 1x
//       qx.ui.tree.Tree, 1x
//       qx.ui.tree.TreeFolder, 3x
qx.Class.define("apiviewer.ui.PackageTree",{extend:qx.ui.tree.Tree,
construct:function(){this.base(arguments,"Documentation");
this.setDecorator(null);
this.__jO4QN=new qx.ui.tree.TreeFolder("Packages");
this.__jO4QN.setOpen(true);
this.setRoot(this.__jO4QN);
this.setSelection([this.__jO4QN]);
this._classTreeNodeHash={}},
members:{__jO4QN:null,
setTreeData:function(a){this._docTree=a;
this.__bfy4QC(this.__jO4QN,a,0);
this._wantedClassName&&(this.selectTreeNodeByClassName(this._wantedClassName),this._wantedClassName=null)},
selectTreeNodeByClassName:function(e){if(this._docTree==null){this._wantedClassName=e;
return true}var b=e.split("."),d=b[0],c=0,a;
do{a=this._classTreeNodeHash[d];
if(!a)return false;
a.loaded||a.setOpen(true);
c++;
d+="."+b[c]}while(c<b.length);
this.setSelection([a]);
this.scrollChildIntoView(a);
return true},
__bXfEIE:function(a,d,c){var b=this;
return function(){a.loaded||(b.__bfy4QC(a,d,c+1),a.setOpenSymbolMode("always"))}},
__bfy4QC:function(f,j,h){f.loaded=true;
for(var l=apiviewer.ui.PackageTree,k=j.getPackages(),b=0,c,i,a,g,e,d;
b<k.length;
b++){c=k[b],i=apiviewer.TreeUtil.getIconUrl(c),a=new qx.ui.tree.TreeFolder(c.getName());
a.setIcon(i);
a.setOpenSymbolMode("always");
a.setUserData("nodeName",c.getFullName());
f.add(a);
a.addListener("changeOpen",this.__bXfEIE(a,c,h+1),this);
h<qx.core.Setting.get("apiviewer.initialTreeDepth")&&c.getPackages().length>0&&a.setOpen(true);
this._classTreeNodeHash[c.getFullName()]=a}g=j.getClasses(),b=0;
for(;
b<g.length;
b++){e=g[b],i=apiviewer.TreeUtil.getIconUrl(e),d=new qx.ui.tree.TreeFolder(e.getName());
d.setIcon(i);
d.setUserData("nodeName",e.getFullName());
d.treeType=l.PACKAGE_TREE;
f.add(d);
this._classTreeNodeHash[e.getFullName()]=d}}},
destruct:function(){this._docTree=this._classTreeNodeHash=null;
this._disposeObjects("__root")}});


// qx.application.Standalone
//   - size: 167 bytes
//   - modified: 2010-11-02T15:53:38
//   - names:
//       document, 1x
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.application.AbstractGui, 1x
//       qx.ui.root.Application, 1x
qx.Class.define("qx.application.Standalone",{extend:qx.application.AbstractGui,
members:{_createRootWidget:function(){return new qx.ui.root.Application(document)}}});


// apiviewer.ui.tabview.ClassPage
//   - size: 169 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       apiviewer, 2x
//       qx, 1x
//   - packages:
//       apiviewer.ui.ClassViewer, 1x
//       apiviewer.ui.tabview.AbstractPage, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.ui.tabview.ClassPage",{extend:apiviewer.ui.tabview.AbstractPage,
members:{_createViewer:function(){return new apiviewer.ui.ClassViewer()}}});


// qx.ui.menu.CheckBox
//   - size: 741 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 4x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.form.IBooleanForm, 1x
//       qx.ui.menu.AbstractButton, 1x
//       qx.ui.menu.Manager.getInstance, 1x
qx.Class.define("qx.ui.menu.CheckBox",{extend:qx.ui.menu.AbstractButton,
implement:[qx.ui.form.IBooleanForm],
construct:function(a,b){this.base(arguments);
a!=null&&(a.translate?this.setLabel(a.translate()):this.setLabel(a));
b!=null&&this.setMenu(b);
this.addListener("execute",this._onExecute,this)},
properties:{appearance:{refine:true,
init:"menu-checkbox"},
value:{check:"Boolean",
init:false,
apply:"_applyValue",
event:"changeValue",
nullable:true}},
members:{_applyValue:function(a,b){a?this.addState("checked"):this.removeState("checked")},
_onExecute:function(a){this.toggleValue()},
_onMouseUp:function(a){a.isLeftPressed()&&this.execute();
qx.ui.menu.Manager.getInstance().hideAll()},
_onKeyPress:function(a){this.execute()}}});


// qx.ui.toolbar.MenuButton
//   - size: 508 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.basic.Image, 1x
//       qx.ui.menubar.Button, 1x
qx.Class.define("qx.ui.toolbar.MenuButton",{extend:qx.ui.menubar.Button,
properties:{appearance:{refine:true,
init:"toolbar-menubutton"},
showArrow:{check:"Boolean",
init:false,
themeable:true,
apply:"_applyShowArrow"}},
members:{_createChildControlImpl:function(b){var a;
switch(b){case"arrow":a=new qx.ui.basic.Image();
a.setAnonymous(true);
this._addAt(a,10);
break}return a||this.base(arguments,b)},
_applyShowArrow:function(a,b){a?this._showChildControl("arrow"):this._excludeChildControl("arrow")}}});


// apiviewer.ui.tabview.PackagePage
//   - size: 173 bytes
//   - modified: 2010-07-17T16:42:24
//   - names:
//       apiviewer, 2x
//       qx, 1x
//   - packages:
//       apiviewer.ui.PackageViewer, 1x
//       apiviewer.ui.tabview.AbstractPage, 1x
//       qx.Class.define, 1x
qx.Class.define("apiviewer.ui.tabview.PackagePage",{extend:apiviewer.ui.tabview.AbstractPage,
members:{_createViewer:function(){return new apiviewer.ui.PackageViewer()}}});


// qx.ui.table.columnmenu.MenuItem
//   - size: 476 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 3x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.menu.CheckBox, 1x
//       qx.ui.table.IColumnMenuItem, 1x
qx.Class.define("qx.ui.table.columnmenu.MenuItem",{extend:qx.ui.menu.CheckBox,
implement:qx.ui.table.IColumnMenuItem,
properties:{visible:{check:"Boolean",
init:true,
apply:"_applyVisible",
event:"changeVisible"}},
construct:function(a){this.base(arguments,a);
this.addListener("changeValue",function(a){this.bInListener=true;
this.setVisible(a.getData());
this.bInListener=false})},
members:{__NpuhK:false,
_applyVisible:function(a,b){this.bInListener||this.setValue(a)}}});


// apiviewer.TabViewController
//   - size: 1390 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       apiviewer, 3x
//       qx, 4x
//   - packages:
//       apiviewer.TabViewController.instance, 1x
//       apiviewer.ui.tabview.ClassPage, 1x
//       apiviewer.ui.tabview.PackagePage, 1x
//       qx.Class.define, 1x
//       qx.core.Object, 1x
//       qx.event.type.Mouse, 1x
//       qx.ui.core.queue.Manager.flush, 1x
qx.Class.define("apiviewer.TabViewController",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
apiviewer.TabViewController.instance=this;
this._tabView=a.getWidgetById("tabView");
this._tabView.addListener("changeSelection",this.__bvWjtA,this)},
events:{classLinkClicked:"qx.event.type.Data",
changeSelection:"qx.event.type.Data"},
members:{showTabView:function(){this._tabView.show()},
onSelectItem:function(a){this.fireDataEvent("classLinkClicked",a)},
showItem:function(b){qx.ui.core.queue.Manager.flush();
var a=this._tabView.getSelection()[0];
a.setUserData("itemName",b);
return a.getChildren()[0].showItem(b)},
openPackage:function(a,b){this.__jFr8n(a,apiviewer.ui.tabview.PackagePage,b)},
openClass:function(a,b){this.__jFr8n(a,apiviewer.ui.tabview.ClassPage,b)},
__jFr8n:function(c,b,d){var a=this._tabView.getSelection()[0];
d==true||a==null?this.__UaPSJ(b,c):a instanceof b?a.setClassNode(c):(this.__UaPSJ(b,c),this.__bqpGwo(a))},
__UaPSJ:function(b,c){var a=new b(c);
this._tabView.add(a);
this._tabView.setSelection([a])},
__bqpGwo:function(a){this._tabView.remove(a);
a.destroy()},
__bvWjtA:function(a){var c=a.getOldData(),b=a.getData();
this.fireDataEvent("changeSelection",b,c)},
__bFo7R4:function(c,b){var a=new qx.event.type.Mouse();
a.init(c,b,null,true,true);
a.stop();
return a}},
destruct:function(){this._tabView.destroy();
this._tabView=null}});


// qx.ui.table.columnmenu.Button
//   - size: 890 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       Error, 1x
//       qx, 8x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.core.Blocker, 1x
//       qx.ui.form.MenuButton, 1x
//       qx.ui.menu.Button, 1x
//       qx.ui.menu.Menu, 1x
//       qx.ui.menu.Separator, 1x
//       qx.ui.table.IColumnMenuButton, 1x
//       qx.ui.table.columnmenu.MenuItem, 1x
qx.Class.define("qx.ui.table.columnmenu.Button",{extend:qx.ui.form.MenuButton,
implement:qx.ui.table.IColumnMenuButton,
construct:function(){this.base(arguments);
this.__ukeJN=new qx.ui.core.Blocker(this)},
members:{__bziKzd:null,
__ukeJN:null,
factory:function(e,a){switch(e){case"menu":var c=new qx.ui.menu.Menu(),b,d;
this.setMenu(c);
return c;
case"menu-button":b=new qx.ui.table.columnmenu.MenuItem(a.text);
b.setVisible(a.bVisible);
this.getMenu().add(b);
return b;
case"user-button":d=new qx.ui.menu.Button(a.text);
d.set({appearance:"table-column-reset-button"});
return d;
case"separator":return new qx.ui.menu.Separator();
default:throw new Error("Unrecognized factory request: "+e)}},
getBlocker:function(){return this.__ukeJN},
empty:function(){for(var d=this.getMenu(),a=d.getChildren(),b=0,c=a.length;
b<c;
b++)a[0].destroy()}},
destruct:function(){this.__ukeJN.dispose()}});


// qx.ui.menu.RadioButton
//   - size: 919 bytes
//   - modified: 2010-04-29T21:34:05
//   - names:
//       qx, 7x
//   - packages:
//       qx.Class.define, 1x
//       qx.ui.form.IBooleanForm, 1x
//       qx.ui.form.IModel, 1x
//       qx.ui.form.IRadioItem, 1x
//       qx.ui.form.MModelProperty, 1x
//       qx.ui.menu.AbstractButton, 1x
//       qx.ui.menu.Manager.getInstance, 1x
qx.Class.define("qx.ui.menu.RadioButton",{extend:qx.ui.menu.AbstractButton,
include:[qx.ui.form.MModelProperty],
implement:[qx.ui.form.IRadioItem,qx.ui.form.IBooleanForm,qx.ui.form.IModel],
construct:function(a,b){this.base(arguments);
a!=null&&this.setLabel(a);
b!=null&&this.setMenu(b);
this.addListener("execute",this._onExecute,this)},
properties:{appearance:{refine:true,
init:"menu-radiobutton"},
value:{check:"Boolean",
nullable:true,
event:"changeValue",
apply:"_applyValue",
init:false},
group:{check:"qx.ui.form.RadioGroup",
nullable:true,
apply:"_applyGroup"}},
members:{_applyValue:function(a,b){a?this.addState("checked"):this.removeState("checked")},
_applyGroup:function(a,b){b&&b.remove(this);
a&&a.add(this)},
_onExecute:function(a){this.setValue(true)},
_onMouseUp:function(a){a.isLeftPressed()&&this.execute();
qx.ui.menu.Manager.getInstance().hideAll()},
_onKeyPress:function(a){this.execute()}}});


// apiviewer.Controller
//   - size: 5027 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       Date, 8x
//       Error, 1x
//       alert, 2x
//       apiviewer, 7x
//       document, 1x
//       qx, 11x
//   - packages:
//       apiviewer.ClassLoader, 1x
//       apiviewer.MWidgetRegistry, 1x
//       apiviewer.TabViewController, 1x
//       apiviewer.UiModel.getInstance, 1x
//       apiviewer.dao.Class, 1x
//       apiviewer.dao.Class.getClassByName, 1x
//       apiviewer.dao.Package, 1x
//       document.title, 1x
//       qx.Class.define, 1x
//       qx.bom.History.getInstance, 2x
//       qx.core.Init.getApplication, 1x
//       qx.core.Object, 1x
//       qx.event.Timer.once, 2x
//       qx.io.remote.Request, 1x
//       qx.lang.Function.bind, 1x
//       qx.lang.Json.parse, 1x
//       qx.lang.String.trim, 1x
qx.Class.define("apiviewer.Controller",{extend:qx.core.Object,
construct:function(a){this.base(arguments);
this._widgetRegistry=apiviewer.MWidgetRegistry;
this._titlePrefix="API Documentation";
document.title=this._titlePrefix;
this._classLoader=new apiviewer.ClassLoader("./script");
this._detailLoader=this._widgetRegistry.getWidgetById("detail_loader");
this._tabViewController=new apiviewer.TabViewController(this._widgetRegistry);
this.__b8n8y6();
this._tree=this._widgetRegistry.getWidgetById("tree");
this.__yrHbY();
this.__OJYXH();
this._history=qx.bom.History.getInstance();
this.__ONhyA();
qx.core.Init.getApplication().getRoot().addListener("mousedown",function(a){this.__UGJyT=a.isShiftPressed()||a.isCtrlOrCommandPressed()},this,true)},
members:{__UGJyT:false,
$$logCategory:"application",
load:function(b){var a=new qx.io.remote.Request(b),c;
a.setTimeout(180000);
a.setProhibitCaching(false);
a.addListener("completed",function(e){var f=new Date(),d,i,a,h;
this.debug("Time to load data from server: "+(f.getTime()-c.getTime())+"ms");
d=e.getContent();
if(!d)throw new Error("Empty content loaded: "+b);
i=new Date();
try{a=qx.lang.Json.parse(d)}catch(g){this.error("Could not parse: "+b);
this.error("Exception: "+g);
return}h=new Date();
this.debug("Time to eval tree data: "+(h.getTime()-i.getTime())+"ms");
qx.event.Timer.once(function(){this.__ILz3d(a);
qx.event.Timer.once(function(){var b=this._history.getState(),c,d;
if(b)this.__JqPow(this.__OsESu(b));
else{c=this.__bgnoNX(a),d=c.attributes.fullName;
this.__JqPow(d)}},this,0)},this,0)},this);
a.addListener("failed",function(a){this.error("Couldn't load file: "+b)},this);
c=new Date();
a.send()},
__b8n8y6:function(){this._tabViewController.addListener("classLinkClicked",function(a){this._updateHistory(a.getData())},this);
this._tabViewController.addListener("changeSelection",function(d){var a=d.getData()[0],b,c;
if(this._ignoreTabViewSelection==true)return;
if(a&&a.getUserData("nodeName")){b=a.getUserData("nodeName"),c=a.getUserData("itemName");
c!=null?this._updateHistory(b+"#"+c):this._updateHistory(b)}else this._tree.resetSelection()},this)},
__yrHbY:function(){this._tree.addListener("changeSelection",function(c){var a=c.getData()[0],b;
if(a&&a.getUserData("nodeName")&&!this._ignoreTreeSelection){b=a.getUserData("nodeName");
this._updateHistory(b)}},this)},
__OJYXH:function(){var a=apiviewer.UiModel.getInstance(),c=this._widgetRegistry.getWidgetById("btn_inherited"),e,d,b;
c.bind("value",a,"showInherited");
a.bind("showInherited",c,"value");
e=this._widgetRegistry.getWidgetById("btn_expand");
e.bind("value",a,"expandProperties");
a.bind("expandProperties",e,"value");
d=this._widgetRegistry.getWidgetById("btn_protected");
d.bind("value",a,"showProtected");
a.bind("showProtected",d,"value");
b=this._widgetRegistry.getWidgetById("btn_private");
b.bind("value",a,"showPrivate");
a.bind("showPrivate",b,"value")},
__ONhyA:function(){this._history.addListener("request",function(b){var a=this.__OsESu(b.getData());
a&&this.__JqPow(a)},this)},
__ILz3d:function(d){var a=new Date(),c=new apiviewer.dao.Package(d),b=new Date();
this.debug("Time to build data tree: "+(b.getTime()-a.getTime())+"ms");
a=new Date();
this._tree.setTreeData(c);
b=new Date();
this.debug("Time to update tree: "+(b.getTime()-a.getTime())+"ms");
return true},
_updateHistory:function(a){var b=a+" - "+this._titlePrefix;
qx.bom.History.getInstance().addToHistory(this.__OUqOU(a),b)},
_selectClass:function(a,c,d){this._detailLoader.exclude();
this._tabViewController.showTabView();
var b=c?qx.lang.Function.bind(c,d):function(){};
a instanceof apiviewer.dao.Class?this._classLoader.classLoadDependendClasses(a,function(a){this._tabViewController.openClass(a,this.__UGJyT);
b()},this):this._classLoader.packageLoadDependendClasses(a,function(){this._tabViewController.openPackage(a,this.__UGJyT);
b()},this)},
__JqPow:function(c){var b=c,a=null,d=c.indexOf("#"),e,f,g;
if(d!=-1){b=c.substring(0,d);
a=c.substring(d+1);
e=a.indexOf("(");
e!=-1&&(a=qx.lang.String.trim(a.substring(0,e)))}this._ignoreTreeSelection=true;
f=this._tree.selectTreeNodeByClassName(b);
this._ignoreTreeSelection=false;
if(!f){this.error("Unknown class: "+b);
alert("Unknown class: "+b);
return}g=this._tree.getSelection()[0].getUserData("nodeName")||b;
this._ignoreTabViewSelection=true;
this._selectClass(apiviewer.dao.Class.getClassByName(g),function(){if(a)if(!this._tabViewController.showItem(a)){this.error("Unknown item of class '"+b+"': "+a);
alert("Unknown item of class '"+b+"': "+a);
this._updateHistory(b);
this._ignoreTabViewSelection=false;
return}this._updateHistory(c);
this._ignoreTabViewSelection=false},this)},
__OUqOU:function(a){return a.replace(/(.*)#(.*)/g,"$1~$2")},
__OsESu:function(a){return a.replace(/(.*)~(.*)/g,"$1#$2")},
__bgnoNX:function(a){return a.type&&a.type=="package"?a:this.__bgnoNX(a.children[0])}},
destruct:function(){this._widgetRegistry=null;
this._disposeObjects("_detailLoader","_classLoader","_tree","_history","_tabViewController")}});


// qx.ui.table.Table
//   - size: 19355 bytes
//   - modified: 2010-09-30T14:20:21
//   - names:
//       qx, 28x
//   - packages:
//       qx.Class.define, 1x
//       qx.core.Assert.assertInterface, 1x
//       qx.event.Registration.getManager, 1x
//       qx.lang.Number.limit, 2x
//       qx.ui.basic.Label, 1x
//       qx.ui.container.Composite, 1x
//       qx.ui.core.Widget, 2x
//       qx.ui.layout.HBox, 1x
//       qx.ui.layout.VBox, 1x
//       qx.ui.table.IColumnMenuItem, 1x
//       qx.ui.table.Table.__redirectEvents, 2x
//       qx.ui.table.columnmenu.Button, 1x
//       qx.ui.table.columnmodel.Basic, 1x
//       qx.ui.table.model.Simple, 1x
//       qx.ui.table.pane.FocusIndicator, 1x
//       qx.ui.table.pane.Header, 1x
//       qx.ui.table.pane.Model, 1x
//       qx.ui.table.pane.Pane, 2x
//       qx.ui.table.pane.Scroller, 1x
//       qx.ui.table.pane.Scroller.HORIZONTAL_SCROLLBAR, 1x
//       qx.ui.table.pane.Scroller.VERTICAL_SCROLLBAR, 1x
//       qx.ui.table.rowrenderer.Default, 1x
//       qx.ui.table.selection.Manager, 1x
//       qx.ui.table.selection.Model, 1x
qx.Class.define("qx.ui.table.Table",{extend:qx.ui.core.Widget,
construct:function(b,a){this.base(arguments);
a||(a={});
a.initiallyHiddenColumns&&this.setInitiallyHiddenColumns(a.initiallyHiddenColumns);
a.selectionManager&&this.setNewSelectionManager(a.selectionManager);
a.selectionModel&&this.setNewSelectionModel(a.selectionModel);
a.tableColumnModel&&this.setNewTableColumnModel(a.tableColumnModel);
a.tablePane&&this.setNewTablePane(a.tablePane);
a.tablePaneHeader&&this.setNewTablePaneHeader(a.tablePaneHeader);
a.tablePaneScroller&&this.setNewTablePaneScroller(a.tablePaneScroller);
a.tablePaneModel&&this.setNewTablePaneModel(a.tablePaneModel);
a.columnMenu&&this.setNewColumnMenu(a.columnMenu);
this._setLayout(new qx.ui.layout.VBox());
this.__baZinb=new qx.ui.container.Composite(new qx.ui.layout.HBox());
this._add(this.__baZinb,{flex:1});
this.setDataRowRenderer(new qx.ui.table.rowrenderer.Default(this));
this.__bqdRpQ=this.getNewSelectionManager()(this);
this.setSelectionModel(this.getNewSelectionModel()(this));
this.setTableModel(b||this.getEmptyTableModel());
this.setMetaColumnCounts([-1]);
this.setTabIndex(1);
this.addListener("keypress",this._onKeyPress);
this.addListener("focus",this._onFocusChanged);
this.addListener("blur",this._onFocusChanged);
var c=new qx.ui.core.Widget().set({height:0});
this._add(c);
c.addListener("resize",this._onResize,this);
this.__Jq6rq=null;
this.__JGvbE=null;
this.initStatusBarVisible();
b=this.getTableModel();
b.init&&typeof b.init=="function"&&b.init(this)},
events:{columnVisibilityMenuCreateStart:"qx.event.type.Data",
columnVisibilityMenuCreateEnd:"qx.event.type.Data",
tableWidthChanged:"qx.event.type.Event",
verticalScrollBarChanged:"qx.event.type.Data",
cellClick:"qx.ui.table.pane.CellEvent",
cellDblclick:"qx.ui.table.pane.CellEvent",
cellContextmenu:"qx.ui.table.pane.CellEvent",
dataEdited:"qx.event.type.Data"},
statics:{__95Kuw:{cellClick:1,
cellDblclick:1,
cellContextmenu:1}},
properties:{appearance:{refine:true,
init:"table"},
focusable:{refine:true,
init:true},
minWidth:{refine:true,
init:50},
initiallyHiddenColumns:{init:null},
selectable:{refine:true,
init:false},
selectionModel:{check:"qx.ui.table.selection.Model",
apply:"_applySelectionModel",
event:"changeSelectionModel"},
tableModel:{check:"qx.ui.table.ITableModel",
apply:"_applyTableModel",
event:"changeTableModel"},
rowHeight:{check:"Number",
init:20,
apply:"_applyRowHeight",
event:"changeRowHeight"},
forceLineHeight:{check:"Boolean",
init:true},
headerCellsVisible:{check:"Boolean",
init:true,
apply:"_applyHeaderCellsVisible"},
headerCellHeight:{check:"Integer",
init:16,
apply:"_applyHeaderCellHeight",
event:"changeHeaderCellHeight",
nullable:true},
statusBarVisible:{check:"Boolean",
init:true,
apply:"_applyStatusBarVisible"},
additionalStatusBarText:{nullable:true,
init:null,
apply:"_applyAdditionalStatusBarText"},
columnVisibilityButtonVisible:{check:"Boolean",
init:true,
apply:"_applyColumnVisibilityButtonVisible"},
metaColumnCounts:{check:"Array",
apply:"_applyMetaColumnCounts"},
focusCellOnMouseMove:{check:"Boolean",
init:false,
apply:"_applyFocusCellOnMouseMove"},
rowFocusChangeModifiesSelection:{check:"Boolean",
init:true},
showCellFocusIndicator:{check:"Boolean",
init:true,
apply:"_applyShowCellFocusIndicator"},
keepFirstVisibleRowComplete:{check:"Boolean",
init:true,
apply:"_applyKeepFirstVisibleRowComplete"},
alwaysUpdateCells:{check:"Boolean",
init:false},
resetSelectionOnHeaderClick:{check:"Boolean",
init:true,
apply:"_applyResetSelectionOnHeaderClick"},
dataRowRenderer:{check:"qx.ui.table.IRowRenderer",
init:null,
nullable:true,
event:"changeDataRowRenderer"},
modalCellEditorPreOpenFunction:{check:"Function",
init:null,
nullable:true},
newColumnMenu:{check:"Function",
init:function(){return new qx.ui.table.columnmenu.Button()}},
newSelectionManager:{check:"Function",
init:function(a){return new qx.ui.table.selection.Manager(a)}},
newSelectionModel:{check:"Function",
init:function(a){return new qx.ui.table.selection.Model(a)}},
newTableColumnModel:{check:"Function",
init:function(a){return new qx.ui.table.columnmodel.Basic(a)}},
newTablePane:{check:"Function",
init:function(a){return new qx.ui.table.pane.Pane(a)}},
newTablePaneHeader:{check:"Function",
init:function(a){return new qx.ui.table.pane.Header(a)}},
newTablePaneScroller:{check:"Function",
init:function(a){return new qx.ui.table.pane.Scroller(a)}},
newTablePaneModel:{check:"Function",
init:function(a){return new qx.ui.table.pane.Model(a)}}},
members:{__Jq6rq:null,
__JGvbE:null,
__baZinb:null,
__bqdRpQ:null,
__cxQOoY:null,
__VPXfs:null,
__98uYg:null,
__bziKzd:null,
__PFa8E:null,
__bhE8ZD:null,
_createChildControlImpl:function(b){var a,c;
switch(b){case"statusbar":a=new qx.ui.basic.Label();
a.set({allowGrowX:true});
this._add(a);
break;
case"column-button":a=this.getNewColumnMenu()();
a.set({focusable:false});
c=a.factory("menu",{table:this});
c.addListener("appear",this._initColumnMenu,this);
break}return a||this.base(arguments,b)},
_applySelectionModel:function(a,b){this.__bqdRpQ.setSelectionModel(a);
b!=null&&b.removeListener("changeSelection",this._onSelectionChanged,this);
a.addListener("changeSelection",this._onSelectionChanged,this)},
_applyRowHeight:function(c,d){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].updateVerScrollBarMaximum()},
_applyHeaderCellsVisible:function(c,d){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a]._excludeChildControl("header")},
_applyHeaderCellHeight:function(c,d){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].getHeader().setHeight(c)},
getEmptyTableModel:function(){this.__bhE8ZD||(this.__bhE8ZD=new qx.ui.table.model.Simple(),this.__bhE8ZD.setColumns([]),this.__bhE8ZD.setData([]));
return this.__bhE8ZD},
_applyTableModel:function(a,b){this.getTableColumnModel().init(a.getColumnCount(),this);
b!=null&&(b.removeListener("metaDataChanged",this._onTableModelMetaDataChanged,this),b.removeListener("dataChanged",this._onTableModelDataChanged,this));
a.addListener("metaDataChanged",this._onTableModelMetaDataChanged,this);
a.addListener("dataChanged",this._onTableModelDataChanged,this);
this._updateStatusBar();
this._updateTableData(0,a.getRowCount(),0,a.getColumnCount());
this._onTableModelMetaDataChanged();
b&&a.init&&typeof a.init=="function"&&a.init(this)},
getTableColumnModel:function(){if(!this.__PFa8E){var a=this.__PFa8E=this.getNewTableColumnModel()(this),f,c,b,e,d;
a.addListener("visibilityChanged",this._onColVisibilityChanged,this);
a.addListener("widthChanged",this._onColWidthChanged,this);
a.addListener("orderChanged",this._onColOrderChanged,this);
f=this.getTableModel();
a.init(f.getColumnCount(),this);
c=this._getPaneScrollerArr(),b=0;
for(;
b<c.length;
b++){e=c[b],d=e.getTablePaneModel();
d.setTableColumnModel(a)}}return this.__PFa8E},
_applyStatusBarVisible:function(a,b){a?this._showChildControl("statusbar"):this._excludeChildControl("statusbar");
a&&this._updateStatusBar()},
_applyAdditionalStatusBarText:function(a,b){this.__cxQOoY=a;
this._updateStatusBar()},
_applyColumnVisibilityButtonVisible:function(a,b){a?this._showChildControl("column-button"):this._excludeChildControl("column-button")},
_applyMetaColumnCounts:function(l,p){var g=l,c=this._getPaneScrollerArr(),e={},m,b,i,a,f,h,o,k,d,j,q,n;
if(l>p){m=qx.event.Registration.getManager(c[0]);
for(b in qx.ui.table.Table.__95Kuw)e[b]={},e[b].capture=m.getListeners(c[0],b,true),e[b].bubble=m.getListeners(c[0],b,false)}this._cleanUpMetaColumns(g.length);
i=0,a=0;
for(;
a<c.length;
a++){f=c[a],h=f.getTablePaneModel();
h.setFirstColumnX(i);
h.setMaxColumnCount(g[a]);
i+=g[a]}if(g.length>c.length){o=this.getTableColumnModel(),a=c.length;
for(;
a<g.length;
a++){h=this.getNewTablePaneModel()(o);
h.setFirstColumnX(i);
h.setMaxColumnCount(g[a]);
i+=g[a];
f=this.getNewTablePaneScroller()(this);
f.setTablePaneModel(h);
f.addListener("changeScrollY",this._onScrollY,this);
for(b in qx.ui.table.Table.__95Kuw){if(!e[b])break;
if(e[b].capture&&e[b].capture.length>0){k=e[b].capture,a=0;
for(;
a<k.length;
a++){d=k[a].context;
d?d==c[0]&&(d=f):d=this;
f.addListener(b,k[a].handler,d,true)}}if(e[b].bubble&&e[b].bubble.length>0){j=e[b].bubble,a=0;
for(;
a<j.length;
a++){d=j[a].context;
d?d==c[0]&&(d=f):d=this;
f.addListener(b,j[a].handler,d,false)}}}q=a==g.length-1?1:0;
this.__baZinb.add(f,{flex:q});
c=this._getPaneScrollerArr()}}for(a=0;
a<c.length;
a++){f=c[a],n=(a==c.length-1);
f.getHeader().setHeight(this.getHeaderCellHeight());
f.setTopRightWidget(n?this.getChildControl("column-button"):null)}this.isColumnVisibilityButtonVisible()||this._excludeChildControl("column-button");
this._updateScrollerWidths();
this._updateScrollBarVisibility()},
_applyFocusCellOnMouseMove:function(c,d){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].setFocusCellOnMouseMove(c)},
_applyShowCellFocusIndicator:function(c,d){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].setShowCellFocusIndicator(c)},
_applyKeepFirstVisibleRowComplete:function(c,d){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].onKeepFirstVisibleRowCompleteChanged()},
_applyResetSelectionOnHeaderClick:function(c,d){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].setResetSelectionOnHeaderClick(c)},
getSelectionManager:function(){return this.__bqdRpQ},
_getPaneScrollerArr:function(){return this.__baZinb.getChildren()},
getPaneScroller:function(a){return this._getPaneScrollerArr()[a]},
_cleanUpMetaColumns:function(c){var b=this._getPaneScrollerArr(),a;
if(b!=null)for(a=b.length-1;
a>=c;
a--)b[a].destroy()},
_onChangeLocale:function(a){this.updateContent();
this._updateStatusBar()},
_onSelectionChanged:function(c){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].onSelectionChanged();
this._updateStatusBar()},
_onTableModelMetaDataChanged:function(c){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].onTableModelMetaDataChanged();
this._updateStatusBar()},
_onTableModelDataChanged:function(b){var a=b.getData();
this._updateTableData(a.firstRow,a.lastRow,a.firstColumn,a.lastColumn,a.removeStart,a.removeCount)},
_updateTableData:function(f,i,g,h,a,c){var e=this._getPaneScrollerArr(),b,d;
c&&(this.getSelectionModel().removeSelectionInterval(a,a+c),this.__JGvbE>=a&&this.__JGvbE<a+c&&this.setFocusedCell());
for(b=0;
b<e.length;
b++)e[b].onTableModelDataChanged(f,i,g,h);
d=this.getTableModel().getRowCount();
d!=this.__VPXfs&&(this.__VPXfs=d,this._updateScrollBarVisibility(),this._updateStatusBar())},
_onScrollY:function(c){if(!this.__98uYg){this.__98uYg=true;
for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].setScrollY(c.getData());
this.__98uYg=false}},
_onKeyPress:function(a){if(!this.getEnabled())return;
var f=this.__JGvbE,b=true,d=a.getKeyIdentifier(),c,e,h,i,g;
if(this.isEditing()){if(a.getModifiers()==0)switch(d){case"Enter":this.stopEditing();
f=this.__JGvbE;
this.moveFocusedCell(0,1);
this.__JGvbE!=f&&(b=this.startEditing());
break;
case"Escape":this.cancelEditing();
this.focus();
break;
default:b=false;
break}}else if(a.isCtrlPressed()){b=true;
switch(d){case"A":c=this.getTableModel().getRowCount();
c>0&&this.getSelectionModel().setSelectionInterval(0,c-1);
break;
default:b=false;
break}}else switch(d){case"Space":this.__bqdRpQ.handleSelectKeyDown(this.__JGvbE,a);
break;
case"F2":case"Enter":this.startEditing();
b=true;
break;
case"Home":this.setFocusedCell(this.__Jq6rq,0,true);
break;
case"End":c=this.getTableModel().getRowCount();
this.setFocusedCell(this.__Jq6rq,c-1,true);
break;
case"Left":this.moveFocusedCell(-1,0);
break;
case"Right":this.moveFocusedCell(1,0);
break;
case"Up":this.moveFocusedCell(0,-1);
break;
case"Down":this.moveFocusedCell(0,1);
break;
case"PageUp":case"PageDown":e=this.getPaneScroller(0),h=e.getTablePane(),i=this.getRowHeight(),g=d=="PageUp"?-1:1;
c=h.getVisibleRowCount()-1;
e.setScrollY(e.getScrollY()+g*c*i);
this.moveFocusedCell(0,g*c);
break;
default:b=false}f!=this.__JGvbE&&this.getRowFocusChangeModifiesSelection()&&this.__bqdRpQ.handleMoveKeyDown(this.__JGvbE,a);
b&&(a.preventDefault(),a.stopPropagation())},
_onFocusChanged:function(c){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].onFocusChanged()},
_onColVisibilityChanged:function(d){for(var c=this._getPaneScrollerArr(),b=0,a;
b<c.length;
b++)c[b].onColVisibilityChanged();
a=d.getData();
this.__bziKzd!=null&&a.col!=null&&a.visible!=null&&this.__bziKzd[a.col].setVisible(a.visible);
this._updateScrollerWidths();
this._updateScrollBarVisibility()},
_onColWidthChanged:function(d){for(var c=this._getPaneScrollerArr(),a=0,b;
a<c.length;
a++){b=d.getData();
c[a].setColumnWidth(b.col,b.newWidth)}this._updateScrollerWidths();
this._updateScrollBarVisibility()},
_onColOrderChanged:function(c){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].onColOrderChanged();
this._updateScrollerWidths();
this._updateScrollBarVisibility()},
getTablePaneScrollerAtPageX:function(b){var a=this._getMetaColumnAtPageX(b);
return a!=-1?this.getPaneScroller(a):null},
setFocusedCell:function(a,b,e){if(!this.isEditing()&&(a!=this.__Jq6rq||b!=this.__JGvbE)){a===null&&(a=0);
this.__Jq6rq=a;
this.__JGvbE=b;
for(var d=this._getPaneScrollerArr(),c=0;
c<d.length;
c++)d[c].setFocusedCell(a,b);
a!==null&&e&&this.scrollCellVisible(a,b)}},
resetSelection:function(){this.getSelectionModel().resetSelection()},
resetCellFocus:function(){this.setFocusedCell(null,null,false)},
getFocusedColumn:function(){return this.__Jq6rq},
getFocusedRow:function(){return this.__JGvbE},
highlightFocusedRow:function(a){this.getDataRowRenderer().setHighlightFocusRow(a)},
clearFocusedRowHighlight:function(c){if(c){var b=c.getRelatedTarget(),d,a;
if(b instanceof qx.ui.table.pane.Pane||b instanceof qx.ui.table.pane.FocusIndicator)return}this.resetCellFocus();
d=this._getPaneScrollerArr(),a=0;
for(;
a<d.length;
a++)d[a].onFocusChanged()},
moveFocusedCell:function(f,e){var b=this.__Jq6rq,a=this.__JGvbE,d,c,g,h;
if(b===null||a===null)return;
if(f!=0){d=this.getTableColumnModel(),c=d.getVisibleX(b),g=d.getVisibleColumnCount();
c=qx.lang.Number.limit(c+f,0,g-1);
b=d.getVisibleColumnAtX(c)}if(e!=0){h=this.getTableModel();
a=qx.lang.Number.limit(a+e,0,h.getRowCount()-1)}this.setFocusedCell(b,a,true)},
scrollCellVisible:function(a,c){var d=this.getTableColumnModel(),e=d.getVisibleX(a),b=this._getMetaColumnAtColumnX(e);
b!=-1&&this.getPaneScroller(b).scrollCellVisible(a,c)},
isEditing:function(){if(this.__Jq6rq!=null){var b=this.getTableColumnModel().getVisibleX(this.__Jq6rq),a=this._getMetaColumnAtColumnX(b);
return this.getPaneScroller(a).isEditing()}return false},
startEditing:function(){if(this.__Jq6rq!=null){var b=this.getTableColumnModel().getVisibleX(this.__Jq6rq),a=this._getMetaColumnAtColumnX(b),c=this.getPaneScroller(a).startEditing();
return c}return false},
stopEditing:function(){if(this.__Jq6rq!=null){var b=this.getTableColumnModel().getVisibleX(this.__Jq6rq),a=this._getMetaColumnAtColumnX(b);
this.getPaneScroller(a).stopEditing()}},
cancelEditing:function(){if(this.__Jq6rq!=null){var b=this.getTableColumnModel().getVisibleX(this.__Jq6rq),a=this._getMetaColumnAtColumnX(b);
this.getPaneScroller(a).cancelEditing()}},
updateContent:function(){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].getTablePane().updateContent(true)},
blockHeaderElements:function(){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].getHeader().getBlocker().blockContent(20);
this.getChildControl("column-button").getBlocker().blockContent(20)},
unblockHeaderElements:function(){for(var b=this._getPaneScrollerArr(),a=0;
a<b.length;
a++)b[a].getHeader().getBlocker().unblockContent();
this.getChildControl("column-button").getBlocker().unblockContent()},
_getMetaColumnAtPageX:function(b){for(var d=this._getPaneScrollerArr(),a=0,c;
a<d.length;
a++){c=d[a].getContainerLocation();
if(b>=c.left&&b<=c.right)return a}return-1},
_getMetaColumnAtColumnX:function(e){for(var b=this.getMetaColumnCounts(),c=0,a=0,d;
a<b.length;
a++){d=b[a];
c+=d;
if(d==-1||e<c)return a}return-1},
_updateStatusBar:function(){var d=this.getTableModel(),c,b,a;
if(this.getStatusBarVisible()){c=this.getSelectionModel().getSelectedCount(),b=d.getRowCount();
b>=0&&(a=c==0?this.trn("one row","%1 rows",b,b):this.trn("one of one row","%1 of %2 rows",b,c,b));
this.__cxQOoY&&(a?a+=this.__cxQOoY:a=this.__cxQOoY);
a&&this.getChildControl("statusbar").setValue(a)}},
_updateScrollerWidths:function(){for(var b=this._getPaneScrollerArr(),a=0,d,e,c;
a<b.length;
a++){d=(a==b.length-1),e=b[a].getTablePaneModel().getTotalWidth();
b[a].setPaneWidth(e);
c=d?1:0;
b[a].setLayoutProperties({flex:c})}},
_updateScrollBarVisibility:function(){if(!this.getBounds())return;
for(var i=qx.ui.table.pane.Scroller.HORIZONTAL_SCROLLBAR,h=qx.ui.table.pane.Scroller.VERTICAL_SCROLLBAR,b=this._getPaneScrollerArr(),e=false,d=false,a=0,c,g,f;
a<b.length;
a++){c=(a==b.length-1),g=b[a].getNeededScrollBars(e,!c);
g&i&&(e=true);
c&&g&h&&(d=true)}for(a=0;
a<b.length;
a++){c=(a==b.length-1);
b[a].setHorizontalScrollBarVisible(e);
c&&(f=b[a].getVerticalScrollBarVisible());
b[a].setVerticalScrollBarVisible(c&&d);
c&&d!=f&&this.fireDataEvent("verticalScrollBarChanged",d)}},
_initColumnMenu:function(){var e=this.getTableModel(),g=this.getTableColumnModel(),b=this.getChildControl("column-button"),f,d,a,h,c;
b.empty();
f=b.getMenu(),d={table:this,
menu:f,
columnButton:b};
this.fireDataEvent("columnVisibilityMenuCreateStart",d);
this.__bziKzd={};
for(a=0,h=e.getColumnCount();
a<h;
a++){c=b.factory("menu-button",{text:e.getColumnName(a),
column:a,
bVisible:g.isColumnVisible(a)});
qx.core.Assert.assertInterface(c,qx.ui.table.IColumnMenuItem);
c.addListener("changeVisible",this._createColumnVisibilityCheckBoxHandler(a),this);
this.__bziKzd[a]=c}d={table:this,
menu:f,
columnButton:b};
this.fireDataEvent("columnVisibilityMenuCreateEnd",d)},
_createColumnVisibilityCheckBoxHandler:function(a){return function(c){var b=this.getTableColumnModel();
b.setColumnVisible(a,c.getData())}},
setColumnWidth:function(a,b){this.getTableColumnModel().setColumnWidth(a,b)},
_onResize:function(){this.fireEvent("tableWidthChanged");
this._updateScrollerWidths();
this._updateScrollBarVisibility()},
addListener:function(b,g,e,f){if(this.self(arguments).__95Kuw[b]){for(var d=[b],a=0,c=this._getPaneScrollerArr();
a<c.length;
a++)d.push(c[a].addListener.apply(c[a],arguments));
return d.join("\"")}return this.base(arguments,b,g,e,f)},
removeListener:function(c,f,d,e){if(this.self(arguments).__95Kuw[c])for(var a=0,b=this._getPaneScrollerArr();
a<b.length;
a++)b[a].removeListener.apply(b[a],arguments);
else this.base(arguments,c,f,d,e)},
removeListenerById:function(e){var d=e.split("\""),f=d.shift(),b,a,c;
if(this.self(arguments).__95Kuw[f]){b=true,a=0,c=this._getPaneScrollerArr();
for(;
a<c.length;
a++)b=c[a].removeListenerById.call(c[a],d[a])&&b;
return b}return this.base(arguments,e)},
destroy:function(){this.getChildControl("column-button").getMenu().destroy();
this.base(arguments)}},
destruct:function(){var a=this.getSelectionModel(),b;
a&&a.dispose();
b=this.getDataRowRenderer();
b&&b.dispose();
this._cleanUpMetaColumns(0);
this.getTableColumnModel().dispose();
this._disposeObjects("__selectionManager","__scrollerParent","__emptyTableModel","__emptyTableModel","__columnModel");
this._disposeMap("__columnMenuButtons")}});


// apiviewer.ui.SearchView
//   - size: 5402 bytes
//   - modified: 2010-08-26T21:43:53
//   - names:
//       RegExp, 9x
//       apiviewer, 5x
//       eval, 1x
//       qx, 19x
//       undefined, 1x
//   - packages:
//       RegExp.$1, 2x
//       RegExp.$1.length, 1x
//       RegExp.$2, 2x
//       RegExp.$2.length, 1x
//       apiviewer.TreeUtil, 2x
//       apiviewer.TreeUtil.getIconUrl, 1x
//       apiviewer.UiModel.getInstance, 1x
//       apiviewer.dao.Class.getClassByName, 1x
//       qx.Class.define, 1x
//       qx.core.Init.getApplication, 1x
//       qx.event.Timer.once, 1x
//       qx.io.remote.Request, 1x
//       qx.lang.String.trim, 2x
//       qx.ui.basic.Label, 1x
//       qx.ui.container.Composite, 2x
//       qx.ui.form.Button, 1x
//       qx.ui.form.TextField, 1x
//       qx.ui.layout.Canvas, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.layout.VBox, 1x
//       qx.ui.popup.Popup, 1x
//       qx.ui.table.Table, 1x
//       qx.ui.table.cellrenderer.Image, 1x
//       qx.ui.table.columnmodel.Resize, 1x
//       qx.ui.table.model.Simple, 1x
qx.Class.define("apiviewer.ui.SearchView",{extend:qx.ui.container.Composite,
construct:function(){this.base(arguments);
var a=new qx.ui.layout.VBox();
a.setSeparator("separator-vertical");
this.setLayout(a);
this.__KCNzi=false;
this.listdata=[];
this.apiindex={};
this._showSearchForm()},
members:{__jJiOT:null,
__qNlMZ:null,
__KCNzi:null,
__mFTjD:null,
_showSearchForm:function(){var f=new qx.ui.layout.HBox(4),b=new qx.ui.container.Composite(f),g,c,h,a,d,e;
b.setPadding(10);
this.sinput=new qx.ui.form.TextField().set({allowGrowY:true,
placeholder:"Search..."});
this.__qNlMZ=new qx.ui.form.Button("Find");
this.__qNlMZ.setEnabled(false);
b.add(this.sinput,{flex:1});
b.add(this.__qNlMZ);
this.add(b);
g=[],c=this._tableModel=new qx.ui.table.model.Simple();
c.setColumns(["","Results"]);
c.setData(g);
h={tableColumnModel:function(a){return new qx.ui.table.columnmodel.Resize(a)}},a=new qx.ui.table.Table(c,h);
a.setDecorator(null);
a.setShowCellFocusIndicator(false);
a.setStatusBarVisible(false);
a.setColumnVisibilityButtonVisible(false);
this._selectionModel=a.getSelectionManager().getSelectionModel();
this._selectionModel.addListener("changeSelection",this._callDetailFrame,this);
this._table=a;
d=a.getTableColumnModel(),e=d.getBehavior();
e.set(0,{width:"0*",
minWidth:42,
maxWidth:100});
e.set(1,{width:"1*"});
d=a.getTableColumnModel();
d.setDataCellRenderer(0,new qx.ui.table.cellrenderer.Image());
this.__KCNzi=true;
this.__mFTjD=a;
a.addListener("appear",this.__IQNY5,this);
a.addListener("disappear",function(a){this.__jJiOT.hide()},this);
this.add(a,{flex:1});
qx.event.Timer.once(this._load,this,0);
this.sinput.focus();
this.sinput.addListener("keyup",function(a){this._searchResult(this.sinput.getValue()||"")},this)},
_searchResult:function(b){var b=qx.lang.String.trim(b),a,c;
b.length>0?this.__jJiOT.hide():this.__jJiOT.show();
if(b.length<3){this.__KCNzi&&this.listdata.splice(0,this.listdata.length);
this._resetElements();
return}a=[];
try{c=this._validateInput(b);
new RegExp(c[0]);
this.__qNlMZ.setEnabled(true)}catch(d){this.__KCNzi&&this.listdata.splice(0,this.listdata.length);
this._resetElements();
return}a=this._searchIndex(c[0],c[1]);
this._tableModel.setColumns(["",(a.length+" Result"+(a.length!=1?"s":""))]);
this._tableModel.setData(a);
this._table.resetSelection()},
_validateInput:function(b){var a=[];
if(/^([\w\.]*\w+)(#\w+|\.\w+\(\)|#\.[\*|\+|\?]?)?$/.test(b)){if(RegExp.$2&&RegExp.$2.length>1)a=[RegExp.$2,RegExp.$1];
else if(RegExp.$1.length>1)a=[RegExp.$1,null];
else return null}else a=[b,null];
return a},
_searchIndex:function(k,l){var g=[],m=new RegExp(k,/^.*[A-Z].*$/.test(k)?"":"i"),c=this.apiindex.__index__,j=this.apiindex.__fullNames__,h=this.apiindex.__types__,a,b,i,d,e,f;
for(a in c)if(m.test(a)){if(l)for(b=0,i=c[a].length;
b<i;
b++){d=j[c[a][b][1]];
if(new RegExp(l,"i").test(d)){e=h[c[a][b][0]].toUpperCase(),f=apiviewer.TreeUtil["ICON_"+e];
g.push([f,d+a])}}else for(b=0,i=c[a].length;
b<i;
b++)e=h[c[a][b][0]].toUpperCase(),d=j[c[a][b][1]],e=="CLASS"?f=apiviewer.TreeUtil.getIconUrl(apiviewer.dao.Class.getClassByName(d)):(e!="PACKAGE"&&e!="INTERFACE"&&(d+=a),f=apiviewer.TreeUtil["ICON_"+e]),g.push([f,d])}return g},
_setListdata:function(a){a.sort(function(b,a){if(b[1]<a[1])return-1;
if(b[1]>a[1])return 1;
return 0});
for(var b=0,c=a.length,e,d;
b<c;
b++){e=a[b][0],d={icon:e,
html:"",
iconWidth:18,
iconHeight:18};
this.listdata.push({icon:d,
result:{text:a[b][1]}})}},
_sortByIcons:function(b,a){var c={"package":0,
"class":1,
"interface":2,
mixin:3,
method_public:4,
method_protected:5,
method_private:6,
property:7,
property_protected:8,
property_private:9,
event:10,
constructor:11,
constant:12,
childControl:13},e=b.substr(b.lastIndexOf("/")+1),d=a.substr(a.lastIndexOf("/")+1);
b=c[e.substr(0,e.length-6)];
a=c[d.substr(0,d.length-6)];
return b-a},
_load:function(){var b="./script/apiindex.json",a=new qx.io.remote.Request(b);
a.setAsynchronous(true);
a.setTimeout(30000);
a.setProhibitCaching(false);
a.addListener("completed",function(a){this.apiindex=eval("("+a.getContent()+")")},this);
a.addListener("failed",function(a){this.warn("Couldn't load file: "+b)},this);
a.send()},
_callDetailFrame:function(){var g=this._selectionModel.getAnchorSelectionIndex(),b=this._tableModel.getData()[g],h=qx.core.Init.getApplication().controller,e=apiviewer.UiModel.getInstance(),a,d,i,f,c;
if(b!=undefined){a=b[1],d=b[0],i=a,f=null,c=a.indexOf("#");
c!=-1&&(i=a.substring(0,c),f=a.substring(c+1));
/protected/.test(d)?e.setShowProtected(true):/private/.test(d)&&e.setShowPrivate(true);
h._updateHistory(a)}},
_resetElements:function(){this._tableModel.setData([]);
this._tableModel.setColumns(["",""]);
this.__qNlMZ.setEnabled(false)},
__y3DWT:function(c){this.__jJiOT=new qx.ui.popup.Popup(new qx.ui.layout.Canvas).set({autoHide:false,
width:170});
var b=this.tr("Hint: You can use regular expressions in the search field."),a=new qx.ui.basic.Label(b);
a.setRich(true);
this.__jJiOT.add(a,{edge:3});
this.__jJiOT.setPosition("bottom-left");
this.__jJiOT.placeToWidget(this.sinput,false);
this.__jJiOT.show()},
__IQNY5:function(a){this.__jJiOT?qx.lang.String.trim(this.sinput.getValue()||"").length==0&&this.__jJiOT.show():this.__y3DWT()}},
destruct:function(){this.apiindex=this._table=this.__mFTjD=this._tableModel=this._selectionModel=null;
this._disposeObjects("sinput","__button","__note");
this._disposeArray("listdata")}});


// apiviewer.Viewer
//   - size: 5335 bytes
//   - modified: 2010-11-02T19:13:22
//   - names:
//       apiviewer, 3x
//       qx, 36x
//   - packages:
//       apiviewer.ui.LegendView, 1x
//       apiviewer.ui.PackageTree, 1x
//       apiviewer.ui.SearchView, 1x
//       qx.Class.define, 1x
//       qx.core.Setting.define, 2x
//       qx.lang.Function.delay, 1x
//       qx.ui.basic.Label, 2x
//       qx.ui.container.Composite, 4x
//       qx.ui.container.Stack, 1x
//       qx.ui.core.Spacer, 1x
//       qx.ui.embed.Html, 1x
//       qx.ui.form.RadioGroup, 1x
//       qx.ui.layout.Canvas, 1x
//       qx.ui.layout.HBox, 1x
//       qx.ui.layout.VBox, 2x
//       qx.ui.menu.CheckBox, 1x
//       qx.ui.menu.Menu, 1x
//       qx.ui.menu.RadioButton, 1x
//       qx.ui.menu.Separator, 1x
//       qx.ui.splitpane.Pane, 1x
//       qx.ui.tabview.TabView, 1x
//       qx.ui.toolbar.CheckBox, 4x
//       qx.ui.toolbar.MenuButton, 1x
//       qx.ui.toolbar.Part, 2x
//       qx.ui.toolbar.RadioButton, 4x
//       qx.ui.toolbar.ToolBar, 1x
qx.Class.define("apiviewer.Viewer",{extend:qx.ui.container.Composite,
construct:function(){this.base(arguments);
this.__2y6sS={};
var b=new qx.ui.layout.VBox,a,d,c,e;
b.setSeparator("separator-vertical");
this.setLayout(b);
this.add(this.__UDY4S());
this.add(this.__2hehC());
a=new apiviewer.ui.PackageTree();
a.setId("tree");
this._searchView=new apiviewer.ui.SearchView();
d=new apiviewer.ui.LegendView(),c=this.__bo2aiW(a,this._searchView,d),e=this.__bwtRq9();
this.add(this.__bg4zuh(c,e),{flex:1})},
members:{__2Ir7K:null,
__W37NI:null,
__2y6sS:null,
__PKF7y:null,
__bo2aiW:function(b,c,d){var a=new qx.ui.container.Stack;
a.setAppearance("toggleview");
a.add(b);
a.add(c);
a.add(d);
this.__PKF7y.addListener("changeSelection",function(g){var e=g.getData()[0],f=e!=null?e.getUserData("value"):null;
switch(f){case"packages":a.setSelection([b]);
a.show();
break;
case"search":a.setSelection([c]);
a.show();
qx.lang.Function.delay(this._onShowSearch,100,this);
break;
case"legend":a.setSelection([d]);
a.show();
break;
default:a.exclude()}},this);
return a},
__2hehC:function(){var b=new qx.ui.toolbar.ToolBar,a=new qx.ui.toolbar.Part,c,d,f,k,i,h,j,g,e;
b.add(a);
this.__2Ir7K=a.toHashCode();
c=new qx.ui.toolbar.RadioButton(this.tr("Content"),"qx/icon/22/apps/utilities-dictionary.png");
c.setUserData("value","packages");
c.setValue(true);
c.setToolTipText(this.tr("Show/hide the packages."));
a.add(c);
d=new qx.ui.toolbar.RadioButton(this.tr("Search"),"qx/icon/22/actions/edit-find.png");
d.setUserData("value","search");
d.setToolTipText(this.tr("Search for packages, classes and members."));
a.add(d);
f=new qx.ui.toolbar.RadioButton(this.tr("Legend"),"qx/icon/22/apps/utilities-help.png");
f.setUserData("value","legend");
f.setToolTipText(this.tr("Show/hide the legend."));
a.add(f);
k=new qx.ui.form.RadioGroup(c,d,f);
k.setAllowEmptySelection(true);
this.__PKF7y=k;
b.addSpacer();
a=new qx.ui.toolbar.Part;
b.add(a);
i=new qx.ui.toolbar.CheckBox(this.tr("Properties"),"apiviewer/image/property18.gif");
i.setId("btn_expand");
i.setToolTipText(this.tr("Show/hide all generated property methods."));
a.add(i);
h=new qx.ui.toolbar.CheckBox(this.tr("Inherited"),"apiviewer/image/method_public_inherited18.gif");
h.setId("btn_inherited");
h.setToolTipText(this.tr("Show/hide inherited members of the current class."));
a.add(h);
j=new qx.ui.toolbar.CheckBox(this.tr("Protected"),"apiviewer/image/method_protected18.gif");
j.setId("btn_protected");
j.setToolTipText(this.tr("Show/hide protected members of the current class."));
a.add(j);
g=new qx.ui.toolbar.CheckBox(this.tr("Private"),"apiviewer/image/method_private18.gif");
g.setId("btn_private");
g.setToolTipText(this.tr("Show/hide private members of the current class."));
a.add(g);
b.setOverflowHandling(true);
e=new qx.ui.toolbar.MenuButton(null,"qx/icon/22/actions/media-seek-forward.png");
e.setAppearance("toolbar-button");
b.add(e);
b.setOverflowIndicator(e);
this.__W37NI=new qx.ui.menu.Menu();
e.setMenu(this.__W37NI);
b.addListener("hideItem",function(c){for(var d=c.getData(),b=this._getMenuItems(d),a=0;
a<b.length;
a++)b[a].setVisibility("visible")},this);
b.addListener("showItem",function(c){for(var d=c.getData(),b=this._getMenuItems(d),a=0;
a<b.length;
a++)b[a].setVisibility("excluded")},this);
return b},
_getMenuItems:function(c){var f=c.getChildren(),d=[],a,e,b;
if(c.toHashCode()===this.__2Ir7K){a=this.__2y6sS[c.toHashCode()];
a||(a=new qx.ui.menu.Separator(),this.__W37NI.addAt(a,0),this.__2y6sS[c.toHashCode()]=a);
d.push(a)}for(e=f.length-1;
e>=0;
e--){b=f[e];
a=this.__2y6sS[b.toHashCode()];
if(!a){if(b instanceof qx.ui.toolbar.RadioButton)a=new qx.ui.menu.RadioButton(b.getLabel());
else a=new qx.ui.menu.CheckBox(b.getLabel());
b.bind("value",a,"value");
a.bind("value",b,"value");
this.__W37NI.addAt(a,0);
this.__2y6sS[b.toHashCode()]=a}d.push(a)}return d},
__bwtRq9:function(){var a=new qx.ui.container.Composite(new qx.ui.layout.Canvas);
a.getContentElement().setAttribute("class","content");
this._detailLoader=new qx.ui.embed.Html("<div style=\"padding:10px;\"><h1><small>please wait</small>Loading data...</h1></div>");
this._detailLoader.getContentElement().setAttribute("id","SplashScreen");
this._detailLoader.setAppearance("detailviewer");
this._detailLoader.setId("detail_loader");
a.add(this._detailLoader,{edge:0});
this._tabView=new qx.ui.tabview.TabView();
this._tabView.setId("tabView");
this._tabView.exclude();
a.add(this._tabView,{edge:0});
return a},
__bfUNIl:function(b,c){var a=new qx.ui.container.Composite;
a.setLayout(new qx.ui.layout.VBox);
a.add(b);
a.add(c,{flex:1});
return a},
__bg4zuh:function(c,b){var a=new qx.ui.splitpane.Pane("horizontal");
a.add(c,0);
a.add(b,1);
return a},
__UDY4S:function(){var c=new qx.ui.layout.HBox(),a=new qx.ui.container.Composite(c),b,d;
a.setAppearance("app-header");
b=new qx.ui.basic.Label("API Documentation"),d=new qx.ui.basic.Label("qooxdoo 1.0");
a.add(b);
a.add(new qx.ui.core.Spacer,{flex:1});
a.add(d);
return a},
_onShowSearch:function(){this._searchView.sinput.focus()}},
defer:function(){qx.core.Setting.define("apiviewer.title","qooxdoo");
qx.core.Setting.define("apiviewer.initialTreeDepth",1)},
destruct:function(){this._classTreeNodeHash=this.__PKF7y=null;
this._disposeObjects("_tree","_detailLoader","_classViewer","_packageViewer","_searchView","_tabView")}});


// apiviewer.Application
//   - size: 619 bytes
//   - modified: 2010-11-02T18:59:13
//   - names:
//       apiviewer, 3x
//       qx, 7x
//   - packages:
//       apiviewer.Controller, 1x
//       apiviewer.MWidgetRegistry, 1x
//       apiviewer.Viewer, 1x
//       qx.Class.define, 1x
//       qx.Class.include, 1x
//       qx.application.Standalone, 1x
//       qx.bom.Stylesheet.includeFile, 1x
//       qx.log.appender.Console, 1x
//       qx.log.appender.Native, 1x
//       qx.ui.core.Widget, 1x
qx.Class.define("apiviewer.Application",{extend:qx.application.Standalone,
construct:function(){this.base(arguments);
qx.bom.Stylesheet.includeFile("apiviewer/css/apiviewer.css")},
members:{main:function(){this.base(arguments);
qx.log.appender.Native,qx.log.appender.Console;
qx.Class.include(qx.ui.core.Widget,apiviewer.MWidgetRegistry);
this.viewer=new apiviewer.Viewer();
this.controller=new apiviewer.Controller();
this.getRoot().add(this.viewer,{edge:0})},
finalize:function(){this.base(arguments);
this.controller.load("script/apidata.json")}},
destruct:function(){this._disposeObjects("viewer","controller")}});
