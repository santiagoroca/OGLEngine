const TransformEvents = require('../events/TransformEvents');
const hash = require('../helper.js').hash;

module.exports = class Entity {

    constructor (statements = []) {
        this.defaults();
        statements = statements.filter(statement => statement != null);

        for (const [ method, argument ] of statements) {
            try {
                if (method.match(/set|add/g)) {
                    const methodName = method +
                        argument[0].charAt(0).toUpperCase() + argument[0].slice(1);

                    if (this[methodName]) {
                        this[methodName](argument.slice(1));
                        continue;
                    }
                }

                this[method](argument);
            } catch (error) {
                throw(new Error(`${this.constructor.name} does not contain '${method}' method.`));
            }
        }

        this.name = hash();
    }

    set ([ property, value ]) {
        this[property] = value;
    }

    add ([ property, value]) {
        if (this[property + 's'] && typeof this[property + 's'] == 'array') {
            this[property + 's'].push(value);
        }
    }

    on (event) {

        if (this.events) {
            this.events.push({
                ...event, hndl: TransformEvents[event.hndl[0]](event.hndl[1]) 
            });
        }
    }

}