import { System } from './../system';
import { Vector } from './../geometry/vector';

import { Keyboard } from './../components/keyboard';
import { Motion } from './../components/motion';

export class Inputs extends System {
    update(delta) {
        const direction = new Vector(0, 0);

        if (this.environment.canvas.keyboard[90]) {
            direction.add(Vector.UP);
        }

        if (this.environment.canvas.keyboard[68]) {
            direction.add(Vector.RIGHT);
        }

        if (this.environment.canvas.keyboard[83]) {
            direction.add(Vector.DOWN);
        }

        if (this.environment.canvas.keyboard[81]) {
            direction.add(Vector.LEFT);
        }

        this.environment.getEntities([Keyboard, Motion]).forEach(entity => {
            entity.components.motion.direction = direction.clone().normalize();
        });
    }
}
