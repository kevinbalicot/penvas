import Render from './../render';
import Rotate from './../components/rotate';
import Body from './../components/body';

export default class RotationRender extends Render {
    render(canvas, entity) {
        if (entity.hasComponent(Rotate) && entity.hasComponent(Body)) {
            canvas.drawer.rotate(
                entity.components.body,
                entity.components.rotate.angle,
                entity.components.rotate.pivot
            );
        }
    }
}
