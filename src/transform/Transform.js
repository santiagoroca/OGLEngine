const Math = require('../math.js');

module.exports = class Transform {

    constructor () {
        this.transform = Math.mat4.identity();
    }

    translate (args) {
        if (args.x) this.transform[12] += args.x;
        if (args.y) this.transform[13] += args.y;
        if (args.z) this.transform[14] += args.z;
    }

    scale (args) {

        if (args.x) {
            this.transform[0] *= args.x;
            this.transform[3] *= args.x;
            this.transform[6] *= args.x;
            this.transform[9] *= args.x;
        }

        if (args.y) {
            this.transform[1] *= args.y;
            this.transform[4] *= args.y;
            this.transform[7] *= args.y;
            this.transform[10] *= args.y;
        }
        
        if (args.z) {
            this.transform[2] *= args.z;
            this.transform[5] *= args.z;
            this.transform[8] *= args.z;
            this.transform[11] *= args.z;
        }
        
    }

    rotate (args) {

        if (!args.amnt || !args.axis) {
            throw(new Error('You must define an axis and an ammount of rotation.'));
        }

        let x = args.axis[0];
        let y = args.axis[1];
        let z = args.axis[2];

        // Compute the length of the rotation vector
        let len = Math.sqrt(x*x + y*y + z*z);

        // If it is equal o less than zero, exit
        if (len <= 0.0) {
            return;
        }

        // Normalize the vector
        len = 1.0 / len;
        x *= len;
        y *= len;
        z *= len;

        // TODO
        let s = Math.sin(args.deg);
        let c = Math.cos(args.deg);
        let t = 1.0 - c;

        // TODO
        let a00 = this.transform[0];
        let a01 = this.transform[1];
        let a02 = this.transform[2];
        let a03 = this.transform[3];
        let a10 = this.transform[4];
        let a11 = this.transform[5];
        let a12 = this.transform[6];
        let a13 = this.transform[7];
        let a20 = this.transform[8];
        let a21 = this.transform[9];
        let a22 = this.transform[10];
        let a23 = this.transform[11];

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
        this.transform[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this.transform[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this.transform[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this.transform[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this.transform[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this.transform[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this.transform[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this.transform[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this.transform[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this.transform[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this.transform[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this.transform[11] = a03 * b20 + a13 * b21 + a23 * b22;

    }

    apply (transformation) {
        const b = transformation.transform;

        let a00 = this.transform[0], a01 = this.transform[1], a02 = this.transform[2], a03 = this.transform[3];
        let a10 = this.transform[4], a11 = this.transform[5], a12 = this.transform[6], a13 = this.transform[7];
        let a20 = this.transform[8], a21 = this.transform[9], a22 = this.transform[10], a23 = this.transform[11];
        let a30 = this.transform[12], a31 = this.transform[13], a32 = this.transform[14], a33 = this.transform[15];

        // Cache only the current line of the second matrix
        let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        this.transform[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.transform[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.transform[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.transform[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        this.transform[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.transform[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.transform[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.transform[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        this.transform[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.transform[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.transform[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.transform[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        this.transform[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        this.transform[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        this.transform[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        this.transform[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    }

    transformVertices (vertices) {

        for (let i = 0; i < vertices.length; i += 3) {
            let x = vertices[i];
            let y = vertices[i + 1];
            let z = vertices[i + 2];

            vertices[i] = x * this.transform[0] + y * this.transform[4] + z * this.transform[8] + this.transform[12];
            vertices[i + 1] = x * this.transform[1] + y * this.transform[5] + z * this.transform[9] + this.transform[13];
            vertices[i + 2] = x * this.transform[2] + y * this.transform[6] + z * this.transform[10] + this.transform[14];
        }

    }

}