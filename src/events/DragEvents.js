module.exports = class DragEvents {

    constructor () {
        this.events = [];
    }

    parseArg (arg) {
        if (isNaN(arg)) {
            return arg.replace(/\./, 'event.');
        }

        return arg;
    }

    addTranslateEvent (args) {
        this.events.push({
            type: 'drag',
            stringified: `
                ${ args.x ? `this.localTransform[12] += ${this.parseArg(args.x)}` : '' }
                ${ args.y ? `this.localTransform[13] += ${this.parseArg(args.y)}` : '' }
                ${ args.z ? `this.localTransform[14] += ${this.parseArg(args.z)}` : '' }
            `
        });
    }

    addRotateEvent (args) {
        this.events.push({
            type: 'drag',
            stringified: `

                let x = ${this.parseArg(args.axis[0])};
                let y = ${this.parseArg(args.axis[1])};
                let z = ${this.parseArg(args.axis[2])};
        
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
        
                ${
                    isNaN(args.amnt) ?
                    `
                        let s = Math.sin(${this.parseArg(args.amnt)});
                        let c = Math.cos(${this.parseArg(args.amnt)});
                        let t = 1.0 - Math.cos(${this.parseArg(args.amnt)});
                    ` :
                    `
                        let s = ${Math.sin(this.parseArg(args.amnt))};
                        let c = ${Math.cos(this.parseArg(args.amnt))};
                        let t = ${1.0 - Math.cos(this.parseArg(args.amnt))};
                    `
                }
                
                // TODO
                let a00 = this.localTransform[0];
                let a01 = this.localTransform[1];
                let a02 = this.localTransform[2];
                let a03 = this.localTransform[3];
                let a10 = this.localTransform[4];
                let a11 = this.localTransform[5];
                let a12 = this.localTransform[6];
                let a13 = this.localTransform[7];
                let a20 = this.localTransform[8];
                let a21 = this.localTransform[9];
                let a22 = this.localTransform[10];
                let a23 = this.localTransform[11];
        
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
                this.localTransform[0] = a00 * b00 + a10 * b01 + a20 * b02;
                this.localTransform[1] = a01 * b00 + a11 * b01 + a21 * b02;
                this.localTransform[2] = a02 * b00 + a12 * b01 + a22 * b02;
                this.localTransform[3] = a03 * b00 + a13 * b01 + a23 * b02;
                this.localTransform[4] = a00 * b10 + a10 * b11 + a20 * b12;
                this.localTransform[5] = a01 * b10 + a11 * b11 + a21 * b12;
                this.localTransform[6] = a02 * b10 + a12 * b11 + a22 * b12;
                this.localTransform[7] = a03 * b10 + a13 * b11 + a23 * b12;
                this.localTransform[8] = a00 * b20 + a10 * b21 + a20 * b22;
                this.localTransform[9] = a01 * b20 + a11 * b21 + a21 * b22;
                this.localTransform[10] = a02 * b20 + a12 * b21 + a22 * b22;
                this.localTransform[11] = a03 * b20 + a13 * b21 + a23 * b22;

            `
        });
    }

}