/**
 * @ignore
 */
class Renderer {

    constructor() {
        this.models = [];
    }

    add(models, order = () => 0) {
        if (!Array.isArray(models)) {
            models = [models];
        }

        if (typeof order !== 'function') {
            order = () => order;
        }

        models.forEach(model => {
            this.models.push({ model, order });
        });
    }

    sort() {
        return this.models.sort((a, b) => {
            const orderA = a.order(a.model);
            const orderB = b.order(b.model);

            if (orderA < orderB) {
                return -1;
            } else if (orderA > orderB) {
                return 1;
            }

            return 0;
        });
    }

    render(ctx) {
        this.sort();
        this.models.forEach(el => {
            if (!!el.model.render) {
                el.model.render(ctx);
            }
        });
    }

    clear() {
        this.models = [];
    }
}

module.exports = Renderer;
