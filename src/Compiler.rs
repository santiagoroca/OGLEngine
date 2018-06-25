use Parser::Parser as OtherParser;
use Parser::Block;

#[derive(Debug, PartialEq, Clone)]
pub struct Compiler {
    pub parser: OtherParser
}

impl Compiler {

    pub fn compile (&mut self) -> String {

        // Output Program
        let mut out = String::new();

        // Tell the parser to start parsing
        // This also tells the tokenizer to start converting
        let blocks = self.parser.parse();

        // Create the program tree for each Block
        for block in blocks {
            out.push_str(&self.build_block(block));
        }

        out

    }

    fn build_block (&self, block: Block) -> String {

        // Create the program tree for each Block
        match block._type.as_ref() {
            "scene" => self.build_scene(block),
            "cube" => self.build_cube(block),
            _       => String::new()
        }

    }

    fn build_scene (&self, block: Block) -> String {

        // Output Program
        let mut out = String::new();

        //
        out.push_str("
            const canvas = document.getElementById  ('target-canvas');
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            const webgl = canvas.getContext('webgl');
            webgl.getExtension('OES_standard_derivatives');
            webgl.enable(webgl.DEPTH_TEST);
            webgl.depthFunc(webgl.LEQUAL);
            webgl.clear(webgl.DEPTH_BUFFER_BIT);
            webgl.clear(webgl.COLOR_BUFFER_BIT);
            webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
            const shaderProgram = webgl.createProgram();
            const fragment = webgl.createShader(webgl.FRAGMENT_SHADER)
            webgl.shaderSource(fragment, `
                #extension GL_OES_standard_derivatives : enable\\n
                precision lowp float;
                varying vec3 vPosition;
                vec3 normals(vec3 pos) {
                  vec3 fdx = dFdx(pos);
                  vec3 fdy = dFdy(pos);
                  return normalize(cross(fdx, fdy));
                }
                void main() {{
                    /*vec3 normal = normalize(normals(vPosition));
                    float radialLightAttenuation = max(0.0, dot(normal, normalize(vec3(0.5, 0.0, 0.5))));*/
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                }}
            `);
            webgl.compileShader(fragment);
            const vertex = webgl.createShader(webgl.VERTEX_SHADER)
            webgl.shaderSource(vertex, `
                uniform mat4 uPMVMatrix;
                uniform mat4 pMatrix;
                attribute lowp vec3 aVertexPosition;
                varying vec3 vPosition;
                void main(void) {{
                    gl_Position = pMatrix * uPMVMatrix * vec4(aVertexPosition, 1.0);
                    vPosition = aVertexPosition;
                }}
            `);
            webgl.compileShader(vertex);
            webgl.attachShader(shaderProgram, vertex);
            webgl.attachShader(shaderProgram, fragment);
            webgl.linkProgram(shaderProgram);
            webgl.useProgram(shaderProgram);
            shaderProgram.vertexPositionAttribute = webgl.getAttribLocation(shaderProgram, 'aVertexPosition');
            webgl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
            const aspect = canvas.width / canvas.height;
            const a = 1 * Math.tan(45 * Math.PI / 360);
            const b = a * aspect;
            const h = b + b, i = a + a, j = 10 - 1;
            webgl.uniformMatrix4fv(webgl.getUniformLocation(shaderProgram, 'pMatrix'), false, [
                1 * 2 / h, 0, 0, 0,
                0, 1 * 2 / i, 0, 0,
                0, 0, -11 / j, -1,
                0, 0, -(10 * 1 * 2) / j, 0
            ]);
            webgl.uniformMatrix4fv(webgl.getUniformLocation(shaderProgram, 'uPMVMatrix'), false, [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, -5, 1
            ]);
            const scene_vertices = [];
            const scene_faces = [];
            let polygon_offset = 0;
        ");

        // Create the program tree for each Block
        for block in block._childs {
            out.push_str(&self.build_block(block));
        }

        out.push_str("
        vbuffer = webgl.createBuffer ();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, vbuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(scene_vertices).buffer, webgl.STATIC_DRAW);
        webgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
        fbuffer = webgl.createBuffer ();
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, fbuffer);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(scene_faces).buffer, webgl.STATIC_DRAW);
        webgl.drawElements(webgl.TRIANGLES, scene_faces.length, webgl.UNSIGNED_SHORT, 0);
        ");

        out

    }

    fn build_cube (&self, block: Block) -> String {

        // Output Program
        let mut out = String::new();

        //
        let mut vertices = [
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0
        ];

        //
        let faces = [
            0, 1, 2, 0, 2, 3, 3, 2, 4, 3, 4, 5,
            0, 6, 1, 0, 7, 6, 7, 4, 6, 7, 5, 6,
            1, 6, 4, 1, 4, 2, 0, 5, 7, 0, 3, 5
        ];

        for block in block._childs {

            match block._type.as_ref() {

                "position" => {

                    let x: f32 = block._args[0]._value.parse().unwrap();
                    let y: f32 = block._args[1]._value.parse().unwrap();
                    let z: f32 = block._args[2]._value.parse().unwrap();

                    let mut i = 0;
                    while i < vertices.len() {
                        vertices[i] += x;
                        vertices[i + 1] += y;
                        vertices[i + 2] += z;
                        i += 3;
                    }

                }

                "scale" => {

                    let mut x = 1.0;
                    let mut y = 1.0;
                    let mut z = 1.0;

                    if block._args.len() == 1 {
                        x = block._args[0]._value.parse().unwrap();
                        y = block._args[0]._value.parse().unwrap();
                        z = block._args[0]._value.parse().unwrap();
                    } else {
                        x = block._args[0]._value.parse().unwrap();
                        y = block._args[1]._value.parse().unwrap();
                        z = block._args[2]._value.parse().unwrap();
                    }

                    let mut i = 0;
                    while i < vertices.len() {
                        vertices[i] *= x;
                        vertices[i + 1] *= y;
                        vertices[i + 2] *= z;
                        i += 3;
                    }

                }

                _ => {}

            }

        }

        out.push_str(&format!(
            "
            Array.prototype.push.apply(scene_vertices, [{}]);
            Array.prototype.push.apply(scene_faces, [{}].map(f => f + polygon_offset));
            polygon_offset += 8;
            ",
            vertices.iter().map(|s| s.to_string()).collect::<Vec<String>>().join(","),
            faces.iter().map(|s| s.to_string()).collect::<Vec<String>>().join(",")
        ));

        out

    }

}
