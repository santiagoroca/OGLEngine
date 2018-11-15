const Entity = require('./Entity');

module.exports = class Light extends Entity {

    defaults () {
        this.type = 'directional';
        this.color = { r: 0, g: 0, b: 0, a: 1.0 };
        this.direction = [0, 0, 0];
        this.position = [0, 0, 0];
    }

}