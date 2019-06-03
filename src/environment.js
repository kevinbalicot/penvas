import { Entity } from './entity';
import { System } from './system';
import { Render } from './render';
import { EventEmitter } from './event-emitter';

export class Environment extends EventEmitter {
    constructor() {
        super();

        this.entities = [];
        this.systems = [];
        this.renders = [];
    }

    addEntity(entity) {
        if (entity instanceof Entity) {
            this.entities.push(entity);
        }

        return this;
    }

    removeEntity(entity) {
        if (entity instanceof Entity) {
            const index = this.entities.indexOf(entity);

            if (index >= 0) {
                this.entities.splice(index, 1);
            }
        }

        return this;
    }

    addSystem(system) {
        if (system instanceof System) {
            this.systems.push(system);
            system.environment = this;
        }

        return this;
    }

    removeSystem(system) {
        if (system instanceof System) {
            const index = this.systems.indexOf(system);

            if (index >= 0) {
                this.systems.splice(index, 1);
                system.environment = null;
            }
        }

        return this;
    }

    addRender(render) {
        if (render instanceof Render) {
            this.renders.push(render);
            render.environment = this;
        }

        return this;
    }

    removeRender(render) {
        if (render instanceof Render) {
            const index = this.renders.indexOf(render);

            if (index >= 0) {
                this.renders.splice(index, 1);
                render.environment = null;
            }
        }

        return this;
    }

    update(systemNames, delta) {
        let systems = [];

        if (!Array.isArray(systemNames)) {
            systemNames = [systemNames];
        }

        systemNames = systemNames.map(systemName => systemName.name || systemName);

        if (!systemNames.length) {
            systems = this.systems;
        } else {
            this.systems.forEach(system => {
                if (systemNames.find(systemName => systemName.toLowerCase() === system.constructor.name.toLowerCase())) {
                    systems.push(system);
                }
            });
        }

        systems.forEach(system => system.update(delta));

        return this;
    }

    render(renderNames, canvas) {
        let renders = [];

        if (!Array.isArray(renderNames)) {
            renderNames = [renderNames];
        }

        renderNames = renderNames.map(renderName => renderName.name || renderName);

        if (!renderNames.length) {
            renders = this.renders;
        } else {
            this.renders.forEach(render => {
                if (renderNames.find(renderName => renderName.toLowerCase() === render.constructor.name.toLowerCase())) {
                    renders.push(render);
                }
            });
        }

        this.entities.forEach(entity => {
            canvas.save();
            renders.forEach(render => render.render(canvas, entity));
            canvas.restore();
        });

        return this;
    }

    getEntities(componentNames) {
        let entities = [];

        if (!Array.isArray(componentNames)) {
            componentNames = [componentNames];
        }

        componentNames = componentNames.map(componentName => componentName.name || componentName);

        this.entities.forEach(entity => {
            if (componentNames.every(componentName => entity.components[componentName.toLowerCase()])) {
                entities.push(entity);
            }
        });

        return entities;
    }

    getEntity(id) {
        return this.entities.find(entity => entity.id === id);
    }
}
