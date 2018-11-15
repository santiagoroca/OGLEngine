const Transform = require('./entity/Transform.js');
const hash = require('./helper.js').hash;
const load = require('./parser/Loader.js');
const math = require('./math.js');
const read = require('fs').readFileSync;
const write = require('fs').writeFileSync;

module.exports = class Geometry {

    constructor () {

        /*
        * Fixed arguments that should always 
        * be present. If not, the geometry should
        * fail, or not be added to the scene
        */
        this.name = hash();
        this.vertexs = [];
        this.indexes = [];

        /*
        * Optional arguments. If not present, 
        * the shader will react and create a program
        * that adjusts itself to these.
        */
        this.normals = [];
        this.uvs = [];
        this.color = null;

        /*
        * Helper internal classes and arrays,
        * used to build the AST.
        */
        this.transform = new Transform();
        this.events = [];

    }

    getName () {
        return `geometry_${this.name}`;
    }

    hasTexture () {
        return typeof this.texture_source != 'undefined';
    }

    hasNormals () {
        return true;
    }

    hasUniformColor () {
        return !!this.color;
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
        const ext = args.src.match(/[^\.]+$/g)[0];
        const name = hash();
        const path = `assets/images/${name}.${ext}`;
        write(`./dist/${path}`, read(args.src));
        this.texture_source = path;
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
        this.events.push({
            ...event, hndl: event.hndl(this.getName())
        });
    }

    isDynamic () {
        return this.events.events.length;
    }

    toString () {
        const { world, model } = this.transform.get();

        return `

            const v_buff_${this.name} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_${this.name});
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                ${this.getTransformedVertexs()}
            ]).buffer, webgl.STATIC_DRAW);

            const n_buff_${this.name} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, n_buff_${this.name});
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                ${this.getNormals()}
            ]).buffer, webgl.STATIC_DRAW);

            const uvs_buff_${this.name} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, uvs_buff_${this.name});
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                ${this.uvs}
            ]).buffer, webgl.STATIC_DRAW);

            const f_buff_${this.name} = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_${this.name});
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                ${this.indexes}
            ]).buffer, webgl.STATIC_DRAW);
            
            const texture_${this.name} = webgl.createTexture();
            const image_${this.name} = new Image();
            image_${this.name}.onload = function () {
                webgl.bindTexture(webgl.TEXTURE_2D, texture_${this.name});
                webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image_${this.name});
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_NEAREST);
                webgl.generateMipmap(webgl.TEXTURE_2D);
            }
            image_${this.name}.src = '${this.texture_source}';

            const geometry_${this.name} = Object.assign({
                vertexs: v_buff_${this.name},
                indexes: f_buff_${this.name},
                world: ${JSON.stringify(world)},
                model: ${JSON.stringify(model)},
                count: ${this.indexes.length},

                ${this.hasNormals() ?
                `
                    normals: n_buff_${this.name},
                ` : ''}

                ${this.hasTexture() ?
                `
                    uvs: uvs_buff_${this.name},
                    texture: texture_${this.name},
                ` : ''}

                ${this.hasUniformColor() ?
                `
                    color: [${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a}],
                ` : ''}
                
            });

        `;
    }

}