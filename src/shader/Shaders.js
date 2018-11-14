const PhongShader = require('./Phong.js')

module.exports = class Scene {

    constructor () {
        this.directional_lights = [];
        this.ambient_lights = [];
        this.point_lights = [];
        this.shaders = {};
    }

    addGeometry (geometry) {
        let index = 0;

        if (geometry.hasUniformColor()) {
            index |= 1; // 1
        }

        if (geometry.hasTexture()) {
            index |= 1 << 1;
        }

        if (geometry.hasNormals()) {
            index |= 1 << 2;
        }

        if (!this.shaders[index]) {
            this.shaders[index] = new PhongShader(index);
        }

        this.shaders[index].geometries.push(geometry.getName());
    }

    appendLight (light) {

        light = Object.assign({
            type: 'directional',
            direction: [0.5, 0.5, 0.5],
            color: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 }
        }, light);

        switch (light.type) {
            case 'directional': this.directional_lights.push(light); break;
            case 'ambient': this.ambient_lights.push(light); break;
            case 'point': this.point_lights.push(light); break;
        }

    }

    toString () {

        const ambient_lights = this.ambient_lights.reduce((out, light) => {
            out[0] += light.color.r;
            out[1] += light.color.g;
            out[2] += light.color.b;
            return out;
        }, [0, 0, 0, 1.0]);

        if (this.ambient_lights.length) {
            ambient_lights[0] /= this.ambient_lights.length * 255;
            ambient_lights[1] /= this.ambient_lights.length * 255;
            ambient_lights[2] /= this.ambient_lights.length * 255;
        }

        const directional_lights = this.directional_lights.map(light => {
            const direction = light.direction;
            const length = Math.sqrt(
                direction[0] * direction[0] + 
                direction[1] * direction[1] + 
                direction[2] * direction[2]
            );

            return { ...light, direction: [
                direction[0] / length,
                direction[1] / length,
                direction[2] / length
            ]};
        });

        return Object.keys(this.shaders).map(shader => this.shaders[shader].generateInitializationBlock(
            directional_lights, ambient_lights, this.point_lights
        ));
        
    }

}