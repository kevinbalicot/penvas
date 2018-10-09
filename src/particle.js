import { Model } from './model';

/**
 * Particle entity
 * @example
 * let particle = new Particle(0, 0, 'fillcirc', {
 *      radius: 10,
 *      color: 'red',
 *      lineSize: 2
 * });
 */
export class Particle extends Model {
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} type - type of particle, text, image, rectangle, circle ...
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {number} [options.rotate]
     * @param {number} [options.velocity]
     * @param {number} [options.pivotX]
     * @param {number} [options.pivotY]
     * @param {number} [options.text]
     * @param {number} [options.size]
     * @param {number} [options.font]
     * @param {number} [options.color]
     * @param {number} [options.style]
     * @param {number} [options.align]
     * @param {number} [options.lineSize]
     * @param {number} [options.lineColor]
     * @param {number} [options.radius]
     * @param {number} [options.start]
     * @param {number} [options.end]
     */
    constructor(x, y, type, options) {
        super(x, y);

        this.type = type;
        this.options = options;
        this.opacity = 1;
    }

    /**
     * @param {number} dt - Delta between two frames
     */
    step(dt) {
        if (this.opacity > 0) {
            this.opacity -= this.options.step || 0.01;
            this.opacity = this.opacity < 0 ? 0 : this.opacity;

            this.x += Math.cos(this.options.rotate || 0) * this.options.velocity || 0;
            this.y += Math.sin(this.options.rotate || Math.PI / 2) * this.options.velocity || 0;
        }
    }

    /**
     * Render particle
     * @param {Drawer} [drawer=null]
     */
    render(drawer) {
        drawer = drawer || this.parent;

        if (!drawer instanceof Drawer) {
            throw new Error(`Parameter drawer has to be an instance of Drawer, it's an instance of ${typeof drawer} instead.`);
        }

        if (this.opacity <= 0 || null === drawer) {
            return;
        }

        drawer.save();

        if (!!this.options.rotate) {
            drawer.rotateModel(
                this,
                this.options.rotate,
                this.options.pivotX,
                this.options.pivotY
            );
        }

        drawer.ctx.globalAlpha = this.opacity;

        switch (this.type) {
            case 'text':
                drawer.drawText(
                    this.options.text,
                    this.x,
                    this.y,
                    this.options.size || '8pt',
                    this.options.font || 'Arial, sans-serif',
                    this.options.color || 'black',
                    this.options.style || '',
                    this.options.align || 'left'
                );
                break;
            case 'image':
                if (!!this.options.image) {
                    drawer.drawImage(this.options.image, this.x, this.y);
                }
                break;
            case 'rect':
            case 'rectangle':
                if (!!this.options.width && !!this.options.height) {
                    drawer.drawRect(
                        this.x,
                        this.y,
                        this.options.width,
                        this.options.height,
                        this.options.size,
                        this.options.color
                    );
                }
                break;
            case 'fillrect':
            case 'fillrectangle':
            case 'fill-rectangle':
                if (!!this.options.width && !!this.options.height) {
                    drawer.drawFillRect(
                        this.x,
                        this.y,
                        this.options.width,
                        this.options.height,
                        this.options.color,
                        this.options.lineSize,
                        this.options.lineColor
                    );
                }
                break;
            case 'circ':
            case 'circle':
                if (!!this.options.radius) {
                    drawer.drawCircle(
                        this.x,
                        this.y,
                        this.options.radius,
                        this.options.size,
                        this.options.color,
                        this.options.start,
                        this.options.end
                    );
                }
                break;
            case 'fillcirc':
            case 'fillcircle':
            case 'fill-circle':
                if (!!this.options.radius) {
                    drawer.drawFillCircle(
                        this.x,
                        this.y,
                        this.options.radius,
                        this.options.color,
                        this.options.lineSize,
                        this.options.lineColor,
                        this.options.start,
                        this.options.end
                    );
                }
                break;
        }

        drawer.restore();
    }

    /**
     * @return {Object}
     */
    serialize() {
        return Object.assign(super.serialize(), {
            type: this.type,
            options: this.options,
            opacity: this.opacity
        });
    }

    /**
     * @param {Object} data
     * @param {number} data.x
     * @param {number} data.y
     * @param {string} data.type
     * @param {Object} data.options
     * @param {number} data.opacity
     * @return {Particle}
     */
    static deserialize({
        x,
        y,
        type,
        options,
        opacity
    }) {
        const particle = new Particle(x, y, type, options);

        particle.opacity = opacity;

        return particle;
    }
}
