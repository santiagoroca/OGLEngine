const Entity = require('./Entity');

module.exports = class Matrix extends Entity {

    defaults () {
        this.translate = [0, 0, 0];
        this.x_angle = 0;
        this.y_angle = 0;
        this.z_angle = 0;
        this.scale = 1.0;
        this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.isDirty = true;
    }

    translate (args) {
        args = { x: 0, y: 0, z: 0, space: 0, ...args,  }

        console.log(args);
        this.transform[args.space].translate = math.vec3.add(
            this.transform[args.space].translate, [args.x, args.y, args.z]
        );
    }

    scale (args) {
        args = { size: 1, space: 0, ...args, }
        this.transform[args.space].scale *= args.size;
    }

    rotate (args) {
        args = { x: 0, y: 0, z: 0, space: 0, ...args, }
        this.transform[args.space].x_angle += args.x;
        this.transform[args.space].y_angle += args.y;
        this.transform[args.space].z_angle += args.z;
    }

}