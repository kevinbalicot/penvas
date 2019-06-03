import { Model } from './model';
import { Container } from './container';

import io from './io';
import keys from './keys';

/**
 * Mouse service
 * @example
 * let tile = { x: 10, y: 10, width: 32, height: 32 };
 * if (mouse.isOver(tile)) {
 *     tile.backgroundColor = 'red';
 * }
 */
export class Mouse {
    constructor() {
        /** @type {number} */
        this.x = 0;

        /** @type {number} */
        this.y = 0;

        /** @type {number} - absolute x position */
        this.ax = 0;

        /** @type {number} - absolute y postion */
        this.ay = 0;

        /** @type {number} */
        this.scaleX = 1;

        /** @type {number} */
        this.scaleY = 1;
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

        const x = this.ax > this.x ? this.ax : this.x;
        const y = this.ay > this.y ? this.ay : this.y;

        if (x / this.scaleX <= object.x + object.width &&
            object.x <= x / this.scaleX &&
            y / this.scaleY <= object.y + object.height &&
            object.y <= y / this.scaleY
        ) {
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
     * Check if mouse click and is over object
     * @param {Object} object
     * @param {number} object.x
     * @param {number} object.y
     * @param {number} object.width
     * @param {number} object.height
     * @return {boolean}
     */
    isClickOn(object) {
        return io[keys.LEFT_CLICK] && this.isOver(object);
    }

    /**
     * Check if mouse click and is out of object
     * @param {Object} object
     * @param {number} object.x
     * @param {number} object.y
     * @param {number} object.width
     * @param {number} object.height
     * @return {boolean}
     */
    isClickOut(object) {
        return io[keys.LEFT_CLICK] && this.isOut(object);
    }

    /**
     * @param {Object} object
     * @param {number} object.x
     * @param {number} object.y
     * @param {number} object.width
     * @return {number}
     */
    getAngle(object) {
        if (object.x === undefined || object.y === undefined || object.width === undefined || object.height === undefined) {
            throw new Error(`Object ${object} is not valid, needs x, y, width and height parameters.`);
        }

        const x = this.ax > this.x ? this.ax : this.x;
        const y = this.ay > this.y ? this.ay : this.y;

        const rad = Math.atan2((y / this.scaleY)- (object.y + object.height / this.scaleY), (x / this.scaleX) - (object.x + object.width / this.scaleX));

        return rad * 180 / Math.PI;
    }
}

const mouse = new Mouse();
export default mouse;
