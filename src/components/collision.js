import { Component } from './../component';

export class Collision extends Component {
    constructor(x, y, width, height) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.with = null;
    }
}
