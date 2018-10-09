# PENVAS

`penvas` is a light video game 2D framework

## Installation

```
$ npm install --save penvas
```

## Demo

Go to `https://kevinbalicot.github.io/penvas/demo`

## How to use it

```javascript
<script type="text/javascript" src="node_modules/penvas/dist/penvas.js"></script>
<script type="application/javascript">
    var main = {
        create: function() {
            this.rect = new Model(this.width / 2, this.height / 2, 50, 100);
        },

        step: function(dt) {
            this.rect.x += 2;
            if (this.rect.x > this.width) {
                this.rect.x = -this.rect.width;
            }
        },

        render: function() {
            this.clearLayer();

            this.ctx.save();
            this.ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            this.ctx.restore();
        }
    };

    var app = new Application();

    app.addLayer('main', main);
    app.changeLayer('main');
</script>
```
## Documentation

[Documentation](https://kevinbalicot.github.io/penvas/)
