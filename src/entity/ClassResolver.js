const classes = {
    geometry: require('./Geometry'),
    camera: require('./Camera'),
    model: require('./Model'),
    world: require('./World'),
    light: require('./Light'),
    material: require('./Material'),
    mesh: require('./Mesh'),
    transform: require('./Transform'),
}

module.exports = {
    get: function (className) {
        return classes[className];
    }
};