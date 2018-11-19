const Entity = require('./Entity');
const EntityConverter = require('../runtime/EntityConverter')

class Light extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'lights',
            singular: 'light',
            defaults: {

                // Defaults
                type: 'point',

                // All lights
                color: { r: 0, g: 0, b: 0, a: 1.0 },
                
                // Directional Light
                direction: [1.0, 1.0, 1.0],

                // Point Light
                position: [1.0, 1.0, 1.0],

                // Specular
                attenuation: 1.0,

            }
        });
    }

}

module.exports = EntityConverter(Light);