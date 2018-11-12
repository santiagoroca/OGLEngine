const fs = require("fs");
const parseOBJ = require("parse-obj")

parseOBJ(fs.createReadStream(process.argv[2]), function(err, mesh) {
    if(err) {
        throw new Error("Error parsing OBJ file: " + err)
    }

    console.log(JSON.stringify(Object.keys(mesh).map(
        key => ([key, mesh[key].length])
    )));

    fs.writeFileSync(process.argv[2].replace(/[^\.]+$/g, '') + 'json', JSON.stringify({
        vertexs: mesh.vertexPositions.reduce((a, b) => [...a, ...b], []),
        indexes: mesh.facePositions.reduce((a, b) => [...a, ...b], []),
        normals: mesh.vertexNormals.reduce((a, b) => [...a, ...b], []),
        uvs: mesh.vertexUVs.reduce((a, b) => [...a, ...b], []),
    }))
})