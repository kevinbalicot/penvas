import Component from './../component';

export default class Points extends Component {
    constructor(points = {}) {
        super();

        this.points = {};

        for (let name in points) {
            this.points[name] = points[name];
        }
    }

    add(name, point) {
        this.points[name] = point;
    }

    get(name) {
        return this.points[name];
    }

    has(name) {
        return !!this.get(name);
    }
}
