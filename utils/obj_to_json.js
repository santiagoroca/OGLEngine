const fs = require("fs");
const parseOBJ = require("parse-obj")

parseOBJ(fs.createReadStream('./models/floor.obj'), function(err, mesh) {
    if(err) {
        throw new Error("Error parsing OBJ file: " + err)
    }

    fs.writeFileSync('./models/test.json', JSON.stringify({
        vertexs: mesh.vertexPositions.reduce((a, b) => [...a, ...b], []),
        indexes: mesh.facePositions.reduce((a, b) => [...a, ...b], []),
    }))
})