module.exports = class Config {

    constructor (globalConfig) {
        this.globalConfig = globalConfig;
        this.key = 0;
    }

    shouldRenderCubeMap () {
        return this.globalConfig.shouldRenderCubeMap;
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

    setSpecularMap (value) {
        this.key |= (value << 11);
    }

    hasSpecularMap () {
        return (this.key & 2048) == 2048;
    }

}