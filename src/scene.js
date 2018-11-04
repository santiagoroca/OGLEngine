const Transform = require('./transform.js');
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
        this.geometries = [];
        this.transform = new Transform();
        this.events = [];
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
        
        return out;
    }

    addEvents (events) {
        Array.prototype.push.apply(this.events, events.events);
    }

}