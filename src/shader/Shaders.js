const PhongShader = require('./Phong')
const Config = require('./Config')

module.exports = class Scene {

    constructor (globalConfig, lights) {
        this.globalConfig = globalConfig;
        this.directional_lights = [];
        this.ambient_lights = [];
        this.point_lights = [];
        this.shaders = {};

        for (const light of lights) {
            this.appendLight(light);
        }
    }

    addGeometry (geometry) {
        let config = new Config(this.globalConfig);

        config.setUniformColor(geometry.hasUniformColor() ? 1 : 0);
        config.setTexture(geometry.hasTexture() ? 1 : 0);
        config.setNormals(geometry.hasNormals() ? 1 : 0);
        config.setSpecularMap(geometry.hasSpecularMap() ? 1 : 0);

        if (!this.shaders[config.key]) {
            this.shaders[config.key] = new PhongShader(config);
        }

        this.shaders[config.key].geometries.push(geometry.getName());
    }

    appendLight (light) {
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
            const direction = light.direction.asArray();
            const length = Math.sqrt(
                direction[0] * direction[0] + 
                direction[1] * direction[1] + 
                direction[2] * direction[2]
            );

            light.direction[0] /= length;
            light.direction[1] /= length;
            light.direction[2] /= length;

            return light;
        });

        return Object.keys(this.shaders).map(shader => this.shaders[shader].generateInitializationBlock(
            directional_lights, ambient_lights, this.point_lights
        )).join('\n');
        
    }

    generateRenderBlock () {
        return Object.keys(this.shaders).map(
            shader => this.shaders[shader].generateRenderBlock()
        ).join('\n')
    }

}