class Chest extends Sprite {
    constructor(x, y) {
        let animations = [
            { frames: [191], name: 'stand', loop: false },
            { frames: [191, 223, 207], name: 'open', loop: false }
        ];
        let image = window.loader.get('tileset');

        super(x, y, 16, 16, image, animations);

        this.opened = false;

        this.play('stand');
    }

    open() {
        if (!this.opened) {
            this.opened = true;
            this.play('open');
        }
    }
}
