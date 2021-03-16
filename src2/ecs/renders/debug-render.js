import { Render } from './../render';

import { Body } from './../components/body';
import { Collision } from './../components/collision';
import { Motion } from './../components/motion';
import { Rotate } from './../components/rotate';

export class DebugRender extends Render {
    render(canvas, entity) {
        canvas.save();

        if (entity.hasComponent(Rotate) && entity.hasComponent(Body)) {
            canvas.rotate(
                entity.components.body.toRectangle(),
                entity.components.rotate.angle,
                entity.components.rotate.pivot
            );
        }

        if (entity.hasComponent(Body)) {
            canvas.drawText(
                `[${Math.round(entity.components.body.position.x)}, ${Math.round(entity.components.body.position.y)}, ${entity.components.rotate ? Math.round(entity.components.rotate.angle) : 0}°]`,
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

        canvas.restore();

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

        if (entity.hasComponent(Motion) && entity.hasComponent(Body)) {
            const v = entity.components.motion.velocity.clone();
            //v.multiply(50);
            canvas.drawLine(
                entity.components.body.center.x,
                entity.components.body.center.y,
                entity.components.body.center.x + v.x,
                entity.components.body.center.y + v.y,
                1,
                'red'
            );
        }
    }
}
