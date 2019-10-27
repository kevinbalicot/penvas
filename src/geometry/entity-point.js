import { Point } from './point';

import { Flip } from './../components/flip';
import { Utils } from './../utils';
import { Entity } from './../entity';

export class EntityPoint extends Point {
    constructor(entity, x, y) {
        super(x, y);

        if (!(entity instanceof Entity)) {
            throw new Error(`Entity has to be an instance of Entity.`);
        }

        this.entity = entity;
    }

    get x() {
        let point = { x: this._x, y: this._y };
        if (this.entity.hasComponent(Flip) && this.entity.components.flip.horizontalFlipped) {
            point = Utils.horizontalFlipPoint(point, this.entity.components.body.incenter);
        }

        return point.x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        let point = { x: this._x, y: this._y };
        if (this.entity.hasComponent(Flip) && this.entity.components.flip.verticalFlipped) {
            point = Utils.verticalFlipPoint(point, this.entity.components.body.incenter);
        }

        return point.y;
    }

    set y(value) {
        this._y = value;
    }

    clone() {
        return new EntityPoint(this.entity, this._x, this._y);
    }
}
