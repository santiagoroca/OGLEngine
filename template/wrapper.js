function viewer (container) {

    /*
    * Canvas Configuration
    */
    const canvas = document.createElement('canvas');
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    /*
    * WebGL Context Configuration
    */
    const webgl = canvas.getContext("webgl");
    webgl.viewport(0, 0, container.clientWidth, container.clientHeight);
    webgl.clearColor(0.0, 0.0, 0.0, 0.0);
    webgl.getExtension('OES_standard_derivatives');
    webgl.enable(webgl.DEPTH_TEST);

    /*
    * Geometries COnfiguration
    */
    const geometries = [];

    /*
    * Events Configuration
    */
    const eventScheduler = new EventScheduler(canvas, updateMatrix);

    /*
    * There are multiple cameras but only one active
    */
    const cameras = [];
    let activeCamera = null;

    '%scene%'

    /*
    *
    */
    function updateMatrix () {
        webgl.uniformMatrix4fv(PhongShaderProgram.uPMVMatrix, false, activeCamera.transform.matrix);
        requestAnimationFrame(() => render());
    }

    /*
    *
    */
    function enableCamera (camera) {
        activeCamera = camera;
        webgl.uniformMatrix4fv(PhongShaderProgram.pMatrix, false, camera.projectionMatrix);
        webgl.uniformMatrix4fv(PhongShaderProgram.uPMVMatrix, false, camera.transform.matrix);
        requestAnimationFrame(() => render());
    }

    /*
    * Render Geometry Objectsl
    * TODO Remember to implement isDirty pattern
    */
    function render () {
        
        webgl.clear(webgl.DEPTH_BUFFER_BIT);
        webgl.clear(webgl.COLOR_BUFFER_BIT);

        for (const geometry of geometries) {
            webgl.uniformMatrix4fv(PhongShaderProgram.localTransform, false, geometry.transform.matrix);
            webgl.uniform4fv(PhongShaderProgram.geometryColor, geometry.color);
            webgl.bindBuffer(webgl.ARRAY_BUFFER, geometry.vertexs);
            webgl.vertexAttribPointer(PhongShaderProgram.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, geometry.indexes);
            webgl.drawElements(webgl.TRIANGLES, geometry.count, webgl.UNSIGNED_SHORT, 0);
        }

    }

    requestAnimationFrame(() => render());

}

