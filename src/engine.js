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

