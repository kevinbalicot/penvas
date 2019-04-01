import { UIElement } from './element';

export class UIButton extends UIElement {
    constructor(text, id = null, classList = []) {
        super('button', text, id, classList);
    }

    click() {
        this.element.click();
    }
}
