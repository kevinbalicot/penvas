import Component from './../component';

export default class Motion extends Component {
    constructor(direction, velocity) {
        super();

        this.direction = direction;
        this.d = direction;
        this.velocity = velocity;
        this.v = velocity;
    }
}
