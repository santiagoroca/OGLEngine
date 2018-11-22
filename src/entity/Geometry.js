const createWriteStream = require('fs').createWriteStream;
const Entity = require('./Entity');
const Transform = require('./Transform');
const Material = require('./Material');
const load = require('../parser/Loader.js');
const read = require('fs').readFileSync;
const write = require('fs').writeFileSync;
const hash = require('../runtime/helper').hash;

// Helper Procceses
const GenerateNormals = require('../process/generate_normals')
const RemoveDuplicatedVertexs = require('../process/remove_duplicated_vertexs');

class Geometry extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'geometries',
            singular: 'geometry',
            defaults: context => ({

                /*
                * Fixed arguments that should always 
                * be present. If not, the geometry should
                * fail, or not be added to the scene
                */
               vertexs: NativeTypes.infer([]),
               indexes: NativeTypes.infer([]),
        
               /*
               * Optional arguments. If not present, 
               * the shader will react and create a program
               * that adjusts itself to these.
               */
               normals: NativeTypes.infer([]),
               uvs: NativeTypes.infer([]),
               color: NativeTypes.color(),
               texture: NativeTypes.string(undefined),
               specularmap: NativeTypes.string(undefined),
               
               /*
               * Remove Duplicated Vertexs
               *
               * If set to true, the duplicated vertex
               * of the geometry will be removed before the normals
               * regeneration, so that you obtain a more smooth render
               * 
               */
               remove_duplicated_vertexs: NativeTypes.boolean(),
        
               /*
               * Generate Normals
               * 
               * If set to true, the normals
               * will be generated, regardless of the 
               * previous data on the normals array.
               *
               */
               generate_normals: NativeTypes.boolean(),
               
               /*
               * Inline Data
               *
               * If set to true, the buffer data of the mesh
               * will be written in the destiny file, instead of
               * external files.
               *
               */
               inline_data: NativeTypes.boolean(false),
        
               /*
               * Helper internal classes and arrays,
               * used to build the AST.
               */
               transform: NativeTypes.infer(new Transform(context)),
               material: NativeTypes.infer(new Material(context)),
               events: NativeTypes.infer([]),
        
            })
        });
    }

    includeUVs () {
        return this.uvs.length > 0 &&
            (
                this.hasTexture() ||
                this.hasSpecularMap()
            );
    }

    hasTexture () {
        return typeof this.texture != 'undefined' &&
                this.uvs.length > 0;
    }

    hasSpecularMap () {
        return typeof this.specularmap != 'undefined' &&
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
    setTexture (texture) {
        const ext = texture.match(/[^\.]+$/g)[0];
        const name = hash();
        const path = `textures/${name}.${ext}`;
        write(`./dist/${path}`, read(texture));
        this.texture = path;
    }

    // Configure Texture as externla object 
    // and append to geometry
    setSpecularmap (texture) {
        const ext = texture.match(/[^\.]+$/g)[0];
        const name = hash();
        const path = `textures/${name}.${ext}`;
        write(`./dist/${path}`, read(texture));
        this.specularmap = path;
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
            .write(Buffer.from(new Uint32Array(this.indexes).buffer));

        createWriteStream(`./dist/models/${this.getName()}.vertexs`)
            .write(Buffer.from(new Float32Array(this.getTransformedVertexs()).buffer));

        createWriteStream(`./dist/models/${this.getName()}.normals`)
            .write(Buffer.from(new Float32Array(this.getNormals()).buffer));

        if (this.hasTexture()) {
            createWriteStream(`./dist/models/${this.getName()}.uvs`)
                .write(Buffer.from(new Float32Array(this.uvs).buffer));
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

            ${this.hasSpecularMap() ? `
                const specular_map_${this.name} = webgl.createTexture();
                const specular_image_${this.name} = new Image();
                specular_image_${this.name}.onload = function () {
                    webgl.bindTexture(webgl.TEXTURE_2D, specular_map_${this.name});
                    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, specular_image_${this.name});
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_NEAREST);
                    webgl.generateMipmap(webgl.TEXTURE_2D);
                }
                specular_image_${this.name}.src = '${this.specularmap}';
            ` : ''}

            const geometry_${this.name} = Object.assign({
                vertexs: v_buff_${this.name},
                indexes: f_buff_${this.name},
                normals: n_buff_${this.name},
                transform: ${this.transform},
                count: ${this.indexes.length},

                ${this.includeUVs() ? `
                    uvs: uvs_buff_${this.name},
                ` : ''}

                ${this.hasTexture() ? `
                    texture: texture_${this.name},
                ` : ''}

                ${this.hasSpecularMap() ? `
                    specularmap: specular_map_${this.name},
                ` : ''}

                ${this.hasUniformColor() ? `
                    color: [${this.color.asArray(255)}],
                ` : ''}
                
            });

        `;
    }

}

module.exports = Geometry;