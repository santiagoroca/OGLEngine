const Entity = require('./Entity');

class Event extends Entity {

    static getConfig () {
        return ({
            isUniqueInstance: true, 
            plural: 'events',
            singular: 'event',
            defaults: {}
        });
    }
    
}

module.exports = Event;