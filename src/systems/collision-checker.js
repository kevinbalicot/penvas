import { System } from './../system';
import { Utils } from './../utils';

import { Body } from './../components/body';
import { Collision } from './../components/collision';

export class CollisionChecker extends System {
    update() {
        const entities = this.environment.getEntities([Body, Collision]);

        entities.forEach(entity => {
            const others = entities.filter(e => e.id != entity.id);
            const collision = Utils.hasCollisions(this.getHitbox(entity), others.map(o => this.getHitbox(o)));

            entity.components.collision.with = null;
            if (collision) {
                entity.components.collision.with = this.environment.getEntity(collision.id);
            }
        });
    }

    getHitbox(entity) {
        return {
            id: entity.id,
            x: entity.components.collision.x + entity.components.body.position.x,
            y: entity.components.collision.y + entity.components.body.position.y,
            width: entity.components.collision.width,
            height: entity.components.collision.height
        };
    }
}
