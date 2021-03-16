import Component from './../component';

export default class Physic extends Component {
    constructor(force) {
        super();

        this.force = force;
        this.f = force;
    }
}
