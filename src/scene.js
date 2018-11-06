const Transform = require('./transform/Transform.js');
const Camera = require('./Camera.js');
const GeometryBatch = require('./geometry_batch.js');

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
        this.cameras = [];
        this.geometries = [];
        this.events = [];
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

            if (geometry.isDynamic()) {
                out += geometry.toString();
            } else {
                geometryBatch.addGeometry(geometry);
            }

        }

        out += geometryBatch.toString();
        out += this.cameras.map(camera => camera.toString()).join('\n');
        
        return out;
    }

    addEvents (events) {
        Array.prototype.push.apply(this.events, events.events);
    }

}