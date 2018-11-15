const Entity = require('./Entity');
const math = require('../math.js');

module.exports = class Matrix extends Entity {

    defaults () {
        this._translate = [0, 0, 0];
        this._x_angle = 0;
        this._y_angle = 0;
        this._z_angle = 0;
        this._scale = 1.0;
    }

    translate (args) {
        args = { x: 0, y: 0, z: 0, space: 0, ...args,  }

        this._translate = math.vec3.add(
            this._translate, [args.x, args.y, args.z]
        );
    }

    scale (args) {
        args = { size: 1, space: 0, ...args, }

        this._scale *= args.size;
    }

    rotate (args) {
        args = { x: 0, y: 0, z: 0, space: 0, ...args, }

        this._x_angle += args.x;
        this._y_angle += args.y;
        this._z_angle += args.z;
    }

    getMatrix () {
        let transform = math.mat4.identity();

        transform = math.mat4.translate(transform, this._translate);
        transform = math.mat4.rotate(transform, this._y_angle, [transform[1], transform[5], transform[9]]);
        transform = math.mat4.rotate(transform, this._x_angle, [transform[0], transform[4], transform[8]]);
        transform = math.mat4.rotate(transform, this._z_angle, [transform[2], transform[6], transform[10]]);

        return transform;
    }

    get () {
        return {
            translate: this._translate,
            x_angle: this._x_angle,
            y_angle: this._y_angle,
            z_angle: this._z_angle,
            scale: this._scale,
            matrix: [
                1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
            ],
            isDirty: true
        };
    }

}