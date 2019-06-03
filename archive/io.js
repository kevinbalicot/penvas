import KEYS from './keys';

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
 * if (io[KEYS.LEFT_CLICK]) {
 *     this.player.attack();
 * }
 */
const io = {};

document.addEventListener('keydown', (e) => {
    io[e.which || e.keyCode] = true;
});

document.addEventListener('keyup', (e) => {
    io[e.which || e.keyCode] = false;
});

document.addEventListener('mousedown', () => {
    io[KEYS.LEFT_CLICK] = true;
});

document.addEventListener('mouseup', () => {
    io[KEYS.LEFT_CLICK] = false;
});

export default io;
