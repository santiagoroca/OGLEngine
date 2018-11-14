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
                `${object_id}.model`,
                `${object_id}.world`
            ][args.space];

            return `

                right = vec3.multiplyScalar(vec3.normalize([
                    ${object_id}.matrix[0], ${object_id}.matrix[4], ${object_id}.matrix[8]
                ]), ${parseArg(args.x)});
            
                up = vec3.multiplyScalar(vec3.normalize([
                    ${object_id}.matrix[1], ${object_id}.matrix[5], ${object_id}.matrix[9]
                ]), ${parseArg(args.y)});
            
                back = vec3.multiplyScalar(vec3.normalize([
                    ${object_id}.matrix[2], ${object_id}.matrix[6], ${object_id}.matrix[10]
                ]), ${parseArg(args.z)});
            
                ${space}.translate[0] += right[0] + up[0] + back[0];
                ${space}.translate[1] += right[1] + up[1] + back[1];
                ${space}.translate[2] += right[2] + up[2] + back[2];
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
                `${object_id}.model`,
                `${object_id}.world`
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