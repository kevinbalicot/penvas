import { Model } from './../model';
import { Collection } from './collection';

export class Renderer extends Collection {
    /**
     * @param {Array<Model>|Model} models
     * @param {Callable} [order=function()]
     */
    add(models, order = () => 0) {
        if (!Array.isArray(models)) {
            models = [models];
        }

        if (typeof order !== 'function') {
            order = () => order;
        }

        models.forEach((model, index) => {
            if (!model instanceof Model) {
                throw new Error(`Parameter from models[${index}] has to be an instance of Model, it's an instance of ${typeof model} instead.`);
            }

            this.push({ model, order });
        });
    }

    /**
     * @return {Array<Model>}
     */
    sortModels() {
        return this.sort((a, b) => {
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

    /**
     * @param {Callable} callback
     */
    remove(callback) {
        const index = this.items.findIndex(item => callback(item.model));

        if (index > -1) {
            return this.items.splice(index, 1);
        }

        return false;
    }

    /**
     * @param {Drawer} drawer
     */
    render(drawer) {
        if (!drawer instanceof Drawer) {
            throw new Error(`Parameter drawer has to be an instance of Drawer, it's an instance of ${typeof drawer} instead.`);
        }

        this.sortModels();
        this.forEach(el => {
            if (!!el.model.render) {
                drawer.drawModel(el.model);
            }
        });
    }
}
