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

    TranslateEvent (args) {
        args = Object.assign({ x: 0, y: 0, z: 0, space: 0 }, args);
        
        return object_id => {
            const space = [
                `${object_id}.transform.model`,
                `${object_id}.transform.world`
            ][args.space];

            return `
                ${space}.translate[0] += ${parseArg(args.x)};
                ${space}.translate[1] += ${parseArg(args.y)};
                ${space}.translate[2] += ${parseArg(args.z)};
                ${space}.isDirty = true;
            `;
        };
    },

    ScaleEvent (args) {
        args = Object.assign({x: 0, y: 0, z: 0, space: 0}, args);
        return () => ``;
    }, 

    RotateEvent (args) {
        args = Object.assign({ x: 0, y: 0, z: 0, space: 0 }, args);
        

        return object_id => {
            const space = [
                `${object_id}.transform.model`,
                `${object_id}.transform.world`
            ][args.space];

            return `
                ${space}.x_angle += ${parseArg(args.x)};
                ${space}.y_angle += ${parseArg(args.y)};
                ${space}.z_angle += ${parseArg(args.z)};
                ${space}.isDirty = true;
            `;
        }
    }

}