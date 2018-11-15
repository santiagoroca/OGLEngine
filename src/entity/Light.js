const Entity = require('./Entity');

module.exports = class Light extends Entity {

    defaults () {
        this.type = 0;
        this.direction = [0, 0, 0];
        this.position = [0, 0, 0];
    }

}