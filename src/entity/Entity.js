const TransformEvents = require('../events/TransformEvents');
const hash = require('../helper.js').hash;

module.exports = class Entity {

    constructor (parent, statements = []) {
        this.parent = parent;
        this.defaults();
        this.applyStatements(statements);
        this.name = hash();
    }

    applyStatements (statements) {
        statements = statements.filter(statement => statement != null);

        for (let [ method, argument ] of statements) {
            try {
                if (method.match(/set|add/g)) {
                    const entity = argument[0].trim();
                    const methodName = method + entity.charAt(0).toUpperCase() + entity.slice(1);

                    if (this[methodName]) {
                        this[methodName](argument.slice(1));
                        continue;
                    }
                }

                this[method.trim()](argument);
            } catch (error) {
                throw(error);
            }
        }
    }

    set ([ property, value ]) {
        this[property] = value;
    }

    parseArg (arg) {
        if (typeof arg === 'string') {
            return this.getVariable(arg);
        }

        return arg;
    }

    getVariable (varname) {
        try {
            if (this[varname]) {
                return this[varname];
            }
    
            return this.parent.getVariable(varname);
        } catch (exception) {
            return `variables.${varname}`;
        }
        
    }

    add ([ property, value]) {
        if (this[property + 's'] && typeof this[property + 's'] == 'array') {
            this[property + 's'].push(value);
        }
    }

    on (event) {
        if (this.events) {
            this.events.push(event);
        }
    }

    getEvents () {
        return this.events || [];
    }

}