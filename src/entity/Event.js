const Entity = require('./Entity');
const EntityConverter = require('../runtime/EntityConverter')

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

module.exports = EntityConverter(Event);