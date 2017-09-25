/**
 * @ignore
 */
class CollisionChecker {

    constructor() {
        this.pairs = [];
    }

    add(model, platforms, event = () => {}) {
        if (!Array.isArray(platforms)) {
            platforms = [platforms];
        }

        this.pairs.push({ model, platforms, event });
    }

    check(td) {
        let model, platform;
        this.pairs.forEach(pair => {
            model = Object.create(pair.model);
            model.step(td);
            platform = model.hasCollisions(pair.platforms);

            if (!!platform) {
                pair.event(pair.model, platform);
            }
        });
    }

    clear() {
        this.pairs = [];
    }
}

module.exports = CollisionChecker;
