import { Render } from './../render';

import { Rotate } from './../components/rotate';
import { Body } from './../components/body';

export class RotationRender extends Render {
    render(canvas, entity) {
        if (entity.hasComponent(Rotate) && entity.hasComponent(Body)) {
            canvas.rotate(
                entity.components.body.toRectangle(),
                entity.components.rotate.angle,
                entity.components.rotate.pivot
            );
        }
    }
}
