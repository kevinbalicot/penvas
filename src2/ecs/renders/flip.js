import Render from './../render';
import Flip from './../components/flip';
import Body from './../components/body';

export default class FlipRender extends Render {
    render(canvas, entity) {
        if (entity.hasComponent(Flip) && entity.hasComponent(Body)) {
            if (entity.components.flip.horizontalFlipped) {
                canvas.drawer.horizontalFlip(entity.components.body);
            }

            if (entity.components.flip.verticalFlipped) {
                canvas.drawer.verticalFlip(entity.components.body);
            }
        }
    }
}
