/**
 * PENVAS library
 * Inspirations :
 * https://github.com/RonenNess/SSCD.js
 * http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
 * https://savas.ca/nomad
 * https://github.com/qiao/ces.js
 *
 * https://gist.github.com/winduptoy/a1aa09c3499e09edbd33
 * https://jsfiddle.net/kevinbalicot/jwfen1tc/
 *
 * https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
 */

import { Drawer } from './drawer';
import { Canvas } from './canvas';
import { Component } from './component';
import { Entity } from './entity';
import { Environment } from './environment';
import { EventEmitter } from './event-emitter';
import { GameLoop } from './game-loop';
import { Layer } from './layer';
import { System } from './system';
import { Render } from './render';
import { Viewport } from './viewport';
import { Utils } from './utils';
import { TiledMap } from './tiled-map';

import { Loader } from './services/loader';

import { Vector } from './geometry/vector';
import { Rectangle } from './geometry/rectangle';
import { Point } from './geometry/point';

import { Body } from './components/body';
import { Sprite } from './components/sprite';
import { Collision } from './components/collision';
import { Gamepad } from './components/gamepad';
import { Keyboard } from './components/keyboard';
import { Motion } from './components/motion';
import { Physic } from './components/physic';
import { Rotate } from './components/rotate';
import { Flip } from './components/flip';
import { Tiles } from './components/tiles';

import { CollisionChecker } from './systems/collision-checker';
import { Movement } from './systems/movement';
import { Animation } from './systems/animation';
import { PhysicChecker } from './systems/physic-checker';
import { Inputs } from './systems/inputs';
import { GamepadInputs } from './systems/gamepad-inputs';

import { BoxRender } from './renders/box-render';
import { SpriteRender } from './renders/sprite-render';
import { RotationRender } from './renders/rotation-render';
import { FlipRender } from './renders/flip-render';
import { TilesRender } from './renders/tiles-render';

import { UIElement } from './ui/element';
import { UIContainer } from './ui/container';
import { UISection } from './ui/section';
import { UIButton } from './ui/button';
import { UITable } from './ui/table';
import { UIInput } from './ui/input';

import loader from './services/loader';
import KEYS from './services/keys';
import GAMEPAD from './services/gamepad';

Math.degree = function(radians) {
  return radians * 180 / Math.PI;
};

Math.radian = function(degrees) {
  return degrees * Math.PI / 180;
};

window.penvas = {
    Drawer,
    Canvas,
    Component,
    Entity,
    Environment,
    EventEmitter,
    GameLoop,
    Layer,
    System,
    Render,
    Viewport,
    TiledMap,

    services: {
        Loader
    },

    geometry: {
        Vector,
        Rectangle,
        Point
    },

    systems: {
        CollisionChecker,
        Movement,
        Animation,
        PhysicChecker,
        Inputs,
        GamepadInputs
    },

    components: {
        Body,
        Sprite,
        Collision,
        Gamepad,
        Keyboard,
        Motion,
        Physic,
        Rotate,
        Flip,
        Tiles
    },

    renders: {
        BoxRender,
        SpriteRender,
        RotationRender,
        FlipRender,
        TilesRender
    },

    ui: {
        UIElement,
        UIContainer,
        UISection,
        UIButton,
        UITable,
        UIInput
    },

    loader,
    utils: Utils,
    KEYS,
    GAMEPAD
};
