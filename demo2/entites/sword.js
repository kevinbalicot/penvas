class Sword extends Sprite {
    constructor(x, y) {
        let animations = [
            { frames: [10], name: 'stand', loop: false }
        ];
        let image = window.loader.get('tileset');

        super(x, y, 16, 32, image, animations, { x: 8, y: 32, radius: 16 });

        this.hitting = false;
        this.rotate = 0;

        this.play('stand');
    }

    attachTo(owner) {
        let rotate = 0;
        if (owner.direction == 'left' || owner.direction == 'up') {
            this.x = owner.x - this.width / 2;
            this.y = owner.y - owner.height;
            rotate = -8;
        } else if (owner.direction == 'right' || owner.direction == 'down') {
            this.x = owner.x + owner.width / 2;
            this.y = owner.y - owner.height;
            rotate = 8;
        }

        if (io[KEYS.SPACE] && !this.hitting) {
            this.rotate = 0;
            this.hitting = true;
            setTimeout(() => this.hitting = false, 300);
        }

        if (this.hitting) {
            this.rotate += rotate;
        } else {
            this.rotate = 0;
        }
    }

    render(drawer) {
        drawer.rotateModel(this, this.rotate, this.width / 2, this.height);
        super.render(drawer);
    }
}
