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
    Entity: require('./src/entity/Entity.js'),
    Scene: require('./src/entity/Scene.js'),
    Camera: require('./src/entity/Camera.js'),
    Light: require('./src/entity/Light.js'),
    Transform: require('./src/entity/Transform.js'),
    Model: require('./src/entity/Model.js'),
    Material: require('./src/entity/Material.js'),
    World: require('./src/entity/World.js'),
    Geometry: require('./src/entity/Geometry.js'),

    Events: require('./src/events/Events.js'),
    TransformEvents: require('./src/events/TransformEvents.js'),
    
    Math: require('./src/math.js'),
    Constants: require('./src/constants.js'),
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