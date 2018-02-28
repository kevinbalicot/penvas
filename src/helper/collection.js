
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
        const index = this.items.findIndex(callback);

        if (index > -1) {
            return this.items.splice(index, 1);
        }

        return false;
    }

    clear() {
        this.items = [];
    }
}
