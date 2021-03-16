import Drawer2D from './drawers/2d';
import Drawer2DWebgl from './drawers/2d-webgl';
import DrawerNew2DWebgl from "./drawers/new-2d-webgl";

export default class Canvas {
    constructor(options = {}) {
        this.container = null;
        this.options = options;

        if (options.container && typeof options.container === 'string') {
            this.container = document.querySelector(options.container);
        } else if (options.container && options.container instanceof HTMLElement) {
            this.container = options.container;
        } else {
            this.container = document.body;
        }

        this.width = options.width || window.innerWidth;
        this.height = options.height || window.innerHeight;

        this.element = document.createElement('canvas');
        this.element.width = this.width;
        this.element.height = this.height;

        this.container.appendChild(this.element);

        if (options.context && options.context === '2d_webgl') {
            this.drawer = new Drawer2DWebgl(
                this.element.getContext('webgl'),
                this.element.width,
                this.element.height
            );
        } else if (options.context && options.context === 'new_2d_webgl') {
            this.drawer = new DrawerNew2DWebgl(
                this.element.getContext('webgl'),
                this.element.width,
                this.element.height,
                options
            );
        } else {
            this.drawer = new Drawer2D(
                this.element.getContext('2d'),
                this.element.width,
                this.element.height
            );
        }
    }
}
