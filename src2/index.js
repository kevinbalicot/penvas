import Matrix4 from "./geometry/matrix4";
import Point from "./geometry/point";
import Primitive from "./geometry/primitives";
import Vector2 from "./geometry/vector2";
import Vertex from "./geometry/vertex";
//import Mesh from "./geometry/mesh";

import Drawer2D from "./drawers/2d";
import Drawer2DWebgl from "./drawers/2d-webgl";
import DrawerNew2DWebgl from "./drawers/new-2d-webgl";

import Canvas from './canvas';

import Utils from "./utils";
import Loader from "./loader";
import EventEmitter from "./event-emitter";
import GameLoop from "./game-loop";

import Component from "./ecs/component";
import Entity from "./ecs/entity";
import EntityGroup from "./ecs/entity-group";
import Environment from "./ecs/environment";
import Render from "./ecs/render";
import System from "./ecs/system";

import components from './ecs/components';
import systems from './ecs/systems';
import renders from './ecs/renders';

import IO from './io/io';
import KEYS from './io/keys';
import GAMEPAD from './io/gamepad';

window.penvas = {
    geometry: {
        Matrix4,
        Point,
        Primitive,
        Vector2,
        Vertex,
    },

    ecs: {
        Component,
        Entity,
        EntityGroup,
        Environment,
        Render,
        System,

        components,
        systems,
        renders,
    },

    Drawer2D,
    Drawer2DWebgl,
    DrawerNew2DWebgl,
    Canvas,
    GameLoop,
    EventEmitter,

    utils: Utils,
    loader: new Loader(),

    KEYS,
    GAMEPAD,
    io: new IO,
};
