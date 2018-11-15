const Entity = require('./Entity');
const Matrix = require('./Matrix');
const math = require('../math.js');

module.exports = class Transform extends Entity {

    defaults () {
        this.model = new Matrix;
        this.world = new Matrix;
    }

    transformVerticesIntoSpace (vertices, space) {
        let transform = math.mat4.identity();

        transform = math.mat4.translate(transform, space.translate);
        transform = math.mat4.rotate(transform, space.y_angle, [transform[1], transform[5], transform[9]]);
        transform = math.mat4.rotate(transform, space.x_angle, [transform[0], transform[4], transform[8]]);
        transform = math.mat4.rotate(transform, space.z_angle, [transform[2], transform[6], transform[10]]);

        for (let i = 0; i < vertices.length; i += 3) {
            let x = vertices[i];
            let y = vertices[i + 1];
            let z = vertices[i + 2];

            vertices[i] = x * transform[0] + y * transform[4] + z * transform[8] + transform[12];
            vertices[i + 1] = x * transform[1] + y * transform[5] + z * transform[9] + transform[13];
            vertices[i + 2] = x * transform[2] + y * transform[6] + z * transform[10] + transform[14];
        }
    }

    transformVertices (vertices) {
        this.transformVerticesIntoSpace(vertices, this.transform[0]);
    }

    get () {
        return {
            model: this.model,
            world: this.world,
        };
    }

}