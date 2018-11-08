const fs = require("fs");
const parseOBJ = require("parse-obj")

module.exports = (url) => {
    return Promise((resolve, reject) => {
        parseOBJ(fs.createReadStream(url), function(err, mesh) {
            if(err) {
                throw new Error("Error parsing OBJ file: " + err)
            }
    
            resolve(mesh);
        })
    });
}
