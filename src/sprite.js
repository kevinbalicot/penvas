import { Model } from './model';

/**
 * The class to use sprite image
 * You can add animations
 * @example
 * const image = Loader.get('my-sprite'); // see Loader documentation
 * const animation = [{ frames: [9, 10, 11, 12], name: 'walk', loop: true }];
 * let sprite = new Sprite(10, 10, 20, 20, image, animation);
 *
 * sprite.play('walk');
 * sprite.render();
 */
export class Sprite extends Model {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} tileWidth - width tile
     * @param {number} tileHeight - height tile
     * @param {Image} image
     * @param {Array<Object>} animations - list of animations
     * @example
     * new Sprite(0, 0, 20, 20, image, [{ frames: [9, 10, 11, 12], name: 'walk', loop: true, flip: false }]);
     * @param {Object} [hitbox]
     * @param {Object} [hitbox.x]
     * @param {Object} [hitbox.y]
     * @param {Object} [hitbox.width]
     * @param {Object} [hitbox.height]
     */
    constructor (x, y, tileWidth, tileHeight, image, animations, hitbox) {
        super(x, y, tileWidth, tileHeight, hitbox);

        /** @type {Image} */
        this.image = image;
        /** @type {Array<Object>} */
        this.animations = animations;

        this.time = 1;
        this.stopped = true;
        this.frame = { x: 0, y: 0 };
        this.frames = {
            width: image.width / tileWidth,
            height: image.height / tileHeight,
            total: (image.width / tileWidth) * (image.height / tileHeight)
        };

        this.currentAnimation = 0;
        this.currentFrame = 0;
    }

    /**
     * @private
     */
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

    /**
     * @param {number} dt - Delta between two frames
     */
    step (dt) {
        this.time += dt;

        if (this.time >= 0.25 && !this.stopped) {
            this.getNextFrame();
            this.time = 0;
        }
    }

    /**
     * Play animation
     * @param {String} animation
     */
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

    /**
     * Stop animation
     */
    stop () {
        this.stopped = true;
    }

    /**
     * Reset animation
     */
    reset () {
        this.frame = { x: 0, y: 0 };
    }

    /**
     * Render the sprite
     * @param {RenderingContext} context
     */
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
            this.frame.x * this.width,  // pos x
            this.frame.y * this.height, // pos y
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
