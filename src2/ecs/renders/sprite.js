import Render from './../render';
import Body from './../components/body';
import Sprite from './../components/sprite';
import Drawer2DWebgl from "../../drawers/2d-webgl";

export default class SpriteRender extends Render {
    render(canvas, entity) {
        if (entity.hasComponent(Sprite) && entity.hasComponent(Body)) {
            canvas.drawer.save();

            if (canvas.drawer instanceof Drawer2DWebgl) {
                canvas.drawer.drawImage(
                    entity.components.sprite.image,
                    entity.components.sprite.frame.x * entity.components.sprite.width,
                    entity.components.sprite.frame.y * entity.components.sprite.height,
                    entity.components.sprite.width,
                    entity.components.sprite.height,
                    entity.components.body.x,
                    entity.components.body.y,
                    entity.components.body.z || 0,
                    entity.components.body.width,
                    entity.components.body.height
                );
            } else {
                canvas.drawer.drawImage(
                    entity.components.sprite.image,
                    entity.components.sprite.frame.x * entity.components.sprite.width,
                    entity.components.sprite.frame.y * entity.components.sprite.height,
                    entity.components.sprite.width,
                    entity.components.sprite.height,
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
