const hash = require('./helper.js').hash;
const Math = require('./math.js');

module.exports = class GeometryBatch {
    
    constructor () {
        this.vertexs = [];
        this.indexes = [];
        this.normals = [];
        this.offset = 0;
        this.out = '';
    }

    addGeometry (geometry) {
        Array.prototype.push.apply(this.vertexs, geometry.getTransformedVertexs());
        Array.prototype.push.apply(this.normals, geometry.getNormals());
            
        for (const index of geometry.indexes) {
            this.indexes.push(index + this.offset);
        }

        this.offset += geometry.vertexs.length / 3;
    }

    toString () {
        return '';
        
        const r_hash = hash();

        return `
            const v_buff_${r_hash} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_${r_hash});
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                ${this.vertexs}
            ]).buffer, webgl.STATIC_DRAW);

            const n_buff_${r_hash} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, n_buff_${r_hash});
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                ${this.normals}
            ]).buffer, webgl.STATIC_DRAW);

            const f_buff_${r_hash} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_${r_hash});
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                ${this.indexes}
            ]).buffer, webgl.STATIC_DRAW);

            geometries.push({
                vertexs: v_buff_${r_hash},
                indexes: f_buff_${r_hash},
                normals: n_buff_${r_hash},
                count: ${this.indexes.length},
                transform: new Transform(), 
                color: [0.5, 0.5, 0.5, 1.0]
            })
        `
    }

}