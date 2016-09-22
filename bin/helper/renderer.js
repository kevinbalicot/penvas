'use strict';

export class Renderer {

    constructor (ctx) {
        this.models = [];
        this.ctx = ctx;
    }

    add (models, zindex = 0) {

        if (!Array.isArray(models)) {
            models = [models];
        }

        models.forEach(model => {
            this.models.push({ model: model, zindex: model.zindex || zindex });
        });
    }

    sort () {
        return this.models.sort((a, b) => {
            if (a.level < b.zindex) {
                return -1;
            } else if (a.zindex > b.zindex) {
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
