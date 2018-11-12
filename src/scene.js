const Transform = require('./transform/Transform.js');
const Shaders = require('./shader/Shaders.js');
const GeometryBatch = require('./geometry_batch.js');
const Render = require('./render.js');

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
        this.cameras = [];
        this.geometries = [];
        this.events = [];
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
        const geometryBatch = new GeometryBatch();
        let out = '';

        for (const geometry of this.geometries) {
            out += geometry.toString();
            this.shaders.addGeometry(geometry);
        }

        out += geometryBatch.toString();
        out += this.shaders.toString();
        out += this.cameras.map(camera => camera.toString()).join('\n');
        out += Render(this.shaders.shaders);
        
        return out;
    }

    addEvents (events) {
        Array.prototype.push.apply(this.events, events.events);
    }

}