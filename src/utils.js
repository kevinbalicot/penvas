import { Vector } from './geometry/vector';

Math.degree = function(radians) {
  return radians * 180 / Math.PI;
};

Math.radian = function(degrees) {
  return degrees * Math.PI / 180;
};

export class Utils {
    static horizontalFlipPoint(point, center) {
        const delta = center.x - point.x;
        point.x = center.x + delta;

        return point;
    }

    static verticalFlipPoint(point, center) {
        const delta = center.y - point.y;
        point.y = center.y + delta;

        return point;
    }

    static angleBetweenPoints(point1, point2) {
        return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
    }

    static angleToVector(angle) {
        return new Vector(Math.cos(Math.radian(angle)), Math.sin(Math.radian(angle)));
    }

    /**
     * Check if there are any collisions between model and array of models
     * @param {Object} object
     * @param {Array<Objects>|Objects} objects
     * @return {boolean}
     */
    static hasCollisions(object, objects) {
        if (!Array.isArray(objects)) {
            objects = [objects];
        }

        let o;
        for (let i = 0; i < objects.length; i++) {
            o = objects[i];

            if (
                !!object.radius &&
                !!o.radius &&
                Utils.hasCollisionBetweenCircleAndCircle(object, o)
            ) {
                return o;
            } else if (
                !!object.radius &&
                !o.radius &&
                Utils.hasCollisionBetweenCircleAndRectangle(object, o)
            ) {
                return o;
            } else if (
                !object.radius &&
                !!o.radius &&
                Utils.hasCollisionBetweenCircleAndRectangle(o, object)
            ) {
                return o;
            } else if (
                !object.radius &&
                !o.radius &&
                Utils.hasCollisionBetweenRectangleAndRectangle(object, o)
            ) {
                return o;
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

    static outOf(rectangleA, rectangleB) {
        if (
            rectangleA.x + rectangleA.width < rectangleB.x ||
            rectangleA.y + rectangleA.height < rectangleB.y ||
            rectangleA.x > rectangleB.x + rectangleB.width ||
            rectangleA.y > rectangleB.y + rectangleB.height
        ) {
            return true;
        }

        return false;
    }
}
