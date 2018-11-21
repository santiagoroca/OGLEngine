const Entity = require('./Entity');

class Material extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'materials',
            singular: 'material',
            defaults: {
                shininess: NativeTypes.number(1.0)
            }
        });
    }

}

module.exports = Material;