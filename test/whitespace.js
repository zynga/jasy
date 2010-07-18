// es5 invalid json whitespace
var strings = [
  '\u000b1234', // <VT> is not valid JSON whitespace as specified by the production JSONWhitespace.
  '\u000c1234', // <FF> is not valid JSON whitespace
  '\u00a01234', // <NBSP> is not valid JSON whitespace
  '\u200b1234', // <ZWSPP> is not valid JSON whitespace
  '\ufeff1234', // <BOM> is not valid JSON whitespace
  '\u16801234',
  '\u180e1234',
  '\u20001234',
  '\u20011234',
  '\u20021234',
  '\u20031234',
  '\u20041234',
  '\u20051234',
  '\u20061234',
  '\u20071234',
  '\u20081234',
  '\u20091234',
  '\u200a1234',
  '\u202f1234',
  '\u205f1234',
  '\u30001234',
  '\u20281234',
  '\u20291234'
]
