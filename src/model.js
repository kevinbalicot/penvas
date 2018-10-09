import { EventEmitter } from './event-emitter';

/**
 * Base class for every model entity
 * @example
 * let model = new Model(10, 10, 100, 200);
 */
export class Model extends EventEmitter {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Object} [hitbox]
     * @param {number} [hitbox.x]
     * @param {number} [hitbox.y]
     * @param {number} [hitbox.width]
     * @param {number} [hitbox.height]
     */
    constructor(x, y, width, height, hitbox = {}) {
        super();

        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
        /** @type {number} */
        this.rx = x;
        /** @type {number} */
        this.ry = y;
        /** @type {number} */
        this.width = width;
        /** @type {number} */
        this.height = height;

        this.hitbox = hitbox;
        this.collision = false;
        this.parent = {};
    }

    /**
     * @return {Object}
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     */
    get hitbox() {
        return {
            x: this.x + this._hitbox.x,
            y: this.y + this._hitbox.y,
            width: this._hitbox.width,
            height: this._hitbox.height,
            radius: this._hitbox.radius
        }
    }

    /**
     * @param {Object} [hitbox]
     * @param {Object} [hitbox.x]
     * @param {Object} [hitbox.y]
     * @param {Object} [hitbox.width]
     * @param {Object} [hitbox.height]
     */
    set hitbox(hitbox) {
        this._hitbox = {
            x: hitbox.x || 0,
            y: hitbox.y || 0,
            width: hitbox.width || this.width,
            height: hitbox.height || this.height,
            radius: hitbox.radius || null
        }
    }

    /**
     * @property {number} value
     */
    set x(value) {
        this._x = value;
        this.rx = Math.round(value);
    }

    /**
     * @return {number}
     */
    get x() {
        return this._x;
    }

    /**
     * @property {number} value
     */
    set y(value) {
        this._y = value;
        this.ry = Math.round(value);
    }

    /**
     * @return {number}
     */
    get y() {
        return this._y;
    }

    /**
     * @param {number} dt
     */
    step(dt) {}

    /**
     * @param {Drawer} [drawer=null]
     * @param {Object} [options={}]
     */
    render(drawer = null, options = {}) {}

    /**
     * @return {Object}
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     * @property {Object} hitbox
     * @property {boolean} collision
     */
    serialize() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            hitbox: this._hitbox,
            collision: this.collision
        };
    }

    /**
     * @param {Object} data
     * @param {number} data.x
     * @param {number} data.y
     * @param {number} data.width
     * @param {number} data.height
     * @param {Object} data.hitbox
     * @param {boolean} data.collision
     * @return {Model}
     */
    static deserialize({ x, y, width, height, hitbox, collision }) {
        const model = new Model(x, y, width, height, hitbox);

        model.collision = collision;

        return model;
    }
}
