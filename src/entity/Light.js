const Entity = require('./Entity');

class Light extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'lights',
            singular: 'light',
            defaults: {

                // Defaults
                type: NativeTypes.string('point'),

                // All lights
                color: NativeTypes.color(),
                
                // Directional Light
                direction: NativeTypes.vec3(new Vec3(1.0, 1.0, 1.0)),

                // Point Light
                position: NativeTypes.vec3(new Vec3(1.0, 1.0, 1.0)),

                // Specular
                attenuation: NativeTypes.number(1.0),

            }
        });
    }

}

module.exports = Light;