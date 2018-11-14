const math = require('../math.js');

module.exports = class Transform {

    constructor () {
        this.transform = [

            // Model Transformations
            {
                translate: [0, 0, 0],
                x_angle: 0,
                y_angle: 0,
                z_angle: 0,
                scale: 1.0,
                matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                isDirty: true
            },

            // World Transformations
            {
                translate: [0, 0, 0],
                x_angle: 0,
                y_angle: 0,
                z_angle: 0,
                scale: 1.0,
                matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                isDirty: true
            }

        ];        
    }

    translate (args) {
        args = { x: 0, y: 0, z: 0, space: 0, ...args,  }

        this.transform[args.space].translate = math.vec3.add(
            this.transform[args.space].translate, [args.x, args.y, args.z]
        );
    }

    scale (args) {
        return;
    }

    rotate (args) {
        args = { x: 0, y: 0, z: 0, space: 0, ...args, }

        this.transform[args.space].x_angle += args.x;
        this.transform[args.space].y_angle += args.y;
        this.transform[args.space].z_angle += args.z;
    }

    applyTransformation (space, transformation) {

        if (typeof transformation.translate[0] == 'number' && !isNaN(transformation.translate[0])) {
            space.translate[0] += transformation.translate[0];
        }

        if (typeof transformation.translate[1] == 'number' && !isNaN(transformation.translate[1])) {
            space.translate[1] += transformation.translate[1];
        }

        if (typeof transformation.translate[2] == 'number' && !isNaN(transformation.translate[2])) {
            space.translate[2] += transformation.translate[2];
        }

        if (typeof transformation.x_angle == 'number' && !isNaN(transformation.x_angle)) {
            space.x_angle += transformation.x_angle;
        }

        if (typeof transformation.y_angle == 'number' && !isNaN(transformation.y_angle)) {
            space.y_angle += transformation.y_angle;
        }

        if (typeof transformation.z_angle == 'number' && !isNaN(transformation.z_angle)) {
            space.z_angle += transformation.z_angle;
        }

        if (typeof transformation.scale == 'number' && !isNaN(transformation.scale)) {
            space.scale += transformation.scale;
        }

    }

    apply (transformation) {
        this.applyTransformation(this.transform[0], transformation.transform[0]);
        this.applyTransformation(this.transform[1], transformation.transform[1]);
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
        this.transformVerticesIntoSpace(vertices, this.transform[1]);
    }

    get () {
        return {
            model: this.transform[0],
            world: this.transform[1],
        };
    }

}