import Component from "../component";

export default class Attach extends Component {
    constructor(attachments = []) {
        super();

        if (!Array.isArray(attachments)) {
            attachments = [attachments];
        }

        this.attachments = attachments;
        this.a = attachments;
    }
}
