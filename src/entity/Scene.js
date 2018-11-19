const Entity = require('./Entity');
const Camera = require('./Camera');
const Geometry = require('./Geometry');
const Light = require('./Light');
const Shaders = require('../shader/Shaders.js');
const Render = require('../render.js');
const Events = require('../events/Events');

/*
* @title Scene
*
* @description 
*
* @arg 
*
* @return Scene
*/
module.exports = class Scene extends Entity {

    defaults () {
        this.shaders = new Shaders();
        this.events = new Events();
        this.cameras = [];
        this.geometries = [];
    }

    addCamera ([ statements ]) {
        this.cameras.push(new Camera(this, statements));
    }

    addLight ([ statements ]) {
        this.shaders.appendLight(new Light(this, statements));
    }

    addGeometry ([ statements ]) {
        this.geometries.push(new Geometry(this, statements));
    }

    getGeometries () {
        return this.geometries;
    }

    toString () {
        let out = '';

        for (const geometry of this.geometries) {
            out += geometry.toString();
            this.shaders.addGeometry(geometry);
            this.events.addEvents(geometry.getEvents(), geometry.getName());
        }

        for (const camera of this.cameras) {
            out += camera.toString();
            this.events.addEvents(camera.getEvents(), camera.getName());
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