const MergeStatements = require('../process/merge_statements');

const classes = {
    geometry: require('../entity/Geometry'),
    camera: require('../entity/Camera'),
    model: require('../entity/Model'),
    world: require('../entity/World'),
    light: require('../entity/Light'),
    material: require('../entity/Material'),
    mesh: require('../entity/Mesh'),
    transform: require('../entity/Transform'),
}

module.exports = {

    get: (className) => classes[className],

    set: (newClass, oldClass, inStatements) => {
        classes[newClass] = class extends oldClass {
            constructor (parent, statements = []) {
                super(parent, MergeStatements(
                    JSON.parse(JSON.stringify(inStatements)),
                    statements
                ));
            }
        }
    }

};