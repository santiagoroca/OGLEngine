module.exports = (directional_l, ambient_l, point_l) => {

    return `

        const PhongFragment = \`
            #extension GL_OES_standard_derivatives : enable
            precision highp float; 

            uniform mat4 uPMVMatrix;
            uniform vec4 geometryColor; 

            const vec4 ambient_light = vec4(${ambient_l});

            ${
                directional_l.map(
                    ({ direction }, index) => `const vec3 dir_${index} = vec3(${direction});`
                ).join('\n')
            }

            varying vec3 vNormal;

            void main() {
                float attenuation = 0.0;
                
                ${
                    directional_l.map(
                        ({}, index) => ` attenuation += max(0.0, dot(vNormal, dir_${index}));`
                    ).join('\n')
                }
                
                gl_FragColor = 
                    geometryColor * vec4(attenuation, attenuation, attenuation, 1.0) +
                    geometryColor * ambient_light;
            }
        \`;

        const PhongVertex = \`

            attribute lowp vec3 aVertexPosition; 
            attribute lowp vec3 aVertexNormal; 

            uniform mat4 localTransform; 
            uniform mat4 uPMVMatrix; 
            uniform mat4 pMatrix; 

            varying vec3 vNormal; 
            
            void main(void) {
                gl_Position = pMatrix * uPMVMatrix * localTransform * vec4(aVertexPosition, 1.0); 
                vNormal = (localTransform * vec4(aVertexNormal, 1.0)).xyz;
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

        PhongShaderProgram.uPMVMatrix = webgl.getUniformLocation(PhongShaderProgram, "uPMVMatrix");
        PhongShaderProgram.pMatrix = webgl.getUniformLocation(PhongShaderProgram, 'pMatrix');
        PhongShaderProgram.localTransform = webgl.getUniformLocation(PhongShaderProgram, 'localTransform');
        PhongShaderProgram.geometryColor = webgl.getUniformLocation(PhongShaderProgram, 'geometryColor');

        webgl.enableVertexAttribArray(PhongShaderProgram.vertexPositionAttribute);
        webgl.enableVertexAttribArray(PhongShaderProgram.vertexNormalAttribute);

        

    `;
}