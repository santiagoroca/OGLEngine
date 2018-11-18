module.exports = class Config {

    constructor () {
        this.key = 0;
    }

    setUniformColor (value) {
        this.key |= value;
    }

    hasUniformColor () {
        return (this.key & 1) == 1;
    }

    setTexture (value) {
        this.key |= value << 1;
    }

    hasTexture () {
        return (this.key & 2) == 2;
    }

    setNormals (value) {
        this.key |= value << 2;
    }
    
    hasNormals () {
        return (this.key & 4) == 4;
    }

    setShininess (value) {
        this.key |= (value << 3) >>> 0;
    }

    getShininess () {
        return (this.key >> 3) & 255;
    }

    setSpecularMap (value) {
        this.key |= (value << 11);
    }

    hasSpecularMap () {
        return (this.key & 2048) == 2048;
    }

}