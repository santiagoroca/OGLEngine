const Phong = require('./Phong.js')

module.exports = class Scene {

    constructor () {
        this.directional_lights = [];
        this.ambient_lights = [];
        this.point_lights = [];
    }

    appendLight (light) {

        light = Object.assign({
            type: 'directional',
            axis: [0.5, 0.5, 0.5],
            color: [0.5, 0.5, 0.5, 1.0]
        }, light);

        switch (light.type) {
            case 'directional': this.directional_lights.push(light); break;
            case 'ambient': this.ambient_lights.push(light); break;
            case 'point': this.point_lights.push(light); break;
        }

    }


    toString () {
        return [Phong].map(shader => shader(
            this.directional_lights, this.ambient_lights, this.point_lights
        ));
    }

}