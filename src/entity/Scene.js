const Entity = require('./Entity');
const Camera = require('./Camera');
const Geometry = require('./Geometry');
const Light = require('./Light');
const Shaders = require('../shader/Shaders.js');
const Render = require('./Render.js');
const Events = require('./Events');
const EntityConverter = require('../runtime/EntityConverter')

/*
* @title Scene
*
* @description 
*
* @arg 
*
* @return Scene
*/
class Scene extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'scenes',
            singular: 'scene',
            defaults: {
                cameras: [],
                geometries: [],
                lights: [],
            }
        });
    }

    addCamera ([ statements ]) {
        this.cameras.push(new Camera(this, statements));
    }

    addLight ([ statements ]) {
        this.lights(new Light(this, statements));
    }

    addGeometry ([ statements ]) {
        this.geometries.push(new Geometry(this, statements));
    }

    getGeometries () {
        return this.geometries;
    }

    toString () {
        let out = '';

        const shaders = new Shaders(this.lights);
        const events = new Events();

        for (const geometry of this.geometries) {
            out += geometry.toString();
            shaders.addGeometry(geometry);
            events.addEvents(geometry.getEvents(), geometry.getName());
        }

        for (const camera of this.cameras) {
            out += camera.toString();
            events.addEvents(camera.getEvents(), camera.getName());
        }
        
        out += shaders.toString();
        out += Render(shaders.shaders);
        out += events.toString();
        
        return out;
    }

}

module.exports = EntityConverter(Scene);