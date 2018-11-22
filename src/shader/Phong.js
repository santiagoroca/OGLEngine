const generate_unique_hash = require('../runtime/helper.js').hash;

module.exports = class PhongShader {

    constructor (config) {
        this.config = config;
        this.geometries = [];
        this.name = generate_unique_hash();
    }

    generateInitializationBlock (directional_l, ambient_l, point_l) {
        const hash = this.name;

        // Does the fragment shader needs a varying with the
        // position of the current vertex?
        const fragment_varying_vertex_position = 
            directional_l.length || 
            point_l.length || 
            this.config.shouldRenderCubeMap();

        return `

            const PhongVertex_${hash} = \`

                attribute lowp vec3 aVertexPosition;

                ${this.config.hasNormals() ? 'attribute lowp vec3 aVertexNormal;': ''}
                ${this.config.hasTexture() ? 'attribute lowp vec2 aVertexUV;': ''}

                uniform mat4 model;
                uniform mat4 world;

                uniform mat4 cameraModel;
                uniform mat4 cameraWorld;

                uniform mat4 projection;
                ${this.config.hasTexture() ? 'uniform sampler2D uSampler;': ''}
                
                ${this.config.hasNormals() ? 'varying vec3 vNormal;': ''}
                ${this.config.hasTexture() ? 'varying vec2 vVertexUV;': ''}
                ${fragment_varying_vertex_position ? 'varying vec3 vVertexPosition;': ''}
                
                void main(void) {
                    vec4 worldModelSpaceVertex = cameraWorld * cameraModel * world * model * vec4(aVertexPosition, 1.0);
                    gl_Position = projection * worldModelSpaceVertex;
                    ${fragment_varying_vertex_position ? 'vVertexPosition = worldModelSpaceVertex.xyz;': ''}
                    ${this.config.hasNormals() ? 'vNormal = mat3(cameraWorld) * mat3(cameraModel) * mat3(world) * mat3(model) * aVertexNormal;': ''}
                    ${this.config.hasTexture() ? 'vVertexUV = aVertexUV;': ''}
                }

            \`;

            const PhongFragment_${hash} = \`
                precision highp float;

                uniform mat4 model;
                uniform mat4 world;

                uniform mat4 cameraModel;
                uniform mat4 cameraWorld;

                ${this.config.shouldRenderCubeMap() ? 'uniform samplerCube cubemap;': ''}
                ${this.config.hasUniformColor() ? 'uniform vec4 geometryColor;': ''}
                ${this.config.hasTexture() ? 'uniform sampler2D uSampler;': ''}
                ${this.config.hasSpecularMap() ? 'uniform sampler2D specularMapSampler;': ''}

                const vec4 ambient_light = vec4(${ambient_l});

                ${directional_l.map(
                    ({ name, direction }) => `const vec3 dir_${name} = normalize(vec3(${direction.toString()}));`
                ).join('\n')}

                ${point_l.map(
                    ({ name, position }) => `const vec3 point_${name} = vec3(${position.toString()});`
                ).join('\n')}

                ${this.config.hasNormals() ? 'varying vec3 vNormal;': ''}
                ${this.config.hasTexture() ? 'varying vec2 vVertexUV;': ''}
                ${fragment_varying_vertex_position ? 'varying vec3 vVertexPosition;': ''}

                void main() {
                    float light = 0.0;
                    vec4 specular = vec4(0.0);

                    ${fragment_varying_vertex_position ? `
                        vec3 normal = normalize(vNormal);
                        vec3 cameraPosition = (cameraWorld * cameraModel)[3].xyz;
                        vec3 eye = normalize(-vVertexPosition);
                    ` : ''}
                    
                    ${directional_l.map(({ name, shininess }) => `

                        vec3 camera_space_${name} = vec3(mat3(cameraWorld) * mat3(cameraModel) * vec3(dir_${name}));
                        float diffuse_${name} = max(0.0, dot(normal, camera_space_${name}));
                        
                        specular += pow(max(0.0, dot(
                            eye, reflect(-camera_space_${name}, normal)
                        )), ${this.config.getShininess().toFixed(1)}) * vec4(0.1);

                        light += diffuse_${name};

                    `).join('\n')}

                    ${point_l.map(({ name, shininess }, index) => `

                        vec3 camera_space_${name} = vec3(cameraWorld * cameraModel * vec4(point_${name}, 1.0));
                        vec3 surfaceToLight_${name} = normalize(camera_space_${name} - vVertexPosition);
                        float diffuse_${name} = max(0.0, dot(normal, surfaceToLight_${name}));
                        
                        specular += pow(max(0.0, dot(
                            eye, reflect(-surfaceToLight_${name}, normal)
                        )), ${this.config.getShininess().toFixed(1)}) * vec4(0.1);

                        light += diffuse_${name};

                    `).join('\n')}

                    ${this.config.hasSpecularMap() ?
                        `specular *= texture2D(specularMapSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t));` : ''
                    }
             
                    gl_FragColor = (
                        ${
                            [
                                this.config.shouldRenderCubeMap() ? 'textureCube(cubemap, reflect(-eye, normal))' : '',
                                this.config.hasUniformColor() ? `geometryColor` : '',
                                this.config.hasTexture() ? `texture2D(uSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t))` : ''
                            ].filter(stm => stm != '').join('+')
                        }
                    ) * (vec4(light, light, light, 1.0) + ambient_light) + specular;

                }
            \`;

            // Fragment 
            const PhongFragmentShader_${hash} = webgl.createShader(webgl.FRAGMENT_SHADER);
            webgl.shaderSource(PhongFragmentShader_${hash}, PhongFragment_${hash});
            webgl.compileShader(PhongFragmentShader_${hash});

            if (!webgl.getShaderParameter(PhongFragmentShader_${hash}, webgl.COMPILE_STATUS)) {
                alert(webgl.getShaderInfoLog(PhongFragmentShader_${hash}));
            }

            // Vertex
            const PhongVertexShader_${hash} = webgl.createShader(webgl.VERTEX_SHADER);
            webgl.shaderSource(PhongVertexShader_${hash}, PhongVertex_${hash});
            webgl.compileShader(PhongVertexShader_${hash});

            if (!webgl.getShaderParameter(PhongVertexShader_${hash}, webgl.COMPILE_STATUS)) {
                alert(webgl.getShaderInfoLog(PhongVertexShader_${hash}));
            }

            // Program
            const PhongShaderProgram_${hash} = webgl.createProgram();
            webgl.attachShader(PhongShaderProgram_${hash}, PhongVertexShader_${hash});
            webgl.attachShader(PhongShaderProgram_${hash}, PhongFragmentShader_${hash});
            webgl.linkProgram(PhongShaderProgram_${hash});
            webgl.useProgram(PhongShaderProgram_${hash});

            // Attributes and uniforms
            PhongShaderProgram_${hash}.vertexPositionAttribute = webgl.getAttribLocation(PhongShaderProgram_${hash}, "aVertexPosition");
            webgl.enableVertexAttribArray(PhongShaderProgram_${hash}.vertexPositionAttribute);

            ${this.config.hasNormals() ? `
                PhongShaderProgram_${hash}.vertexNormalAttribute = webgl.getAttribLocation(PhongShaderProgram_${hash}, "aVertexNormal");
                webgl.enableVertexAttribArray(PhongShaderProgram_${hash}.vertexNormalAttribute);
            `: ''}
            
            ${this.config.hasTexture() ? `
                PhongShaderProgram_${hash}.vertexUVAttribute = webgl.getAttribLocation(PhongShaderProgram_${hash}, "aVertexUV");
                webgl.enableVertexAttribArray(PhongShaderProgram_${hash}.vertexUVAttribute);
            `: ''}

            ${this.config.hasSpecularMap() ? `
                PhongShaderProgram_${hash}.specularMapSampler = webgl.getUniformLocation(PhongShaderProgram_${hash}, "specularMapSampler");
                webgl.uniform1i(PhongShaderProgram_${hash}.specularMapSampler, 1);
            `: ''}

            ${this.config.shouldRenderCubeMap() ? `
                PhongShaderProgram_${hash}.cubemap = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'cubemap');
                webgl.uniform1i(PhongShaderProgram_${hash}.cubemap, 9);
            `: ''}

            PhongShaderProgram_${hash}.world = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'world');
            PhongShaderProgram_${hash}.model = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'model');
            PhongShaderProgram_${hash}.cameraWorld = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'cameraWorld');
            PhongShaderProgram_${hash}.cameraModel = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'cameraModel');
            PhongShaderProgram_${hash}.projection = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'projection');
            
            ${this.config.hasUniformColor() ?`
                PhongShaderProgram_${hash}.geometryColor = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'geometryColor');
            `: ''}
            
        `;
    }

    generateRenderBlock () {
        const hash = this.name;

        return `
            webgl.useProgram(PhongShaderProgram_${hash});
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.cameraWorld, false, activeCamera.transform.world.matrix);
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.cameraModel, false, activeCamera.transform.model.matrix);
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.projection, false, activeCamera.projectionMatrix);

            ${
                this.geometries.map(geometry => `

                    webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.world, false, ${geometry}.transform.world.matrix);
                    webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.model, false, ${geometry}.transform.model.matrix);

                    webgl.bindBuffer(webgl.ARRAY_BUFFER, ${geometry}.vertexs);
                    webgl.vertexAttribPointer(PhongShaderProgram_${hash}.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
                    
                    ${this.config.hasUniformColor () ? `
                        webgl.uniform4fv(PhongShaderProgram_${hash}.geometryColor, ${geometry}.color);
                    `: ''}
                    
                    ${this.config.hasNormals () ? `
                        webgl.bindBuffer(webgl.ARRAY_BUFFER, ${geometry}.normals);
                        webgl.vertexAttribPointer(PhongShaderProgram_${hash}.vertexNormalAttribute, 3, webgl.FLOAT, false, 0, 0);
                    `: ''}

                    ${this.config.hasTexture () ? `
                        webgl.bindBuffer(webgl.ARRAY_BUFFER, ${geometry}.uvs);
                        webgl.vertexAttribPointer(PhongShaderProgram_${hash}.vertexUVAttribute, 2, webgl.FLOAT, false, 0, 0);
                        webgl.activeTexture(webgl.TEXTURE0);
                        webgl.bindTexture(webgl.TEXTURE_2D, ${geometry}.texture);
                    `: ''}

                    ${this.config.hasSpecularMap () ? `
                        webgl.activeTexture(webgl.TEXTURE1);
                        webgl.bindTexture(webgl.TEXTURE_2D, ${geometry}.specularmap);
                    `: ''}

                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ${geometry}.indexes);
                    webgl.drawElements(webgl.TRIANGLES, ${geometry}.count, webgl.UNSIGNED_INT, 0);

                `).join('\n')

            }
        `;
    }

}