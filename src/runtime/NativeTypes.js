const Color = require('./NativeTypes/Color')
const Vec3 = require('./NativeTypes/Vec3')

function GenerateProperty (type, default_value, check) {
    return function (def) {
        def = typeof def == 'undefined' ? default_value() : def;
        
        return {
            configurable: true,
            get: () => def,
            set: (value) => {
                if(check(value)) {
                    throw(new Error(`Non ${type} assignation to ${type} variable.`))
                }

                def = value;
            }
        } 
    }
}

module.exports = {

    Color, Vec3,

    number: GenerateProperty('number', () => 0, value => {
        return isNaN(parseFloat(value)) || !isFinite(value)
    }),

    string: GenerateProperty('string', () => undefined, value => {
        return typeof value !== 'string'
    }),

    boolean: GenerateProperty('boolean', () => true, value => {
        return typeof value !== 'boolean'
    }),

    color: GenerateProperty('Color', () => new Color(), value => {
        return value.constructor.name !== 'Color'
    }),

    vec3: GenerateProperty('vec3', () => new Vec3(), value => {
        return value.constructor.name !== 'Vec3'
    }),

    infer: function (value) {
        
        const type = typeof value;
        if (this[type]) {
            return this[type](value);
        }

        const name = value.constructor.name;
        if (this[name]) {
            return this[name](value);
        }

        return {
            configurable: true,
            get: () => value,
            set: (v) => value = v
        }
    }

};