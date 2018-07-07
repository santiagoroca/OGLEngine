use Transformable::Transformable;
use Event::Event;

#[derive(Clone, Copy)]
pub struct Scene {
    pub transform: [f32; 16],
    pub events: Vec<Event>
}

impl Scene {

    pub fn new () -> Scene {
        Scene {
            transform: [
               1.0, 0.0, 0.0, 0.0,
               0.0, 1.0, 0.0, 0.0,
               0.0, 0.0, 1.0, 0.0,
               0.0, 0.0, 0.0, 1.0
           ],
           events: []
       }
    }

    pub fn canvasConfiguration (self) -> String {
        String::from("
            const canvas = document.getElementById('target-canvas');
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            const webgl = canvas.getContext('webgl');
            webgl.getExtension('OES_standard_derivatives');
            webgl.enable(webgl.DEPTH_TEST);
            webgl.depthFunc(webgl.LEQUAL);
            webgl.clear(webgl.DEPTH_BUFFER_BIT);
            webgl.clear(webgl.COLOR_BUFFER_BIT);
            webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
        ")
    }

    pub fn getTransformations (self) -> String {
        String::from(format!("
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
            webgl.uniformMatrix4fv(webgl.getUniformLocation(shaderProgram, 'uPMVMatrix'), false, [{}]);
        ", self.transform.iter().map(|s| s.to_string()).collect::<Vec<String>>().join(",")))

    }

}

impl Transformable for Scene {

    fn translate (&mut self, position: Vec<f32>) {
        self.transform[12] += position[0];
        self.transform[13] += position[1];
        self.transform[14] += position[2];
    }

    fn rotate (&mut self, deg: f32, axis: Vec<f32>) {
        let mut x = axis[0];
        let mut y = axis[1];
        let mut z = axis[2];

        // Compute the length of the rotation vector
        let mut len = (x*x + y*y + z*z).sqrt();

        // If it is equal o less than zero, exit
        if len <= 0.0 {
            return
        }

        // Normalize the vector
        len = 1.0 / len;
        x *= len;
        y *= len;
        z *= len;

        // TODO
        let s = deg.sin();
        let c = deg.cos();
        let t = 1.0 - c;

        // TODO
        let a00 = self.transform[0];
        let a01 = self.transform[1];
        let a02 = self.transform[2];
        let a03 = self.transform[3];
        let a10 = self.transform[4];
        let a11 = self.transform[5];
        let a12 = self.transform[6];
        let a13 = self.transform[7];
        let a20 = self.transform[8];
        let a21 = self.transform[9];
        let a22 = self.transform[10];
        let a23 = self.transform[11];

        //TODO
        let b00 = x * x * t + c;
        let b01 = y * x * t + z * s;
        let b02 = z * x * t - y * s;
        let b10 = x * y * t - z * s;
        let b11 = y * y * t + c;
        let b12 = z * y * t + x * s;
        let b20 = x * z * t + y * s;
        let b21 = y * z * t - x * s;
        let b22 = z * z * t + c;

        // TODO
        self.transform[0] = a00 * b00 + a10 * b01 + a20 * b02;
        self.transform[1] = a01 * b00 + a11 * b01 + a21 * b02;
        self.transform[2] = a02 * b00 + a12 * b01 + a22 * b02;
        self.transform[3] = a03 * b00 + a13 * b01 + a23 * b02;
        self.transform[4] = a00 * b10 + a10 * b11 + a20 * b12;
        self.transform[5] = a01 * b10 + a11 * b11 + a21 * b12;
        self.transform[6] = a02 * b10 + a12 * b11 + a22 * b12;
        self.transform[7] = a03 * b10 + a13 * b11 + a23 * b12;
        self.transform[8] = a00 * b20 + a10 * b21 + a20 * b22;
        self.transform[9] = a01 * b20 + a11 * b21 + a21 * b22;
        self.transform[10] = a02 * b20 + a12 * b21 + a22 * b22;
        self.transform[11] = a03 * b20 + a13 * b21 + a23 * b22;

    }

    fn scale (&mut self, scale: f32) {
        self.transform[0] *= scale;
        self.transform[1] *= scale;
        self.transform[2] *= scale;
        self.transform[3] *= scale;
        self.transform[4] *= scale;
        self.transform[5] *= scale;
        self.transform[6] *= scale;
        self.transform[7] *= scale;
        self.transform[8] *= scale;
        self.transform[9] *= scale;
        self.transform[10] *= scale;
        self.transform[11] *= scale;
    }

}
