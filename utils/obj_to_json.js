const fs = require("fs");
const parseOBJ = require("parse-obj")

parseOBJ(fs.createReadStream(process.argv[2]), function(err, mesh) {
    if(err) {
        throw new Error("Error parsing OBJ file: " + err)
    }

    console.log(JSON.stringify(Object.keys(mesh).map(
        key => ([key, mesh[key].length])
    )));

    const vertices = [];
    const normals = [];
    const uvs = [];
    const faces = [];

    let index = 0;
    for (let i = 0; i < mesh.facePositions.length; i++) {
        const v_index = mesh.facePositions[i];
        const n_index = mesh.faceNormals[i];
        const uv_index = mesh.faceUVs[i];

        for (let j = 0; j < 3; j++) {
            Array.prototype.push.apply(vertices, mesh.vertexPositions[v_index[j]]);
            Array.prototype.push.apply(normals, mesh.vertexNormals[n_index[j]]);
            Array.prototype.push.apply(uvs, mesh.vertexUVs[uv_index[j]]);
            faces.push(i * 3 + j);
        }
    }

    fs.writeFileSync(process.argv[2].replace(/[^\.]+$/g, '') + 'json', JSON.stringify({
        vertexs: vertices,
        indexes: faces,
        normals: normals,
        uvs: uvs,
    }))
});