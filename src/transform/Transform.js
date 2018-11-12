const math = require('../math.js');

module.exports = class Transform {

    constructor () {
        this.transform = math.mat4.identity();
        this._translate = [0, 0, 0];
        this._x_angle = 0;
        this._y_angle = 0;
        this._z_angle = 0;
        this._scale = 1.0;
    }

    translate (args) {

        /*const right = math.vec3.multiplyScalar(math.vec3.normalize([
            this.transform[0], this.transform[4], this.transform[8]
        ]), args.x);
    
        const up = math.vec3.multiplyScalar(math.vec3.normalize([
            this.transform[1], this.transform[5], this.transform[9]
        ]), args.y);
    
        const back = math.vec3.multiplyScalar(vec3.normalize([
            this.transform[2], this.transform[6], this.transform[10]
        ]), args.z);*/
    
        this._translate = math.vec3.add(
            this._translate, [args.x, args.y, args.z]
            //vec3.add(vec3.add(right, up), back)
        );

    }

    scale (args) {
        return;
    }

    rotate (args) {
        this._x_angle += args.x;
        this._y_angle += args.y;
        this._z_angle += args.z;
    }

    apply (transformation) {

        if (typeof transformation._translate[0] == 'number' && !isNaN(transformation._translate[0])) {
            this._translate[0] += transformation._translate[0];
        }

        if (typeof transformation._translate[1] == 'number' && !isNaN(transformation._translate[1])) {
            this._translate[1] += transformation._translate[1];
        }

        if (typeof transformation._translate[2] == 'number' && !isNaN(transformation._translate[2])) {
            this._translate[2] += transformation._translate[2];
        }

        if (typeof transformation._x_angle == 'number' && !isNaN(transformation._x_angle)) {
            this._x_angle += transformation._x_angle;
        }

        if (typeof transformation._y_angle == 'number' && !isNaN(transformation._y_angle)) {
            this._y_angle += transformation._y_angle;
        }

        if (typeof transformation._z_angle == 'number' && !isNaN(transformation._z_angle)) {
            this._z_angle += transformation._z_angle;
        }

        if (typeof transformation._scale == 'number' && !isNaN(transformation._scale)) {
            this._scale += transformation._scale;
        }
        
    }

    transformVertices (vertices) {
        let transform = math.mat4.identity();

        transform = math.mat4.translate(transform, this._translate);
        transform = math.mat4.rotate(transform, this._y_angle, [transform[1], transform[5], transform[9]]);
        transform = math.mat4.rotate(transform, this._x_angle, [transform[0], transform[4], transform[8]]);
        transform = math.mat4.rotate(transform, this._z_angle, [transform[2], transform[6], transform[10]]);

        for (let i = 0; i < vertices.length; i += 3) {
            let x = vertices[i];
            let y = vertices[i + 1];
            let z = vertices[i + 2];

            vertices[i] = x * transform[0] + y * transform[4] + z * transform[8] + transform[12];
            vertices[i + 1] = x * transform[1] + y * transform[5] + z * transform[9] + transform[13];
            vertices[i + 2] = x * transform[2] + y * transform[6] + z * transform[10] + transform[14];
        }

    }

}