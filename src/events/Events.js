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

    toString (object_id) {
        return this.events.map(event => {

            switch (event.type) {
                case 'drag': return this.scheduleDragWrapper(object_id, event)
                case 'keypress': return this.scheduleKeyPressWrapper(object_id, event)
                case 'keydown': return this.scheduleKeyDownWrapper(object_id, event)
                case 'interval': return this.scheduleIntervalWrapper(object_id, event)
            }

        }).join('\n');
    }

    scheduleDragWrapper (object_id, event) {
        return `
            eventScheduler.scheduleDrag((function (event) {
                ${ event.btn ? `if (event.button == ${event.btn}) {` : ''}
                    ${event.hndl}
                ${ event.btn ? `}` : ''}
            }).bind(${object_id}));
        `;
    }

    scheduleKeyPressWrapper (object_id, event) {
        return `
            eventScheduler.scheduleKeyPress((function (event) {
                ${event.hndl}
            }).bind(${object_id}), '${event.key}');
        `;
    }

    scheduleIntervalWrapper (object_id, event) {
        return `
            eventScheduler.scheduleInterval((function (event) {
                ${event.hndl}
            }).bind(${object_id}), ${event.every});
        `;
    }

    scheduleKeyDownWrapper (object_id, event) {
        return `
            eventScheduler.scheduleKeyDown((function (event) {
                if (event.key == '${event.key}') {
                    ${event.hndl}
                }
            }).bind(${object_id}));
        `;
    }
    
}