import { UIElement } from './element';

export class UISection extends UIElement {
    constructor(id = null, classList = []) {
        super('section', null, id, classList);
    }
}
