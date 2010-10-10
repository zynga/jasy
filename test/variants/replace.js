alert("Loaded version: " + js.Variant.VERSION);

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
