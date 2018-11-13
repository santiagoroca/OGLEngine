module.exports = class Events {

    constructor () {
        this.events = { drag: [], keypress: [], keydown: [], interval: [], mousewheel: [] };
    }

    addEvents (events) {
        for (const event of events) {
            this.events [event.type].push(event);
        }
    }

    toString () {
        return `

            const pressed_keys = {};
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
                render();
            });

            document.addEventListener("mousewheel", (event) => {
                const variables = {
                    delta_z: Math.max(-1, Math.min(1, (event.wheelDelta || -event.deltaY || -event.detail)))
                }

                ${this.events.mousewheel.map(event => event.hndl).join('\n')}

                render();
            });

            ${this.events.interval.map(event => `
                setInterval(() => { 
                    ${event.hndl}
                    requestAnimationFrame(() => render()); 
                }, ${event.every});
            `).join('\n')}
            
        `;
    }

}
