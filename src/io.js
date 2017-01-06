/** @type {Object} */
export const KEYS = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}

/** @type {Object} */
export const MOUSE = {
    LEFT_CLICK: 'left_click',
    RIGHT_CLICK: 'right_click',
    MIDDLE_CLICK: 'middle_click'
}

/** @type {Array<number>} */
export const io = [];

document.addEventListener('keydown', (e) => {
    io[e.keyCode] = true;
});

document.addEventListener('keyup', (e) => {
    io[e.keyCode] = false;
});

document.addEventListener('mousedown', () => {
    io[MOUSE.LEFT_CLICK] = true;
});

document.addEventListener('mouseup', () => {
    io[MOUSE.LEFT_CLICK] = false;
});

export default io;
