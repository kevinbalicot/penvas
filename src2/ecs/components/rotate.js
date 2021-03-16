import Component from './../component';

export default class Rotate extends Component {
    constructor(angle, pivot) {
        super();

        this.angle = angle;
        this.a = angle;
        this.pivot = pivot;
        this.p = pivot;
    }
}
