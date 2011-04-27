// By http://ejohn.org/blog/fast-javascript-maxmin/
// Convert to prototype functions?

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};