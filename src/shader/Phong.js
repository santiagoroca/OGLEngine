module.exports = (directional_l, ambient_l, point_l) => {
    return `

        const PhongFragment = \`
            #extension GL_OES_standard_derivatives : enable
            precision highp float; 

            uniform mat4 uPMVMatrix;
            uniform vec4 geometryColor; 
            varying vec3 vPosition;
            
            vec3 normals(vec3 pos) { 
                vec3 fdx = dFdx(pos); 
                vec3 fdy = dFdy(pos);
                return normalize(cross(fdx, fdy)); 
            }  

            void main() {
                vec4 light = uPMVMatrix * vec4(1.0, 0.5, -0.5, 1.0);
                vec3 normal = normalize(normals(vPosition) * light.xyz); 
                float attenuation = max(0.0, dot(normal, normal));
                gl_FragColor = max(
                    geometryColor * vec4(attenuation, attenuation, attenuation, 1.0),
                    geometryColor * vec4(0.4)
                );
            }
        \`;

        const PhongVertex = \`
            attribute lowp vec3 aVertexPosition; 
            uniform mat4 localTransform; 
            uniform mat4 uPMVMatrix; 
            uniform mat4 pMatrix; 
            varying vec3 vPosition; 
            
            void main(void) {
                gl_Position = pMatrix * uPMVMatrix * localTransform * vec4(aVertexPosition, 1.0); 
                vPosition = vec4(pMatrix * uPMVMatrix * vec4(aVertexPosition, 1.0)).xyz; 
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
        PhongShaderProgram.uPMVMatrix = webgl.getUniformLocation(PhongShaderProgram, "uPMVMatrix");
        PhongShaderProgram.pMatrix = webgl.getUniformLocation(PhongShaderProgram, 'pMatrix');
        PhongShaderProgram.localTransform = webgl.getUniformLocation(PhongShaderProgram, 'localTransform');
        PhongShaderProgram.geometryColor = webgl.getUniformLocation(PhongShaderProgram, 'geometryColor');
        webgl.enableVertexAttribArray(PhongShaderProgram.vertexPositionAttribute);

        

    `;
}