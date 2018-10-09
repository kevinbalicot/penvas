import { Application } from './application';
import { Container } from './container';
import { Drawer } from './drawer';
import { EventEmitter } from './event-emitter';
import { Model } from './model';
import { Sprite } from './sprite';
import { Tileset } from './tileset';
import { Ticker } from './ticker';
import { Viewport } from './viewport';
import { Particle } from './particle';
import { Scene } from './scene';

import { Map } from './helper/map';
import { CollisionChecker } from './helper/collision-checker';
import { Renderer } from './helper/renderer';
import { Collection } from './helper/collection';

import io from './io';
import keys from './keys';
import loader from './loader';
import mouse from './mouse';
import ticker from './ticker';

window.Application = Application;
window.Container = Container;
window.EventEmitter = EventEmitter;
window.Model = Model;
window.Sprite = Sprite;
window.Tileset = Tileset;
window.Drawer = Drawer;
window.Viewport = Viewport;
window.Particle = Particle;
window.Scene = Scene;

window.io = io;
window.KEYS = keys;
window.loader = loader;
window.mouse = mouse;
window.ticker = ticker;
window.events = new EventEmitter();

window.Map = Map;
window.CollisionChecker = CollisionChecker;
window.Renderer = Renderer;
window.Collection = Collection;
