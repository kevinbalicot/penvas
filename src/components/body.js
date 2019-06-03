import { Vector } from './../geometry/vector';
import { Rectangle } from './../geometry/rectangle';

import { Component } from './../component';

export class Body extends Component {
    constructor(position, width, height) {
        super();

        this.position = position;
        this.width = width;
        this.height = height;
    }

    get position() {
        return this._position;
    }

    set position(position) {
        if (!(position instanceof Vector)) {
            throw new Error(`Position has to be an instance of Vector.`);
        }

        this._position = position;
    }

    get center() {
        return new Vector(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
    }

    get incenter() {
        return new Vector(this.width / 2, this.height / 2);
    }

    toRectangle() {
        return new Rectangle(this.position.x, this.position.y, this.width, this.height);
    }
}
