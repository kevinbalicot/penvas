import { System } from './../system';
import { Movement } from './movement';

import { Vector } from './../geometry/vector';

import { Collision } from './../components/collision';
import { Body } from './../components/body';
import { Physic } from './../components/physic';

export class PhysicChecker extends System {
    update(delta) {
        const entities = this.environment.getEntities([Body.name, Collision.name, Physic.name]);
        const force = (new Vector(1, 1)).multiply(-1);

        entities.forEach(entity => {
            if (
                entity.components.collision.with &&
                entity.components.collision.with.components.physic &&
                entity.components.physic &&
                entity.components.motion
            ) {
                Movement.move(entity, delta, force.clone().multiply(entity.components.collision.with.components.physic.force));
            }
        });
    }
}
