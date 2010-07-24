alert("Loaded version: " + js.Variant.VERSION);

if (js.Variant.LOCAL_STORAGE){
  alert("Has local storage");
}

if (js.Variant.LOCAL_STORAGE && js.Variant.DEBUG){
  alert("Debugs local storage");
}

if (js.Variant.THEME == "blueish") {
  alert("Nice style!");
}

if (js.Variant.NATIVE_JSON && !isCool()) {
  alert("Would activate native json, but you are not cool!");
}

switch(js.Variant.LOCALE)
{
  case "de_DE":
    alert("Hallo!");
    break;

  case "en_US":
    alert("Howdy!");
    break;

  default:
    alert("Hi!");
}
