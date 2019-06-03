import { System } from './../system';

import { Sprite } from './../components/sprite';

export class Animation extends System {
    update(delta) {
        this.environment.getEntities([Sprite]).forEach(entity => {
            entity.components.sprite.time += delta;

            if (entity.components.sprite.time >= entity.components.sprite.speed && !entity.components.sprite.stopped) {
                entity.components.sprite.getNextFrame();
                entity.components.sprite.time = 0;
            }
        });
    }
}
