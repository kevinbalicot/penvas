# PENVAS

`penvas` is a light video game 2D framework

## Installation

```
$ npm install --save penvas
```

## Demo

```
cd node_modules/penvas && make demo
```

Go to `http://localhost:8080`

## How to use it

```javascript
<script type="text/javascript" src="node_modules/penvas/dist/penvas.js"></script>
<script type="application/javascript">
    var homeLayer = {
        create: function () {
            this.rect = new Model(this.width / 2, this.height / 2, 50, 100);
        },

        step: function (td) {
            this.rect.x += 2;
            if (this.rect.x > this.width) {
                this.rect.x = -this.rect.width;
            }
        },

        render: function () {
            this.clearLayer();

            this.ctx.save();
            this.ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            this.ctx.restore();
        }
    };

    var app = new Application();
    app.addLayer(homeLayer, 'home');
</script>
```
