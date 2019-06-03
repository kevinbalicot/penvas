import { Render } from './../render';

import { Body } from './../components/body';
import { Collision } from './../components/collision';

export class BoxRender extends Render {
    render(canvas, entity) {
        if (entity.hasComponent(Body)) {
            canvas.drawText(
                `[${Math.round(entity.components.body.position.x)}, ${Math.round(entity.components.body.position.y)}]`,
                entity.components.body.position.x,
                entity.components.body.position.y - 10,
                '10px',
                'sans-serif'
            );

            canvas.drawRect(
                entity.components.body.position.x,
                entity.components.body.position.y,
                entity.components.body.width,
                entity.components.body.height,
                1
            );
        }

        if (entity.hasComponent(Collision)) {
            canvas.drawText(
                `[${Math.round(entity.components.body.position.x + entity.components.collision.x)}, ${Math.round(entity.components.body.position.y + entity.components.collision.y)}]`,
                entity.components.body.position.x + entity.components.collision.x + entity.components.collision.width,
                entity.components.body.position.y + entity.components.collision.y + entity.components.collision.height + 14,
                '10px',
                'sans-serif',
                'blue',
                '',
                'right'
            );

            canvas.drawRect(
                entity.components.body.position.x + entity.components.collision.x,
                entity.components.body.position.y + entity.components.collision.y,
                entity.components.collision.width,
                entity.components.collision.height,
                1,
                entity.components.collision.with ? 'red' : 'blue'
            );
        }
    }
}
