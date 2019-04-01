import { UIElement } from './element';

export class UIInput extends UIElement {
    constructor(type, name, value = null, id = null, classList = []) {
        super('INPUT', null, id, classList);

        this.type = type;
        this.name = name;
        this.value = value;
    }

    set type(type) {
        this.element.type = type;
    }

    get type() {
        this.element.type;
    }

    set name(name) {
        this.element.name = name;
    }

    get name() {
        this.element.name;
    }

    set value(value) {
        this.element.value = value;
    }

    get value() {
        this.element.value;
    }
}
