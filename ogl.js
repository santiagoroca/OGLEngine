const write = require('fs').writeFileSync;
const read = require('fs').readFileSync;
const WRAPPER_TEMPLATE = read(__dirname + '/template/wrapper.js').toString();
const ClassResolver = require(__dirname + '/src/runtime/ClassResolver');
const { parser } = require(__dirname + '/parser');
const fse = require('fs-extra');
const ast = require(__dirname + '/ast')
global['ClassResolver'] = ClassResolver;

// Clear Dist folder
fse.emptyDirSync('./dist/');
fse.ensureDirSync('./dist/textures')
fse.ensureDirSync('./dist/models')

// Output program
write('./dist/build.js', `
    ${read(__dirname + '/template/mat.js')}
    ${read(__dirname + '/template/transform.js')}
    ${WRAPPER_TEMPLATE.replace(/'%scene%'/g, 
        ast(process.argv[2]))
    }
`);