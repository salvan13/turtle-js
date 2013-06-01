window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame || 
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();


var Turtle = (function(win, doc) {

  "use strict";

  var params, block, height, width, container, canvas, ctx, scaleFactor = 1, scenes = [], buffer, bufferCtx, time = 0, scene, spritesheet, collisionHandler, paused;

  var init = function(p) {
    params = p;
    block = p.block || 16;
    spritesheet = new Image();
    spritesheet.src = p.spritesheet || './assets/sprites.png';
    collisionHandler = p.collisionHandler || function(){};
    height = p.height * block;
    width = p.width * block;
    container = doc.querySelector(p.container);
    canvas = document.createElement("canvas");
    container.appendChild(canvas);
    ctx = canvas.getContext("2d");

    initResizer();
    updateScale();
    loop();

  };

  var loop = function() {
    if(!paused) {
      var now = new Date().getTime(),
      dt = (now - time)/100; //delta time
      time = now;
      update(dt);
      draw(dt);
    }
    win.requestAnimFrame(loop);
  };

  var update = function(dt) {
    if(!scene) {
      return;
    }
    if(dt > 0.33) {
      dt = 0.33;
    }

    var x, obj;

    //remove inactive objects
    var arr = [];
    for(x = 0; x < scene.objects.length; x++) {
      obj = scene.objects[x];
      if(obj.active) {
        arr.push(obj);
      }
    }
    scene.objects = arr;

    //Behavior pre collisions
    for(x = 0; x < scene.objects.length; x++) {
      obj = scene.objects[x];
      if(params.objectBehavior && params.objectBehavior.pre) {
        params.objectBehavior.pre.apply(obj, [dt]);
      }
    }

    detectCollisions();

    //Behavior post collisions
    for(x = 0; x < scene.objects.length; x++) {
      obj = scene.objects[x];
      if(params.objectBehavior && params.objectBehavior.post) {
        params.objectBehavior.post.apply(obj, [dt]);
      }
    }

    if(scene.update) {
        scene.update.apply(scene, [dt]);
    }

  };

  var detectCollisions = function() {

    for(var i = 0; i < scene.objects.length; i++) {
      var a = scene.objects[i];
      for(var j = 0; j < scene.objects.length; j++) {
        var b = scene.objects[j];
        if(a.id != b.id) {

          var wq = a.w / 4;
          var hq = a.h / 4;
          var wh = a.w / 2;
          var hh = a.h / 2;

          var sides = {
            top: {x: a.x + wq, y: a.y, w: wh, h: hh},
            bottom: {x: a.x + wq, y: a.y + hh, w: wh, h: hh},
            left: {x: a.x, y: a.y + hq, w: wh, h: hh},
            right: {x: a.x + wh, y: a.y + hq, w: wh, h: hh}
          };

          for (var s in sides) {
            if(coll(sides[s], b)) {
              collisionHandler(a, b, s);
              break;
            }
          }

        }
      }
    }

  };

  var coll = function(a, b) {
    return a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y;
  };

  var draw = function(dt) {
    if(!scene) {
      return;
    }

    var cached = renderToCanvas(function (ctx) {
      if(scene.draw) {
        scene.draw.apply(scene, [ctx, dt]);
      }
      for(var i = 0; i < scene.objects.length; i++) {
        var obj = scene.objects[i];
        obj.draw(ctx, dt);
      }
    });
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(scene.center) {
      ctx.drawImage(cached, 
        Math.min(Math.max(0, scene.center.getX()), width - scene.center.getW()), 
        Math.min(Math.max(0, scene.center.getY()), height - scene.center.getH()),
        scene.center.getW(),
        scene.center.getH(),
      0, 0, canvas.width, canvas.height);
    } else {
      ctx.scale(scaleFactor, scaleFactor);
      ctx.drawImage(cached, 0, 0);
    }
    ctx.restore();
  };

  var renderToCanvas = function (renderFunction) {
    if(!buffer) {
      buffer = document.createElement('canvas');
      buffer.width = width;
      buffer.height = height;
      bufferCtx = buffer.getContext('2d');
    }
    bufferCtx.clearRect(0, 0, width, height);
    renderFunction(bufferCtx);
    return buffer;
  };


  var initResizer = function() {
    win.addEventListener('resize', function(e) {
      updateScale();
    }, false);
  };

  var updateScale = function() {
    scaleFactor = Math.min(win.innerWidth/width, win.innerHeight/height);
    var w = parseInt(width * scaleFactor, 10);
    var h = parseInt(height * scaleFactor, 10);
    canvas.width = w;
    canvas.height = h;
    container.style.width = w + 'px';
    container.style.height = h + 'px';
  };

  var addScene = function(s) {
    for(var i = 0; i < scenes.length; i++) {
      if(scenes[i].id == s.id) {
        scenes[i] = s;
        return;
      }
    }
    scenes.push(s);
  };

  var runScene = function(id) {
    scene = getById(scenes, id);
  };

  var getById = function(arr, id) {
    for(var x = 0; x < arr.length; x++) {
      if(arr[x].id == id) {
        return arr[x];
      }
    }
  };

  var getData = function() {
    return {
      width: width,
      height: height,
      block: block,
      spritesheet: spritesheet
    };
  };
  
  var pause = function(val) {
    paused = val;
  };

  return {
    init: init,
    addScene: addScene,
    runScene: runScene,
    getData: getData,
    pause: pause
  };

})(window, document);

Turtle.controls = (function(){

  var keyCodes = {
    ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32,
    TAB: 29, BACKSPACE: 28, Z: 90, X: 88, C: 67, P: 80, S: 83, A:65, D: 68, W: 87, Q: 81, E: 69, R: 82, F: 70
  };

  Turtle.keyCodes = keyCodes;

  var keypressed = {};

  window.addEventListener('keydown', function(e) {
    keypressed[e.keyCode] = true;
  }, false);

  window.addEventListener('keyup', function(e) {
    if(keypressed[e.keyCode]) {
      delete keypressed[e.keyCode];
    }
  }, false);

  var isKeyPressed = function(code) {
    return !!keypressed[code];
  };

  return {
    isKeyPressed: isKeyPressed
  };

})();

Turtle.Map = (function() {

  var fromStrings = function(arr, settings) {
    var res = [];
    for(var y = 0; y < arr.length; y++) {
      res[y] = [];
      for(var x = 0; x < arr[y].length; x++) {
        var f = settings[arr[y][x]];
        if(f) {
          res[y][x] = f(x, y);
        }
      }
    }
    return res;
  };

  return {
    fromStrings: fromStrings
  };

})();
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
  this.spritecnt = 0;
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
        sprite.nr = sprite.nr || 1;
        var spritex = sprite.x + Math.round(this.spritecnt) % sprite.nr * this.w;
        ctx.drawImage(Turtle.getData().spritesheet, spritex, sprite.y, this.w, this.h, x, y, this.w, this.h);
        this.spritecnt += dt * this.animspeed;
        if(this.spritecnt > 99) {
          this.spritecnt = 0;
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
Turtle.Scene = function(id, params) {
  params = params || {};
  this.id = id;
  this.objects = [];
  this.update = params.update;
  this.draw = params.draw;
};

Turtle.Scene.prototype = {

  addObject: function(obj) {
    if(!obj) {
      return;
    }
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      for(var x = 0; x < obj.length; x++) {
        this.addObject(obj[x]);
      }
    } else {
      this.objects.push(obj);
      this.objects.sort(function(a, b){
        return a.zIndex - b.zIndex;
      });
    }
  }

};

Turtle.sound = (function(){

  "use strict";

  var data = {};

  var add = function(id, sound) {
      data[id] = sound;
  };

  var play = function(id, loop) {
    if(data[id]) {
      var a = new Audio(data[id]);
      a.loop = loop || false;
      a.play();
    }
  };

  return {
    add: add,
    play: play
  };

})();
