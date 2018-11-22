module.exports = class Vec3 {
    
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