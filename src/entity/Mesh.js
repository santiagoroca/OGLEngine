const Entity = require('./Entity');

class Mesh extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'meshes',
            singular: 'mesh',
            defaults: {
                vertices: NativeTypes.self([]),
                faces: NativeTypes.self([]),
                normals: NativeTypes.self([]),
                uvs: NativeTypes.self([]),
                source: NativeTypes.string(),
                texture: NativeTypes.string(),
            }
        });
    }

    defaults () {
        this.vertices = [];
        this.faces = [];
        this.normals = [];
        this.uvs = [];
        this.source = null;
        this.texture = null;
    }

    toString () {
        if (this.source) {
            Object.assign(this, load(this.source));
        }

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

            ${
                this.texture ? `
                    const texture_${this.name} = webgl.createTexture();
                    const image_${this.name} = new Image();
                    image_${this.name}.src = '${this.texture_source}';
        
                    image_${this.name}.onload = function () {
                        webgl.bindTexture(webgl.TEXTURE_2D, texture_${this.name});
                        webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image_${this.name});
                        webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                        webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_NEAREST);
                        webgl.generateMipmap(webgl.TEXTURE_2D);
                    }
                ` : ''
            }

        `;
    }

}

module.exports = Mesh;