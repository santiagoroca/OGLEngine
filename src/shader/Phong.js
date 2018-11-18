const generate_unique_hash = require('../helper.js').hash;

module.exports = class PhongShader {

    constructor (config) {
        this.config = config;
        this.geometries = [];
        this.name = generate_unique_hash();
    }

    hasUniformColor () {
        return (this.config & 1) == 1;
    }

    hasTexture () {
        return (this.config & 2) == 2;
    }

    hasNormals () {
        return (this.config & 4) == 4;
    }

    generateInitializationBlock (directional_l, ambient_l, point_l) {
        const hash = this.name;

        // Does the fragment shader needs a varying with the
        // position of the current vertex?
        const fragment_varying_vertex_position = directional_l.length || point_l.length;

        const fragment_color = `
        
            ${this.hasUniformColor() ? `
                gl_FragColor = 
                    geometryColor * vec4(light, light, light, 1.0) +
                    geometryColor * ambient_light;
            `: ''}

            ${this.hasTexture() ? `
                vec4 color = texture2D(uSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t));
                gl_FragColor = 
                    color * vec4(light, light, light, 1.0) +
                    color * ambient_light;
            `: ''}

        `;

        return `

            const PhongVertex_${hash} = \`

                attribute lowp vec3 aVertexPosition;

                ${this.hasNormals() ? 'attribute lowp vec3 aVertexNormal;': ''}
                ${this.hasTexture() ? 'attribute lowp vec2 aVertexUV;': ''}

                uniform mat4 model;
                uniform mat4 world;

                uniform mat4 cameraModel;
                uniform mat4 cameraWorld;

                uniform mat4 projection;
                ${this.hasTexture() ? 'uniform sampler2D uSampler;': ''}
                
                ${this.hasNormals() ? 'varying vec3 vNormal;': ''}
                ${this.hasTexture() ? 'varying vec2 vVertexUV;': ''}
                ${fragment_varying_vertex_position ? 'varying vec3 vVertexPosition;': ''}
                
                void main(void) {
                    vec4 worldModelSpaceVertex = world * model * vec4(aVertexPosition, 1.0);
                    gl_Position = projection * cameraWorld * cameraModel * worldModelSpaceVertex;
                    ${fragment_varying_vertex_position ? 'vVertexPosition = worldModelSpaceVertex.xyz;': ''}
                    ${this.hasNormals() ? 'vNormal = mat3(world) * mat3(model) * aVertexNormal;': ''}
                    ${this.hasTexture() ? 'vVertexUV = aVertexUV;': ''}
                }

            \`;

            const PhongFragment_${hash} = \`
                precision highp float;

                uniform mat4 model;
                uniform mat4 world;

                uniform mat4 cameraModel;
                uniform mat4 cameraWorld;

                ${this.hasUniformColor() ? 'uniform vec4 geometryColor;': ''}
                ${this.hasTexture() ? 'uniform sampler2D uSampler;': ''}

                const vec4 ambient_light = vec4(${ambient_l});

                ${directional_l.map(
                    ({ name, direction }) => `const vec3 dir_${name} = normalize(vec3(${direction}));`
                ).join('\n')}

                ${point_l.map(
                    ({ name, position }) => `const vec3 point_${name} = vec3(${position});`
                ).join('\n')}

                ${this.hasNormals() ? 'varying vec3 vNormal;': ''}
                ${this.hasTexture() ? 'varying vec2 vVertexUV;': ''}
                ${fragment_varying_vertex_position ? 'varying vec3 vVertexPosition;': ''}

                void main() {
                    float light = 0.0;

                    ${fragment_varying_vertex_position ? `
                        vec3 normal = normalize(vNormal);
                        vec3 eye = -normalize(vVertexPosition);
                    ` : ''}
                    
                    ${directional_l.map(({ name, shininess }) => `

                        float diffuse_${name} = max(0.0, dot(normal, dir_${name}));
                        
                        float specular_${name} = 0.0;
                        if(diffuse_${name} > 0.0)
                            specular_${name} = pow(max(0.0, dot(eye, reflect(dir_${name}, normal))), ${shininess}.0);

                        light += (diffuse_${name} + specular_${name});

                    `).join('\n')}

                    ${point_l.map(({ name, shininess }, index) => `

                        vec3 surfaceToLight_${name} = normalize(point_${name} - vVertexPosition);
                        float diffuse_${name} = max(0.0, dot(normal, surfaceToLight_${name}));
                        
                        float specular_${name} = 0.0;
                        if(diffuse_${name} > 0.0)
                            specular_${name} = pow(max(0.0, dot(eye, reflect(-surfaceToLight_${name}, normal))), ${shininess}.0);

                        light += (diffuse_${name});

                    `).join('\n')}
             
                    ${fragment_color}
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

            ${this.hasNormals() ? `
                PhongShaderProgram_${hash}.vertexNormalAttribute = webgl.getAttribLocation(PhongShaderProgram_${hash}, "aVertexNormal");
                webgl.enableVertexAttribArray(PhongShaderProgram_${hash}.vertexNormalAttribute);
            `: ''};
            
            ${this.hasTexture() ? `
                PhongShaderProgram_${hash}.vertexUVAttribute = webgl.getAttribLocation(PhongShaderProgram_${hash}, "aVertexUV");
                webgl.enableVertexAttribArray(PhongShaderProgram_${hash}.vertexUVAttribute);
            `: ''};

            PhongShaderProgram_${hash}.world = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'world');
            PhongShaderProgram_${hash}.model = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'model');
            PhongShaderProgram_${hash}.cameraWorld = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'cameraWorld');
            PhongShaderProgram_${hash}.cameraModel = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'cameraModel');
            PhongShaderProgram_${hash}.projection = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'projection');
            
            ${this.hasUniformColor() ?`
                PhongShaderProgram_${hash}.geometryColor = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'geometryColor');
            `: ''}
            
        `;
    }

    generateRenderBlock () {
        const hash = this.name;

        return `
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.cameraWorld, false, activeCamera.transform.world.matrix);
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.cameraModel, false, activeCamera.transform.model.matrix);
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.projection, false, activeCamera.projectionMatrix);

            ${
                this.geometries.map(geometry => `

                    webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.world, false, ${geometry}.transform.world.matrix);
                    webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.model, false, ${geometry}.transform.model.matrix);

                    webgl.bindBuffer(webgl.ARRAY_BUFFER, ${geometry}.vertexs);
                    webgl.vertexAttribPointer(PhongShaderProgram_${hash}.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
                    
                    ${this.hasUniformColor () ? `
                        webgl.uniform4fv(PhongShaderProgram_${hash}.geometryColor, ${geometry}.color);
                    `: ''}
                    
                    ${this.hasNormals () ? `
                        webgl.bindBuffer(webgl.ARRAY_BUFFER, ${geometry}.normals);
                        webgl.vertexAttribPointer(PhongShaderProgram_${hash}.vertexNormalAttribute, 3, webgl.FLOAT, false, 0, 0);
                    `: ''}

                    ${this.hasTexture () ? `
                        webgl.bindBuffer(webgl.ARRAY_BUFFER, ${geometry}.uvs);
                        webgl.vertexAttribPointer(PhongShaderProgram_${hash}.vertexUVAttribute, 2, webgl.FLOAT, false, 0, 0);
                        webgl.bindTexture(webgl.TEXTURE_2D, ${geometry}.texture);
                    `: ''}

                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ${geometry}.indexes);
                    webgl.drawElements(webgl.TRIANGLES, ${geometry}.count, webgl.UNSIGNED_SHORT, 0);

                `).join('\n')

            }
        `;
    }

}