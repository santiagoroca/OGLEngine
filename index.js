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
    Scene: require('./src/entity/Scene.js'),
    Camera: require('./src/entity/Camera.js'),
    Light: require('./src/entity/Light.js'),
    Transform: require('./src/entity/Transform.js'),
    Matrix: require('./src/entity/Matrix.js'),

    Events: require('./src/events/Events.js'),
    TransformEvents: require('./src/events/TransformEvents.js'),
    Geometry: require('./src/geometry.js'),
    Math: require('./src/math.js'),
    Constants: require('./src/constants.js'),
}

// Clear Dist folder
fse.emptyDirSync('./dist/');
fse.ensureDirSync('./dist/assets/images')
fse.copySync('./client/index.html', './dist/index.html')

// Output program
write('dist/build.js', `
    ${read('./template/mat.js')}
    ${read('./template/transform.js')}
    ${WRAPPER_TEMPLATE.replace(/'%scene%'/g, parser.parse(
        read(process.argv[2]).toString()
    ))}
`);