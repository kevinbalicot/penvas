import { Component } from './../component';

import { Vector } from './../geometry/vector';

export class Motion extends Component {
    constructor(velocity, direction) {
        super();

        if (!(velocity instanceof Vector) || !(direction instanceof Vector)) {
            throw new Error(`Velocity and Direction has to be instances of Vector.`);
        }

        this.velocity = velocity;
        this.direction = direction;
    }
}
