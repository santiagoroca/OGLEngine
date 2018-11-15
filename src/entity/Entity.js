module.exports = class Entity {

    constructor (statements = []) {
        this.defaults();
        
        for (const [ method, argument ] of statements) {
            try {
                this[method](argument);
            } catch (error) {
                throw(new Error(`${this.constructor.name} does not contain '${method}' method.`));
            }
        }
    }

    set ([ property, value ]) {
        this[property] = value;
    }
    
}