pub struct Shader {
    pub lights : Vec<String>
}

impl Shader {

    pub fn new () -> Shader {
        Shader {
            lights: Vec::new()
        }
    }

    pub fn addLight (&mut self, light: [f32;3]) {
        self.lights.push(
            format!(
                "attenuation += max(0.0, dot(normal, normalize(vec3({}, {}, {}))));",
                light[0],
                light[1],
                light[2]
            )
        );
    }

    fn getFragment (&mut self) -> String {

        format!("

            #extension GL_OES_standard_derivatives : enable\\n
            precision lowp float;

            varying vec3 vPosition;

            vec3 normals(vec3 pos) {{
              vec3 fdx = dFdx(pos);
              vec3 fdy = dFdy(pos);
              return normalize(cross(fdx, fdy));
            }}

            void main() {{
                vec3 normal = normalize(normals(vPosition));
                float attenuation = 0.0;
                {}
                gl_FragColor = vec4(attenuation, attenuation, attenuation, 1.0);
            }}

        ", self.lights.join("\n"))

    }

    fn getVertex (&mut self) -> String {

        String::from("

            uniform mat4 uPMVMatrix;
            uniform mat4 pMatrix;
            attribute lowp vec3 aVertexPosition;
            varying vec3 vPosition;

            void main(void) {{
                gl_Position = pMatrix * uPMVMatrix * vec4(aVertexPosition, 1.0);
                vPosition = aVertexPosition;
            }}
        ")

    }

    pub fn getShader (&mut self) -> String {

        format!("
            const shaderProgram = webgl.createProgram();
            const fragment = webgl.createShader(webgl.FRAGMENT_SHADER)
            webgl.shaderSource(fragment, `{}`);
            webgl.compileShader(fragment);
            const vertex = webgl.createShader(webgl.VERTEX_SHADER)
            webgl.shaderSource(vertex, `{}`);
            webgl.compileShader(vertex);
            webgl.attachShader(shaderProgram, vertex);
            webgl.attachShader(shaderProgram, fragment);
            webgl.linkProgram(shaderProgram);
            webgl.useProgram(shaderProgram);
            shaderProgram.vertexPositionAttribute = webgl.getAttribLocation(shaderProgram, 'aVertexPosition');
            webgl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        ", self.getFragment(), self.getVertex())

    }

}
