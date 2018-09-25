import { Model } from './../model';
import { Collection } from './collection';

export class CollisionChecker extends Collection {
    /**
     * @param {Model} model
     * @param {Array<Model>|Model} platforms
     * @param {Callable} [event=function()]
     */
    add(model, platforms, event = () => {}) {
        if (!Array.isArray(platforms)) {
            platforms = [platforms];
        }

        this.push({ model, platforms, event });
    }

    /**
     * @param {number} dt
     */
    check(dt) {
        let model, platform;
        this.items.forEach(pair => {
            model = Object.create(pair.model);
            model.step(dt);
            platform = CollisionChecker.hasCollisions(model, pair.platforms);

            if (!!platform) {
                pair.event(pair.model, platform);
            }
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
     * Check if there are any collisions between model and array of models
     * @param {Model} model
     * @param {Array<Model>|Model} models
     * @return {boolean}
     */
    static hasCollisions(model, models) {
        if (!model instanceof Model) {
            throw new Error(`Parameter model has to be an instance of Model, it's an instance of ${typeof model} instead.`);
        }

        if (!Array.isArray(models)) {
            models = [models];
        }

        let m;
        for (let i = 0; i < models.length; i++) {
            m = models[i];
            if (!model instanceof Model) {
                throw new Error(`Parameter from models[${i}] has to be an instance of Model, it's an instance of ${typeof m} instead.`);
            }

            if (
                !!model.hitbox.radius &&
                !!m.hitbox.radius &&
                CollisionChecker.hasCollisionBetweenCircleAndCircle(model.hitbox, m.hitbox)
            ) {
                return m;
            } else if (
                !!model.hitbox.radius &&
                !m.hitbox.radius &&
                CollisionChecker.hasCollisionBetweenCircleAndRectangle(model.hitbox, m.hitbox)
            ) {
                return m;
            } else if (
                !model.hitbox.radius &&
                !!m.hitbox.radius &&
                CollisionChecker.hasCollisionBetweenCircleAndRectangle(m.hitbox, model.hitbox)
            ) {
                return m;
            } else if (
                !model.hitbox.radius &&
                !m.hitbox.radius &&
                CollisionChecker.hasCollisionBetweenRectangleAndRectangle(model.hitbox, m.hitbox)
            ) {
                return m;
            }
        }

        return false;
    }

    /**
     * Check collision between circle and another circle
     * @param {Object} circleA
     * @param {number} circleA.x
     * @param {number} circleA.y
     * @param {number} circleA.radius
     * @param {Object} circleB
     * @param {number} circleB.x
     * @param {number} circleB.y
     * @param {number} circleB.radius
     *
     * @return {boolean}
     */
    static hasCollisionBetweenCircleAndCircle(circleA, circleB) {
        const dx = circleA.x - circleB.x;
        const dy = circleA.y - circleB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < circleA.radius + circleB.radius) {
            return true;
        }

        return false;
    }

    /**
     * Check collision between circle and rectangle
     * @param {Object} circle
     * @param {number} circle.x
     * @param {number} circle.y
     * @param {number} circle.radius
     * @param {Object} rectangle
     * @param {number} rectangle.x
     * @param {number} rectangle.y
     * @param {number} rectangle.width
     * @param {number} rectangle.height
     *
     * @return {boolean}
     */
    static hasCollisionBetweenCircleAndRectangle(circle, rectangle) {
        const distX = Math.abs(circle.x - rectangle.x - rectangle.width / 2);
        const distY = Math.abs(circle.y - rectangle.y - rectangle.height / 2);

        if (distX > rectangle.width / 2 + circle.radius) {
            return false;
        }

        if (distY > rectangle.height / 2 + circle.radius) {
            return false;
        }

        if (distX <= rectangle.width / 2) {
            return true;
        }

        if (distY <= rectangle.height / 2) {
            return true;
        }

        var dx = distX - rectangle.width / 2;
        var dy = distY - rectangle.height / 2;

        return dx * dx + dy * dy <= (circle.radius * circle.radius);
    }

    /**
     * Check collision between rectangle and rectangle
     * @param {Object} rectangleA
     * @param {number} rectangleA.x
     * @param {number} rectangleA.y
     * @param {number} rectangleA.width
     * @param {number} rectangleA.height
     * @param {Object} rectangleB
     * @param {number} rectangleB.x
     * @param {number} rectangleB.y
     * @param {number} rectangleB.width
     * @param {number} rectangleB.height
     *
     * @return {boolean}
     */
    static hasCollisionBetweenRectangleAndRectangle(rectangleA, rectangleB) {
        if (rectangleA.x < rectangleB.x + rectangleB.width &&
            rectangleA.x + rectangleA.width > rectangleB.x &&
            rectangleA.y < rectangleB.y + rectangleB.height &&
            rectangleA.y + rectangleA.height > rectangleB.y
        ) {
            return true;
        }

        return false;
    }
}
