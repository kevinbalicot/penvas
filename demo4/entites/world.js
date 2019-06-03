class World extends Container {
    constructor(width, height) {
        super({ width, height });

        this.ctx.imageSmoothingEnabled = false;
    }
}
