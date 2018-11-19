const Entity = require('./Entity');
const EntityConverter = require('../runtime/EntityConverter')

class Material extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'materials',
            singular: 'material',
            defaults: {
                shininess: 1.0
            }
        });
    }

}

module.exports = EntityConverter(Material);