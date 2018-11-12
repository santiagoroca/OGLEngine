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

    generateInitializationBlock (directional_l, ambient_l) {
        const hash = this.name;

        const fragment_color = `
        
            ${this.hasUniformColor() ? `
                gl_FragColor = 
                geometryColor * vec4(attenuation, attenuation, attenuation, 1.0) +
                geometryColor * ambient_light;
            `: ''}

            ${this.hasTexture() ? `
                vec4 color = texture2D(uSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t));
                gl_FragColor = 
                color * vec4(attenuation, attenuation, attenuation, 1.0) +
                color * ambient_light;
            `: ''}

        `;

        return `

            const PhongVertex_${hash} = \`

                attribute lowp vec3 aVertexPosition;

                ${this.hasNormals() ? 'attribute lowp vec3 aVertexNormal;': ''}
                ${this.hasTexture() ? 'attribute lowp vec2 aVertexUV;': ''}

                uniform mat4 localTransform;
                uniform mat4 uPMVMatrix; 
                uniform mat4 pMatrix;
                ${this.hasTexture() ? 'uniform sampler2D uSampler;': ''}
                
                ${this.hasNormals() ? 'varying vec3 vNormal;': ''}
                ${this.hasTexture() ? 'varying vec2 vVertexUV;': ''}
                
                void main(void) {
                    gl_Position = pMatrix * uPMVMatrix * localTransform * vec4(aVertexPosition, 1.0);
                    ${this.hasNormals() ? 'vNormal = (localTransform * vec4(aVertexNormal, 1.0)).xyz;': ''}
                    ${this.hasTexture() ? 'vVertexUV = aVertexUV;': ''}
                }

            \`;

            const PhongFragment_${hash} = \`
                precision highp float;

                uniform mat4 uPMVMatrix;

                ${this.hasUniformColor() ? 'uniform vec4 geometryColor;': ''}
                ${this.hasTexture() ? 'uniform sampler2D uSampler;': ''}

                const vec4 ambient_light = vec4(${ambient_l});

                ${
                    directional_l.map(
                        ({ direction }, index) => `const vec3 dir_${index} = vec3(${direction});`
                    ).join('\n')
                }

                ${this.hasNormals() ? 'varying vec3 vNormal;': ''}
                ${this.hasTexture() ? 'varying vec2 vVertexUV;': ''}

                void main() {
                    float attenuation = 0.0;
                    
                    ${
                        directional_l.map(
                            ({}, index) => ` attenuation += max(0.0, dot(vNormal, dir_${index}));`
                        ).join('\n')
                    }
                    
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

            PhongShaderProgram_${hash}.uPMVMatrix = webgl.getUniformLocation(PhongShaderProgram_${hash}, "uPMVMatrix");
            PhongShaderProgram_${hash}.pMatrix = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'pMatrix');
            PhongShaderProgram_${hash}.localTransform = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'localTransform');
            
            ${this.hasUniformColor() ?`
                PhongShaderProgram_${hash}.geometryColor = webgl.getUniformLocation(PhongShaderProgram_${hash}, 'geometryColor');
            `: ''}
            
        `;
    }

    generateRenderBlock () {
        const hash = this.name;

        return `
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.uPMVMatrix, false, activeCamera.transform.matrix);
            webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.pMatrix, false, activeCamera.projectionMatrix);

            ${
                this.geometries.map(geometry => `

                    webgl.uniformMatrix4fv(PhongShaderProgram_${hash}.localTransform, false, ${geometry}.transform.matrix);
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