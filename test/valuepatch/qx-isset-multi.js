before;
if (qx.core.Variant.isSet("qx.client", "gecko|webkit")) {
  geckoOrWebkit();
} else {
  other();
}
after;