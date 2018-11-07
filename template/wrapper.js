function Transformable (transform) {
    this.transform = transform;
}

function EventScheduler (canvas, update) {

    // Event attribute calculations
    this.isMousePressed = false;
    this.prevXPosition = 0;
    this.prevYPosition = 0;

    // Schedules Lists
    this.drag_schedules = [];
    this.key_down_schedules = [];
    this.key_press_schedules = {};

    // Active Events List
    this.active_events = {};

    canvas.addEventListener('mousedown', (event) => {
        this.isMousePressed = event.button;
        this.prevXPosition = event.x;
        this.prevYPosition = event.y;
    });
 
    document.addEventListener('mouseup', (event) => {
        this.isMousePressed = false;
    });

    document.addEventListener('keydown', (event) => {
        if (event.repeat) {
            return;
        }

        this.active_events[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        this.active_events[event.key] = false;
    });

    canvas.addEventListener('mousemove', (event) => this.ondrag(event));
    document.addEventListener('keydown', (event) => this.keydown(event));

    /*
    * Start event loop - WOrk on the delay to make it once every 16ms
    */
    const EventLoop = () => {
        const active_events = Object.keys(this.active_events)
            .filter(key => this.active_events[key]);

        if (!active_events.length) {
            requestAnimationFrame(() => EventLoop());
            return;
        }

        for (const key of active_events) {
            if (this.key_press_schedules[key]) {
                for (const schedule of this.key_press_schedules[key]) {
                    schedule();
                }
            }
        }
        
        requestAnimationFrame(() => this.update());
        requestAnimationFrame(() => EventLoop());
    };

    requestAnimationFrame(() => EventLoop());

    this.update = update;
}

EventScheduler.prototype.ondrag = function (event) {
    if (this.isMousePressed === false) {
        return;
    }

    const variables = {
        delta_x: (event.x - this.prevXPosition) * 0.001,
        delta_y: -(event.y - this.prevYPosition) * 0.001,
        up: [0, 1, 0], right: [1, 0 , 0], back: [0, 0, 1],
        button: this.isLeftMouseButtonPressed
    }

    for (const schedule of this.drag_schedules) {
        schedule(variables);
    }

    this.prevXPosition = event.x;
    this.prevYPosition = event.y;
    this.update();
}

EventScheduler.prototype.scheduleDrag = function (schedule) {
    this.drag_schedules.push(schedule);
}

EventScheduler.prototype.scheduleKeyPress = function (schedule, key) {
    if (!this.key_press_schedules[key]) {
        this.key_press_schedules[key] = [];
    }

    this.key_press_schedules[key].push(schedule);
}

EventScheduler.prototype.keydown = function (event) {
    const variables = {
        key: event.key
    }

    for (const schedule of this.key_down_schedules) {
        schedule(variables);
    }

    this.update();
}

EventScheduler.prototype.scheduleKeyDown = function (schedule) {
    this.key_down_schedules.push(schedule);
}

EventScheduler.prototype.scheduleInterval = function (schedule, timer) {
    setInterval(() => { schedule(); requestAnimationFrame(() => this.update()); }, timer);
}

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

    /*
    * Basic Shader Configuration
    */
    const fragment = `
        #extension GL_OES_standard_derivatives : enable
        precision highp float; 

        uniform vec4 geometryColor; 
        varying vec3 vPosition;
        
        vec3 normals(vec3 pos) { 
            vec3 fdx = dFdx(pos); 
            vec3 fdy = dFdy(pos); 
            return normalize(cross(fdx, fdy)); 
        }  

        void main() {
            vec3 normal = normalize(normals(vPosition)); 
            float attenuation = max(0.0, dot(normal, normalize(vec3(1.0, 0.5, 0.5))));
            gl_FragColor = max(
                geometryColor * vec4(attenuation, attenuation, attenuation, 1.0),
                geometryColor * vec4(0.4)
            );
        }
    `;

    const vertex = ` 
        attribute lowp vec3 aVertexPosition; 
        uniform mat4 localTransform; 
        uniform mat4 uPMVMatrix; 
        uniform mat4 pMatrix; 
        varying vec3 vPosition; 
        
        void main(void) {
            gl_Position = pMatrix * uPMVMatrix * localTransform * vec4(aVertexPosition, 1.0); 
            vPosition = vec4(pMatrix * uPMVMatrix * vec4(aVertexPosition, 1.0)).xyz; 
        }
    `;

    // Fragment 
    const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    webgl.shaderSource(fragmentShader, fragment);
    webgl.compileShader(fragmentShader);

    // Vertex
    const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vertexShader, vertex);
    webgl.compileShader(vertexShader);

    // Program
    const shaderProgram = webgl.createProgram();
    webgl.attachShader(shaderProgram, vertexShader);
    webgl.attachShader(shaderProgram, fragmentShader);
    webgl.linkProgram(shaderProgram);
    webgl.useProgram(shaderProgram);

    // Attributes and uniforms
    shaderProgram.vertexPositionAttribute = webgl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.uPMVMatrix = webgl.getUniformLocation(shaderProgram, "uPMVMatrix");
    shaderProgram.pMatrix = webgl.getUniformLocation(shaderProgram, 'pMatrix');
    shaderProgram.localTransform = webgl.getUniformLocation(shaderProgram, 'localTransform');
    shaderProgram.geometryColor = webgl.getUniformLocation(shaderProgram, 'geometryColor');
    webgl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    '%scene%'

    /*
    *
    */
    function updateMatrix () {
        webgl.uniformMatrix4fv(shaderProgram.uPMVMatrix, false, activeCamera.transform);
        requestAnimationFrame(() => render());
    }

    /*
    *
    */
    function enableCamera (camera) {
        activeCamera = camera;
        webgl.uniformMatrix4fv(shaderProgram.pMatrix, false, camera.projectionMatrix);
        webgl.uniformMatrix4fv(shaderProgram.uPMVMatrix, false, camera.transform);
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
            webgl.uniformMatrix4fv(shaderProgram.localTransform, false, geometry.transform);
            webgl.uniform4fv(shaderProgram.geometryColor, geometry.color);
            webgl.bindBuffer(webgl.ARRAY_BUFFER, geometry.vertexs);
            webgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, geometry.indexes);
            webgl.drawElements(webgl.TRIANGLES, geometry.count, webgl.UNSIGNED_SHORT, 0);
        }

    }

    requestAnimationFrame(() => render());

}

