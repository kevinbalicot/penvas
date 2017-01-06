import { Model } from './model';
import { Container } from './container';
import { MOUSE, io } from './io';

/**
 * Mouse service
 * @example
 * let tile = { x: 10, y: 10, width: 32, height: 32 };
 * if (mouse.isOver(tile)) {
 *     tile.backgroundColor = 'red';
 * }
 */
class Mouse {

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    /**
     * Check if mouse coordinates has collisions with object
     * @protected
     * @param {Object} object
     * @param {number} object.x
     * @param {number} object.y
     * @param {number} object.width
     * @param {number} object.height
     */
    hasCollision(object) {

        if (object.x === undefined || object.y === undefined || object.width === undefined || object.height === undefined) {
            throw new Error(`Object ${object} is not valid, needs x, y, width and height parameters.`);
        }

        if (this.x <= object.x + object.width &&
        object.x <= this.x &&
        this.y <= object.y + object.height &&
        object.y <= this.y) {
            return true;
        }

        return false;
    }

    /**
     * Check if mouse is over object
     * @param {Object} object
     * @param {number} object.x
     * @param {number} object.y
     * @param {number} object.width
     * @param {number} object.height
     * @return {boolean}
     */
    isOver(object) {
        return this.hasCollision(object);
    }

    /**
     * Check if mouse is out of object
     * @param {Object} object
     * @param {number} object.x
     * @param {number} object.y
     * @param {number} object.width
     * @param {number} object.height
     * @return {boolean}
     */
    isOut(object) {
        return !this.hasCollision(object);
    }

    /**
     * Check if mouse click and over object
     * @param {Object} object
     * @param {number} object.x
     * @param {number} object.y
     * @param {number} object.width
     * @param {number} object.height
     * @return {boolean}
     */
    isClickOn(object) {
        return io[MOUSE.LEFT_CLICK] && this.isOver(object);
    }

    /**
     * Check if mouse click and out of object
     * @param {Object} object
     * @param {number} object.x
     * @param {number} object.y
     * @param {number} object.width
     * @param {number} object.height
     * @return {boolean}
     */
    isClickOut(object) {
        return io[MOUSE.LEFT_CLICK] && this.isOut(object);
    }
}

export const mouse = new Mouse();
export default mouse;
