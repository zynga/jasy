mylibrary.trim = has("string-trim") ? function(str){
    return (str || "").trim();
} : function(str){
    /* do the regexp based string trimming you feel like using */
}
