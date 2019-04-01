import { UIElement } from './element';

export class UIContainer extends UIElement {
    constructor(parent, id = null, classList = []) {
        super('div', null, id, classList);

        this.styles = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        parent.appendChild(this.element);
    }
}
