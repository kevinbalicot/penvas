import { Vector } from './../geometry/vector';
import { Component } from './../component';

export class Physic extends Component {
    constructor(force = null) {
        super();

        if (force && !(force instanceof Vector)) {
            throw new Error(`Force has to be an instance of Vector.`);
        }

        this.force = force || new Vector(1, 1);
    }
}
