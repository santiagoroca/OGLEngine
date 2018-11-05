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
            let out = `eventScheduler.scheduleDrag((function (event) {`

            switch (event.type) {
                case 'drag': out += event.stringified;
                    break;
            }

            return `${out} }).bind(${geometry_id}));`;
        }).join('\n');
    }

}