module.exports = (directional_l, ambient_l, point_l) => {

    return `

        const PhongFragment = \`
            #extension GL_OES_standard_derivatives : enable
            precision highp float; 

            uniform mat4 uPMVMatrix;
            uniform vec4 geometryColor; 
            uniform sampler2D uSampler;

            const vec4 ambient_light = vec4(${ambient_l});

            ${
                directional_l.map(
                    ({ direction }, index) => `const vec3 dir_${index} = vec3(${direction});`
                ).join('\n')
            }

            varying vec3 vNormal;
            varying vec2 vVertexUV;

            void main() {
                float attenuation = 0.0;
                vec4 color = texture2D(uSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t));
                
                ${
                    directional_l.map(
                        ({}, index) => ` attenuation += max(0.0, dot(vNormal, dir_${index}));`
                    ).join('\n')
                }
                
                gl_FragColor = 
                    color * vec4(attenuation, attenuation, attenuation, 1.0) +
                    color * ambient_light;
            }
        \`;

        const PhongVertex = \`

            attribute lowp vec3 aVertexPosition; 
            attribute lowp vec3 aVertexNormal;
            attribute lowp vec2 aVertexUV;

            uniform mat4 localTransform;
            uniform mat4 uPMVMatrix; 
            uniform mat4 pMatrix;
            uniform sampler2D uSampler;

            varying vec3 vNormal;
            varying vec2 vVertexUV;
            
            void main(void) {
                gl_Position = pMatrix * uPMVMatrix * localTransform * vec4(aVertexPosition, 1.0); 
                vNormal = (localTransform * vec4(aVertexNormal, 1.0)).xyz;
                vVertexUV = aVertexUV;
            }

        \`;

        // Fragment 
        const PhongFragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
        webgl.shaderSource(PhongFragmentShader, PhongFragment);
        webgl.compileShader(PhongFragmentShader);

        if (!webgl.getShaderParameter(PhongFragmentShader, webgl.COMPILE_STATUS)) {
            alert(webgl.getShaderInfoLog(PhongFragmentShader));
        }

        // Vertex
        const PhongVertexShader = webgl.createShader(webgl.VERTEX_SHADER);
        webgl.shaderSource(PhongVertexShader, PhongVertex);
        webgl.compileShader(PhongVertexShader);

        if (!webgl.getShaderParameter(PhongVertexShader, webgl.COMPILE_STATUS)) {
            alert(webgl.getShaderInfoLog(PhongVertexShader));
        }

        // Program
        const PhongShaderProgram = webgl.createProgram();
        webgl.attachShader(PhongShaderProgram, PhongVertexShader);
        webgl.attachShader(PhongShaderProgram, PhongFragmentShader);
        webgl.linkProgram(PhongShaderProgram);
        webgl.useProgram(PhongShaderProgram);

        // Attributes and uniforms
        PhongShaderProgram.vertexPositionAttribute = webgl.getAttribLocation(PhongShaderProgram, "aVertexPosition");
        PhongShaderProgram.vertexNormalAttribute = webgl.getAttribLocation(PhongShaderProgram, "aVertexNormal");
        PhongShaderProgram.vertexUVAttribute = webgl.getAttribLocation(PhongShaderProgram, "aVertexUV");

        PhongShaderProgram.uPMVMatrix = webgl.getUniformLocation(PhongShaderProgram, "uPMVMatrix");
        PhongShaderProgram.pMatrix = webgl.getUniformLocation(PhongShaderProgram, 'pMatrix');
        PhongShaderProgram.localTransform = webgl.getUniformLocation(PhongShaderProgram, 'localTransform');
        PhongShaderProgram.geometryColor = webgl.getUniformLocation(PhongShaderProgram, 'geometryColor');

        webgl.enableVertexAttribArray(PhongShaderProgram.vertexPositionAttribute);
        webgl.enableVertexAttribArray(PhongShaderProgram.vertexNormalAttribute);
        webgl.enableVertexAttribArray(PhongShaderProgram.vertexUVAttribute);

    `;
}