(function(b){var a={},c={declare:function(f,h){var e=f.split("."),d=b,i=e.length-1,c=0,g;
while(g=d[e[c]])d=g,c++;
while(c<i)d=d[e[c++]]={};
return a[f]=d[e[c]]=h}};
c.declare("Core",{declare:c.declare,
resolve:function(d){var c=a[d],f,e,g;
if(!c){c=b;
if(d){f=d.split("."),e=0,g=f.length;
for(;
e<g;
e++){c=c[f[e]];
if(!c){c=null;
break}}}}return c}})})(this);
Core.declare("jasy.detect.Engine",{VALUE:(function(c){var a,d=c.document,b=d.documentElement.style;
c.opera&&Object.prototype.toString.call(opera)=="[object Opera]"?a="presto":"MozAppearance"in b?a="gecko":"WebkitAppearance"in b?a="webkit":typeof navigator.cpuClass==="string"&&(a="trident");
return a})(this)});
Core.declare("jasy.Adler32",{compute:function(d){for(var e=65521,a=1,b=0,c=0,f=d.length;
c<f;
++c)a=(a+d.charCodeAt(c))%e,b=(b+a)%e;
return b<<16|a}});
Core.declare("jasy.detect.Param",{get:(function(){for(var e=location.search.substring(1).split("&"),g={},d={"true":true,
"false":false,
"null":null},f=0,h=e.length,b,c,i,a;
f<h;
f++)b=e[f],c=b.indexOf("="),i=c==-1?b:b.substring(0,c),a=c==-1?true:b.substring(c+1),a in d?a=d[a]:""+parseFloat(a,10)==a&&(a=parseFloat(a,10)),g[i]=a;
e=d=null;
return function(a){return a in g?g[a]:null}})()});
(function(a){var c={},b={},d=a.document,e=d.head||d.getElementsByTagName("head")[0],g=function(b){for(var a=0,d=b.length;
a<d;
a++)if(!c[b[a]])return false;
return true},f=function(){var j=d.createElement("script").async===true,i="script/cache",h=function(b,g,c,f){var a=d.createElement("script");
c&&(a.type=c);
f&&(a.charset=f);
a.onload=a.onerror=a.onreadystatechange=function(c){g(c.type,b,a)};
a.src=b;
j&&(a.async=false);
e.insertBefore(a,e.firstChild)},g=function(h,j,e){var d={},f,k,g;
if(e)for(f=0,k=e.length;
f<k;
f++)g=e[f],c[g]||(d[g]=true);
return function(k,f,e){var l=k=="error",g,f;
if(l)console.error("Could not load script: "+f);
else{g=e.readyState;
if(g&&g!=="complete"&&g!=="loaded")return}e.onload=e.onerror=e.onreadystatechange=null;
delete d[f];
e.type!=i&&(delete b[f],c[f]=true);
if(h){for(f in d)return;
h.call(j||a)}}},f=[],k=function(){for(e in b)return;
var c=f.concat(),e,a,d;
f.length=0;
for(a=0,d=c.length;
a<d;
a+=2)c[a].call(c[a+1])},l=jasy.detect.Engine.VALUE,m;
m=j||l=="gecko"||l=="opera"?function(j,e,d){var n,m=!!e,l,o,i;
e&&!d&&(d=a);
for(l=0,o=j.length;
l<o;
l++)i=j[l],c[i]||(m&&(m=false,f.push(e,d)),b[i]||(b[i]=true,n||(n=g(k,a,j)),h(i,n)));
m&&e.call(d)}:function(p,l,j,s){var o=!!l,e=[],d,q,m,n,r;
l&&!j&&(j=a);
for(d=0,q=p.length;
d<q;
d++)m=p[d],c[m]||(o&&(o=false,f.push(l,j)),b[m]||(b[m]=true,e.push(m)));
if(o)l.call(j);
else if(e.length>0){n=function(){var a=e.shift();
a?h(a,g(n)):k()};
if(s){r=g(n,a,e),d=0,q=e.length;
for(;
d<q;
d++)h(e[d],r,i)}else n()}};
return m}();
Core.declare("jasy.Loader",{areScriptsLoaded:g,
loadScripts:f})})(this);
(function(){jasy.Permutation={getValue:function(){}};
var b=[["debug",[true,false],jasy.detect.Param],["locale","en"]],a,c;
delete jasy.Permutation;
a={},c=b?(function(){for(var j=[],h=0,l=b.length,f,i,g,d,c,e,k,m;
h<l;
h++)f=b[h],i=f[0],g=f[1],d=f[2],d?(c="VALUE"in d?d.VALUE:d.get(i),g.indexOf(c)==-1&&(c=g[0])):c=g,a[i]=c,j.push(i+":"+c);
e=jasy.Adler32.compute(j.join(";")),k=e<0?"a":"b",m=k+(e<0?-e:e).toString(16);
return m})():"";
Core.declare("jasy.Permutation",{selected:a,
CHECKSUM:c,
isEnabled:function(b){return a[b]==true},
isSet:function(c,b){return a[c]==b},
getValue:function(b){return a[b]},
loadScripts:function(b){for(var c=[],a=0,d=b.length;
a<d;
a++)c[a]=this.patchFilename(b[a]);
return jasy.Loader.loadScripts(c)},
patchFilename:function(a){var b=a.lastIndexOf("."),c="-"+this.CHECKSUM,d;
if(b==-1)return a+c;
d=a.substring(b+1);
return a.substring(0,b)+c+"."+d}})})();
