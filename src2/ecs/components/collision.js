import Component from './../component';

export default class Collision extends Component {
    constructor(x, y, width, height) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.w = width;
        this.height = height;
        this.h = height;
        this.with = null;
    }
}