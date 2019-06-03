import { Render } from './../render';

import { Flip } from './../components/flip';
import { Body } from './../components/body';

export class FlipRender extends Render {
    render(canvas, entity) {
        if (entity.hasComponent(Flip) && entity.hasComponent(Body)) {
            if (entity.components.flip.horizontalFlipped) {
                canvas.horizontalFlip(entity.components.body.toRectangle());
            }

            if (entity.components.flip.verticalFlipped) {
                canvas.verticalFlip(entity.components.body.toRectangle());
            }
        }
    }
}
