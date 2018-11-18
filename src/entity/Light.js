const Entity = require('./Entity');

module.exports = class Light extends Entity {

    defaults () {

        // Defaults
        this.type = 'directional';

        // All lights
        this.color = { r: 0, g: 0, b: 0, a: 1.0 };
        
        // Directional Light
        this.direction = [0, 0, 0];

        // Point Light
        this.position = [0, 0, 0];

        // Specular
        this.attenuation = 1.0;

    }

}