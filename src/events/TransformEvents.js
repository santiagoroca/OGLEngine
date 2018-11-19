const generate_unique_hash = require('../runtime/helper.js').hash;

module.exports = {

    translate (get, object_id, args) {
        args = Object.assign({ x: 0, y: 0, z: 0, space: 0 }, args);
        
        return `
            ${object_id}.translate[0] += ${get(args.x)};
            ${object_id}.translate[1] += ${get(args.y)};
            ${object_id}.translate[2] += ${get(args.z)};
            ${object_id}.isDirty = true;
        `;
    },

    scale (args) {
        args = Object.assign({x: 0, y: 0, z: 0, space: 0}, args);
        return ``;
    }, 

    rotate (get, object_id, args) {
        args = Object.assign({ x: 0, y: 0, z: 0, space: 0 }, args);
        
        return `
            ${object_id}.x_angle += ${get(args.x)};
            ${object_id}.y_angle += ${get(args.y)};
            ${object_id}.z_angle += ${get(args.z)};
            ${object_id}.isDirty = true;
        `;
    }

}