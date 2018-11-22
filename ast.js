const { parser } = require(__dirname + '/parser');
const read = require('fs').readFileSync;
const Vec3 = require('./src/runtime/NativeTypes/Vec3')
const Color = require('./src/runtime/NativeTypes/Color')

const GetAST = filename => parser.parse(
    read(filename).toString()
);

// Load all context classes
parser.yy = {
    Scene: require(__dirname + '/src/entity/Scene.js'),
    Constants: require(__dirname + '/src/runtime/constants.js'),
    Vec3, Color, GetAST
}

module.exports = GetAST;