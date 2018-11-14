const Transform = require('./transform/Transform.js');
const Shaders = require('./shader/Shaders.js');
const GeometryBatch = require('./geometry_batch.js');
const Render = require('./render.js');
const Events = require('./events/Events');

/*
* @title Scene
*
* @description 
*
* @arg 
*
* @return Scene
*/
module.exports = class Scene {

    constructor () {
        this.transform = new Transform();
        this.shaders = new Shaders();
        this.events = new Events();
        this.cameras = [];
        this.geometries = [];
    }

    appendLight (light) {
        this.shaders.appendLight(light);
    }

    appendCamera (camera) {
        if (!camera) {
            return;
        }

        this.cameras.push(camera);
    }

    appendGeometry (geometry) {
        if (!geometry) {
            return;
        }

        this.geometries.push(geometry);
    }

    getGeometries () {
        return this.geometries;
    }

    toString () {
        let out = '';

        for (const geometry of this.geometries) {
            out += geometry.toString();
            this.shaders.addGeometry(geometry);
            this.events.addEvents(geometry.events, geometry.getName());
        }

        for (const camera of this.cameras) {
            out += camera.toString();
            this.events.addEvents(camera.events, camera.getName());
        }
        
        out += this.shaders.toString();
        out += Render(this.shaders.shaders);
        out += this.events.toString();
        
        return out;
    }

    addEvents (events) {
        Array.prototype.push.apply(this.events, events.events);
    }

}