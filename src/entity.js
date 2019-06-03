const uuid = require('uuid');

import { Component } from './component';

export class Entity {
    constructor(components = []) {
        this.id = uuid.v4();
        this.components = {};

        components.forEach(component => this.components[component.constructor.name.toLowerCase()] = component);
    }

    addComponent(component) {
        if (component instanceof Component) {
            this.components[component.constructor.name.toLowerCase()] = component;
        }

        return this;
    }

    hasComponent(name) {
        return !!this.components[name.name ? name.name.toLowerCase() : name.toLowerCase()];
    }

    removeComponent(name) {
        delete this.components[name.name ? name.name.toLowerCase() : name.toLowerCase()];

        return this;
    }
}
