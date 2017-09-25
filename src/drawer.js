/**
 * Draw class
 * @param {CanvasRenderingContext2D} ctx
 * @example
 * let drawer = new Drawer();
 * drawer.drawRect(10, 10, 100, 100);
 * let metrics = drawer.drawText('Hello world', 50, 50);
 * metrics.width // text width
 */
class Drawer {
    constructor(ctx = null) {
        this.ctx = ctx;
    }

    /**
     * Reset canvas zone
     */
    clearLayer () {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
     * @return {Object}
     */
    drawText(text, x, y, size = '10pt', font = 'Arial', color = 'black', style = '', align = 'left') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.font = `${style} ${size} ${font}`;
        this.ctx.textAlign = align;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        let metrics = this.ctx.measureText(text);
        this.ctx.closePath();
        this.ctx.restore();

        return metrics;
    }
}

module.exports = Drawer;
