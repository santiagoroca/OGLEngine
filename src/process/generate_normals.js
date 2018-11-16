const math = require('../math');

module.exports = (vertexs, indexes) => {
    const normals = [];

    for (var i = 0; i < vertexs.length; i++) {
        normals[i] = 0;
    }

    for (var i = 0; i < indexes.length; i += 3) {

        //Point A
        var e1 = [
            vertexs [indexes[i] * 3],
            vertexs [indexes[i] * 3 + 1],
            vertexs [indexes[i] * 3 + 2]
        ];

        //Point B
        var e2 = [
            vertexs [indexes[i + 1] * 3],
            vertexs [indexes[i + 1] * 3 + 1],
            vertexs [indexes[i + 1] * 3 + 2]
        ];

        //Point C
        var e3 = [
            vertexs [indexes[i + 2] * 3],
            vertexs [indexes[i + 2] * 3 + 1],
            vertexs [indexes[i + 2] * 3 + 2]
        ];

        var n = math.vec3.cross(math.vec3.subtract(e2, e1), math.vec3.subtract(e3, e1));

        normals [indexes[i] * 3] += n [0];
        normals [indexes[i] * 3 + 1] += n [1];
        normals [indexes[i] * 3 + 2] += n [2];

        normals [indexes[i + 1] * 3] += n [0];
        normals [indexes[i + 1] * 3 + 1] += n [1];
        normals [indexes[i + 1] * 3 + 2] += n [2];

        normals [indexes[i + 2] * 3] += n [0];
        normals [indexes[i + 2] * 3 + 1] += n [1];
        normals [indexes[i + 2] * 3 + 2] += n [2];

    }

    for (var i = 0; i < normals.length; i += 3) {
        var length = Math.sqrt(
            normals [i] * normals [i] + 
            normals [i + 1] * normals [i + 1] + 
            normals [i + 2] * normals [i + 2]
        );

        normals [i] /= length || 1;
        normals [i + 1] /= length || 1;
        normals [i + 2] /= length || 1;
    }

    return normals;
}