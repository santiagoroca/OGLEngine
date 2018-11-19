const Entity = require('./Entity');

module.exports = class Material extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'materials',
            singular: 'material'
        });
    }

    defaults () {
        this.shininess = 1.0;
    }

    toString () {
        return ``;
    }

}