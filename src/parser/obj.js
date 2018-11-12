const fs = require("fs");
const parseOBJ = require("parse-obj")

module.exports = (url) => {
    const file = fs.readFileSync(url).toString();
    const v = [];
    const vn = [];
    const vt = [];
    const f = [];
    const fn = [];
    const ft = [];
    const lines = file.split(/[\n\r]/g);
    
    for (const line of lines) {
        const toks = line.split(" ");

        if(line.length === 0 || line.charAt(0) === "#") {
            continue;
        }

        switch(toks[0]) {

            case "v":
                if(toks.length < 3) {
                    throw new Error("parse-obj: Invalid vertex")
                }
                v.push([+toks[1], +toks[2], +toks[3]])
            break
    
            case "vn":
                if(toks.length < 3) {
                    throw new Error("parse-obj: Invalid vertex normal")
                }
                vn.push([+toks[1], +toks[2], +toks[3]])
            break
    
            case "vt":
                if(toks.length < 2) {
                    throw new Error("parse-obj: Invalid vertex texture coord")
                }
                vt.push([+toks[1], +toks[2]])
            break
    
            case "f":
                const position = new Array(toks.length - 1);
                const normal = new Array(toks.length - 1);
                const texCoord = new Array(toks.length - 1);
    
                for(let i = 1; i < toks.length; ++i) {
                    const indices = toks[i].split("/");
                    position[i-1] = (indices[0]|0)-1;
                    texCoord[i-1] = indices[1] ? (indices[1]|0)-1 : -1;
                    normal[i-1] = indices[2] ? (indices[2]|0)-1 : -1;
                }
    
                f.push(position);
                fn.push(normal);
                ft.push(texCoord);
            break
    
            // Ignored for now
            case "vp":
            case "s":
            case "o":
            case "g":
            case "usemtl":
            case "mtllib":
                break
    
            default:
                throw new Error("parse-obj: Unrecognized directive: '" + toks[0] + "'")
        }
    }

    const vertices = [];
    const normals = [];
    const uvs = [];
    const faces = [];

    let index = 0;
    for (let i = 0; i < f.length; i++) {
        const v_index = f[i];
        const n_index = fn[i];
        const uv_index = ft[i];

        for (let j = 0; j < 3; j++) {
            Array.prototype.push.apply(vertices, v[v_index[j]]);
            Array.prototype.push.apply(normals, vn[n_index[j]]);
            Array.prototype.push.apply(uvs, vt[uv_index[j]]);
            faces.push(i * 3 + j);
        }
    }

    return {
        vertexs: vertices,
        indexes: faces,
        normals: normals,
        uvs: uvs,
    };
}
