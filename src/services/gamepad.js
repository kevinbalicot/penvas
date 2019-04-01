/**
 * GAMEPAD XBOX
 * BUTTONS
 * 0 => A
 * 1 => B
 * 2 => X
 * 3 => Y
 * 4 => L1
 * 5 => R1
 * 6 => Start
 * 7 => Select
 * 8 => Xbox
 * 9 => SL
 * 10 => SR
 *
 * AXES [-1, 1]
 * 0 => LX
 * 1 => LY
 * 2 => GL
 * 3 => RX
 * 4 => RY
 * 5 => GR
 * 6 => LEFT / RIGHT
 * 7 => UP / DOWN
 */

/**
 * @type {Object}
 * @property {number} GAMEPAD.A
 */
const GAMEPAD = {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    L1: 4,
    R1: 5,
    START: 6,
    SELECT: 7,
    HOME: 8,
    SL: 9,
    SR: 10,

    LX: 0, // LEFT X AXES
    LY: 1, // LEFT Y AXES
    LT: 2, // LEFT TRIGGER
    RX: 3, // RIGHT X AXES
    RY: 4, // RIGHT Y AXES
    RT: 5, // RIGHT TRIGGER
    LR: 6, // LEFT / RIGHT
    UD: 7  // UP / DOWN
}

export default GAMEPAD;
