import Entity from './entity';
import System from './system';
import Render from './render';
import EventEmitter from './../event-emitter';
import EntityGroup from "./entity-group";

export default class Environment extends EventEmitter {
    constructor() {
        super();

        this.entities = [];
        this.systems = [];
        this.renders = [];
    }

    addEntity(entity) {
        if (entity instanceof Entity || entity instanceof EntityGroup) {
            this.entities.push(entity);
        }

        return this;
    }

    addEntities(entities) {
        if (!Array.isArray(entities)) {
            entities = [entities];
        }

        for (let entity of entities) {
            this.addEntity(entity);
        }

        return this;
    }

    removeEntity(entity) {
        if (entity instanceof Entity || entity instanceof EntityGroup) {
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

    addSystems(systems) {
        if (!Array.isArray(systems)) {
            systems = [systems];
        }

        for (let system of systems) {
            this.addSystem(system);
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

    addRenders(renders) {
        if (!Array.isArray(renders)) {
            renders = [renders];
        }

        for (let render of renders) {
            this.addRender(render);
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

    update(delta, systemNames = []) {
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

    render(canvas, renderNames = []) {
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

        for (let entity of this._flattenEntities()) {
            canvas.drawer.save();
            renders.forEach(render => render.render(canvas, entity));
            canvas.drawer.restore();
        }

        return this;
    }

    getEntities(componentNames) {
        let entities = [];

        if (!Array.isArray(componentNames)) {
            componentNames = [componentNames];
        }

        componentNames = componentNames.map(componentName => componentName.name || componentName);

        for (let entity of this._flattenEntities()) {
            if (componentNames.every(componentName => entity.components[componentName.toLowerCase()])) {
                entities.push(entity);
            }
        }

        return entities;
    }

    getEntity(id) {
        return this.entities.find(entity => {
            if (entity instanceof EntityGroup) {
                return entity.getEntity(id);
            }

            return entity.id === id;
        });
    }

    getEntityGroup(name) {
        return this.entities.find(entity => {
            if (entity instanceof EntityGroup) {
                return entity.name === name;
            }

            return false;
        });
    }

    getSystem(system) {
        return this.systems.find(s => s.constructor.name.toLowerCase() === String(system.name || system).toLowerCase())
    }

    getRender(render) {
        return this.renders.find(r => r.constructor.name.toLowerCase() === String(render.name || render).toLowerCase())
    }

    _flattenEntities() {
        const result = [];
        for (let entity of this.entities) {
            if (entity instanceof EntityGroup) {
                result.push(...entity.entities);
            } else {
                result.push(entity);
            }
        }

        return result;
    }
}
