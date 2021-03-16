export default class Primitive {

    constructor(drawer, options) {
        this.drawer = drawer;

        this.vertex = options.vertex || [];
        this.texels = options.texels || [];
        this.normals = options.normals || [];
        this.colors = options.colors || Array(this.vertex).fill(1);
        this.indices = options.indices || [];
        this.texture = options.texture || null;
        this.textureScale = options.textureScale || 1;

        this.vBuffer = drawer.createBuffer(new Float32Array(this.vertex));
        this.cBuffer = drawer.createBuffer(new Float32Array(this.colors));
        this.tBuffer = drawer.createBuffer(new Float32Array(this.texels.map(t => t * this.textureScale)));
        this.nBuffer = drawer.createBuffer(new Float32Array(this.normals));
        this.iBuffer = drawer.createElementBuffer(new Uint16Array(this.indices));
    }

    static plan(drawer, options) {
        return new Primitive(drawer, Object.assign({
            vertex: [
                -1.0, -1.0,  0.0,
                1.0, -1.0,  0.0,
                1.0,  1.0,  0.0,
                -1.0,  1.0,  0.0,
            ],

            texels: [
                0.0,  0.0,
                2.0,  0.0,
                2.0,  2.0,
                0.0,  2.0,
            ],

            /*
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,
             */

            indices: [
                0,  1,  2,
                0,  2,  3,
            ],

            normals: [
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,
            ],

            colors: Array(12).fill(1),
        }, options));
    }

    static cube(drawer, options) {
        return new Primitive(drawer, Object.assign({
            vertex: [
                -1.0, -1.0,  1.0,
                1.0, -1.0,  1.0,
                1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,

                -1.0, -1.0, -1.0,
                -1.0,  1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0, -1.0, -1.0,

                -1.0,  1.0, -1.0,
                -1.0,  1.0,  1.0,
                1.0,  1.0,  1.0,
                1.0,  1.0, -1.0,

                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0,  1.0,
                -1.0, -1.0,  1.0,

                1.0, -1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0,  1.0,  1.0,
                1.0, -1.0,  1.0,

                -1.0, -1.0, -1.0,
                -1.0, -1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0,  1.0, -1.0,
            ],

            texels: [
                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,

                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,

                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,

                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,

                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,

                0.0,  0.0,
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,
            ],

            indices: [
                0,  1,  2,
                0,  2,  3,
                4,  5,  6,
                4,  6,  7,
                8,  9,  10,
                8,  10, 11,
                12, 13, 14,
                12, 14, 15,
                16, 17, 18,
                16, 18, 19,
                20, 21, 22,
                20, 22, 23,
            ],

            normals: [
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,

                0.0,  0.0, -1.0,
                0.0,  0.0, -1.0,
                0.0,  0.0, -1.0,
                0.0,  0.0, -1.0,

                0.0,  1.0,  0.0,
                0.0,  1.0,  0.0,
                0.0,  1.0,  0.0,
                0.0,  1.0,  0.0,

                0.0, -1.0,  0.0,
                0.0, -1.0,  0.0,
                0.0, -1.0,  0.0,
                0.0, -1.0,  0.0,

                1.0,  0.0,  0.0,
                1.0,  0.0,  0.0,
                1.0,  0.0,  0.0,
                1.0,  0.0,  0.0,

                -1.0,  0.0,  0.0,
                -1.0,  0.0,  0.0,
                -1.0,  0.0,  0.0,
                -1.0,  0.0,  0.0
            ],

            colors: Array(72).fill(1),
        }, options));
    }
}
