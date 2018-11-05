const read = require('fs').readFileSync;
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
    Transform: require('./src/transform/Transform.js'),
    Math: require('./src/math.js'),
}

// Output program
console.log(
    WRAPPER_TEMPLATE.replace(/'%scene%'/g, parser.parse(
        read('./test/test.ogl').toString()
    ))
);

/*WRAPPER_TEMPLATE.replace(/'%scene%'/g, parser.parse(
    read('./test/test.ogl').toString()
))*/