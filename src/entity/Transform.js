const TransformEvents = require('../events/TransformEvents')
const Entity = require('./Entity');
const math = require('../runtime/math')

class Transform extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'transforms',
            singular: 'transform',
            defaults: context => ({
                events: NativeTypes.infer([]),
                _translate: NativeTypes.vec3(),
                _x_angle: NativeTypes.number(),
                _y_angle: NativeTypes.number(),
                _z_angle: NativeTypes.number(),
                _scale: NativeTypes.number(1.0)
            })
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

        transform = math.mat4.translate(transform, this._translate.asArray());
        transform = math.mat4.rotate(transform, this._y_angle, [transform[1], transform[5], transform[9]]);
        transform = math.mat4.rotate(transform, this._x_angle, [transform[0], transform[4], transform[8]]);
        transform = math.mat4.rotate(transform, this._z_angle, [transform[2], transform[6], transform[10]]);

        return transform;
    }

    transformVertices (vertices) {
        const transform = this.getMatrix();

        for (let i = 0; i < vertices.length; i += 3) {
            let x = vertices[i];
            let y = vertices[i + 1];
            let z = vertices[i + 2];

            vertices[i] = x * transform[0] + y * transform[4] + z * transform[8] + transform[12];
            vertices[i + 1] = x * transform[1] + y * transform[5] + z * transform[9] + transform[13];
            vertices[i + 2] = x * transform[2] + y * transform[6] + z * transform[10] + transform[14];
        }
    }

    getEvents () {
        return this.events.map(event => {
            const [ type, args ] = event.hndl;
            
            return { ...event, hndl: TransformEvents[type](
                this.getName(), args
            )}
        });
    }

    toString () {
        return `

            const ${this.getName()} = {
                    translate: [${this._translate.asArray()}],
                    x_angle: ${this._x_angle},
                    y_angle: ${this._y_angle},
                    z_angle: ${this._z_angle},
                    scale: ${this._scale},
                    matrix: [
                        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                    ],
                    isDirty: true
            }

        `;
    }

}

module.exports = Transform;