use std::{mem, slice};
use Transformable::Transformable;

#[derive(Clone)]
pub struct Geometry {
    pub faces: Vec<u16>,
    pub vertices: Vec<f32>,
    pub transform: Vec<f32>
}

impl Geometry {

    pub fn new (vertices: Vec<f32>, mut faces: Vec<u16>, offset: u16) -> Geometry {

        let mut i = 0;
        while i < faces.len() {
            faces[i] += offset;
            i += 1;
        }

        Geometry  {
            faces: faces,
            vertices: vertices,
            transform: [
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            ].to_vec()
        }
    }

    pub fn getVerticesAs8Vec<'a>(&mut self) -> &'a [u8] {
        let mut i = 0;

        while i < self.vertices.len() {
            let x = self.vertices[i];
            let y = self.vertices[i + 1];
            let z = self.vertices[i + 2];

            self.vertices[i] = x * self.transform[0] + y * self.transform[4] + z * self.transform[8] + self.transform[12];
            self.vertices[i+1] = x * self.transform[1] + y * self.transform[5] + z * self.transform[9] + self.transform[13];
            self.vertices[i+2] = x * self.transform[2] + y * self.transform[6] + z * self.transform[10] + self.transform[14];
            i += 3;
        }

        unsafe {
            slice::from_raw_parts(
                self.vertices.as_ptr() as *const u8,
                self.vertices.len() * mem::size_of::<f32>(),
            )
        }
    }

    pub fn getFacesAs8Vec<'a>(&mut self) -> &'a [u8] {
        unsafe {
            slice::from_raw_parts(
                self.faces.as_ptr() as *const u8,
                self.faces.len() * mem::size_of::<u16>(),
            )
        }
    }

    pub fn getOffset (&mut self) -> u16 {
        (self.vertices.len() / 3) as u16
    }

}

impl Transformable for Geometry {

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
