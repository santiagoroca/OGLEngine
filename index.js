const write = require('fs').writeFileSync;
const read = require('fs').readFileSync;
const WRAPPER_TEMPLATE = read('./template/wrapper.js').toString();
const ClassResolver = require('./src/entity/ClassResolver');
const Parser = require('jison').Parser;
const syntax = require('./syntax.js');
const parser = new Parser(syntax);
const fse = require('fs-extra');

global['ClassResolver'] = ClassResolver;

// bla bla
parser.generate();

// Load all context classes
parser.yy = {
    Scene: require('./src/entity/Scene.js'),
    Constants: require('./src/runtime/constants.js'),
}

// Clear Dist folder
fse.emptyDirSync('./dist/');
fse.ensureDirSync('./dist/textures')
fse.ensureDirSync('./dist/models')
fse.copySync('./client/index.html', './dist/index.html')

// Output program
write('dist/build.js', `
    ${read('./template/mat.js')}
    ${read('./template/transform.js')}
    ${WRAPPER_TEMPLATE.replace(/'%scene%'/g, parser.parse(
        read(process.argv[2]).toString()
    ))}
`);