class Color { constuctor (r = 0, g = 0, b = 0, a = 1) { this.r = r; this.g = g; this.b = b; this.a = a; } }
class Vec3 { constuctor (x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; } }

function GenerateProperty (type, default_value, check) {
    return function (def) {
        def = def || default_value();

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

    self: (value) => ({
        configurable: true,
        get: () => value,
        set: (v) => value = v
    })

};