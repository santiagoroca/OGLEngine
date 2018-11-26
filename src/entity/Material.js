const Entity = require('./Entity');
const Color = require('../runtime/NativeTypes/Color')

class Material extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'materials',
            singular: 'material',
            defaults: {
                opacity: NativeTypes.number(255.0),
                shininess: NativeTypes.number(1.0),
                color: NativeTypes.color(),
            }
        });
    }

    getColor () {
        return new Color(
            this.color.r, this.color.g, this.color.b, this.opacity
        );
    }

}

module.exports = Material;