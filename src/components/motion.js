import { Component } from './../component';

import { Vector } from './../geometry/vector';

export class Motion extends Component {
    constructor(velocity) {
        super();

        if (!(velocity instanceof Vector)) {
            throw new Error(`Velocity has to be instances of Vector.`);
        }

        this.velocity = velocity;
    }
}
