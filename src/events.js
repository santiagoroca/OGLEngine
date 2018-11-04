module.exports = class Events {

    constructor () {
        this.events = [];
    }

    addTranslateEvent (transform) {
        this.events.push({
            type: 'drag',
            stringified: `
                this.localTransform[12] += event['${transform[0]}'] || 0.0;
                this.localTransform[13] += event['${transform[1]}'] || 0.0;
                this.localTransform[14] += event['${transform[2]}'] || 0.0;
            `
        });
    }

    addEvent (event) {
        this.events.push(event);
    }

    toString (geometry_id) {
        return this.events.map(event => {
            let out = `eventScheduler.scheduleDrag((function (event) {`

            switch (event.type) {
                case 'drag': out += event.stringified;
                    break;
            }

            return `${out} }).bind(${geometry_id}));`;
        })
    }

}