import System from './../system';
import Body from './../components/body';
import Motion from './../components/motion';
import Utils from "../../utils";

export default class Movement extends System {
    update(delta) {
        this.environment.getEntities([Body, Motion]).forEach(entity => Movement.move(entity, delta));
    }

    static move(entity, delta, force = null) {
        const velocity = Utils.toVector(entity.components.motion.velocity).clone();
        const direction = Utils.toVector(entity.components.motion.direction).clone();

        velocity.multiply(delta);
        velocity.multiply(direction);

        /*if (null !== force) {
            force = Utils.toVector(force);
            vector.multiply(force);
        }*/

        if (entity.components.body) {
            const position = Utils.toVector(entity.components.body).clone();
            position.add(velocity);

            entity.components.body.x = position.x;
            entity.components.body.y = position.y;
        }
    }
}
