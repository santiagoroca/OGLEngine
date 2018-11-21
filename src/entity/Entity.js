const { hash, capitalize } = require('../runtime/helper.js');

module.exports = class Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true,
            plural: 'entities',
            singular: 'entity',
            defaults: {}
        });
    }

    constructor (parent, statements = []) {
        const config = this.constructor.getConfig();
        this.parent = parent;

        // Prepare Statements to be executed
        statements = statements.filter(statement => statement != null);
        const functions = statements.filter(a => isNaN(parseInt(a)));
        statements = statements.filter(a => !isNaN(parseInt(a)));
        statements = statements.sort((a, b) => parseInt(a) - parseInt(b));

        // Initialize defaults
        const defaults = typeof config.defaults == 'function' ? 
                            config.defaults(this) : config.defaults;
                            
        for (const key in defaults) {
            Object.defineProperty(this, key, defaults[key])
        }

        for (let [ method, argument ] of statements) {
            method = method.trim();

            switch (method) {
                case '0setVariable': this.set(argument); break;
                case '1extendClass': this.extendClass(argument); break;
                case '2addClass': this.addClass(argument); break;
                case '3setClass': this.setClass(argument); break;
                default: console.log('Method not found');
            }
        }

        for (const [ name, argument ] of functions) {
            if (!this[name]) {
                throw(new Error(`Method ${name} not defined for entity ${config.singular}`))
            }

            this.parseArgs(argument);
            this[name](argument);
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

    set ([property, [ type, value ], line]) {

        try {

            const customSetter = `set${capitalize(property)}`;

            if (this[customSetter]) {
                this[customSetter](value);
                return;
            }

            switch (type) {
                case 'const': this[property] = value; break;
                case 'func': this[property] = value; break;
                case 'expr': this[property] = this.parseOperation(value); break;
                case 'var': {

                    if (this[property] && property == value) {
                        throw(new Error(`Property ${property} assigned to itself.`))
                    }

                    Object.defineProperty(this, property, {
                        configurable: true,
                        get: () => this.getVariable(value)
                    });

                }
            }

        } catch (Exception) {
            throw(`${property}: ${Exception} on line ${line}`)
        }
        
    }

    parseOperation ([ operator, [ terma, termb ]]) {
        terma = this.parseArg(terma);
        termb = this.parseArg(termb);

        // If one the variables is actually from the runtime, 
        // skip operation and return string.
        if (typeof terma === 'string' || typeof termb === 'string') {
            return `${terma} ${operator} ${termb}`;
        }

        switch (operator) {
            case '*' : return terma * termb;
            case '+' : return terma + termb;
            case '/' : return terma / termb;
            case '%' : return terma % termb;
            case '-' : return terma - termb;
            case '^' : return Math.pow(terma, termb);
            default: return terma;
        }
    }

    parseArgs (args) {
        for (let key in args) {
            const [ type, value ] = args[key];

            switch (type) {
                case 'const': args[key] = value; break;
                case 'func': args[key] = [ value[0], this.parseArgs(value[1]) ]; break;
                case 'expr': args[key] = this.parseOperation(value); break;
                case 'var':  Object.defineProperty(args, key, {
                    configurable: true,
                    get: () => this.getVariable(value)
                }); break;
            }
        }

        return args;
    }

    parseArg ([ type, value ]) {
        switch (type) {
            case 'const': return value;
            case 'func': return value;
            case 'var': return this.getVariable(value)
        }
    }

    getVariable (varname) {
        try {
            if (typeof this[varname] !== 'undefined') {
                return this[varname];
            }
    
            return this.parent.getVariable(varname);
        } catch (exception) {

            return `variables.${varname}`;
        }
    }

    on (event) {
        if (this.events) {
            this.events.push(event);
        }
    }

    extendClass ([ newClass, oldClass, statements ]) {
        const TargetClass = ClassResolver.get(oldClass);

        if (TargetClass) {
            ClassResolver.set(newClass, TargetClass, statements);
            return;
        }

        throw(new Error(`${newClass} can't extend ${oldClass}. Class not found.`));       
    }

    getEvents () {
        return this.events || [];
    }

}