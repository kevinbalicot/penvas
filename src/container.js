import { Drawer } from './drawer';

/**
 * Create a new container with a canvas element
 * @example
 * let container = new Container({ width: 200, height: 200, background: 'gray' });
 */
export class Container extends Drawer {

    /**
     * Create a new canvas
     * @param {Object} [options]
     * @param {number} [options.x=0]
     * @param {number} [options.y=0]
     * @param {number} [options.width] - default window width
     * @param {number} [options.height] - default window height
     * @param {string} [options.background=#ffffff]
     */
    constructor(options = {}) {
        super();

        /** @type {number} */
        this.x = options.x || 0;

        /** @type {number} */
        this.y = options.y || 0;

        /** @type {number} */
        this.width = options.width || window.innerWidth;

        /** @type {number} */
        this.height = options.height || window.innerHeight;

        /** @type {hex} */
        this.background = options.background || '#ffffff';

        /** @type {HTMLCanvasElement} */
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = this.background;

        /** @type {CanvasRenderingContext2D} */
        this.context = this.canvas.getContext('2d');

        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.context;
    }
}
