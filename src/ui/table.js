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

    addToBody(items) {
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

    addToFooter(items) {
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
}
