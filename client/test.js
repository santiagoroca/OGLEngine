function EventScheduler (canvas, update) {

    // Event attribute calculations
    this.isLeftMousePressed = false;
    this.prevXPosition = 0;
    this.prevYPosition = 0;

    // Schedules Lists
    this.drag_schedules = [];
    this.key_down_schedules = [];
    this.key_press_schedules = {};

    // Active Events List
    this.active_events = [];

    canvas.addEventListener('mousedown', (event) => {
        this.isLeftMouseButtonPressed = event.button;
        this.prevXPosition = event.x;
        this.prevYPosition = event.y;
    });
 
    document.addEventListener('mouseup', (event) => {
        this.isLeftMouseButtonPressed = false;
    });

    document.addEventListener('keydown', (event) => {
        if (event.repeat) {
            return;
        }

        this.active_events.push(event.key);
    });

    document.addEventListener('keyup', (event) => {
        this.active_events.splice(this.active_events.indexOf(event.key), 1);
    });

    canvas.addEventListener('mousemove', (event) => this.ondrag(event));
    document.addEventListener('keydown', (event) => this.keydown(event));

    /*
    * Start event loop - WOrk on the delay to make it once every 16ms
    */
    const EventLoop = () => {
        if (!this.active_events.length) {
            requestAnimationFrame(() => EventLoop());
            return;
        }

        for (const key of this.active_events) {
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
    if (isNaN(this.isLeftMouseButtonPressed)) {
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

    

            const v_buff_gbklumq = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_gbklumq);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                -1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1
            ]).buffer, webgl.STATIC_DRAW);

            const f_buff_gbklumq = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_gbklumq);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23
            ]).buffer, webgl.STATIC_DRAW);

            const geometry_dmxumwacn = {
                vertexs: v_buff_gbklumq,
                indexes: f_buff_gbklumq,
                count: 36,
                localTransform: [0.5,0,0,0,0,0.5,0,0,0,0,0.5,0,0,0,0,1],
                color: [1, 0, 0.9, 1]
            };
            geometries.push(geometry_dmxumwacn);

            
            eventScheduler.scheduleDrag((function (event) {
                if (event.button == 0) {
                    
            this.localTransform[12] += event.delta_x
            
            
        
                }
            }).bind(geometry_dmxumwacn));
        

            eventScheduler.scheduleDrag((function (event) {
                if (event.button == 2) {
                    
            
            this.localTransform[13] += event.delta_x
            
        
                }
            }).bind(geometry_dmxumwacn));
        

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
            let a00 = this.localTransform[0];
            let a01 = this.localTransform[1];
            let a02 = this.localTransform[2];
            let a03 = this.localTransform[3];
            let a10 = this.localTransform[4];
            let a11 = this.localTransform[5];
            let a12 = this.localTransform[6];
            let a13 = this.localTransform[7];
            let a20 = this.localTransform[8];
            let a21 = this.localTransform[9];
            let a22 = this.localTransform[10];
            let a23 = this.localTransform[11];

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
            this.localTransform[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.localTransform[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.localTransform[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.localTransform[3] = a03 * b00 + a13 * b01 + a23 * b02;
            this.localTransform[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.localTransform[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.localTransform[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.localTransform[7] = a03 * b10 + a13 * b11 + a23 * b12;
            this.localTransform[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.localTransform[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.localTransform[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.localTransform[11] = a03 * b20 + a13 * b21 + a23 * b22;

        
            }).bind(geometry_dmxumwacn), 16);
        

            eventScheduler.scheduleInterval((function (event) {
                

            let x = 1;
            let y = 0;
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

            
                    let s = 0.03489951165350108;
                    let c = 0.9993908264969952;
                    let t = 0.0006091735030048229;
                
            
            // TODO
            let a00 = this.localTransform[0];
            let a01 = this.localTransform[1];
            let a02 = this.localTransform[2];
            let a03 = this.localTransform[3];
            let a10 = this.localTransform[4];
            let a11 = this.localTransform[5];
            let a12 = this.localTransform[6];
            let a13 = this.localTransform[7];
            let a20 = this.localTransform[8];
            let a21 = this.localTransform[9];
            let a22 = this.localTransform[10];
            let a23 = this.localTransform[11];

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
            this.localTransform[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.localTransform[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.localTransform[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.localTransform[3] = a03 * b00 + a13 * b01 + a23 * b02;
            this.localTransform[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.localTransform[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.localTransform[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.localTransform[7] = a03 * b10 + a13 * b11 + a23 * b12;
            this.localTransform[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.localTransform[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.localTransform[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.localTransform[11] = a03 * b20 + a13 * b21 + a23 * b22;

        
            }).bind(geometry_dmxumwacn), 16);
        

            eventScheduler.scheduleInterval((function (event) {
                

            let x = 0;
            let y = 0;
            let z = 1;

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

            
                    let s = 0.05233597865236046;
                    let c = 0.9986295335801458;
                    let t = 0.001370466419854166;
                
            
            // TODO
            let a00 = this.localTransform[0];
            let a01 = this.localTransform[1];
            let a02 = this.localTransform[2];
            let a03 = this.localTransform[3];
            let a10 = this.localTransform[4];
            let a11 = this.localTransform[5];
            let a12 = this.localTransform[6];
            let a13 = this.localTransform[7];
            let a20 = this.localTransform[8];
            let a21 = this.localTransform[9];
            let a22 = this.localTransform[10];
            let a23 = this.localTransform[11];

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
            this.localTransform[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.localTransform[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.localTransform[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.localTransform[3] = a03 * b00 + a13 * b01 + a23 * b02;
            this.localTransform[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.localTransform[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.localTransform[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.localTransform[7] = a03 * b10 + a13 * b11 + a23 * b12;
            this.localTransform[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.localTransform[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.localTransform[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.localTransform[11] = a03 * b20 + a13 * b21 + a23 * b22;

        
            }).bind(geometry_dmxumwacn), 16);
        

        
            const v_buff_ohlqsbikh = webgl.createBuffer();
            webgl.bindBuffer(webgl.ARRAY_BUFFER, v_buff_ohlqsbikh);
            webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([
                
            ]).buffer, webgl.STATIC_DRAW);

            const f_buff_ohlqsbikh = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, f_buff_ohlqsbikh);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
                
            ]).buffer, webgl.STATIC_DRAW);

            geometries.push({
                vertexs: v_buff_ohlqsbikh,
                indexes: f_buff_ohlqsbikh,
                count: 0,
                localTransform: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1], 
                color: [0.5, 0.5, 0.5, 1.0]
            })
        
            const aspect = canvas.width / canvas.height;
            const b = 0.5773502691896257 * aspect;
            const h = b + b;
            const camera_miaqfve = {
                projectionMatrix: [
                    1 * 2 / h, 0,            0,                    0,
                    0,         1 * 2 / 1.1547005383792515, 0,                    0,
                    0,         0,            -11 / 9,           -1,
                    0,         0,            -(10 * 1 * 2) / 9, 0
                ],
                worldMatrix: [-0.9396930301180461,0,-0.3420190186927694,0,0,0.9999999999999999,0,0,0.3420190186927694,0,-0.9396930301180461,0,0,0,-5,1]
            };

            cameras.push(camera_miaqfve);
            enableCamera(camera_miaqfve);
        

    /*
    *
    */
    function updateMatrix () {
        webgl.uniformMatrix4fv(shaderProgram.uPMVMatrix, false, activeCamera.worldMatrix);
        requestAnimationFrame(() => render());
    }

    /*
    *
    */
    function enableCamera (camera) {
        activeCamera = camera;
        webgl.uniformMatrix4fv(shaderProgram.pMatrix, false, camera.projectionMatrix);
        webgl.uniformMatrix4fv(shaderProgram.uPMVMatrix, false, camera.worldMatrix);
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
            webgl.uniformMatrix4fv(shaderProgram.localTransform, false, geometry.localTransform);
            webgl.uniform4fv(shaderProgram.geometryColor, geometry.color);
            webgl.bindBuffer(webgl.ARRAY_BUFFER, geometry.vertexs);
            webgl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, webgl.FLOAT, false, 0, 0);
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, geometry.indexes);
            webgl.drawElements(webgl.TRIANGLES, geometry.count, webgl.UNSIGNED_SHORT, 0);
        }

    }

    requestAnimationFrame(() => render());

}


