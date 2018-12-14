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

                ${this.dynamics.filter(({ transforms }) => transforms.length).map(object => `

                    if (${object.transforms.map(transform => `${transform.getName()}.isDirty`).join('||')}) {

                        ${object.getName()}.matrix = [
                            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                        ];

                        ${object.transforms.map(transform => `

                                {
                                    let matrix = mat4.identity([]);

                                    matrix = mat4.rotate(
                                        matrix, ${transform.getName()}.y_angle, [
                                        matrix[1], 
                                        matrix[5], 
                                        matrix[9]
                                    ]);
    
                                    matrix = mat4.rotate(
                                        matrix, ${transform.getName()}.x_angle, [
                                        matrix[0], 
                                        matrix[4], 
                                        matrix[8]
                                    ]);
                                    
                                    matrix = mat4.rotate(
                                        matrix, ${transform.getName()}.z_angle, [
                                        matrix[2], 
                                        matrix[6],
                                        matrix[10]
                                    ]);
    
                                    matrix[12] += ${transform.getName()}.translate[0];
                                    matrix[13] += ${transform.getName()}.translate[1];
                                    matrix[14] += ${transform.getName()}.translate[2];

                                    ${object.getName()}.matrix = mat4.multiply(${object.getName()}.matrix, matrix);
                                    ${transform.getName()}.matrix = ${object.getName()}.matrix.slice();
                                    ${transform.getName()}.isDirty = false;
                                    isSceneDirty = true;
                                }

                        `).join('\n')}
                    
                    }

                `).join('\n')}

            }, 16);
            
        `;
    }

}