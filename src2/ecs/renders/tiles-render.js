import { Render } from './../render';

import { Tiles } from './../components/tiles';
import { Point } from './../geometry/point';

export class TilesRender extends Render {
    constructor(x = 0, y = 0, width = 9999, height = 9999) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getTilePosition(width, height, tileWidth, tileHeight, id) {
        const columns = width / tileWidth;
        const rows = height / tileHeight;
        const tiles = columns * rows;

        id = id > tiles ? tiles : id;

        const percent = (id * tileWidth) / width;
        let x = 0;
        let y = 0;

        if (Number.isInteger(percent)) {
            x = columns -1;
            y = percent - 1;
        } else {
            const unit = Math.trunc(percent);
            const decimal = percent - unit;

            x = Math.round(decimal * columns) - 1;
            y = Math.trunc((id * tileWidth) / width);
        }

        return new Point(x < 0 ? columns : x, y);
    }

    renderTile(canvas, x, y, tileWidth, tileHeight, image, id) {
        if (id > 0) {
            let tile = this.getTilePosition(image.width, image.height, tileWidth, tileHeight, id);

            canvas.save();
            canvas.drawImage(
                image,
                tile.x * tileWidth,
                tile.y * tileHeight,
                tileWidth,
                tileHeight,
                x,
                y,
                tileWidth,
                tileHeight
            );
            canvas.restore();
        }
    }

    render(canvas, entity) {
        if (entity.hasComponent(Tiles)) {
            const limits = { x: this.x, y: this.y, width: this.width, height: this.height };

            let x, y, rows, columns, tiles;
            for (let layer of entity.components.tiles.layers) {
                tiles = layer.data || layer.tiles || [];
                rows = layer.height || layer.rows || entity.components.tiles.rows;
                columns = layer.width || layer.columns || entity.components.tiles.columns;

                let t = 0;
                for (let c = 0; c < columns; c++) {
                    for (let r = 0; r < rows; r++) {
                        x = r * entity.components.tiles.tileWidth;
                        y = c * entity.components.tiles.tileHeight;

                        canvas.save();
                        canvas.ctx.globalAlpha = undefined !== layer.opacity ? layer.opacity : 1;

                        // Check if tile is into limits
                        if (
                            x + entity.components.tiles.tileWidth >= limits.x &&
                            x <= limits.x + limits.width &&
                            y + entity.components.tiles.tileHeight >= limits.y &&
                            y <= limits.y + limits.height
                        ) {
                            this.renderTile(
                                canvas,
                                x,
                                y,
                                entity.components.tiles.tileWidth,
                                entity.components.tiles.tileHeight,
                                entity.components.tiles.image,
                                tiles[t] || 0
                            );
                            canvas.restore();
                        }

                        t++;
                    }
                }
            }
        }
    }
}
