module.exports = class Events {

    constructor () {
        this.events = [];
    }

    addTranslateEvent (transform) {
        this.events.push(`

            const x = variables['${transform[0]}'] || 0.0;
            const y = variables['${transform[1]}'] || 0.0;
            const z = variables['${transform[2]}'] || 0.0;

            worldMatrix[12] += x;
            worldMatrix[13] += y;
            worldMatrix[14] += z;

        `);
    }

}