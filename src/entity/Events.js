const Entity = require('./Entity');

module.exports = class Events extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'geometries',
            singular: 'geometry',
            defaults: {
                dynamics: NativeTypes.infer([]),
                events: NativeTypes.infer({
                    drag: [], keypress: [],
                    keydown: [], interval: [], 
                    mousewheel: [] 
                })
            }
        })
    }

    addEvents (events, object) {
        for (const event of events) {
            this.events[event.type].push(event);
        }

        this.dynamics.push(object);
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

                ${this.dynamics.map(object => `

                    if (${object.transforms.map(transform => `${transform.getName()}.isDirty`).join('||')}) {

                        ${object.getName()}.matrix = [
                            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                        ];

                        ${object.transforms.map(transform => `

                                ${object.getName()}.matrix = mat4.rotate(
                                    ${object.getName()}.matrix, ${transform.getName()}.y_angle, [
                                    ${object.getName()}.matrix[1], 
                                    ${object.getName()}.matrix[5], 
                                    ${object.getName()}.matrix[9]
                                ]);
                                ${object.getName()}.matrix = mat4.rotate(
                                    ${object.getName()}.matrix, ${transform.getName()}.x_angle, [
                                    ${object.getName()}.matrix[0], 
                                    ${object.getName()}.matrix[4], 
                                    ${object.getName()}.matrix[8]
                                ]);
                                ${object.getName()}.matrix = mat4.rotate(
                                    ${object.getName()}.matrix, ${transform.getName()}.z_angle, [
                                    ${object.getName()}.matrix[2], 
                                    ${object.getName()}.matrix[6],
                                    ${object.getName()}.matrix[10]
                                ]);

                                right = vec3.multiplyScalar(vec3.normalize([
                                    ${object.getName()}.matrix[0], ${object.getName()}.matrix[4], ${object.getName()}.matrix[8]
                                ]), ${transform.getName()}.translate[0]);
                            
                                up = vec3.multiplyScalar(vec3.normalize([
                                    ${object.getName()}.matrix[1], ${object.getName()}.matrix[5], ${object.getName()}.matrix[9]
                                ]), ${transform.getName()}.translate[1]);
                            
                                back = vec3.multiplyScalar(vec3.normalize([
                                    ${object.getName()}.matrix[2], ${object.getName()}.matrix[6], ${object.getName()}.matrix[10]
                                ]), ${transform.getName()}.translate[2]);

                                ${object.getName()}.matrix[12] += right[0] + up[0] + back[0];
                                ${object.getName()}.matrix[13] += right[1] + up[1] + back[1];
                                ${object.getName()}.matrix[14] += right[2] + up[2] + back[2];

                                ${object.getName()}.matrix = mat4.scale(
                                    ${object.getName()}.matrix,
                                    [${transform.getName()}.scale, ${transform.getName()}.scale, ${transform.getName()}.scale]
                                );

                                ${transform.getName()}.isDirty = false;

                        `).join('\n')}
                    
                    }

                `).join('\n')}

            }, 16);
            
        `;
    }

}