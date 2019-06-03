import { Container } from './container';
import { CollisionChecker } from './helper/collision-checker';
import { Renderer } from './helper/renderer';
import { Viewport } from './viewport';
import { UIContainer } from './ui/container';

export class Scene {
    constructor(application, options = {}) {
        const {
            x, y,
            width, height,
            background,
            scaleX, scaleY,
            deadZoneX, deadZoneY,
            imageSmoothingEnabled
        } = options;

        this.parent = application;
        this.canvas = application.canvas;
        this.options = options;

        this.world = new Container({ x, y, width, height, background });
        this.collisions = new CollisionChecker();
        this.renderer = new Renderer(this.world);
        this.viewport = new Viewport(x || 0, y || 0, this.canvas, scaleX, scaleY, deadZoneX, deadZoneY);
        this.uiContainer = new UIContainer(this.parent.container);

        if (scaleX || scaleY) {
            this.parent.ctx.scale(scaleX || 1, scaleY || 1);
        }

        if (undefined !== imageSmoothingEnabled) {
            this.world.ctx.imageSmoothingEnabled = imageSmoothingEnabled;
            this.parent.ctx.imageSmoothingEnabled = imageSmoothingEnabled;
        }
    }

    create(data = {}) {
        if (!!this.options.create && typeof this.options.create === 'function') {
            this.options.create.call(this, data);
        }
    }

    step(dt) {
        if (!!this.options.step && typeof this.options.step === 'function') {
            this.options.step.call(this, dt);
        }
    }

    render(dt) {
        if (!!this.options.render && typeof this.options.render === 'function') {
            this.options.render.call(this, dt);
        }

        this.viewport.drawImage(this.world);
    }

    onKeyup(e, io) {
        if (!!this.options.onKeyup && typeof this.options.onKeyup === 'function') {
            this.options.onKeyup.call(this, e, io);
        }
    }

    onKeydown(e, io) {
        if (!!this.options.onKeydown && typeof this.options.onKeydown === 'function') {
            this.options.onKeydown.call(this, e, io);
        }
    }

    destroy() {
        this.parent.container.removeChild(this.uiContainer.element);
    }
}
