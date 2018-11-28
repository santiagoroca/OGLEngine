
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

                uniform mat4 matrix;
                uniform mat4 cameraMatrix;
                uniform mat4 projection;
                ${this.config.hasTexture() ? 'uniform sampler2D uSampler;': ''}
                
                ${this.config.hasNormals() ? 'varying vec3 vNormal;': ''}
                ${this.config.hasTexture() ? 'varying vec2 vVertexUV;': ''}
                ${fragment_varying_vertex_position ? 'varying vec3 vVertexPosition;': ''}

                ${directional_l.map(
                    ({ name }) => `
                        varying vec4 vVertexPositionShadow_${name};
                        uniform mat4 lightmapMatrix_${name};
                        uniform mat4 lightmapProjection_${name};
                    `
                ).join('\n')}

                const mat4 biasMatrix = mat4 (
                    vec4(0.5, 0.0, 0.0, 0.0),
                    vec4(0.0, 0.5, 0.0, 0.0),
                    vec4(0.0, 0.0, 0.5, 0.0),
                    vec4(0.5, 0.5, 0.5, 1.0)
                );
                
                void main(void) {
                    vec4 worldModelSpaceVertex = cameraMatrix * matrix * vec4(aVertexPosition, 1.0);
                    gl_Position = projection * worldModelSpaceVertex;
                    ${fragment_varying_vertex_position ? 'vVertexPosition = worldModelSpaceVertex.xyz;': ''}
                    ${this.config.hasNormals() ? 'vNormal = aVertexNormal;': ''}
                    ${this.config.hasTexture() ? 'vVertexUV = aVertexUV;': ''}

                    ${directional_l.map(
                        ({ name }) => `vVertexPositionShadow_${name} = biasMatrix * lightmapProjection_${name} * lightmapMatrix_${name} * vec4(aVertexPosition, 1.0);`
                    ).join('\n')}
                }

            \`;

            const PhongFragment_${hash} = \`
                precision highp float;

                uniform mat4 matrix;
                uniform mat4 cameraMatrix;

                // Material Config
                ${this.config.hasUniformColor() ? 'uniform vec4 color;': ''}
                uniform float shinnines;
                uniform float reflectivity;

                ${this.config.shouldRenderCubeMap() ? 'uniform samplerCube cubemap;': ''}
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
                
                ${directional_l.map(
                    ({ name }) => `
                        varying vec4 vVertexPositionShadow_${name};
                        uniform sampler2D shadowMap_${name};
                    `
                ).join('\n')}

                const float bias = 0.005;

                void main() {
                    
                    vec3 light = vec3(0.0);
                    vec3 specular = vec3(0.0);

                    ${fragment_varying_vertex_position ? `
                        vec3 normal = normalize(mat3(cameraMatrix * matrix) * vNormal);
                        vec3 cameraPosition = (cameraMatrix)[3].xyz;
                        vec3 eye = normalize(-vVertexPosition);
                    ` : ''}
                    
                    ${directional_l.map(light => `
                        
                        vec3 camera_space_${light.name} = normalize(mat3(cameraMatrix) * dir_${light.name});
                        vec3 light_${light.name} = max(0.0, dot(normal, camera_space_${light.name})) * vec3(${light.color.toStringNoAlpha(255)});

                        float depth_${light.name} = texture2D(shadowMap_${light.name}, vec2(vVertexPositionShadow_${light.name}.x, vVertexPositionShadow_${light.name}.y)).r;
                        if (depth_${light.name} < vVertexPositionShadow_${light.name}.z - bias) {
                            light_${light.name} *= 0.85;
                            specular *= 0.0;
                        } else {
                            specular += ((255.0 - shinnines) / 255.0) * pow(max(0.0, dot(
                                eye, reflect(-camera_space_${light.name}, normal)
                            )), shinnines) * vec3(1.0);
                        }

                        light += light_${light.name};

                    `).join('\n')}

                    ${point_l.map(light => `

                        vec3 camera_space_${light.name} = vec3(cameraMatrix * vec4(point_${light.name}, 1.0));
                        vec3 surfaceToLight_${light.name} = normalize(camera_space_${light.name} - vVertexPosition);
                        light += max(0.0, dot(normal, surfaceToLight_${light.name})) * vec3(${light.color.toStringNoAlpha(255)});
                        
                        specular += pow(max(0.0, dot(
                            eye, reflect(-surfaceToLight_${light.name}, normal)
                        )), shinnines) * vec3(1.0);

                    `).join('\n')}

                    ${this.config.hasSpecularMap() ?
                        `specular *= texture2D(specularMapSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t));` : ''
                    }

                    gl_FragColor = (
                        ${
                            [
                                this.config.shouldRenderCubeMap() ? 
                                    `vec4(textureCube(cubemap, reflect(-eye, normal)).rgb, 0.0) * reflectivity`
                                : '',
                                this.config.hasUniformColor() ? `color` : '',
                                this.config.hasTexture() ? `texture2D(uSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t))` : ''
                            ].filter(stm => stm != '').join(' + ')
                        }
                    ) * (vec4(light, 1.0) + ambient_light) + vec4(specular, 1.0);

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

            ${directional_l.map((light, index) => `

                webgl.uniform1i(
                    webgl.getUniformLocation(PhongShaderProgram_${hash}, 'shadowMap_${light.name}'),
                    20 + ${index}
                );
                
                webgl.uniformMatrix4fv(
                    webgl.getUniformLocation(PhongShaderProgram_${hash}, 'lightmapMatrix_${light.name}'), 
                    false, mat4.lookAt([
                        ${light.direction.x * 10},
                        ${light.direction.y * 10},
                        ${light.direction.z * 10},
                    ], [0, 0, 0], [0, 1, 0], mat4.create())
                );

                webgl.uniformMatrix4fv(
                    webgl.getUniformLocation(PhongShaderProgram_${hash}, 'lightmapProjection_${light.name}'),
                    false, mat4.ortho(-15, 15, -15, 15, 1, 100, [])
                );

            `).join('\n')}

            PhongShaderProgram_${hash}.matrix = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'matrix');
            PhongShaderProgram_${hash}.cameraMatrix = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'cameraMatrix');
            PhongShaderProgram_${hash}.projection = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'projection');
            
            PhongShaderProgram_${hash}.shinnines = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'shinnines');
            PhongShaderProgram_${hash}.reflectivity = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'reflectivity');
            ${this.config.hasUniformColor() ?`
                PhongShaderProgram_${hash}.color = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'color');
            `: ''}

        `;
    }

    generateRenderBlock () {
        const hash = this.name;

        return `
            webgl.useProgram(PhongShaderProgram_${hash});
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.cameraMatrix, false, activeCamera.matrix);
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.projection, false, activeCamera.projectionMatrix);

            ${
                this.geometries.map(geometry => `

                    webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.matrix, false, ${geometry}.matrix);

                    webgl.bindBuffer(webgl.ARRAY_BUFFER, ${geometry}.vertexs);
                    webgl.vertexAttribPointer(PhongShaderProgram_${hash}.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
                    
                    webgl.uniform1f(PhongShaderProgram_${hash}.shinnines, ${geometry}.material.shinnines);
                    webgl.uniform1f(PhongShaderProgram_${hash}.reflectivity, ${geometry}.material.reflectivity);
                    ${this.config.hasUniformColor () ? `
                        webgl.uniform4fv(PhongShaderProgram_${hash}.color, ${geometry}.material.color);
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