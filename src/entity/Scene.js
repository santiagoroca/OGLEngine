const Entity = require('./Entity');
const Cubemap = require('./Cubemap.js');
const Shaders = require('../shader/Shaders.js');
const Lightmap = require('../shadow/Lightmap')
const Render = require('./Render.js');
const Events = require('./Events');

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
                cameras: NativeTypes.infer([]),
                geometries: NativeTypes.infer([]),
                lights: NativeTypes.infer([]),
                cubemap: NativeTypes.infer(new Cubemap()),
            }
        });
    }

    getGeometries () {
        return this.geometries;
    }

    toString () {
        let out = `
            function viewer (container) {

                /*
                * Canvas Configuration
                */
                const canvas = document.createElement('canvas');
                canvas.style.width = "100%";
                canvas.style.height = "100%";
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
                container.appendChild(canvas);
                canvas.oncontextmenu = () => false;

                /*
                * WebGL Context Configuration
                */
                const webgl = canvas.getContext("webgl");
                webgl.viewport(0, 0, container.clientWidth, container.clientHeight);
                webgl.clearColor(0.0, 0.0, 0.0, 0.0);
                webgl.getExtension('OES_element_index_uint');
                webgl.getExtension('OES_standard_derivatives');
                webgl.getExtension('WEBGL_depth_texture');
                webgl.enable(webgl.DEPTH_TEST);
                webgl.depthFunc(webgl.LEQUAL);
                /*webgl.enable(webgl.BLEND);
                webgl.blendEquation(webgl.FUNC_ADD);
                webgl.blendFuncSeparate(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA, webgl.ONE, webgl.ONE_MINUS_SRC_ALPHA);*/
                //webgl.enable (webgl.CULL_FACE);

                /*
                * There are multiple cameras but only one active
                */
                const cameras = [];
                let activeCamera = null;

                /*
                *
                */
                function enableCamera (camera) {
                    activeCamera = camera; 
                }

        `;

        const events = new Events();
        const lightmap = new Lightmap(this.lights);
        const shaders = new Shaders({
            shouldRenderCubeMap: this.cubemap.shouldRenderCubeMap() && 
                                 this.cubemap.cubemap_reflection
        }, this.lights);

        if (this.cubemap) {
            out += this.cubemap.toString();
        }   

        for (const geometry of this.geometries) {
            console.log(geometry.material.opacity);
            out += geometry.toString();

            lightmap.addGeometry(geometry);
            shaders.addGeometry(geometry);
            events.addEvents(geometry.getEvents(), geometry);
        }

        for (const camera of this.cameras) {
            out += camera.toString();
            events.addEvents(camera.getEvents(), camera);
        }

        out += lightmap.toString();
        out += shaders.toString();
        out += Render([
            this.cubemap.generateRenderBlock(),
            shaders.generateRenderBlock()
        ]);
        out += events.toString();
        
        return out + '}';
    }

}

module.exports = Scene;