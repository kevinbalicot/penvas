const uuid = require('uuid');

export default class EntityGroup {
    constructor(name, entities) {
        this.id = uuid.v4();
        this.name = name;
        this.entities = entities;
    }

    getEntity(id) {
        return this.entities.find(entity => entity.id === id);
    }
}
