const Entity = require('./Entity');

module.exports = class Material extends Entity {

    defaults () {
        this.shininess = 1.0;
    }

    getName () {
        return `material_${this.name}`;
    }

    getEvents () {
        return [];
    }

    toString () {
        return ``;
    }

}