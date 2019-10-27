import { Environment } from './environment';

export class Layer extends Environment {
    constructor() {
        super();

        this.canvas = null;
    }

    begin() {}
    ending() {}
    step(delta) {}
    stepRender(delta) {}
    keyDown(event) {}
    keyUp(event) {}
    mouseDown(event) {}
    mouseUp(event) {}
    gamepadUp(event) {}
    gamepadDown(event) {}
    mouseMove(event) {}
}
