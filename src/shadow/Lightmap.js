const { hash, capitalize } = require('../runtime/helper.js');

module.exports = class Lightmap {


    constructor (lights) {
        this.lights = lights.filter(light => light.type == 'directional');

        for (const light of this.lights) {
            light.direction.normalize();
        }

        this.geometries = [];
    }
    
    addGeometry (geometry) {
        this.geometries.push(geometry.getName());
    }

    toString () {        
        return `

            const PhongVertex_DirectionalLightmap = \`
                attribute lowp vec3 aVertexPosition;

                uniform mat4 projection;
                uniform mat4 cameraMatrix;
                uniform mat4 matrix;

                varying vec3 vVertexPosition;
                
                void main(void) {
                    gl_Position = projection * cameraMatrix * matrix * vec4(aVertexPosition, 1.0);
                }

            \`;

            const PhongFragment_DirectionalLightmap = \`
                precision highp float;
                uniform vec4 color;

                void main() {
                    gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 1.0);
                }
            \`;

            // Fragment 
            const PhongFragmentShader_DirectionalLightmap = webgl.createShader(webgl.FRAGMENT_SHADER);
            webgl.shaderSource(PhongFragmentShader_DirectionalLightmap, PhongFragment_DirectionalLightmap);
            webgl.compileShader(PhongFragmentShader_DirectionalLightmap);

            if (!webgl.getShaderParameter(PhongFragmentShader_DirectionalLightmap, webgl.COMPILE_STATUS)) {
                alert(webgl.getShaderInfoLog(PhongFragmentShader_DirectionalLightmap));
            }

            // Vertex
            const PhongVertexShader_DirectionalLightmap = webgl.createShader(webgl.VERTEX_SHADER);
            webgl.shaderSource(PhongVertexShader_DirectionalLightmap, PhongVertex_DirectionalLightmap);
            webgl.compileShader(PhongVertexShader_DirectionalLightmap);

            if (!webgl.getShaderParameter(PhongVertexShader_DirectionalLightmap, webgl.COMPILE_STATUS)) {
                alert(webgl.getShaderInfoLog(PhongVertexShader_DirectionalLightmap));
            }

            // Program
            const PhongShaderProgram_DirectionalLightmap = webgl.createProgram();
            webgl.attachShader(PhongShaderProgram_DirectionalLightmap, PhongVertexShader_DirectionalLightmap);
            webgl.attachShader(PhongShaderProgram_DirectionalLightmap, PhongFragmentShader_DirectionalLightmap);
            webgl.linkProgram(PhongShaderProgram_DirectionalLightmap);
            webgl.useProgram(PhongShaderProgram_DirectionalLightmap);

            // Attributes and uniforms
            PhongShaderProgram_DirectionalLightmap.vertexPositionAttribute = webgl.getAttribLocation(PhongShaderProgram_DirectionalLightmap, "aVertexPosition");
            webgl.enableVertexAttribArray(PhongShaderProgram_DirectionalLightmap.vertexPositionAttribute);

            PhongShaderProgram_DirectionalLightmap.cameraMatrix = webgl.getUniformLocation(PhongShaderProgram_DirectionalLightmap, 'cameraMatrix');
            PhongShaderProgram_DirectionalLightmap.matrix = webgl.getUniformLocation(PhongShaderProgram_DirectionalLightmap, 'matrix');
            PhongShaderProgram_DirectionalLightmap.projection = webgl.getUniformLocation(PhongShaderProgram_DirectionalLightmap, 'projection');
            PhongShaderProgram_DirectionalLightmap.color = webgl.getUniformLocation(PhongShaderProgram_DirectionalLightmap, 'color');

            setTimeout(() => {

                const level = 0;
                const internalFormat = webgl.RGBA;
                const border = 0;
                const format = webgl.RGBA;
                const type = webgl.UNSIGNED_BYTE;
                const data = null;
                const targetTextureWidth = 1024;
                const targetTextureHeight = 1024;

                let textureIndex = 0;
                let targetTexture = null;
                let depth_buffer = null;
                let framebuffer = null;

                ${
                    this.lights.map(
                        (light, index) => `
                            
                            webgl.useProgram(PhongShaderProgram_DirectionalLightmap);
                            webgl.uniformMatrix4fv(PhongShaderProgram_DirectionalLightmap.cameraMatrix, false, mat4.lookAt([
                                ${light.direction.x * 10},
                                ${light.direction.y * 10},
                                ${light.direction.z * 10},
                            ], [0, 0, 0], [0, 1, 0], mat4.create()));
                            webgl.uniformMatrix4fv(PhongShaderProgram_DirectionalLightmap.projection, false, mat4.ortho(-15, 15, -15, 15, 1, 100, []));

                            textureIndex = webgl.TEXTURE0 + 20 + ${index};
                            targetTexture = webgl.createTexture();

                            webgl.activeTexture(textureIndex);
                            webgl.bindTexture(webgl.TEXTURE_2D, targetTexture);

                            webgl.texImage2D(webgl.TEXTURE_2D,
                                level, internalFormat,
                                targetTextureWidth, targetTextureHeight,
                                border, format, 
                                type, data
                            );

                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);

                            depth_buffer = webgl.createTexture();
                            webgl.bindTexture(webgl.TEXTURE_2D, depth_buffer);
                            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.DEPTH_COMPONENT, 
                                targetTextureWidth, targetTextureHeight, 0,
                                webgl.DEPTH_COMPONENT, webgl.UNSIGNED_INT, null
                            );
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);

                            // Create and bind the framebuffer
                            framebuffer = webgl.createFramebuffer();
                            webgl.bindFramebuffer(webgl.FRAMEBUFFER, framebuffer);
                            
                            // attach the texture as the first color attachment
                            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, targetTexture, level);
                            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.DEPTH_ATTACHMENT,  webgl.TEXTURE_2D, depth_buffer, 0);
                            webgl.viewport(0, 0, targetTextureWidth, targetTextureHeight);

                            ${
                                this.geometries.map(geometry => `
                
            
                                webgl.uniformMatrix4fv(PhongShaderProgram_DirectionalLightmap.matrix, false, ${geometry}.matrix);
                
                                webgl.uniform4fv(PhongShaderProgram_DirectionalLightmap.color, ${geometry}.material.color);
            
                                webgl.bindBuffer(webgl.ARRAY_BUFFER, ${geometry}.vertexs);
                                webgl.vertexAttribPointer(PhongShaderProgram_DirectionalLightmap.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
                
                                webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ${geometry}.indexes);
                                webgl.drawElements(webgl.TRIANGLES, ${geometry}.count, webgl.UNSIGNED_INT, 0);
                
                                `).join('\n')
                            }

                        `
                    ).join('\n')
                }

                webgl.viewport(0, 0, container.clientWidth, container.clientHeight);
                webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);

            }, 2000)
            
        `
    }

}