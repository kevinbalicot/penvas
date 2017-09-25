const keys = require('./keys');

/**
 * Array of Input
 * @type {Array<number>}
 * @example
 * if (true === io[KEYS.SPACE]) {
 *     this.player.jump();
 * }
 *
 * if (!!io[39]) {
 *    this.player.walkRight();
 * }
 *
 * if (io[MOUSE.LEFT_CLICK]) {
 *     this.player.attack();
 * }
 */
const io = [];

document.addEventListener('keydown', (e) => {
    io[e.keyCode] = true;
});

document.addEventListener('keyup', (e) => {
    io[e.keyCode] = false;
});

document.addEventListener('mousedown', () => {
    io[keys.LEFT_CLICK] = true;
});

document.addEventListener('mouseup', () => {
    io[keys.LEFT_CLICK] = false;
});

module.exports = io;
