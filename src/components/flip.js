import { Component } from './../component';

export class Flip extends Component {
    constructor(horizontalFlipped, verticalFlipped) {
        super();

        this.horizontalFlipped = horizontalFlipped;
        this.verticalFlipped = verticalFlipped;
    }
}
