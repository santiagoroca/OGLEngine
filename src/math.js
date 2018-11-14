module.exports = {

    mat4: {
        identity: () => [
            1.0, 0.0, 0.0, 0.0, 
            0.0, 1.0, 0.0, 0.0, 
            0.0, 0.0, 1.0, 0.0, 
            0.0, 0.0, 0.0, 1.0
        ],

        scale: (a, b, c) => {
            var d = b[0],
                e = b[1];
            b = b[2];
            if (!c || a == c) {
                a[0] *= d;
                a[1] *= d;
                a[2] *= d;
                a[3] *= d;
                a[4] *= e;
                a[5] *= e;
                a[6] *= e;
                a[7] *= e;
                a[8] *= b;
                a[9] *= b;
                a[10] *= b;
                a[11] *= b;
                return a
            }
            c[0] = a[0] * d;
            c[1] = a[1] * d;
            c[2] = a[2] * d;
            c[3] = a[3] * d;
            c[4] = a[4] * e;
            c[5] = a[5] * e;
            c[6] = a[6] * e;
            c[7] = a[7] * e;
            c[8] = a[8] * b;
            c[9] = a[9] * b;
            c[10] = a[10] * b;
            c[11] = a[11] * b;
            c[12] = a[12];
            c[13] = a[13];
            c[14] = a[14];
            c[15] = a[15];
            return c
        },

        translate: (a, b, c) => {
            var d = b[0],
                e = b[1];
            b = b[2];
            if (!c || a == c) {
                a[12] = a[0] * d + a[4] * e + a[8] * b + a[12];
                a[13] = a[1] * d + a[5] * e + a[9] * b + a[13];
                a[14] = a[2] * d + a[6] * e + a[10] * b + a[14];
                a[15] = a[3] * d + a[7] * e + a[11] * b + a[15];
                return a
            }
            var g = a[0],
                f = a[1],
                h = a[2],
                i = a[3],
                j = a[4],
                k = a[5],
                l = a[6],
                o = a[7],
                m = a[8],
                n = a[9],
                p = a[10],
                r = a[11];
            c[0] = g;
            c[1] = f;
            c[2] = h;
            c[3] = i;
            c[4] = j;
            c[5] = k;
            c[6] = l;
            c[7] = o;
            c[8] = m;
            c[9] = n;
            c[10] = p;
            c[11] = r;
            c[12] = g * d + j * e + m * b + a[12];
            c[13] = f * d + k * e + n * b + a[13];
            c[14] = h * d + l * e + p * b + a[14];
            c[15] = i * d + o * e + r * b + a[15];
            return c
        },

        rotate: (a, b, c, d) => {
            var e = c[0],
                g = c[1];
            c = c[2];
            var f = Math.sqrt(e * e + g * g + c * c);
            if (!f) return null;
            if (f != 1) {
                f = 1 / f;
                e *= f;
                g *= f;
                c *= f
            }
            var h = Math.sin(b),
                i = Math.cos(b),
                j = 1 - i;
            b = a[0];
            f = a[1];
            var k = a[2],
                l = a[3],
                o = a[4],
                m = a[5],
                n = a[6],
                p = a[7],
                r = a[8],
                s = a[9],
                A = a[10],
                B = a[11],
                t = e * e * j + i,
                u = g * e * j + c * h,
                v = c * e * j - g * h,
                w = e * g * j - c * h,
                x = g * g * j + i,
                y = c * g * j + e * h,
                z = e * c * j + g * h;
            e = g * c * j - e * h;
            g = c * c * j + i;
            if (d) {
                if (a != d) {
                    d[12] = a[12];
                    d[13] = a[13];
                    d[14] = a[14];
                    d[15] = a[15]
                }
            } else d = a;
            d[0] = b * t + o * u + r * v;
            d[1] = f * t + m * u + s * v;
            d[2] = k * t + n * u + A * v;
            d[3] = l * t + p * u + B *
                v;
            d[4] = b * w + o * x + r * y;
            d[5] = f * w + m * x + s * y;
            d[6] = k * w + n * x + A * y;
            d[7] = l * w + p * x + B * y;
            d[8] = b * z + o * e + r * g;
            d[9] = f * z + m * e + s * g;
            d[10] = k * z + n * e + A * g;
            d[11] = l * z + p * e + B * g;
            return d
        }
    },

    vec3: {

        cross: (a, b, c) => {
            c || (c = a);
            var d = a[0],
                e = a[1];
            a = a[2];
            var g = b[0],
                f = b[1];
            b = b[2];
            c[0] = e * b - a * f;
            c[1] = a * g - d * b;
            c[2] = d * f - e * g;
            return c
        },

        subtract: (a, b, c) => {
            if (!c || a == c) {
                a[0] -= b[0];
                a[1] -= b[1];
                a[2] -= b[2];
                return a
            }
            c[0] = a[0] - b[0];
            c[1] = a[1] - b[1];
            c[2] = a[2] - b[2];
            return c
        },

        scale: (a, b, c) => {
            if (!c || a == c) {
                a[0] *= b;
                a[1] *= b;
                a[2] *= b;
                return a
            }
            c[0] = a[0] * b;
            c[1] = a[1] * b;
            c[2] = a[2] * b;
            return c
        },

        normalize: (a, b) => {
            b || (b = a);
            var c = a[0],
                d = a[1],
                e = a[2],
                g = Math.sqrt(c * c + d * d + e * e);
            if (g) {
                if (g == 1) {
                    b[0] = c;
                    b[1] = d;
                    b[2] = e;
                    return b
                }
            } else {
                b[0] = 0;
                b[1] = 0;
                b[2] = 0;
                return b
            }
            g = 1 / g;
            b[0] = c * g;
            b[1] = d * g;
            b[2] = e * g;
            return b
        },

        cross: (a, b, c) => {
            c || (c = a);
            var d = a[0],
                e = a[1];
            a = a[2];
            var g = b[0],
                f = b[1];
            b = b[2];
            c[0] = e * b - a * f;
            c[1] = a * g - d * b;
            c[2] = d * f - e * g;
            return c
        },

        length: (a) => {
            var b = a[0],
                c = a[1];
            a = a[2];
            return Math.sqrt(b * b + c * c + a * a)
        },

        dot: (a, b) => {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
        },

        multiply: (a, b) => {
            return [
                a[0] * b[0],
                a[1] * b[1],
                a[2] * b[2]
            ];
        },

        multiplyScalar: (a, b) => {
            return [
                a[0] * b,
                a[1] * b,
                a[2] * b
            ];
        },

        add: (a, b, c) => {
            if (!c || a == c) {
                a[0] += b[0];
                a[1] += b[1];
                a[2] += b[2];
                return a
            }
            c[0] = a[0] + b[0];
            c[1] = a[1] + b[1];
            c[2] = a[2] + b[2];
            return c
        }

    }

}