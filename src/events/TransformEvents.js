const generate_unique_hash = require('../runtime/helper.js').hash;

module.exports = {

    translate (object_id, args) {
        args = Object.assign({ x: 0, y: 0, z: 0 }, args);
        
        return `
            {
                const right = vec3.multiplyScalar(vec3.normalize([
                    ${object_id}.matrix[0], ${object_id}.matrix[4], ${object_id}.matrix[8]
                ]), ${args.x});
            
                const up = vec3.multiplyScalar(vec3.normalize([
                    ${object_id}.matrix[1], ${object_id}.matrix[5], ${object_id}.matrix[9]
                ]), ${args.y});
            
                const back = vec3.multiplyScalar(vec3.normalize([
                    ${object_id}.matrix[2], ${object_id}.matrix[6], ${object_id}.matrix[10]
                ]), ${args.z});

                ${object_id}.translate = vec3.add(${object_id}.translate, right);
                ${object_id}.translate = vec3.add(${object_id}.translate, up);
                ${object_id}.translate = vec3.add(${object_id}.translate, back);
                ${object_id}.isDirty = true;
            }
            
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