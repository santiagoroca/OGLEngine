use Transformable::Transformable;

pub struct Scene {}

impl Scene {

    pub fn new () -> Scene {
        Scene {}
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
        String::from("
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
        ")
    }

}

impl Transformable for Scene {

    fn translate (&mut self, position: Vec<f32>) {}

    fn rotate (&mut self, deg: f32, axis: Vec<f32>) {}

    fn scale (&mut self, scale: f32) {}

}
