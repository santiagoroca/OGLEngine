module.exports = class Color { 
    
    constructor (r = 255, g = 255, b = 255, a = 255) { 
        this.r = r; this.g = g; this.b = b; this.a = a; 
    }

    toString (normalize = 1) {
        return `
            ${(this.r/normalize).toFixed(1)},
            ${(this.g/normalize).toFixed(1)},
            ${(this.b/normalize).toFixed(1)},
            ${(this.a/normalize).toFixed(1)}
        `;
    }

    toStringNoAlpha (normalize = 1) {
        return `
            ${(this.r/normalize).toFixed(1)},
            ${(this.g/normalize).toFixed(1)},
            ${(this.b/normalize).toFixed(1)}
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