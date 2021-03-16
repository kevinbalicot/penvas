import Primitives from "../geometry/primitives";
import Matrix4 from "../geometry/matrix4";

const VERTEX_SHADER_SCRIPT = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec4 aVertexTexture;
    
    uniform mat4 uWorldViewMatrix;
    uniform mat4 uTextureMatrix;

    varying vec4 vColor;
    varying vec2 vVertexTexture;

    void main() {
        gl_Position = uWorldViewMatrix * aVertexPosition;
        vColor = aVertexColor;
        vVertexTexture = (uTextureMatrix * aVertexTexture).xy;
    }
`;

const FRAGMENT_SHADER_SCRIPT = `
    precision mediump float;
    
    varying vec4 vColor;
    varying vec2 vVertexTexture;
    
    uniform sampler2D uSampler;

    void main() {
       	gl_FragColor = texture2D(uSampler, vVertexTexture) * vColor;
    }
`;

export default class Drawer2DWebgl {
    constructor(gl, width, height) {
        this.gl = gl;
        this.width = width;
        this.height = height;

        const program = this.initProgram(VERTEX_SHADER_SCRIPT, FRAGMENT_SHADER_SCRIPT);
        this.gl.useProgram(program);

        // Transparence
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.clear();

        this.context = null;
        this.contexts = [];
        this.textures = {};
        this.initContext();
    }

    resizeCanvasToDisplaySize(multiplier = 1) {
        const width  = this.gl.canvas.clientWidth  * multiplier | 0;
        const height = this.gl.canvas.clientHeight * multiplier | 0;

        if (this.gl.canvas.width !== width ||  this.gl.canvas.height !== height) {
            this.gl.canvas.width  = width;
            this.gl.canvas.height = height;

            return true;
        }

        return false;
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log('createProgram', this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
    }

    initProgram(vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        return this.createProgram(vertexShader, fragmentShader);
    }

    initContext() {
        const w = this.gl.canvas.clientWidth || this.gl.canvas.width;
        const h = this.gl.canvas.clientHeight || this.gl.canvas.height;
        //this.perspective(10, w / h, 1, 2000);

        this.projection(this.gl.canvas.clientWidth || this.gl.canvas.width, this.gl.canvas.clientHeight || this.gl.canvas.height, 1000);

        //this.context = Matrix4.makeZToWMatrix(0.3);
        //this.context = Matrix4.project(this.context, this.gl.canvas.clientWidth || this.gl.canvas.width, this.gl.canvas.clientHeight || this.gl.canvas.height, 400);
    }

    save() {
        this.contexts.push(Matrix4.clone(this.context));

        return this;
    }

    restore() {
        this.context = this.contexts.pop();

        if (!this.context) {
            this.initContext();
        }

        return this;
    }

    setAttributeValue(attributeName, values, size, type = this.gl.FLOAT, normalize = false, stride = 0, offset = 0) {
        const program = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
        const attribute = this.gl.getAttribLocation(program, attributeName);

        if (attribute === -1) {
            throw new Error(`Attribute named "${attributeName}" not found!`);
        }

        const buffer = this.gl.createBuffer();

        this.gl.enableVertexAttribArray(attribute);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, values, this.gl.STATIC_DRAW);

        this.gl.vertexAttribPointer(attribute, size, type, normalize, stride, offset);
    }

    setUniformValue(uniformValue, values) {
        const program = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
        const uniform = this.gl.getUniformLocation(program, uniformValue);

        if (uniform === -1) {
            throw new Error(`Uniform named "${uniformValue}" not found!`);
        }

        // A revoir
        if (!Array.isArray(values) && typeof values === 'number' && Number.isInteger(values)) {
            this.gl.uniform1i(uniform, values);
        } else if (!Array.isArray(values) && typeof values === 'number' && !Number.isInteger(values)) {
            this.gl.uniform1f(uniform, values);
        } else if (values.length === 2 && typeof values[0] === 'number' && Number.isInteger(values[0])) {
            this.gl.uniform2fv(uniform, values);
        } else if (values.length === 2 && typeof values[0] === 'number' && !Number.isInteger(values[0])) {
            this.gl.uniform2iv(uniform, values);
        } else if (values.length === 3 && typeof values[0] === 'number' && Number.isInteger(values[0])) {
            this.gl.uniform3fv(uniform, values);
        } else if (values.length === 3 && typeof values[0] === 'number' && !Number.isInteger(values[0])) {
            this.gl.uniform3iv(uniform, values);
        } else if (values.length === 4 && typeof values[0] === 'number' && Number.isInteger(values[0])) {
            this.gl.uniform4fv(uniform, values);
        } else if (values.length === 4 && typeof values[0] === 'number' && !Number.isInteger(values[0])) {
            this.gl.uniform4iv(uniform, values);
        } else if (values.length === 9) {
            this.gl.uniformMatrix3fv(uniform, false, values);
        } else if (values.length === 16) {
            this.gl.uniformMatrix4fv(uniform, false, values);
        }
    }

    bindTexture(image) {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        if (image instanceof Image) {
            const isPowerOf2 = value => ((value & (value - 1)) === 0);

            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
            } else {
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            }
        } else {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        }

        return texture;
    }

    projection(width, height, deth) {
        this.context = Matrix4.projection(width, height, deth);

        return this;
    }

    perspective(fieldOfViewRadians, aspect, zNear, zFar) {
        this.context = Matrix4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

        return this;
    }

    translate(x, y, z) {
        this.context = Matrix4.translate(this.context, x, y, z);

        return this;
    }

    rotate(rect, deg, pivot = null) {
        const pivotX = null !== pivot ? pivot.x : rect.width / 2;
        const pivotY = null !== pivot ? pivot.y : rect.height / 2;

        this.translate(rect.x, rect.y, 0);
        this.translate(pivotX, pivotY, 0);

        this.rotateZ(deg);

        this.translate(-1 * pivotX, -1 * pivotY, 0);
        this.translate(-1 * rect.x, -1 * rect.y, 0);

        return this;
    }

    rotateX(deg, x = 0, y = 0, z = 0) {
        this.translate(x, y, z);
        this.context = Matrix4.xRotate(this.context, -1 * deg * Math.PI / 180);
        this.translate(-x, -y, -z);

        return this;
    }

    rotateY(deg, x = 0, y = 0, z = 0) {
        this.translate(x, y, z);
        this.context = Matrix4.yRotate(this.context, -1 * deg * Math.PI / 180);
        this.translate(-x, -y, -z);

        return this;
    }

    rotateZ(deg, x = 0, y = 0, z = 0) {
        this.translate(x, y, z);
        this.context = Matrix4.zRotate(this.context, -1 * deg * Math.PI / 180);
        this.translate(-x, -y, -z);

        return this;
    }

    /**
     * Horizontal flip
     * @param {Object} rect
     */
    horizontalFlip(rect) {
        this.translate(rect.x + rect.width / 2, 0, 0);
        this.scale(-1, 1, 0);
        this.translate(-1 * (rect.x + rect.width / 2), 0, 0);

        return this;
    }

    /**
     * Vertical flip
     * @param {Object} rect
     */
    verticalFlip(rect) {
        this.translate(0, rect.y + rect.height / 2, 0);
        this.scale(1, -1, 0);
        this.translate(0, -1 * (rect.y + rect.height / 2), 0);

        return this;
    }

    scale(x, y, z) {
        this.context = Matrix4.scale(this.context, x, y, z);

        return this;
    }

    drawTriangle(x, y, z, width, height, colors = null, image = null, options = {}) {
        const triangle = Primitives.triangle();
        if (!colors) {
            colors = Array(9).fill(255);
        } else if (colors.length === 3) {
            colors = [...colors, ...colors, ...colors, ...colors, ...colors, ...colors];
        }

        let texture;
        if (image) {
            texture = this.bindTexture(image);
        } else {
            texture = this.bindTexture(new Uint8Array([255, 255, 255, 255]));
        }

        const { tx = 0, ty = 0, sx = 1, sy = 1 } = options.texture || {};
        let textureMatrix = Matrix4.translation(tx, ty, 0);
        textureMatrix = Matrix4.scale(textureMatrix, sx, sy, 1);

        this.save();
        this.translate(x, y, z);
        this.scale(width, height, 1);

        this.setUniformValue('uWorldViewMatrix', this.context);
        this.setUniformValue('uTextureMatrix', textureMatrix);
        this.setUniformValue('uSampler', 0);

        this.setAttributeValue('aVertexColor', new Uint8Array(colors), 3, this.gl.UNSIGNED_BYTE, true);
        this.setAttributeValue('aVertexPosition', new Float32Array(triangle.vertices), 3);
        this.setAttributeValue('aVertexTexture', new Float32Array(triangle.vertices), 3);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, triangle.size);

        this.gl.deleteTexture(texture);

        this.restore();
    }

    drawRectangle(x, y, z, width, height, colors = null, image = null, options = {}) {
        const square = Primitives.square();
        if (!colors) {
            colors = Array(18).fill(255);
        } else if (colors.length === 3) {
            colors = [...colors, ...colors, ...colors, ...colors, ...colors, ...colors];
        }

        let texture;
        if (image) {
            texture = this.bindTexture(image);
        } else {
            texture = this.bindTexture(new Uint8Array([255, 255, 255, 255]));
        }

        const { tx = 0, ty = 0, sx = 1, sy = 1 } = options.texture || {};
        let textureMatrix = Matrix4.translation(tx, ty, 0);
        textureMatrix = Matrix4.scale(textureMatrix, sx, sy, 1);

        this.save();
        this.translate(x, y, z);
        this.scale(width, height, 1);

        this.setUniformValue('uWorldViewMatrix', this.context);
        this.setUniformValue('uTextureMatrix', textureMatrix);
        this.setUniformValue('uSampler', 0);

        this.setAttributeValue('aVertexColor', new Uint8Array(colors), 3, this.gl.UNSIGNED_BYTE, true);
        this.setAttributeValue('aVertexPosition', new Float32Array(square.vertices), 3);
        this.setAttributeValue('aVertexTexture', new Float32Array(square.vertices), 3);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, square.size);

        this.gl.deleteTexture(texture);
        this.restore();
    }

    drawCube(x, y, z, width, height, depth, colors = null, image = null, options = {}) {
        const cube = Primitives.cube();
        if (!colors) {
            colors = Array(108).fill(255);
        }

        const textureCoor = [
            ...cube.vertices.slice(0, 18),
            ...cube.vertices.slice(0, 18),
            ...cube.vertices.slice(0, 18),
            ...cube.vertices.slice(0, 18),
            ...cube.vertices.slice(0, 18),
            ...cube.vertices.slice(0, 18),
        ];

        let texture;
        if (image) {
            texture = this.bindTexture(image);
        } else {
            texture = this.bindTexture(new Uint8Array([255, 255, 255, 255]));
        }

        const { tx = 0, ty = 0, sx = 1, sy = 1 } = options.texture || {};
        let textureMatrix = Matrix4.translation(tx, ty, 0);
        textureMatrix = Matrix4.scale(textureMatrix, sx, sy, 1);

        this.save();
        this.translate(x, y, z);
        this.scale(width, height, depth);

        this.setUniformValue('uWorldViewMatrix', this.context);
        this.setUniformValue('uTextureMatrix', textureMatrix);
        this.setUniformValue('uSampler', 0);

        this.setAttributeValue('aVertexColor', new Uint8Array(colors), 3, this.gl.UNSIGNED_BYTE, true);
        this.setAttributeValue('aVertexPosition', new Float32Array(cube.vertices), 3);
        this.setAttributeValue('aVertexTexture', new Float32Array(textureCoor), 3);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, cube.size);

        this.gl.deleteTexture(texture);
        this.restore();
    }

    drawImage(image, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstZ, dstWidth, dstHeight) {
        const square = Primitives.square();
        const colors = Array(18).fill(255);

        if (dstX === undefined) {
            dstX = srcX;
            srcX = 0;
        }

        if (dstY === undefined) {
            dstY = srcY;
            srcY = 0;
        }

        if (dstZ === undefined) {
            dstZ = 0;
        }

        if (srcWidth === undefined) {
            srcWidth = image.width;
        }

        if (srcHeight === undefined) {
            srcHeight = image.height;
        }

        if (dstWidth === undefined) {
            dstWidth = srcWidth;
            srcWidth = image.width;
        }

        if (dstHeight === undefined) {
            dstHeight = srcHeight;
            srcHeight = image.height;
        }

        const texture = this.bindTexture(image);

        let textureMatrix = Matrix4.translation(srcX / image.width, srcY / image.height, 0);
        textureMatrix = Matrix4.scale(textureMatrix, srcWidth / image.width, srcHeight / image.height, 1);

        this.save();
        this.translate(dstX, dstY, dstZ);
        this.scale(dstWidth, dstHeight, 1);

        this.setUniformValue('uWorldViewMatrix', this.context);
        this.setUniformValue('uTextureMatrix', textureMatrix);
        this.setUniformValue('uSampler', 0);

        this.setAttributeValue('aVertexColor', new Uint8Array(colors), 3, this.gl.UNSIGNED_BYTE, true);
        this.setAttributeValue('aVertexPosition', new Float32Array(square.vertices), 3);
        this.setAttributeValue('aVertexTexture', new Float32Array(square.vertices), 3);


        this.gl.drawArrays(this.gl.TRIANGLES, 0, square.size);

        this.gl.deleteTexture(texture);
        this.restore();
    }

    clear() {
        this.resizeCanvasToDisplaySize();

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}
