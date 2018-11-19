const { hash, capitalize } = require('../runtime/helper.js');

module.exports = class Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true,
            plural: 'entities',
            singular: 'entity'
        });
    }

    constructor (parent, statements = []) {
        statements = statements.filter(statement => statement != null);

        this.parent = parent;
        this.defaults();

        for (let [ method, argument ] of statements) {
            method = method.trim();

            // If the method exists in the class, execute it and
            // go to the next statement
            if (this[method]) {
                this[method](argument);
                continue;
            }

            switch (method) {
                case 'addClass': this.addClass(argument); break;
                case 'setClass': this.setClass(argument); break;
                case 'setVariable': this.set(argument); break;
                default: break;
            }
        }

        this.name = hash();
    }

    getName () {
        return `${this.constructor.getConfig().singular}_${this.name}`;
    }

    setClass ([ className, statements ]) {
        const TargetClass = ClassResolver.get(className);

        if (TargetClass) {
            const customSetter = `set${capitalize(TargetClass.getConfig().singular)}`;

            if (this[customSetter]) {
                this[customSetter](this, statements);
                return;
            }

            this[TargetClass.getConfig().singular] = new TargetClass(this, statements);
            return;
        }

        throw(new Error('Class not found', `Class ${className} was not found.`));
    }

    addClass ([ className, statements ]) {
        const TargetClass = ClassResolver.get(className);

        if (TargetClass) {
            const baseClassPluralName = TargetClass.getConfig().plural;

            if (this[baseClassPluralName] && Array.isArray(this[baseClassPluralName])) {
                this[baseClassPluralName].push(new TargetClass(this, statements));
                return;
            }

            throw(new Error(`
                Class ${this.constructor.getConfig().singular} does not support multiples ${baseClassPluralName}.
            `));
        }

        throw(new Error(`Class ${className} was not found.`));
    }

    set ([ property, value ]) {
        const customSetter = `set${capitalize(property)}`;

        if (this[customSetter]) {
            this[customSetter](value);
            return;
        }
        
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