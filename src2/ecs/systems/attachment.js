import System from "../system";
import Body from "../components/body";
import Attach from "../components/attach";

export default class Attachment extends System {
    update() {
        this.environment.getEntities([Attach, Body]).forEach(entity => {
            for (let attachment of entity.components.attach.attachments) {
                if (attachment.hasComponent(Body)) {
                    attachment.components.body.x = entity.components.body.x;
                    attachment.components.body.y = entity.components.body.y;
                }
            }
        });
    }
}
