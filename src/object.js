Turtle.Object = function(id, p) {

  p = p || {};

  this.active = true;
  this.id = id;
  this.x = p.x || 0;
  this.y = p.y || 0;
  this.h = p.h || Turtle.getData().block;
  this.w = p.w || Turtle.getData().block;
  this.zIndex = p.zIndex || 0;
  this.sx = p.sx || 0;
  this.sy = p.sy || 0;
  this.type = p.type || ['default'];
  this.sprite = p.sprite || null;
  this.animspeed = p.animspeed || 0.7;
  this.objects = {};
  this.ondraw = p.ondraw;

};

Turtle.Object.prototype = {

  is: function(t) {

    for(var x = 0; x < this.type.length; x++) {
      if(t == this.type[x]) {
        return true;
      }
    }
    return false;

  },

  draw: function(ctx, dt) {

    var x = Math.round(this.x), y = Math.round(this.y);

    if(this.sprite) {
      var sprite = this.sprite.apply(this);
      if(sprite) {
        sprite.cnt = sprite.cnt || 0;
        sprite.nr = sprite.nr || 1;
        var spritex = sprite.x + Math.round(sprite.cnt) % sprite.nr * this.w;
        ctx.drawImage(Turtle.getData().spritesheet, spritex, sprite.y, this.w, this.h, x, y, this.w, this.h);
        sprite.cnt += dt * this.animspeed;
        if(sprite.cnt > 99) {
          sprite.cnt = 0;
        }
        return;
      }
    }

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(x, y, this.w, this.h);
    ctx.restore();

  },

  collect: function(obj) {
    if(!this.objects[obj]) {
      this.objects[obj] = 0;
    }
    this.objects[obj]++;
  },

  has: function(obj) {
    return this.objects[obj] || 0;
  },

  destroy: function() {
    this.active = false;
  }

};
