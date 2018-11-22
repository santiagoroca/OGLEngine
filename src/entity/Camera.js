const Entity = require('./Entity');
const Transform = require('./Transform.js');
const hash = require('../runtime/helper.js').hash;

class Camera extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'cameras',
            singular: 'camera',
            defaults: context => ({
                transform: NativeTypes.infer(new Transform(context)),
                events: NativeTypes.infer([]),
                fov: NativeTypes.number(45),
                far: NativeTypes.number(10),
                near: NativeTypes.number(1),
            })
        });
    }

    getEvents () {
        const object_id = this.getName();

        return [
            ...this.events.map(event => ({
                ...event, hndl: event.hndl(object_id)
            })),
            ...this.transform.getEvents(`${object_id}.transform`)
        ];
    }

    isDynamic () {
        return this.events.events.length;
    }

    toString () {
        const _hash = hash();
        const a = 1 * Math.tan(this.fov * Math.PI / 360);
        const i = a + a, j = this.far - this.near;

        return `

            const aspect = canvas.width / canvas.height;
            const b = ${a} * aspect;
            const h = b + b;
            const ${this.getName()} = {
                projectionMatrix: [
                    1 * 2 / h, 0,            0,                    0,
                    0,         1 * 2 / ${i}, 0,                    0,
                    0,         0,            -11 / ${j},           -1,
                    0,         0,            -(10 * 1 * 2) / ${j}, 0
                ],
                transform: ${this.transform.toString()}
            };

            cameras.push(${this.getName()});
            enableCamera(${this.getName()});
            
        `;

    }

}

module.exports = Camera;