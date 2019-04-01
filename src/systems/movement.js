import { System } from './../system';

import { Collision } from './../components/collision';
import { Motion } from './../components/motion';

export class Movement extends System {
    update(delta) {
        const entities = this.environment.getEntities([Collision.name, Motion.name]);

        entities.forEach(entity => Movement.move(entity, delta));
    }

    static move(entity, delta, force = null) {
        const direction = entity.components.motion.direction.clone();
        const velocity = entity.components.motion.velocity.clone();
        const vector = velocity.multiply(direction).multiply(delta);

        if (null !== force && force instanceof Vector) {
            vector.multiply(force);
        }

        if (entity.components.body) {
            entity.components.body.position.add(vector);
        }
    }
}
