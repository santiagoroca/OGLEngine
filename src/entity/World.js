const Entity = require('./Entity');
const math = require('../runtime/math.js');
const TransformEvents = require('../events/TransformEvents');

class World extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'worlds',
            singular: 'world',
            defaults: {
                events: NativeTypes.self([]),
                _translate: NativeTypes.vec3(),
                _x_angle: NativeTypes.number(),
                _y_angle: NativeTypes.number(),
                _z_angle: NativeTypes.number(),
                _scale: NativeTypes.number(1.0)
            }
        });
    }

    translate (args) {
        args = { x: 0, y: 0, z: 0, ...args,  }

        this._translate.x += args.x;
        this._translate.y += args.y;
        this._translate.z += args.z;
    }

    scale (args) {
        args = { size: 1, ...args, }
        this._scale *= args.size;
    }

    rotate (args) {
        args = { x: 0, y: 0, z: 0, ...args, }

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

    getEvents (object_id) {
        return this.events.map(event => {
            const [ type, args ] = event.hndl;
            
            return {
                 ...event, hndl: TransformEvents[type](object_id, args)
            }
        });
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

module.exports = World;