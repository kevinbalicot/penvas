import { Drawer } from './drawer';
import { Canvas } from './canvas';

export class Viewport extends Drawer {
    constructor(width, height, container) {
        super();

        this.element = document.createElement('canvas');
        this.element.width = width;
        this.element.height = height;

        this.ctx = this.element.getContext('2d');

        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;

        this.world = null;
        this.deadZoneX = 0;
        this.deadZoneY = 0;
        this.scaleX = 1;
        this.scaleY = 1;

        // Update mouse coordinates
        document.addEventListener('mousemove', event => {
            //mouse.ax = mouse.x + (this.x * this.scaleX);
            //mouse.ay = mouse.y + (this.y * this.scaleY);
        });

        container.appendChild(this.element);
    }

    setWorld(world, deadZoneX = null, deadZoneY = null) {
        if (!(world instanceof Canvas)) {
            throw new Error(`World has to be instances of Canvas.`);
        }

        this.world = world.element;
        this.deadZoneX = deadZoneX || this.width / 2;
        this.deadZoneY = deadZoneY || this.height / 2;

        // calculate scaleX and scaleY
    }

    follow(target) {
        // Follow target
        /*if (target.x - this.x + (this.deadZoneX / this.scaleX) > this.width / this.scaleX) {
            this.x = target.x - ((this.width / this.scaleX) - (this.deadZoneX / this.scaleX));
        } else if (target.x - (this.deadZoneX / this.scaleX) < this.x) {
            this.x = target.x - (this.deadZoneX / this.scaleX);
        }

        if (target.y - this.y + (this.deadZoneY / this.scaleY) > (this.height / this.scaleY)) {
            this.y = target.y - ((this.height / this.scaleY) - (this.deadZoneY / this.scaleY));
        } else if (target.y - (this.deadZoneY / this.scaleY) < this.y) {
            this.y = target.y - (this.deadZoneY / this.scaleY);
        }*/

        if (this.width < this.world.width) {
            if (target.x - this.x + this.deadZoneX > this.width) {
                this.x = target.x - (this.width - this.deadZoneX);
            } else if (target.x - this.deadZoneX < this.x) {
                this.x = target.x - this.deadZoneX;
            }

            // Rest into world
            if (this.x < 0) {
                this.x = 0;
            }

            if (this.x + (this.width / this.scaleX) > this.world.width) {
                this.x = this.world.width - (this.width / this.scaleX);
            }
        } else {
            this.x = 0;
        }

        if (this.height < this.world.height) {
            if (target.y - this.y + this.deadZoneY > this.height) {
                this.y = target.y - (this.height - this.deadZoneY);
            } else if (target.y - this.deadZoneY < this.y) {
                this.y = target.y - this.deadZoneY;
            }

            // Rest into world
            if (this.y < 0) {
                this.y = 0;
            }

            if (this.y + (this.height / this.scaleY) > this.world.height) {
                this.y = this.world.height - (this.height / this.scaleY);
            }
        } else {
            this.y = 0;
        }
    }

    render() {
        this.clearLayer();
        this.drawImage(
            this.world,
            this.x,
            this.y,
            this.width,
            this.height,
            0,
            0,
            this.width,
            this.height
        );
    }
}
