const Transform = require('./transform/Transform.js');
const Events = require('./events/Events.js');
const hash = require('./helper.js').hash;
const load = require('./parser/Loader.js');
const math = require('./math.js')

module.exports = class Geometry {

    constructor () {
        this.vertexs = [];
        this.indexes = [];
        this.normals = [];
        this.uvs = [];
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

    // Configure Texture as externla object 
    // and append to geometry
    setTexture (args) {
        this.texture_source = args.src;
    }
    
    applyTransformation (transformation) {
        this.transform.apply(transformation);
    }
    
    getTransformedVertexs () {
        this.transform.transformVertices(this.vertexs);
        return this.vertexs;
    }

    getNormals () {
        if (!this.normals.length||true) {
            this.generateNormals();
        }

        return this.normals;
    }

    loadFromFile (args) {
        const geometry = load(args.src);
        console.log(Object.keys(geometry).map(key => geometry[key].length));
        Object.assign(this, geometry);
    }

    setColor (args) {
        if (args.hex) {
            Object.assign(this.color, args.hex);
        }
        
        Object.assign(this.color, args);
    }

    generateNormals () {
        this.normals = [];

        for (var i = 0; i < this.vertexs.length; i++) {
            this.normals[i] = 0;
        }
    
        for (var i = 0; i < this.indexes.length; i += 3) {
    
            //Point A
            var e1 = [
                this.vertexs [this.indexes[i] * 3],
                this.vertexs [this.indexes[i] * 3 + 1],
                this.vertexs [this.indexes[i] * 3 + 2]
            ];
    
            //Point B
            var e2 = [
                this.vertexs [this.indexes[i + 1] * 3],
                this.vertexs [this.indexes[i + 1] * 3 + 1],
                this.vertexs [this.indexes[i + 1] * 3 + 2]
            ];
    
            //Point C
            var e3 = [
                this.vertexs [this.indexes[i + 2] * 3],
                this.vertexs [this.indexes[i + 2] * 3 + 1],
                this.vertexs [this.indexes[i + 2] * 3 + 2]
            ];
    
            var n = math.vec3.cross(math.vec3.subtract(e2, e1), math.vec3.subtract(e3, e1));
    
            this.normals [this.indexes[i] * 3] += n [0];
            this.normals [this.indexes[i] * 3 + 1] += n [1];
            this.normals [this.indexes[i] * 3 + 2] += n [2];
    
            this.normals [this.indexes[i + 1] * 3] += n [0];
            this.normals [this.indexes[i + 1] * 3 + 1] += n [1];
            this.normals [this.indexes[i + 1] * 3 + 2] += n [2];
    
            this.normals [this.indexes[i + 2] * 3] += n [0];
            this.normals [this.indexes[i + 2] * 3 + 1] += n [1];
            this.normals [this.indexes[i + 2] * 3 + 2] += n [2];
    
        }
    
        for (var i = 0; i < this.normals.length; i += 3) {
            var length = Math.sqrt(
                this.normals [i] * this.normals [i] + 
                this.normals [i + 1] * this.normals [i + 1] + 
                this.normals [i + 2] * this.normals [i + 2]
            );
    
            this.normals [i] /= length || 1;
            this.normals [i + 1] /= length || 1;
            this.normals [i + 2] /= length || 1;
        }

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

            const n_buff_${r_hash} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, n_buff_${r_hash});
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                ${this.getNormals()}
            ]).buffer, webgl.STATIC_DRAW);

            const uvs_buff_${r_hash} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, uvs_buff_${r_hash});
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                ${this.uvs}
            ]).buffer, webgl.STATIC_DRAW);

            const f_buff_${r_hash} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_${r_hash});
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                ${this.indexes}
            ]).buffer, webgl.STATIC_DRAW);
            
            const texture_${r_hash} = webgl.createTexture();
            const image_${r_hash} = new Image();
            image_${r_hash}.onload = function () {
                webgl.bindTexture(webgl.TEXTURE_2D, texture_${r_hash});
                webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image_${r_hash});
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_NEAREST);
                webgl.generateMipmap(webgl.TEXTURE_2D);
            }
            image_${r_hash}.src = '${this.texture_source}';

            const geometry_${g_hash} = Object.assign({
                vertexs: v_buff_${r_hash},
                indexes: f_buff_${r_hash},
                normals: n_buff_${r_hash},
                uvs: uvs_buff_${r_hash},
                texture: texture_${r_hash},
                count: ${this.indexes.length},
                color: [${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a}],
                transform: new Transform([${this.transform.transform}])
            });
            geometries.push(geometry_${g_hash});

            ${this.events.toString(`geometry_${g_hash}`)}

        `;
    }

}