/** @type {Object} */
export const KEYS = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}

/** @type {Object} */
export const CLICK = {
    LEFT: 'left_click',
    RIGHT: 'right_click',
    MIDDLE: 'middle_click'
}

/** @type {Array<number>} */
export const keyboard = [];

document.addEventListener('keydown', (e) => {
    keyboard[e.keyCode] = true;
});

document.addEventListener('keyup', (e) => {
    keyboard[e.keyCode] = false;
});

document.addEventListener('mousedown', () => {
    keyboard[CLICK.LEFT] = true;
});

document.addEventListener('mouseup', () => {
    keyboard[CLICK.LEFT] = false;
});

export default keyboard;
