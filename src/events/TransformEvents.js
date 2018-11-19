const generate_unique_hash = require('../runtime/helper.js').hash;

module.exports = {

    translate (object_id, args) {
        args = Object.assign({ x: 0, y: 0, z: 0 }, args);
        
        return `
            ${object_id}.translate[0] += ${args.x};
            ${object_id}.translate[1] += ${args.y};
            ${object_id}.translate[2] += ${args.z};
            ${object_id}.isDirty = true;
        `;
    },

    scale (args) {
        args = Object.assign({x: 0, y: 0, z: 0 }, args);
        return ``;
    }, 

    rotate (object_id, args) {
        args = Object.assign({ x: 0, y: 0, z: 0 }, args);
        
        return `
            ${object_id}.x_angle += ${args.x};
            ${object_id}.y_angle += ${args.y};
            ${object_id}.z_angle += ${args.z};
            ${object_id}.isDirty = true;
        `;
    }

}