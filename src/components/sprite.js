import { Component } from './../component';

export class Sprite extends Component {
    constructor(width, height, image, animations, speed = 1, play = null) {
        super();

        this.width = width;
        this.height = height;
        this.image = image;
        this.animations = animations;
        this.speed = speed;

        this.time = 1;
        this.stopped = true;
        this.frame = { x: 0, y: 0 };
        this.currentAnimation = 0;
        this.currentFrame = 0;

        this.frames = {
            width: this.image.width / this.width,
            height: this.image.height / this.height,
            total: (this.image.width / this.width) * (this.image.height / this.height)
        };

        if (play) {
            this.play(play);
        }
    }

    getNextFrame() {
        let currentAnimation = this.animations[this.currentAnimation];
        let currentFrame = currentAnimation.frames[this.currentFrame];

        if (this.frames.width - currentFrame >= 0) {
            this.frame.x = currentFrame - 1;
            this.frame.y = 0;
        } else {

            let delta = currentFrame - this.frames.width;
            this.frame.y = 1;

            while (delta > this.frames.width) {
                delta = delta - this.frames.width;
                this.frame.y++;
            }

            this.frame.x = delta - 1;
        }

        this.currentFrame++;

        if (this.currentFrame >= currentAnimation.frames.length) {
            this.currentFrame = 0;

            if (!currentAnimation.loop) {
                this.stopped = true;
            }
        }
    }

    play(animation) {
        let currentAnimation = this.animations.filter(anim => anim.name === animation);

        if (!!currentAnimation) {
            let index = this.animations.indexOf(currentAnimation[0]);

            if (this.currentAnimation != index) {
                this.time = 1;
                this.currentFrame = 0;
            }

            this.currentAnimation = index;
            this.stopped = false;
        }
    }

    stop() {
        this.stopped = true;
    }
}
