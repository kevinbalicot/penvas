class Monster extends Sprite {
    constructor(x, y) {
        let animations = [
            { frames: [147], name: 'stand', loop: false }
        ];
        let image = window.loader.get('tileset');

        super(x, y, 16, 16, image, animations, { x: 4, y: 4, width: 8, height: 8 });

        this.id = 1;
        this.dead = false;
        this.rotate = 0;
        this.life = 50;
        this.collision = false;
        this.overtime = 0;
        this.rotate = 0;

        this.play('stand');
    }

    follow(object) {
        if (!object || this.dead) {
            return;
        }

        const xDelta = this.x - object.x;
        const yDelta = this.y - object.y;

        if (xDelta > 0) {
            this.x -= 1;
        } else if (xDelta < 0) {
            this.x += 1;
        }

        if (yDelta > 0) {
            this.y -= 1;
        } else if (yDelta < 0) {
            this.y += 1;
        }
    }

    rotating() {
        if (!this.dead) {
            this.rotate = 10 === this.rotate ? -10 : 10;
        }
    }

    hit(weapon, direction) {
        if (!this.dead) {
            if (!this.collision) {
                if (direction == 'left') {
                    this.x -= 8;
                } else if (direction == 'right') {
                    this.x += 8;
                } else if (direction == 'up') {
                    this.y -= 8;
                } else if (direction == 'down') {
                    this.y += 8;
                }
            }

            this.life -= 5;
        }

        if (this.life <= 0) {
            this.dead = true;
            this.rotate = 90;

            setTimeout(() => events.dispatch('monster-dead', this), 1000);
        }
    }

    render(ctx, drawer) {
        drawer.rotateModel(this, this.rotate, 8, 16);
        super.render(ctx);
    }
}
