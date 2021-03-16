// http://beej.us/blog/data/javascript-gamepad/

import System from './../system';
import Vector from './../../geometry/vector2';
import Gamepad from './../components/gamepad';
import Motion from './../components/motion';

export default class GamepadInputs extends System {
    constructor(deadZone = 0.2) {
        super();

        this.deadZone = deadZone;
    }

    update() {
        this.environment.getEntities([Gamepad, Motion]).forEach(entity => {
            const gamepad = this.environment.canvas.gamepads.find(g => g.id === entity.components.gamepad.id);

            if (gamepad) {
                let direction = new Vector(0, 0);

                if (gamepad.axes[7] < 0) {
                    direction.add(Vector.UP);
                }

                if (gamepad.axes[6] > 0) {
                    direction.add(Vector.RIGHT);
                }

                if (gamepad.axes[7] > 0) {
                    direction.add(Vector.DOWN);
                }

                if (gamepad.axes[6] < 0) {
                    direction.add(Vector.LEFT);
                }

                if (
                    GamepadInputs.axeWithDeadZone(gamepad.axes[0], this.deadZone) ||
                    GamepadInputs.axeWithDeadZone(gamepad.axes[1], this.deadZone)
                ) {
                    direction = new Vector(gamepad.axes[0], gamepad.axes[1]);
                }

                entity.components.motion.direction = direction.clone().normalize();
            }
        });
    }

    static axeWithDeadZone(axe, deadZone = 0.2) {
        if (Math.abs(axe) < deadZone) {
            return 0;
        }

        axe = axe - Math.sign(axe) * deadZone;
        axe /= (1.0 - deadZone);

        return axe;
    }
}
