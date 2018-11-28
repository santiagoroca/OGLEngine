module.exports = class Vec3 {
    
    constructor (x = 0, y = 0, z = 0) {
        this.x = x; this.y = y; this.z = z; 
    }

    normalize () {
        const a = this.x * this.x;
        const b = this.y * this.y;
        const c = this.z * this.z;
        const normal = Math.sqrt(a + b + c);

        this.x /= normal;
        this.y /= normal;
        this.z /= normal;
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