'use strict';

import { Model } from './model';

export class Sprite extends Model {

    /**
     * @param x
     * @param y
     * @param width : width tile
     * @param height : height tile
     * @param image
     * @param animations : list of animations
     *                      example : { frames: [9, 10, 11, 12], name: 'walk', loop: true }
     */
    constructor (x, y, width, height, image, animations, hitbox) {
        super(x, y, width, height, hitbox);
        this.image = image;
        this.animations = animations;
        this.time = 1;
        this.stopped = true;

        this.frame = { x: 0, y: 0 };
        this.frames = {
            width: image.width / width,
            height: image.height / height,
            total: (image.width / width) * (image.height / height)
        };

        this.currentAnimation = 0;
        this.currentFrame = 0;
    }

    getNextFrame () {
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

    step (dt) {
        this.time += dt;

        if (this.time >= 0.25 && !this.stopped) {
            this.getNextFrame();
            this.time = 0;
        }
    }

    play (animation) {
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

    stop () {
        this.stopped = true;
    }

    reset () {
        this.frame = { x: 0, y: 0 };
    }

    render (context = null) {
        let ctx = context || this.parent.ctx;
        let currentAnimation = this.animations[this.currentAnimation];
        ctx.save();

        if (!!currentAnimation && !!currentAnimation.flip) {
            ctx.translate((this.x * 2) + this.width, 1);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(
            this.image,     // image
            this.frame.x * this.width,              // pos x
            this.frame.y * this.height,             // pos y
            this.width,     // frame width
            this.height,    // frame height
            this.x,         // destination x
            this.y,         // destination y
            this.width,     // destination frame width
            this.height     // destination frame height
        );
        ctx.restore();
    }
}
