import Point from './point';

export default class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get direction() {
        return Math.atan2(this.x, this.y);
    }

    set direction(radian) {
        this.x = Math.cos(radian) * this.magnitude;
        this.y = Math.sin(radian) * this.magnitude;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set magnitude(magnitude) {
        this.x = Math.cos(this.direction) * magnitude;
        this.y = Math.sin(this.direction) * magnitude;
    }

    add(value) {
        if (value instanceof Vector2 || value instanceof Point) {
            this.x += value.x;
            this.y += value.y;
        } else {
            this.x += value;
            this.y += value;
        }

        return this;
    }

    subtract(value) {
        if (value instanceof Vector2 || value instanceof Point) {
            this.x -= value.x;
            this.y -= value.y;
        } else {
            this.x -= value;
            this.y -= value;
        }

        return this;
    }

    multiply(value) {
        if (value instanceof Vector2 || value instanceof Point) {
            this.x *= value.x;
            this.y *= value.y;
        } else {
            this.x *= value;
            this.y *= value;
        }

        return this;
    }

    divide(value) {
        if (value instanceof Vector2 || value instanceof Point) {
            this.x /= value.x;
            this.y /= value.y;
        } else {
            this.x /= value;
            this.y /= value;
        }

        return this;
    }

    flip() {
        const tmp = this.x;
        this.x = this.y;
        this.y = tmp;

        return this;
    }

    normalize() {
        const by = Math.sqrt(this.x * this.x + this.y * this.y);
        if (0 === by) {
            return this;
        }

        this.x /= by;
        this.y /= by;

        return this;
    }

    apply(fnct) {
        if (typeof fnct === 'function') {
            this.x = fnct(this.x);
            this.y = fnct(this.y);
        }

        return this;
    }

    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);

        return this;
    }

    max(max) {
        if (this.x > max) {
            this.x = max;
        }

        if (this.y > max) {
            this.y = max;
        }

        return this;
    }

    min(min) {
        if (this.x < min) {
            this.x = min;
        }

        if (this.y < min) {
            this.y = min;
        }

        return this;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    toString() {
        return `x: ${this.x}, y: ${this.y}`;
    }

    toArray() {
        return [this.x, this.y];
    }

    toJSON() {
        return { x: this.x, y: this.y };
    }

    isEqual(v, y = null) {
        if (v instanceof Vector2) {
            return v.x === this.x && v.y === this.y;
        }

        return v === this.x && y === this.y;
    }

    static get UP() {
        return new Vector2(0, -1);
    }

    static get DOWN() {
        return new Vector2(0, 1);
    }

    static get LEFT() {
        return new Vector2(-1, 0);
    }

    static get RIGHT() {
        return new Vector2(1, 0);
    }

    static get UP_LEFT() {
        return new Vector2(-1, -1);
    }

    static get DOWN_LEFT() {
        return new Vector2(-1, 1);
    }

    static get UP_RIGHT() {
        return new Vector2(1, -1);
    }

    static get DOWN_RIGHT() {
        return new Vector2(1, 1);
    }

    static get ZERO() {
        return new Vector2(0, 0);
    }

    static get ONE() {
        return new Vector2(1, 1);
    }
}
