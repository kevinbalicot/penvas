import loader from './../../loader';
import Component from './../component';

export default class Image extends Component {
    constructor(width, height, image) {
        super();

        this.width = width;
        this.height = height;

        this.image = image;
        if (typeof image === 'string') {
            this.image = loader.get(image);
        }
    }
}
