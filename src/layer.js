import { Environment } from './environment';

export class Layer extends Environment {
    step(canvas, delta) {}
    stepRender(canvas, delta) {}
    keyDown(event) {}
    keyUp(event) {}
    gamepadUp(event) {}
    gamepadDown(event) {}
}
