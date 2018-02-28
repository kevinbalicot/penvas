import { Model } from './model';
import { Drawer } from './drawer';

import mouse from './mouse';

/**
 * Create a new Viewport
 * @example
 * const app = new Application({ width: 200, height: 200 });
 * const player = new Sprite(...);
 * const world = new Container(...);
 * const viewport = new Viewport(0, 0, app.canvas, 1, 1, app.width / 2, app.height / 2);
 *
 * viewport.follow(player, world);
 * viewport.drawImage(world);
 */
export class Viewport extends Model {

    /**
     * @param {number} x - x position of viewport into world
     * @param {number} y - y position of viewport into world
     * @param {CanvasRenderingContext2D} canvas - canvas where to draw image
     * @param {number} [scaleX=1]
     * @param {number} [scaleY=1]
     * @param {number} [deadZoneX=0] - x position of dead zone (where viewport move when following target)
     * @param {number} [deadZoneY=0] - y position of dead zone (where viewport move when following target)
     */
    constructor(x, y, canvas, scaleX = 1, scaleY = 1, deadZoneX = 0, deadZoneY = 0) {
        super(x, y, canvas.width, canvas.height);

        /** @type {CanvasRenderingContext2D} */
        this.canvas = canvas;

        /** @type {number} */
        this.scaleX = scaleX;

        /** @type {number} */
        this.scaleY = scaleY;

        /** @type {number} */
        this.deadZoneX = deadZoneX;

        /** @type {number} */
        this.deadZoneY = deadZoneY;

        // Update mouse coordinates
        this.canvas.addEventListener('mousemove', event => {
            mouse.ax = mouse.x + (this.x * this.scaleX);
            mouse.ay = mouse.y + (this.y * this.scaleY);
        });

        mouse.scaleX = this.scaleX;
        mouse.scaleY = this.scaleY;

        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Viewport follow target into world
     * @param {Object} target
     * @param {Object} world
     */
    follow(target, world) {
        // Follow target
        if (target.x - this.x + (this.deadZoneX / this.scaleX) > this.width / this.scaleX) {
            this.x = target.x - ((this.width / this.scaleX) - (this.deadZoneX / this.scaleX));
        } else if (target.x - (this.deadZoneX / this.scaleX) < this.x) {
            this.x = target.x - (this.deadZoneX / this.scaleX);
        }

        if (target.y - this.y + (this.deadZoneY / this.scaleY) > (this.height / this.scaleY)) {
            this.y = target.y - ((this.height / this.scaleY) - (this.deadZoneY / this.scaleY));
        } else if (target.y - (this.deadZoneY / this.scaleY) < this.y) {
            this.y = target.y - (this.deadZoneY / this.scaleY);
        }

        // Rest into world
        if (this.x < world.x) {
            this.x = world.x;
        }

        if (this.x + (this.width / this.scaleX) > world.x + world.width) {
            this.x = (world.x + world.width) - (this.width / this.scaleX);
        }

        if (this.y < world.y) {
            this.y = world.y;
        }

        if (this.y + (this.height / this.scaleY) > world.y + world.height) {
            this.y = (world.y + world.height) - (this.height / this.scaleY);
        }
    }

    /**
     * Drawn image from source into canvas with viewport
     * @param {Drawer} source
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [width=null]
     * @param {number} [height=null]
     */
    drawImage(source, x = 0, y = 0, width = null, height = null) {
        if (!source instanceof Drawer) {
            throw new Error(`Parameter source has to be an instance of Drawer, it's an instance of ${typeof model} instead.`);
        }

        this.ctx.drawImage(
            source.canvas,
            this.x,
            this.y,
            this.width,
            this.height,
            x,
            y,
            width || this.canvas.width,
            height || this.canvas.height
        );
    }
}
