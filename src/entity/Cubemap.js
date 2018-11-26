const Entity = require('./Entity');
const { hash } = require('../runtime/helper.js');
const write = require('fs').writeFileSync;
const read = require('fs').readFileSync;

module.exports = class Events extends Entity {

    static getConfig () {
        return ({
            hierarchy_order: 2,
            isUniqueInstance: true, 
            plural: 'cubemaps',
            singular: 'cubemap',
            defaults: {
                skybox_visibility: NativeTypes.boolean(true),
                cubemap_reflection: NativeTypes.boolean(true),
                top: NativeTypes.string(undefined),
                bottom: NativeTypes.string(undefined),
                left: NativeTypes.string(undefined),
                right: NativeTypes.string(undefined),
                back: NativeTypes.string(undefined),
                front: NativeTypes.string(undefined),
            }
        })
    }

    shouldRenderCubeMap () {
        const faces = [this.top, this.bottom, this.left, this.right, this.back, this.front];
        return faces.filter(face => face == undefined).length == 0
    }

    writeFaceToFile (texture) {
        const ext = texture.match(/[^\.]+$/g)[0];
        const name = hash();
        const path = `textures/${name}.${ext}`;
        write(`./dist/${path}`, read(texture));
        return path;
    }

    toString () {
        let out = '';

        if (!this.shouldRenderCubeMap()) {
            console.log('Cube map ignored due to missing faces.');
            return '';
        }

        this.top = this.writeFaceToFile(this.top);
        this.bottom = this.writeFaceToFile(this.bottom);
        this.left = this.writeFaceToFile(this.left);
        this.right = this.writeFaceToFile(this.right);
        this.back = this.writeFaceToFile(this.back);
        this.front = this.writeFaceToFile(this.front);

        return `

            const cube_map_texture = webgl.createTexture();
            webgl.activeTexture(webgl.TEXTURE9);
            webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
            webgl.texParameteri(webgl.TEXTURE_CUBE_MAP, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
            webgl.texParameteri(webgl.TEXTURE_CUBE_MAP, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);

            const cube_map_image_top = new Image();
            cube_map_image_top.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_top);
            }
            cube_map_image_top.src = '${this.top}';

            const cube_map_image_bottom = new Image();
            cube_map_image_bottom.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_bottom);
            }
            cube_map_image_bottom.src = '${this.bottom}';

            const cube_map_image_left = new Image();
            cube_map_image_left.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_left);
            }
            cube_map_image_left.src = '${this.left}';

            const cube_map_image_right = new Image();
            cube_map_image_right.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_right);
            }
            cube_map_image_right.src = '${this.right}';

            const cube_map_image_front = new Image();
            cube_map_image_front.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_front);
            }
            cube_map_image_front.src = '${this.front}';

            const cube_map_image_back = new Image();
            cube_map_image_back.onload = function () {
                webgl.activeTexture(webgl.TEXTURE9);
                webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, cube_map_texture);
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, cube_map_image_back);
            }
            cube_map_image_back.src = '${this.back}';

            const PhongVertex_cubemap = \`
                attribute lowp vec3 aVertexPosition;
                uniform mat4 projection;
                uniform mat4 cameraMatrix;
                varying vec3 vVertexPosition;

                const mat4 transform = mat4(
                    vec4(1000.0, 0.0, 0.0, 0.0),
                    vec4(0.0, 1000.0, 0.0, 0.0),
                    vec4(0.0, 0.0, 1000.0, 0.0),
                    vec4(-500.0, -500.0, -500.0, 1.0)
                );
                
                void main(void) {
                    gl_Position = projection * cameraMatrix * transform * vec4(aVertexPosition, 1.0);
                    vVertexPosition = aVertexPosition;
                }

            \`;

            const PhongFragment_cubemap = \`
                precision highp float;
                uniform samplerCube cubemap;
                varying vec3 vVertexPosition;

                void main() {
                    gl_FragColor = textureCube(cubemap, vVertexPosition);
                }
            \`;

            // Fragment 
            const PhongFragmentShader_cubemap = webgl.createShader(webgl.FRAGMENT_SHADER);
            webgl.shaderSource(PhongFragmentShader_cubemap, PhongFragment_cubemap);
            webgl.compileShader(PhongFragmentShader_cubemap);

            if (!webgl.getShaderParameter(PhongFragmentShader_cubemap, webgl.COMPILE_STATUS)) {
                alert(webgl.getShaderInfoLog(PhongFragmentShader_cubemap));
            }

            // Vertex
            const PhongVertexShader_cubemap = webgl.createShader(webgl.VERTEX_SHADER);
            webgl.shaderSource(PhongVertexShader_cubemap, PhongVertex_cubemap);
            webgl.compileShader(PhongVertexShader_cubemap);

            if (!webgl.getShaderParameter(PhongVertexShader_cubemap, webgl.COMPILE_STATUS)) {
                alert(webgl.getShaderInfoLog(PhongVertexShader_cubemap));
            }

            // Program
            const PhongShaderProgram_cubemap = webgl.createProgram();
            webgl.attachShader(PhongShaderProgram_cubemap, PhongVertexShader_cubemap);
            webgl.attachShader(PhongShaderProgram_cubemap, PhongFragmentShader_cubemap);
            webgl.linkProgram(PhongShaderProgram_cubemap);
            webgl.useProgram(PhongShaderProgram_cubemap);

            // Attributes and uniforms
            PhongShaderProgram_cubemap.vertexPositionAttribute = webgl.getAttribLocation(PhongShaderProgram_cubemap, "aVertexPosition");
            webgl.enableVertexAttribArray(PhongShaderProgram_cubemap.vertexPositionAttribute);

            PhongShaderProgram_cubemap.cubemap = webgl.getUniformLocation(PhongShaderProgram_cubemap, 'cubemap');
            webgl.uniform1i(PhongShaderProgram_cubemap.cubemap, 9);

            PhongShaderProgram_cubemap.cameraWorld = webgl.getUniformLocation(PhongShaderProgram_cubemap, 'cameraWorld');
            PhongShaderProgram_cubemap.cameraModel = webgl.getUniformLocation(PhongShaderProgram_cubemap, 'cameraModel');
            PhongShaderProgram_cubemap.projection = webgl.getUniformLocation(PhongShaderProgram_cubemap, 'projection');

            const v_buff_cubemap = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_cubemap);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([

                // Frontface
                -1, -1, 1,
                1, -1, 1,
                -1, 1, 1,
                1, 1, 1,
                1, -1, 1,
                -1, 1, 1,

                // Backface
                -1, -1, -1,
                1, -1, -1,
                -1, 1, -1,
                1, 1, -1,
                1, -1, -1,
                -1, 1, -1,

                // Top
                -1, 1, 1,
                1, 1, 1,
                -1, 1, -1,
                1, 1, 1,
                1, 1, -1,
                -1, 1, -1,

                // Bottom
                -1, -1, 1,
                1, -1, 1,
                -1, -1, -1,
                1, -1, 1,
                1, -1, -1,
                -1, -1, -1,

                // Left
                -1, -1, 1,
                -1, -1, -1,
                -1, 1, -1,
                -1, -1, 1,
                -1, 1, 1,
                -1, 1, -1,

                // Right
                1, -1, 1,
                1, -1, -1,
                1, 1, -1,
                1, -1, 1,
                1, 1, 1,
                1, 1, -1,

            ]).buffer, webgl.STATIC_DRAW);

        `;
    }

    generateRenderBlock () {
        if (!this.shouldRenderCubeMap() || !this.skybox_visibility) {
            return '';
        }

        return `
            webgl.useProgram(PhongShaderProgram_cubemap);
            webgl.uniformMatrix4fv(PhongShaderProgram_cubemap.cameraMatrix, false, activeCamera.matrix);
            webgl.uniformMatrix4fv(PhongShaderProgram_cubemap.projection, false, activeCamera.projectionMatrix);

            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_cubemap);
            webgl.vertexAttribPointer(PhongShaderProgram_cubemap.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);

            webgl.drawArrays(webgl.TRIANGLES, 0, 36);
        `;
    }

}