import Component from './../component';

export default class Flip extends Component {
    constructor(horizontalFlipped = false, verticalFlipped = false) {
        super();

        this.horizontalFlipped = horizontalFlipped;
        this.hf = horizontalFlipped;
        this.verticalFlipped = verticalFlipped;
        this.vf = verticalFlipped;
    }
}
