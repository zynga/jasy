var foo = function(){ return false };
(function(){
    foo = function foo(){ return true }
});
console.log(foo);
