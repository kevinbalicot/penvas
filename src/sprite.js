import { Model } from './model';

/**
 * The class to use sprite image
 * You can add animations
 * @example
 * const image = loader.get('my-sprite'); // see Loader documentation
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
     * @param {Object} [hitbox={}]
     * @param {number} [hitbox.x]
     * @param {number} [hitbox.y]
     * @param {number} [hitbox.width]
     * @param {number} [hitbox.height]
     *
     * @example
     * new Sprite(0, 0, 20, 20, image, [{ frames: [9, 10, 11, 12], name: 'walk', loop: true, flip: false }]);
     */
    constructor(x, y, tileWidth, tileHeight, image, animations, hitbox = {}) {
        super(x, y, tileWidth, tileHeight, hitbox);

        /** @type {Image} */
        this.image = image;
        /** @type {Array<Object>} */
        this.animations = animations;

        /** @type {number} */
        this.time = 1;

        /** @type {boolean} */
        this.stopped = true;

        /** @type {Object} */
        this.frame = { x: 0, y: 0 };

        /** @type {Object} */
        this.frames = {
            width: image.width / tileWidth,
            height: image.height / tileHeight,
            total: (image.width / tileWidth) * (image.height / tileHeight)
        };

        /** @type {number} */
        this.currentAnimation = 0;

        /** @type {number} */
        this.currentFrame = 0;
    }

    /**
     * @private
     */
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

    /**
     * @param {number} dt - Delta between two frames
     */
    step(dt) {
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

    /**
     * Stop animation
     */
    stop() {
        this.stopped = true;
    }

    /**
     * Reset animation
     */
    reset() {
        this.frame = { x: 0, y: 0 };
    }

    /**
     * Render the sprite
     * @param {RenderingContext} [ctx=null]
     * @param {Drawer} [drawer=null]
     */
    render(ctx = null, drawer = null) {
        ctx = ctx || this.parent.ctx;
        drawer = drawer || this.parent;

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

    /**
     * @return {Object}
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     * @property {Object} hitbox
     * @property {Image} image
     * @property {Object} animations
     * @property {number} time
     * @property {boolean} stopped
     * @property {Object} frame
     * @property {number} currentAnimation
     * @property {number} currentFrame
     */
    serialize() {
        return Object.assign(super.serialize(), {
            image: this.image,
            animations: this.animations,
            time: this.time,
            stopped: this.stopped,
            frame: this.frame,
            currentAnimation: this.currentAnimation,
            currentFrame: this.currentFrame
        });
    }

    /**
     * @param {Object} data
     * @param {number} data.x
     * @param {number} data.y
     * @param {number} data.width
     * @param {number} data.height
     * @param {Object} data.hitbox
     * @param {boolean} data.collision
     * @param {Image} data.image
     * @param {Object} data.animations
     * @param {number} data.time
     * @param {boolean} data.stopped
     * @param {Object} data.frame
     * @param {number} data.currentAnimation
     * @param {number} data.currentFrame
     * @return {Sprite}
     */
    static deserialize({
        x,
        y,
        width,
        height,
        hitbox,
        collision,
        image,
        animations,
        time,
        stopped,
        frame,
        currentAnimation,
        currentFrame
    }) {
        const sprite = new Sprite(x, y, width, height, image, animations, hitbox);

        sprite.collision = collision;
        sprite.time = time;
        sprite.stopped = stopped;
        sprite.frame = frame;
        sprite.currentAnimation = currentAnimation;
        sprite.currentFrame = currentFrame;

        return sprite;
    }
}
