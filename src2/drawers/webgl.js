import Matrix4 from "../geometry/matrix4";

const VERTEX_SHADER_SCRIPT = `
    attribute vec3 a_position;
    attribute vec3 a_color;
    attribute vec3 a_normal;
    attribute vec2 a_texture_position;

    uniform mat4 u_view;
    uniform mat4 u_projection;
    uniform mat4 u_model;
    uniform mat4 u_normal;
    uniform mat4 u_texture;
    
    // sun
    uniform vec3 u_lightPosition;

    varying vec3 v_normal;
    varying vec3 v_vertex;
    varying vec4 v_view;
    varying vec3 v_color;
    varying vec2 v_texture_position;

    varying vec3 v_lightPosition;

    void main(void) {  
        gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);

        v_color = a_color;
        v_texture_position = (vec4(a_texture_position, 0, 1) * u_texture).xy;
        v_normal = (u_normal * vec4(a_normal, 1.0)).xyz;
        v_vertex = (u_model * vec4(a_position, 1.0)).xyz;
        //v_vertex = (u_view * u_model * vec4(a_position, 1.0)).xyz;
        v_view = vec4(u_view);
        v_lightPosition = u_lightPosition;
    }
`;

const FRAGMENT_SHADER_SCRIPT = `
    precision mediump float;
    
    uniform sampler2D u_sampler;
    
    uniform vec3 u_ambientLight;
    uniform vec3 u_diffuseLight;
    //uniform float u_shininess;
    
    varying vec3 v_color;
    varying vec2 v_texture_position;
    varying vec3 v_normal;
    varying vec3 v_vertex;
    varying vec4 v_view;

    varying vec3 v_lightPosition;
    
    void main(void) {
        mediump vec4 texelColor = texture2D(u_sampler, v_texture_position) * vec4(v_color, 1.0);
        
        vec3 normal = normalize(v_normal);
        vec3 lightPosition = normalize(v_lightPosition - v_vertex);

        // Dot product of the light direction and the orientation of a surface (normal)
        float dotLight = max(dot(lightPosition, normal), 0.0);
        
        vec3 diffuse = u_diffuseLight * texelColor.rgb * dotLight;
        vec3 ambient = u_ambientLight * texelColor.rgb;

        gl_FragColor = vec4(diffuse + ambient, texelColor.a);
    }
`;

export default class WebglDrawer {

    constructor(gl, width, height, options = {}) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.options = options;

        this.program = this.initProgram(VERTEX_SHADER_SCRIPT, FRAGMENT_SHADER_SCRIPT);
        this.gl.useProgram(this.program);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.enable(this.gl.CULL_FACE);

        // Transparence
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.uniforms = {
            projection: this.initUniform('u_projection'),
            view: this.initUniform('u_view'),
            object: this.initUniform('u_model'),
            normal: this.initUniform('u_normal'),
            texture: this.initUniform('u_texture'),
            sampler: this.initUniform('u_sampler'),

            ambientLight: this.initUniform('u_ambientLight'),
            diffuseLight: this.initUniform('u_diffuseLight'),
            lightWorldPosition: this.initUniform('u_lightPosition'),
            shininess: this.initUniform('u_shininess'),
        };

        this.attributes = {
            position: this.initAttribute('a_position'),
            texturePosition: this.initAttribute('a_texture_position'),
            color: this.initAttribute('a_color'),
            normal: this.initAttribute('a_normal'),
        };

        this.matrices = {
            projection: Matrix4.identity(),
            camera: Matrix4.identity(),
        };

        this.setUniformValue(this.uniforms.sampler, 0); // Lance un avertissement, vraiment utile ?

        this.ambientLight = options.ambientLight || [1, 1, 1];
        this.diffuseLight = options.diffuseLight || [1, 1, 1];
        this.lightWorldPosition = options.lightPosition || [5, 15, 5];
        //this.shininess = options.shininess || 5;

        this.setUniformValue(this.uniforms.camera, options.cameraPosition || [0, 0, 0]); // ??

        this.context = Matrix4.identity();
        this.contexts = [];
        //this.initContext();

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clearDepth(1);
        this.clear();
    }

    set ambientLight(vector) {
        this.setUniformValue(this.uniforms.ambientLight, vector);
    }

    set diffuseLight(vector) {
        this.setUniformValue(this.uniforms.diffuseLight, vector);
    }

    set ambientLightDirection(vector) {
        this.setUniformValue(this.uniforms.ambientLightDirection, vector);
    }

    set lightWorldPosition(vector) {
        this.setUniformValue(this.uniforms.lightWorldPosition, vector);
    }

    set lightColor(vector) {
        this.setUniformValue(this.uniforms.lightColor, vector);
    }

    set shininess(value) {
        this.setUniformValue(this.uniforms.shininess, value);
    }

    set lookAt(position) {
        this.options.lookAt = position;
    }

    get camera() {
        let mCamera = Matrix4.identity();
        mCamera = Matrix4.yRotate(mCamera, Math.radian(this.options.cameraRotationY || 0));
        mCamera = Matrix4.xRotate(mCamera, Math.radian(this.options.cameraRotationX || 0));
        mCamera = Matrix4.translate(mCamera, ...(this.options.cameraPosition || [0, 0, 0]));
        mCamera = Matrix4.lookAt(mCamera, this.options.lookAt || [0, 0, 0], [0, 1, 0]);

        return mCamera;
    }

    save() {
        this.contexts.push(Matrix4.clone(this.context));

        return this;
    }

    restore() {
        this.context = this.contexts.pop();

        if (!this.context) {
            this.context = Matrix4.identity();
        }

        return this;
    }

    translate(x, y, z = 0) {
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

    horizontalFlip(rect) {
        this.translate(rect.x + rect.width / 2, 0, 0);
        this.scale(-1, 1, 0);
        this.translate(-1 * (rect.x + rect.width / 2), 0, 0);

        return this;
    }

    verticalFlip(rect) {
        this.translate(0, rect.y + rect.height / 2, 0);
        this.scale(1, -1, 0);
        this.translate(0, -1 * (rect.y + rect.height / 2), 0);

        return this;
    }

    scale(x, y = null, z = null) {
        if (!y && !z) {
            y = z = x;
        }

        this.context = Matrix4.scale(this.context, x, y, z);

        return this;
    }

    resizeCanvasToDisplaySize(multiplier = 1) {
        const width  = this.gl.canvas.clientWidth  * multiplier | 0;
        const height = this.gl.canvas.clientHeight * multiplier | 0;

        if (this.gl.canvas.width !== width ||  this.gl.canvas.height !== height) {
            this.gl.canvas.width  = width;
            this.gl.canvas.height = height;
        }

        this.matrices.projection = Matrix4.perspective(
            Math.radian(this.options.fov || 45),
            width / height,
            this.options.near || 0.1,
            this.options.far || 1000.0
        );

        this.setUniformValue(this.uniforms.projection, this.matrices.projection);
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

    createBuffer(values, storage = this.gl.STATIC_DRAW) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, values, storage);

        return buffer;
    }

    createElementBuffer(values, storage = this.gl.STATIC_DRAW) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, values, storage);

        return buffer;
    }

    createTexture(image, niveau = 0, flipY = true, type = this.gl.TEXTURE_2D) {
        const isPowerOf2 = (value) => (value & (value - 1)) === 0;

        const texture = this.gl.createTexture();
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipY);
        this.gl.bindTexture(type, texture);

        if (image instanceof Image) {
            this.gl.texImage2D(type, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                this.gl.generateMipmap(type);
            } else {
                this.gl.texParameteri(type, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(type, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(type, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(type, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            }
        } else {
            this.gl.texImage2D(type, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        }

        this.gl.bindTexture(type, null);

        return texture;
    }

    initProgram(vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        return this.createProgram(vertexShader, fragmentShader);
    }

    initAttribute(attributeName) {
        const program = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
        const attribute = this.gl.getAttribLocation(program, attributeName);

        if (attribute === -1) {
            throw new Error(`Attribute named "${attributeName}" not found!`);
        }

        this.gl.enableVertexAttribArray(attribute);

        return attribute;
    }

    initUniform(uniformValue) {
        const program = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
        const uniform = this.gl.getUniformLocation(program, uniformValue);

        if (uniform === -1) {
            throw new Error(`Uniform named "${uniformValue}" not found!`);
        }

        return uniform;
    }

    setAttributeValue(attribute, buffer, size, type = this.gl.FLOAT, normalize = false, stride = 0, offset = 0) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(attribute, size, type, normalize, stride, offset);
    }

    setUniformValue(uniform, values, type = 'float') {
        if (!Array.isArray(values) && type === 'integer') {
            this.gl.uniform1i(uniform, values);
        } else if (!Array.isArray(values) && type === 'float') {
            console.log(values);
            this.gl.uniform1f(uniform, values);
        } else if (values.length === 2 && type === 'float') {
            this.gl.uniform2fv(uniform, values);
        } else if (values.length === 2 && type === 'integer') {
            this.gl.uniform2iv(uniform, values);
        } else if (values.length === 3 && type === 'float') {
            this.gl.uniform3fv(uniform, values);
        } else if (values.length === 3 && type === 'integer') {
            this.gl.uniform3iv(uniform, values);
        } else if (values.length === 4 && type === 'float') {
            this.gl.uniform4fv(uniform, values);
        } else if (values.length === 4 && type === 'integer') {
            this.gl.uniform4iv(uniform, values);
        } else if (values.length === 9) {
            this.gl.uniformMatrix3fv(uniform, false, values);
        } else if (values.length === 16) {
            this.gl.uniformMatrix4fv(uniform, false, values);
        }
    }

    setTexture(texture, textureId = this.gl.TEXTURE0, type = this.gl.TEXTURE_2D) {
        this.gl.activeTexture(textureId);
        this.gl.bindTexture(type, texture);
    }

    clearTexture(type = this.gl.TEXTURE_2D) {
        this.gl.bindTexture(type, null);
    }

    drawElementBuffer(buffer, size, mode = this.gl.TRIANGLES, type = this.gl.UNSIGNED_SHORT) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.drawElements(mode, size, type, 0);
    }

    drawMesh(mesh, type = this.gl.TRIANGLES) {
        this.setTexture(mesh.texture);

        const mModel = this.context;
        const mTexture = Matrix4.identity();
        const mView = Matrix4.inverse(this.camera);

        let mNormal = Matrix4.inverse(mModel);
        mNormal = Matrix4.transpose(mNormal);

        this.setAttributeValue(this.attributes.position, mesh.vBuffer, 3);
        this.setAttributeValue(this.attributes.texturePosition, mesh.tBuffer, 2);
        this.setAttributeValue(this.attributes.color, mesh.cBuffer, 3);
        this.setAttributeValue(this.attributes.normal, mesh.nBuffer, 3);

        this.setUniformValue(this.uniforms.view, mView);
        this.setUniformValue(this.uniforms.object, mModel);
        this.setUniformValue(this.uniforms.normal, mNormal);
        this.setUniformValue(this.uniforms.texture, mTexture);

        this.drawElementBuffer(mesh.iBuffer, mesh.indices.length, type);
    }

    clear() {
        this.resizeCanvasToDisplaySize();

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    flush() {
        this.clearTexture();
        this.gl.flush();
    }
}

/**
 * void main(void) {
        mediump vec4 texelColor = texture2D(u_sampler, v_texture_position) * vec4(v_color, 1.0);

        vec3 normal = normalize(v_normal);
        vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
        vec3 surfaceToViewDirection = normalize(v_surfaceToView);

        vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

        float lightDirection = dot(normal, surfaceToLightDirection);

        float specular = 0.0;
        if (lightDirection > 0.0) {
            specular = pow(dot(normal, halfVector), u_shininess);
        }

        vec3 vColor = v_ambientLight * v_color;

        gl_FragColor = vec4(texelColor.rgb * vColor * lightDirection, texelColor.a);
        gl_FragColor.rgb += specular;
    }
 */

/** SAVE
 const VERTEX_SHADER_SCRIPT = `
 attribute vec3 a_position;
 attribute vec3 a_color;
 attribute vec3 a_normal;
 attribute vec2 a_texture_position;

 uniform mat4 u_view;
 uniform mat4 u_projection;
 uniform mat4 u_object;
 uniform mat4 u_normal;
 uniform mat4 u_texture;
 uniform vec3 u_ambientLight;
 uniform vec3 u_ambientLightDirection;

 varying vec3 v_color;
 varying vec2 v_texture_position;
 varying vec3 v_light;

 void main(void) {
        gl_Position = u_projection * u_view * u_object * vec4(a_position, 1.0);

        highp vec4 transformedNormal = u_normal * vec4(a_normal, 1.0);

        v_color = a_color;
        v_texture_position = (vec4(a_texture_position, 0, 1) * u_texture).xy;

        v_light = u_ambientLight + max(dot(transformedNormal.xyz, u_ambientLightDirection), 0.0);
    }
 `;

 const FRAGMENT_SHADER_SCRIPT = `
 precision mediump float;

 uniform sampler2D u_sampler;
 uniform vec3 u_lightColor;

 varying vec3 v_color;
 varying vec2 v_texture_position;
 varying vec3 v_light;

 void main(void) {
        mediump vec4 texelColor = texture2D(u_sampler, v_texture_position) * vec4(v_color, 1.0);

        gl_FragColor = vec4(texelColor.rgb * u_lightColor.rgb * v_light, texelColor.a);
    }
 `;
**/
