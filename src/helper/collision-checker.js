'use strict';

export class CollisionChecker {

    constructor () {
        this.pair = [];
    }

    add (model, platforms, event) {

        if (!Array.isArray(platforms)) {
            platforms = [platforms];
        }

        this.pair.push({ model, platforms, event });
    }

    check (td) {
        let model, platform;
        this.pair.forEach(pair => {
            model = Object.create(pair.model);
            model.step(td);
            platform = model.hasCollisions(pair.platforms);

            if (!!platform) {
                pair.event(pair.model, platform);
            }
        });
    }

    clear () {
        this.pair = [];
    }
}
