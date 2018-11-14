const fs = require('fs');
const fse = require('fs-extra');
const read = require('fs').readFileSync;
const write = require('fs').writeFileSync;
const Parser = require('jison').Parser;
const syntax = require('./syntax.js');
const WRAPPER_TEMPLATE = read('./template/wrapper.js').toString();
const parser = new Parser(syntax);

// bla bla
parser.generate();

// Load all context classes
parser.yy = {
    Events: require('./src/events/Events.js'),
    TransformEvents: require('./src/events/TransformEvents.js'),
    Scene: require('./src/scene.js'),
    Geometry: require('./src/geometry.js'),
    Camera: require('./src/camera.js'),
    Transform: require('./src/transform/Transform.js'),
    Math: require('./src/math.js'),
    Constants: require('./src/constants.js'),
}

// Clear Dist folder
fse.emptyDirSync('./dist/');
fse.ensureDirSync('./dist/assets/images')

// Output program
write('dist/build.js', `
    ${read('./template/mat.js')}
    ${read('./template/transform.js')}
    ${WRAPPER_TEMPLATE.replace(/'%scene%'/g, parser.parse(
        read(process.argv[2]).toString()
    ))}
`);