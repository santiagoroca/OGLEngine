const Transform = require('./transform.js');

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
        let out = '';

        /*
        * Events
        */
        out += `
            canvas.addEventListener('mousemove', (event) => {

                if (isLeftMousePressed) {
                    const variables = {
                        delta_x: (event.x - prevXPosition) * 0.001,
                        delta_y: -(event.y - prevYPosition) * 0.001
                    }

                    ${this.events}

                    prevXPosition = event.x;
                    prevYPosition = event.y;

                    updateMatrix();
                }
                
            });
        `

        /*
        * Geometries
        */
        let vertexs = [];
        let indexes = [];
        let offset = 0;

        for (const geometry of this.geometries) {
            Array.prototype.push.apply(vertexs, geometry.getTransformedVertexs());
            
            for (const index of geometry.indexes) {
                indexes.push(index + offset);
            }

            offset += geometry.vertexs.length / 3;
        }

        out += `

            const v_buff = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([${vertexs}]).buffer, webgl.STATIC_DRAW);

            const f_buff = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([${indexes}]).buffer, webgl.STATIC_DRAW);

            geometries.push({
                vertexs: v_buff,
                indexes: f_buff,
                count: ${indexes.length}
            });

        `;

        return out;
    }

    addEvents (events) {
        Array.prototype.push.apply(this.events, events.events);
    }

}