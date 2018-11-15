const generate_unique_hash = require('../helper.js').hash;
const parseArg = arg => {
    if (!arg) {
        return 0;
    }

    if (isNaN(arg)) {
        return arg.replace(/\./, 'variables.');
    }

    return arg;
}

module.exports = {

    translate (args) {
        args = Object.assign({ x: 0, y: 0, z: 0, space: 0 }, args);
        
        return object_id => `
            ${object_id}.translate[0] += ${parseArg(args.x)};
            ${object_id}.translate[1] += ${parseArg(args.y)};
            ${object_id}.translate[2] += ${parseArg(args.z)};
            ${object_id}.isDirty = true;
        `;
    },

    scale (args) {
        args = Object.assign({x: 0, y: 0, z: 0, space: 0}, args);
        return () => ``;
    }, 

    rotate (args) {
        args = Object.assign({ x: 0, y: 0, z: 0, space: 0 }, args);
        
        return object_id => `
            ${object_id}.x_angle += ${parseArg(args.x)};
            ${object_id}.y_angle += ${parseArg(args.y)};
            ${object_id}.z_angle += ${parseArg(args.z)};
            ${object_id}.isDirty = true;
        `;
    }

}