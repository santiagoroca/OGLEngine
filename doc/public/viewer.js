        // glMatrix v0.9.5
        glMatrixArrayType = typeof Float32Array != "undefined" ? Float32Array : typeof WebGLFloatArray != "undefined" ? WebGLFloatArray : Array;
        var vec3 = {};
        vec3.create = function(a) {
            var b = new glMatrixArrayType(3);
            if (a) {
                b[0] = a[0];
                b[1] = a[1];
                b[2] = a[2]
            }
            return b
        };
        vec3.set = function(a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            return b
        };
        vec3.add = function(a, b, c) {
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
        };
        /*
        a - b = c
        a=vec3
        b=vec3
        c=return value
        */
        vec3.subtract = function(a, b, c) {
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
        };
        vec3.negate = function(a, b) {
            b || (b = a);
            b[0] = -a[0];
            b[1] = -a[1];
            b[2] = -a[2];
            return b
        };
        vec3.scale = function(a, b, c) {
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
        };
        vec3.normalize = function(a, b) {
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
        };
        vec3.cross = function(a, b, c) {
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
        };
        vec3.length = function(a) {
            var b = a[0],
                c = a[1];
            a = a[2];
            return Math.sqrt(b * b + c * c + a * a)
        };
        /*
        computes the dot product of two vec3 "a" and "b" and returns a scalar
        */
        vec3.dot = function(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
        };
        vec3.direction = function(a, b, c) {
            c || (c = a);
            var d = a[0] - b[0],
                e = a[1] - b[1];
            a = a[2] - b[2];
            b = Math.sqrt(d * d + e * e + a * a);
            if (!b) {
                c[0] = 0;
                c[1] = 0;
                c[2] = 0;
                return c
            }
            b = 1 / b;
            c[0] = d * b;
            c[1] = e * b;
            c[2] = a * b;
            return c
        };
        vec3.lerp = function(a, b, c, d) {
            d || (d = a);
            d[0] = a[0] + c * (b[0] - a[0]);
            d[1] = a[1] + c * (b[1] - a[1]);
            d[2] = a[2] + c * (b[2] - a[2]);
            return d
        };
        vec3.str = function(a) {
            return "[" + a[0] + ", " + a[1] + ", " + a[2] + "]"
        };
        vec3.multiply = function(a, b) {
            return [
                a[0] * b[0],
                a[1] * b[1],
                a[2] * b[2]
            ];
        };
        vec3.multiplyScalar = function(a, b) {
            return [
                a[0] * b,
                a[1] * b,
                a[2] * b
            ];
        };
        vec3.divide = function(a, b) {
            return [
                a[0] / b[0],
                a[1] / b[1],
                a[2] / b[2]
            ];
        };
        var mat3 = {};
        mat3.create = function(a) {
            var b = new glMatrixArrayType(9);
            if (a) {
                b[0] = a[0];
                b[1] = a[1];
                b[2] = a[2];
                b[3] = a[3];
                b[4] = a[4];
                b[5] = a[5];
                b[6] = a[6];
                b[7] = a[7];
                b[8] = a[8];
                b[9] = a[9]
            }
            return b
        };
        mat3.set = function(a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            b[4] = a[4];
            b[5] = a[5];
            b[6] = a[6];
            b[7] = a[7];
            b[8] = a[8];
            return b
        };
        mat3.identity = function(a) {
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 0;
            a[4] = 1;
            a[5] = 0;
            a[6] = 0;
            a[7] = 0;
            a[8] = 1;
            return a
        };
        mat3.transpose = function(a, b) {
            if (!b || a == b) {
                var c = a[1],
                    d = a[2],
                    e = a[5];
                a[1] = a[3];
                a[2] = a[6];
                a[3] = c;
                a[5] = a[7];
                a[6] = d;
                a[7] = e;
                return a
            }
            b[0] = a[0];
            b[1] = a[3];
            b[2] = a[6];
            b[3] = a[1];
            b[4] = a[4];
            b[5] = a[7];
            b[6] = a[2];
            b[7] = a[5];
            b[8] = a[8];
            return b
        };
        mat3.toMat4 = function(a, b) {
            b || (b = mat4.create());
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = 0;
            b[4] = a[3];
            b[5] = a[4];
            b[6] = a[5];
            b[7] = 0;
            b[8] = a[6];
            b[9] = a[7];
            b[10] = a[8];
            b[11] = 0;
            b[12] = 0;
            b[13] = 0;
            b[14] = 0;
            b[15] = 1;
            return b
        };
        mat3.str = function(a) {
            return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + "]"
        };
        var mat4 = {};
        mat4.create = function(a) {
            var b = new glMatrixArrayType(16);
            if (a) {
                b[0] = a[0];
                b[1] = a[1];
                b[2] = a[2];
                b[3] = a[3];
                b[4] = a[4];
                b[5] = a[5];
                b[6] = a[6];
                b[7] = a[7];
                b[8] = a[8];
                b[9] = a[9];
                b[10] = a[10];
                b[11] = a[11];
                b[12] = a[12];
                b[13] = a[13];
                b[14] = a[14];
                b[15] = a[15]
            }
            return b
        };
        mat4.set = function(a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            b[4] = a[4];
            b[5] = a[5];
            b[6] = a[6];
            b[7] = a[7];
            b[8] = a[8];
            b[9] = a[9];
            b[10] = a[10];
            b[11] = a[11];
            b[12] = a[12];
            b[13] = a[13];
            b[14] = a[14];
            b[15] = a[15];
            return b
        };
        mat4.identity = function(a) {
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 0;
            a[4] = 0;
            a[5] = 1;
            a[6] = 0;
            a[7] = 0;
            a[8] = 0;
            a[9] = 0;
            a[10] = 1;
            a[11] = 0;
            a[12] = 0;
            a[13] = 0;
            a[14] = 0;
            a[15] = 1;
            return a
        };
        mat4.transpose = function(a, b) {
            if (!b || a == b) {
                var c = a[1],
                    d = a[2],
                    e = a[3],
                    g = a[6],
                    f = a[7],
                    h = a[11];
                a[1] = a[4];
                a[2] = a[8];
                a[3] = a[12];
                a[4] = c;
                a[6] = a[9];
                a[7] = a[13];
                a[8] = d;
                a[9] = g;
                a[11] = a[14];
                a[12] = e;
                a[13] = f;
                a[14] = h;
                return a
            }
            b[0] = a[0];
            b[1] = a[4];
            b[2] = a[8];
            b[3] = a[12];
            b[4] = a[1];
            b[5] = a[5];
            b[6] = a[9];
            b[7] = a[13];
            b[8] = a[2];
            b[9] = a[6];
            b[10] = a[10];
            b[11] = a[14];
            b[12] = a[3];
            b[13] = a[7];
            b[14] = a[11];
            b[15] = a[15];
            return b
        };
        mat4.determinant = function(a) {
            var b = a[0],
                c = a[1],
                d = a[2],
                e = a[3],
                g = a[4],
                f = a[5],
                h = a[6],
                i = a[7],
                j = a[8],
                k = a[9],
                l = a[10],
                o = a[11],
                m = a[12],
                n = a[13],
                p = a[14];
            a = a[15];
            return m * k * h * e - j * n * h * e - m * f * l * e + g * n * l * e + j * f * p * e - g * k * p * e - m * k * d * i + j * n * d * i + m * c * l * i - b * n * l * i - j * c * p * i + b * k * p * i + m * f * d * o - g * n * d * o - m * c * h * o + b * n * h * o + g * c * p * o - b * f * p * o - j * f * d * a + g * k * d * a + j * c * h * a - b * k * h * a - g * c * l * a + b * f * l * a
        };
        mat4.inverse = function(a, b) {
            b || (b = a);
            var c = a[0],
                d = a[1],
                e = a[2],
                g = a[3],
                f = a[4],
                h = a[5],
                i = a[6],
                j = a[7],
                k = a[8],
                l = a[9],
                o = a[10],
                m = a[11],
                n = a[12],
                p = a[13],
                r = a[14],
                s = a[15],
                A = c * h - d * f,
                B = c * i - e * f,
                t = c * j - g * f,
                u = d * i - e * h,
                v = d * j - g * h,
                w = e * j - g * i,
                x = k * p - l * n,
                y = k * r - o * n,
                z = k * s - m * n,
                C = l * r - o * p,
                D = l * s - m * p,
                E = o * s - m * r,
                q = 1 / (A * E - B * D + t * C + u * z - v * y + w * x);
            b[0] = (h * E - i * D + j * C) * q;
            b[1] = (-d * E + e * D - g * C) * q;
            b[2] = (p * w - r * v + s * u) * q;
            b[3] = (-l * w + o * v - m * u) * q;
            b[4] = (-f * E + i * z - j * y) * q;
            b[5] = (c * E - e * z + g * y) * q;
            b[6] = (-n * w + r * t - s * B) * q;
            b[7] = (k * w - o * t + m * B) * q;
            b[8] = (f * D - h * z + j * x) * q;
            b[9] = (-c * D + d * z - g * x) * q;
            b[10] = (n * v - p * t + s * A) * q;
            b[11] = (-k * v + l * t - m * A) * q;
            b[12] = (-f * C + h * y - i * x) * q;
            b[13] = (c * C - d * y + e * x) * q;
            b[14] = (-n * u + p * B - r * A) * q;
            b[15] = (k * u - l * B + o * A) * q;
            return b
        };
        mat4.toRotationMat = function(a, b) {
            b || (b = mat4.create());
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            b[4] = a[4];
            b[5] = a[5];
            b[6] = a[6];
            b[7] = a[7];
            b[8] = a[8];
            b[9] = a[9];
            b[10] = a[10];
            b[11] = a[11];
            b[12] = 0;
            b[13] = 0;
            b[14] = 0;
            b[15] = 1;
            return b
        };
        mat4.toMat3 = function(a, b) {
            b || (b = mat3.create());
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[4];
            b[4] = a[5];
            b[5] = a[6];
            b[6] = a[8];
            b[7] = a[9];
            b[8] = a[10];
            return b
        };
        mat4.toInverseMat3 = function(a, b) {
            var c = a[0],
                d = a[1],
                e = a[2],
                g = a[4],
                f = a[5],
                h = a[6],
                i = a[8],
                j = a[9],
                k = a[10],
                l = k * f - h * j,
                o = -k * g + h * i,
                m = j * g - f * i,
                n = c * l + d * o + e * m;
            if (!n) return null;
            n = 1 / n;
            b || (b = mat3.create());
            b[0] = l * n;
            b[1] = (-k * d + e * j) * n;
            b[2] = (h * d - e * f) * n;
            b[3] = o * n;
            b[4] = (k * c - e * i) * n;
            b[5] = (-h * c + e * g) * n;
            b[6] = m * n;
            b[7] = (-j * c + d * i) * n;
            b[8] = (f * c - d * g) * n;
            return b
        };
        mat4.multiply = function(a, b, c) {
            c || (c = a);
            var d = a[0],
                e = a[1],
                g = a[2],
                f = a[3],
                h = a[4],
                i = a[5],
                j = a[6],
                k = a[7],
                l = a[8],
                o = a[9],
                m = a[10],
                n = a[11],
                p = a[12],
                r = a[13],
                s = a[14];
            a = a[15];
            var A = b[0],
                B = b[1],
                t = b[2],
                u = b[3],
                v = b[4],
                w = b[5],
                x = b[6],
                y = b[7],
                z = b[8],
                C = b[9],
                D = b[10],
                E = b[11],
                q = b[12],
                F = b[13],
                G = b[14];
            b = b[15];
            c[0] = A * d + B * h + t * l + u * p;
            c[1] = A * e + B * i + t * o + u * r;
            c[2] = A * g + B * j + t * m + u * s;
            c[3] = A * f + B * k + t * n + u * a;
            c[4] = v * d + w * h + x * l + y * p;
            c[5] = v * e + w * i + x * o + y * r;
            c[6] = v * g + w * j + x * m + y * s;
            c[7] = v * f + w * k + x * n + y * a;
            c[8] = z * d + C * h + D * l + E * p;
            c[9] = z * e + C * i + D * o + E * r;
            c[10] = z *
                g + C * j + D * m + E * s;
            c[11] = z * f + C * k + D * n + E * a;
            c[12] = q * d + F * h + G * l + b * p;
            c[13] = q * e + F * i + G * o + b * r;
            c[14] = q * g + F * j + G * m + b * s;
            c[15] = q * f + F * k + G * n + b * a;
            return c
        };
        mat4.multiplyVec3 = function(a, b, c) {
            c || (c = b);
            var d = b[0],
                e = b[1];
            b = b[2];
            c[0] = a[0] * d + a[4] * e + a[8] * b + a[12];
            c[1] = a[1] * d + a[5] * e + a[9] * b + a[13];
            c[2] = a[2] * d + a[6] * e + a[10] * b + a[14];
            return c
        };
        mat4.multiplyVec4 = function(a, b, c) {
            c || (c = b);
            var d = b[0],
                e = b[1],
                g = b[2];
            b = b[3];
            c[0] = a[0] * d + a[4] * e + a[8] * g + a[12] * b;
            c[1] = a[1] * d + a[5] * e + a[9] * g + a[13] * b;
            c[2] = a[2] * d + a[6] * e + a[10] * g + a[14] * b;
            c[3] = a[3] * d + a[7] * e + a[11] * g + a[15] * b;
            return c
        };
        mat4.translate = function(a, b, c) {
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
        };
        mat4.scale = function(a, b, c) {
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
        };
        mat4.rotate = function(a, b, c, d) {
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
        };
        mat4.rotateX = function(a, b, c) {
            var d = Math.sin(b);
            b = Math.cos(b);
            var e = a[4],
                g = a[5],
                f = a[6],
                h = a[7],
                i = a[8],
                j = a[9],
                k = a[10],
                l = a[11];
            if (c) {
                if (a != c) {
                    c[0] = a[0];
                    c[1] = a[1];
                    c[2] = a[2];
                    c[3] = a[3];
                    c[12] = a[12];
                    c[13] = a[13];
                    c[14] = a[14];
                    c[15] = a[15]
                }
            } else c = a;
            c[4] = e * b + i * d;
            c[5] = g * b + j * d;
            c[6] = f * b + k * d;
            c[7] = h * b + l * d;
            c[8] = e * -d + i * b;
            c[9] = g * -d + j * b;
            c[10] = f * -d + k * b;
            c[11] = h * -d + l * b;
            return c
        };
        mat4.rotateY = function(a, b, c) {
            var d = Math.sin(b);
            b = Math.cos(b);
            var e = a[0],
                g = a[1],
                f = a[2],
                h = a[3],
                i = a[8],
                j = a[9],
                k = a[10],
                l = a[11];
            if (c) {
                if (a != c) {
                    c[4] = a[4];
                    c[5] = a[5];
                    c[6] = a[6];
                    c[7] = a[7];
                    c[12] = a[12];
                    c[13] = a[13];
                    c[14] = a[14];
                    c[15] = a[15]
                }
            } else c = a;
            c[0] = e * b + i * -d;
            c[1] = g * b + j * -d;
            c[2] = f * b + k * -d;
            c[3] = h * b + l * -d;
            c[8] = e * d + i * b;
            c[9] = g * d + j * b;
            c[10] = f * d + k * b;
            c[11] = h * d + l * b;
            return c
        };
        mat4.rotateZ = function(a, b, c) {
            var d = Math.sin(b);
            b = Math.cos(b);
            var e = a[0],
                g = a[1],
                f = a[2],
                h = a[3],
                i = a[4],
                j = a[5],
                k = a[6],
                l = a[7];
            if (c) {
                if (a != c) {
                    c[8] = a[8];
                    c[9] = a[9];
                    c[10] = a[10];
                    c[11] = a[11];
                    c[12] = a[12];
                    c[13] = a[13];
                    c[14] = a[14];
                    c[15] = a[15]
                }
            } else c = a;
            c[0] = e * b + i * d;
            c[1] = g * b + j * d;
            c[2] = f * b + k * d;
            c[3] = h * b + l * d;
            c[4] = e * -d + i * b;
            c[5] = g * -d + j * b;
            c[6] = f * -d + k * b;
            c[7] = h * -d + l * b;
            return c
        };
        mat4.frustum = function(a, b, c, d, e, g, f) {
            f || (f = mat4.create());
            var h = b - a,
                i = d - c,
                j = g - e;
            f[0] = e * 2 / h;
            f[1] = 0;
            f[2] = 0;
            f[3] = 0;
            f[4] = 0;
            f[5] = e * 2 / i;
            f[6] = 0;
            f[7] = 0;
            f[8] = (b + a) / h;
            f[9] = (d + c) / i;
            f[10] = -(g + e) / j;
            f[11] = -1;
            f[12] = 0;
            f[13] = 0;
            f[14] = -(g * e * 2) / j;
            f[15] = 0;
            return f
        };
        mat4.perspective = function(a, b, c, d, e) {
            a = c * Math.tan(a * Math.PI / 360);
            b = a * b;
            return mat4.frustum(-b, b, -a, a, c, d, e)
        };
        mat4.ortho = function(a, b, c, d, e, g, f) {
            f || (f = mat4.create());
            var h = b - a,
                i = d - c,
                j = g - e;
            f[0] = 2 / h;
            f[1] = 0;
            f[2] = 0;
            f[3] = 0;
            f[4] = 0;
            f[5] = 2 / i;
            f[6] = 0;
            f[7] = 0;
            f[8] = 0;
            f[9] = 0;
            f[10] = -2 / j;
            f[11] = 0;
            f[12] = -(a + b) / h;
            f[13] = -(d + c) / i;
            f[14] = -(g + e) / j;
            f[15] = 1;
            return f
        };
        mat4.lookAt = function(a, b, c, d) {
            d || (d = mat4.create());
            var e = a[0],
                g = a[1];
            a = a[2];
            var f = c[0],
                h = c[1],
                i = c[2];
            c = b[1];
            var j = b[2];
            if (e == b[0] && g == c && a == j) return mat4.identity(d);
            var k, l, o, m;
            c = e - b[0];
            j = g - b[1];
            b = a - b[2];
            m = 1 / Math.sqrt(c * c + j * j + b * b);
            c *= m;
            j *= m;
            b *= m;
            k = h * b - i * j;
            i = i * c - f * b;
            f = f * j - h * c;
            if (m = Math.sqrt(k * k + i * i + f * f)) {
                m = 1 / m;
                k *= m;
                i *= m;
                f *= m
            } else f = i = k = 0;
            h = j * f - b * i;
            l = b * k - c * f;
            o = c * i - j * k;
            if (m = Math.sqrt(h * h + l * l + o * o)) {
                m = 1 / m;
                h *= m;
                l *= m;
                o *= m
            } else o = l = h = 0;
            d[0] = k;
            d[1] = h;
            d[2] = c;
            d[3] = 0;
            d[4] = i;
            d[5] = l;
            d[6] = j;
            d[7] = 0;
            d[8] = f;
            d[9] =
                o;
            d[10] = b;
            d[11] = 0;
            d[12] = -(k * e + i * g + f * a);
            d[13] = -(h * e + l * g + o * a);
            d[14] = -(c * e + j * g + b * a);
            d[15] = 1;
            return d
        };
        mat4.str = function(a) {
            return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + "]"
        };
        quat4 = {};
        quat4.create = function(a) {
            var b = new glMatrixArrayType(4);
            if (a) {
                b[0] = a[0];
                b[1] = a[1];
                b[2] = a[2];
                b[3] = a[3]
            }
            return b
        };
        quat4.set = function(a, b) {
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            return b
        };
        quat4.calculateW = function(a, b) {
            var c = a[0],
                d = a[1],
                e = a[2];
            if (!b || a == b) {
                a[3] = -Math.sqrt(Math.abs(1 - c * c - d * d - e * e));
                return a
            }
            b[0] = c;
            b[1] = d;
            b[2] = e;
            b[3] = -Math.sqrt(Math.abs(1 - c * c - d * d - e * e));
            return b
        };
        quat4.inverse = function(a, b) {
            if (!b || a == b) {
                a[0] *= 1;
                a[1] *= 1;
                a[2] *= 1;
                return a
            }
            b[0] = -a[0];
            b[1] = -a[1];
            b[2] = -a[2];
            b[3] = a[3];
            return b
        };
        quat4.length = function(a) {
            var b = a[0],
                c = a[1],
                d = a[2];
            a = a[3];
            return Math.sqrt(b * b + c * c + d * d + a * a)
        };
        quat4.normalize = function(a, b) {
            b || (b = a);
            var c = a[0],
                d = a[1],
                e = a[2],
                g = a[3],
                f = Math.sqrt(c * c + d * d + e * e + g * g);
            if (f == 0) {
                b[0] = 0;
                b[1] = 0;
                b[2] = 0;
                b[3] = 0;
                return b
            }
            f = 1 / f;
            b[0] = c * f;
            b[1] = d * f;
            b[2] = e * f;
            b[3] = g * f;
            return b
        };
        quat4.multiply = function(a, b, c) {
            c || (c = a);
            var d = a[0],
                e = a[1],
                g = a[2];
            a = a[3];
            var f = b[0],
                h = b[1],
                i = b[2];
            b = b[3];
            c[0] = d * b + a * f + e * i - g * h;
            c[1] = e * b + a * h + g * f - d * i;
            c[2] = g * b + a * i + d * h - e * f;
            c[3] = a * b - d * f - e * h - g * i;
            return c
        };
        quat4.multiplyVec3 = function(a, b, c) {
            c || (c = b);
            var d = b[0],
                e = b[1],
                g = b[2];
            b = a[0];
            var f = a[1],
                h = a[2];
            a = a[3];
            var i = a * d + f * g - h * e,
                j = a * e + h * d - b * g,
                k = a * g + b * e - f * d;
            d = -b * d - f * e - h * g;
            c[0] = i * a + d * -b + j * -h - k * -f;
            c[1] = j * a + d * -f + k * -b - i * -h;
            c[2] = k * a + d * -h + i * -f - j * -b;
            return c
        };
        quat4.toMat3 = function(a, b) {
            b || (b = mat3.create());
            var c = a[0],
                d = a[1],
                e = a[2],
                g = a[3],
                f = c + c,
                h = d + d,
                i = e + e,
                j = c * f,
                k = c * h;
            c = c * i;
            var l = d * h;
            d = d * i;
            e = e * i;
            f = g * f;
            h = g * h;
            g = g * i;
            b[0] = 1 - (l + e);
            b[1] = k - g;
            b[2] = c + h;
            b[3] = k + g;
            b[4] = 1 - (j + e);
            b[5] = d - f;
            b[6] = c - h;
            b[7] = d + f;
            b[8] = 1 - (j + l);
            return b
        };
        quat4.toMat4 = function(a, b) {
            b || (b = mat4.create());
            var c = a[0],
                d = a[1],
                e = a[2],
                g = a[3],
                f = c + c,
                h = d + d,
                i = e + e,
                j = c * f,
                k = c * h;
            c = c * i;
            var l = d * h;
            d = d * i;
            e = e * i;
            f = g * f;
            h = g * h;
            g = g * i;
            b[0] = 1 - (l + e);
            b[1] = k - g;
            b[2] = c + h;
            b[3] = 0;
            b[4] = k + g;
            b[5] = 1 - (j + e);
            b[6] = d - f;
            b[7] = 0;
            b[8] = c - h;
            b[9] = d + f;
            b[10] = 1 - (j + l);
            b[11] = 0;
            b[12] = 0;
            b[13] = 0;
            b[14] = 0;
            b[15] = 1;
            return b
        };
        quat4.slerp = function(a, b, c, d) {
            d || (d = a);
            var e = c;
            if (a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3] < 0) e = -1 * c;
            d[0] = 1 - c * a[0] + e * b[0];
            d[1] = 1 - c * a[1] + e * b[1];
            d[2] = 1 - c * a[2] + e * b[2];
            d[3] = 1 - c * a[3] + e * b[3];
            return d
        };
        quat4.str = function(a) {
            return "[" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + "]"
        };
        quat4.scale = function(a, b, c) {
            if (!c || a == c) {
                a[0] *= b;
                a[1] *= b;
                a[2] *= b;
                a[3] *= b;
                return a
            }
            c[0] = a[0] * b;
            c[1] = a[1] * b;
            c[2] = a[2] * b;
            c[3] = a[3] * b;
            return c
        };
            function Transform (transform = {}) {
            this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            this.translation = [0, 0, 0];
            this.x_angle = 0;
            this.y_angle = 0;
            this.z_angle = 0;
            this.scale = 1.0;
            Object.assign(this, transform);
        }
        
        Transform.prototype.translate = function (x, y, z) {
        
            const right = vec3.multiplyScalar(vec3.normalize([
                this.matrix[0], this.matrix[4], this.matrix[8]
            ]), x);
        
            const up = vec3.multiplyScalar(vec3.normalize([
                this.matrix[1], this.matrix[5], this.matrix[9]
            ]), y);
        
            const back = vec3.multiplyScalar(vec3.normalize([
                this.matrix[2], this.matrix[6], this.matrix[10]
            ]), z);
        
            this.translation = vec3.add(
                this.translation, 
                [x, y, z]
                //vec3.add(vec3.add(right, up), back)
            );
        
            this.calculateTransform();
        
        }
        
        Transform.prototype.rotate = function (x, y, z) {
            this.x_angle += x;
            this.y_angle += y;
            this.z_angle += z;
            this.calculateTransform();
        }
        
        Transform.prototype.calculateTransform = function () {
            this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        
            this.matrix = mat4.translate(this.matrix, this.translation);
        
            this.matrix = mat4.rotate(this.matrix, this.y_angle, [
                this.matrix[1], this.matrix[5], this.matrix[9]
            ]);
        
            this.matrix = mat4.rotate(this.matrix, this.x_angle, [
                this.matrix[0], this.matrix[4], this.matrix[8]
            ]);
        
            this.matrix = mat4.rotate(this.matrix, this.z_angle, [
                this.matrix[2], this.matrix[6], this.matrix[10]
            ]);
            
        }
        
            function viewer (container) {
        
            /*
            * Canvas Configuration
            */
            const canvas = document.createElement('canvas');
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            container.appendChild(canvas);
            canvas.oncontextmenu = () => false;
        
            /*
            * WebGL Context Configuration
            */
            const webgl = canvas.getContext("webgl");
            webgl.viewport(0, 0, container.clientWidth, container.clientHeight);
            webgl.clearColor(0.0, 0.0, 0.0, 0.0);
            webgl.getExtension('OES_standard_derivatives');
            webgl.enable(webgl.DEPTH_TEST);
        
            /*
            * There are multiple cameras but only one active
            */
            const cameras = [];
            let activeCamera = null;
        
            
        
                    const v_buff_pbakcuh = webgl.createBuffer();
                    const n_buff_pbakcuh = webgl.createBuffer();
                    const f_buff_pbakcuh = webgl.createBuffer();
        
                    
                        const uvs_buff_pbakcuh = webgl.createBuffer();
                    
        
                    fetch('models/geometry_pbakcuh.faces')
                    .then(response => {
                        response.arrayBuffer()
                        .then(buffer => {
                            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_pbakcuh);
                            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                        })
                    });
        
                    fetch('models/geometry_pbakcuh.vertexs')
                    .then(response => {
                        response.arrayBuffer()
                        .then(buffer => {
                            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_pbakcuh);
                            webgl.bufferData(webgl.ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                        })
                    });
        
                    fetch('models/geometry_pbakcuh.normals')
                    .then(response => {
                        response.arrayBuffer()
                        .then(buffer => {
                            webgl.bindBuffer(webgl.ARRAY_BUFFER, n_buff_pbakcuh);
                            webgl.bufferData(webgl.ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                        })
                    });
        
                    
                        fetch('models/geometry_pbakcuh.uvs')
                        .then(response => {
                            response.arrayBuffer()
                            .then(buffer => {
                                webgl.bindBuffer(webgl.ARRAY_BUFFER, uvs_buff_pbakcuh);
                                webgl.bufferData(webgl.ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                            })
                        });
                    
                        
                    
                        const texture_pbakcuh = webgl.createTexture();
                        const image_pbakcuh = new Image();
                        image_pbakcuh.onload = function () {
                            webgl.bindTexture(webgl.TEXTURE_2D, texture_pbakcuh);
                            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image_pbakcuh);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_NEAREST);
                            webgl.generateMipmap(webgl.TEXTURE_2D);
                        }
                        image_pbakcuh.src = 'textures/cdyhcdyh.jpg';
                    
        
                    
                        const specular_map_pbakcuh = webgl.createTexture();
                        const specular_image_pbakcuh = new Image();
                        specular_image_pbakcuh.onload = function () {
                            webgl.bindTexture(webgl.TEXTURE_2D, specular_map_pbakcuh);
                            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, specular_image_pbakcuh);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_NEAREST);
                            webgl.generateMipmap(webgl.TEXTURE_2D);
                        }
                        specular_image_pbakcuh.src = 'textures/qfcijn.jpg';
                    
        
                    const geometry_pbakcuh = Object.assign({
                        vertexs: v_buff_pbakcuh,
                        indexes: f_buff_pbakcuh,
                        normals: n_buff_pbakcuh,
                        transform: {"model":{"translate":[0,0,0],"x_angle":0,"y_angle":0,"z_angle":0,"scale":1,"matrix":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"isDirty":true},"world":{"translate":[0,0,0],"x_angle":0,"y_angle":0,"z_angle":0,"scale":1,"matrix":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"isDirty":true}},
                        count: 11088,
        
                        
                            uvs: uvs_buff_pbakcuh,
                        
        
                        
                            texture: texture_pbakcuh,
                        
        
                        
                            specularmap: specular_map_pbakcuh,
                        
        
                        
                        
                    });
        
                
        
                    const v_buff_uqjbna = webgl.createBuffer();
                    const n_buff_uqjbna = webgl.createBuffer();
                    const f_buff_uqjbna = webgl.createBuffer();
        
                    
                        const uvs_buff_uqjbna = webgl.createBuffer();
                    
        
                    fetch('models/geometry_uqjbna.faces')
                    .then(response => {
                        response.arrayBuffer()
                        .then(buffer => {
                            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_uqjbna);
                            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                        })
                    });
        
                    fetch('models/geometry_uqjbna.vertexs')
                    .then(response => {
                        response.arrayBuffer()
                        .then(buffer => {
                            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_uqjbna);
                            webgl.bufferData(webgl.ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                        })
                    });
        
                    fetch('models/geometry_uqjbna.normals')
                    .then(response => {
                        response.arrayBuffer()
                        .then(buffer => {
                            webgl.bindBuffer(webgl.ARRAY_BUFFER, n_buff_uqjbna);
                            webgl.bufferData(webgl.ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                        })
                    });
        
                    
                        fetch('models/geometry_uqjbna.uvs')
                        .then(response => {
                            response.arrayBuffer()
                            .then(buffer => {
                                webgl.bindBuffer(webgl.ARRAY_BUFFER, uvs_buff_uqjbna);
                                webgl.bufferData(webgl.ARRAY_BUFFER, buffer, webgl.STATIC_DRAW);
                            })
                        });
                    
                        
                    
                        const texture_uqjbna = webgl.createTexture();
                        const image_uqjbna = new Image();
                        image_uqjbna.onload = function () {
                            webgl.bindTexture(webgl.TEXTURE_2D, texture_uqjbna);
                            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image_uqjbna);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_NEAREST);
                            webgl.generateMipmap(webgl.TEXTURE_2D);
                        }
                        image_uqjbna.src = 'textures/jazrbvswq.jpg';
                    
        
                    
        
                    const geometry_uqjbna = Object.assign({
                        vertexs: v_buff_uqjbna,
                        indexes: f_buff_uqjbna,
                        normals: n_buff_uqjbna,
                        transform: {"model":{"translate":[0,0,0],"x_angle":0,"y_angle":0,"z_angle":0,"scale":1,"matrix":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"isDirty":true},"world":{"translate":[0,0,100],"x_angle":0,"y_angle":0,"z_angle":0,"scale":20,"matrix":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"isDirty":true}},
                        count: 11088,
        
                        
                            uvs: uvs_buff_uqjbna,
                        
        
                        
                            texture: texture_uqjbna,
                        
        
                        
        
                        
                        
                    });
        
                
        
                    const aspect = canvas.width / canvas.height;
                    const b = 0.17632698070846498 * aspect;
                    const h = b + b;
                    const camera_ofrekuzn = {
                        projectionMatrix: [
                            1 * 2 / h, 0,            0,                    0,
                            0,         1 * 2 / 0.35265396141692995, 0,                    0,
                            0,         0,            -11 / 999.9,           -1,
                            0,         0,            -(10 * 1 * 2) / 999.9, 0
                        ],
                        transform: {"model":{"translate":[0,0,0],"x_angle":0,"y_angle":-2.7925280000000003,"z_angle":0,"scale":1,"matrix":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"isDirty":true},"world":{"translate":[5,-1.5,-25],"x_angle":0,"y_angle":0,"z_angle":0,"scale":1,"matrix":[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],"isDirty":true}}
                    };
        
                    cameras.push(camera_ofrekuzn);
                    enableCamera(camera_ofrekuzn);
                    
                
        
                    const PhongVertex_getoxzwa = `
        
                        attribute lowp vec3 aVertexPosition;
        
                        attribute lowp vec3 aVertexNormal;
                        attribute lowp vec2 aVertexUV;
        
                        uniform mat4 model;
                        uniform mat4 world;
        
                        uniform mat4 cameraModel;
                        uniform mat4 cameraWorld;
        
                        uniform mat4 projection;
                        uniform sampler2D uSampler;
                        
                        varying vec3 vNormal;
                        varying vec2 vVertexUV;
                        varying vec3 vVertexPosition;
                        
                        void main(void) {
                            vec4 worldModelSpaceVertex = cameraWorld * cameraModel * world * model * vec4(aVertexPosition, 1.0);
                            gl_Position = projection * worldModelSpaceVertex;
                            vVertexPosition = worldModelSpaceVertex.xyz;
                            vNormal = mat3(cameraWorld) * mat3(cameraModel) * mat3(world) * mat3(model) * aVertexNormal;
                            vVertexUV = aVertexUV;
                        }
        
                    `;
        
                    const PhongFragment_getoxzwa = `
                        precision highp float;
        
                        uniform mat4 model;
                        uniform mat4 world;
        
                        uniform mat4 cameraModel;
                        uniform mat4 cameraWorld;
        
                        
                        uniform sampler2D uSampler;
                        
        
                        const vec4 ambient_light = vec4(0.2,0.2,0.2,1);
        
                        
        
                        const vec3 point_jpbpco = vec3(0,0,20);
        
                        varying vec3 vNormal;
                        varying vec2 vVertexUV;
                        varying vec3 vVertexPosition;
        
                        void main() {
                            float light = 0.0;
                            vec4 specular = vec4(0.0);
        
                            
                                vec3 normal = normalize(vNormal);
                                vec3 cameraPosition = (cameraWorld * cameraModel)[3].xyz;
                                vec3 eye = normalize(-vVertexPosition);
                            
                            
                            
        
                            
        
                                vec3 camera_space_jpbpco = vec3(cameraWorld * cameraModel * vec4(point_jpbpco, 1.0));
                                vec3 surfaceToLight_jpbpco = normalize(camera_space_jpbpco - vVertexPosition);
                                float diffuse_jpbpco = max(0.0, dot(normal, surfaceToLight_jpbpco));
                                
                                specular += pow(max(0.0, dot(
                                    eye, reflect(-surfaceToLight_jpbpco, normal)
                                )), 100.0) * vec4(1.0);
        
                                light += diffuse_jpbpco;
        
                            
        
                            
                     
                            gl_FragColor = (
                                
                                texture2D(uSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t))
                            ) * (vec4(light, light, light, 1.0) + ambient_light) + specular;
        
                        }
                    `;
        
                    // Fragment 
                    const PhongFragmentShader_getoxzwa = webgl.createShader(webgl.FRAGMENT_SHADER);
                    webgl.shaderSource(PhongFragmentShader_getoxzwa, PhongFragment_getoxzwa);
                    webgl.compileShader(PhongFragmentShader_getoxzwa);
        
                    if (!webgl.getShaderParameter(PhongFragmentShader_getoxzwa, webgl.COMPILE_STATUS)) {
                        alert(webgl.getShaderInfoLog(PhongFragmentShader_getoxzwa));
                    }
        
                    // Vertex
                    const PhongVertexShader_getoxzwa = webgl.createShader(webgl.VERTEX_SHADER);
                    webgl.shaderSource(PhongVertexShader_getoxzwa, PhongVertex_getoxzwa);
                    webgl.compileShader(PhongVertexShader_getoxzwa);
        
                    if (!webgl.getShaderParameter(PhongVertexShader_getoxzwa, webgl.COMPILE_STATUS)) {
                        alert(webgl.getShaderInfoLog(PhongVertexShader_getoxzwa));
                    }
        
                    // Program
                    const PhongShaderProgram_getoxzwa = webgl.createProgram();
                    webgl.attachShader(PhongShaderProgram_getoxzwa, PhongVertexShader_getoxzwa);
                    webgl.attachShader(PhongShaderProgram_getoxzwa, PhongFragmentShader_getoxzwa);
                    webgl.linkProgram(PhongShaderProgram_getoxzwa);
                    webgl.useProgram(PhongShaderProgram_getoxzwa);
        
                    // Attributes and uniforms
                    PhongShaderProgram_getoxzwa.vertexPositionAttribute = webgl.getAttribLocation(PhongShaderProgram_getoxzwa, "aVertexPosition");
                    webgl.enableVertexAttribArray(PhongShaderProgram_getoxzwa.vertexPositionAttribute);
        
                    
                        PhongShaderProgram_getoxzwa.vertexNormalAttribute = webgl.getAttribLocation(PhongShaderProgram_getoxzwa, "aVertexNormal");
                        webgl.enableVertexAttribArray(PhongShaderProgram_getoxzwa.vertexNormalAttribute);
                    
                    
                    
                        PhongShaderProgram_getoxzwa.vertexUVAttribute = webgl.getAttribLocation(PhongShaderProgram_getoxzwa, "aVertexUV");
                        webgl.enableVertexAttribArray(PhongShaderProgram_getoxzwa.vertexUVAttribute);
                    
        
                    
        
                    PhongShaderProgram_getoxzwa.world = webgl.getUniformLocation(PhongShaderProgram_getoxzwa, 'world');
                    PhongShaderProgram_getoxzwa.model = webgl.getUniformLocation(PhongShaderProgram_getoxzwa, 'model');
                    PhongShaderProgram_getoxzwa.cameraWorld = webgl.getUniformLocation(PhongShaderProgram_getoxzwa, 'cameraWorld');
                    PhongShaderProgram_getoxzwa.cameraModel = webgl.getUniformLocation(PhongShaderProgram_getoxzwa, 'cameraModel');
                    PhongShaderProgram_getoxzwa.projection = webgl.getUniformLocation(PhongShaderProgram_getoxzwa, 'projection');
                    
                    
                    
                
        
        
                    const PhongVertex_qzqalfuj = `
        
                        attribute lowp vec3 aVertexPosition;
        
                        attribute lowp vec3 aVertexNormal;
                        attribute lowp vec2 aVertexUV;
        
                        uniform mat4 model;
                        uniform mat4 world;
        
                        uniform mat4 cameraModel;
                        uniform mat4 cameraWorld;
        
                        uniform mat4 projection;
                        uniform sampler2D uSampler;
                        
                        varying vec3 vNormal;
                        varying vec2 vVertexUV;
                        varying vec3 vVertexPosition;
                        
                        void main(void) {
                            vec4 worldModelSpaceVertex = cameraWorld * cameraModel * world * model * vec4(aVertexPosition, 1.0);
                            gl_Position = projection * worldModelSpaceVertex;
                            vVertexPosition = worldModelSpaceVertex.xyz;
                            vNormal = mat3(cameraWorld) * mat3(cameraModel) * mat3(world) * mat3(model) * aVertexNormal;
                            vVertexUV = aVertexUV;
                        }
        
                    `;
        
                    const PhongFragment_qzqalfuj = `
                        precision highp float;
        
                        uniform mat4 model;
                        uniform mat4 world;
        
                        uniform mat4 cameraModel;
                        uniform mat4 cameraWorld;
        
                        
                        uniform sampler2D uSampler;
                        uniform sampler2D specularMapSampler;
        
                        const vec4 ambient_light = vec4(0.2,0.2,0.2,1);
        
                        
        
                        const vec3 point_jpbpco = vec3(0,0,20);
        
                        varying vec3 vNormal;
                        varying vec2 vVertexUV;
                        varying vec3 vVertexPosition;
        
                        void main() {
                            float light = 0.0;
                            vec4 specular = vec4(0.0);
        
                            
                                vec3 normal = normalize(vNormal);
                                vec3 cameraPosition = (cameraWorld * cameraModel)[3].xyz;
                                vec3 eye = normalize(-vVertexPosition);
                            
                            
                            
        
                            
        
                                vec3 camera_space_jpbpco = vec3(cameraWorld * cameraModel * vec4(point_jpbpco, 1.0));
                                vec3 surfaceToLight_jpbpco = normalize(camera_space_jpbpco - vVertexPosition);
                                float diffuse_jpbpco = max(0.0, dot(normal, surfaceToLight_jpbpco));
                                
                                specular += pow(max(0.0, dot(
                                    eye, reflect(-surfaceToLight_jpbpco, normal)
                                )), 20.0) * vec4(1.0);
        
                                light += diffuse_jpbpco;
        
                            
        
                            specular *= texture2D(specularMapSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t));
                     
                            gl_FragColor = (
                                
                                texture2D(uSampler, vec2(vVertexUV.s, 1.0-vVertexUV.t))
                            ) * (vec4(light, light, light, 1.0) + ambient_light) + specular;
        
                        }
                    `;
        
                    // Fragment 
                    const PhongFragmentShader_qzqalfuj = webgl.createShader(webgl.FRAGMENT_SHADER);
                    webgl.shaderSource(PhongFragmentShader_qzqalfuj, PhongFragment_qzqalfuj);
                    webgl.compileShader(PhongFragmentShader_qzqalfuj);
        
                    if (!webgl.getShaderParameter(PhongFragmentShader_qzqalfuj, webgl.COMPILE_STATUS)) {
                        alert(webgl.getShaderInfoLog(PhongFragmentShader_qzqalfuj));
                    }
        
                    // Vertex
                    const PhongVertexShader_qzqalfuj = webgl.createShader(webgl.VERTEX_SHADER);
                    webgl.shaderSource(PhongVertexShader_qzqalfuj, PhongVertex_qzqalfuj);
                    webgl.compileShader(PhongVertexShader_qzqalfuj);
        
                    if (!webgl.getShaderParameter(PhongVertexShader_qzqalfuj, webgl.COMPILE_STATUS)) {
                        alert(webgl.getShaderInfoLog(PhongVertexShader_qzqalfuj));
                    }
        
                    // Program
                    const PhongShaderProgram_qzqalfuj = webgl.createProgram();
                    webgl.attachShader(PhongShaderProgram_qzqalfuj, PhongVertexShader_qzqalfuj);
                    webgl.attachShader(PhongShaderProgram_qzqalfuj, PhongFragmentShader_qzqalfuj);
                    webgl.linkProgram(PhongShaderProgram_qzqalfuj);
                    webgl.useProgram(PhongShaderProgram_qzqalfuj);
        
                    // Attributes and uniforms
                    PhongShaderProgram_qzqalfuj.vertexPositionAttribute = webgl.getAttribLocation(PhongShaderProgram_qzqalfuj, "aVertexPosition");
                    webgl.enableVertexAttribArray(PhongShaderProgram_qzqalfuj.vertexPositionAttribute);
        
                    
                        PhongShaderProgram_qzqalfuj.vertexNormalAttribute = webgl.getAttribLocation(PhongShaderProgram_qzqalfuj, "aVertexNormal");
                        webgl.enableVertexAttribArray(PhongShaderProgram_qzqalfuj.vertexNormalAttribute);
                    
                    
                    
                        PhongShaderProgram_qzqalfuj.vertexUVAttribute = webgl.getAttribLocation(PhongShaderProgram_qzqalfuj, "aVertexUV");
                        webgl.enableVertexAttribArray(PhongShaderProgram_qzqalfuj.vertexUVAttribute);
                    
        
                    
                        PhongShaderProgram_qzqalfuj.specularMapSampler = webgl.getUniformLocation(PhongShaderProgram_qzqalfuj, "specularMapSampler");
                        webgl.uniform1i(PhongShaderProgram_qzqalfuj.specularMapSampler, 1);
                    
        
                    PhongShaderProgram_qzqalfuj.world = webgl.getUniformLocation(PhongShaderProgram_qzqalfuj, 'world');
                    PhongShaderProgram_qzqalfuj.model = webgl.getUniformLocation(PhongShaderProgram_qzqalfuj, 'model');
                    PhongShaderProgram_qzqalfuj.cameraWorld = webgl.getUniformLocation(PhongShaderProgram_qzqalfuj, 'cameraWorld');
                    PhongShaderProgram_qzqalfuj.cameraModel = webgl.getUniformLocation(PhongShaderProgram_qzqalfuj, 'cameraModel');
                    PhongShaderProgram_qzqalfuj.projection = webgl.getUniformLocation(PhongShaderProgram_qzqalfuj, 'projection');
                    
                    
                    
                
        
                let lastRender = new Date().getTime();
                function render () {
        
                    const thisRender = new Date().getTime();
                    if (thisRender - lastRender < 16) {
                        return;
                    }
                    
                    webgl.clear(webgl.DEPTH_BUFFER_BIT);
                    webgl.clear(webgl.COLOR_BUFFER_BIT);
        
                    
                    webgl.useProgram(PhongShaderProgram_getoxzwa);
                    webgl.uniformMatrix4fv(PhongShaderProgram_getoxzwa.cameraWorld, false, activeCamera.transform.world.matrix);
                    webgl.uniformMatrix4fv(PhongShaderProgram_getoxzwa.cameraModel, false, activeCamera.transform.model.matrix);
                    webgl.uniformMatrix4fv(PhongShaderProgram_getoxzwa.projection, false, activeCamera.projectionMatrix);
        
                    
        
                            webgl.uniformMatrix4fv(PhongShaderProgram_getoxzwa.world, false, geometry_uqjbna.transform.world.matrix);
                            webgl.uniformMatrix4fv(PhongShaderProgram_getoxzwa.model, false, geometry_uqjbna.transform.model.matrix);
        
                            webgl.bindBuffer(webgl.ARRAY_BUFFER, geometry_uqjbna.vertexs);
                            webgl.vertexAttribPointer(PhongShaderProgram_getoxzwa.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
                            
                            
                            
                            
                                webgl.bindBuffer(webgl.ARRAY_BUFFER, geometry_uqjbna.normals);
                                webgl.vertexAttribPointer(PhongShaderProgram_getoxzwa.vertexNormalAttribute, 3, webgl.FLOAT, false, 0, 0);
                            
        
                            
                                webgl.bindBuffer(webgl.ARRAY_BUFFER, geometry_uqjbna.uvs);
                                webgl.vertexAttribPointer(PhongShaderProgram_getoxzwa.vertexUVAttribute, 2, webgl.FLOAT, false, 0, 0);
                                webgl.activeTexture(webgl.TEXTURE0);
                                webgl.bindTexture(webgl.TEXTURE_2D, geometry_uqjbna.texture);
                            
        
                            
        
                            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, geometry_uqjbna.indexes);
                            webgl.drawElements(webgl.TRIANGLES, geometry_uqjbna.count, webgl.UNSIGNED_SHORT, 0);
        
                        
                
        
                    webgl.useProgram(PhongShaderProgram_qzqalfuj);
                    webgl.uniformMatrix4fv(PhongShaderProgram_qzqalfuj.cameraWorld, false, activeCamera.transform.world.matrix);
                    webgl.uniformMatrix4fv(PhongShaderProgram_qzqalfuj.cameraModel, false, activeCamera.transform.model.matrix);
                    webgl.uniformMatrix4fv(PhongShaderProgram_qzqalfuj.projection, false, activeCamera.projectionMatrix);
        
                    
        
                            webgl.uniformMatrix4fv(PhongShaderProgram_qzqalfuj.world, false, geometry_pbakcuh.transform.world.matrix);
                            webgl.uniformMatrix4fv(PhongShaderProgram_qzqalfuj.model, false, geometry_pbakcuh.transform.model.matrix);
        
                            webgl.bindBuffer(webgl.ARRAY_BUFFER, geometry_pbakcuh.vertexs);
                            webgl.vertexAttribPointer(PhongShaderProgram_qzqalfuj.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
                            
                            
                            
                            
                                webgl.bindBuffer(webgl.ARRAY_BUFFER, geometry_pbakcuh.normals);
                                webgl.vertexAttribPointer(PhongShaderProgram_qzqalfuj.vertexNormalAttribute, 3, webgl.FLOAT, false, 0, 0);
                            
        
                            
                                webgl.bindBuffer(webgl.ARRAY_BUFFER, geometry_pbakcuh.uvs);
                                webgl.vertexAttribPointer(PhongShaderProgram_qzqalfuj.vertexUVAttribute, 2, webgl.FLOAT, false, 0, 0);
                                webgl.activeTexture(webgl.TEXTURE0);
                                webgl.bindTexture(webgl.TEXTURE_2D, geometry_pbakcuh.texture);
                            
        
                            
                                webgl.activeTexture(webgl.TEXTURE1);
                                webgl.bindTexture(webgl.TEXTURE_2D, geometry_pbakcuh.specularmap);
                            
        
                            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, geometry_pbakcuh.indexes);
                            webgl.drawElements(webgl.TRIANGLES, geometry_pbakcuh.count, webgl.UNSIGNED_SHORT, 0);
        
                        
                
        
                }
                
            
        
                    const pressed_keys = {};
                    const world = { transform: { matrix: [
                        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                    ]}};
        
                    let prevXPosition = 0;
                    let prevYPosition = 0;
                    let isMousePressed = false;
        
                    canvas.addEventListener('mousedown', (event) => {
                        isMousePressed = event.button;
                        prevXPosition = event.x;
                        prevYPosition = event.y;
                    });
        
                    document.addEventListener('mouseup', (event) => {
                        isMousePressed = false;
                    });
        
                    document.addEventListener('keydown', (event) => {
                        if (event.repeat) {
                            return;
                        }
            
                        
        
                        pressed_keys[event.key] = true;
                    });
        
                    document.addEventListener('keyup', (event) => {
                        pressed_keys[event.key] = false;
                    });
        
                    /*
                    * Start event loop - WOrk on the delay to make it once every 16ms
                    */
                    const EventLoop = () => {
                        if (!Object.keys(pressed_keys).length) {
                            requestAnimationFrame(() => EventLoop());
                            return;
                        }
        
                        
                        
                        requestAnimationFrame(() => render());
                        requestAnimationFrame(() => EventLoop());
                    };
        
                    requestAnimationFrame(() => EventLoop());
        
                    canvas.addEventListener('mousemove', (event) => {
                        if (this.isMousePressed === false) {
                            return;
                        }
                    
                        const variables = {
                            delta_x: (event.x - prevXPosition) * 0.001,
                            delta_y: -(event.y - prevYPosition) * 0.001,
                            up: [0, 1, 0], right: [1, 0 , 0], back: [0, 0, 1],
                            button: isMousePressed
                        }
                    
                        
                            if (variables.button === 0) {
                                
                    camera_ofrekuzn.transform.model.x_angle += variables.delta_y * -1;
                    camera_ofrekuzn.transform.model.y_angle += variables.delta_x;
                    camera_ofrekuzn.transform.model.z_angle += 0;
                    camera_ofrekuzn.transform.model.isDirty = true;
                
                            }
                        
        
                            if (variables.button === 2) {
                                
                    camera_ofrekuzn.transform.world.translate[0] += variables.delta_x;
                    camera_ofrekuzn.transform.world.translate[1] += variables.delta_y;
                    camera_ofrekuzn.transform.world.translate[2] += 0;
                    camera_ofrekuzn.transform.world.isDirty = true;
                
                            }
                        
                    
                        prevXPosition = event.x;
                        prevYPosition = event.y;
                    });
        
                    document.addEventListener("mousewheel", (event) => {
                        const variables = {
                            delta_z: Math.max(-1, Math.min(1, (event.wheelDelta || -event.deltaY || -event.detail)))
                        }
        
                        
                    camera_ofrekuzn.transform.world.translate[0] += 0;
                    camera_ofrekuzn.transform.world.translate[1] += 0;
                    camera_ofrekuzn.transform.world.translate[2] += variables.delta_z;
                    camera_ofrekuzn.transform.world.isDirty = true;
                
                    });
        
                    
                        setInterval(() => { 
                            
                    geometry_pbakcuh.transform.model.x_angle += 0;
                    geometry_pbakcuh.transform.model.y_angle += 0.0008726650000000001;
                    geometry_pbakcuh.transform.model.z_angle += 0;
                    geometry_pbakcuh.transform.model.isDirty = true;
                
                        }, 16);
                    
        
                        setInterval(() => { 
                            
                    geometry_uqjbna.transform.model.x_angle += 0;
                    geometry_uqjbna.transform.model.y_angle += 0.0008726650000000001;
                    geometry_uqjbna.transform.model.z_angle += 0;
                    geometry_uqjbna.transform.model.isDirty = true;
                
                        }, 16);
                    
        
                    setInterval(() => {
        
                        
        
                            if (geometry_pbakcuh.transform.model.isDirty || geometry_pbakcuh.transform.world.isDirty) {
        
                                geometry_pbakcuh.transform.model.matrix = [
                                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                                ];
            
                                geometry_pbakcuh.transform.model.matrix = mat4.rotate(
                                    geometry_pbakcuh.transform.model.matrix, geometry_pbakcuh.transform.model.y_angle, [
                                    geometry_pbakcuh.transform.model.matrix[1], 
                                    geometry_pbakcuh.transform.model.matrix[5], 
                                    geometry_pbakcuh.transform.model.matrix[9]
                                ]);
                                geometry_pbakcuh.transform.model.matrix = mat4.rotate(
                                    geometry_pbakcuh.transform.model.matrix, geometry_pbakcuh.transform.model.x_angle, [
                                    geometry_pbakcuh.transform.model.matrix[0], 
                                    geometry_pbakcuh.transform.model.matrix[4], 
                                    geometry_pbakcuh.transform.model.matrix[8]
                                ]);
                                geometry_pbakcuh.transform.model.matrix = mat4.rotate(
                                    geometry_pbakcuh.transform.model.matrix, geometry_pbakcuh.transform.model.z_angle, [
                                    geometry_pbakcuh.transform.model.matrix[2], 
                                    geometry_pbakcuh.transform.model.matrix[6],
                                    geometry_pbakcuh.transform.model.matrix[10]
                                ]);
        
                                let right = vec3.multiplyScalar(vec3.normalize([
                                    geometry_pbakcuh.transform.model.matrix[0], geometry_pbakcuh.transform.model.matrix[4], geometry_pbakcuh.transform.model.matrix[8]
                                ]), geometry_pbakcuh.transform.model.translate[0]);
                            
                                let up = vec3.multiplyScalar(vec3.normalize([
                                    geometry_pbakcuh.transform.model.matrix[1], geometry_pbakcuh.transform.model.matrix[5], geometry_pbakcuh.transform.model.matrix[9]
                                ]), geometry_pbakcuh.transform.model.translate[1]);
                            
                                let back = vec3.multiplyScalar(vec3.normalize([
                                    geometry_pbakcuh.transform.model.matrix[2], geometry_pbakcuh.transform.model.matrix[6], geometry_pbakcuh.transform.model.matrix[10]
                                ]), geometry_pbakcuh.transform.model.translate[2]);
        
                                geometry_pbakcuh.transform.model.matrix[12] += right[0] + up[0] + back[0];
                                geometry_pbakcuh.transform.model.matrix[13] += right[1] + up[1] + back[1];
                                geometry_pbakcuh.transform.model.matrix[14] += right[2] + up[2] + back[2];
        
                                geometry_pbakcuh.transform.model.matrix = mat4.scale(
                                    geometry_pbakcuh.transform.model.matrix,
                                    [geometry_pbakcuh.transform.model.scale, geometry_pbakcuh.transform.model.scale, geometry_pbakcuh.transform.model.scale]
                                );
        
                                geometry_pbakcuh.transform.world.matrix = [
                                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                                ];
        
                                geometry_pbakcuh.transform.world.matrix = mat4.rotate(
                                    geometry_pbakcuh.transform.world.matrix, geometry_pbakcuh.transform.world.y_angle, [
                                    geometry_pbakcuh.transform.world.matrix[1], 
                                    geometry_pbakcuh.transform.world.matrix[5], 
                                    geometry_pbakcuh.transform.world.matrix[9]
                                ]);
                                geometry_pbakcuh.transform.world.matrix = mat4.rotate(
                                    geometry_pbakcuh.transform.world.matrix, geometry_pbakcuh.transform.world.x_angle, [
                                    geometry_pbakcuh.transform.world.matrix[0], 
                                    geometry_pbakcuh.transform.world.matrix[4], 
                                    geometry_pbakcuh.transform.world.matrix[8]
                                ]);
                                geometry_pbakcuh.transform.world.matrix = mat4.rotate(
                                    geometry_pbakcuh.transform.world.matrix, geometry_pbakcuh.transform.world.z_angle, [
                                    geometry_pbakcuh.transform.world.matrix[2], 
                                    geometry_pbakcuh.transform.world.matrix[6],
                                    geometry_pbakcuh.transform.world.matrix[10]
                                ]);
        
                                right = vec3.multiplyScalar(vec3.normalize([
                                    geometry_pbakcuh.transform.world.matrix[0], geometry_pbakcuh.transform.world.matrix[4], geometry_pbakcuh.transform.world.matrix[8]
                                ]), geometry_pbakcuh.transform.world.translate[0]);
                            
                                up = vec3.multiplyScalar(vec3.normalize([
                                    geometry_pbakcuh.transform.world.matrix[1], geometry_pbakcuh.transform.world.matrix[5], geometry_pbakcuh.transform.world.matrix[9]
                                ]), geometry_pbakcuh.transform.world.translate[1]);
                            
                                back = vec3.multiplyScalar(vec3.normalize([
                                    geometry_pbakcuh.transform.world.matrix[2], geometry_pbakcuh.transform.world.matrix[6], geometry_pbakcuh.transform.world.matrix[10]
                                ]), geometry_pbakcuh.transform.world.translate[2]);
        
                                geometry_pbakcuh.transform.world.matrix[12] += right[0] + up[0] + back[0];
                                geometry_pbakcuh.transform.world.matrix[13] += right[1] + up[1] + back[1];
                                geometry_pbakcuh.transform.world.matrix[14] += right[2] + up[2] + back[2];
        
                                geometry_pbakcuh.transform.world.matrix = mat4.scale(
                                    geometry_pbakcuh.transform.world.matrix,
                                    [geometry_pbakcuh.transform.world.scale, geometry_pbakcuh.transform.world.scale, geometry_pbakcuh.transform.world.scale]
                                );
        
                                geometry_pbakcuh.transform.model.isDirty = false;
                                geometry_pbakcuh.transform.world.isDirty = false;
                            }
        
                        
        
        
                            if (geometry_uqjbna.transform.model.isDirty || geometry_uqjbna.transform.world.isDirty) {
        
                                geometry_uqjbna.transform.model.matrix = [
                                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                                ];
            
                                geometry_uqjbna.transform.model.matrix = mat4.rotate(
                                    geometry_uqjbna.transform.model.matrix, geometry_uqjbna.transform.model.y_angle, [
                                    geometry_uqjbna.transform.model.matrix[1], 
                                    geometry_uqjbna.transform.model.matrix[5], 
                                    geometry_uqjbna.transform.model.matrix[9]
                                ]);
                                geometry_uqjbna.transform.model.matrix = mat4.rotate(
                                    geometry_uqjbna.transform.model.matrix, geometry_uqjbna.transform.model.x_angle, [
                                    geometry_uqjbna.transform.model.matrix[0], 
                                    geometry_uqjbna.transform.model.matrix[4], 
                                    geometry_uqjbna.transform.model.matrix[8]
                                ]);
                                geometry_uqjbna.transform.model.matrix = mat4.rotate(
                                    geometry_uqjbna.transform.model.matrix, geometry_uqjbna.transform.model.z_angle, [
                                    geometry_uqjbna.transform.model.matrix[2], 
                                    geometry_uqjbna.transform.model.matrix[6],
                                    geometry_uqjbna.transform.model.matrix[10]
                                ]);
        
                                let right = vec3.multiplyScalar(vec3.normalize([
                                    geometry_uqjbna.transform.model.matrix[0], geometry_uqjbna.transform.model.matrix[4], geometry_uqjbna.transform.model.matrix[8]
                                ]), geometry_uqjbna.transform.model.translate[0]);
                            
                                let up = vec3.multiplyScalar(vec3.normalize([
                                    geometry_uqjbna.transform.model.matrix[1], geometry_uqjbna.transform.model.matrix[5], geometry_uqjbna.transform.model.matrix[9]
                                ]), geometry_uqjbna.transform.model.translate[1]);
                            
                                let back = vec3.multiplyScalar(vec3.normalize([
                                    geometry_uqjbna.transform.model.matrix[2], geometry_uqjbna.transform.model.matrix[6], geometry_uqjbna.transform.model.matrix[10]
                                ]), geometry_uqjbna.transform.model.translate[2]);
        
                                geometry_uqjbna.transform.model.matrix[12] += right[0] + up[0] + back[0];
                                geometry_uqjbna.transform.model.matrix[13] += right[1] + up[1] + back[1];
                                geometry_uqjbna.transform.model.matrix[14] += right[2] + up[2] + back[2];
        
                                geometry_uqjbna.transform.model.matrix = mat4.scale(
                                    geometry_uqjbna.transform.model.matrix,
                                    [geometry_uqjbna.transform.model.scale, geometry_uqjbna.transform.model.scale, geometry_uqjbna.transform.model.scale]
                                );
        
                                geometry_uqjbna.transform.world.matrix = [
                                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                                ];
        
                                geometry_uqjbna.transform.world.matrix = mat4.rotate(
                                    geometry_uqjbna.transform.world.matrix, geometry_uqjbna.transform.world.y_angle, [
                                    geometry_uqjbna.transform.world.matrix[1], 
                                    geometry_uqjbna.transform.world.matrix[5], 
                                    geometry_uqjbna.transform.world.matrix[9]
                                ]);
                                geometry_uqjbna.transform.world.matrix = mat4.rotate(
                                    geometry_uqjbna.transform.world.matrix, geometry_uqjbna.transform.world.x_angle, [
                                    geometry_uqjbna.transform.world.matrix[0], 
                                    geometry_uqjbna.transform.world.matrix[4], 
                                    geometry_uqjbna.transform.world.matrix[8]
                                ]);
                                geometry_uqjbna.transform.world.matrix = mat4.rotate(
                                    geometry_uqjbna.transform.world.matrix, geometry_uqjbna.transform.world.z_angle, [
                                    geometry_uqjbna.transform.world.matrix[2], 
                                    geometry_uqjbna.transform.world.matrix[6],
                                    geometry_uqjbna.transform.world.matrix[10]
                                ]);
        
                                right = vec3.multiplyScalar(vec3.normalize([
                                    geometry_uqjbna.transform.world.matrix[0], geometry_uqjbna.transform.world.matrix[4], geometry_uqjbna.transform.world.matrix[8]
                                ]), geometry_uqjbna.transform.world.translate[0]);
                            
                                up = vec3.multiplyScalar(vec3.normalize([
                                    geometry_uqjbna.transform.world.matrix[1], geometry_uqjbna.transform.world.matrix[5], geometry_uqjbna.transform.world.matrix[9]
                                ]), geometry_uqjbna.transform.world.translate[1]);
                            
                                back = vec3.multiplyScalar(vec3.normalize([
                                    geometry_uqjbna.transform.world.matrix[2], geometry_uqjbna.transform.world.matrix[6], geometry_uqjbna.transform.world.matrix[10]
                                ]), geometry_uqjbna.transform.world.translate[2]);
        
                                geometry_uqjbna.transform.world.matrix[12] += right[0] + up[0] + back[0];
                                geometry_uqjbna.transform.world.matrix[13] += right[1] + up[1] + back[1];
                                geometry_uqjbna.transform.world.matrix[14] += right[2] + up[2] + back[2];
        
                                geometry_uqjbna.transform.world.matrix = mat4.scale(
                                    geometry_uqjbna.transform.world.matrix,
                                    [geometry_uqjbna.transform.world.scale, geometry_uqjbna.transform.world.scale, geometry_uqjbna.transform.world.scale]
                                );
        
                                geometry_uqjbna.transform.model.isDirty = false;
                                geometry_uqjbna.transform.world.isDirty = false;
                            }
        
                        
        
        
                            if (camera_ofrekuzn.transform.model.isDirty || camera_ofrekuzn.transform.world.isDirty) {
        
                                camera_ofrekuzn.transform.model.matrix = [
                                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                                ];
            
                                camera_ofrekuzn.transform.model.matrix = mat4.rotate(
                                    camera_ofrekuzn.transform.model.matrix, camera_ofrekuzn.transform.model.y_angle, [
                                    camera_ofrekuzn.transform.model.matrix[1], 
                                    camera_ofrekuzn.transform.model.matrix[5], 
                                    camera_ofrekuzn.transform.model.matrix[9]
                                ]);
                                camera_ofrekuzn.transform.model.matrix = mat4.rotate(
                                    camera_ofrekuzn.transform.model.matrix, camera_ofrekuzn.transform.model.x_angle, [
                                    camera_ofrekuzn.transform.model.matrix[0], 
                                    camera_ofrekuzn.transform.model.matrix[4], 
                                    camera_ofrekuzn.transform.model.matrix[8]
                                ]);
                                camera_ofrekuzn.transform.model.matrix = mat4.rotate(
                                    camera_ofrekuzn.transform.model.matrix, camera_ofrekuzn.transform.model.z_angle, [
                                    camera_ofrekuzn.transform.model.matrix[2], 
                                    camera_ofrekuzn.transform.model.matrix[6],
                                    camera_ofrekuzn.transform.model.matrix[10]
                                ]);
        
                                let right = vec3.multiplyScalar(vec3.normalize([
                                    camera_ofrekuzn.transform.model.matrix[0], camera_ofrekuzn.transform.model.matrix[4], camera_ofrekuzn.transform.model.matrix[8]
                                ]), camera_ofrekuzn.transform.model.translate[0]);
                            
                                let up = vec3.multiplyScalar(vec3.normalize([
                                    camera_ofrekuzn.transform.model.matrix[1], camera_ofrekuzn.transform.model.matrix[5], camera_ofrekuzn.transform.model.matrix[9]
                                ]), camera_ofrekuzn.transform.model.translate[1]);
                            
                                let back = vec3.multiplyScalar(vec3.normalize([
                                    camera_ofrekuzn.transform.model.matrix[2], camera_ofrekuzn.transform.model.matrix[6], camera_ofrekuzn.transform.model.matrix[10]
                                ]), camera_ofrekuzn.transform.model.translate[2]);
        
                                camera_ofrekuzn.transform.model.matrix[12] += right[0] + up[0] + back[0];
                                camera_ofrekuzn.transform.model.matrix[13] += right[1] + up[1] + back[1];
                                camera_ofrekuzn.transform.model.matrix[14] += right[2] + up[2] + back[2];
        
                                camera_ofrekuzn.transform.model.matrix = mat4.scale(
                                    camera_ofrekuzn.transform.model.matrix,
                                    [camera_ofrekuzn.transform.model.scale, camera_ofrekuzn.transform.model.scale, camera_ofrekuzn.transform.model.scale]
                                );
        
                                camera_ofrekuzn.transform.world.matrix = [
                                    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                                ];
        
                                camera_ofrekuzn.transform.world.matrix = mat4.rotate(
                                    camera_ofrekuzn.transform.world.matrix, camera_ofrekuzn.transform.world.y_angle, [
                                    camera_ofrekuzn.transform.world.matrix[1], 
                                    camera_ofrekuzn.transform.world.matrix[5], 
                                    camera_ofrekuzn.transform.world.matrix[9]
                                ]);
                                camera_ofrekuzn.transform.world.matrix = mat4.rotate(
                                    camera_ofrekuzn.transform.world.matrix, camera_ofrekuzn.transform.world.x_angle, [
                                    camera_ofrekuzn.transform.world.matrix[0], 
                                    camera_ofrekuzn.transform.world.matrix[4], 
                                    camera_ofrekuzn.transform.world.matrix[8]
                                ]);
                                camera_ofrekuzn.transform.world.matrix = mat4.rotate(
                                    camera_ofrekuzn.transform.world.matrix, camera_ofrekuzn.transform.world.z_angle, [
                                    camera_ofrekuzn.transform.world.matrix[2], 
                                    camera_ofrekuzn.transform.world.matrix[6],
                                    camera_ofrekuzn.transform.world.matrix[10]
                                ]);
        
                                right = vec3.multiplyScalar(vec3.normalize([
                                    camera_ofrekuzn.transform.world.matrix[0], camera_ofrekuzn.transform.world.matrix[4], camera_ofrekuzn.transform.world.matrix[8]
                                ]), camera_ofrekuzn.transform.world.translate[0]);
                            
                                up = vec3.multiplyScalar(vec3.normalize([
                                    camera_ofrekuzn.transform.world.matrix[1], camera_ofrekuzn.transform.world.matrix[5], camera_ofrekuzn.transform.world.matrix[9]
                                ]), camera_ofrekuzn.transform.world.translate[1]);
                            
                                back = vec3.multiplyScalar(vec3.normalize([
                                    camera_ofrekuzn.transform.world.matrix[2], camera_ofrekuzn.transform.world.matrix[6], camera_ofrekuzn.transform.world.matrix[10]
                                ]), camera_ofrekuzn.transform.world.translate[2]);
        
                                camera_ofrekuzn.transform.world.matrix[12] += right[0] + up[0] + back[0];
                                camera_ofrekuzn.transform.world.matrix[13] += right[1] + up[1] + back[1];
                                camera_ofrekuzn.transform.world.matrix[14] += right[2] + up[2] + back[2];
        
                                camera_ofrekuzn.transform.world.matrix = mat4.scale(
                                    camera_ofrekuzn.transform.world.matrix,
                                    [camera_ofrekuzn.transform.world.scale, camera_ofrekuzn.transform.world.scale, camera_ofrekuzn.transform.world.scale]
                                );
        
                                camera_ofrekuzn.transform.model.isDirty = false;
                                camera_ofrekuzn.transform.world.isDirty = false;
                            }
        
                        
        
                    }, 16);
                    
                
        
            /*
            *
            */
            function enableCamera (camera) {
                activeCamera = camera; 
            }
        
        }