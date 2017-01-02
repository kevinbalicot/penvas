/**
 * @ignore
 */
export class Renderer {

    constructor (ctx) {
        this.models = [];
        this.ctx = ctx;
    }

    add (models, order = 0) {

        if (!Array.isArray(models)) {
            models = [models];
        }

        models.forEach(model => {
            this.models.push({ model, order });
        });
    }

    sort () {
        return this.models.sort((a, b) => {
            if (a.order < b.order) {
                return -1;
            } else if (a.order > b.order) {
                return 1;
            }

            return 0;
        });
    }

    render () {
        this.sort();
        this.models.forEach(el => {
            if (!!el.model.render) {
                el.model.render(this.ctx);
            }
        });
    }
}
