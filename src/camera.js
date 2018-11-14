const Transform = require('./transform/Transform.js');
const Events = require('./events/Events.js');
const hash = require('./helper.js').hash;

module.exports = class Camera {

    constructor () {
        this.name = hash();
        this.transform = new Transform();
        this.events = [];
        this.fov = 45;
        this.far = 10;
        this.near = 1;
    }

    getName () {
        return `camera_${this.name}`;
    }

    setProjection (args) {
        Object.assign(this, args);
    }

    applyTransformation (transformation) {
        this.transform.apply(transformation);
    }

    addEvent (event) {
        this.events.push({
            ...event, hndl: event.hndl(this.getName())
        });
    }

    isDynamic () {
        return this.events.events.length;
    }

    toString () {
        const _hash = hash();
        const a = 1 * Math.tan(this.fov * Math.PI / 360);
        const i = a + a, j = this.far - this.near;
        const { world, model } = this.transform.get();

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
                world: ${JSON.stringify(world)},
                model: ${JSON.stringify(model)},
                matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                isDirty: true
            };

            cameras.push(${this.getName()});
            enableCamera(${this.getName()});
            
        `;

    }

}