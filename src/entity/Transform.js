const Entity = require('./Entity');
const World = require('./World');
const Model = require('./Model');
const math = require('../math.js');

module.exports = class Transform extends Entity {

    defaults () {
        this.events = [];
        this.model = new Model(this);
        this.world = new World(this);
    }

    setModel ([ statements ]) {
        this.model = new Model(this, statements);
    }

    setWorld ([ statements ]) {
        this.world = new World(this, statements);
    }

    transformVerticesIntoSpace (vertices, space) {
        const transform = space.getMatrix();

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
        this.transformVerticesIntoSpace(vertices, this.model);
    }

    getEvents (object_id) {
        return [
            ...this.events.map(event => ({
                ...event, hndl: event.hndl(object_id)
            })),
            ...this.model.getEvents(`${object_id}.model`),
            ...this.world.getEvents(`${object_id}.world`)
        ];
    }

    toString () {
        return JSON.stringify({
            model: this.model.get(),
            world: this.world.get(),
        });
    }

}