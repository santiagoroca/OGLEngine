class Color { 
    constructor (r = 255, g = 255, b = 255, a = 255) { 
        this.r = r; this.g = g; this.b = b; this.a = a; 
    }

    toString () {
        return `
            ${(this.r).toFixed(1)}, 
            ${(this.g).toFixed(1)}, 
            ${(this.b).toFixed(1)}, 
            ${(this.a).toFixed(1)}
        `;
    }

    asArray (normalize = 1) {
        return [
            this.r/normalize,
            this.g/normalize,
            this.b/normalize,
            this.a/normalize
        ]
    }
}

class Vec3 {
    constructor (x = 0, y = 0, z = 0) {
        this.x = x; this.y = y; this.z = z; 
    }

    toString () {
        return `
            ${(this.x).toFixed(1)},
            ${(this.y).toFixed(1)},
            ${(this.z).toFixed(1)}
        `
    }

    asArray () {
        return [
            this.x,
            this.y,
            this.z
        ]
    }
}

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

    infer: (value) => ({
        configurable: true,
        get: () => value,
        set: (v) => value = v
    })

};