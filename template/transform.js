function Transform (transform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) {
    this.start_transform = transform;
    this.matrix = this.start_transform.slice();
    this.translation = [0, 0, 0];
    this.x_angle = 0;
    this.y_angle = 0;
    this.z_angle = 0;
    this.scale = 1.0;
}

Transform.prototype.translate = function (x, y, z) {

    const right = vec3.multiplyScalar(vec3.normalize([
        this.matrix[0], this.matrix[4], this.matrix[8]
    ]), x);

    const up = vec3.multiplyScalar(vec3.normalize([
        this.matrix[1], this.matrix[5], this.matrix[9]
    ]), y);

    const back = vec3.multiplyScalar(vec3.normalize([
        this.matrix[2], this.matrix[6], this.matrix[10]
    ]), z);

    this.translation = vec3.add(
        this.translation, 
        [x, y, z]
        //vec3.add(vec3.add(right, up), back)
    );

    this.calculateTransform();

}

Transform.prototype.rotate = function (x, y, z) {
    this.x_angle += x;
    this.y_angle += y;
    this.z_angle += z;
    this.calculateTransform();
}

Transform.prototype.calculateTransform = function () {
    this.matrix = this.start_transform.slice();

    this.matrix = mat4.translate(this.matrix, this.translation);

    this.matrix = mat4.rotate(this.matrix, this.y_angle, [
        this.matrix[1], this.matrix[5], this.matrix[9]
    ]);

    this.matrix = mat4.rotate(this.matrix, this.x_angle, [
        this.matrix[0], this.matrix[4], this.matrix[8]
    ]);

    this.matrix = mat4.rotate(this.matrix, this.z_angle, [
        this.matrix[2], this.matrix[6], this.matrix[10]
    ]);
    
}
