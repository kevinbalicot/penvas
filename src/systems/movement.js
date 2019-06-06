import { System } from './../system';

import { Body } from './../components/body';
import { Motion } from './../components/motion';

export class Movement extends System {
    update(delta) {
        this.environment.getEntities([Body, Motion]).forEach(entity => Movement.move(entity, delta));
    }

    static move(entity, delta, force = null) {
        const velocity = entity.components.motion.velocity.clone();
        const vector = velocity.multiply(delta);

        if (null !== force && force instanceof Vector) {
            vector.multiply(force);
        }

        if (entity.components.body) {
            entity.components.body.position.add(vector);
        }
    }
}
