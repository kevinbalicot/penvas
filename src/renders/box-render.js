import { Render } from './../render';

import { Body } from './../components/body';

export class BoxRender extends Render {
    render(canvas, delta) {
        const ctx = canvas.ctx;
        const entities = this.environment.getEntities([Body.name]);

        entities.forEach(entity => {
            ctx.save();

            if (entity.components.collision.with) {
                ctx.strokeStyle = "red"
            }

            ctx.strokeRect(
                entity.components.body.position.x,
                entity.components.body.position.y,
                entity.components.body.width,
                entity.components.body.height
            );

            ctx.restore();
        });
    }
}
