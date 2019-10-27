import { Component } from './../component';
import { Point } from './../geometry/point';

export class Points extends Component {
    constructor(points = {}) {
        super();

        this.points = {};

        for (let name in points) {
            if (!(points[name] instanceof Point)) {
                throw new Error(`Point has to be an instance of Point.`);
            }

            this.points[name] = points[name];
        }
    }

    add(name, point) {
        if (!(point instanceof Point)) {
            throw new Error(`Point has to be an instance of Point.`);
        }

        this.points[name] = point;
    }

    get(name) {
        return this.points[name];
    }

    has(name) {
        return !!this.get(name);
    }
}
