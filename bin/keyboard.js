'use strict';

export const KEY_UP = 38;
export const KEY_DOWN = 40;
export const KEY_LEFT = 37;
export const KEY_RIGHT = 39;
export const KEY_SPACE = 32;
export const KEY_B = 66;
export const KEY_N = 78;
export const LEFT_CLICK = 'left_click';

export let keyboard = [];
keyboard[KEY_UP] = false;
keyboard[KEY_DOWN] = false;
keyboard[KEY_LEFT] = false;
keyboard[KEY_RIGHT] = false;
keyboard[KEY_SPACE] = false;
keyboard[KEY_B] = false;
keyboard[KEY_N] = false;
keyboard[LEFT_CLICK] = false;

document.addEventListener('keydown', (e) => {
    //e.preventDefault();
    keyboard[e.keyCode] = true;
});

document.addEventListener('keyup', (e) => {
    //e.preventDefault();
    keyboard[e.keyCode] = false;
});

document.addEventListener('mousedown', () => {
    keyboard[LEFT_CLICK] = true;
});

document.addEventListener('mouseup', () => {
    keyboard[LEFT_CLICK] = false;
});

export default keyboard;
