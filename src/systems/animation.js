import { System } from './../system';

import { Sprite } from './../components/sprite';

export class Animation extends System {
    update(delta) {
        const entities = this.environment.getEntities([Sprite.name]);

        entities.forEach(entity => {
            entity.components.sprite.time += delta;

            if (entity.components.sprite.time >= entity.components.sprite.speed && !entity.components.sprite.stopped) {
                entity.components.sprite.getNextFrame();
                entity.components.sprite.time = 0;
            }
        });
    }
}
