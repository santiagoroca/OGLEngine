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

    

            const v_buff_yhuxshp = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_yhuxshp);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                -1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1
            ]).buffer, webgl.STATIC_DRAW);

            const f_buff_yhuxshp = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_yhuxshp);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23
            ]).buffer, webgl.STATIC_DRAW);

            const geometry_mzlhkvb = Object.assign({
                vertexs: v_buff_yhuxshp,
                indexes: f_buff_yhuxshp,
                count: 36,
                color: [1, 0, 0.9, 1],
                transform: [0.5,0,0,0,0,0.5,0,0,0,0,0.5,0,0,0,0,1]
            });
            geometries.push(geometry_mzlhkvb);

            
            eventScheduler.scheduleInterval((function (event) {
                

            let x = 0;
            let y = 1;
            let z = 0;

            // Compute the length of the rotation vector
            let len = Math.sqrt(x*x + y*y + z*z);

            // If it is equal o less than zero, exit
            if (len <= 0.0) {
                return;
            }

            // Normalize the vector
            len = 1.0 / len;
            x *= len;
            y *= len;
            z *= len;

            
                    let s = -0.01745241391620097;
                    let c = 0.9998476950258463;
                    let t = 0.00015230497415374966;
                
            
            // TODO
            let a00 = this.transform[0];
            let a01 = this.transform[1];
            let a02 = this.transform[2];
            let a03 = this.transform[3];
            let a10 = this.transform[4];
            let a11 = this.transform[5];
            let a12 = this.transform[6];
            let a13 = this.transform[7];
            let a20 = this.transform[8];
            let a21 = this.transform[9];
            let a22 = this.transform[10];
            let a23 = this.transform[11];

            //TODO
            let b00 = x * x * t + c;
            let b01 = y * x * t + z * s;
            let b02 = z * x * t - y * s;
            let b10 = x * y * t - z * s;
            let b11 = y * y * t + c;
            let b12 = z * y * t + x * s;
            let b20 = x * z * t + y * s;
            let b21 = y * z * t - x * s;
            let b22 = z * z * t + c;

            // TODO
            this.transform[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.transform[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.transform[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.transform[3] = a03 * b00 + a13 * b01 + a23 * b02;
            this.transform[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.transform[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.transform[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.transform[7] = a03 * b10 + a13 * b11 + a23 * b12;
            this.transform[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.transform[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.transform[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.transform[11] = a03 * b20 + a13 * b21 + a23 * b22;

        
            }).bind(geometry_mzlhkvb), 16);
        

        

            const v_buff_zziqqld = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_zziqqld);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                -1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1
            ]).buffer, webgl.STATIC_DRAW);

            const f_buff_zziqqld = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_zziqqld);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23
            ]).buffer, webgl.STATIC_DRAW);

            const geometry_vckxdniviy = Object.assign({
                vertexs: v_buff_zziqqld,
                indexes: f_buff_zziqqld,
                count: 36,
                color: [1, 1, 0.9, 1],
                transform: [0.5,0,0,0,0,0.5,0,0,0,0,0.5,0,-2,0,0,1]
            });
            geometries.push(geometry_vckxdniviy);

            
            eventScheduler.scheduleInterval((function (event) {
                

            let x = 0;
            let y = 1;
            let z = 0;

            // Compute the length of the rotation vector
            let len = Math.sqrt(x*x + y*y + z*z);

            // If it is equal o less than zero, exit
            if (len <= 0.0) {
                return;
            }

            // Normalize the vector
            len = 1.0 / len;
            x *= len;
            y *= len;
            z *= len;

            
                    let s = 0.01745241391620097;
                    let c = 0.9998476950258463;
                    let t = 0.00015230497415374966;
                
            
            // TODO
            let a00 = this.transform[0];
            let a01 = this.transform[1];
            let a02 = this.transform[2];
            let a03 = this.transform[3];
            let a10 = this.transform[4];
            let a11 = this.transform[5];
            let a12 = this.transform[6];
            let a13 = this.transform[7];
            let a20 = this.transform[8];
            let a21 = this.transform[9];
            let a22 = this.transform[10];
            let a23 = this.transform[11];

            //TODO
            let b00 = x * x * t + c;
            let b01 = y * x * t + z * s;
            let b02 = z * x * t - y * s;
            let b10 = x * y * t - z * s;
            let b11 = y * y * t + c;
            let b12 = z * y * t + x * s;
            let b20 = x * z * t + y * s;
            let b21 = y * z * t - x * s;
            let b22 = z * z * t + c;

            // TODO
            this.transform[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.transform[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.transform[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.transform[3] = a03 * b00 + a13 * b01 + a23 * b02;
            this.transform[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.transform[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.transform[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.transform[7] = a03 * b10 + a13 * b11 + a23 * b12;
            this.transform[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.transform[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.transform[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.transform[11] = a03 * b20 + a13 * b21 + a23 * b22;

        
            }).bind(geometry_vckxdniviy), 16);
        

        
            const v_buff_popostie = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_popostie);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                
            ]).buffer, webgl.STATIC_DRAW);

            const f_buff_popostie = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_popostie);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                
            ]).buffer, webgl.STATIC_DRAW);

            geometries.push({
                vertexs: v_buff_popostie,
                indexes: f_buff_popostie,
                count: 0,
                transform: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1], 
                color: [0.5, 0.5, 0.5, 1.0]
            })
        
            const aspect = canvas.width / canvas.height;
            const b = 0.5773502691896257 * aspect;
            const h = b + b;
            const camera_rhmd = {
                projectionMatrix: [
                    1 * 2 / h, 0,            0,                    0,
                    0,         1 * 2 / 1.1547005383792515, 0,                    0,
                    0,         0,            -11 / 9.9,           -1,
                    0,         0,            -(10 * 1 * 2) / 9.9, 0
                ],
                transform: [-0.9396930301180461,0,-0.3420190186927694,0,0,0.9999999999999999,0,0,0.3420190186927694,0,-0.9396930301180461,0,0,0,-5,1]
            };

            cameras.push(camera_rhmd);
            enableCamera(camera_rhmd);
            
            eventScheduler.scheduleKeyPress((function (event) {
                
            this.transform[12] += 0.1
            
            
        
            }).bind(camera_rhmd), 'a');
        

            eventScheduler.scheduleKeyPress((function (event) {
                
            this.transform[12] += -0.1
            
            
        
            }).bind(camera_rhmd), 'd');
        

            eventScheduler.scheduleKeyPress((function (event) {
                
            
            
            this.transform[14] += 0.1
        
            }).bind(camera_rhmd), 'w');
        

            eventScheduler.scheduleKeyPress((function (event) {
                
            
            
            this.transform[14] += -0.1
        
            }).bind(camera_rhmd), 's');
        
        

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


