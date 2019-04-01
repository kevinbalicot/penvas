import { Vector } from './../geometry/vector';
import { Component } from './../component';

export class Body extends Component {
    constructor(position, width, height) {
        super();

        if (!(position instanceof Vector)) {
            throw new Error(`Position has to be an instance of Vector.`);
        }

        this.position = position;
        this.width = width;
        this.height = height;
    }

    get center() {
        return new Vector(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
    }
}
