const createWriteStream = require('fs').createWriteStream;
const Entity = require('./Entity');
const Transform = require('./Transform');
const Material = require('./Material');
const load = require('../parser/Loader.js');
const read = require('fs').readFileSync;
const write = require('fs').writeFileSync;
const hash = require('../helper').hash;

// Helper Procceses
const GenerateNormals = require('../process/generate_normals')
const RemoveDuplicatedVertexs = require('../process/remove_duplicated_vertexs');


module.exports = class Geometry extends Entity {

    defaults () {

        /*
        * Fixed arguments that should always 
        * be present. If not, the geometry should
        * fail, or not be added to the scene
        */
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
       * Remove Duplicated Vertexs
       *
       * If set to true, the duplicated vertex
       * of the geometry will be removed before the normals
       * regeneration, so that you obtain a more smooth render
       * 
       */
       this.remove_duplicated_vertexs = true;

       /*
       * Generate Normals
       * 
       * If set to true, the normals
       * will be generated, regardless of the 
       * previous data on the normals array.
       *
       */
       this.generate_normals = true;
       
       /*
       * Inline Data
       *
       * If set to true, the buffer data of the mesh
       * will be written in the destiny file, instead of
       * external files.
       *
       */
       this.inline_data = false;

       /*
       * Helper internal classes and arrays,
       * used to build the AST.
       */
       this.transform = new Transform();
       this.material = new Material();
       this.events = [];

    }

    getName () {
        return `geometry_${this.name}`;
    }

    hasTexture () {
        return typeof this.texture != 'undefined' &&
                this.uvs.length > 0;
    }

    hasNormals () {
        return true;
    }

    hasUniformColor () {
        return !!this.color;
    }

    // Configure Texture as externla object 
    // and append to geometry
    setTexture ([ texture ]) {
        const ext = texture.match(/[^\.]+$/g)[0];
        const name = hash();
        const path = `textures/${name}.${ext}`;
        write(`./dist/${path}`, read(texture));
        this.texture = path;
    }
    
    getTransformedVertexs () {
        this.transform.transformVertices(this.vertexs);
        return this.vertexs;
    }

    getNormals () {
        if (!(this.normals.length) || this.generate_normals) {
            this.generateNormals();
        }

        return this.normals;
    }

    /*
    * @title Generate Normals
    *
    * @description If, when the geometry is about to be exported, 
    * does not contains normals, or the flag gen_normals
    * is set to true, this function will generate the normals.
    * 
    */
    generateNormals () {
        this.normals = GenerateNormals (
            this.vertexs, 
            this.indexes
        );
    }

    /*
    * @title Remove Duplicated Vertex
    *
    * @description If, when the geometry is about to be exported, 
    * the flag smooth_mesh is set to true, duplicated vertexs
    * will be merged
    * 
    * In the future, this option will identify when a vertex should be 
    * merged and when should not.
    * 
    */
    removeDuplicatedVertexs () {
        // This function returns an object that contains 3 keys
        // vertex, indexes and normals, with the new data in it.
        Object.assign(this, RemoveDuplicatedVertexs (
            this.vertexs, 
            this.indexes, 
            this.normals
        ));
    }

    isDynamic () {
        return this.events.events.length;
    }

    getEvents () {
        const object_id = this.getName();

        return [
            ...this.events.map(event => ({
                ...event, hndl: event.hndl(object_id)
            })),
            ...this.transform.getEvents(`${object_id}.transform`)
        ];
    }

    saveToFile () {

        createWriteStream(`./dist/models/${this.getName()}.faces`)
            .write(new Buffer(new Uint16Array(this.indexes).buffer));

        createWriteStream(`./dist/models/${this.getName()}.vertexs`)
            .write(new Buffer(new Float32Array(this.getTransformedVertexs()).buffer));

        createWriteStream(`./dist/models/${this.getName()}.normals`)
            .write(new Buffer(new Float32Array(this.getNormals()).buffer));

        if (this.hasTexture()) {
            createWriteStream(`./dist/models/${this.getName()}.uvs`)
                .write(new Buffer(new Float32Array(this.uvs).buffer));
        }

    }

    toString () {
        if (this.source) {
            Object.assign(this, load(this.source));
        }

        // TODO External process needs improvement
        if (this.remove_duplicated_vertexs) {
            this.removeDuplicatedVertexs();
        }

        // Save Mesh data to external files
        // TODO Needs improvement to merge all the files into one
        // Probably all the geometries into one
        if (!this.inline_data) {
            this.saveToFile();
        }

        return `

            const v_buff_${this.name} = webgl.createBuffer();
            const n_buff_${this.name} = webgl.createBuffer();
            const f_buff_${this.name} = webgl.createBuffer();

            ${this.hasTexture() ? `
                const uvs_buff_${this.name} = webgl.createBuffer();
            ` : ''}

            fetch('models/${this.getName()}.faces')
            .then(response => {
                response.arrayBuffer()
                .then(buffer => {
                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_${this.name});
                    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                })
            });

            fetch('models/${this.getName()}.vertexs')
            .then(response => {
                response.arrayBuffer()
                .then(buffer => {
                    webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_${this.name});
                    webgl.bufferData(webgl.ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                })
            });

            fetch('models/${this.getName()}.normals')
            .then(response => {
                response.arrayBuffer()
                .then(buffer => {
                    webgl.bindBuffer(webgl.ARRAY_BUFFER, n_buff_${this.name});
                    webgl.bufferData(webgl.ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                })
            });

            ${this.hasTexture() ? `
                fetch('models/${this.getName()}.uvs')
                .then(response => {
                    response.arrayBuffer()
                    .then(buffer => {
                        webgl.bindBuffer(webgl.ARRAY_BUFFER, uvs_buff_${this.name});
                        webgl.bufferData(webgl.ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                    })
                });
            ` : ''}
                
            ${this.hasTexture() ? `
                const texture_${this.name} = webgl.createTexture();
                const image_${this.name} = new Image();
                image_${this.name}.onload = function () {
                    webgl.bindTexture(webgl.TEXTURE_2D, texture_${this.name});
                    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image_${this.name});
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_NEAREST);
                    webgl.generateMipmap(webgl.TEXTURE_2D);
                }
                image_${this.name}.src = '${this.texture}';
            ` : ''}

            const geometry_${this.name} = Object.assign({
                vertexs: v_buff_${this.name},
                indexes: f_buff_${this.name},
                normals: n_buff_${this.name},
                transform: ${this.transform},
                count: ${this.indexes.length},

                ${this.hasTexture() ?
                `
                    uvs: uvs_buff_${this.name},
                    texture: texture_${this.name},
                ` : ''}

                ${this.hasUniformColor() ? `
                    color: [
                        ${this.color.r/255}, 
                        ${this.color.g/255}, 
                        ${this.color.b/255}, 
                        ${this.color.a/255}
                    ],
                ` : ''}
                
            });

        `;
    }

}