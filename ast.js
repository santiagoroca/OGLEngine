const { parser } = require(__dirname + '/parser');
const read = require('fs').readFileSync;

const GetAST = filename => parser.parse(
    read(filename).toString()
);

// Load all context classes
parser.yy = {
    Scene: require(__dirname + '/src/entity/Scene.js'),
    Constants: require(__dirname + '/src/runtime/constants.js'),
    GetAST
}

module.exports = GetAST;