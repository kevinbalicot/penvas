export class UIElement {
    constructor(tag, text = null, id = null, classList = []) {
        this.tag = tag;
        this.id = id;
        this.text = text;
        this.classList = classList;
    }

    set tag(value) {
        this.element = document.createElement(value);
    }

    get tag() {
        return String(this.element.tagName).toLowerCase();
    }

    set id(value) {
        if (null !== value) {
            this.element.id = value;
        }
    }

    get id() {
        return this.element.id;
    }

    set text(value) {
        if (null !== value) {
            this.element.innerText = null;
            this.element.appendChild(document.createTextNode(value));
        }
    }

    get text() {
        return this.element.innerText;
    }

    set classList(values) {
        if (!Array.isArray(values)) {
            values = [values];
        }

        this.element.classList = values;
    }

    get classList() {
        return this.element.classList;
    }

    set styles(values) {
        for (let prop in values) {
            this.element.style[prop] = values[prop];
        }
    }

    get styles() {
        return this.element.style;
    }

    setAttribute(key, value) {
        this.element.setAttribute(key, value);
    }

    getAttribute(key) {
        return this.element.getAttribute(key);
    }

    removeAttribute(key) {
        return this.element.removeAttribute(key);
    }

    on(event, callback) {
        this.element.addEventListener(event, callback);
    }

    appendChild(elements) {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        elements.forEach(element => {
            if (!element instanceof UIElement) {
                throw new Error(`Parameter element has to be an instance of UIElement, it's an instance of ${typeof element} instead.`);
            }

            this.element.appendChild(element.element);
        });
    }

    clear() {
        this.element.innerHTML = null;
    }

    destroy() {
        if (this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
    }
}
