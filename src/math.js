module.exports = {

    mat4: {
        identity: () => [
            1.0, 0.0, 0.0, 0.0, 
            0.0, 1.0, 0.0, 0.0, 
            0.0, 0.0, 1.0, 0.0, 
            0.0, 0.0, 0.0, 1.0
        ]
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
        }

    }

}