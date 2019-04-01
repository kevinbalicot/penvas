// http://beej.us/blog/data/javascript-gamepad/

import { System } from './../system';
import { Vector } from './../geometry/vector';

import { Gamepad } from './../components/gamepad';
import { Motion } from './../components/motion';

export class GamepadInputs extends System {
    update() {
        const entities = this.environment.getEntities([Gamepad.name, Motion.name]);
        entities.forEach(entity => {
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

                if (GamepadInputs.axeWithDeadzone(gamepad.axes[0]) || GamepadInputs.axeWithDeadzone(gamepad.axes[1])) {
                    direction = new Vector(gamepad.axes[0], gamepad.axes[1]);
                }

                entity.components.motion.direction = direction.clone().normalize();
            }
        });
    }

    static axeWithDeadzone(axe, deadzone = 0.2) {
        if (Math.abs(axe) < deadzone) {
            return 0;
        }

        axe = axe - Math.sign(axe) * deadzone;
        axe /= (1.0 - deadzone);

        return axe;
    }
}
