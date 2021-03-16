import Render from './../render';
import Body from './../components/body';
import Image from './../components/image';
import Drawer2DWebgl from "../../drawers/2d-webgl";

export default class ImageRender extends Render {
    render(canvas, entity) {
        if (entity.hasComponent(Image) && entity.hasComponent(Body)) {
            canvas.drawer.save();

            if (canvas.drawer instanceof Drawer2DWebgl) {
                canvas.drawer.drawImage(
                    entity.components.image.image,
                    0,
                    0,
                    entity.components.image.width,
                    entity.components.image.height,
                    entity.components.body.x,
                    entity.components.body.y,
                    entity.components.body.z || 0,
                    entity.components.body.width,
                    entity.components.body.height
                );
            } else {
                canvas.drawer.drawImage(
                    entity.components.image.image,
                    0,
                    0,
                    entity.components.image.width,
                    entity.components.image.height,
                    entity.components.body.x,
                    entity.components.body.y,
                    entity.components.body.width,
                    entity.components.body.height
                );
            }

            canvas.drawer.restore();
        }
    }
}
