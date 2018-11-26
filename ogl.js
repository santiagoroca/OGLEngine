const ClassResolver = require(__dirname + '/src/runtime/ClassResolver');
const NativeTypes = require(__dirname + '/src/runtime/NativeTypes')
const Log = require(__dirname + '/src/runtime/Log')

global['MORE_INFO_LEVEL'] = 5;
global['INFO_LEVEL'] = 4;
global['WARNING_LEVEL'] = 3;
global['ERROR_LEVEL'] = 2;

global['Log'] = Log;
global['ClassResolver'] = ClassResolver;
global['NativeTypes'] = NativeTypes;

const write = require('fs').writeFileSync;
const read = require('fs').readFileSync;
const WRAPPER_TEMPLATE = read(__dirname + '/template/wrapper.js').toString();
const fse = require('fs-extra');
const ast = require(__dirname + '/ast')

// Clear Dist folder
fse.ensureDirSync('./dist/textures')
fse.ensureDirSync('./dist/models')
fse.emptyDirSync('./dist/textures');
fse.emptyDirSync('./dist/models');

module.exports = (filename, loglevel = 2) => {
    global['LOG_LEVEL'] = loglevel;
    const scene = ast(filename).toString();

    // Output program
    write('./dist/build.js', `
        ${read(__dirname + '/template/mat.js')}
        ${read(__dirname + '/template/transform.js')}
        ${WRAPPER_TEMPLATE.replace(/'%scene%'/, scene)}
    `);
}

