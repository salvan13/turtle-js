addEventListener("load", function() {

  //objects behaivor (called for every objects in the scene before collision detection)
  //dt = delta time (used for framerate independence) 
  var objBehaviorPre = function(dt) {
    //increase x-position based on x-speed
    this.x += this.sx * dt;
  };

  //collision handler (called everytime two object collides)
  //'a' and 'b' are the two objects, 'side' is the collision's side
  var collisionHandler = function(a, b, side) {
    if(a.id === 'player' && b.is('object')) {
      alert('boom!');
      b.destroy();
    }
  };

  //objects behaivor (called for every objects in the scene after collision detection)
  var objBehaviorPost = function(dt) {
    if(this.id == 'player') {
      if (Turtle.controls.isKeyPressed(Turtle.keyCodes.RIGHT)) {
        this.sx = 10;
      }
      if(Turtle.controls.isKeyPressed(Turtle.keyCodes.LEFT)) {
        this.sx = -10;
      }
    }
  };
  
  //initialize the game
  Turtle.init({
    container: '#game', //DOM element
    block: 64, //block size (64x64)
    height: 20, //game height in block
    width: 30, //game width in block
    collisionHandler: collisionHandler,
    objectBehavior: {pre: objBehaviorPre, post: objBehaviorPost}
  });
  
  //create the main scene
  var main = new Turtle.Scene('main');
  
  //create the player
  var player = new Turtle.Object('player', {
    x: 300,
    y:300
  });
  
  //create another object
  var obj1 = new Turtle.Object('object1', {
    type: ['object'],
    x: 700,
    y:300
  });
    
  //put the entities in the scene, the scene in the game, and run the scene
  main.addObject(player);
  main.addObject(obj1);
  Turtle.addScene(main);
  Turtle.runScene('main');

}, false);


