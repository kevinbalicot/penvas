import { Component } from './../component';

import { Point } from './../geometry/point';

export class Rotate extends Component {
    constructor(angle, pivot) {
        super();

        this.angle = angle;
        this.pivot = pivot;
    }

    get angle() {
        return this._angle;
    }

    set angle(angle) {
        this._angle = angle % 360;
    }

    get pivot() {
        return this._pivot;
    }

    set pivot(pivot) {
        if (!(pivot instanceof Point)) {
            throw new Error(`Pivot has to be an instance of Point.`);
        }

        this._pivot = pivot;
    }
}
