const Transform = require('./transform/Transform.js');
const Events = require('./events/Events.js');
const hash = require('./helper.js').hash;
const load = require('./parser/loader.js');

module.exports = class Geometry {

    constructor () {
        this.vertexs = [];
        this.indexes = [];
        this.color = { r: 0.5, g: 0.5, b: 0.5, a: 1.0 };
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

    loadFromFile (args) {
        const geometry = load(args.src);
        this.vertexs = geometry.vertexs;
        this.indexes = geometry.indexes;
    }

    setColor (args) {
        if (args.hex) {
            Object.assign(this.color, args.hex);
        }
        
        Object.assign(this.color, args);
    }

    addEvent (event) {
        this.events.addEvent(event);
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

            const geometry_${g_hash} = Object.assign({
                vertexs: v_buff_${r_hash},
                indexes: f_buff_${r_hash},
                count: ${this.indexes.length},
                color: [${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a}],
                transform: new Transform([${this.transform.transform}])
            });
            geometries.push(geometry_${g_hash});

            ${this.events.toString(`geometry_${g_hash}`)}

        `;
    }

}