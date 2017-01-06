/**
 * @type {Object}
 * @property {number} KEYS.SPACE
 * @property {number} KEYS.LEFT
 * @property {number} KEYS.UP
 * @property {number} KEYS.RIGHT
 * @property {number} KEYS.DOWN
 * @example
 * if (true === io[KEYS.SPACE]) {
 *     this.player.jump();
 * }
 *
 * if (!!io[39]) {
 *    this.player.walkRight();
 * }
 */
export const KEYS = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
}

/**
 * @type {Object}
 * @property {string} MOUSE.LEFT_CLICK
 * @property {string} MOUSE.RIGHT_CLICK
 * @property {string} MOUSE.MIDDLE_CLICK
 * @example
 * if (io[MOUSE.LEFT_CLICK]) {
 *     this.player.attack();
 * }
 */
export const MOUSE = {
    LEFT_CLICK: 'left_click',
    RIGHT_CLICK: 'right_click',
    MIDDLE_CLICK: 'middle_click'
}

/**
 * Array of Input
 * @type {Array<number>}
 */
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
