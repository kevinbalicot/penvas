import { Model } from './model';

/**
 * Draw class
 * @param {CanvasRenderingContext2D} ctx
 * @example
 * let drawer = new Drawer();
 * drawer.drawRect(10, 10, 100, 100);
 * let metrics = drawer.drawText('Hello world', 50, 50);
 * metrics.width // text width
 */
export class Drawer {
    /**
     * @param {CanvasRenderingContext2D} [ctx=null]
     */
    constructor(ctx = null) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
    }

    /**
     * Reset canvas zone
     */
    clearLayer() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    /**
     * Draw a line
     * @param {number} x - x coordinate for first point of line
     * @param {number} y - y coordinate for first point of line
     * @param {number} destX - x coordinate for second point of line
     * @param {number} destY - y coordinate for second point of line
     * @param {number} [size=1] - line size
     * @param {string} [color=black] - line color
     */
    drawLine(x, y, destX, destY, size = 1, color = 'black') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = size;
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(destX, destY);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    /**
     * Draw a rectangle
     * @param {number} x - x coordinate for rectangle position
     * @param {number} y - y coordinate for rectangle position
     * @param {number} width - rectangle width
     * @param {number} height - rectangle height
     * @param {number} [size=1] - line size
     * @param {string} [color=black] - line color
     */
    drawRect(x, y, width, height, size = 1, color = 'black') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = size;
        this.ctx.strokeStyle = color;
        this.ctx.rect(x, y, width, height);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    /**
     * Draw a fill rectangle
     * @param {number} x - x coordinate for rectangle position
     * @param {number} y - y coordinate for rectangle position
     * @param {number} width - rectangle width
     * @param {number} height - rectangle height
     * @param {string} [color=black] - rectangle background color
     * @param {number} [lineSize=0] - line size
     * @param {string} [lineColor=black] - line color
     */
    drawFillRect(x, y, width, height, color = 'black', lineSize = 0, lineColor = 'black') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.rect(x, y, width, height);
        this.ctx.fill();
        if (lineSize > 0) {
            this.ctx.lineWidth = lineSize;
            this.ctx.strokeStyle = lineColor;
            this.ctx.stroke();
        }
        this.ctx.closePath();
        this.ctx.restore();
    }

    /**
     * Draw a circle
     * @param {number} x - x coordinate for circle position
     * @param {number} y - y coordinate for circle position
     * @param {number} radius - circle radius
     * @param {number} [size=1] - line size
     * @param {string} [color=black] - line color
     * @param {number} [start=0] - angle start
     * @param {number} [end=360] - angle end
     */
    drawCircle(x, y, radius, size = 1, color = 'black', start = 0, end = (2 * Math.PI)) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = size;
        this.ctx.strokeStyle = color;
        this.ctx.arc(x, y, radius, start, end);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    /**
     * Draw a fill circle
     * @param {number} x - x coordinate for circle position
     * @param {number} y - y coordinate for circle position
     * @param {number} radius - circle radius
     * @param {string} [color=black] - circle background color
     * @param {number} [lineSize=0] - line size
     * @param {string} [lineColor=black] - line color
     * @param {number} [start=0] - angle start
     * @param {number} [end=360] - angle end
     */
    drawFillCircle(x, y, radius, color = 'black', lineSize = 0, lineColor= 'black', start = 0, end = (2 * Math.PI)) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, start, end);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        if (lineSize > 0) {
            this.ctx.lineWidth = lineSize;
            this.ctx.strokeStyle = lineColor;
            this.ctx.stroke();
        }
        this.ctx.closePath();
        this.ctx.restore();
    }

    /**
     * Draw a text
     * @param {string} text - The text
     * @param {number} x - x coordinate for text position
     * @param {number} y - y coordinate for text position
     * @param {string} [size=10pt] - text size (default: 10pt)
     * @param {string} [font=Arial] - text font familly (default: Arial)
     * @param {string} [color=black] - text color
     * @param {string} [style] - text style, italic, blod etc ...
     * @param {string} [align=left] - text align, left, right, center
     * @param {string} [baseline=alphabetic] - text baseline, top, hanging, middle, alphabetic, ideographic, bottom
     *
     * @return {Object}
     */
    drawText(text, x, y, size = '10pt', font = 'Arial', color = 'black', style = '', align = 'left', baseline = 'alphabetic') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.font = `${style} ${size} ${font}`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        let metrics = this.ctx.measureText(text);
        this.ctx.closePath();
        this.ctx.restore();

        return metrics;
    }

    /**
     *  Draw images
     * @param {*} source - image or canvas
     * @param {number} x - source pos x
     * @param {number} y - source pos y
     * @param {number} [width=null] - source width
     * @param {number} [height=null] - source height
     * @param {number} [destinationX=null] - destination x
     * @param {number} [destinationY=null] - destination y
     * @param {number} [destinationWidth=null] - destination width
     * @param {number} [destinationHeight=null] - destination height
     */
    drawImage(source, x, y, width = null, height = null, destinationX  = null, destinationY  = null, destinationWidth  = null, destinationHeight  = null) {
        this.ctx.save();

        if (null === width && null === height) {
            this.ctx.drawImage(source, x, y);
        } else if (
            null === destinationX &&
            null === destinationY &&
            null === destinationWidth &&
            null === destinationHeight
        ) {
            this.ctx.drawImage(source, x, y, width, height);
        } else {
            this.ctx.drawImage(
                source,
                x,
                y,
                width,
                height,
                destinationX,
                destinationY,
                destinationWidth,
                destinationHeight
            );
        }

        this.ctx.restore();
    }

    /**
     * Save context
     * @return {Drawer}
     */
    save() {
        this.ctx.save();

        return this;
    }

    /**
     * Restore last saved context
     * @return {Drawer}
     */
    restore() {
        this.ctx.restore();

        return this;
    }

    /**
     * Rotate model
     * @param {Model} model
     * @param {float} deg
     * @param {number} [pivotX=null]
     * @param {number} [pivotY=null]
     *
     * @return {Drawer}
     */
    rotateModel(model, deg, pivotX = null, pivotY = null) {
        pivotX = null !== pivotX ? pivotX : model.width / 2;
        pivotY = null !== pivotY ? pivotY : model.height / 2;

        this.ctx.translate(model.x, model.y);
        this.ctx.translate(pivotX, pivotY);

        this.ctx.rotate(deg * Math.PI / 180);

        this.ctx.translate(-1 * pivotX, -1 * pivotY);
        this.ctx.translate(-1 * model.x, -1 * model.y);

        return this;
    }

    /**
     * Draw model
     * @param {Model} model
     *
     * @return {Drawer}
     */
    drawModel(model) {
        if (!model instanceof Model) {
            throw new Error(`Parameter model has to be an instance of Model, it's an instance of ${typeof model} instead.`);
        }

        this.ctx.save();
        model.render(this.ctx, this);
        this.ctx.restore();

        return this;
    }

    /**
     * Display model's x,y positions and hitbox information
     * @private
     * @param {Model} model
     */
    renderDebug(model) {
        if (!model instanceof Model) {
            throw new Error(`Parameter model has to be an instance of Model, it's an instance of ${typeof model} instead.`);
        }

        this.drawText(
            `[${Math.round(model.x)}, ${Math.round(model.y)}]`,
            model.x,
            model.y - 10,
            '12px',
            'sans-serif'
        );

        this.drawRect(model.x, model.y, model.width, model.height, 1, 'red');

        if (null !== model.hitbox.radius) {
            this.drawCircle(model.hitbox.x, model.hitbox.y, model.hitbox.radius, 1, 'blue');
        } else {
            this.drawRect(model.hitbox.x, model.hitbox.y, model.hitbox.width, model.hitbox.height, 1, 'blue');
        }

        this.drawText(
            `[${Math.round(model.hitbox.x)}, ${Math.round(model.hitbox.y)}]`,
            model.hitbox.x,
            model.hitbox.y - 10,
            '12px',
            'sans-serif'
        );
    }

    /**
     * Add models to debug
     * @param {Array<Model>|Model} models
     */
    debug(models = []) {
        [].concat(models).forEach(model => {
            if (model instanceof Model) {
                this.renderDebug(model);
            }
        });
    }
}
