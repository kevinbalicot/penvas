import { UIElement } from './element';

export class UITable extends UIElement {
    constructor(id = null, classList = []) {
        super('table', null, id, classList);

        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');
        this.tfooter = document.createElement('tfooter');

        this.appendChild([this.thead, this.tbody, this.tfooter]);
    }

    addToHeader(values) {
        if (!Array.isArray(values)) {
            values = [values];
        }

        const row = document.createElement('tr');

        let column;
        values.forEach(value => {
            column = document.createElement('th');

            if (value instanceof UIElement) {
                column.appendChild(value.element);
            } else {
                column.innerHTML = value;
            }

            row.appendChild(column);
        });

        this.thead.appendChild(row);
    }

    addToBody(values) {
        if (!Array.isArray(values)) {
            values = [values];
        }

        const row = document.createElement('tr');

        let column;
        values.forEach(value => {
            column = document.createElement('td');

            if (value instanceof UIElement) {
                column.appendChild(value.element);
            } else {
                column.innerHTML = value;
            }

            row.appendChild(column);
        });

        this.tbody.appendChild(row);
    }

    addToFooter(values) {
        if (!Array.isArray(values)) {
            values = [values];
        }

        const row = document.createElement('tr');

        let column;
        values.forEach(value => {
            column = document.createElement('td');

            if (value instanceof UIElement) {
                column.appendChild(value.element);
            } else {
                column.innerHTML = value;
            }

            row.appendChild(column);
        });

        this.tfooter.appendChild(row);
    }

    clearHeader() {
        this.thead.innerHTML = null;
    }

    clearBody() {
        this.tbody.innerHTML = null;
    }

    clearFooter() {
        this.tfooter.innerHTML = null;
    }

    clear() {
        this.clearHeader();
        this.clearBody();
        this.clearFooter();
    }
}
