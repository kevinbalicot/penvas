import System from './../system';
import Movement from './movement';
import Collision from './../components/collision';
import Body from './../components/body';
import Physic from './../components/physic';
import Vector2 from "../../geometry/vector2";

export default class PhysicChecker extends System {
    update(delta) {
        const force = new Vector2(-1, -1);

        this.environment.getEntities([Body, Collision, Physic]).forEach(entity => {
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
