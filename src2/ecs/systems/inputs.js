import { keyboard } from '../../io/io';
import KEYS from '../../io/keys';
import System from './../system';
import Vector from './../../geometry/vector2';
import Keyboard from "../components/keyboard";
import Motion from "../components/motion";

export default class Inputs extends System {
    update() {
        const direction = new Vector(0, 0);

        if (
            keyboard[KEYS.Z] ||
            keyboard[KEYS.UP]
        ) {
            direction.add(Vector.UP);
        }

        if (
            keyboard[KEYS.D] ||
            keyboard[KEYS.RIGHT]
        ) {
            direction.add(Vector.RIGHT);
        }

        if (
            keyboard[KEYS.S] ||
            keyboard[KEYS.DOWN]
        ) {
            direction.add(Vector.DOWN);
        }

        if (
            keyboard[KEYS.Q] ||
            keyboard[KEYS.LEFT]
        ) {
            direction.add(Vector.LEFT);
        }

        this.environment.getEntities([Keyboard, Motion]).forEach(entity => {
            entity.components.motion.direction = direction.clone().normalize();
        });
    }
}
