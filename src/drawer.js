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
    constructor(ctx = null, width = 0, height = 0) {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    /**
     * Reset canvas zone
     */
    clearLayer() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);
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
     * @param {number} destinationX - destination pos x
     * @param {number} destinationY - destination pos y
     * @param {number} [destinationWidth=null] - destination width
     * @param {number} [destinationHeight=null] - destination height
     * @param {number} [sourceX=null] - source x
     * @param {number} [sourceY=null] - source y
     * @param {number} [sourceWidth=null] - source width
     * @param {number} [sourceHeight=null] - source height
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
     * Rotate
     * @param {Object} rect
     * @param {float} deg
     * @param {Point} [pivot=null]
     *
     * @return {Drawer}
     */
    rotate(rect, deg, pivot = null) {
        const pivotX = null !== pivot ? pivot.x : rect.width / 2;
        const pivotY = null !== pivot ? pivot.y : rect.height / 2;

        this.ctx.translate(rect.x, rect.y);
        this.ctx.translate(pivotX, pivotY);

        this.ctx.rotate(deg * Math.PI / 180);

        this.ctx.translate(-1 * pivotX, -1 * pivotY);
        this.ctx.translate(-1 * rect.x, -1 * rect.y);

        return this;
    }

    horizontalFlip(rect) {
        this.ctx.translate(rect.x + rect.width / 2, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-1 * (rect.x + rect.width / 2), 0);
    }

    verticalFlip(rect) {
        this.ctx.translate(0, rect.y + rect.height / 2);
        this.ctx.scale(1, -1);
        this.ctx.translate(0, -1 * (rect.y + rect.height / 2));
    }
}
