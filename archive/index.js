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
import { Utils } from './utils';

import { Map } from './helper/map';
import { CollisionChecker } from './helper/collision-checker';
import { Renderer } from './helper/renderer';
import { Collection } from './helper/collection';

import { UIElement } from './ui/element';
import { UIContainer } from './ui/container';
import { UISection } from './ui/section';
import { UIButton } from './ui/button';

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

window.UIContainer = UIContainer;
window.UIButton = UIButton;
window.UIElement = UIElement;
window.UISection = UISection;

window.io = io;
window.KEYS = keys;
window.loader = loader;
window.mouse = mouse;
window.ticker = ticker;
window.events = new EventEmitter();
window.utils = new Utils();

window.Map = Map;
window.CollisionChecker = CollisionChecker;
window.Renderer = Renderer;
window.Collection = Collection;
