Core.declare("Module",function(b,a){Core.declare(b,a)});
Core.declare("Interface",function(b,a){Core.declare(b,{__KUWNk:a.properties,
__qClPA:a.events,
__usucU:a.members})});
Interface.assert=function(b,a){var c=b.constructor,d=a.__qClPA,e,f;
c.getEvents();
e=a.__KUWNk,f=a.__usucU};
Module("Type",{__qxW2Q:{String:1,
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
add:function(c,b,a){var d=this.__p3qB2;
d[c]={method:b,
context:a}},
check:function(c,a,o){var b,l,m,g,f,h,k,i,j,e,d,n;
if(c==null)b=a=="Null";
else if(typeof a=="string")this.__qxW2Q[a]||this.__bqGsvO[a]?(l=this.__bqGsvO[a],l&&(m=a,a=l),g=this.__E0WFw[a],g&&(b=typeof c==g),b||(b=this.__3iKAd[Object.prototype.toString.call(c)]==a),b&&a=="Number"&&(b=isFinite(c)),m&&(a=m,b&&(a=="Integer"?b=c%1==0:a=="PositiveInteger"?b=c%1==0&&c>=0:a=="PositiveNumber"&&(b=c>=0)))):this.__yBAW6[a]?(f=c.nodeType,b=f!=null&&(a=="Node"||f==1&&a=="Element"||f==9&&a=="Document")):this.__DBL9i[a]?b=c.$$type==a:(h=Core.resolve(a),h?b=c.hasOwnProperty&&c instanceof h:(k=c.constructor,i=Core.resolve(a),i?b=qx.Bootstrap.hasInterface(k,i):(j=Core.resolve(a),j&&(b=qx.Class&&qx.Class.hasMixin(k,j))))),b==null&&(e=this.__p3qB2[a],e&&(b=e.method.call(e.context||window,c)));
else if(a instanceof Array){if(a.indexOf)b=a.indexOf(c)!=-1;
else{b=false;
for(d=0,n=a.length;
d<n;
d++)if(c===a[d]){b=true;
break}}}else if(a instanceof RegExp)z.Type.check(c,"String"),b=a.match(c);
else if(a instanceof Function)try{b=a.call(o||window,c);
b==null&&(b=true)}catch(p){b=false}if(b==null||b==false){Error||(Error=Error);
if(b==null)throw new Error("Unsupported check: "+a);
throw new Error("Value: '"+c+"' does not validates as: "+a)}}});
Module("jasy.property.Property",{ID:0,
__uSSUl:0,
__brLhnR:{},
add:function(d,g,e){var f,k=this,l="fireDataEvent",j="$$data",m,b,d,a,c,o,i,h,n;
k.__uSSUl++;
m=k.__brLhnR;
b=m[g];
b||(b=m[g]=k.ID,k.ID++);
e.init!==f&&(a="$$init-"+g,d[a]=e.init);
c=function(a){return a.charAt(0).toUpperCase()+a.substring(1)},o=e.nullable,i=e.event,h=e.apply,n=e.validate;
d["get"+c]=function(){var d,e,c;
d=this;
e=d[j];
e&&(c=e[b]);
if(c===f){if(a)return d[a];
c=null}return c};
a&&(d["init"+c]=function(){var c=this,d=c[j];
(!d||d[b]===f)&&(h&&c[h](c[a],f,g),i&&c[l](i,c[a],f))});
d["set"+c]=function(d){var c,k,e;
c=this;
n&&Type.check(d,n,c);
k=c[j];
k?e=k[b]:k=c[j]={};
d!==e&&(e===f&&a&&(e=c[a]),k[b]=d,h&&c[h](d,e,g),i&&c[l](i,d,e));
return d};
d["reset"+c]=function(){var d,k,e,c;
d=this;
k=d[j];
if(!k)return;
e=k[b];
c=f;
e!==c&&(k[b]=c,a&&(c=d[a]),h&&d[h](c,e,g),i&&d[l](i,c,e))};
e.check==="Boolean"&&(d["toggle"+c]=function(){this["set"+c](!this["get"+c]())},d["is"+c]=d["get"+c])}});
Core.declare("Class",function(b,c){var n=new Function,d=c.construct||n,g=d.prototype,j,a,m,i,f,k,e,o,p,q,l,h;
d.classname=b;
d.toString=new Function(b,"return '[Class ' + name + ']'");
Core.declare(b,d);
g=c.members?d.prototype=c.members:d.prototype;
g.classname=b;
g.destruct=c.destruct||n;
g.reset=c.reset||n;
j=d.__KUWNk=c.properties||{};
for(a in j)jasy.property.Property.add(g,a,j[a]);
m=d.__qClPA=c.events||{};
for(a in m);
i=c.include;
if(i){e=0,o=i.length;
for(;
e<o;
e++){f=i[e];
k=f.prototype;
if(!k)throw new Error("Class "+b+" includes invalid mixin "+i[e]+" at position: "+e+"!");
for(a in f){if(g[a])throw new Error("Class "+b+" has already a member with the name: "+a+"! Class "+f.classname+" could not be included!");
g[a]=k[a]}p=f.__qClPA;
for(a in p){if(a in m)throw new Error("Class "+b+" has already a property with the name: "+a+"! Class "+f.classname+" could not be included!");
m[a]=p[a]}q=f.__KUWNk;
for(a in q){if(a in j)throw new Error("Class "+b+" has already a property with the name: "+a+"! Class "+f.classname+" could not be included!");
j[a]=q[a]}}}l=c.implement;
if(l){e=0,o=l.length;
for(;
e<o;
e++){h=l[e];
if(!h)throw new Error("Class "+b+" implements invalid interface "+h+" at position: "+e);
try{Interface.assert(d,h)}catch(r){throw new Error("Class "+b+" fails to implement given interface: "+h+": "+r)}}}});
