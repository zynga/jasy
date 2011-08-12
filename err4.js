// In closure compiler this.isIE=!+"\v1"; will be this.isIE=!+"\u000b1"; ... not even "\xb1" ... no, the whole thing and for no reason.
// http://twitter.com/#!/WebReflection/status/101323017090629632
this.isIE=!+"\v1";
