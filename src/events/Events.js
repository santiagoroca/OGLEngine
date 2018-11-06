module.exports = class Events {

    constructor () {
        this.events = [];
    }

    addEvent (event) {
        this.events.push(event);
    }

    addEvents (events) {
        Array.prototype.push.apply(this.events, events);
    }

    toString (geometry_id) {
        return this.events.map(event => {

            switch (event.type) {
                case 'drag': return this.scheduleDragWrapper(geometry_id, event)
                case 'keypres': return this.scheduleKeyPressWrapper(geometry_id, event)
                case 'keydown': return this.scheduleKeyDownWrapper(geometry_id, event)
                case 'interval': return this.scheduleIntervalWrapper(geometry_id, event)
            }

        }).join('\n');
    }

    scheduleDragWrapper (geometry_id, event) {
        return `
            eventScheduler.scheduleDrag((function (event) {
                if (event.button == ${event.btn}) {
                    ${event.hndl}
                }
            }).bind(${geometry_id}));
        `;
    }

    scheduleKeyPressWrapper (geometry_id, event) {
        return `
            eventScheduler.scheduleKeyPress((function (event) {
                ${event.hndl}
            }).bind(${geometry_id}), '${event.key}');
        `;
    }

    scheduleIntervalWrapper (geometry_id, event) {
        return `
            eventScheduler.scheduleInterval((function (event) {
                ${event.hndl}
            }).bind(${geometry_id}), ${event.every});
        `;
    }

    scheduleKeyDownWrapper (geometry_id, event) {
        return `
            eventScheduler.scheduleKeyDown((function (event) {
                if (event.key == '${event.key}') {
                    ${event.hndl}
                }
            }).bind(${geometry_id}));
        `;
    }
    
}