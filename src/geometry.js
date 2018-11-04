const read = require('fs').readFileSync;
const Transform = require('./transform.js');

module.exports = class Geometry {

    constructor () {
        this.vertexs = [];
        this.indexes = [];
        this.transform = new Transform();
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

}