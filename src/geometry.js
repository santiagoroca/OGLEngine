const read = require('fs').readFileSync;
const Transform = require('./transform/Transform.js');
const Events = require('./events/Events.js');
const hash = require('./helper.js').hash;

module.exports = class Geometry {

    constructor () {
        this.vertexs = [];
        this.indexes = [];
        this.transform = new Transform();
        this.events = new Events();
    }

    setVertexs (vertexs) {
        if (vertexs.length % 3 != 0) {
            throw('Vertexs array not multiple of 3.')
        }

        this.vertexs = vertexs;
    }
        
    setIndexes (indexes) {
        if (indexes.length % 3 != 0) {
            throw('Indexes array not multiple of 3.')
        }

        this.indexes = indexes;
    }
    
    applyTransformation (transformation) {
        this.transform.apply(transformation);
    }
    
    getTransformedVertexs () {
        this.transform.transformVertices(this.vertexs);
        return this.vertexs;
    }

    loadFromFile (url) {
        const file = JSON.parse(read(url));
        this.vertexs = file.vertexs;
        this.indexes = file.indexes;
    }

    addEvents (events) {
        this.events.addEvents(events);
    }

    isDynamic () {
        return this.events.events.length;
    }

    toString () {
        const r_hash = hash();
        const g_hash = hash();

        return `

            const v_buff_${r_hash} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_${r_hash});
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                ${this.vertexs}
            ]).buffer, webgl.STATIC_DRAW);

            const f_buff_${r_hash} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_${r_hash});
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                ${this.indexes}
            ]).buffer, webgl.STATIC_DRAW);

            const geometry_${g_hash} = {
                vertexs: v_buff_${r_hash},
                indexes: f_buff_${r_hash},
                count: ${this.indexes.length},
                localTransform: [${this.transform.transform}]
            };
            geometries.push(geometry_${g_hash});

            ${this.events.toString(`geometry_${g_hash}`)}

        `;
    }

}