class Player extends Sprite {
    constructor(x, y) {
        let animations = [
            { frames: [249], name: 'walk_right', loop: false },
            { frames: [249], name: 'stand_right', loop: false },
            { frames: [249], name: 'walk_left', loop: false, flip: true },
            { frames: [249], name: 'stand_left', loop: false, flip: true },
            { frames: [249], name: 'stand_down', loop: false },
            { frames: [249], name: 'walk_down', loop: false },
            { frames: [249], name: 'stand_up', loop: false, flip: true },
            { frames: [249], name: 'walk_up', loop: false, flip: true }
        ];
        let image = window.loader.get('tileset');

        super(x, y, 16, 16, image, animations, { x: 0, y: 10, width: 16, height: 6 });

        this.rotate = 0;
        this.overtime = 0;
        this.direction = 'down';
        this.moving = false;
        this.collision = false;
        this.interaction = null;
    }

    step(dt) {
        if (io[37]) {
            this.direction = 'left';
            this.play('walk_left');
            this.moving = true;
        } else if (io[38]) {
            this.direction = 'up';
            this.play('walk_up');
            this.moving = true;
        } else if (io[39]) {
            this.direction = 'right';
            this.play('walk_right');
            this.moving = true;
        } else if (io[40]) {
            this.direction = 'down';
            this.play('walk_down');
            this.moving = true;
        } else {
            this.moving = false;
            this.stand();
        }

        if (this.interaction !== null && io[65]) {
            this.interaction.interact();
        }

        this.move();
        super.step(dt);
    }

    rotating() {
        if (this.moving) {
            this.rotate = 10 === this.rotate ? -10 : 10;
        } else {
            this.rotate = 0;
        }
    }

    move() {
        if (this.moving) {
            if (this.direction == 'left') {
                this.x -= 0.75;
            } else if (this.direction == 'right') {
                this.x += 0.75;
            } else if (this.direction == 'up') {
                this.y -= 0.75;
            } else if (this.direction == 'down') {
                this.y += 0.75;
            }
        }
    }

    stand() {
        if (this.direction == 'left') {
            this.play('stand_left');
        } else if (this.direction == 'right') {
            this.play('stand_right');
        } else if (this.direction == 'up') {
            this.play('stand_up');
        } else if (this.direction == 'down') {
            this.play('stand_down');
        }
    }

    render(ctx, drawer) {
        drawer.rotateModel(this, this.rotate);
        super.render(ctx);
    }
}
