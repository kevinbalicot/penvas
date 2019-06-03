import { Render } from './../render';

import { Body } from './../components/body';
import { Sprite } from './../components/sprite';

export class SpriteRender extends Render {
    render(canvas, entity) {
        if (entity.hasComponent(Sprite) && entity.hasComponent(Body)) {
            let currentAnimation = entity.components.sprite.animations[entity.components.sprite.currentAnimation];

            canvas.save();

            canvas.drawImage(
                entity.components.sprite.image,                                     // image
                entity.components.sprite.frame.x * entity.components.sprite.width,  // source x
                entity.components.sprite.frame.y * entity.components.sprite.height, // source y
                entity.components.sprite.width,                                     // source width
                entity.components.sprite.height,                                    // source height
                entity.components.body.position.x,                                  // destination x
                entity.components.body.position.y,                                  // destination y
                entity.components.body.width,                                       // destination width
                entity.components.body.height                                       // destination height
            );

            canvas.restore();
        }
    }
}
