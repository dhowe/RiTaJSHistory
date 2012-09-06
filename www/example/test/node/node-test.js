var RiString = require('../../../src/rita.js').RiString;
var RiGrammar = require('../../../src/rita.js').RiGrammar;

var rs = RiString("hello");
console.log(rs.text());

var rg = RiGrammar();
console.log(rg);
