import { Drawer } from './../drawer';

export class Collection {
    constructor() {
        this.items = [];
    }

    push(item) {
        return this.items.push(item);
    }

    filter(callback) {
        return this.items.filter(callback);
    }

    find(callback) {
        return this.items.find(callback);
    }

    sort(callback) {
        return this.items.sort(callback);
    }

    forEach(callback) {
        return this.items.forEach(callback);
    }

    remove(callback) {
        let index = -1;
        if (typeof callback === 'function') {
            index = this.items.findIndex(callback);
        } else {
            index = this.items.indexOf(callback);
        }

        if (index > -1) {
            return this.items.splice(index, 1);
        }

        return false;
    }

    step(dt) {
        this.items.forEach(item => {
            if (!!item.step && typeof item.step === 'function') {
                item.step(dt);
            }
        });
    }

    render(drawer) {
        if (!drawer instanceof Drawer) {
            throw new Error(`Parameter drawer has to be an instance of Drawer, it's an instance of ${typeof drawer} instead.`);
        }

        this.items.forEach(item => {
            if (!!item.render && typeof item.render === 'function') {
                item.render(drawer);
            }
        });
    }

    clear() {
        this.items = [];
    }
}
