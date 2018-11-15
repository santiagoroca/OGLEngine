module.exports = class Events {

    constructor () {
        this.dynamics = [];
        this.events = {
            drag: [], keypress: [],
            keydown: [], interval: [], 
            mousewheel: [] 
        };
    }

    addEvents (events, object_id) {
        for (const event of events) {
            this.events [event.type].push(event);
        }

        this.dynamics.push(object_id);
    }

    toString () {
        return `

            const pressed_keys = {};
            const world = { transform: { matrix: [
                1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
            ]}};

            let prevXPosition = 0;
            let prevYPosition = 0;
            let isMousePressed = false;

            canvas.addEventListener('mousedown', (event) => {
                isMousePressed = event.button;
                prevXPosition = event.x;
                prevYPosition = event.y;
            });

            document.addEventListener('mouseup', (event) => {
                isMousePressed = false;
            });

            document.addEventListener('keydown', (event) => {
                if (event.repeat) {
                    return;
                }
    
                ${this.events.keydown.map(event => `
                    if (pressed_keys["${event.key}"]) {
                        ${event.hndl}
                    }
                `).join('\n')}

                pressed_keys[event.key] = true;
            });

            document.addEventListener('keyup', (event) => {
                pressed_keys[event.key] = false;
            });

            /*
            * Start event loop - WOrk on the delay to make it once every 16ms
            */
            const EventLoop = () => {
                if (!Object.keys(pressed_keys).length) {
                    requestAnimationFrame(() => EventLoop());
                    return;
                }

                ${this.events.keypress.map(event => `
                    if (pressed_keys["${event.key}"]) {
                        ${event.hndl}
                    }
                `).join('\n')}
                
                requestAnimationFrame(() => render());
                requestAnimationFrame(() => EventLoop());
            };

            requestAnimationFrame(() => EventLoop());

            canvas.addEventListener('mousemove', (event) => {
                if (this.isMousePressed === false) {
                    return;
                }
            
                const variables = {
                    delta_x: (event.x - prevXPosition) * 0.001,
                    delta_y: -(event.y - prevYPosition) * 0.001,
                    up: [0, 1, 0], right: [1, 0 , 0], back: [0, 0, 1],
                    button: isMousePressed
                }
            
                ${this.events.drag.map(event => `
                    if (variables.button === ${event.btn}) {
                        ${event.hndl}
                    }
                `).join('\n')}
            
                prevXPosition = event.x;
                prevYPosition = event.y;
            });

            document.addEventListener("mousewheel", (event) => {
                const variables = {
                    delta_z: Math.max(-1, Math.min(1, (event.wheelDelta || -event.deltaY || -event.detail)))
                }

                ${this.events.mousewheel.map(event => event.hndl).join('\n')}
            });

            ${this.events.interval.map(event => `
                setInterval(() => { 
                    ${event.hndl}
                }, ${event.every});
            `).join('\n')}

            setInterval(() => {

                ${this.dynamics.map(object_id => `

                    if (${object_id}.transform.model.isDirty || ${object_id}.transform.world.isDirty) {

                        ${object_id}.transform.model.matrix = [
                            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                        ];
    
                        ${object_id}.transform.model.matrix = mat4.rotate(
                            ${object_id}.transform.model.matrix, ${object_id}.transform.model.y_angle, [
                            ${object_id}.transform.model.matrix[1], 
                            ${object_id}.transform.model.matrix[5], 
                            ${object_id}.transform.model.matrix[9]
                        ]);
                        ${object_id}.transform.model.matrix = mat4.rotate(
                            ${object_id}.transform.model.matrix, ${object_id}.transform.model.x_angle, [
                            ${object_id}.transform.model.matrix[0], 
                            ${object_id}.transform.model.matrix[4], 
                            ${object_id}.transform.model.matrix[8]
                        ]);
                        ${object_id}.transform.model.matrix = mat4.rotate(
                            ${object_id}.transform.model.matrix, ${object_id}.transform.model.z_angle, [
                            ${object_id}.transform.model.matrix[2], 
                            ${object_id}.transform.model.matrix[6],
                            ${object_id}.transform.model.matrix[10]
                        ]);

                        let right = vec3.multiplyScalar(vec3.normalize([
                            ${object_id}.transform.model.matrix[0], ${object_id}.transform.model.matrix[4], ${object_id}.transform.model.matrix[8]
                        ]), ${object_id}.transform.model.translate[0]);
                    
                        let up = vec3.multiplyScalar(vec3.normalize([
                            ${object_id}.transform.model.matrix[1], ${object_id}.transform.model.matrix[5], ${object_id}.transform.model.matrix[9]
                        ]), ${object_id}.transform.model.translate[1]);
                    
                        let back = vec3.multiplyScalar(vec3.normalize([
                            ${object_id}.transform.model.matrix[2], ${object_id}.transform.model.matrix[6], ${object_id}.transform.model.matrix[10]
                        ]), ${object_id}.transform.model.translate[2]);

                        ${object_id}.transform.model.matrix[12] += right[0] + up[0] + back[0];
                        ${object_id}.transform.model.matrix[13] += right[1] + up[1] + back[1];
                        ${object_id}.transform.model.matrix[14] += right[2] + up[2] + back[2];

                        ${object_id}.transform.model.matrix = mat4.scale(
                            ${object_id}.transform.model.matrix,
                            [${object_id}.transform.model.scale, ${object_id}.transform.model.scale, ${object_id}.transform.model.scale]
                        );

                        ${object_id}.transform.world.matrix = [
                            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                        ];

                        ${object_id}.transform.world.matrix = mat4.rotate(
                            ${object_id}.transform.world.matrix, ${object_id}.transform.world.y_angle, [
                            ${object_id}.transform.world.matrix[1], 
                            ${object_id}.transform.world.matrix[5], 
                            ${object_id}.transform.world.matrix[9]
                        ]);
                        ${object_id}.transform.world.matrix = mat4.rotate(
                            ${object_id}.transform.world.matrix, ${object_id}.transform.world.x_angle, [
                            ${object_id}.transform.world.matrix[0], 
                            ${object_id}.transform.world.matrix[4], 
                            ${object_id}.transform.world.matrix[8]
                        ]);
                        ${object_id}.transform.world.matrix = mat4.rotate(
                            ${object_id}.transform.world.matrix, ${object_id}.transform.world.z_angle, [
                            ${object_id}.transform.world.matrix[2], 
                            ${object_id}.transform.world.matrix[6],
                            ${object_id}.transform.world.matrix[10]
                        ]);

                        right = vec3.multiplyScalar(vec3.normalize([
                            ${object_id}.transform.world.matrix[0], ${object_id}.transform.world.matrix[4], ${object_id}.transform.world.matrix[8]
                        ]), ${object_id}.transform.world.translate[0]);
                    
                        up = vec3.multiplyScalar(vec3.normalize([
                            ${object_id}.transform.world.matrix[1], ${object_id}.transform.world.matrix[5], ${object_id}.transform.world.matrix[9]
                        ]), ${object_id}.transform.world.translate[1]);
                    
                        back = vec3.multiplyScalar(vec3.normalize([
                            ${object_id}.transform.world.matrix[2], ${object_id}.transform.world.matrix[6], ${object_id}.transform.world.matrix[10]
                        ]), ${object_id}.transform.world.translate[2]);

                        ${object_id}.transform.world.matrix[12] += right[0] + up[0] + back[0];
                        ${object_id}.transform.world.matrix[13] += right[1] + up[1] + back[1];
                        ${object_id}.transform.world.matrix[14] += right[2] + up[2] + back[2];

                        ${object_id}.transform.world.matrix = mat4.scale(
                            ${object_id}.transform.world.matrix,
                            [${object_id}.transform.world.scale, ${object_id}.transform.world.scale, ${object_id}.transform.world.scale]
                        );

                        ${object_id}.transform.model.isDirty = false;
                        ${object_id}.transform.world.isDirty = false;
                    }

                `).join('\n')}

            }, 16);
            
        `;
    }

}