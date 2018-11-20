const write = require('fs').writeFileSync;
const Parser = require("jison").Parser;
const syntax = require('./syntax.js');
const parser = new Parser(syntax);
const parserSource = parser.generate();

// Save Parser to file
write('./parser.js', parserSource);